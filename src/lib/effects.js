import { spawn, fork } from 'redux-saga/effects'
import { createActions } from './createActions'
import { createSelector } from 'reselect'
import { combineReducers } from 'redux'

const props = { compiled: false, mergeReducers: true }

const processName = o => Object.getPrototypeOf(o) && Object.getPrototypeOf(o).name

function* runProcesses(categories) {
  for ( const categoryID in categories ) {
    const category = categories[categoryID]
    if ( typeof category !== 'object' ) { continue }
    if ( processName(category) === 'redux-saga-process-class' ) {
      yield fork(runProcess, category)
    } else {
      for ( const processID in category ) {
        const process = category[processID]
        if ( processName(process) === 'redux-saga-process-class' ) {
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
  yield spawn(SagaProcess.call(SagaProcess.__utils.init, process))
}

const buildProcesses = (categories) => {
  if ( typeof categories !== 'object' ) { throw new Error('buildProcesses expects an object') }
  const processes = {
    reducers: {},
    initialState: {},
    context: {}
  }
  for ( const categoryID of Object.keys(categories) ) {
    const category = categories[categoryID]
    if ( typeof category !== 'object' ) { continue }
    if ( processName(category) === 'redux-saga-process-class' ) {
      const compiled = buildProcess(process)
      parseCompiledProcess(compiled, processes)
    } else {
      for ( const processID in category ) {
        const process = category[processID]
        if ( processName(process) === 'redux-saga-process-class' ) {
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
      processes.reducers[reducerName] = generateArrayMapReducer(
        processes.initialState[reducerName],
        reducer.map(r => generateObjectMapReducer(undefined, r, undefined)),
        processes.context[reducerName]
      )
    } else if ( isObjLiteral(reducer) ) {
      processes.reducers[reducerName] = generateObjectMapReducer(
        processes.initialState[reducerName],
        reducer,
        processes.context[reducerName]
      )
    } else { throw new Error('Failed to Build Reducer: ', reducerName, processes.reducers) }
  }
  props.compiled = true
  return {
    reducerNames:  Object.keys(processes.reducers),
    reducer:       combineReducers(processes.reducers),
    initialStates: processes.initialState
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

const isObjLiteral = o => ( o !== null && ! Array.isArray(o) && typeof o !== 'function' && typeof o === 'object' )

/*
  Creates a function which is initialized with the following values:
    initialState - The initial state that should be used if the value of state
                   is falsey.
    reducers     - An array of functions that will be called with the received
                   values for each.  Expects the response to be a new and optionally 
                   modified state (no mutations).
    
    The resulting function provides a redux-compatible reducer.  Redux can call it like
    any other reducer and they will get the result of reducing the reducer.  Optionally 
    pass in a context value which will be merged with the context at creation time and
    be passed to all children.
    
    
*/
const generateArrayMapReducer = 
  ( initialState, reducers, pcontext ) =>  ( state = initialState, action, context ) =>
  ( reducers.reduce( (p, c)  => c(p, action, { ...pcontext, ...context }), state ) )

const generateObjectMapReducer = 
  (initialState, handlers = {}, pcontext) => (state = initialState, action, context) => 
  {
    if ( ! action || ! action.type || ! handlers[action.type] ) return state
    return handlers[action.type](state, action, { ...pcontext, ...context })
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


// const generateActionFilterReducer =
//   ( initialState, reducer, rules, pcontext ) => ( state = initialState, action, context ) =>
//   ( Object.keys(rules).map(rule => {
    
//   }))
//   generateActionFilterReducer(
//     { value: 0 },
//     generateArrayMapReducer(
//       { value: 0 }, 
//       [
//         (s, a, c) => ({ ...s, status: 'Over Twenty' })
//       ]
//     ),
//     [
//       [ 
//         { key: 'type', op: 'match', options: { nocase: true } }, 
//         [ 'REQUEST*', '*FAILURE' ]
//       ],
//       [ 
//         { key: 'myKey' }, 
//         [ 'exists', 'number', (s, a, c) => s.myKey >= 20 ] 
//       ],
//       [ 'anotherKey', 'exists' ]
//     ]
//   ),
  
// const reducerContext = { 
//   myKey:      { default: 'value' }, 
//   anotherKey: { default: 'another-value' },
//   foo:        { default: 'foo-default' }
// }

// const exampleReducersArray = [
//   (state, action, context) => (
//     action.type !== 'MY_TYPE'
//       ? state : {
//         ...state,
//         myKey: action.value || context.myKey.default
//       }
//   ),
//   generateObjectMapReducer(
//     // initialState
//     { value: 0 },
//     // Object-Map Reducer
//     {
//       'MY_TYPE': (state, action, context) => ({
//         ...state,
//         anotherKey: action.value || context.anotherKey.default
//       }),
//       'ANOTHER_TYPE': (state, action, context) => (
//         ! action.value && state || 
//         action.value > 20 
//           ? { ...state, status: 'Over Twenty'  }  : 
//             { ...state, status: 'Under Twenty' }
//       )
//     },
//     // Parent / generator Context
//     reducerContext
//   ),
//   generateArrayMapReducer(
//     { value: 0 },
//     [
//       (state, { type, ...action}, context) => {
//         switch(type) {
//           case 'FOO':
//             return {
//               ...state,
//               foo: context.tryHandler && action.handler 
//                 ? action.handler(state, { type, ...state }, context) :
//                   action.value
//             }
//           case 'BAR':
//             return {
//               ...state,
//               bar: context.disableBar
//                 ? null :
//                   action.value
//             }
//           default: return state
//         }
//       }
//     ],
//     { tryHandler: true, disableBar: true }
//   )
// ]



export { runProcesses, runProcess, buildProcesses, processName }