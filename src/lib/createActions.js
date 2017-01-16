import { isObjLiteral, toReduxType } from './helpers'

const buildTypes = types => {
  const compiled = {}
  for ( let type of types ) {
    const snakeCase     = toReduxType(type)
    compiled[type]      = snakeCase
  }
  return compiled
}

const buildCreator = (type, keys) => (...args) => {
  var i = 0, compiled = { type }
  if ( keys === null || typeof keys === undefined ) {
    compiled = { ...compiled, ...(isObjLiteral(args[0]) && args[0]) }
  } else if ( Array.isArray(keys) ) {
    for ( const key of keys ) { compiled[key] = args[i++] }
    if (args.length > keys.length && isObjLiteral(args[i + 1]))
      compiled = { ...compiled, ...args[i + 1] }
  } else if ( typeof keys === 'function' ) {
    compiled = { ...compiled, ...keys(...args) }
  } else if ( isObjLiteral(keys) ) { 
    compiled = { ...compiled, ...keys, ...(isObjLiteral(args[0]) && args[0]) } 
  } else { throw new Error('Dont know how to handle action: ', type, keys, args) }
  return compiled
}

const buildActions = (actions) => {
  const compiled = {}
  for ( let type in actions ) {
    compiled[type] = buildCreator(toReduxType(type), actions[type])
  }
  return compiled
}

const createActions = actions => {
  if ( ! actions ) { throw new Error('No Actions Received') }
  const _types = Object.keys(actions), _actions = Object.values(actions)
  const TYPES   = buildTypes(_types),
        ACTIONS = buildActions(actions)
  return { TYPES, ACTIONS }
}

export { createActions, toReduxType, buildCreator }