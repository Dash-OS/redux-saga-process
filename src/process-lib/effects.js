import { spawn, fork, call, take } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import { createActions } from './createActions'
import { createSelector, createStructuredSelector } from 'reselect'
import { registerRecord } from './registry'
import * as generate from './reducerGenerators'

import { isReduxType, toReduxType, isObjLiteral, props } from './helpers'
import { hasWildcard } from './wildcard'

const isProcess  = o => Object.getPrototypeOf(o) && Object.getPrototypeOf(o).isProcess === true;

const isSSR =
  ( typeof window === undefined || typeof window !== 'object' || ! window || ! window.document )

function* runProcesses(categories, rebuild = false) {
  for ( const categoryID in categories ) {
    const category = categories[categoryID]
    if (
      isProcess(category) !== true &&
      typeof category !== 'object'
    ) { continue }
    if ( isProcess(category) === true ) {
      isProcessActive(category) && ( yield fork(runProcess, category, rebuild) )
    } else {
      for ( const processID in category ) {
        const proc = category[processID]
        if ( isProcess(proc) === true ) {
          isProcessActive(proc) && ( yield fork(runProcess, proc, rebuild) )
        } else { continue }
      }
    }
  }
}

// This will allow pushing events into the processes for development
// function* buildCommChannel() {
//   if ( ! IPC ) {
//     if ( module.hot ) {
//       // Create our event emitter
//       const chan = eventChannel( emitter => {
//         ExternalEventEmitter = emitter
//         window.chan = emitter
//         return () => {
//           ExternalEventEmitter = undefined
//         }
//       } )
//       while(true) {
//         const action = yield take(chan)
//         console.log('External Action: ', action)
//       }
//     }
//   }
// }

const isProcessActive = ({ config = {} }) => (
     config.enabled === false
  || ( isSSR && config.ssr === false )
    ? false
    : true
)

function* runProcess(proc, rebuild = false) {
  if ( ! props.compiled ) {
    if ( props.log ) {
      console.warn('[rsp] Did not connect to reducers before calling runProcesses, building the process now')
    }
    buildProcess(proc)
  }
  const { config = {}, runningProcess } = proc

  let SagaProcess, state
  if ( runningProcess && ! rebuild ) {
    // We still want to rebuild the process, but we will move
    // its entire state to the newly built class when we rebuild.
    state = runningProcess.state
    // SagaProcess = runningProcess
    SagaProcess = new proc(config, state)
  } else {
    SagaProcess = new proc(config, state)
  }

  proc.runningProcess = SagaProcess
  yield fork(SagaProcess.__utils.init, proc)
}

function buildProcesses(categories) {
  if ( module.hot && props.hot === true ) {
    // if we are hot reloading and our config specifies to hot reload:
    props.compiled = false
  }
  if ( props.ssr === false && isSSR ) {
    if ( props.log ) {
      console.info('[rsp] Processes have been set to only run on the client, cancelling build')
    }
    return
  }
  if ( ! isObjLiteral(categories) ) { throw new Error('[rsp] buildProcesses expects an object') }
  const processes = {
    reducers:     {},
    initialState: {},
    context:      {},
  }
  for ( const categoryID of Object.keys(categories) ) {
    const category = categories[categoryID]
    if (
         isProcess(category) !== true
      && typeof category !== 'object'
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
    } else if ( isObjLiteral(reducer) && Object.keys(reducer).length > 0 ) {
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
    } else {
      //throw new Error('[rsp] Failed to Build Reducer: ', reducerName, processes.reducers)

    }
  }
  // if ( ! processes.reducers ) {
  //   // We want to provide at least one reducer so we don't get an error
  //   // when using this with combineReducers.
  //   processes.reducers._e = generate.emptyReducer
  // }
  props.compiled = true

  return {
    reducerNames:    Object.keys(processes.reducers),
    processReducers: processes.reducers,
    initialStates:   processes.initialState
  }
}

function buildProcess(proc) {
  const compiled = {}
  if ( ( ! proc.isCompiled && ! props.compiled ) ) {
    // console.log('Building')
    buildReducer(proc, compiled)
    buildSelectors(proc, compiled)
    buildActions(proc, compiled)
    buildActionRoutes(proc, compiled)

    mutateProcess(proc, compiled)
    props.useRegistry && registerRecord(proc)

    proc.isCompiled = true
  } else {
    // console.log('Return Mutated: ', proc.actions, proc.actionRoutes)
    buildReducer(proc, compiled)
    /* Already compiled this process, return compiled data */
    if ( proc.actions )    { compiled.actions   = proc.actions }
    if ( proc.actionRoutes ) { compiled.actionRoutes = proc.actionRoutes } else {
      buildActionRoutes(proc, compiled)
    }
    if ( proc.selectors )    { compiled.selectors = proc.selectors  }
    if ( proc.types     )    { compiled.types     = proc.types      }
  }
  compiled.initialState = proc.initialState
  return compiled
}

