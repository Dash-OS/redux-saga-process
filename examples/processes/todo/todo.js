import { take, put, call, fork, select, apply } from 'redux-saga/effects'
import Process from 'rsp/src/main'

import { INCREMENT, DECREMENT, RESET, LOGGING } from './types'

class CounterProcess extends Process {
  
  static config = { reduces: 'counters' }; 
  
  static actions = { logging: [ 'enabled' ] };
  
  static reducer = {
    [INCREMENT]: (state, { id = '_default', by = 1 }) => ({
      ...state,
      [id]: ( state[id] || 0 ) + by
    }),
    [DECREMENT]: (state, { id = '_default', by = 1 }) => ({
      ...state,
      [id]: ( state[id] || 0 ) - by
    }),
    [RESET]: (state, { id = '_default' }) => ({
      ...state,
      [id]: 0
    })
  };
  
  static actionRoutes = {
    [INCREMENT]: 'log',
    [DECREMENT]: 'log',
    [LOGGING]:   'setLogging'
  };
  
  * setLogging({ enabled }) { 
    this.logging !== enabled &&
      console.info(`Logging has been ${ enabled ? 'ENABLED' : 'DISABLED' }`)
    this.logging = enabled 
  }
  
  * log({ id = 'default' }) {
    this.logging && console.log(`COUNTER ${id}: `)
  }
  // This is run when the parent task which created the process is being cancelled.
  * processCancels() {
    
  }
  
  * shouldProcessCancel(action) {
    
  }

}

export default CounterProcess