import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { GitlabPipelineContainer } from '../component/GitlabPipelineContainer';
import { MostRecentProjects } from '../component/MostRecentProjects';
import { useHighlightedPipeline } from '../provider/HighlightedPipelineProvider';
import { fullHeightSX } from '../style/layout';

/**
 * Layout for the pipeline dashboard
 *
 * @return {JSX.Element}
 */
function PipelineDashboard(): JSX.Element {
  const { highlighted } = useHighlightedPipeline();

  return (
    <Grid2
      container
      sx={fullHeightSX}
      spacing={2}
      direction={'column'}
      justifyContent={highlighted.length > 0 ? 'space-between' : 'flex-start'}
      wrap={'nowrap'}
    >
      <Grid2>
        <GitlabPipelineContainer />
      </Grid2>
      <Grid2>
        <MostRecentProjects />
      </Grid2>
    </Grid2>
  );
}

export { PipelineDashboard };
