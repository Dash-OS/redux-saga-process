/* global google */
import { Process } from 'redux-saga-process'

import startListeners from './sagas/defaultListeners'

import { call, apply, put, take, fork } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import _ from 'lodash'

/*
  Handles listening to, managing, and dispatching the data associated with
  firebase listeners.

  yield put({
    type:     'FIREBASE_LISTENERS',
    category: 'projects',
    path:     'projects',
    events:   [ 'once', 'child_added', 'child_changed', 'child_removed' ]
  })

  yield put({
    type:     'FIREBASE_CANCEL',
    category: 'projects',
  })

  yield put({
    type:     'FIREBASE_CANCEL',
    category: 'projects',
    event:    'child_changed'
  })

  yield put({
    type:     'FIREBASE_CANCEL',
    category: 'projects',
    events:   [ 'child_changed', 'child_removed' ]
  })

*/
export default class FirebaseGettersProcess extends Process {

  ref = undefined

  // This allows us to hot reload our state!
  constructor(config, state) {
    super(config, state)
    this.state = {
      listeners: {
        // 'category': {
        //    'keys': []
        // }
      },
      ...state
    }
  }

  static config = { ssr: false, reduces: 'db' };

  static initialState = {
    projects: {}
  };

  // Composed Private Selectors
  static selectors = {
    '!ref': [ state => state.user, user => user.firebase.ref ]
  };

  static actionRoutes = {
    firebaseReady:     'ready',
    firebaseListener:  'startListener',
    firebaseListeners: 'startListeners',
    firebaseCancel:    'cancelListeners'
  };

  static actions = {
    '!firebaseData':   null,
    '!firebaseRemove': ['category'],
    firebaseListeners: null,
    firebaseListener:  null,
    firebaseCancel:    ['category', 'events']
  };

  static reducer = {
    firebaseData: ( state, { category, event, method, value, key } ) => {
      switch(event) {
        case 'value': {
          return {
            ...state,
            [category]: value
          }
        }
        case 'child_removed': {
          return {
            ...state,
            [category]: _.omit(state[category], [ key ])
          }
        }
        case 'child_changed':
        case 'child_added': {
          return {
            ...state,
            [category]: {
              ...state[category],
              [key]: value
            }
          }
        }
      }
      return state
    },
    firebaseRemove: ( state, { category } ) => _.omit(state, [ category ])
  };

  // Saves our Firebase ref so that we can use it later to create children
  // refs.
  * ready({ ref }) {
    if ( ! ref && ! ( yield* this.getRef() ) ) {
      console.error('Firebase Ready was indicated but no ref was discovered')
      return
    }
    yield* startListeners(this.dispatch)
  }

  * getRef() {
    const _ref = yield* this.select('ref')
    if ( ! _ref ) {
      throw new Error('[Firebase Listeners Process] | Ref Unknown, Starting Listeners Not Possible')
      return
    }
    return _ref
  }

  // child_removed , child_added , child_changed , value
  * startListeners({ path, events, ...action }) {
    if ( ! Array.isArray(events) ) {
      console.error('Invalid Listeners Requested: ', path, events, action)
    }
    let paths
    if ( Array.isArray(path) ) {
      paths = path
    } else { paths = [ path ] }
    for ( let path of paths ) {

      let category
      if ( ! action.category ) {
        category = path
      } else { category = action.category }

      yield* this.createListenerCategory(category)

      if ( events.includes('once') ) {
        this.state.listeners[category].once = true
        yield fork([ this, this.startListener ], {
          path, category, event: 'value', method: 'once'
        })
        yield take('FIREBASE_DATA')
      }

      for ( let event of events ) {
        if ( event === 'once' ) { continue }
        yield fork([ this, this.startListener ], {
          path, category, event
        })
      }
    }
  }

  * startListener({ path, category, event, method = 'on' }) {
    if ( ! path || ! event ) {
      console.error('Realtime Listener Request Error: Missing Parameters: ', path, category, event, method)
      return
    }
    const _ref = yield* this.getRef()
    const ref = _ref.child(path)

    yield* this.task.create(category || path, `${method}_${event}`, this.observe, ref, category || path, event, method)
  }

