
var props = { compiled: false, mergeReducers: true, useRegistry: true, wildcardMatch: true, ssr: true }

const configProcess = config => ( config &&  ( props = { ...props, ...config } ) )

const isObjLiteral = 
  o => ( o !== null && ! Array.isArray(o) && typeof o !== 'function' && typeof o === 'object' )

const toReduxType = 
  str => isReduxType(str) ? str : str.replace(/(?!^)([A-Z])/g, '_$1').toUpperCase()
  
const isReduxType =
  str => /\b[A-Z]+(_[A-Z]+)*\b/.test(str)
  
const cancellablePromise = (p, onCancel, CANCEL) => {
  p[CANCEL] = onCancel // eslint-disable-line
  return p
}
    
export { isObjLiteral, toReduxType, isReduxType, props, configProcess, cancellablePromise }