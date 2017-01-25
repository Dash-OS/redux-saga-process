import { spawn, fork } from 'redux-saga/effects'
import { createActions } from './createActions'
import { createSelector, createStructuredSelector } from 'reselect'
import { registerRecord } from './registry'
import * as generate from './reducerGenerators'

import { isReduxType, toReduxType, isObjLiteral, props } from './helpers'
import { hasWildcard } from './wildcard'

const processName  = o => Object.getPrototypeOf(o) && Object.getPrototypeOf(o).name


function* runProcesses(categories) {
  for ( const categoryID in categories ) {
    const category = categories[categoryID]
    if ( 
      processName(category) !== 'Process' &&
      typeof category !== 'object' 
    ) { continue }
    if ( processName(category) === 'Process') {
      isProcessActive(category) && ( yield fork(runProcess, category) )
    } else {
      for ( const processID in category ) {
        const proc = category[processID]
        if ( processName(proc) === 'Process' ) {
          isProcessActive(proc) && ( yield fork(runProcess, proc) )
        } else { continue }
      }
    }
  }
}

const isProcessActive = ({ config = {} }) => (
     config.enabled === false
  || process.env.IS_NODE === true && config.ssr === false
    ? false
    : true
)

function* runProcess(proc) {
  if ( ! props.compiled ) { 
    console.warn('Did not connect to reducers before calling runProcesses, building the process now')
    buildProcess(proc)
  }
  const { config = {} } = proc
  const SagaProcess = new proc(config)
  yield spawn(SagaProcess.__utils.init, proc)
}

function buildProcesses(categories) {
  if ( typeof window !== 'object' && props.ssr === false ) {
    console.info('Processes have been set to only run on the client, cancelling build')
    return
  }
  if ( ! isObjLiteral(categories) ) { throw new Error('buildProcesses expects an object') }
  const processes = {
    reducers: {},
    initialState: {},
    context: {},
  }
  for ( const categoryID of Object.keys(categories) ) {
    const category = categories[categoryID]
    if ( 
      processName(category) !== 'Process' &&
      typeof category !== 'object' 
    ) { continue }
    if ( processName(category) === 'Process' ) {
      const compiled = isProcessActive(category) && buildProcess(category)
      if ( ! compiled ) { continue }
      parseCompiledProcess(compiled, processes)
    } else {
      for ( const processID in category ) {
        const proc = category[processID]
        if ( processName(proc) === 'Process' ) {
          const compiled = isProcessActive(proc) && buildProcess(proc)
          if ( ! compiled ) { continue }
          parseCompiledProcess(compiled, processes)
        }
      }
    }
  }
  
  const buildObjectMapReducer = (reducerName, reducer, initialState, ctx) => {
    processes.reducers[reducerName] = 
      props.wildcardMatch && hasWildcard(reducer)
        ? generate.wildcardMapReducer(initialState, reducer, ctx)
        : generate.objectMapReducer(initialState, reducer, ctx)
  }
  
  for ( const reducerName in processes.reducers ) {
    const reducer = processes.reducers[reducerName]
    if ( typeof reducer === 'function' ) {
      continue
    } else if ( Array.isArray(reducer) ) {
      processes.reducers[reducerName] = generate.arrayMapReducer(
        processes.initialState[reducerName],
        reducer.map(r => 
          props.wildcardMatch && hasWildcard(r)
            ? generate.wildcardMapReducer(undefined, r, undefined)
            : generate.objectMapReducer(undefined, r, undefined)
        ),
        processes.context[reducerName]
      )
    } else if ( isObjLiteral(reducer) ) {
      buildObjectMapReducer(
        reducerName, reducer, 
        processes.initialState[reducerName],
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

function buildProcess(proc) {
  const compiled = {}
  if ( ! props.compiled ) {
    buildReducer(proc, compiled)
    buildSelectors(proc, compiled)
    buildActions(proc, compiled)
    buildActionRoutes(proc, compiled)
    mutateProcess(proc, compiled)
    props.useRegistry && registerRecord(proc)
  } else {
    /* Already compiled this process, return compiled data */
    if ( proc.reducer ) { compiled.reducer = proc.reducer }
    if ( proc.actions ) { compiled.actions = proc.actions }
    if ( proc.selectors ) { compiled.selectors = proc.selectors }
    if ( proc.types ) { compiled.types = proc.types }
    compiled.cached = true
  }
  compiled.initialState = proc.initialState
  return compiled
}

const buildReducer = ({ config = {}, initialState, reducer }, compiled = {}) => {
  if ( config.reduces ) {
    let name
    if ( Array.isArray(config.reduces) ) {
      name = config.reduces[0]
    } else { name = config.reduces }
    compiled.reducer = { name, reducer: {} }
    if ( Array.isArray(config.reducer) ) {
      compiled.reducer.context = { path: config.reduces[1] }
    }
    if ( typeof reducer === 'function' ) {
      compiled.reducer.reducer = reducer
    } else if ( isObjLiteral(reducer) ) {
      for ( const type in reducer ) {
        const key = toReduxType(type)
        compiled.reducer.reducer[key] = reducer[type]
      }
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
      } else if ( isObjLiteral(selectorValue) ) {
        compiled.selectors[selector] = createStructuredSelector(selectors[selector])
        
      } else { throw new Error('Process Selectors must be an array of selectors') }
    }
  }
  return compiled
}

const buildActions = (proc, compiled = {}) => {
  const creators = proc.actionCreators || proc.actions
  const actions = creators && createActions(creators)
  if ( actions ) { 
    compiled.actions = actions.ACTIONS 
    compiled.types   = { ...compiled.types, ...actions.TYPES }
  }
  return compiled
}

const buildActionRoutes = (proc, compiled = {}) => {
  const actionRoutes = proc.actionRoutes
  if ( ! actionRoutes ) { return compiled }
  compiled.actionRoutes = {}
  for (let route in actionRoutes) {
    compiled.actionRoutes[toReduxType(route)] = actionRoutes[route]
  }
}

const mutateProcess = (process, compiled) => {
  if ( compiled.reducer )      { process.reducer   = compiled.reducer   }
  if ( compiled.actions   )    { process.actions   = compiled.actions   }
  if ( compiled.selectors )    { process.selectors = compiled.selectors }
  if ( compiled.types )        { process.types     = compiled.types     }
  if ( compiled.actionRoutes ) { process.actionRoutes = compiled.actionRoutes }
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
  if ( compiled.reducer && compiled.reducer.reducer ) {
    const name = compiled.reducer.name
    if ( ! name ) { throw new Error('Reducer Does Not Have a Name? ', compiled) }
    if ( processes.reducers[name] ) {
      mergeReducers(compiled, processes)
    } else {
      processes.reducers[name]      = compiled.reducer.reducer
      processes.initialState[name]  = compiled.initialState || {}
    }
  }
}

export { runProcesses, runProcess, buildProcesses, processName }