  * cancelListeners({ category, event, events, method = 'on' }) {
    if ( event !== undefined ) {
      yield* this.task.cancel(category, `${method}_${event}`)
    } else if ( events !== undefined ) {
      // we actually allow events to be a string to specify a single event
      if ( typeof events === 'string' ) {
        yield* this.task.cancel(category, `${method}_${event}`)
      } else if ( Array.isArray(events) ) {
        for ( let event of events ) {
          if ( event === 'once' ) { continue }
          yield* this.task.cancel(category, `${method}_${event}`)
        }
      } else { console.warn('Cancellation Failure: "events" is defined but its not a string or array') }
    } else {
      yield* this.task.cancel(category)
    }
  }

  * observe(ref, category, event, method = 'on') {
    // console.log('Observe: ', method, event)
    const { getNext, onData, onCancel } = this.observable.create(`${category}::${method}_${event}`)
    const observerID = ref[method](event, onData, onCancel)
    try {
      while (true) {
        const data = yield call(getNext)
        yield fork([ this, this.handleReceived ], category, event, method, ...data.values)
        if ( method === 'once' ) { break }
      }
    } catch(error) {
      console.warn('Catch Called in Observer [System Comm]', error.message)
    } finally {
      if (yield onCancel()) {
        console.log('Firebase Listener Cancelled: ', category, method, event)
      } else {
        console.log('Error or Other Issue in Firebase Listeners Process?', category, method)
      }
      if ( method !== 'once' ) { ref.off(event, observerID) }
    }
  }

  * createListenerCategory(category) {
    if ( ! this.state.listeners[category] ) {
      this.state.listeners[category] = {
        keys: []
      }
      return true
    } else { return false }
  }

  * removeKeyFromCategory(category, key) {
    _.pull(this.state.listeners[category].keys, key)
    if ( this.state.listeners[category].keys.length === 0 ) {
      // No more keys included - listener was removed?
      delete this.state.listers[category]
      return true
    } else { return false }
  }

  * addKeyToCategory(category, key) {
    yield* this.createListenerCategory(category)
    if ( ! this.state.listeners[category].keys.includes(key) ) {
      this.state.listeners[category].keys.push(key)
      return true
    } else { return false }
  }

  * setKeysToCategory(category, keys) {
    yield* this.createListenerCategory(category)
    this.state.listeners[category].keys = keys
    return true
  }

  * handleReceived(category, event, method, ...received) {
    //console.log('Firebase Receives: ', category, event, method)
    const [ snapshot, ...args ] = received
    let update, category_removed, value, key = snapshot.key
    switch(event) {
      case 'value': {
        if ( snapshot.exists() === false ) {
          // The request has no actual data! Removing
          category_removed = yield* this.removeKeyFromCategory(category, key)
          if ( ! category_removed ) {
            update = true
          }
        } else if ( snapshot.hasChildren() ) {
          // We have nested keys to add
          value = snapshot.val()
          yield* this.setKeysToCategory(category, Object.keys(value))
          update = true
        } else {
          // This is a direct value!
          this.state.listeners[category].keys = [ key ]
          update = true
        }
        break
      }
      case 'child_added': {
        // We only want to update the data if we don't already have the child.
        // This is because we use 'once' to read the data and update it initially
        // then use child_added to add new keys from there.
        update = yield* this.addKeyToCategory(category, key)
        break
      }
      case 'child_changed': {
        yield* this.addKeyToCategory(category, key)
        update = true
        break
      }
      case 'child_removed': {
        // remove the key from the list of keys
        category_removed = yield* this.removeKeyFromCategory(category, key)
        if ( ! category_removed ) {
          update = true
        }
        break
      }
    }

    if ( category_removed === true ) {
      if ( ! value ) { value = snapshot.val() }
      yield* this.dispatch('firebaseRemove', category)
    } else if ( update === true ) {
      if ( ! value ) { value = snapshot.val() }
      yield* this.dispatch('firebaseData', {
        category, event, method, key, value
      })
    }

  }

}

