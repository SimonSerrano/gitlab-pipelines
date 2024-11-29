import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  GitlabOAuthResponse,
  OAuthPKCEFlowService,
} from '../service/OAuthPKCEFlowService';
import { useConfiguration } from './ConfigurationProvider';

type GitlabLoginContextAPI = {
  requestAuthorization(): void;
  requestAccessToken(options: { code: string; state: { token: string } }): void;
  refresh(): void;
  loading?: boolean;
  authorization?: GitlabOAuthResponse;
  error?: string;
};

const GitlabLoginContext = createContext<GitlabLoginContextAPI>({
  requestAuthorization: () => {},
  requestAccessToken: () => {},
  refresh: () => {},
});

/**
 * Provides access to the gitlab login using OAuth PKCE
 *
 * @param {React.PropsWithChildren} props
 * @return {JSX.Element}
 */
function GitlabLoginProvider(props: React.PropsWithChildren): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [authorization, setAuthorized] = useState<
    GitlabOAuthResponse | undefined
  >();
  const [error, setError] = useState<any>();
  const abortController = new AbortController();
  const config = useConfiguration();
  const service = new OAuthPKCEFlowService(abortController.signal, config);

  useEffect(() => {
    if (!authorization) {
      const savedAccess = localStorage.getItem('gitlabOAuth');
      if (savedAccess) {
        setAuthorized(JSON.parse(savedAccess));
      }
    }
  }, [authorization]);

  const requestAuthorization: GitlabLoginContextAPI['requestAuthorization'] =
    async () => {
      setLoading(true);
      try {
        const url = await service.requestAuthorization();
        setLoading(false);
        window.location.assign(url);
      } catch (e) {
        console.error(e);
        setError(e);
        setLoading(false);
      }
    };

  const requestAccessToken: GitlabLoginContextAPI['requestAccessToken'] =
    async (options) => {
      setLoading(true);
      try {
        await service.verifyState(options.state);
        const gitlabOAuthAccess = await service.requestAccessToken(
          options.code,
        );
        localStorage.setItem('gitlabOAuth', JSON.stringify(gitlabOAuthAccess));
        setAuthorized(gitlabOAuthAccess);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setError(e);
        setLoading(false);
      }
    };

  const refresh: GitlabLoginContextAPI['refresh'] = async () => {
    if (authorization) {
      setLoading(true);
      try {
        const gitlabOAuthAccess = await service.refresh(authorization);
        localStorage.setItem('gitlabOAuth', JSON.stringify(gitlabOAuthAccess));
        setAuthorized(gitlabOAuthAccess);
        setLoading(false);
      } catch (e) {
        console.error(e);
        localStorage.removeItem('gitlabOAuth');
        setError(e);
        setAuthorized(undefined);
        setLoading(false);
      }
    }
  };

  return (
    <GitlabLoginContext.Provider
      value={{
        loading,
        authorization,
        error,
        requestAuthorization,
        requestAccessToken,
        refresh,
      }}
    >
      {props.children}
    </GitlabLoginContext.Provider>
  );
}

/**
 * Hook function to access the Gitlab login context
 *
 * @return {GitlabLoginContextAPI}
 */
function useLogin(): GitlabLoginContextAPI {
  return useContext(GitlabLoginContext);
}

export { GitlabLoginProvider, useLogin };
