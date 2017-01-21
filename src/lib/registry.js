
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
  exported = {}
  constructor(proc) {
    const { config } = proc
    const { pid } = config
    this.pid = pid
    this.captureExports(proc)
  }
  captureExports = proc => {
    const { exports } = proc
    Array.isArray(exports)
      ? this.captureExported(proc)
      : Errors.exportsType()
  }
  captureExported = proc => {
    const { exports } = proc
    for (let $export of exports ) {
      this.exported[$export] = proc[$export]
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

/* Reduce all records by pid, merge props across them */
const getRecord = (id, props, config, accum) => {
  return RecordRegistry[id].reduce( (p, c) => {
    props.forEach( prop => {
      if ( c.exported[prop] !== undefined ) {
        p[prop] = config.prefixed === true
          ? { ...p[prop], [id]: c.exported[prop] }
          : { ...p[prop], ...c.exported[prop] }
      }
    })
    return p 
  }, accum )
}
  

/* Reduce an object container pid/selector pairs */
/* { modals<pid>: ['selectors', 'actions']<selected> } */
function getRecords(records, config, accum = {}) {
  console.log(RecordRegistry)
  if ( Object.keys(RecordRegistry).length === 0 ) { return {} }
  return Object.keys(records)
    .reduce( (p, c) => getRecord(c, records[c], config, p), accum )
}
  

// getRecords({
//   modals: [ 'selectors' ]
// })
// getRecord('modals', [ 'selectors' ])

export { registerRecord, getRecords, getRecord }