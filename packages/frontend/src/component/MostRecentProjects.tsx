import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import { useConfiguration } from '../provider/ConfigurationProvider';
import { useGitlabAPI } from '../provider/GitlabAPIProvider';
import { GitlabProjectRow } from './GitlabProjectRow';

/**
 * Component for the most recent projects
 *
 * @return {JSX.Element}
 */
function MostRecentProjects(): JSX.Element {
  const { projects, loading } = useGitlabAPI();
  const config = useConfiguration();

  return (
    <Card raised>
      <CardHeader
        title={`${config.projectsNb} most recent projects`}
        sx={{ padding: '0.5rem' }}
      />
      <CardContent sx={{ padding: '0.5rem', overflow: 'auto' }}>
        {loading && !projects && (
          <Grid2>
            <CircularProgress variant={'indeterminate'} />
          </Grid2>
        )}
        {projects && (
          <Table size={'small'}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Last update</TableCell>
                <TableCell>Path</TableCell>
                <TableCell>Last release</TableCell>
                <TableCell>Pipeline created at</TableCell>
                <TableCell>Pipeline status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((proj) => {
                return <GitlabProjectRow key={proj.id} project={proj} />;
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export { MostRecentProjects };
