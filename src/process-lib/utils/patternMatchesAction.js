import ToReduxType from 'to-redux-type';

// TODO: right now this can be made a lot more efficient, we are parsing
//       the users raw actionRoutes rather than pre-compiling them so that
//       we do not need to convert them using ToReduxType at evaluation.

/**
 * patternMatchesAction
 * @param  {[type]} action  [description]
 * @param  {[type]} pattern [description]
 * @param  {[type]} proc    [description]
 * @return {[type]}         [description]
 */
export default function patternMatchesAction(action, pattern, proc) {
  // const { monitor } = proc.schema;

  let response;

  if (typeof pattern === 'function') {
    response = pattern(action);
  } else if (
    typeof pattern === 'string' &&
    ToReduxType(pattern) === action.type
  ) {
    response = true;
  }

  return response;
}
