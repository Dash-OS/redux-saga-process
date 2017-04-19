/* global google */
import Process from 'redux-saga-process'
import { call, fork } from 'redux-saga/effects'

/*
  Wraps import in a promise that can be resolved by sagas since
  call(import, './path') would cause an error.  This allows us
  to dynamically import the package.  Using webpack 2 this means
  that the package will be code split.
*/
function* ImportPackage(path) {
  const importPromise = new Promise(resolve =>
    import(`./import/${path}`).then(module => resolve(module))
  )
  const awaitPromise = () => Promise.resolve(importPromise)
  return awaitPromise
}

export default class FirebaseStartupProcess extends Process {
  
  // Our Firebase Token & Module
  initialized = false
  token      = undefined
  firebase   = undefined
  authorizer = undefined
  dbRef      = undefined
  
  /* We don't want to run firebase when we are server-rendered, we reduce the "user" key */
  static config = { ssr: false, reduces: 'user' };
  
  // Composed Selectors, these are private when prefixed with ! (only accessible by the process
  // and not exported for others to use with the [statics] package).  These are memoized and 
  // can be exported to be used by components as-needed.
  static selectors = {
    '!user':       [ user => user ],
    '!fireToken':  [ user => user.auth.fireToken ],
    '!fireConfig': [ user => user.firebase.config ]
  };
  
  /*
    These will listen for redux actions and trigger the given sagas when they occur with the
    actions payload.
    
    They are converted to SCREAMING_SNAKE_CASE from screamingSnakeCase
  */
  static actionRoutes = {
    authSuccess: 'authenticated',
    authLogout:  'logout'
  };
  
  /*
    These help us to create actions which can be dispatched using [this.dispatch('firebaseReady', ref)].  If
    null, then we expect an object to dispatch with the event, otherwise they are added by the keys in the array.
  */
  static actions = {
    firebaseReady: [ 'ref' ]
  };
  
  /*
    Our reducer for this process.  Reducers are merged among all processes and handled in the order they are
    registered.  This allows multiple smaller processes to reduce the same key in the state.  We generate the
    reducers in a way that they are efficiently parsed based on the registered types for each process.
    
    Note: this is using the object filter reducer style.  
  */
  static reducer = {
    firebaseReady: ( state, action ) => ({
      ...state,
      firebase: {
        ...state.firebase,
        ref: action.ref
      }
    })
  };
  
  /*
    Called whenever AUTH_SUCCESS is dispatched.
  */
  * authenticated(action) {
    if ( this.firebase === undefined ) {
      // When we are authenticated, if firebase is not defined in the process then we will 
      // import the module (and use code splitting via webpack 2) to download the package.
      yield* this.task.create('init', 'firebase', this.importer, 'firebase', 'firebase.js')
    }
  }
  
  /* Logout of Firebase when the user logs out */
  * logout(action) {
    if ( this.authorizer ) {
      this.authorizer.signOut()
    }
    this.ready = false
  }
  
  /*
    Dynamically load the firebase library using code-splitting.  This way 
    we can wait to load the library until needed.
  */
  * importer(what, path) {
    const importer = yield* ImportPackage(path)
    switch(what) {
      case 'firebase': {
        this.firebase = ( yield call(importer) ).default
        yield* this.initializeFirebase()
        break
      }
    }
  }
  
  /* Once we have received the firebase module we will build it and authenticate. */
  * initializeFirebase() {
    
    if ( ! this.initialized ) {
      // Grab our firebase configuration from the redux state and initialize the app.
      const config = yield* this.select('fireConfig')
      this.firebase.initializeApp(config)
    }
    
    // Create the authorizer
    if ( ! this.authorizer ) { this.authorizer = this.firebase.auth() }
    
    // Login with our Custom Token (which will be in the redux state)
    yield* this.provideToken()
    
    // Setup our initial dbRef
    this.dbRef = this.firebase.database().ref().child('ui')
    
    // Setup a task that will continually watch the onAuthStateChanged and handle the results
    // since this is a task, if another watcher is already running for some reason, it will 
    // automatically be cancelled before running the new watcher.
    yield* this.task.create('init', 'watchAuth', this.watcher, 'onAuthStateChanged')
    
  }
  
