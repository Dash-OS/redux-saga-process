
const Errors = {
  exportsType() {
    throw new Error('[PROCESS] | [static exports] must be an Array of properties to export')
  },
  recordsNotFound(...args) {
    throw new Error('[PROCESS] | Records Not Found: ', ...args)
  }
}

const RecordRegistry = {}

class RecordContext {
  constructor(proc) {
    const { config } = proc
    const { pid } = config
    this.exported = {}
    this.pid = pid
    this.captureExports(proc)
  }
  captureExports = proc => {
    const { exports } = proc
    if ( ! exports ) { return }
    Array.isArray(exports)
      ? this.captureExported(proc)
      : Errors.exportsType()
  }
  captureExported = proc => {
    const { exports } = proc
    for (let $export of exports ) {
      this.exported[$export] = proc[$export] && proc[$export].public
    }
  }
}

const registerRecord = proc => {
  if ( ! proc.config.pid ) { return }
  const Record = new RecordContext(proc)
  RecordRegistry[Record.pid] =
    Array.isArray(RecordRegistry[Record.pid])
      ? [ ...RecordRegistry[Record.pid], Record ]
      : [ Record ]
}

const BUILD = {
  selectors: raw => Object.keys(raw).reduce( (prev, id) => {
                      prev[id] = raw[id]()
                      return prev
                    }, {} )
}

/* Reduce all records by pid, merge props across them */
const getRecord = (id, props, config, accum) => {
  return RecordRegistry[id].reduce( (p, c) => {
    props.forEach( prop => {
      if ( c.exported[prop] !== undefined ) {
        const value = BUILD[prop]
          ? BUILD[prop](c.exported[prop])
          : c.exported[prop]
        p[prop] = config.prefixed === true
          ? { ...p[prop], [id]: value }
          : { ...p[prop], ...value }
      }
    })
    return p
  }, accum )
}

const buildSelector = () => {

}


/* Reduce an object container pid/selector pairs */
/* { modals<pid>: ['selectors', 'actions']<selected> } */
function getRecords(records, config, accum = {}) {
  if ( Object.keys(RecordRegistry).length === 0 ) { return {} }
  return Object.keys(records)
    .reduce( (p, c) => getRecord(c, records[c], config, p), accum )
}


// getRecords({
//   modals: [ 'selectors' ]
// })
// getRecord('modals', [ 'selectors' ])

export { registerRecord, getRecords, getRecord }