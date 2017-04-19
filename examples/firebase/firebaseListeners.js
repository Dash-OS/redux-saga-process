import Process from 'redux-saga-process'

import { call, apply, put, take, fork } from 'redux-saga/effects'
import { delay } from 'redux-saga'

// Because life should be easy
import _ from 'lodash'

/*
  Handles listening to, managing, and dispatching the data associated with
  firebase listeners.  
  
  Listeners are created and automatically saved into our redux store based upon
  the category value.  We intelligently register listeners in a way that is data
  efficient and will render our application without data jitter (child_added one by one 
  added to state so UI staggers each update).
  
  We merge automatically into the state and handle cancellation automatically so that
  we don't leave any refs going when they shouldn't be.
  
  yield put({
    type:     'FIREBASE_LISTENERS',
    category: 'projects',
    path:     'projects',
    events:   [ 'once', 'child_added', 'child_changed', 'child_removed' ]
  })
  
  The above is synonymous with the below. If category is not provided then path will
  be used instead.  Path is sent to ref.child(path) so can be projects or projects/child,
  etc.
  
  yield* this.dispatch('firebaseListeners', {
    path:   'projects',
    events: [ 'once', 'child_added', 'child_changed', 'child_removed' ]
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
  
  listeners = {
    // 'category': {
    //    'keys': []
    // }
  }
  
  /* Reduce the [db] key in our redux store.  All listeners data will be placed there */
  static config = { ssr: false, reduces: 'db' };
  
  /* Our initial redux state */
  static initialState = {};
  
  static actionRoutes = {
    firebaseReady:     'ready',
    firebaseListener:  'startListener',
    firebaseListeners: 'startListeners',
    firebaseCancel:    'cancelListeners'
  };
  
  /* Private and Public (Exported) Action Creators */
  static actions = {
    '!firebaseData':   null,
    '!firebaseRemove': ['category'],
    firebaseListeners: null,
    firebaseListener:  null,
    firebaseCancel:    ['category', 'events']
  };
  
  static reducer = {
    // FIREBASE_REMOVE - Remove a category from the redux store
    firebaseRemove: ( state, { category } ) => _.omit(state, [ category ]),
    // FIREBASE_DATA   - Add, change, modify, or remove items from our redux store
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
  };

  // Saves our Firebase ref so that we can use it later to create children
  // refs.
  * ready({ ref }) { this.ref = ref }
  
  // child_removed , child_added , child_changed , value
  * startListeners({ path, category, events }) {
    if ( ! Array.isArray(events) ) {
      console.error('Invalid Listeners Requested: ', path, category, events) 
    }
    yield* this.createListenerCategory(category)
    if ( events.includes('once') ) {
      this.listeners[category].once = true
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
  
  * startListener({ path, category, event, method = 'on' }) {
    if ( ! path || ! event ) { 
      console.error('Realtime Listener Request Error: Missing Parameters: ', path, category, event, method)
      return
    }
    const ref = this.ref.child(path)
    // Create a task which will start our listener and continually await data received.  If a matching listener has
    // already been scheduled it will be cancelled and all data cleaned up before starting the next.
    yield* this.task.create(category || path, `${method}_${event}`, this.observe, ref, category || path, event, method)
  }
  
  /* Cancel a listener or an entire category of listeners (which may have multiple events such as child_changed, child_removed) */
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
    const { getNext, onData, onCancel } = this.observable.create(`${category}::${method}_${event}`)
    const observerID = ref[method](event, onData, onCancel)
    try {
      while (true) {
        const data = yield call(getNext)
        yield fork([ this, this.handleReceived ], category, event, method, ...data.values)
        // No need to continually wait for a once response :)
        if ( method === 'once' ) { break }
      }
    } catch(error) {
      console.warn('Catch Called in Observer [System Comm]', error.message)
    } finally {
      if (yield onCancel()) {
        console.log('Firebase Listener Cancelled: ', category, method, event)
      }
      if ( method !== 'once' ) { ref.off(event, observerID) }
    }
  }
  
  * createListenerCategory(category) {
    if ( ! this.listeners[category] ) {
      this.listeners[category] = {
        keys: []
      }
      return true
    } else { return false }
  }
  
  * removeKeyFromCategory(category, key) {
    _.pull(this.listeners[category].keys, key)
    if ( this.listeners[category].keys.length === 0 ) {
      // No more keys included - listener was removed
      delete this.listers[category]
      return true
    } else { return false }
  }
  
  * addKeyToCategory(category, key) {
    yield* this.createListenerCategory(category)
    if ( ! this.listeners[category].keys.includes(key) ) {
      this.listeners[category].keys.push(key)
      return true
    } else { return false }
  }
  
  * setKeysToCategory(category, keys) {
    yield* this.createListenerCategory(category)
    this.listeners[category].keys = keys
    return true
  }
  
  * handleReceived(category, event, method, ...received) {
    const [ snapshot, ...args ] = received
    let update, category_removed, value, key = snapshot.key
    switch(event) {
      case 'value': {
        if ( snapshot.exists() === false ) {
          // The request has no actual data! Removing
          category_removed = yield* this.removeKeyFromCategory(category, key)
          if ( ! category_removed ) { update = true }
        } else if ( snapshot.hasChildren() ) {
          // We have nested keys to add
          value = snapshot.val()
          yield* this.setKeysToCategory(category, Object.keys(value))
          update = true
        } else {
          // This is a direct value!
          this.listeners[category].keys = [ key ]
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
        if ( ! category_removed ) { update = true }
        break
      }
    }
  
    if ( category_removed === true ) {
      if ( value === undefined ) { value = snapshot.val() }
      yield* this.dispatch('firebaseRemove', category)
    } else if ( update === true ) {
      if ( value === undefined ) { value = snapshot.val() }
      yield* this.dispatch('firebaseData', {
        category, event, method, key, value
      })
    }

  }
  
}

