import { fork, race, call, take, cancelled } from 'redux-saga/effects';

/**
 * monitorTypesSaga
 * @param {[type]} monitorPattern [description]
 * @param {[type]} cancelPattern [description]
 * @param {[type]} proc [description]
 * @param {[type]} handler [description]
 */
export default function* monitorTypesSaga(
  monitorPattern,
  cancelPattern,
  proc,
  handler,
) {
  const { instance } = proc.schema;
  let isRunning = true;

  try {
    while (isRunning) {
      const { monitorAction, cancelAction } = yield race({
        monitorAction: take(monitorPattern),
        cancelAction: take(cancelPattern),
      });

      if (monitorAction) {
        yield fork([instance, handler.monitor], monitorAction, proc);
      } else if (cancelAction) {
        isRunning = yield call([instance, handler.cancel], cancelAction, proc);
      }
    }
  } catch (e) {
    console.error(`[monitorTypes]: ${e.message}`);
  } finally {
    if (yield cancelled()) {
      console.info('MonitorTypes Cancelled: ', proc);
    }
    if (typeof instance.processCancelled === 'function') {
      yield call([instance, instance.processCancelled]);
    }
  }
}
