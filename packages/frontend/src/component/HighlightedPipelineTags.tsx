import { Types } from '@gitbeaker/browser';
import { Chip, ChipProps } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import { useMemo } from 'react';
import { PipelineGuards } from '../guards/pipeline';
import { PipelineStatusCell } from './PipelineStatusCell';

type HighlightedPipelineTagsProps = {
  pipeline: Types.PipelineSchema | Types.PipelineExtendedSchema;
  duration: string | undefined;
};

/**
 * Renders a list of chips with information on the pipeline
 *
 * @param {HighlightedPipelineTagsProps} props
 * @return {JSX.Element}
 */
function HighlightedPipelineTags(
  props: HighlightedPipelineTagsProps,
): JSX.Element {
  const coverageColor: ChipProps['color'] = useMemo(() => {
    if (
      PipelineGuards.isPipelineExtended(props.pipeline) &&
      props.pipeline.coverage
    ) {
      const coverage = props.pipeline.coverage;
      const coverageAsFloat = Number.parseFloat(coverage);
      if (coverageAsFloat >= 80) {
        return 'success';
      } else if (coverageAsFloat >= 30) {
        return 'warning';
      } else {
        return 'error';
      }
    }

    return undefined;
  }, [props.pipeline]);

  return (
    <Grid2 container direction={'row'} spacing={1} alignItems={'center'}>
      <>
        <Grid2>
          <PipelineStatusCell
            alwaysOpen
            status={props.pipeline.status}
            webUrl={props.pipeline.web_url}
            branch={props.pipeline.ref}
          />
        </Grid2>
        {PipelineGuards.isPipelineExtended(props.pipeline) && (
          <Grid2>
            <Chip
              size={'medium'}
              label={props.pipeline.user.username}
              avatar={
                <img
                  style={{ borderRadius: '50%' }}
                  alt={''}
                  src={props.pipeline.user.avatar_url}
                />
              }
            />
          </Grid2>
        )}
        {props.pipeline.coverage && (
          <Grid2>
            <Chip
              size={'medium'}
              label={props.pipeline.coverage + '%'}
              color={coverageColor}
            />
          </Grid2>
        )}
        {props.duration && (
          <Grid2>
            <Chip size={'medium'} label={props.duration} />
          </Grid2>
        )}
      </>
    </Grid2>
  );
}

export { HighlightedPipelineTags };
