import { Button, CircularProgress, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useConfiguration } from '../provider/ConfigurationProvider';
import { useLogin } from '../provider/GitlabLoginProvider';
import { fullHeightSX } from '../style/layout';

/**
 * Component to login to gitlab
 *
 * @return {JSX.Element}
 */
function GitlabLogin(): JSX.Element {
  const {
    loading,
    authorization,
    error,
    requestAuthorization,
    requestAccessToken,
  } = useLogin();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const config = useConfiguration();

  useEffect(() => {
    if (
      !loading &&
      !error &&
      searchParams &&
      searchParams.has('code') &&
      searchParams.has('state')
    ) {
      try {
        const code = searchParams.get('code') as string;
        const state = JSON.parse(window.atob(searchParams.get('state') || ''));
        requestAccessToken({ code, state });
      } catch (e) {
        console.error(e);
      }
    }
  }, [searchParams, requestAccessToken, loading, error]);

  useEffect(() => {
    if (authorization) {
      navigate('/dashboard');
    }
  }, [authorization, navigate]);

  return (
    <Grid2
      container
      sx={fullHeightSX}
      spacing={6}
      direction={'column'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Grid2>
        <Typography variant={'h4'}>
          Welcome to Gitlab Pipeline Dashboard
        </Typography>
      </Grid2>
      <Grid2 container direction={'column'} alignItems={'center'} spacing={0}>
        <Grid2>
          <Button
            startIcon={
              <img
                alt=""
                style={{ maxWidth: '1.3rem' }}
                src={`https://${config.gitlabDomain}/assets/favicon-72a2cad5025aa931d6ea56c3201d1f18e68a8cd39788c7c80d5b2b82aa5143ef.png`}
              />
            }
            endIcon={
              loading && (
                <CircularProgress
                  variant={'indeterminate'}
                  color={'secondary'}
                  size={'1.3rem'}
                />
              )
            }
            variant={'contained'}
            onClick={() => requestAuthorization()}
          >
            Login with Gitlab
          </Button>
        </Grid2>
        <Grid2>
          <Typography variant={'body2'} color={'darkgrey'}>
            {config.gitlabDomain}
          </Typography>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}

export { GitlabLogin };