const buildReducer = ({ config = {}, initialState, reducer, name, ...proc }, compiled = {}) => {
  if ( config.reduces && reducer ) {
    compiled.reducer = {
      reduces:      config.reduces,
      reducer:      undefined,
      initialState: undefined,
    }
    let preReducer, preState
    if ( Array.isArray(config.reduces) ) {
      // When we have an array then we indicate that we want to reduce multiple
      // keys in the store.  We split the reducers appropriately and will distribute
      // them once we reach the higher-level handlers.
      if ( ! isObjLiteral(reducer) ) {
        // We expect that the reducer property is an object literal
        // mapping the given keys to a reducer property.
        throw new Error(`[rsp] | Process (${name}) indicates that it reduces multiple keys but the reducer property is not an object literal mapping the keys to reducers.`)
      }
      preReducer = [], preState = []
      for ( let reducerKey of config.reduces ) {
        // Each key that we reduce will be reduced like any other reducer that we
        // allow.
        if ( ! reducer[reducerKey] ) {
          // We can't reduce a reducer that doesn't exist!
          throw new Error(`[rsp] | Process ${name} indicates that it reduces ${reducerKey} but does not provide a reducer for it! You have provided ${Object.keys(reducer)}`)
        }
        // Push our reducers into the compiled reducers in the same order that they are defined.
        const parsedReducer = parseReducer(reducer[reducerKey])
        preReducer.push(parsedReducer)
        if ( initialState && initialState[reducerKey] ) {
          // If we have an initialState for this reducer then we will add it,
          // otherwise we provide an empty object literal.
          preState.push(
            isObjLiteral(initialState[reducerKey])
              ? Object.assign({}, initialState[reducerKey])
              : initialState[reducerKey]
          )
        } else { preState.push({}) }
      }
    } else {
      preReducer = parseReducer(reducer)
      preState   = isObjLiteral(initialState)
        ? Object.assign({}, initialState)
        : initialState
    }
    compiled.reducer.reducer      = preReducer
    compiled.reducer.initialState = preState
  } else if ( config.reduces && ! reducer ) {
    if ( props.log ) {
      console.warn(`[rsp] | Process ${name && `(${name})`} indicates that it reduces "${config.reduces.toString()}" but does not provide a reducer.  This will be ignored.`)
    }
  }
  return compiled
}

const parseReducer = (reducer) => {
  let parsed
  if ( typeof reducer === 'function' ) {
    parsed = reducer
  } else if ( isObjLiteral(reducer) ) {
    parsed = {}
    for ( const type in reducer ) {
      parsed[toReduxType(type)] = reducer[type]
    }
  } else {
    // We will likely need to handle arrays better and possibly other values
    parsed = reducer
  }
  return parsed
}

const buildSelectors = ({ selectors, config = {} }, compiled = {}) => {
  let deferredSelectors = []

  const coreSelector = config.reduces
    ? (state, props) => state[config.reduces]
    : (state, props) => state
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
          compiled.selectors[scope][selector] =
            () => createSelector(coreSelector, ...selectorValue)
        } else {
          compiled.selectors[scope][selector] =
            () => createSelector(...selectorValue)
        }
      } else if ( isObjLiteral(selectorValue) ) {
        compiled.selectors[scope][selector] =
          () => createStructuredSelector(selectorValue)
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
      compiled.selectors[scope][selector] =
        () => createSelector(...selectorValue)
    }
  }
  return compiled
}

const composeSelector = ({ selectorValue }, compiled) => {
  return selectorValue.map(value => {
    // We need to replace strings with our composed selectors
    if ( typeof value !== 'string' ) { return value }
    const composed = compiled.selectors.public[value] || compiled.selectors.private[value]
    if ( ! composed ) {  throw new Error(`[rsp - Selectors]: Failed to discover composed selector: ${value}`)  }
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
  if ( compiled.actions   )    { process.actions      = compiled.actions      }
  if ( compiled.selectors )    { process.selectors    = compiled.selectors    }
  if ( compiled.types )        { process.types        = compiled.types        }
  if ( compiled.actionRoutes ) { process.actionRoutes = compiled.actionRoutes }
}

const parseCompiledProcess = (compiled, processes) => {
  if ( compiled.reducer ) {
    const reduces = compiled.reducer.reduces
    if ( compiled.reducer.reducer ) {
      if ( ! reduces ) { throw new Error('[rsp] Reducer Does Not Have a Reduces Value, this should not have occurred?') }
      // What type does our reduces value have?
      if ( Array.isArray(reduces) ) {
        // When we have an array then we are actually reducing multiple keys in
        // the store and need to map them appropriately.
        let i = 0
        for ( let reducerKey of reduces ) {
          const initialState = compiled.reducer.initialState[i],
                reducer      = compiled.reducer.reducer[i]
          parseCompiledReducer(reducerKey, reducer, initialState, processes)
          i++
        }
      } else {
        parseCompiledReducer(reduces, compiled.reducer.reducer, compiled.reducer.initialState, processes)
      }
    }
  }
}

const parseCompiledReducer = (name, reducer, initialState = {}, processes) => {
  // Received the compiled reducer, check if we need to merge with other reducers,
  // then save to our processes object.
  if ( processes.reducers[name] ) {
    mergeReducers(name, reducer, initialState, processes)
  } else {
    processes.reducers[name]     = reducer
    processes.initialState[name] = initialState
  }
}


const mergeReducers = (name, reducer, initialState = {}, processes) => {
  if ( ! props.mergeReducers ) {
    throw new Error(`[rsp] Two processes are attempting to reduce the same key (${name}) in the state but mergeReducers is disabled.`)
  }
  if ( Array.isArray(processes.reducers[name]) ) {
    processes.reducers[name].push(reducer)
  } else {
    processes.reducers[name] = [
      processes.reducers[name],
      reducer
    ]
  }
  if ( processes.initialState[name] ) {
    processes.initialState[name] = {
      ...processes.initialState[name],
      ...initialState
    }
  } else { processes.initialState[name] = initialState }
}

export { runProcesses, runProcess, buildProcesses, isProcess }

