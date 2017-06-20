import { call } from 'redux-saga/effects';

/**
 * handleProcessCancellation
 * @param  {[type]}    action [description]
 * @param  {[type]}    proc   [description]
 * @return {Generator}        [description]
 */
export default function* handleProcessCancellation(action, proc) {
  if (typeof proc.schema.instance.shouldProcessCancel === 'function') {
    return yield call(
      [proc.schema.instance, proc.schema.instance.shouldProcessCancel],
      action,
    );
  } else {
    return true;
  }
}
