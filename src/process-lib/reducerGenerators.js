import { Wildcard } from './wildcard'

// const WC = new Wildcard()
//   .logic('and')
//   .case(false)
//   .pattern({ 'NETWORK*': 'yes', 'FOO': 'no', '*REQUEST': 'ok' })
//   .search('network_request')
//   //.filter('NETWORK_REQUEST')
//   //.pattern('NETWORK*')
//   //.filter({ 'NETWORK*': 'yes', 'FOO': 'no' })
//   //.pattern({ 'NETWORK*': 'win', '*REQUEST': 'win', 'NO': 'fail' })
//   //.pattern(['*NETWORK*', 'REQUEST', '*REQUEST'])
//   //.pattern('*NETWORK*')
//   //.filter(['One NETWORK', 'NETWORK', 'foo', 'bar', 'network'])
//   //.filter(['NETWORK', 'REQUEST', 'FOO'])

// console.log(WC)

const nilReducer =
  ( initialState = {} ) =>  ( state = initialState ) => state

const arrayMapReducer =
  ( initialState, reducers, pcontext ) =>  ( state = initialState, action, context ) =>
  ( reducers.reduce( (p, c)  => c(p, action, { ...pcontext, ...context }), state ) )

const objectMapReducer =
  (initialState, handlers = {}, pcontext) => (state = initialState, action, context) =>
  {
    if ( ! action || ! action.type || ! handlers[action.type]  ) return state
    return handlers[action.type](state, action, { ...pcontext, ...context })
  }

const wildcardMapReducer =
  (initialState, handlers = {}, pcontext) => {
    const wcMatcher = new Wildcard(handlers)
    return (state = initialState, action, context) =>
      {
        if ( ! action || ! action.type ) return state
        const matches = wcMatcher.search(action.type)
        return Object.keys(matches).reduce( (p, c) =>
          matches[c](p, action, { ...pcontext, ...context })
        , state )
      }
  }

const reducerReducer =
  ( initialState, reducer, pcontext ) => ( state = initialState, action, context ) =>
  ( reducer(state, action, { ...pcontext, ...context }) )

const nestedObjectMapReducer =
  (initialState, handlers = {}, pcontext ) => ( state = initialState, action, context) =>
  {
    if ( ! action || ! action.type || ! handlers[action.type] ) return state
    const _context = { ...pcontext, ...context }
    const { path } = _context
    if ( ! path ) return state
    const childState = handlers[action.type](state[path], action, _context)
    return {
      ...state,
      [path]: childState
    }
  }

export {
  nilReducer,
  arrayMapReducer,
  objectMapReducer,
  nestedObjectMapReducer,
  reducerReducer,
  wildcardMapReducer
}