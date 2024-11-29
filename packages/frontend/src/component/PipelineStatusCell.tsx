import { Types } from '@gitbeaker/browser';
import { Box, Chip, CircularProgress, Typography } from '@mui/material';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import Bolt from '@mui/icons-material/Bolt';
import DoDisturb from '@mui/icons-material/DoDisturb';
import SkipNext from '@mui/icons-material/SkipNext';
import PlayArrow from '@mui/icons-material/PlayArrow';
import AvTimer from '@mui/icons-material/AvTimer';
import { useMemo } from 'react';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

/**
 * Status component for a row in the table
 *
 * @param {{pipeline: Types.PipelineSchema}} props
 * @return {JSX.Element}
 */
function PipelineStatusCell(props: {
  status: Types.PipelineStatus | string;
  webUrl: string;
  branch?: Types.PipelineSchema['ref'];
  alwaysOpen?: boolean;
}): JSX.Element {
  /**
   * Get the circular progress component depending on the status of the pipeline
   */
  const cirlcularFromStatus = useMemo((): JSX.Element => {
    switch (props.status) {
      case 'success':
        return (
          <CircularProgress
            size={'1.5rem'}
            color="success"
            variant={'determinate'}
            value={100}
          />
        );
      case 'failed':
        return (
          <CircularProgress
            size={'1.5rem'}
            color="error"
            variant={'determinate'}
            value={100}
          />
        );
      case 'created':
      case 'preparing':
      case 'pending':
      case 'waiting_for_resource':
      case 'running':
        return (
          <CircularProgress
            size={'1.5rem'}
            color="warning"
            variant={'indeterminate'}
          />
        );
      case 'skipped':
      case 'manual':
      case 'scheduled':
      case 'canceled':
        return (
          <CircularProgress
            size={'1.5rem'}
            color="info"
            variant={'determinate'}
            value={100}
          />
        );

      default:
        return <>{props.status}</>;
    }
  }, [props.status]);

  /**
   * Get the icon depeneding on the status of the pipeline
   */
  const iconFromStatus = useMemo((): JSX.Element => {
    switch (props.status) {
      case 'success':
        return <Check color={'success'} fontSize={'small'} />;
      case 'failed':
        return <Close color={'error'} fontSize={'small'} />;
      case 'created':
      case 'preparing':
      case 'pending':
      case 'waiting_for_resource':
      case 'running':
        return <Bolt color={'warning'} fontSize={'small'} />;
      case 'canceled':
        return <DoDisturb color={'info'} fontSize={'small'} />;
      case 'skipped':
        return <SkipNext color={'info'} fontSize={'small'} />;
      case 'manual':
        return <PlayArrow color={'info'} fontSize={'small'} />;
      case 'scheduled':
        return <AvTimer color={'info'} fontSize={'small'} />;
      default:
        return <>{props.status}</>;
    }
  }, [props.status]);

  const branch = useMemo(() => {
    if (props.branch && props.branch.length > 20) {
      return `${props.branch.substring(0, 19)}...`;
    }

    return props.branch;
  }, [props.branch]);

  // `${props.status}${branch ? ` on ${branch}` : ``}`

  return (
    <Chip
      clickable
      size={'medium'}
      label={
        <Grid2 container spacing={0.5} wrap={'nowrap'}>
          <Grid2>
            <Typography variant={'body2'}>
              {branch ? props.status + ' on' : props.status}
            </Typography>
          </Grid2>
          <Grid2>
            {branch && (
              <Typography variant={'body2'} color={'secondary'}>
                {branch}
              </Typography>
            )}
          </Grid2>
        </Grid2>
      }
      onClick={() => {
        window.open(props.webUrl, '_blank');
      }}
      icon={
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          {cirlcularFromStatus}
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {iconFromStatus}
          </Box>
        </Box>
      }
    />
  );
}

export { PipelineStatusCell };
