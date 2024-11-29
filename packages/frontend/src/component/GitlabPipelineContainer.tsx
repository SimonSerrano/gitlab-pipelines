import { Card, CardHeader, CardContent, Collapse } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import { useHighlightedPipeline } from '../provider/HighlightedPipelineProvider';
import { HighlightedPipelineContainer } from './HighlightedPipelineContainer';

/**
 * Container for the highlighted pipelines. Renders cards inside this card
 *
 * @return {JSX.Element}
 */
function GitlabPipelineContainer(): JSX.Element {
  const { highlighted } = useHighlightedPipeline();

  return (
    <Collapse in={highlighted.length > 0}>
      <Card raised>
        <CardHeader
          title={'Highlighted pipelines'}
          sx={{ padding: '0.5rem' }}
        />
        <CardContent
          sx={{
            padding: '0.5rem',
            overflowX: 'auto',
            overflowY: 'hidden',
            width: '100%',
          }}
        >
          <Grid2 container spacing={2} wrap={'nowrap'}>
            {highlighted.map((highlight) => (
              <HighlightedPipelineContainer
                key={highlight.project.id}
                highlighted={highlight}
              />
            ))}
          </Grid2>
        </CardContent>
      </Card>
    </Collapse>
  );
}

export { GitlabPipelineContainer };
