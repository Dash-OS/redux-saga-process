/* eslint-disable no-constant-condition */

import {  CANCEL } from 'redux-saga'
import { take, fork, put, cancel, call, race, apply, cancelled, select } from 'redux-saga/effects'

function cancellablePromise(p, onCancel) {
  p[CANCEL] = onCancel // eslint-disable-line
  return p
}

class Process {
  
  constructor(config, State) {
    this.config = config
    this.state  = State
    
    this.task.classTasks = []
    this.task.roster     = {}
    
    this.__utils.init = this.__utils.init.bind(this)
    
    this.task.create = this.task.create.bind(this)
    this.task.save   = this.task.save.bind(this)
    this.task.cancel = this.task.cancel.bind(this)
    this.task.watch = this.task.watch.bind(this)
    this.task.cleanup = this.task.cleanup.bind(this)
    this.task.cancelAll = this.task.cancelAll.bind(this)
    
    this.observable.create = this.observable.create.bind(this)
    
    this.select   = this.select.bind(this)
    this.dispatch = this.dispatch.bind(this)
  }
  
  __utils = {
    refs: {},
    * init(target) {
      this.name = this.name || target.name || 'ANONYMOUS_SAGA_PROCESS'
      const staticsTask = yield fork([ this, this.__utils.checkStatics ], target)
      let startTask
      if (typeof this.processStarts === 'function') {
        startTask = yield fork([this, this.processStarts])
      }
      this.task.classTasks.push(staticsTask, startTask)
    },
    getPattern(_types) {
      const patterns = []
      let types, isObject
      if (Array.isArray(_types) === false && typeof _types === 'object') {
        types = Object.keys(_types)
        isObject = true
      } else {
        types = _types
        isObject = false
      }
  
      if (types === undefined || types.length === 0) {
        return '_DONT_MONITOR_TYPE_'
      }
  
      for (const type of types) {
        let fn
        const params = isObject ? _types[type] : _types
        switch (typeof params) {
          case 'string':
            fn = action => action.type === type
            patterns.push(fn)
            break
  
          case 'object':
            if (Array.isArray(type)) {
              console.error(`Array is not supported type`)
              break
            }
            fn = action => Object.keys(type).every(x => type[x] === action[x])
            patterns.push(fn)
            break
  
          case 'function':
            patterns.push(fn)
            break
  
          default:
            console.error(`Unsupported type ${type}`)
        }
      }
      return action => patterns.some(func => func(action))
    },
    /*
      __utils.checkStatics
        Checks the static properties that we have received
    */
    * checkStatics(target) {
      const {
        actions,
        types,
        actionRoutes, 
        selectors, 
        cancelTypes, 
        name
      } = target
  
      const monitorPattern = this.__utils.getPattern(actionRoutes),
            cancelPattern  = this.__utils.getPattern(cancelTypes)
      
      this.__utils.selectors = selectors
      this.__utils.actions   = actions
      if ( types ) { this.types = types }
      
      try {
        let stopCheck
        while (!stopCheck) {
          const { monitorAction, stopAction } = yield race({
            monitorAction: take(monitorPattern),
            cancelAction: take(cancelPattern)
          })
          if (monitorAction) {
            const route = actionRoutes[monitorAction.type]
            if (typeof this[route] !== 'function') {
              console.error(`${name}'s Action Route ${route} is not a function`)
              continue
            }
            const task = yield fork([this, this[route]], monitorAction)
            //this.task.classTasks.push(task)
            continue
          }
          if (stopAction) {
            if (typeof this.shouldProcessCancel === 'function') {
              stopCheck = yield apply(this, this.shouldProcessCancel, [ stopAction ])
            } else { stopCheck = true }
            if (stopCheck) {
              if (typeof this.processCancels === 'function') {
                yield apply(this, this.processCancels, [ stopAction ])
              }
            }
          }
        }
      } catch (e) {
        console.error(`${name} Error: e.message`)
        throw new Error(e)
      }
      for (const task of this.task.classTasks) {
        if (task.isRunning()) {
          yield cancel(task)
        }
      }
      this.task.classTasks = []
    }
    
  }
  
 // yield* this.task.create('handlers', 'clicks', 'handleClick', action)
  
