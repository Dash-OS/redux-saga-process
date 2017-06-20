import _ from 'lodash';
import patternMatchesAction from './patternMatchesAction';

/**
 * parseActionForRoutes
 * @param  {[type]} action        [description]
 * @param  {[type]} obj           [description]
 * @param  {[type]} proc          [description]
 * @param  {[type]} executeRoutes [description]
 * @return {[type]}               [description]
 */
export default function parseActionForRoutes(action, obj, proc, executeRoutes) {
  let routes;
  let i = 0;
  if (obj instanceof Map) {
    routes = [...obj.values()];
  } else if (_.isPlainObject(obj)) {
    routes = Object.keys(obj).map(e => obj[e]);
  } else {
    return;
  }
  const { monitor } = proc.schema;
  for (let pattern of monitor.pattern) {
    if (patternMatchesAction(action, pattern, proc)) {
      executeRoutes.push(routes[i]);
    }
    i++;
  }
  return;
}
