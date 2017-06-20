import { createTaskManager, killAllTaskManagers } from 'saga-task-manager';

/*
  Built processes are stored within the Map so that they may later be referenced
  and ran when required.
*/
const Processes = new Map(),
  // WeakMap storing all running processes current configuration / schema
  // which can be parsed to build our resulting reducers, actions, and selectors.
  ProcessSchema = new WeakMap(),
  Compiled = new Map();

let SharedSchema;

const DO_NOT_MONITOR = Symbol.for('@@saga-process-manager/$DO_NOT_MONITOR');
const IS_PROCESS = Symbol.for('@@saga-process-manager/$isProcess');

/**
 * ProcessProperties
 * @type {Array}
 *   An array defining the valid properties that can be added to a
 *   Process as static Properties.
 */
const ProcessProperties = [
  'config',
  'actionRoutes',
  'actionCreators',
  'initialState',
  'reducer',
  'selectors',
  'cancelTypes',
  'startOnAction',
  'loadProcess',
  'loadOnAction',
];

/*
  Our RootTasks stores each process and its root tasks.  This allows us to
  handle each individual process through the spawned tasks / lifecycle.  This
  is important because of the changes made to redux-saga that make fork a blocking
  effect at the end of the day.
*/
let RootTasks;

/**
 * defaultSharedSchema
 * @return {[type]} [description]
 */
const getDefaultSharedSchema = () =>
  new Map([['initialState', new Map()], ['reducer', new Map()]]);

/**
 * getDefaultProcessSchema
 * @return {[type]} [description]
 */
const getDefaultProcessSchema = () => ({
  config: {},
});

/**
 * getDefaultCompieldConfig
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
const getDefaultCompiledConfig = config => ({
  log: false,
  transformTypes: true,
  wildcard: true,
  optimizeReducers: true,
  hasReducerWildcardTypes: false,
  promise: Promise,
  ...config,
});

/**
 * processIsRunning
 * @param  {[type]} proc [description]
 * @return {[type]}      [description]
 */
function processIsRunning(proc) {
  return proc.schema.instance !== undefined;
}

/**
 * isProcess
 * @param  {[type]}  o [description]
 * @return {Boolean}   [description]
 */
function isProcess(o) {
  return (
    typeof o === 'function' &&
    Object.getPrototypeOf(o) &&
    Object.getPrototypeOf(o).isProcess === IS_PROCESS
  );
}

/**
 * setContextDefaults
 * @param {[type]} config [description]
 */
function setContextDefaults(config) {
  let killPromise;
  if (SharedSchema) {
    killPromise = killAllTaskManagers();
    SharedSchema.set('hot', true);
  } else {
    SharedSchema = new Map(getDefaultSharedSchema());
  }

  RootTasks = createTaskManager('root', {
    name: 'ROOT',
    log: config.log,
  });

  // Compiled.clear()
  Compiled.set('config', getDefaultCompiledConfig(config));

  return killPromise;
}

export {
  ProcessProperties,
  Processes,
  ProcessSchema,
  Compiled,
  SharedSchema,
  RootTasks,
  setContextDefaults,
  getDefaultProcessSchema,
  processIsRunning,
  isProcess,
  DO_NOT_MONITOR,
  IS_PROCESS,
};
