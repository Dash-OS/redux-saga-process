# Redux-Saga-Process
Redux Saga Processe (RSP) introduces an opinionated pattern for building modular, clean, and powerful 
[redux-saga's](https://github.com/redux-saga/redux-saga) by running them within ES6 classes and providing them with an encapsulated API.  

##### Package Dependencies
- [redux](https://github.com/reactjs/redux)
- [redux-saga](https://github.com/redux-saga/redux-saga)
- [reselect](https://github.com/reactjs/reselect)

## Install

```bash
$ yarn add redux-saga-process
```
**or**
```bash
$ npm install --save redux-saga-process
```

## Overview

RSP has been inspired by the pattern we have begun using on our various applications 
to handle the heavy amount of asynchronous and highly dynamic content we handle.  It has 
helped us to greatly reduce boilerplate & simplify our applications asynchronous logic.

Essentially RSP provides a pattern you can follow to bring your redux-sagas into a class,
provide local reducers & action creators, handle redux types, handle "push" as well as 
"pull" actions, and more.  

We do a few powerful things under-the-hood such as building and merging like-reducers, 
routing your dispatches intelligently, generating action creators, routing actions into 
your processes, and more.  See the overview and examples below to see how it all looks.

We have just packaged it up for public-use so it is possible there will be some rough 
edges, but it has passed all our tests thus far!  Feel free to contribute or report any 
issues you run into while using the package!  Would love to hear your ideas and thoughts.

When I have the time I will try to add a gitbook for the documentation.  For now I will attempt
to document everything you need to know here.

#### Building a Redux Saga Process Class

```javascript
import Process from 'redux-saga-process'
class MyProcess extends Process { /* ... */ }
```

#### Building your Processes

Before we [create our Redux Store](http://redux.js.org/docs/basics/Store.html#store) we should start 
by building our processes.  This process will read all the processes you have built and run some mutations 
against the properties to prepare them so they are ready when we run them.

```javascript
import { combineReducers } from 'redux' // if we are using RSP Reducers
import { buildProcesses } from 'redux-saga-process'
import * as processCategories from '../processes'
const processes = buildProcesses(processCategories)
```

> ***Note:*** Our ```../processes``` directory contains an index which exports "process categories." 
> when you build your processes, the library will search up to two levels deep for classes that can be 
> built and build any discovered processes. 

#### Adding your Processes Reducers (Optional)

If any of your RSP's defined a reducer that they either wanted to join or create you 
will need to add the reducer that was generated for you.  If you add many reducers they will 
all be contained within ```process.processReducers``` and ready to be combined using a call to 
redux's [combineReducers](http://redux.js.org/docs/api/combineReducers.html) helper function.  

```javascript
const rootReducer = combineReducers({
  /* Any other reducers you have may be added */
  ...processes.processReducers,
})
```

#### Running your Processes

Now that we have built our processes we need to run them.  This is done from within your 
[root redux-saga](https://redux-saga.github.io/redux-saga/docs/introduction/BeginnerTutorial.html). 



```javascript
import { fork } from 'redux-saga/effects'
import { runProcesses } from 'redux-saga-process'
import * as processCategories from '../processes'

function* root() {
  yield* runProcesses(processCategories)
}

export default * 
```

> Each process uses the [spawn](https://redux-saga.github.io/redux-saga/docs/api/index.html#spawncontext-fn-args) 
> method to create an independent frame of execution that should not be affected by your other 
> sagas and/or processes.  You may optionally call the runProcesses function like you would any other redux-saga.

## Building your Processes

So now that we have seen how to implement the RSP Pattern during startup, lets take a look 
at what they can actually do for us.  Our goal was to build an extensible & modular lifecycle 
for our various side-effect logic that we were already doing with redux-saga.  

As shown above we start by building an ES6 class which extends ```Process```:

```javascript
import Process from 'redux-saga-process'
class MyProcess extends Process { /* ... */ }
```

Our classes can be configured using [static properties](http://exploringjs.com/es6/ch_classes.html).  In our example 
we are using the babel [transform-class-properties](https://babeljs.io/docs/plugins/transform-class-properties/) plugin.

#### static ```config```

```javascript
class MyProcess extends Process {
  static config = {
    /* Process Configuration */
  }; // don't forget to add the semi-colon!
}
```

Providing a config property allows you to modify how the process will be built and handled. 
We plan to utilize this property to add flexibility and features in the future.  Below are 
the properties that can be provided within this property.


| Property        | Type(s)           | Description  |
| -------------   |:-------------:| -----:|
| **reduces**         | string | a string indicating the name of the reducer this process should reduce. |

### Monitor Dispatch, Trigger Actions

```javascript
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

  static actions = {
    processRequest: [ 'username', 'password' ]
  };
  
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

### Special Thanks & Inspirations

- [reduxsauce](https://github.com/skellock/reduxsauce) - Originally we used reduxsauce to handle some of the handling of data.  Many parts of this package are heavily inspired by the great work done by [@skellock](https://github.com/skellock) with reduxsauce!