  * watcher(evt) {
    /*
      An observable allows us to easily receive events continually and remain within our cancellable
      saga context. An observable returns onData which adds to the buffer, getNext which gets the 
      next value from the buffer (or waits for the next), and onCancel which handles cancellations
    */
    const { getNext, onData, onCancel } = this.observable.create(evt)
    
    // Call the Firebase authorizer with the given event (onAuthStateChanged), trigger an addition
    // to our buffer each time data is available.
    const cancelObserver = this.authorizer[evt](onData)
    
    try {
      // We will continually listen for new events until cancelled.
      while (true) {
        // yield call(getNext) will pause execution until a new value is available in our
        // observable buffer.
        const data = yield call(getNext)
        // Fork the received data to our processor then wait for the next value in the buffer.
        yield fork([ this, this.authStateChanged ], ...data.values)
      }
    } catch(error) {
      // Lets jsut let us know for now when an error occurs.  When an error occurs
      // we will automatically cleanup and cancel the observer (but we may simply want 
      // to re-sschedule the observer as well in this case).
      console.warn('Catch Called in Observer [Firebase Startup]', error.message)
    } finally {
      // We call yield onCancel() to check if we reached here due to cancellation. 
      if (yield onCancel()) {
        console.log('Firebase Init Observer Cancelled: ', evt)
      }
      // Cancel the Firebase Observer.
      cancelObserver()
    }
  }
  
  // When auth state changes will receive <firebase.User> or null
  // https://firebase.google.com/docs/reference/node/firebase.User
  * authStateChanged(user) {
    // Get some values from our redux store to help with handling the auth state
    const { email, userIdentityID } = yield* this.select('user')
    
    if ( user === null ) {
      // User is no longer authenticated 
      yield* this.logout()
    } else {
      
      if ( email && ! user.email ) {
        // Update the user email with firebase if we have one but the user object does not.
        if ( email ) { user.updateEmail(email).then(() => console.info('Updated Email to: ', email)) }
      } else if ( ! email ) {
        // Email not known?  Don't accept this user as we can not validate it 
      } else if ( email !== user.email ) {
        // TO DO: Handle this situation - should we logout the user?
      }
      
      if ( ! this.ready ) {
        // If we haven't authenticated yet, create the users ref and dispatch our FIREBASE_READY
        // action so that any other processes, sagas, or components can begin using the ref.
        const ref = this.dbRef.child(`dealers/${userIdentityID}`)
        yield* this.dispatch('firebaseReady', ref)  
      }
      this.ready = true
    }
  }
  
  // https://firebase.google.com/docs/reference/node/firebase.auth.Auth
  * provideToken(retry = true) {
    // Select our custom token from our redux store
    const fireToken = yield* this.select('fireToken')
    if ( ! fireToken ) { throw new Error('Tried to Authenticate with Firebase but a Firebase Token was not found' ) }
    try {
      yield call(::this.authorizer.signInWithCustomToken, fireToken)
    } catch (e) {
      yield fork([ this, this.handleFirebaseError ], e, retry)
    }
  }
  
  * handleFirebaseError(e, retry) {
    const { code, message } = e
    switch(code) {
      case 'auth/invalid-custom-token': {
        // Thrown if the custom token format is incorrect.
        // This could also mean that the auth token has expired and 
        // must be renewed.
        console.error('Failed to Login to the Realtime Database: ', message)
        break
      }
      case 'auth/custom-token-mismatch': {
        // Thrown if the custom token is for a different Firebase App.
        break
      }
      default: {
        console.warn('An Unknown Realtime Database Error has Occurred!')
        console.error(code, message)
        break
      }
    }
  }
  
}

