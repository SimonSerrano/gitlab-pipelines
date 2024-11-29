import { Types } from '@gitbeaker/browser/dist/types';
import { useState, useCallback, useEffect } from 'react';
import { PipelineGuards } from '../guards/pipeline';
import { useGitlabAPI } from '../provider/GitlabAPIProvider';
import {
  highlight,
  HighlightedPipeline,
  remove,
  useHighlightedPipeline,
} from '../provider/HighlightedPipelineProvider';
import { getDurationString } from '../utils/time';
import { HighLightedPipelineCard } from './HighlightedPipelineCard';

type HighLightedPipelineContainerProps = {
  highlighted: HighlightedPipeline;
};

/**
 * Manages the life cycle of a highlighted pipeline
 *
 * @param {HighLightedPipelineContainerProps} props
 * @return {JSX.Element}
 */
function HighlightedPipelineContainer(
  props: HighLightedPipelineContainerProps,
): JSX.Element {
  const { getProjectPipelineExtended, getPipelineJobs } = useGitlabAPI();
  const { dispatch } = useHighlightedPipeline();

  const [duration, setDuration] = useState<string | undefined>(undefined);
  const [queuedForRemoval, setQueuedForRemoval] = useState(false);

  // Gets the extended pipeline and its jobs
  const getPipelineAndJobs = useCallback(async (): Promise<
    | { pipeline: Types.PipelineExtendedSchema; jobs: Types.JobSchema[] }
    | undefined
  > => {
    const extended = await getProjectPipelineExtended(
      props.highlighted.project.id,
      props.highlighted.pipeline.id,
    );
    const jobs = await getPipelineJobs(
      props.highlighted.project.id,
      props.highlighted.pipeline.id,
    );
    return { pipeline: extended, jobs };
  }, [
    getPipelineJobs,
    getProjectPipelineExtended,
    props.highlighted.pipeline.id,
    props.highlighted.project.id,
  ]);

  // Sets the current duration if the pipeline is extended schema
  useEffect(() => {
    if (
      PipelineGuards.isPipelineExtended(props.highlighted.pipeline) &&
      props.highlighted.pipeline.duration
    ) {
      setDuration(getDurationString(props.highlighted.pipeline.duration));
    }
  }, [props.highlighted.pipeline, props.highlighted.pipeline.duration]);

  // If the pipeline is not extended schema, get the pipeline and its jobs
  useEffect(() => {
    if (!PipelineGuards.isPipelineExtended(props.highlighted.pipeline)) {
      getPipelineAndJobs()
        .then((info) => {
          if (info) {
            const { pipeline, jobs } = info;
            dispatch(
              highlight({
                ...props.highlighted,
                pipeline,
                jobs,
              }),
            );
          }
        })
        .catch((e) => console.error);
    }
  }, [
    dispatch,
    getPipelineAndJobs,
    props.highlighted,
    props.highlighted.pipeline,
  ]);

  // If the duration of the pipeline has changed, load the jobs again
  useEffect(() => {
    if (
      PipelineGuards.isPipelineExtended(props.highlighted.pipeline) &&
      duration &&
      props.highlighted.pipeline.duration &&
      getDurationString(props.highlighted.pipeline.duration) !== duration
    ) {
      getPipelineAndJobs()
        .then((info) => {
          if (info) {
            const { pipeline, jobs } = info;
            dispatch(
              highlight({
                ...props.highlighted,
                pipeline,
                jobs,
              }),
            );
          }
        })
        .catch((e) => console.error);
    }
  }, [dispatch, duration, getPipelineAndJobs, props.highlighted]);

  // Set an interval to refresh the projects silently every 10 seconds
  useEffect(() => {
    let timeout: NodeJS.Timer;
    if (PipelineGuards.isPipelineExtended(props.highlighted.pipeline)) {
      timeout = setInterval(() => {
        getPipelineAndJobs()
          .then((info) => {
            if (info) {
              const { pipeline, jobs } = info;
              dispatch(
                highlight({
                  ...props.highlighted,
                  pipeline,
                  jobs,
                }),
              );
            }
          })
          .catch(console.error);
      }, 10 * 1000);
    }

    return () => {
      if (timeout) {
        clearInterval(timeout);
      }
    };
  }, [dispatch, getPipelineAndJobs, props.highlighted]);

  // Remove the highlighted pipeline after 15 minutes if the status is sucess
  useEffect(() => {
    if (props.highlighted.pipeline.status === 'success' && !queuedForRemoval) {
      setTimeout(() => {
        dispatch(remove(props.highlighted));
      }, 15 * 60 * 1000);
      setQueuedForRemoval(true);
    }
  }, [dispatch, props.highlighted, queuedForRemoval]);

  return <HighLightedPipelineCard {...props} duration={duration} />;
}

export { HighlightedPipelineContainer };
