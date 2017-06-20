import { RootTasks } from '../context';

import parseActionForRoutes from '../utils/parseActionForRoutes';

import runActionRouteSaga from './runActionRoute';

/**
 * handleMonitorActionSaga
 * @param  {[type]}    action [description]
 * @param  {[type]}    proc   [description]
 * @return {Generator}        [description]
 */
export default function* handleMonitoredActionSaga(action, proc) {
  const { processID, actionRoutes, instance, processPath } = proc.schema;

  const executeRoutes = [];

  parseActionForRoutes(action, actionRoutes, proc, executeRoutes);

  for (let route of executeRoutes) {
    const original_route = route;
    if (typeof route !== 'function') {
      // if the matching route is not already a function then
      // the function is searched for within the Process instance
      route = instance[route];
    }
    if (typeof route === 'function') {
      // execute the route with a binding of the instance (passed down through
      // parent functions)
      const runnerID = Symbol(action.type);
      yield* RootTasks.create(
        'actionRouteRunner',
        runnerID,
        [instance, runActionRouteSaga],
        proc,
        route,
        action,
        original_route,
      );
    } else {
      console.error(
        `[process-manager]: action route | ${processID} -> ${processPath}.${original_route} | is not a function`,
      );
    }
  }
}
