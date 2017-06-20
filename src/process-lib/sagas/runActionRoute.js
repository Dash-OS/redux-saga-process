import { call } from 'redux-saga/effects';
/**
 * runActionForRoute
 * @param  {[type]}    proc           [description]
 * @param  {[type]}    route          [description]
 * @param  {[type]}    action         [description]
 * @param  {[type]}    original_route [description]
 * @return {Generator}                [description]
 */
export default function* runActionRoute(proc, route, action, original_route) {
  try {
    yield call([proc.schema.instance, route], action);
  } catch (e) {
    const { processID, processPath } = proc.schema;
    console.error(
      `[process-manager]: action route | ${processID} -> ${processPath}.${original_route} | uncaught error: ${e.message}`,
    );
  }
}
