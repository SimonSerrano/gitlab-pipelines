import { Types } from '@gitbeaker/browser';
import {
  Skeleton,
  TableCell,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import { PipelineStatusCell } from './PipelineStatusCell';
import { useState, useEffect, useMemo } from 'react';
import { useGitlabAPI } from '../provider/GitlabAPIProvider';
import {
  highlight,
  useHighlightedPipeline,
} from '../provider/HighlightedPipelineProvider';
import { ProjectPath } from './ProjectPath';

/**
 * Gitlab project row component for the Table component from mui
 *
 * @param {{project: Types.ProjectSchema}} props
 * @return {JSX.Element}
 */
function GitlabProjectRow(props: {
  project: Types.ProjectSchema;
}): JSX.Element {
  const [project, setProject] = useState<Types.ProjectSchema | undefined>();

  const [loadingPipeline, setLoadingPipeline] = useState(false);
  const [pipeline, setPipeline] = useState<
    Types.PipelineSchema | null | undefined
  >();
  const [loadingRelease, setLoadingRelease] = useState(false);
  const [release, setRelease] = useState<
    Types.ReleaseSchema | null | undefined
  >();
  const { getProjectPipeline, getProjectLastRelease } = useGitlabAPI();
  const theme = useTheme();

  const { dispatch } = useHighlightedPipeline();

  useEffect(() => {
    if (project && pipeline) {
      if (!['success'].includes(pipeline.status)) {
        dispatch(
          highlight({
            project,
            pipeline,
          }),
        );
      }
    }
  }, [project, pipeline, dispatch]);

  const statusCell = useMemo(() => {
    if (pipeline) {
      return (
        <PipelineStatusCell
          status={pipeline.status}
          webUrl={pipeline.web_url}
          branch={pipeline.ref}
        />
      );
    }
  }, [pipeline]);

  // If the project has changed, update it
  useEffect(() => {
    if (
      !project ||
      project.last_activity_at !== props.project.last_activity_at
    ) {
      setProject(props.project);
    }
  }, [project, props.project]);

  // Get the last release
  useEffect(() => {
    if (release === undefined && !loadingRelease && project?.id) {
      setLoadingRelease(true);
      getProjectLastRelease(project.id)
        .then((release) => setRelease(release))
        .catch((e) => {
          console.error(e);
          setRelease(null);
        })
        .finally(() => {
          setLoadingRelease(false);
        });
    }
  }, [getProjectLastRelease, loadingRelease, release, project?.id]);

  // Get the last pipeline
  useEffect(() => {
    if (pipeline === undefined && !loadingPipeline && project?.id) {
      setLoadingPipeline(true);
      getProjectPipeline(project.id)
        .then((pipeline) => {
          setPipeline(pipeline);
        })
        .catch((e) => {
          console.error(e);
          setPipeline(null);
        })
        .finally(() => {
          setLoadingPipeline(false);
        });
    }
  }, [getProjectPipeline, loadingPipeline, pipeline, project?.id]);

  // Set an interval to refresh the projects silently every 30 seconds
  useEffect(() => {
    let timeout: NodeJS.Timer;
    if (pipeline && project) {
      timeout = setInterval(() => {
        getProjectPipeline(project.id)
          .then((pipeline) => {
            setPipeline(pipeline);
          })
          .catch((e) => {
            console.error(e);
          });
      }, 10 * 1000);
    }

    return () => {
      if (timeout) {
        clearInterval(timeout);
      }
    };
  }, [getProjectPipeline, pipeline, project]);

  return (
    <TableRow>
      <TableCell>
        <Typography variant={'body2'} color={'grey'}>
          {props.project.id}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography color={theme.palette.primary.main} variant={'body2'}>
          {props.project.name}
        </Typography>
      </TableCell>
      <TableCell>
        {new Date(Date.parse(props.project.last_activity_at)).toLocaleString()}
      </TableCell>
      <TableCell>
        <ProjectPath
          path={props.project.path_with_namespace}
          webUrl={props.project.web_url}
        />
      </TableCell>
      <TableCell>
        {loadingRelease && !release && <Skeleton />}
        {release && release.tag_name}
      </TableCell>
      <TableCell>
        <>
          {loadingPipeline && !pipeline && <Skeleton />}
          {pipeline &&
            new Date(Date.parse(pipeline.created_at)).toLocaleString()}
        </>
      </TableCell>
      <TableCell>
        {loadingPipeline && !pipeline && <Skeleton />}
        {statusCell}
      </TableCell>
    </TableRow>
  );
}

export { GitlabProjectRow };
