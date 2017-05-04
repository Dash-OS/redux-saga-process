const isObjLiteral =
  o => ( o !== null && ! Array.isArray(o) && typeof o !== 'function' && typeof o === 'object' )

// const REXPS = {
//   hasWildcard: /\*/,
// }

const hasWildcard = (pattern) => (
  typeof pattern === 'string'
    ? pattern.includes('*')
    : Array.isArray(pattern)
      ? pattern.some(x => x.includes('*') )
      : isObjLiteral(pattern)
        ? hasWildcard(Object.keys(pattern))
        : false
)

class Wildcard {

  constructor(str) {
    this.config = {
      matchLogic: 'and',
      matchCase:  true
    }
    if (str) this.pattern(str)
    return this
  }

  static toPattern(patterns, config = { matchLogic: 'and', matchCase: true }) {
    typeof patterns === 'string' && ( patterns = [patterns] )
      || isObjLiteral(patterns) && ( patterns = Object.keys(patterns) )
    var compiledRE = ''
    for ( let pattern of patterns ) {
      compiledRE !== '' && config.matchLogic === 'or' && (compiledRE += '|')
      const re = ['^']
      let index = 0
      for ( const char of pattern.split('') ) {
        if ( index === 0 ) {
          if ( char === '!' ) {
            re.push('(?!')
            index++
            continue
          } else {
            re.push('(?=')
          }
        }
        if ( char === '*' ) {
          re.push('.*?')
        } else {
          re.push(char)
        }
        index++
      }
      re.push('$)')
      compiledRE += re.join('')
    }

    return compiledRE
  };



  re = pattern => this.pattern(pattern)

  pattern = (pattern) => {
    this._raw = pattern
    this._pattern = new RegExp(Wildcard.toPattern(pattern, this.config), this.__flags())
    return this
  }

  __flags = (flags = '') => {
    ! this.config.matchCase && ( flags += 'i' )
    return flags
  }

  search = (pattern, nomatch = undefined) => this.filterReversed(pattern, nomatch)

  match = (data, pattern = this._pattern) => (
    ( pattern instanceof RegExp || ( pattern = new RegExp(Wildcard.toPattern(pattern, this.config), this.__flags() ) ) ) &&
    typeof data === 'string'
      ? pattern.test(data)
      : Array.isArray(data)
        ? data.some(x => this.match(x))
        : isObjLiteral(data)
          ? this.match(Object.keys(data))
          : false
  )

  filter = (data, nomatch = undefined) => (
    typeof data === 'string'
      ? this.match(data) && data
      : Array.isArray(data)
        ? data.filter(x => this.match(x))
        : isObjLiteral(data)
          ? Object.keys(data).reduce(
              (p, c) => this.match(c) && ( p[c] = data[c] ) && p || p,
              {}
            )
          : nomatch
  )

  filterReversed = (data, nomatch = undefined) => (
    Array.isArray(this._raw)
      ? this._raw.filter(x => this.match(data, x))
      : isObjLiteral(this._raw)
        ? Object.keys(this._raw).reduce(
            (p, c) => this.match(data, c)
              ? ( p[c] = this._raw[c] ) && p || p
              : p,
            {}
          )
        : nomatch
  )

  hasWildcard = (pattern = this._raw) => hasWildcard(pattern)

  logic = matchLogic => {
    this.config.matchLogic = matchLogic || 'and'
    return this
  }

  case = matchCase => {
    this.config.matchCase = matchCase
    return this
  }

  reset = () => {
    this.config = { matchCase: true, matchLogic: 'and' }
    this._pattern = undefined
    this._raw = undefined
    return this
  }

}



export { Wildcard, hasWildcard }