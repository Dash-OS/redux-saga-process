
var props = { compiled: false, mergeReducers: true, useContext: false, wildcardMatch: true }

const configProcess = config => ( config &&  ( props = { ...props, ...config } ) )

const isObjLiteral = 
  o => ( o !== null && ! Array.isArray(o) && typeof o !== 'function' && typeof o === 'object' )

const toReduxType = 
  str => isReduxType(str) ? str : str.replace(/(?!^)([A-Z])/g, '_$1').toUpperCase()
  
const isReduxType =
  str => /\b[A-Z]+(_[A-Z]+)*\b/.test(str)
  

    
export { isObjLiteral, toReduxType, isReduxType, props, configProcess }