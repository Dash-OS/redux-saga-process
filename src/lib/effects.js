import { spawn, fork } from 'redux-saga/effects'
import { createActions } from './createActions'
import { createSelector } from 'reselect'
import * as generate from './reducerGenerator'

const props = { compiled: false, mergeReducers: true }

const processName  = o => Object.getPrototypeOf(o) && Object.getPrototypeOf(o).name
const isObjLiteral = o => ( o !== null && ! Array.isArray(o) && typeof o !== 'function' && typeof o === 'object' )

function* runProcesses(categories) {
  for ( const categoryID in categories ) {
    const category = categories[categoryID]
    if ( typeof category !== 'object' ) { continue }
    if ( processName(category) === 'Process' ) {
      yield fork(runProcess, category)
    } else {
      for ( const processID in category ) {
        const process = category[processID]
        if ( processName(process) === 'Process' ) {
          yield fork(runProcess, process)
        } else { continue }
      }
    }
  }
}

function* runProcess(process) {
  if ( ! props.compiled ) { 
    console.warn('Did not connect to reducers before calling runProcesses, building the process now')
    buildProcess(process)
  }
  const { config = {} } = process
  const SagaProcess = new process(config)
  yield spawn(SagaProcess.__utils.init, process)
}

const buildProcesses = (categories) => {
  if ( ! isObjLiteral(categories) ) { throw new Error('buildProcesses expects an object') }
  const processes = {
    reducers: {},
    initialState: {},
    context: {}
  }
  for ( const categoryID of Object.keys(categories) ) {
    const category = categories[categoryID]
    if ( typeof category !== 'object' ) { continue }
    if ( processName(category) === 'Process' ) {
      const compiled = buildProcess(process)
      parseCompiledProcess(compiled, processes)
    } else {
      for ( const processID in category ) {
        const process = category[processID]
        if ( processName(process) === 'Process' ) {
          const compiled = buildProcess(process)
          parseCompiledProcess(compiled, processes)
        }
      }
    }
  }
  for ( const reducerName in processes.reducers ) {
    const reducer = processes.reducers[reducerName]
    if ( typeof reducer === 'function' ) {
      continue
    } else if ( Array.isArray(reducer) ) {
      processes.reducers[reducerName] = generate.arrayMapReducer(
        processes.initialState[reducerName],
        reducer.map(r => generate.objectMapReducer(undefined, r, undefined)),
        processes.context[reducerName]
      )
    } else if ( isObjLiteral(reducer) ) {
      processes.reducers[reducerName] = generate.objectMapReducer(
        processes.initialState[reducerName],
        reducer,
        processes.context[reducerName]
      )
    } else if ( typeof reducer === 'function' ) {
      processes.reducers[reducerName] = generate.reducerReducer(
        processes.initialState[reducerName],
        reducer,
        processes.context[reducerName]
      )
    } else { throw new Error('Failed to Build Reducer: ', reducerName, processes.reducers) }
  }
  props.compiled = true
  return {
    reducerNames:    Object.keys(processes.reducers),
    processReducers: processes.reducers,
    initialStates:   processes.initialState
  }
}

const buildProcess = process => {
  const compiled = {}
  if ( ! props.compiled ) {
    buildReducer(process, compiled)
    buildSelectors(process, compiled)
    buildActions(process, compiled)
    mutateProcess(process, compiled)
  }
  compiled.initialState = process.initialState
  return compiled
}

const buildReducer = ({ config = {}, initialState, reducer }, compiled = {}) => {
  if ( config.reduces ) {
    compiled.reducer = {
      name: config.reduces,
      reducer,
    }
    compiled.initialState = isObjLiteral(initialState) ?
      Object.assign({}, initialState) : initialState
  }
  return compiled
}

const buildSelectors = ({ selectors, config = {} }, compiled = {}) => {
  if ( ! props.compiled && selectors ) {
    if ( ! compiled.selectors ) { compiled.selectors = {} }
    for ( const selector in selectors ) {
      const selectorValue = selectors[selector]
      if ( Array.isArray(selectorValue) ) {
        if ( selectorValue.length === 1 ) {
          const coreSelector = config.reduces ? state => state[config.reduces] : state => state
          compiled.selectors[selector] = createSelector(coreSelector, ...selectors[selector])
        } else {
          compiled.selectors[selector] = createSelector(...selectors[selector])
        }
      } else { throw new Error('Process Selectors must be an array of selectors') }
    }
  }
  return compiled
}

const buildActions = (process, compiled = {}) => {
  const actions = process.actions && createActions(process.actions)
  if ( actions ) { 
    compiled.actions = actions.ACTIONS 
    compiled.types   = { ...compiled.types, ...actions.TYPES }
  }
  return compiled
}

const mutateProcess = (process, compiled) => {
  if ( compiled.actions   ) { process.actions   = compiled.actions   }
  if ( compiled.selectors ) { process.selectors = compiled.selectors }
  if ( compiled.types )     { process.types     = compiled.types     }
}
  
const mergeReducers = (compiled, processes) => {
  const name = compiled.reducer.name
  if ( ! props.mergeReducers ) {
    throw new Error(`Two processes are attempting to reduce the same key (${name}) in the state but mergeReducers is disabled.`)
  }
  if ( Array.isArray(processes.reducers[name]) ) {
    processes.reducers[name].push(compiled.reducer.reducer)
  } else {
    processes.reducers[name] = [
      processes.reducers[name],
      compiled.reducer.reducer
    ]
  }
  if ( processes.initialState[name] ) {
    processes.initialState[name] = {
      ...processes.initialState[name],
      ...compiled.initialState
    }
  } else { processes.initialState[name] = compiled.initialState }
}

const parseCompiledProcess = (compiled, processes) => {
  if ( compiled.reducer && compiled.reducer.name && compiled.reducer.reducer ) {
    const name = compiled.reducer.name
    if ( ! name ) { throw new Error('Reducer Does Not Have a Name? ', compiled) }
    if ( processes.reducers[name] ) {
      mergeReducers(compiled, processes)
    } else if ( name ) {
      processes.reducers[name]      = compiled.reducer.reducer
      processes.initialState[name]  = compiled.initialState
    }
  }
}

export { runProcesses, runProcess, buildProcesses, processName }