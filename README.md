# Redux-Saga-Process
Redux Saga Processes provide a means to create modular & extendable way.  If you 
are not familiar with either redux or redux-saga I would recommend you start by 
learning about those.

The RSP pattern is meant to be a modular way to build your redux sagas that helps 
maintain the reducers, actions, and selectors that are needed for the saga in one 
place.

RSP provides ways to handle cancellations, receive dispatched actions (and act upon them), 
reduce dispatched actions into your reducers, and handle selecting your state values using 
selectors (provided by the excellent reselect library).



## Install

```bsah
yarn add redux-saga-process
```

```bash
npm install --save redux-saga-process
```

## Examples

Below we will show a few examples of using this package.  There are a few major 
features that are not currently shown here.  I will add the information on the 
other features shortly.

### Monitor Dispatch, Trigger Actions

```js
import { put } from 'redux-saga/effects'

import Process from 'redux-saga-process'

const TRIGGER_ACTION_ONE = 'TRIGGER_ACTION_ONE',
      TRIGGER_ACTION_TWO = 'TRIGGER_ACTION_TWO'

class MyProcess extends Process {

  static actionRoutes = {
    [TRIGGER_ACTION_ONE]: 'onTriggerOne',
    [TRIGGER_ACTION_TWO]: 'onTriggerTwo'
  };

  * onTriggerOne({ type, ...props }) {
    const { type, ...props } = action
    /* fun stuff */
  }
  
  * onTriggerTwo(action) { /* fun stuff */ }
  
}

export default MyProcess
```

### Larger Example

```js
import { put } from 'redux-saga/effects'

import Process from 'redux-saga-process'

const STARTED        = 'STARTED' 
      SET_STATE      = 'SET_STATE',
      TRIGGER_ACTION = 'TRIGGER_ACTION'

class MyProcess extends Process {

  static config = {
    reduces: 'test'
  };
  
  static selectors = {
    foo: [ test => test.another ],
    bar: [ s => s, s => s.reducer.foo ]
  };

  static initialState = {
    key:     'value',
    another: 'value2'
  };

  static cancelTypes = [];

  static actionRoutes = {
    [TRIGGER_ACTION]: 'onTrigger'
  };

  static reducer = {
    [SET_STATE]: (state, action) => ({
      ...state,
      modified: action.value || 'no-value'
    })
  };

  * onTrigger(action) {
    const { type, value } = action
    yield put({ type: SET_STATE, value})
  }

  * processStarts() {
    const foo = yield* this.select('foo'), // value2 ( state.test.another )
          bar = yield* this.select('bar')  // value of state.reducer.foo
    yield put({ type: STARTED, foo, bar })
  }

  * shouldProcessCancel(action) {}
  * processCancels(action) {}
  
}

export default MyProcess
```
