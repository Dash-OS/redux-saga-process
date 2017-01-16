import { Wildcard } from './wildcard'

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
  arrayMapReducer, 
  objectMapReducer, 
  nestedObjectMapReducer, 
  reducerReducer, 
  wildcardMapReducer
}