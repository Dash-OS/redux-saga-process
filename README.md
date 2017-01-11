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

Below we will look at a simple example of a process.  This does not include many
of the features that are available to us which we will explore later.

```js
import { put } from 'redux-saga/effects'

import Process from 'redux-saga-process'

const STARTED        = 'STARTED' 
      SET_STATE      = 'SET_STATE',
      TRIGGER_ACTION = 'TRIGGER_ACTION',

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
    [PAIR_DEVICE]: (state, action) => ({
      ...state,
      modified: action.value || 'no-value'
    })
  };

  * onTrigger(action) {
    const { type, ...props } = action
  }

  * processStarts() {
    const testSelector1 = yield* this.select('foo'); // value2 ( state.test.another )
    const testSelector2 = yield* this.select('bar'); // value of state.reducer.foo
    yield put({ type: STARTED })
  }

  * shouldProcessCancel(action) {}
  * processCancels(action) {}
  
}

export default MyProcess
```
