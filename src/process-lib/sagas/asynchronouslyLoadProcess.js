import { call, take } from 'redux-saga/effects';
import PromiseMap from 'promise-map-es6';

// provided as the second argument as a shortcut to .then(m => m.default)
const defaulted = m => m.default;

/*
  When a Process defines the static method [loadProcess], and optionally
  [loadOnAction], loadProcess is sent a PromiseMap object which we resolve
  into a asynchronously loaded data for the process.

  Our process will not be loaded until we have complete loading.

  The Process has, however, been built and compiled so things such as
  initial state, exports, etc will all be available.
*/
export default function* asynchronouslyLoadProcess(
  proc,
  pattern,
  SharedSchema,
) {
  const { schema } = proc;
  const { processID, loadOnAction, loadProcess, instance } = schema;

  let loadAction;

  if (loadOnAction) {
    if (!pattern) {
      throw new Error(
        `Failed to Asynchronously Load ${processID} | Invalid loadOnAction property: ${loadOnAction}`,
      );
    }
    loadAction = yield take(pattern);
  }

  if (!loadProcess) {
    return;
  }

  const globalProcessScope = SharedSchema.get('scope') || new Map();

  let processScope;

  if (!module.hot) {
    processScope = globalProcessScope.get(processID);
    if (processScope) {
      schema.instance.scope = processScope;
      return processScope;
    }
  }

  const promises = new PromiseMap();

  if (typeof loadProcess === 'function') {
    // call the loadProcess function.  We will pass in a PromiseMap which will
    // resolve into the shared schema before we continue.
    yield call([instance, loadProcess], promises, defaulted, loadAction);
  } else if (loadProcess && typeof loadProcess.then === 'function') {
    // we also accept a promise here and will simply resolve it before we
    // continue.  In this case we use push as we do not need to resolve
    // to any sort of data schema.
    yield call(() => loadProcess(promises, defaulted, loadAction));
  }

  const resolved = promises.size && (yield call(() => promises));

  if (resolved) {
    processScope = { ...resolved };
    schema.instance.scope = processScope;
    globalProcessScope.set(processID, processScope);
    SharedSchema.set('scope', globalProcessScope);
  }

  return processScope;
}
