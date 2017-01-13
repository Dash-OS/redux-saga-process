import { put } from 'redux-saga/effects'
import Process from 'redux-saga-process'

import { INCREMENT, DECREMENT, RESET, LOGGING } from './types'

export default class CounterProcess extends Process {

  // Set the default logging setting
  logging = false;

  static config = { reduces: 'counters' };

  static actions = {
    reset:     null,
    logging:   [ 'enabled' ],
    increment: [ 'by', 'id' ],
    decrement: [ 'by', 'id' ]
  };

  static selectors = {
    getCounter: [
      (state, id = '_default') => state[id]
    ],
    getCounters: [ state => state ]
  };

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
    [RESET]:     'log',
    [LOGGING]:   'setLogging'
  };

  * setLogging({ enabled }) {
    this.logging !== enabled &&
      console.info(`Logging has been ${ enabled ? 'ENABLED' : 'DISABLED' }`)
    this.logging = enabled
  }

  * log({ id = 'default' }) {
    this.logging &&
      console.log(`[LOG] COUNTER ${id}: ${yield* this.select('getCounter')}`)
  }

  /*
    Console should show:
    ------------------------
    Logging has been ENABLED
    [LOG] COUNTER default: 0
    [LOG] COUNTER default: 1
    [LOG] COUNTER default: 11
    [LOG] COUNTER myCounter: 11
    Counters are:  { _default: 11, myCounter: 5 }
  */
  * processStarts() {
    // Turn on the logging programmatically
    yield* this.dispatch('logging', true)
    // Set the Default Counter to 0 (reset)
    yield* this.dispatch('reset')
    // Increment by 1 using a standard yield put:
    yield put({ type: INCREMENT })
    // Increment using this.dispatch / actionCreators
    yield* this.dispatch('increment', 10)
    // Set a counter with an id
    yield* this.dispatch('increment', 5, 'myCounter')
    // Get all counters and output them
    const counters = yield* this.select('getCounters')
    console.log('Counters are: ', counters)
  }

}
