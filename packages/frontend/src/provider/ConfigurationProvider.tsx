import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ConfigurationService } from '../service/ConfigurationService';

interface Configuration {
  gitlabDomain: string;
  appID: string;
  projectsNb: number;
}

const ConfigurationContext = createContext<Configuration>({
  gitlabDomain: 'gitlab.com',
  appID: '',
  projectsNb: 10,
});

/**
 * Provides with the proper configuration
 *
 * @param {PropsWithChildren} props
 * @return {JSX.Element}
 */
function ConfigurationProvider(props: PropsWithChildren): JSX.Element {
  const [config, setConfig] = useState<Configuration | undefined>(undefined);

  useEffect(() => {
    const controller = new AbortController();
    const service = new ConfigurationService(controller.signal);
    service
      .getConfig()
      .then((config) => {
        setConfig(config);
      })
      .catch(console.error);

    return () => {
      controller.abort();
    };
  }, []);

  if (!config) {
    return <></>;
  }

  return (
    <ConfigurationContext.Provider value={config}>
      {props.children}
    </ConfigurationContext.Provider>
  );
}

/**
 * Hook to use the configuration
 *
 * @return {Configuration}
 */
function useConfiguration(): Configuration {
  return useContext(ConfigurationContext);
}

export { ConfigurationProvider, useConfiguration };
export type { Configuration };
