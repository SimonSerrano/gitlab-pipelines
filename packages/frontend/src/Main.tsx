import React, { useMemo } from 'react';
import { GitlabLogin } from './app/GitlabLogin';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
  Box,
  createTheme,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from '@mui/material';
import { fullHeightSX } from './style/layout';
import { GitlabLoginProvider } from './provider/GitlabLoginProvider';
import { PipelineDashboard } from './app/PipelineDashboard';
import { GitlabAPIProvider } from './provider/GitlabAPIProvider';
import { ConfigurationProvider } from './provider/ConfigurationProvider';
import { HighlightedPipelineProvider } from './provider/HighlightedPipelineProvider';

/**
 * Entry point for the application. Contains the theme and the routing for the login and dashboard
 *
 * @return {JSX.Element}
 */
function Main(): JSX.Element {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: '#4fc3f7',
          },
          secondary: {
            main: '#1e88e5',
          },
          mode: prefersDarkMode ? 'dark' : 'light',
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                scrollbarColor: '#6b6b6b #2b2b2b',
                '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                  backgroundColor: '#2b2b2b',
                },
                '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                  borderRadius: 8,
                  backgroundColor: '#6b6b6b',
                  minHeight: 24,
                  border: '5px solid #2b2b2b',
                },
                '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus':
                  {
                    backgroundColor: '#959595',
                  },
                '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active':
                  {
                    backgroundColor: '#959595',
                  },
                '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover':
                  {
                    backgroundColor: '#959595',
                  },
                '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
                  backgroundColor: '#2b2b2b',
                },
              },
            },
          },
        },
      }),
    [prefersDarkMode],
  );

  const router = createBrowserRouter(
    [
      {
        path: '/',
        element: <GitlabLogin />,
      },
      {
        path: `/oauth/redirect`,
        element: <GitlabLogin />,
      },
      {
        path: `/dashboard`,
        element: (
          <GitlabAPIProvider>
            <HighlightedPipelineProvider>
              <PipelineDashboard />
            </HighlightedPipelineProvider>
          </GitlabAPIProvider>
        ),
      },
    ],
    { basename: process.env.REACT_APP_HOMEPAGE },
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ ...fullHeightSX, width: '100%', padding: '0.5rem' }}>
        <ConfigurationProvider>
          <GitlabLoginProvider>
            <RouterProvider router={router} />
          </GitlabLoginProvider>
        </ConfigurationProvider>
      </Box>
    </ThemeProvider>
  );
}

export default Main;
