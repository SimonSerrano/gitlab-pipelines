import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useLogin } from './GitlabLoginProvider';
import { Gitlab, Types } from '@gitbeaker/browser';
import { Resources } from '@gitbeaker/core/dist/types';
import { useNavigate } from 'react-router-dom';
import { useConfiguration } from './ConfigurationProvider';

type GitlabAPIContextProps = {
  loading?: boolean;
  projects: Types.ProjectSchema[] | null;
  getProjectPipeline(id: number): Promise<Types.PipelineSchema>;
  getProjectLastRelease(id: number): Promise<Types.ReleaseSchema>;
  getProjectPipelineExtended(
    id: number,
    pipeline: number,
  ): Promise<Types.PipelineExtendedSchema>;
  getPipelineJobs(id: number, pipeline: number): Promise<Types.JobSchema[]>;
};

const GitlabAPIContext = createContext<GitlabAPIContextProps>({
  projects: [],
  getProjectPipeline: () => {
    throw new Error('Not implemented');
  },
  getProjectLastRelease: () => {
    throw new Error('Not implemented');
  },
  getProjectPipelineExtended: () => {
    throw new Error('Not implemented');
  },
  getPipelineJobs: () => {
    throw new Error('Not implemented');
  },
});

/**
 * Gitlab API provider to enable use of hook in components
 *
 * @param {PropsWithChildren} props
 * @return {JSX.Element}
 */
function GitlabAPIProvider(props: PropsWithChildren): JSX.Element {
  const { authorization, refresh } = useLogin();

  const [gitlab, setGitlabClient] = useState<Resources.Gitlab | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] =
    useState<GitlabAPIContextProps['projects']>(null);
  const navigate = useNavigate();
  const config = useConfiguration();

  // Gets the gitlab projects. If it fails to do so because of a HTTP 401, try to refresh
  const getProjects = useCallback(
    (gitlab: Resources.Gitlab) => {
      setLoading(true);
      gitlab.Projects.all({
        perPage: config.projectsNb,
        maxPages: 1,
        page: 1,
        archived: false,
        order_by: 'last_activity_at',
      })
        .then((projects) => {
          setProjects(
            projects.sort(
              (a, b) =>
                Date.parse(b.last_activity_at) - Date.parse(a.last_activity_at),
            ),
          );
        })
        .catch((e) => {
          if (e.response?.status === 401) {
            setGitlabClient(undefined);
            refresh();
          } else {
            setProjects([]);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [config.projectsNb, refresh],
  );

  // Silently refresh the project list. If the last activity changed, the component will be refreshed
  const refreshProjects = useCallback(
    (gitlab: Resources.Gitlab) => {
      gitlab.Projects.all({
        perPage: config.projectsNb,
        maxPages: 1,
        page: 1,
        archived: false,
        order_by: 'last_activity_at',
      })
        .then((projects) => {
          setProjects(
            projects.sort(
              (a, b) =>
                Date.parse(b.last_activity_at) - Date.parse(a.last_activity_at),
            ),
          );
        })
        .catch((e) => {
          if (e.response?.status === 401) {
            setGitlabClient(undefined);
            refresh();
          }
        });
    },
    [config.projectsNb, refresh],
  );

  // API function available from the hook. It gets the last project's pipeline
  const getProjectPipeline: GitlabAPIContextProps['getProjectPipeline'] =
    useCallback(
      async (id) => {
        if (gitlab) {
          const pipelines = await gitlab.Pipelines.all(id, {
            perPage: 1,
            maxPages: 1,
            page: 1,
            order_by: 'updated_at',
          });
          if (pipelines.length === 1) {
            return pipelines[0];
          }
        }

        throw new Error(`Cannot get project ${id} last pipeline`);
      },
      [gitlab],
    );

  // API function available from the hook. It gets the last project's release
  const getProjectLastRelease: GitlabAPIContextProps['getProjectLastRelease'] =
    useCallback(
      async (id) => {
        if (gitlab) {
          const releases = await gitlab.Releases.all(id, {
            perPage: 1,
            maxPages: 1,
            page: 1,
            order_by: 'created_at',
          });
          if (releases.length === 1) {
            return releases[0];
          }
        }

        throw new Error(`Cannot get project ${id} last release`);
      },
      [gitlab],
    );

  const getProjectPipelineExtended: GitlabAPIContextProps['getProjectPipelineExtended'] =
    useCallback(
      async (id: number, pipeline: number) => {
        if (gitlab) {
          const extendedPipeline = (await gitlab.Pipelines.show(
            id,
            pipeline,
          )) as Types.PipelineExtendedSchema;
          if (extendedPipeline) {
            return extendedPipeline;
          }
        }
        throw new Error(`Cannot get pipeline ${pipeline} from project ${id}`);
      },
      [gitlab],
    );

  const getPipelineJobs: GitlabAPIContextProps['getPipelineJobs'] = useCallback(
    async (id: number, pipeline: number) => {
      if (gitlab) {
        const jobs = await gitlab.Jobs.showPipelineJobs(id, pipeline);
        return jobs;
      }
      throw new Error(
        `Cannot get jobs for pipeline ${pipeline} from project ${id}`,
      );
    },
    [gitlab],
  );

  // Check if the user is authorized. If he is, a gitlab client is created. If not, he is redirected to the login page
  useEffect(() => {
    if (authorization) {
      setGitlabClient(
        new Gitlab({
          host: 'https://gitlab.busit.com/',
          oauthToken: authorization.access_token,
        }),
      );
    }
    if (!authorization) {
      setGitlabClient(undefined);
      navigate('/');
    }
  }, [authorization, navigate]);

  // Get the projects for the first time
  useEffect(() => {
    if (gitlab) {
      getProjects(gitlab);
    }
  }, [gitlab, getProjects]);

  // Set an interval to refresh the projects silently every 30 seconds
  useEffect(() => {
    let timeout: NodeJS.Timer;
    if (gitlab) {
      timeout = setInterval(() => {
        refreshProjects(gitlab);
      }, 10 * 1000);
    }

    return () => {
      if (timeout) {
        clearInterval(timeout);
      }
    };
  }, [gitlab, refreshProjects]);

  return (
    <GitlabAPIContext.Provider
      value={{
        projects,
        loading,
        getProjectPipeline,
        getProjectLastRelease,
        getProjectPipelineExtended,
        getPipelineJobs,
      }}
    >
      {props.children}
    </GitlabAPIContext.Provider>
  );
}

/**
 * Hook to access the Gitlab API
 *
 * @return {GitlabAPIContextProps}
 */
function useGitlabAPI(): GitlabAPIContextProps {
  return useContext(GitlabAPIContext);
}

export { GitlabAPIProvider, useGitlabAPI };
