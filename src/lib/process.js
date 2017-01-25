/* eslint-disable no-constant-condition */

import {  CANCEL, delay } from 'redux-saga'
import { TASK } from 'redux-saga/utils'
import { take, fork, put, cancel, call, race, apply, cancelled, select } from 'redux-saga/effects'

import { 
  isReduxType, 
  toReduxType, 
  props as processProps, 
  isObjLiteral,
  cancellablePromise
} from './helpers'

import { Wildcard, hasWildcard } from './wildcard'

const WC = processProps.wildcardMatch && new Wildcard()

class Process {
  
  constructor(config, State) {
    this.config = config
    this.state  = State || {}
    
    this.task.classTasks = []
    this.task.roster     = {}
    
    this.__utils.init = this.__utils.init.bind(this)
    
    this.task.create = this.task.create.bind(this)
    this.task.save   = this.task.save.bind(this)
    this.task.cancel = this.task.cancel.bind(this)
    this.task.onComplete = this.task.onComplete.bind(this)
    this.task.task = this.task.task.bind(this)
    this.task.cleanup = this.task.cleanup.bind(this)
    this.task.cancelAll = this.task.cancelAll.bind(this)
    
    this.observable.create = this.observable.create.bind(this)
    
    this.select   = this.select.bind(this)
    this.dispatch = this.dispatch.bind(this)
  }
  
  __utils = {
    refs: {},
    
    * init(target) {
      this.name = this.name || target.name || 'ANONYMOUS_PROCESS'
      const staticsTask = yield fork([ this, this.__utils.startProcessMonitor ], target)
      let startTask
      if (typeof this.processStarts === 'function') {
        startTask = yield fork([this, this.processStarts])
      }
      this.task.classTasks.push(staticsTask, startTask)
    },
    
    * startProcessMonitor(target) {
      const {
        actions,
        types,
        actionRoutes, 
        selectors, 
        cancelTypes, 
        name
      } = target
  
      const config = { wildcard: false }
      const monitorPattern = actionRoutes && getPattern(actionRoutes, config) || '@@_PROCESS_DONT_MONITOR_TYPE_',
            cancelPattern  = cancelTypes  && getPattern(cancelTypes) || '@@_PROCESS_DONT_MONITOR_TYPE_'
            
      this.__utils.selectors = selectors
      this.__utils.actions   = actions
      this.__utils.target    = target
      
      if ( monitorPattern === '@@_PROCESS_DONT_MONITOR_TYPE_' && cancelPattern === '@@_PROCESS_DONT_MONITOR_TYPE_') {
        //console.info(name, ' process does not monitor anything and will be killed when it completes its lifecycle')
        return
      }
      
      try {
        let stopCheck
        while ( ! stopCheck ) {
          const { monitorAction, cancelAction } = yield race({
            monitorAction: take(monitorPattern),
            cancelAction:  take(cancelPattern)
          })
          if (monitorAction) {
            yield fork([this, this.__utils.handleMonitorExecution], monitorAction, config)
            continue
          } else if (cancelAction) {
            stopCheck = yield apply(this, this.__utils.handleCancelExecution, [ cancelAction, config ])
          }
        }
      } catch (e) {
        console.error(`Process ${name} Error Occurred: e.message`)
        throw new Error(e)
      }
      for ( let classTask of this.task.classTasks ) {
        try {
          yield cancel(classTask)
        } catch (e) {
          console.error('Error while Cancelling a Task: ', e.message, classTask)
        }
      }
      this.task.classTasks = []
    },
    
    * handleMonitorExecution(action, config = {}) {
      const { actionRoutes, name } = this.__utils.target
      const route = actionRoutes[action.type]
      if (typeof this[route] !== 'function' ) {
        if ( ! config.wildcard ) {
          console.error(`${name}'s Action Route ${route} is not a function`)
          return
        }
      } else {
        yield fork([this, this[route]], action)
      }
      if ( config.wildcard && this.config.matchWildcard !== false ) {
        const matches = WC.pattern(actionRoutes).search(action.type)
        for ( let match in matches ) {
          const fn = matches[match]
          if ( typeof this[fn] !== 'function' ) {
            console.error(`${name}'s Action Route ${route} is not a function`)
            continue
          } else {
            yield fork([this, this[fn]], action)
          }
        }
      }
    },
    
    * handleCancelExecution(action, config = {}) {
      var stopCheck = true
      if (typeof this.shouldProcessCancel === 'function') {
        stopCheck = yield apply(this, this.shouldProcessCancel, [ action ])
      } else { stopCheck = true }
      if (stopCheck) {
        if (typeof this.processWillCancel === 'function') {
          const override = yield apply(this, this.processWillCancel, [ action ])
          if ( override === false ) { stopCheck = override }
        }
      }
      return stopCheck
    },
    
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
      yield fork([this, this.task.onComplete], category, id, ['task', 'cleanup'], category, id)
    },
    
