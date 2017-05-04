import { put } from 'redux-saga/effects'

/*
  The default listeners that we want to setup
*/
function* startListeners(dispatch) {

  /* We want to listen to all our projects continually */
  yield* dispatch('firebaseListeners', {
    path:   'projects',
    events: [ 'once', 'child_added', 'child_changed', 'child_removed' ]
  })


}

export default startListeners