import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import { HighlightedPipeline } from '../provider/HighlightedPipelineProvider';

import { HighlightedPipelineSubHeader } from './HighlightedPipelineSubHeader';
import { JobsTable } from './JobsTable';
import { HighlightedPipelineTags } from './HighlightedPipelineTags';

type HighLightedPipelineCardProps = {
  highlighted: HighlightedPipeline;
  duration?: string;
};

/**
 * Component that renders a pipeline card with the project, pipeline and jobs
 *
 * @param {HighLightedPipelineCardProps} props
 * @return {JSX.Element}
 */
function HighLightedPipelineCard(
  props: HighLightedPipelineCardProps,
): JSX.Element {
  return (
    <Grid2 sx={{ minWidth: '40vw' }}>
      <Card>
        <CardHeader
          title={
            <Typography variant={'h5'} color={'primary'}>
              {props.highlighted.project.name}
            </Typography>
          }
          titleTypographyProps={{ variant: 'h6', noWrap: true }}
          sx={{ padding: '1rem', paddingBottom: 0 }}
          subheader={
            <HighlightedPipelineSubHeader project={props.highlighted.project} />
          }
        />
        <CardContent
          sx={{ padding: '0.5rem!important', paddingTop: '0!important' }}
        >
          <Grid2 container direction={'column'} spacing={1}>
            <Grid2>
              <HighlightedPipelineTags
                pipeline={props.highlighted.pipeline}
                duration={props.duration}
              />
            </Grid2>
            <Grid2>
              <JobsTable jobs={props.highlighted.jobs} />
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>
    </Grid2>
  );
}

export { HighLightedPipelineCard };
