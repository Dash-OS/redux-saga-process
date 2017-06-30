// We use the lodash webpack plugin to only extract the required lodash functions
import _ from 'lodash';

import {
  Processes,
  ProcessSchema,
  SharedSchema,
  Compiled,
  setContextDefaults,
  getDefaultProcessSchema,
  isProcess,
  ProcessProperties,
} from './context';

import * as parseOption from './parsers';
import * as compileOption from './compilers';

/**
 * buildProcesses
 * @param  {Object}   processes         [description]
 * @param  {Object}   global_config     [description]
 * @param  {Function} configureHandler [description]
 * @return {CompiledProcessReducers}           [description]
 *
 * buildProcesses is the first step.  It will evaluate the processes
 * given configuration and build a compiled Process which includes the
 * necessary reducers, selectors, etc.
 */
// eslint-disable-next-line
export function buildProcesses(processes, globalConfig, configureHandler) {
  // set the default config and values, if previous tasks were
  // known, we will receive a killPromise that resolves when all
  // our previous tasks have been killed.
  // const killPromise = setContextDefaults(global_config);
  setContextDefaults(globalConfig);

  if (!_.isPlainObject(processes)) {
    throw new Error('[saga-process] buildProcesses expects a plain object');
  }

  // recursively search for processes and build our flat Maps.
  searchForProcesses(processes, configureHandler);

  // compile our processes now that we have gathered them into our Map.
  compileSharedSchema();

  return {
    processIDs: new Set([...Processes.keys()]),
    processReducers: Compiled.get('reducers'),
  };
}

/**
 * searchForProcesses
 * @param  {Object}   processes         [description]
 * @param  {Function} configureHandler [description]
 * @param  {String}   category          [description]
 *
 *  iterate through the received object and save any discovered processes into the
 *  Process Map.  As we move deeper into the object, the final uid of the given
 *  process is repesentative of the path.
 *
 *  { foo: { bar: MyProcess } } -> 'foo.bar.MyProcess'
 *
 */
function searchForProcesses(processes, configureHandler, category) {
  for (const processCategory of Object.keys(processes)) {
    const nextCategory = `${(category && `${category}.`) || ''}${processCategory}`;
    const processClass = processes[processCategory];
    formatProcessCategory(category, processCategory, nextCategory, processClass, configureHandler);
  }
}

/**
 * formatProcessCategory
 * @param {String} category
 * @param {String} processCategory
 * @param {String} nextCategory
 * @param {Process || Object || Function} processClass
 * @param {Function} configureHandler
 */
function formatProcessCategory(
  category,
  processCategory,
  nextCategory,
  processClass,
  configureHandler,
) {
  if (isProcess(processClass)) {
    // parse the received Process and compile if needed
    return handleDiscoveredProcess(nextCategory, processClass);
  } else if (typeof processClass === 'function' && typeof configureHandler === 'function') {
    return configureProcess(processClass, processCategory, nextCategory, configureHandler);
  } else if (_.isPlainObject(processClass)) {
    // check the next level for processes
    return searchForProcesses(processClass, configureHandler, nextCategory);
  }
}

/**
 * configureProcess
 * @param  {[type]} processClassFactory The function that will return a Process
 *                                      when called with the users configuration.
 * @param  {[type]} processCategory     The current category of our Process.
 * @param  {[type]} nextCategory        The next category if we are further nested.
 * @param  {Function} configureHandler A function the user provides to configure a process
 *                                      factory.
 *
 *   When we encounter a function during the build process which is not a Process
 *   itself, we will call the users configureHandler with the information about
 *   the Process
 */
function configureProcess(processClassFactory, processCategory, nextCategory, configureHandler) {
  const configuredProcess = configureHandler(processClassFactory, processCategory, nextCategory);

  if (isProcess(configuredProcess)) {
    // If the configureHandler returns a valid process then we will use it
    return handleDiscoveredProcess(nextCategory, configuredProcess);
  } else if (_.isPlainObject(configuredProcess) && isProcess(configuredProcess.process)) {
    return handleDiscoveredProcess(nextCategory, formatConfiguredProcessObject(configuredProcess));
  }
}

/**
 * formatConfiguredProcessObject
 * @param  {Process || Object} configuredProcess
 * @return {Process}
 */
function formatConfiguredProcessObject(configuredProcess) {
  const processClass = configuredProcess.process;
  for (const processProperty of Object.keys(configuredProcess)) {
    /*
      If we receive an object of properties we add them as static
      properties to the Process for the user.
     */
    if (processProperty !== 'process') {
      processClass[processProperty] = configuredProcess[processProperty];
    }
  }
  return processClass;
}

/**
 * handleDiscoveredProcess
 * @param  {String} processPath [description]
 * @param  {Object} processor   [description]
 * @return {[type]}             [description]
 *
 * When we discover a Process, we check to see if we have already
 * configured and run this process. If we have, the process is
 * refreshed if possible.
 *
 * At this point the cateogry is changed into the processPath as it
 * points to the final path of the process itself and will be unique
 * to all other processes.
 *
 */
function handleDiscoveredProcess(processPath, processor) {
  if (ProcessSchema.has(processor)) {
    console.warn('ProcessSchema Found! Already Running?');
    return;
  }
  const processID = (processor.config && processor.config.pid) || processPath;

  const schema = {
    ...getDefaultProcessSchema(),
    processPath,
    processID,
    ..._.pick(processor, ProcessProperties),
  };

  if (processor.actions && !schema.actionCreators) {
    schema.actionCreators = processor.actions;
  }

  Processes.set(processID, processor);
  ProcessSchema.set(processor, schema);
  return handleSharedSchema({ processor, schema });
}

/**
 * handleSharedSchema
 * @param  {Process} processClass [description]
 *
 * Merge the shared values into the SharedSchema Map allowing us to build our
 * final values based on the results of all matching schema.
 *
 */
function handleSharedSchema(processClass) {
  for (const option of Object.keys(processClass.schema)) {
    if (typeof parseOption[option] === 'function') {
      parseOption[option](processClass, SharedSchema, Compiled);
    }
  }
}

/**
 * compileSharedSchema
 * @return {[type]} [description]
 *
 * Once we have parsed the shared schema values, we can compile them into
 * appropriate values
 *
 */
function compileSharedSchema() {
  for (const [option, value] of SharedSchema) {
    if (typeof compileOption[option] === 'function') {
      compileOption[option](value, Processes, ProcessSchema, SharedSchema, Compiled);
    }
  }
}

// /**
//  * compileProcess
//  * @param  {Process} processClass [description]
//  * @return {[type]}               [description]
//  */
//
// function compileProcess(processClass) {
//   for (const option of Object.keys(processClass.schema)) {
//     if (typeof parseOption[option] === 'function') {
//       parseOption[option](processClass, Compiled);
//     }
//   }
// }
