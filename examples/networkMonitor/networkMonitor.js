import Process from 'redux-saga-process'

import { call, fork } from 'redux-saga/effects'

export default class NetworkMonitorProcess extends Process {
  
  /* We do not want this to be server rendered and should reduce "app" */
  static config = { reduces: 'app', ssr: false };

  /* The initialState of our "app" reducer */
  static initialState = { 
    network: { online: undefined }
  };
  
  /* Our "app" reducer itself */
  static reducer = {
    networkStatus: ( state, action ) => ({
      ...state,
      network: {
        ...state.network,
        online: action.online !== undefined 
          ? action.online 
          : state.network.online || false
      }
    })
  };
  
  /* Actions to update our network status in our "app" reducer */
  static actions = {
    networkStatus: [ 'online' ]
  };
  
  /*
    We update our "app" state with the latest value of navigator.onLine.  This 
    is currently only called on startup.
  */
  * updateNetworkStatus() {
    const online = navigator && navigator.onLine === true
    yield* this.dispatch('networkStatus', online)
  }
  
  /*
    Our Observer will be called and create the observable.  An observable
    is create a cancellable promise then creating a queue of responses when 
    the callback is received.  This allows us to stay within the saga pattern
    while handling "push" style events as well as allows us to cancel the 
    promises if we need to (in the situation that our task or process are cancelled).
  */
  * observer(event, type) {
    const { getNext, onData, onCancel } = this.observable.create(type)
    const observerID = window.addEventListener(event, onData)
    try {
      while (true) {
        const data = yield call(getNext)
        yield fork([this, this.processReceived ], data, type)
      }
    } catch(error) {
      console.warn('Catch Called in Observer [Watchdog]', error.message)
    } finally {
      if (yield onCancel()) {
        console.log('Observer Cancelled: ', type)
      }
      observerID.removeEventListener(event, onData)
    }
  }
  
  /*
    Whenever a new event is available from our observable we will receive
    it and dispatch the relevant event to our application for rendering.
  */
  * processReceived(data, type) {
    const { values = [] } = data
    for ( let value of values ) {
      switch(type) {
        case 'networkOnline':
          value.type && ( yield* this.dispatch('networkStatus', value.type === 'online' ) )
          break
        case 'networkOffline':
          value.type && ( yield* this.dispatch('networkStatus', value.type === 'online' ) )
          break
      }
    }
  }
  
  /*
    Called when our process is started for the first time.  We will first synchronously
    update our store with the current navigator.onLine value then we will create two forked 
    tasks which will monitor the online/offline events and update our store accordingly.
    
    Any new events we want to monitor can be added here easily.
  */
  * processStarts() {
    yield* this.updateNetworkStatus()
    yield* this.task.create('network', 'online',  this.observer, 'online',  'networkOnline')
    yield* this.task.create('network', 'offline', this.observer, 'offline', 'networkOffline')
  }
  
}

