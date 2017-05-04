
var props = {
  compiled: false,
  mergeReducers: true,
  useRegistry: true,
  wildcardMatch: true,
  ssr: true,
  hot: true,
  log: false
}

const configProcess = config => ( config &&  ( props = { ...props, ...config } ) )

const isObjLiteral =
  o => ( o !== null && ! Array.isArray(o) && typeof o !== 'function' && typeof o === 'object' )

// const toReduxType =
//   str => isReduxType(str) ? str : str.replace(/(?!^)([A-Z])/g, '_$1').toUpperCase()

const toReduxType = str => formatType(str)

const isReduxType = str => /\b[A-Z]+(_[A-Z]+)*\b/.test(str)

const cancellablePromise = (p, onCancel, CANCEL) => {
  p[CANCEL] = onCancel // eslint-disable-line
  return p
}

/*
  Give a best effort to make the type formatting as reliable as possible.
  We start by splitting the string into upper case and lowercase elements.
  Then we iterate through the value and try to determine how we need to
  format it.

  We used to use:
  str => isReduxType(str) ? str : str.replace(/(?!^)([A-Z])/g, '_$1').toUpperCase()

  However, this led to certain situations causing an improperly formatted action.
  Specifically when not done properly (systemRX instead of systemRx).  In order to
  attempt to work in all situations we parse it with some logic instead.

  systemHeartbeat -> 'SYSTEM_HEARTBEAT'
  FormatThis -> 'FORMAT_THIS'
  systemRx -> 'SYSTEM_RX'
  systemRX -> 'SYSTEM_RX'
*/
function formatType (type) {
  if ( isReduxType(type) ) { return type }
  var buffer = '',
      list = type
              .split(/([A-Z]+|[a-z]+)/)
              .reduce(
                (a, c) => {
                  if ( c === '' ) { return a }
                  a.push(c)
                  return a
                }, []
              )
  if ( list.length === 1 ) { return type.toUpperCase() }
  let wasCapital = false
  for ( let e of list ) {
    if ( ! e.length  ) { continue }
    const isCapital = /[A-Z]/.test(e)
    e = e.toUpperCase()
    if ( isReduxType(e) ) {
      if ( buffer === '' ) {
        buffer += e
      } else {
        if ( isCapital && ! wasCapital ) {
          buffer += '_' + e
        } else if ( wasCapital && isCapital ) {
          buffer += e
        } else if ( wasCapital && ! isCapital ) {
          if ( buffer.slice(-2, -1) === '_' || buffer.slice(-2, -1) === '' ) {
            buffer += e
          } else { buffer = buffer.slice(0, -1) + '_' + buffer.slice(-1) + e }
        } else if ( wasCapital && ! isCapital ) {
          if ( buffer.slice(-2, -1) === '_' || buffer.slice(-2, -1) === '' ) {
            buffer += e
          } else { buffer += '_' + e }
        } else { buffer += '_' + e }
      }
    }
    wasCapital = isCapital
  }
  if ( isReduxType(buffer) ) {
    return buffer
  }
}

export { isObjLiteral, toReduxType, isReduxType, props, configProcess, cancellablePromise }
