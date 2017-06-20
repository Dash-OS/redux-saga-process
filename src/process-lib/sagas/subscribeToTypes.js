import { call, fork } from 'redux-saga/effects';
import { getTypePattern } from '../utils/typeUtils';

import monitorTypesSaga from './monitorTypes';
import handleMonitoredActionSaga from './handleMonitoredAction';
import handleProcessCancellationSaga from './handleProcessCancellation';
import awaitStartupActionSaga from './awaitProcessStartup';

import { DO_NOT_MONITOR } from '../context';

/**
 * subscribeToTypes
 * @param  {ProcessDescriptor}    proc           [description]
 * @param  {[type]}    monitorConfig  [description]
 * @param  {[type]}    compiledConfig [description]
 * @return {Generator}                [description]
 */
export default function* subscribeToTypes(proc, monitorConfig, compiledConfig) {
  const { schema } = proc;

  schema.monitor = {};

  let monitorPattern, cancelPattern;
  /*
    static startOnAction | wait for the given value before running the process.
  */
  if (
    schema.startOnAction &&
    typeof schema.instance.processStarts === 'function'
  ) {
    yield call([schema.instance, awaitStartupActionSaga], proc, monitorConfig);
  }

  if (schema.actionRoutes) {
    monitorPattern = getTypePattern(schema.actionRoutes, monitorConfig);
  } else {
    monitorPattern = DO_NOT_MONITOR;
  }

  if (schema.cancelTypes) {
    cancelPattern = getTypePattern(schema.cancelTypes, monitorConfig);
  } else {
    cancelPattern = DO_NOT_MONITOR;
  }

  schema.monitor.config = monitorConfig;
  schema.monitor.pattern = monitorPattern;

  if (monitorPattern !== DO_NOT_MONITOR || cancelPattern !== DO_NOT_MONITOR) {
    return yield fork(
      [this, monitorTypesSaga],
      monitorPattern,
      cancelPattern,
      proc,
      {
        monitor: handleMonitoredActionSaga,
        cancel: handleProcessCancellationSaga,
      },
    );
  }
}
