import { RootTasks } from '../context';
import { call, take, cancelled } from 'redux-saga/effects';
import { getTypePattern } from '../utils/typeUtils';

/**
 * awaitProcessStartupSaga
 * @param  {[type]}    proc          [description]
 * @param  {[type]}    monitorConfig [description]
 * @return {Generator}               [description]
 */
export default function* awaitProcessStartupSaga(proc, monitorConfig) {
  const { processID, schema } = proc;
  try {
    if (
      schema.instance &&
      typeof schema.instance.processStarts === 'function'
    ) {
      const startupPattern = getTypePattern(schema.startOnAction, {
        ...monitorConfig,
        parseObject: 'matches',
      });

      yield take(startupPattern);

      yield call(
        [RootTasks, RootTasks.create],
        processID,
        'processStarts',
        [schema.instance, schema.instance.processStarts],
        processID,
      );
    } else {
      console.warn(
        '[saga-process-manager]: You specified an await startup action but * processStarts does not exist.  This is an anti-pattern.  ',
        processID,
      );
    }
  } catch (e) {
    console.error('Error while awaiting startup: ', e.message);
  } finally {
    if (yield cancelled()) {
      // handle cancellation while waiting for startup (if needed)
      console.warn('Process Cancelled while awaiting Startup ', processID);
    }
  }
}