    * task(category, id) {
      if ( ! id && this.task.roster[category] ) {
        return this.task.roster[category]
      } else if ( id && category ) {
        return this.task.roster[category] && this.task.roster[category][id]
      } else if ( ! id && ! category ) {
        return this.task.roster
      }
    },
    /*
      onComplete()
        Register a callback that will be made with the "this" context attached
        and as a redux-saga.  The callback will be made once the given tasks
        promise (task.done) is resolved.  The callback will be made whether the 
        task was cancelled or not.
    */
    * onComplete(category, id, callback, ...props) {
      // Wait until the task has completed this includes any forks but
      // not spawns.
      const task = yield* this.task.task(category, id)
      if ( ! task || ! task.done ) {
        console.error('[PROCESS] Task Watcher received an invalid task object: ', task)
        return
      }
      try { yield task.done } finally {
        // Make the callback if the function is found, otherwise transmit
        // a message to console
        if ( ! callback ) { return }
        if ( Array.isArray(callback) ) {
          const fn = this[callback[0]] && this[callback[0]][callback[1]] 
          if ( typeof fn === 'function' ) { yield apply(this, fn, props) }
        } else if ( typeof this[callback] === 'function' ) {
          yield apply(this, this[callback], props)
        } else if ( typeof callback === 'function' ) {
          yield apply(this, callback, props)
        } else { 
          console.error('Function not found: ', callback) 
        }
      }
    },
    * cleanup(category, id) {
      const roster = this.task.roster
      if ( roster[category] && roster[category][id] ) {
        delete this.task.roster[category][id]
        if ( Object.keys(this.task.roster[category] === 0 ) ) {
          delete this.task.roster[category]
        }
      }
    },
    * cancel(category, id) {
      //const task = yield* this.task.task(category, id)
      const task = yield apply(this, this.task.task, [ category, id ])
      if ( ! task ) {
        // Should we warn about the task not existing?
        return
      }
      if (task && task[TASK] && task.isRunning()) { 
        yield cancel(task)
      } else if ( task && ! task[TASK] ) {
        const ids = Object.keys(task)
        for (const id of ids) {
          yield fork([this, this.task.cancel], category, id)
        }
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
        if ( typeof handleCancel === 'function' ) {
          handleCancel(...cancelArgs, name).bind(this)
        }
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
          return cancellablePromise(promise, onCancel, CANCEL)
        }
      }
    }
  };

  * select(selector, props) {
    let results
    if ( 
      typeof selector === 'string' && 
      this.__utils.selectors &&
      ( this.__utils.selectors.public[selector] || this.__utils.selectors.private[selector] )
    ) {
      const selectFn = this.__utils.selectors.public[selector] || this.__utils.selectors.private[selector]
      return yield select(selectFn, props)
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
    } else if ( ! selector ) {
      return yield select(state => state[this.config.reduces])
    }
    return results
  }
  
  * dispatch(action, ...args) {
    const actionFn = 
      typeof action === 'string' 
      && this.__utils.actions 
      && (  this.__utils.actions.public[action] 
        ||  this.__utils.actions.private[action] 
      )
    if ( actionFn ) {
      console.log(actionFn(...args))
      yield put(actionFn(...args))
    } else if ( typeof action === 'object' && action.type ) {
      yield put(action)
    } else { throw new Error('Must dispatch either a registered action or a valid redux action object.') }
  }
  
  * setState(state) {
    this.state = {
      ...this.state,
      ...state
    }
  }
}

const getPattern = (_types, config) => {
  const patterns = []
  let types, isObject
  
  if (isObjLiteral(_types)) {
    types = Object.keys(_types)
    isObject = true
  } else {
    types = _types
    isObject = false
  }

  if (types === undefined || types.length === 0) {
    return '@@_PROCESS_DONT_MONITOR_TYPE_'
  }

  for (const type of types) {
    parseTypePattern(type, isObject, _types, patterns, config)
  }
  
  return action => patterns.some(func => func(action))
}

const parseTypePattern = (type, isObject, _types, patterns, config) => {
  const wildcardMatch = processProps.wildcardMatch && hasWildcard(type)
  if ( wildcardMatch ) { config.wildcard = true }
  let fn
  const params = isObject ? _types[type] : _types
  switch (typeof params) {
    case 'string': {
      fn = wildcardMatch
        ? action => WC.pattern(type).match(action.type)
        : action => action.type === type
      patterns.push(fn)
      break
    }
    case 'object': {
      let fn
      if (Array.isArray(type)) {
        fn = wildcardMatch
          ? action => WC.pattern(type).match(action.type)
          : action => action.type
      } else {
        fn = action => Object.keys(type).every(x => type[x] === action[x])
      }
      patterns.push(fn)
      break
    }
    case 'function':
      patterns.push(fn)
      break
    default:
      console.error(`Unsupported type ${type}`)
  }
}


export default Process