const arrayMapReducer = 
  ( initialState, reducers, pcontext ) =>  ( state = initialState, action, context ) =>
  ( reducers.reduce( (p, c)  => c(p, action, { ...pcontext, ...context }), state ) )

const objectMapReducer = 
  (initialState, handlers = {}, pcontext) => (state = initialState, action, context) => 
  {
    if ( ! action || ! action.type || ! handlers[action.type] ) return state
    return handlers[action.type](state, action, { ...pcontext, ...context })
  }
  
const reducerReducer =
  ( initialState, reducer, pcontext ) => ( state = initialState, action, context ) =>
  ( reducer(state, action, { ...pcontext, ...context }) )
  
export { arrayMapReducer, objectMapReducer, reducerReducer }