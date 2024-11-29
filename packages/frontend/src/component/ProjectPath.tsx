import { OpenInNew } from '@mui/icons-material';
import { Typography, IconButton } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';

type ProjectPathProps = {
  path: string;
  webUrl: string;
};

/**
 * Renders a project path with an icon to open in new tab. If the path is too long, it is ellipsized
 *
 * @param {ProjectPathProps} props
 * @return {JSX.Element}
 */
function ProjectPath(props: ProjectPathProps): JSX.Element {
  return (
    <Grid2 container alignItems={'center'} spacing={0}>
      <Grid2>
        <Typography variant={'body2'}>
          {props.path.length > 30
            ? props.path.substring(0, 29) + '...'
            : props.path}
        </Typography>
      </Grid2>
      <Grid2>
        <IconButton
          size={'small'}
          onClick={() => {
            window.open(props.webUrl, '_blank');
          }}
        >
          <OpenInNew fontSize={'small'} />
        </IconButton>
      </Grid2>
    </Grid2>
  );
}

export { ProjectPath };
