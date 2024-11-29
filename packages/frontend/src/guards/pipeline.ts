import { Types } from '@gitbeaker/browser';

/**
 * Guard for the pipeline schema
 *
 * @param {unknown} o
 * @return {*}  {o is Types.PipelineSchema}
 */
function isPipeline(o: unknown): o is Types.PipelineSchema {
  return typeof o === 'object' && o !== null && 'status' in o && 'web_url' in o;
}

/**
 * Guard for the pipeline extended schema
 *
 * @param {unknown} o
 * @return {*}  {o is Types.PipelineExtendedSchema}
 */
function isPipelineExtended(o: unknown): o is Types.PipelineExtendedSchema {
  return isPipeline(o) && 'user' in o && 'username' in o.user;
}

const PipelineGuards = {
  isPipeline,
  isPipelineExtended,
};

export { PipelineGuards };
