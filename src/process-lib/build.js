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

// We use the lodash webpack plugin to only extract the required lodash functions
import _ from 'lodash';

/**
 * buildProcesses
 * @param  {Object}   processes         [description]
 * @param  {Object}   global_config     [description]
 * @param  {Function} configure_handler [description]
 * @return {CompiledProcessReducers}           [description]
 *
 * buildProcesses is the first step.  It will evaluate the processes
 * given configuration and build a compiled Process which includes the
 * necessary reducers, selectors, etc.
 */
export function buildProcesses(processes, global_config, configure_handler) {
  // set the default config and values, if previous tasks were
  // known, we will receive a killPromise that resolves when all
  // our previous tasks have been killed.
  // const killPromise = setContextDefaults(global_config);
  setContextDefaults(global_config);

  if (!_.isPlainObject(processes)) {
    throw new Error('[saga-process] buildProcesses expects a plain object');
  }

  // recursively search for processes and build our flat Maps.
  searchForProcesses(processes, configure_handler);

  // compile our processes now that we have gathered them into our Map.
  compileSharedSchema();

  console.log('Reducer');
  return {
    processIDs: new Set([...Processes.keys()]),
    processReducers: Compiled.get('reducers'),
  };
}

/**
 * searchForProcesses
 * @param  {Object}   processes         [description]
 * @param  {Function} configure_handler [description]
 * @param  {String}   category          [description]
 *
 *  iterate through the received object and save any discovered processes into the
 *  Process Map.  As we move deeper into the object, the final uid of the given
 *  process is repesentative of the path.
 *
 *  { foo: { bar: MyProcess } } -> 'foo.bar.MyProcess'
 *
 */
function searchForProcesses(processes, configure_handler, category) {
  for (const processCategory in processes) {
    const nextCategory =
      `${(category && `${category}.`) || ''}` + processCategory;
    const processClass = processes[processCategory];
    formatProcessCategory(
      category,
      processCategory,
      nextCategory,
      processClass,
      configure_handler,
    );
  }
}

/**
 * formatProcessCategory
 * @param {String} category
 * @param {String} processCategory
 * @param {String} nextCategory
 * @param {Process || Object || Function} processClass
 * @param {Function} configure_handler
 */
function formatProcessCategory(
  category,
  processCategory,
  nextCategory,
  processClass,
  configure_handler,
) {
  if (isProcess(processClass)) {
    // parse the received Process and compile if needed
    return handleDiscoveredProcess(nextCategory, processClass);
  } else if (
    typeof processClass === 'function' &&
    typeof configure_handler === 'function'
  ) {
    return configureProcess(
      processClass,
      processCategory,
      nextCategory,
      configure_handler,
    );
  } else if (_.isPlainObject(processClass)) {
    // check the next level for processes
    return searchForProcesses(processClass, configure_handler, nextCategory);
  }
}

/**
 * configureProcess
 * @param  {[type]} processClassFactory The function that will return a Process
 *                                      when called with the users configuration.
 * @param  {[type]} processCategory     The current category of our Process.
 * @param  {[type]} nextCategory        The next category if we are further nested.
 * @param  {Function} configure_handler A function the user provides to configure a process
 *                                      factory.
 *
 *   When we encounter a function during the build process which is not a Process
 *   itself, we will call the users configure_handler with the information about
 *   the Process
 */
function configureProcess(
  processClassFactory,
  processCategory,
  nextCategory,
  configure_handler,
) {
  const configured_process = configure_handler(
    processClassFactory,
    processCategory,
    nextCategory,
  );

  if (isProcess(configured_process)) {
    // If the configure_handler returns a valid process then we will use it
    return handleDiscoveredProcess(nextCategory, configured_process);
  } else if (
    _.isPlainObject(configured_process) &&
    isProcess(configured_process.process)
  ) {
    return handleDiscoveredProcess(
      nextCategory,
      formatConfiguredProcessObject(configured_process),
    );
  }
}

/**
 * formatConfiguredProcessObject
 * @param  {Process || Object} configured_process
 * @return {Process}
 */
function formatConfiguredProcessObject(configured_process) {
  const processClass = configured_process.process;
  for (const processProperty of Object.keys(configured_process)) {
    /*
      If we receive an object of properties we add them as static
      properties to the Process for the user.
     */
    if (processProperty === 'process') {
      continue;
    }
    processClass[processProperty] = configured_process[processProperty];
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
      compileOption[option](
        value,
        Processes,
        ProcessSchema,
        SharedSchema,
        Compiled,
      );
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
