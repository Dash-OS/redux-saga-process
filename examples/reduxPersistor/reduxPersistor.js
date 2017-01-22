import Process from 'rsp/src/main'

import { take, apply, select, put } from 'redux-saga/effects'
import _ from 'lodash'

export default class ArchiverProcess extends Process {
  
    // setup our local state that we will use to manage
    // the process.
    
    // has our store been rehydrated from redux-persist yet?
  rehydrated = false;
    // should we block the ability to purge our stores from 
    // the outside?
  blockPurge = false;
    // saved with the controller for localForage if we 
    // ever need to access its API directly.
  persistor  = undefined;
    // A queue of data to be saved into the store when it 
    // is busy or not yet ready.
  queue = [];
  
    // signify that we wish to reduce "archives" within the 
    // redux store it is connected to.
  static config = { reduces: 'archives' };
  
    // Our Processes reducer, used to define the pure representation
    // of the data which should be saved to the redux store.
  static reducer = {
      // Called internally to save data to the reducer.
      // Should never be called directly by any component.
    archiveData: (state, { type, ...action }) => ({
      ...state,
      ...action
    }),
      // Purge the redux store.
    archivePurge: (state, { type, ...action }) => ({})
  };
  
  static actionRoutes = {
      // signify that rehydration (by redux-persist) has completed
      // when REHYDRATE_COMPLETE has been dispatched.
    rehydrateComplete: 'rehydrateComplete',
      // will save the data presented 
    archiveSave:       'archiveSave',
      // receive AUTH_SUCESS and archive important data received.
    authSuccess:       'archiveSave',
      // purge any archives when the user logs out of their account.
    authLogout:        'purgeArchives',
      // provide a means to retrieve data from the archives by dispatching
      // ARCHIVE_GET.  Allow the action to specify an action to dispatch 
      // with the requested data when it is ready.
    archiveGet:        'archiveGet'
  };
  
  static actions = {
    // Used to allow queueing before rehydration completes.
    archiveSave:  null,
    // Used internally to save after rehydration.
    archiveData:  null,
    archivePurge: null
  };
  
    // when called, the execution frame will be paused until 
    // rehydration has been completed by redux-persist.  the 
    // rest of the app continues its functionality in the meantime.
    //
    // we utilize this saga so that when a request from any other part of 
    // our application is made, we can easily make sure we wait to respond 
    // until our stores have been refilled from the storage medium used.
  * awaitRehydration() { 
    ! this.rehydrated && ( yield take('REHYDRATE_COMPLETE') )
    this.rehydrated = true
  }
  
    // Once the rehydration has completed we will empty our queue and
    // allow any save requests into our reducer.
  * rehydrateComplete({ type, persistor }) {
    this.rehydrated = true
    this.persistor  = persistor
    for ( let action of this.queue ) {
      yield apply(this, this.archiveData, [ action ])
    }
    this.queue = []
  }
  
  
    //  Gets data from the archives.  If we have not yet finished rehydrating 
    //  we will wait for it to complete before resolving. Responds by dispatching
    //  the type defined by the "responseType" key.  This way any other process 
    //  may make the request then wait for the response (optionally with a timeout).
  * archiveGet({ type, ...data }) {
    if ( ! data.responseType ) {
      throw new Error('To Get Archived Data you must provide a responseType')
    }
    yield* this.awaitRehydration()
    const response = yield* this.select()
    const requested = data.pick && _.pick(response, data.pick) || response
    yield put({ type: data.responseType, requested })
  }
  
    // Receive requests to save data to our persistent store and process
    // them before saving them.  If our stores have not yet been rehydrated 
    // we add items to a queue and save them when ready in a FIFO fashion.
  * archiveSave({ type, ...data }) {
    if ( type !== 'ARCHIVE_SAVE' && ! data.archiveKey ) { return }
    if ( ! this.rehydrated ) { 
      this.queue.push({ type, ...data }) 
    } else if ( data ) {
      if ( data.archiveKey ) {
        const { archiveKey, ...rest } = data
        yield* this.dispatch('archiveData', { [archiveKey]: rest })
      } else {
        yield* this.dispatch('archiveData', data)  
      }
    } else {
      console.error('Tried to Save an Empty Object into Persistent State')
    }
  }
  
  * purgeArchives(action = {}) {
    const { type, ...data } = action
    yield* this.awaitRehydration()
    if ( this.persistor && ( type === 'AUTH_LOGOUT' || ! this.blockPurge || data.force ) ) {
      yield* this.dispatch('archivePurge')
      yield apply(this, this.persistor.purge, [ [ 'archives' ] ])
    }
  }

}