import { Types } from '@gitbeaker/browser';
import { Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import { ProjectPath } from './ProjectPath';

type HighlightedPipelineSubHeaderProps = {
  project: Types.ProjectSchema;
};

/**
 * Subheader for a highlighted pipeline card
 *
 * @param {HighlightedPipelineSubHeaderProps} props
 * @return {JSX.Element}
 */
function HighlightedPipelineSubHeader(
  props: HighlightedPipelineSubHeaderProps,
): JSX.Element {
  return (
    <Grid2 container direction={'column'} spacing={0}>
      <Grid2>
        <Typography variant={'body2'}>
          {'Last update:' +
            new Date(
              Date.parse(props.project.last_activity_at),
            ).toLocaleString()}
        </Typography>
      </Grid2>
      <Grid2>
        <ProjectPath
          path={props.project.path_with_namespace}
          webUrl={props.project.web_url}
        />
      </Grid2>
    </Grid2>
  );
}

export { HighlightedPipelineSubHeader };
