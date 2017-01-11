const toReduxType = str => str.replace(/(?!^)([A-Z])/g, '_$1').toUpperCase()

const buildTypes = types => {
  const compiled = {}
  for ( let type of types ) {
    const snakeCase     = toReduxType(type)
    compiled[snakeCase] = snakeCase
    compiled[type]      = snakeCase
  }
  return compiled
}

const buildCreator = (type, keys) => (...args) => {
  var i = 0, compiled = { type }
  if ( Array.isArray(keys) ) {
    for ( const key of keys ) { compiled[key] = args[i++] }
  } else if ( typeof keys === 'function' ) {
    compiled = { ...compiled, ...keys(...args) }
  } else { compiled = { ...compiled, ...keys } }
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