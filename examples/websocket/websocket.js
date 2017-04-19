import Process from 'redux-saga-process'

import { call, apply, put, take, fork } from 'redux-saga/effects'
import { delay } from 'redux-saga'

function tryJSON(str) {
  let r
  try {
    return JSON.parse(str)
  } catch (e) {
    return
  }
}

function tryToJSON(str) {
  let r
  try {
    r = JSON.stringify(str);
  } catch (e) { return str }
  return r
}

export default class UserAuthProcess extends Process {
  
  WS        = undefined
  schema    = undefined 
  reconnect = true
  
  // imported with the key "ws" (using [statics]), reduces key "system" (redux store)
  static config = { pid: 'ws', reduces: 'system' };
  
  // We want to export our action creators so others can use them
  static exports = [ 'actions' ];
  
  
  static initialState = { 
    connected: false,
  };
  
  static reducer = {
    systemConnect: (state, action) => ({
      connected: false
    }),
    systemConnected: (state, action) => ({
      ...state,
      lanip:     action.lanip,
      connected: true
    }),
    systemDisconnected: (state) => ({
      ...state,
      lanip:     undefined,
      connected: false
    }),
    systemReceive: (state, { type, uuid, ...action }) => ({
      ...state,
      ...action
    })
  };
  
  static actions = {
    systemRequest:          ['request', 'data'],
    systemSend:             ['payload'],
    systemConnect:          null,
    systemDisconnect:       null,
    // Our private actions we don't wish to be made public outside of the process.
    '!systemConnected':     null,
    '!systemDisconnected':  null,
    '!systemReceive':       null,
  };
  
  static actionRoutes = {
    systemConnect:         'connect',
    systemDisconnected:    'reconnect',
    systemDisconnect:      'disconnect',
    systemSend:            'send',
    systemRequest:         'request',
  };
  
  * notify(message) {
    // Dispatching a notification to react-notification-system
    yield put({
      type: 'NOTIFICATION',
      autoDismiss: 2,
      dismissable: false,
      ...message
    })
  }
  
  * connect(schema = this.schema, ...args) {
    this.reconnect = true
    if ( schema !== this.schema ) {
      // New Connection!  save it for reconnection purposes
      this.schema = { 
        hostname:  schema.hostname  || schema.lanip || window.location.hostname, 
        port:      schema.port      || 9001, 
        protocol:  schema.protocol  || 'wss',
        reconnect: schema.reconnect || true
      }
    }
    this.WS = new WebSocket(`${this.schema.protocol}://${this.schema.hostname}:${this.schema.port}`) 
    yield* this.notify({
      title:   'Connecting',
      message: `Connecting to System: ${this.schema.hostname}`
    })
    // Create a task, define what events to listen for, automatically cancel
    // any previous connections if they were made.
    yield* this.task.create(
      'ws', 
      'events', 
      this.ws_events, 
      [ 'open', 'close', 'error', 'message' ],
      this.schema.hostname
    )
  }
  
  * reconnect() {
    // Auto Reconnect? (Default)
    if ( this.reconnect === true && this.schema.reconnect === true ) {
      yield* this.disconnect()
      console.log('[WebSocket] | Retry Connection in 10 Seconds')
      yield call(delay, 10000)
      yield fork([ this, this.connect ])
    }
  }
  
  * disconnect({ reconnect = false }) {
    this.reconnect = reconnect
    this.WS.close()
  }
  
  * send({ payload }) { 
    this.WS.send( tryToJSON(payload) )
    if ( payload.uuid ) {
      // Dispatch the UUID being sent for logging and external
      // integration purposes.
      yield put({
        type: `SYSTEM_SEND_${payload.uuid.toUpperCase()}`
      })
    }
  }
  
  // Shortcut for sending tagged payloads with uuid / event.
  * request({ uuid, request, event, data }) {
    if ( event ) {
      yield* this.send({
        payload: {
          uuid: uuid || event,
          event, ...data
        }
      })
    } else if ( request ) {
      yield* this.send({
        payload: {
          uuid: uuid || request,
          request, ...data
        }
      })
    }
  }
  
  * ws_events(events, type) {
    const { getNext, onData, onCancel } = this.observable.create(type)
    for ( let event of events ) {
      // When specific events are received, call our handler (below)
      this.WS[`on${event}`] = received => onData(event, received)
    }
    try {
      while (true) {
        const data = yield call(getNext)
        yield* this.ws_event(...data.values)
      }
    } catch(error) {
      console.warn('Catch Called in Observer [Websocket]', error.message)
    } finally {
      if (yield onCancel()) {
        // Cancelled!
      }
      yield* this.disconnect()
    }
  }
  
  * ws_event(event, received) {
    switch(event) {
      case 'open': {
        yield* this.notify({
          title:   'Connected',
          message: 'Connected to System!',
          level:   'success'
        })
        yield* this.dispatch('systemConnected', {
          lanip: this.schema.hostname
        })
        break
      }
      case 'close': {
        yield* this.notify({
          title:   'Disconnected',
          message: 'System Connection Lost!',
          level:   'error'
        })
        yield* this.dispatch('systemDisconnected')
        break
      }
      case 'error': {
        yield* this.notify({
          title:   'Disconnected',
          message: received.message,
          level:   'error'
        })
        break
      }
      case 'message': {
        const data = tryJSON(received.data)
        if ( data ) {
          yield* this.dispatch(`systemReceive`, data)
          if ( data.uuid ) {
            // When a UUID is present, dispatch an empty action so that callers
            // can listen for responses to their requests in other sagas / processes.
            yield put({
              type: `SYSTEM_RECEIVE_${data.uuid.toUpperCase()}`
            })
          }
        } else {
          console.warn('Invalid Data Received From WebSocket? (Not JSON) ', received.data)
        }
        break
      }
    }
  }
  
}
