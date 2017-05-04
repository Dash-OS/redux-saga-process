# Redux Saga Process

[![npm version](https://badge.fury.io/js/redux-saga-process.svg)](https://badge.fury.io/js/redux-saga-process)

Saga Processes provide an encapsulated environment for processing complex (or simple) logic.
The Saga Process pattern that is being presenting is heavily inspired (surprisingly) by the general
concept of [processes](https://en.wikipedia.org/wiki/Process_(computing)).

Each Process manages its logic, holds its local state, and makes intelligent decisions on when and how to dispatch a
pure repesentation of such data to the rest of the Application to be rendered efficiently. Keep
the logic out of your views.

### Package Dependencies
- [redux](https://github.com/reactjs/redux)
- [redux-saga](https://github.com/redux-saga/redux-saga)
- [reselect](https://github.com/reactjs/reselect)

# Installation

```bash
$ yarn add redux-saga-process
```
**or**
```bash
$ npm install --save redux-saga-process
```

# Overview

Processes should remain a "pure environment" with a specific purpose or intent.  They
run as daemons in most cases which will live and respond throughout the lifetime of the
application.

Processes are run as sagas using the [redux-saga](https://github.com/redux-saga/redux-saga)
library.  They may also be configured to reduce a portion of your [redux](https://github.com/reactjs/redux)
store, providing a means for dispatching a pure representation of our data to be rendered by our
view-layer.

# Migrating to version > 0.12

Note that 0.12 no longer exports "default" and instead exports the named module "Process".

```javascript
// from
import Process from 'redux-saga-process'

// to
import { Process } from 'redux-saga-process'
```

## Examples

Here are a [few examples of some simple processes](https://github.com/Dash-OS/redux-saga-process/tree/master/examples) which are being used today.  When built
properly, a process should be a completely independent "module" which could be plugged
into any other app.  This should enable sharing of logic between your apps and/or each others.

- [Network Monitor Process](https://github.com/Dash-OS/redux-saga-process/blob/master/examples/networkMonitor/networkMonitor.js) - this shows
 most of the options available in use.  We specify this as a client-rendered process only, reduce part of our store, and observer push-style
 events.  In use we do a bit more monitoring of different events, but stripped some of that out to make it more direct of an example.
- [Action Logger](https://github.com/Dash-OS/redux-saga-process/blob/master/examples/actionLogger/actionLogger.js) - A minimal process which simply
  logs any actions dispatched.
- [Redux Persistor](https://github.com/Dash-OS/redux-saga-process/blob/master/examples/reduxPersistor/reduxPersistor.js) - Handles the management of
  saving application data to persistent storage via [redux-persist](https://github.com/rt2zz/redux-persist) (in our case we use localForage).
- [Firebase Listeners](https://github.com/Dash-OS/redux-saga-process/tree/master/examples/firebase) - Firebase Setup & Listeners

***

#### Creating a Saga Redux Process


```javascript
import { Process } from 'redux-saga-process'
class MyProcess extends Process { /* ... */ }
```

***

#### Building your Processes

Before we [create our Redux Store](http://redux.js.org/docs/basics/Store.html#store) we should start
by building our processes.  During its build phase, the properties of each Process will be parsed and
an environment will be created for each.

Below we show one example of how you may organize your processes.  We have a root
folder which has an index.js file that exports each "category" folder.  This folder
then exports each process that should be built.  With this setup, processes can be
thought of as "threads" while each category folder would represent an overall process.

```
> ./processes
> |---- ./ShoppingCart
> |-------- ./productFetcher
> |-------------- ./productFetcherProcess.js
> |-------- ./shoppingCart
> |-------------- ./shoppingCartProcess.js
> |-------- ./index.js
> |---- ./index.js
```

> ***Note:*** When you build your processes, the library will search up to two levels deep for classes that can be
> built and build any discovered processes.

Given the above configuration, we would then build our processes easily enough.  We would
simply do the following:

```javascript
// configureStore.js
import { buildProcesses } from 'redux-saga-process'
import * as processCategories from '../processes'
const processes = buildProcesses(processCategories)
```

***

#### Adding your Processes Reducers (Optional)

When your Process defines the [static reducer](https://github.com/Dash-OS/redux-saga-process#static-reducer) property,
a redux-style reducer will be built and added to the list of reducers for you.  This is accomplished by
combining the reducers returned by ```buildProcesses``` (via Redux's [combineReducers](http://redux.js.org/docs/api/combineReducers.html)).  These
reducers are found on the responses "processReducers" property.

> ***Tip:*** If multiple processes specify the same reducer name, they will be merged in the order they
> were created. This is handled by using the [arrayMapReducer](https://github.com/Dash-OS/redux-saga-process#arraymapreducerinitialstate-reducerarray-context) generator from [reducerGenerators.js](https://github.com/Dash-OS/redux-saga-process/blob/master/src/lib/reducerGenerators.js).

```javascript
// configureStore.js
import { combineReducers } from 'redux'
import { buildProcesses } from 'redux-saga-process'
import * as processCategories from '../processes'
const processes = buildProcesses(processCategories)

const rootReducer = combineReducers({
  /* Any other reducers you have may be added */
  ...processes.processReducers,
})
```

***

#### Running your Processes

Now that we have built our processes we need to run them.  This is done from within your
[root redux-saga](https://redux-saga.github.io/redux-saga/docs/introduction/BeginnerTutorial.html).

```javascript
// configureSagas.js
import { runProcesses } from 'redux-saga-process'
import * as processCategories from '../processes'

function* root() {
  // Processes are forked once ran, so we can simply use yield* in this case.
  // You could also use fork if you wish - but be careful with [spawn] if you
  // want to hot reload!
  yield* runProcesses(processCategories)
}

export default root
```

***

#### Hot Reloading Processes

We have the ability to hot reload our processes.  RSP will pass the `state` object,
if it exists, to the newly built process through the constructor.  This allows you to
handle it however you wish based on what the process does.

This allows us to hot reload the reducers **AND** the processes while maintaining state
across all of them.

```js
// when we run our sagas
let sagaTask = sagaMiddleware.run(rootSaga)
// then...
if ( module.hot ) {
  module.hot.accept('./reducers', () => {
    sagaTask.cancel()
    sagaTask.done.then(() => {
      // dynamic import reducers and sagas
      Promise.all([
        import('./reducers'),
        import('../ui/shared/sagas')
      ]).then( ([ new_reducers, new_sagas ]) => {
        // replace the reducers with the new reducers - this will
        // also rebuild our sagas efficiently (it doesnt re-build what it doesnt
        // have to).
        store.replaceReducer(new_reducers.default)
        // Update our sagaTask with the new task and run our sagas
        sagaTask = sagaMiddleware.run(new_sagas.default)
        // in case we want to handle the hot reload in our processes
        // (simply add an actionRoute for "hotReloaded")
        store.dispatch({
          type: 'HOT_RELOADED'
        })
      })
    })
  })
  module.hot.accept('../ui/shared/sagas', () => {
    // Accept changes to all of our sagas!
  })
}
```

***

# Building your Processes

So now lets look at what a Process actually looks like, and what it can do for us. As
shown above we start by building an ES6 class which extends ```Process```:

```javascript
import Process from 'redux-saga-process'
class MyProcess extends Process { /* ... */ }
```

***

## Process Properties

Our classes can be configured using [static properties](http://exploringjs.com/es6/ch_classes.html).  In our examples
we are using the babel [transform-class-properties](https://babeljs.io/docs/plugins/transform-class-properties/) plugin.

> ***Note:*** All of the properties are completely optional.

***


### static ```config```


```javascript
class MyProcess extends Process {
  static config = {
    /* Process Configuration Example */
    // enabled?  Setting to false will stop the process from being built and/or added
    // to the application. (default: true)
    enabled: true
    // providing this will indicate that we wish to reduce part of the redux store
    reduces: 'myState',
      // or
      // reduces: ['myState', 'myState2']
    // Should we run on the server side as well? (default: true)
    ssr: true
  }; // don't forget to add the semi-colon!
}
```

Providing a config property allows you to modify how the process will be built and handled.
We plan to utilize this property to add flexibility and features in the future.  Below are
the properties that can be provided within this property.


| Property        | Type(s)           | Description  |
| -------------   |:-------------:| ----- |
| **pid*          | _String_  | If using the `statics` connector, you will need to define a `pid` to use while importing a proceses exported values. |
| **enabled**     | _Boolean_ | true/false if this process is enabled.  If set to "false" the process will be ignored on startup. |
| **reduces**         | _String_ || _Array_ | a string indicating the name of the [reducer](http://redux.js.org/docs/basics/Reducers.html) this process should reduce. Or an array to provide multiple reducer keys.  <br /> <blockquote> ***Note:*** If this property is not defined a reducer will not be generated. </blockquote> |
| **ssr**         | _Boolean_ | true/false if this process should run on the server as well as the client (default: true) |

> ##### Overlapping Reducer Names / Reducer Merge
>
> There are times that we needed multiple processes to reduce against the same key within our
> state.  If you define multiple processes that reduce the same state we will merge them into
> a single reducer and also attempt to merge and ```initialState``` that is provided.
>
> This is done internally by building a reducer which reduces an array of reducers while passing
> and merging initialState and any reduction filters we have specified.
>
> It is probably inadvisable to do this as it can cause conflicts.  It is generally a better
> idea to have each process reduce its own key within your state.

> ##### Defining Multiple Reducers for a Single Process
>
> Another option is to have a single process reduce multiple keys.  This is another feature which should
> be used lightly, however, it can be very useful in certain situations that you need to be able to place
> data in various places.
>
> When an array is provided, the reducer is expected to be an Object Literal where the keys are the key to reducer
> and the values are any accept reducer type.

***


### static ```initialState```


```javascript
class MyProcess extends Process {
  static config = {
      // enabled reducing a portion of the redux store
    reduces: 'myState'
  };

  static initialState = {
    /* Initial 'myState' Reducer State */
    myKey: 'myValue'
  };
}
```

When we are adding a reducer we may want to define an initialState that the
store should use.  This is done by providing the initialState property as
shown above.  When your reducer is built we will pass the initialState as the
state on your first reduction.

> ***Tip:*** We also return the compiled initialState of all your processes as a result of
> the ```buildProcesses``` call.

***


### static ```reducer```


```javascript
import { MY_TYPE, MY_OTHER_TYPE } from '../constants'

class MyProcess extends Process {
  static config = {
    reduces: 'myState'
  };

  static initialState = {
    /* Initial 'myState' Reducer State */
    myKey: 'myValue',
    anotherKey: 'anotherValue'
  };

  // filters for MY_TYPE and MY_OTHER_TYPE
  static reducer = {
    [MY_TYPE]: (state, action) => ({
      ...state,
      myKey: action.value
    }),
    [MY_OTHER_TYPE]: (state, action) => ({
      ...state,
      anotherKey: action.value
    })
  };
}
```

We use "higher-order-reducers" to build special reducers that are used to filter the appropriate
actions into your processes reducers (and trigger your sagas if specified).  Your reducer property
can be either a ```Reducer Function``` which itself is a reducer, an ```Object Literal``` (as shown above)
which maps specific types into a reducer function, or an ```Array``` where each element itself is a reducer.

Object reducers may also use wildcard matching, and a special shortcut is given that may be used.

```javascript
// shows shorthand method of specifying the type to filter for.  this is
// is identical to the above example.

class MyProcess extends Process {
  static config = {
    reduces: 'myState'
  };

  static initialState = {
    /* Initial 'myState' Reducer State */
    myKey: 'myValue',
    anotherKey: 'anotherValue'
  };

  // filters for MY_TYPE and MY_OTHER_TYPE
  static reducer = {
    myType: (state, action) => ({
      ...state,
      myKey: action.value
    }),
    myOtherType: (state, action) => ({
      ...state,
      anotherKey: action.value
    })
  };
}
```


> ***Note:*** Our higher-order-reducers will automatically return an unmodified state if no types match your specified
> handlers.

> ***Note:*** Reducers should be pure.  You can not access ```this``` within them. Instead
> you should pass any desired properties within a dispatched action.


<details>
  <summary><b>An Example of using a Reducer Function</b></summary><p>

Here is an example of a reducer format that matches the style shown in the <b>redux</b> documentation:


```javascript
static reducer = function(state, action) {
  switch(action.type) {
    case MY_TYPE:
      return {
        ...state,
        myKey: action.value
      }
    default:
      return state
  }
};
```

</p></details>

<details>
  <summary><b>An Example of a Higher-Order-Reducer Generator (Click to Expand)</b></summary><p>
<br />
This is not strictly important to see or understand, but for those of you that are interested
in how we are building the reducers below is an example of the object filter reducer we showed
in the first example.


```javascript
const objectMapReducerGenerator =
  (initialState, handlers = {}) =>
    (state = initialState, action) =>
      (
        ! action || ! action.type || ! handlers[action.type] && state ||
        handlers[action.type](state, action)
      )
```
</p></details>


***


### static ```actionRoutes```

```javascript
import { put } from 'redux-saga/effects'
import { MY_TYPE, RECEIVED_ACTION } from '../constants'

class MyProcess extends Process {

  static actionRoutes = {
    [MY_TYPE]: 'myMethod'
  };

  * myMethod(action) {
    yield put({ type: RECEIVED_ACTION })
  }

}
```

Action Routes allow us to define types that we are interested in handling as a
side-effect and maps it to a method within your process.  If your method is a
generator you can use any of the redux-saga API via yield within the method.

actionRoutes support wildcard matching and the shorthand type defintion found
in other properties.  Below we match using the shorthand property and route
any types that start with "ACTION_" to our actionHandler.

```javascript
import { put } from 'redux-saga/effects'
import { RECEIVED_ACTION } from '../constants'

class MyProcess extends Process {

  static actionRoutes = {
    myType: 'myMethod',
    'ACTION_*': 'actionHandler'
  };

  * myMethod(action) {
    yield put({ type: RECEIVED_ACTION })
  }

  * actionHandler(action) {
    /* Handle types starting with ACTION_ */
  }
}
```

***

### static ```actionCreators```

```javascript
class MyProcess extends Process {

  static actionCreators = {
    trigger: [ 'action' ],
    myType:  [ 'username', 'password' ],
    fooType: { staticKey: 'staticValue' },
    fnType:  (value, props, obj) => ({ value, props, ...obj })
  };

  * processStarts() {

    yield* this.dispatch('trigger', 'this')
      // dispatches action to reducers ->
      //  { type: 'TRIGGER', action: 'this' }

    yield* this.dispatch('myType', 'myUsername', 'myPassword', { mergedKey: 'value' } )
      // dispatches action to reducers ->
      //  { type: 'MY_TYPE', username: 'myUsername', password: 'myPassword', mergedKey: 'value' }\

    yield* this.dispatch('fooType', { mergedKey: 'value' })
      // dispatches action to reducers ->
      //  { type: 'FOO_TYPE', staticKey: 'staticValue', mergedKey: 'value' }

    yield* this.dispatch('fnType', 'foo', 'bar', { mergedKey: 'value' })
      // dispatches action to reducers ->
      //  { type: 'FN_TYPE', value: 'foo', props: 'bar', mergedKey: 'value' }

  }
}
```

***

### static ```selectors```

```javascript
class MyProcess extends Process {
  static config = {
    reduces: 'myState'
  };

  static initialState = {
    /* Initial 'myState' Reducer State */
    foo: { nested: 'bar' },
    baz: 'qux'
  };

  static selectors = {
    local:   [ myState => myState.foo ],
    global:  [ state => state, state => state.anotherKey.foo ],
    global2: [ state => state.myState, myState => myState.baz ] // identical to above
    composed: [
      state => state.myState.foo.nested,
      state => state.myState.baz,
      (foo, baz) => ({ foo, baz })
    ],
  };

  * processStarts() {
    const local  = yield* this.select('local') // myValue
    const global = yield* this.select('global')     // value of foo in anotherState key
    const global2 = yield* this.select('global2')
    const composed = yield* this.select('composed')
    console.log(local, global, global2, composed)

  }
}
```

Currently powered by the [reselect](https://github.com/reactjs/reselect) library (although at some point
we would like to allow for plugins instead), selectors allow us to capture the state of our Application
within our processes.  While it is generally a best practice to handle state within the process for
most things related to our processes encapsulated logic (example: ```this.state```),
it can be helpful to capture our state.

You can use the ```this.select``` function to conduct operations using the pre-built selectors.  However,
you can also dynamically specify selectors that were not built using the reselect package (using the selectors property).

Under-the-hood this.select is simply calling redux-sagas [yield select(selector)](https://redux-saga.github.io/redux-saga/docs/api/index.html#selectselector-args)
and feeding it a [reselect selector](https://github.com/reactjs/reselect#createselectorinputselectors--inputselectors-resultfunc)

***

### static ```cancelTypes```
```javascript
import { put } from 'redux-saga/effects'
import { CANCEL_PROCESS, USER_LOGOUT } from '../constants'

class MyProcess extends Process {

  static cancelTypes = [
    { type: CANCEL_PROCESS },
    USER_LOGOUT
  ];

  * shouldProcessCancel(action) {
    switch(action.type) {
      case USER_LOGOUT: return true
      case CANCEL_PROCESS:
        if (action.name === this.name) return true
      default: return false
    }
  }

  * processCancels(action) {
    /* Conduct Cleanup */
  }

  * processStarts() {
    /* Cancel Ourself on Process Startup (As Example) */
    yield put({ type: CANCEL_PROCESS, name: this.name })
  }

}
```

# Connecting to React Components

When we want to connect actions and selectors provided by our processes, we have
the ability to use the "statics" module.  This will essentially connect to the
connect HOC that is provided - passing it the given processes public actions and/or
selectors.

You setup what actions and selectors should be public when defining your selectors
or actions by prefixing them with "!" (otherwise all will be imported).

```javascript
import React, { Component } from 'react'
import { connect } from 'react-connect'
import statics from 'redux-saga-process/statics'

class DashboardGrid extends Component {
  render() {
    // ...
  }
}

export default statics(
  {
    grid: ['actions', 'selectors'],
    processTwo: ['actions']
  },
  ({ selectors, actions }) => (
    connect(
      state => ({
        grid: selectors.grid(state)
      }),
      actions
    )(DashboardGrid)
  ),
  { prefixed: false }
)
```

# Process API

In addition to the static properties, process contains special API helpers
that can be used within your process to make some patterns easier to work with
and maintain.

> More Information Coming Soon...

***

## Process Task System

Tasks are essential to building powerful & asynchronous workflows within your
projects.  With the ```Process Task API``` it is simple to manage and maintain
your tasks.

Here are a few key points about the Task API:

- Tasks are given a `category` and `id` when created
- If a task with the same `category` and `id` is created, the previous is automatically cancelled.
- You can cancel a task by its `category` and `id`
- You can cancel all tasks in a `category`
- You can cancel all tasks
- You can register callbacks to occur when a task is complete

> ***Note:*** This API is really a convenience wrapper around the ```redux-saga```
> [task](https://redux-saga.github.io/redux-saga/docs/api/index.html#task) system
> implemented using their [fork](https://redux-saga.github.io/redux-saga/docs/api/index.html#forkfn-args)
> feature.

***

### this.task.create(category, id)

```javascript
const prop1 = 'foo', prop2 = 'bar'
yield* this.task.create('category', 'taskID', this.myTask, prop1, prop2)
```

***

### this.task.save(Task, category, id)

```javascript
const task = yield fork([this, this.myTask], prop1, prop2)
yield* this.task.save(task, 'category', 'taskID')
```

***

### this.task.task(category, id)

```javascript
const task     = yield* this.task.task('category', 'taskID')
const category = yield* this.task.task('category')
const all      = yield* this.task.task()
```

***

### this.task.cancel(category, id)

```javascript
yield* this.task.cancel('category', 'taskID')
// or
yield* this.task.cancel('category')
```

***

### this.task.onComplete(category, id, callback, ...props)

```javascript
* registerCallback() {
  const foo = 'foo', bar = 'bar'
  yield* this.task.onComplete('category', 'taskID', 'onComplete', foo, bar)
}

* onComplete(foo, bar) {
  // foo === 'foo', bar === 'bar'
}
```

***

### this.task.cancelAll()

```javascript
yield* this.task.cancelAll()
```

## Process Observables

Used to handle "push" events rather than "pull" events.  For example, we use
this API heavily for handling [Firebase](https://www.firebase.com) real-time
events within our processes.

Observables include a buffer, a cancellable promise, and more.  We will add
more information about how these works as we can, but feel free to try them
out!

> More Information Coming Soon...

```javascript
* observer(ref, type, id) {
  const { getNext, onData } = this.observable.create(id)
  const observerID = ref.on(type, onData)
  try {
    while (true) {
      const data = yield call(getNext)
      yield fork([this, this.processReceived], data)
    }
  } catch(error) {
    console.warn('Catch Called in Observer', error.message)
  } finally {
    if (yield cancelled()) {
      console.log('Observable Cancelled')
      ref.off(type, observerID)
    }
  }
}
```

***

### this.observable.create()

# Reducer Generators

Internally we use ```reducer generators``` to build reducers which reduce reducers.
This allows us to filter actions into our methods efficiently and allows us to build much
of the syntax we use for the static properties such as ```actionRoutes```.  You can
import these and use them elsewhere if desired.

```javascript
import { reducerReducer, arrayMapReducer, objectMapReducer } from 'redux-saga-process/generators'
```

***

### objectMapReducer(initialState, handlers, context)

Reduces an object with types as their keys and reducers as their values.

```javascript
const reducer = objectMapReducer(
  { foo: 'bar' },
  {
    'MY_TYPE': (state, action) => ({
      ...state,
      key: action.value
    }),
    'ANOTHER_TYPE': (state, action) => ({
      ...state,
      another: action.value
    })
  }
)
```

***

### arrayMapReducer(initialState, reducerArray, context)

Reduces an array of reducers.

```javascript
const reducer = arrayMapReducer(
  { foo: 'bar' }, // initialState
  [
    (state, action, context) => {
      /* reducer here */
      return state
    },
    (state, action, context) => {
      /* reducer here */
      return state
    }
  ],
  { shared: 'data' }
)
```

***

### reducerReducer(initialState, reducer, context)

A reducer which reduces a reducer.  The main purpose of this generator is to allow us
to inject information into the reducer before executing.  This is mostly used internally
but you may find a use for it.

```javascript
reducerReducer(
  { foo: 'bar' }, // initialState
  (state, action, context) => {
    switch(action.type) {
      case 'MY_TYPE':
        return {
          ...state,
          key: action.value
        }
      default:
        return state
    }
  },
  { shared: 'data' } // context
)
```

***

### Special Thanks & Inspirations

- **Dan Abramov [@gaearon](https://github.com/gaearon)** - Because it's the cool thing to do to thank him and obviously because of his endless contributions to the community including [redux](https://github.com/reactjs/redux) which is what this package is based upon (obviously).
- **Yassine Elouafi [@yelouafi](https://github.com/yelouafi) / [@redux-saga](https://github.com/redux-saga)** - For bringing us [redux-sagas](https://github.com/redux-saga/redux-saga) and for indirectly inspiring the process concept while assisting us with questions.
- **Steve Kellock [@skellock](https://github.com/skellock)** - [reduxsauce](https://github.com/skellock/reduxsauce) - Originally we used reduxsauce to handle some of the handling of data.  Many parts of this package are heavily inspired by the great package they have provided!