import { spawn, fork } from 'redux-saga/effects'
import { createActions } from './createActions'
import { createSelector, createStructuredSelector } from 'reselect'
import { registerRecord } from './registry'
import * as generate from './reducerGenerators'

import { isReduxType, toReduxType, isObjLiteral, props } from './helpers'
import { hasWildcard } from './wildcard'

const isProcess  = o => Object.getPrototypeOf(o) && Object.getPrototypeOf(o).isProcess === true;

const isSSR =
  ( typeof window === undefined || typeof window !== 'object' || ! window || ! window.document )

function* runProcesses(categories) {
  for ( const categoryID in categories ) {
    const category = categories[categoryID]
    if ( 
      isProcess(category) !== true &&
      typeof category !== 'object' 
    ) { continue }
    if ( isProcess(category) === true ) {
      isProcessActive(category) && ( yield fork(runProcess, category) )
    } else {
      for ( const processID in category ) {
        const proc = category[processID]
        if ( isProcess(proc) === true ) {
          isProcessActive(proc) && ( yield fork(runProcess, proc) )
        } else { continue }
      }
    }
  }
}

const isProcessActive = ({ config = {} }) => (
     config.enabled === false
  || ( isSSR && config.ssr === false )
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
  if ( isSSR && props.ssr === false ) {
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
      isProcess(category) !== true &&
      typeof category !== 'object' 
    ) { continue }
    if ( isProcess(category) === true ) {
      const compiled = isProcessActive(category) && buildProcess(category)
      if ( ! compiled ) { continue }
      parseCompiledProcess(compiled, processes)
    } else {
      for ( const processID in category ) {
        const proc = category[processID]
        if ( isProcess(proc) === true ) {
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
  let deferredSelectors = []
  const coreSelector = config.reduces 
    ? state => state[config.reduces] 
    : state => state
  if ( ! props.compiled && selectors ) {
    if ( ! compiled.selectors ) { compiled.selectors = { public: {}, private: {} } }
    for ( const _selector in selectors ) {
      const scope         = _selector.startsWith('!') ? 'private' : 'public',
            selector      = _selector.replace(/^!/, ''),
            selectorValue = selectors[_selector]
      if ( Array.isArray(selectorValue) ) {
        const deferCreation = selectorValue.some(s => typeof s === 'string')
        if ( deferCreation ) {
          deferredSelectors.push({
            scope, selector, selectorValue
          })
          continue
        }
        if ( selectorValue.length === 1 ) {
          compiled.selectors[scope][selector] = createSelector(coreSelector, ...selectorValue)
        } else {
          compiled.selectors[scope][selector] = createSelector(...selectorValue)
        }
      } else if ( isObjLiteral(selectorValue) ) {
        compiled.selectors[scope][selector] = createStructuredSelector(selectorValue)
      } else { throw new Error('Process Selectors must be an array or object of selectors') }
    }
  }
  // We defer selector creation when a composed selector is discovered (by providing a string reference)
  // This allows us to nest selectors.
  for ( let deferredSelector of deferredSelectors ) {
    const { scope, selector, selectorValue: _selectorValue } = deferredSelector
    if ( _selectorValue.length === 1 ) {
      throw new Error('[PROCESS BUILD ERROR - Selectors]: Composed Selectors may not be a single element, it makes no sense.')
    } else {
      const selectorValue = composeSelector(deferredSelector, compiled)
      compiled.selectors[scope][selector] = createSelector(...selectorValue)
    }
  }
  return compiled
}

const composeSelector = ({ selectorValue }, compiled) => {
  return selectorValue.map(value => {
    // We need to replace strings with our composed selectors
    if ( typeof value !== 'string' ) { return value }
    const composed = compiled.selectors.public[value] || compiled.selectors.private[value]
    if ( ! composed ) {  throw new Error(`[PROCESS BUILD ERROR - Selectors]: Failed to discover composed selector: ${value}`)  }
    return composed
  })
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

export { runProcesses, runProcess, buildProcesses, isProcess }