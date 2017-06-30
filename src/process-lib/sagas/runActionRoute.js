import { call } from 'redux-saga/effects';
/**
 * runActionForRoute
 * @param  {[type]}    proc           [description]
 * @param  {[type]}    route          [description]
 * @param  {[type]}    action         [description]
 * @param  {[type]}    originalRoute [description]
 * @return {Generator}                [description]
 */
export default function* runActionRoute(proc, route, action, originalRoute) {
  try {
    yield call([proc.schema.instance, route], action);
  } catch (e) {
    const { processID, processPath } = proc.schema;
    console.error(
      `[process-manager]: action route | ${processID} -> ${processPath}.${originalRoute} | uncaught error: ${e.message}`,
    );
  }
}
