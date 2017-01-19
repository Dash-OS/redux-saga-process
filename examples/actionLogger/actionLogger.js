import Process from 'redux-saga-process'

// Listens for any action and logs it and can be disabled by dispatching
// TOGGLE_ACTION_LOGGER
export default class ActionLogger extends Process {
  
  enabled = true;
  
  static actionRoutes = { 
    '*': 'log',
    toggleActionLogger: 'toggle'
  };
  
  * log (action) {
    if ( this.enabled ) { console.info('[ACTION]: ', action) }
  }
  
  * toggle () { this.enabled = ! this.enabled }
  
}

