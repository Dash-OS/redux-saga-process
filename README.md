# Redux-Saga-Process
Redux Saga Processes provide a means to create modular & extendable way.  If you 
are not familiar with either redux or redux-saga I would recommend you start by 
learning about those as this is simply a pattern that can be used on top of them.

## Install

```bsah
yarn add redux-saga-process
```

```bash
npm install --save redux-saga-process
```

## Example

```js
import { take, put, call, fork, select, apply } from 'redux-saga/effects'

import Process from 'redux-saga-process'

const STARTED        = 'STARTED' 
      SET_STATE      = 'SET_STATE',
      TRIGGER_ACTION = 'TRIGGER_ACTION',

class MyProcess extends Process {

  // config will determine how the process is built and maintained by the
  // Process class.  In this case since we specify reduces a reducer will 
  // be created called 'test'.
  static config = {
    reduces: 'test'
  };
  
  // We may optionally provide a set of selectors which utilize the excellent
  // reselect library.  This is simply a convenient means of providing selectors
  // to our process.  If the array is a single item it will reduce to the processes 
  // reducer, otherwise it will use the given selectors.
  static selectors = {
    // state.test is selected, returns state.test.
    foo: [ test => test.another ],
    // state.reducer.foo is selected
    bar: [ s => s, s => s.reducer.foo ]
  };

  // The initialState for our 'test' reducer which will be created.  This is 
  // ignored if we do not provide the reduces config.
  static initialState = {
    key:     'value',
    another: 'value2'
  };

  // Define types to watch that should call the processCancels function if defined
  // then remove the process completely.
  static cancelTypes = [];

  // An object which maps types to functions.  Whenever the given type is detected 
  // we will trigger your function within the process with the action data.
  static actionRoutes = {
    [TRIGGER_ACTION]: 'onTrigger'
  };

  // If defined, you may provide a local reducer.  This expects a mapping of 
  // types into a function that receives state and action, expecting a new state
  // to be returned.
  static reducer = {
    [PAIR_DEVICE]: (state, action) => ({
      ...state,
      modified: action.value || 'no-value'
    })
  };
  
   // Triggers whenever TRIGGER_ACTION is dispatched.
  * onTrigger(action) {
    const { type, ...props } = action
  }
  
  // This is run on startup, any daemon-like functionality can be placed here
  // if required.  If this Process is only for monitoring of Redux Actions
  // you can leave this empty and add the actionRoutes & reduction that should occur
  * processStarts() {
    // calls our foo selector and returns the initialState for state.test.another
    // (value2).  This utilizes yield select under the hood so a yield should be
    // used to call it.
    const testState = yield* this.select('foo')
    // or const testState = yield apply(this, this.select, [ 'foo' ])
    // this.config === static config
    console.log('Props / Config: ', this.config)
    yield put({ type: STARTED })
  }

  // This is called when a cancelType is discovered.  Return true to cancel or false to 
  // ignore.
  * shouldProcessCancel(action) {}
  
  // This is run a cancelType is detected and it is not intercepted by shouldProcessCancel
  * processCancels(action) {}
  
}

export default MyProcess
```
