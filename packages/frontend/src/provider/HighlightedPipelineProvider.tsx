import {
  createContext,
  PropsWithChildren,
  Reducer,
  useContext,
  useReducer,
} from 'react';
import { Types } from '@gitbeaker/browser';

type HighlightedPipeline = {
  project: Types.ProjectSchema;
  pipeline: Types.PipelineSchema | Types.PipelineExtendedSchema;
  jobs?: Types.JobSchema[];
};

type HighlightAction = {
  type: 'highlight';
  highlight: HighlightedPipeline;
};

type RemoveHighlightAction = {
  type: 'remove';
  toRemove: HighlightedPipeline;
};

type Action = HighlightAction | RemoveHighlightAction;

type HighlightedPipelineAPI = {
  highlighted: HighlightedPipeline[];
  dispatch: (action: Action) => void;
};

/**
 * Highlights a project and a pipeline
 *
 * @param {HighlightedPipeline} that
 * @return {HighlightAction}
 */
function highlight(that: HighlightedPipeline): HighlightAction {
  return {
    type: 'highlight',
    highlight: that,
  };
}

/**
 * Removes an highlighted project from the highlighted pipelines
 *
 * @param {HighlightedPipeline} that
 * @return {RemoveHighlightAction}
 */
function remove(that: HighlightedPipeline): RemoveHighlightAction {
  return {
    type: 'remove',
    toRemove: that,
  };
}

const HighlightedPipelineContext = createContext<HighlightedPipelineAPI>({
  highlighted: [],
  dispatch(value) {
    throw new Error('Not yet implemented');
  },
});

/**
 * Adds a new highlighted pipeline to the existing pipelines and sorts them
 *
 * @param {{highlighted: HighlightedPipeline[]}} prevState
 * @param {HighlightedPipeline} newHighlight
 * @return {{highlighted: HighlightedPipeline[]}}
 */
function addToHighlightedPipelines(
  prevState: { highlighted: HighlightedPipeline[] },
  newHighlight: HighlightedPipeline,
): { highlighted: HighlightedPipeline[] } {
  return {
    ...prevState,
    highlighted: [...prevState.highlighted, newHighlight].sort((a, b) => {
      return (
        Date.parse(b.pipeline.created_at) - Date.parse(a.pipeline.created_at)
      );
    }),
  };
}

/**
 * Merges to highlighted pipelines. The pipeline is overriden by the new values for duration, user...etc. The jobs are by default those from the
 * new highlight otherwise, the existing ones are kept to avoid reloading the interface
 *
 * @param {HighlightedPipeline} existing
 * @param {HighlightedPipeline} newHighlight
 * @return {HighlightedPipeline}
 */
function mergeWithExistingPipeline(
  existing: HighlightedPipeline,
  newHighlight: HighlightedPipeline,
): HighlightedPipeline {
  return {
    project: newHighlight.project,
    pipeline: {
      ...existing.pipeline,
      ...newHighlight.pipeline,
    },
    jobs: newHighlight.jobs || existing.jobs,
  };
}

/**
 * Provides the highlighted pipeline state and dispatch
 *
 * @param {PropsWithChildren} props
 * @return {JSX.Element}
 */
function HighlightedPipelineProvider(props: PropsWithChildren): JSX.Element {
  const reducer: Reducer<{ highlighted: HighlightedPipeline[] }, Action> = (
    prevState,
    action,
  ) => {
    if (action.type === 'highlight') {
      const newHighlight = action.highlight;
      const foundIndex = prevState.highlighted.findIndex(
        (highlighted) => highlighted.project.id === newHighlight.project.id,
      );
      if (foundIndex === -1) {
        return addToHighlightedPipelines(prevState, newHighlight);
      } else {
        const highlightedCopy = [...prevState.highlighted];
        if (
          highlightedCopy[foundIndex].pipeline.id === newHighlight.pipeline.id
        ) {
          highlightedCopy[foundIndex] = mergeWithExistingPipeline(
            highlightedCopy[foundIndex],
            newHighlight,
          );
        } else {
          highlightedCopy[foundIndex] = newHighlight;
        }

        return {
          ...prevState,
          highlighted: highlightedCopy.sort((a, b) => {
            return (
              Date.parse(b.pipeline.created_at) -
              Date.parse(a.pipeline.created_at)
            );
          }),
        };
      }
    } else if (action.type === 'remove') {
      const toRemove = action.toRemove;
      const foundIndex = prevState.highlighted.findIndex(
        (highlighted) => highlighted.project.id === toRemove.project.id,
      );
      if (foundIndex === -1) {
        return prevState;
      } else {
        const highlightedCopy = [
          ...prevState.highlighted.filter((_, index) => index !== foundIndex),
        ];

        return {
          ...prevState,
          highlighted: highlightedCopy.sort((a, b) => {
            return (
              Date.parse(b.pipeline.created_at) -
              Date.parse(a.pipeline.created_at)
            );
          }),
        };
      }
    }

    return prevState;
  };

  const [state, dispatch] = useReducer<
    Reducer<{ highlighted: HighlightedPipeline[] }, Action>
  >(reducer, { highlighted: [] });

  return (
    <HighlightedPipelineContext.Provider
      value={{ highlighted: state.highlighted, dispatch }}
    >
      {props.children}
    </HighlightedPipelineContext.Provider>
  );
}

/**
 * Hook to use the highlighted pipeline context
 *
 * @return {HighlightedPipelineAPI}
 */
function useHighlightedPipeline(): HighlightedPipelineAPI {
  return useContext(HighlightedPipelineContext);
}

export {
  HighlightedPipelineProvider,
  useHighlightedPipeline,
  highlight,
  remove,
};
export type { HighlightedPipeline };