  task = {
    * create(category, id, callback, ...props) {
      const task = yield fork([this, callback], ...props)
      yield* this.task.save(task, category, id)
      return task
    },
    /*
      this.task.save(...)
        Saves a task with a category and id. 
    */
    * save(task, category, id) {
      const roster = this.task.roster
      // If we save a task that was already saved previously we 
      // will cancel the previous task automatically. 
      if ( roster[category] && roster[category][id] ) {
        yield apply(this, this.task.cancel, [ category, id ])
      }
      this.task.roster = {
        ...roster,
        [category]: {
          ...roster[category],
          [id]: task
        }
      }
      yield fork([this, this.task.watch], task, category, id, ['task', 'cleanup'], category, id)
    },
    /*
      watchTask()
        Register a callback that will be made with the "this" context attached
        and as a redux-saga.  The callback will be made once the given tasks
        promise (task.done) is resolved.  The callback will be made whether the 
        task was cancelled or not.  The first prop sent to the callback will always 
        include the status of the task.
    */
    * watch(task, category, id, callback, ...props) {
      // Wait until the task has completed this includes any forks but
      // not spawns.
      if ( ! task || ! task.done ) {
        console.error('[PROCESS] Task Watcher received an invalid task object: ', task)
        return
      }
      try { yield task.done } finally {
        let status
        if (yield cancelled()) {
          // Is extra logic needed for cancellation condition?
          status = 'cancelled'
        } else {
          status = 'ok'
        }
        // Make the callback if the function is found, otherwise transmit
        // a message to console
        if ( ! callback ) { return }
        if ( Array.isArray(callback) ) {
          const fn = this[callback[0]] && this[callback[0]][callback[1]] 
          if ( typeof fn === 'function' ) { yield apply(this, fn, [ status, ...props ]) }
        } else if ( typeof this[callback] === 'function' ) {
          yield apply(this, this[callback], [ status, ...props ])
        } else if ( typeof callback === 'function' ) {
          yield apply(this, callback, [ status, ...props])
        } else { 
          console.error('Function not found: ', callback) 
        }
      }
    },
    * cleanup(status, category, id) {
      const roster = this.task.roster
      if ( roster[category] && roster[category][id] ) {
        delete this.task.roster[category][id]
        if ( Object.keys(this.task.roster[category] === 0 ) ) {
          delete this.task.roster[category]
        }
      }
    },
    * cancel(category, id) {
      let task
      if ( this.task.roster[category] ) {
        if ( id && this.task.roster[category][id] ) {
          task = this.task.roster[category][id]
        } else if ( ! id ) {
          const ids = Object.keys(this.task.roster[category])
          for (const id of ids) {
            yield fork([this, this.task.cancel], category, id)
          }
        }
        if (task && task.isRunning()) { yield cancel(task) }
      }
    },
    * cancelAll() {
      const categories = Object.keys(this.task.roster)
      for (const category of categories) {
        yield apply(this, this.task.cancel, [ category ])
      }
    }
  };
  
  observable = {
    create(name, handleCancel, ...cancelArgs) {
      const actionQueue = []
      const dispatchQueue = []
      const observerRef = Symbol(name)
      this.observable[observerRef] = (...values) => {
        const queued = actionQueue.length + dispatchQueue.length
        if (dispatchQueue.length) {
          const nextDispatch = dispatchQueue.shift()
          nextDispatch({ values, name, queued })
        } else {
          actionQueue.push({ values, name, queued })
        }
      }
  
      const onCancel = () => {
        delete this.observable[observerRef]
        handleCancel(...cancelArgs, name)
      }
  
      return {
        onData: this.observable[observerRef],
        onCancel: () => {
          onCancel()
          return cancelled
        },
        getNext() {
          let promise
          if (actionQueue.length) {
            promise = Promise.resolve(actionQueue.shift())
          } else {
            promise = new Promise(resolve => dispatchQueue.push(resolve))
          }
          return cancellablePromise(promise, onCancel)
        }
      }
    }
  };

  * select(selector, props) {
    let results
    if ( 
      typeof selector === 'string' && 
      this.__utils.selectors &&
      Object.keys(this.__utils.selectors).includes(selector)
    ) {
      return yield select(this.__utils.selectors[selector], props)
    } else if ( typeof selector === 'function' ) {
      return yield select(selector)
    } else if ( Array.isArray(selector) ) {
      results = []
      for ( let selected of selector ) {
        results.push( yield apply(this, this.select, [ selected ]) )
      }
    } else if (
      typeof selector === 'string' &&
      this.config && this.config.reduces
    ) {
      return yield select(state => state[this.config.reduces][selector])
    }
    return results
  }
  
  * dispatch(action, ...args) {
    if (
      typeof action === 'string' &&
      this.__utils.actions &&
      Object.keys(this.__utils.actions).includes(action)
    ) {
      yield put(this.__utils.actions[action](...args))
    } else if ( action && action.type ) {
      yield put(action)
    } else { throw new Error('Must dispatch either a registered action or a valid redux action object.') }
  }

}

export default Process