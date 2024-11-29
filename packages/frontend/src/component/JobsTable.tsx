import { Types } from '@gitbeaker/browser';
import {
  Card,
  CardContent,
  Collapse,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import { getDurationString } from '../utils/time';
import { PipelineStatusCell } from './PipelineStatusCell';

type JobsTableProps = {
  jobs?: Types.JobSchema[];
};

/**
 * Renders a job table with the job name and its status
 *
 * @param {JobsTableProps} props
 * @return {*}  {JSX.Element}
 */
function JobsTable(props: JobsTableProps): JSX.Element {
  if (!props.jobs) {
    return <Skeleton />;
  }

  return (
    <Card variant={'outlined'}>
      <CardContent sx={{ padding: '0!important' }}>
        <Collapse in={props.jobs && props.jobs.length > 0}>
          <Grid2
            container
            direction={'column'}
            spacing={1}
            sx={{ height: '10vw', overflow: 'auto' }}
            wrap={'nowrap'}
            margin={'0rem'}
          >
            <Table size={'small'}>
              <TableBody>
                {props.jobs &&
                  props.jobs.map((job) => {
                    return (
                      <TableRow key={job.id}>
                        <TableCell>{job.name}</TableCell>
                        <TableCell>
                          {job.duration && getDurationString(job.duration)}
                        </TableCell>
                        <TableCell>
                          <PipelineStatusCell
                            alwaysOpen
                            status={job.status}
                            webUrl={job.web_url}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </Grid2>
        </Collapse>
      </CardContent>
    </Card>
  );
}

export { JobsTable };
