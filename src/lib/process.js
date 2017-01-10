/* eslint-disable no-constant-condition */

import {  CANCEL } from 'redux-saga'
import { take, fork, put, cancel, call, race, apply, cancelled, select } from 'redux-saga/effects'

function cancellablePromise(p, onCancel) {
  p[CANCEL] = onCancel // eslint-disable-line
  return p
}

class Process {
  
  constructor(props, State) {
    console.log('Constructs')
    console.log(new.target)
    this.props = props
    this.__classTasks = []
    this.__savedTasks = {}
    this.__checkStatics = this.__checkStatics.bind(this)
    this.__getPattern = this.__getPattern.bind(this)
    this.select = this.select.bind(this)
    this.createObservable = this.createObservable.bind(this)
    this.cancelTask = this.cancelTask.bind(this)
    this.cancelTaskCategory = this.cancelTaskCategory.bind(this)
    this.saveTask = this.saveTask.bind(this)
    this.cancelAllTasks = this.cancelAllTasks.bind(this)
    this.processInit = this.processInit.bind(this)
    this.state = State
  }

  __getPattern(_types) {
    const patterns = []

    let types
    let isObject
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
  }

  * __checkStatics(target) {
    const { actionRoutes, selectors, cancelTypes, name } = target

    const monitorPattern = this.__getPattern(actionRoutes),
          cancelPattern  = this.__getPattern(cancelTypes)
    
    this.__selectors = selectors
    
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
            console.warn(`${name}'s Action Route ${route} is not a function`)
            continue
          }
          const task = yield fork([this, this[route]], monitorAction)
          this.__classTasks.push(task)
          continue
        }

        if (stopAction) {
          if (typeof this.shouldProcessCancel === 'function') {
            stopCheck = yield apply(this, this.shouldProcessCancel, [ stopAction ])
          } else {
            stopCheck = true
          }
          if (stopCheck) {
            if (typeof this.processCancels === 'function') {
              yield apply(this, this.processCancels)
            }
          }
        }
      }
    } catch (e) {
      console.error(`${name}'s Check Statics is cancelling`, e.message)
    }

    console.log(`Cancelling Process: ${name}`)

    for (const task of this.__classTasks) {
      if (task.isRunning()) {
        yield cancel(task)
      }
    }

    this.__classTasks = []
  }

  * saveTask(task, category, id) {
    const prevTasks = this.__savedTasks

    if (prevTasks[category] && prevTasks[category][id]) {
      console.warn('You must cancel a task before you set a new task with same category and id. We are cancelling it for you')
      yield apply(this, this.cancelTask, [ category, id ])
    }

    this.__savedTasks = {
      ...prevTasks,
      [category]: {
        ...prevTasks[category],
        [id]: task
      }
    }
  }

  * cancelTask(category, id) {
    if (this.__savedTasks[category] && this.__savedTasks[category][id]) {
      const task = this.__savedTasks[category][id]
      if (task.isRunning()) {
        yield cancel(task)
      }
    } else {
      console.warn('Attempted to cancel a task that doesnt exist', category, id)
    }
  }

  * cancelTaskCategory(category) {
    if (this.__savedTasks[category]) {
      const ids = Object.keys(this.__savedTasks[category])
      for (const id of ids) {
        yield apply(this, this.cancelTask, [ category, id ])
      }
    } else {
      console.warn('Attempted to cancel tasks of a category that doesnt exist', category)
    }
  }

  * cancelAllTasks() {
    const categories = Object.keys(this.__saveTasks)
    for (const category of categories) {
      yield apply(this, this.cancelCategory, [ category ])
    }
  }
  
  * select(selector) {
    if ( 
      typeof selector === 'string' && 
      this.__selectors &&
      Object.keys(this.__selectors).includes(selector)
    ) {
      return yield select(this.__selectors[selector])
    } else if (
      typeof selector === 'function'
    ) {
      return yield select(selector)
    } else if ( 
      Array.isArray(selector)
    ) {
      const results = []
      for ( let selected of selector ) {
        results.push( yield apply(this, this.select, [ selected ]) )
      }
    }
  }

  createObservable(name, handleCancel, ...cancelArgs) {
    const actionQueue = []
    const dispatchQueue = []
    const observerRef = Symbol(name)
    this[observerRef] = (...values) => {
      const queued = actionQueue.length + dispatchQueue.length
      if (dispatchQueue.length) {
        const nextDispatch = dispatchQueue.shift()
        nextDispatch({ values, name, queued })
      } else {
        actionQueue.push({ values, name, queued })
      }
    }

    const onCancel = () => {
      delete this[observerRef]
      handleCancel(...cancelArgs, name)
    }

    return {
      onData: this[observerRef],
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

  * processInit(target) {
    const { name } = target
    yield put({ type: 'PROCESS_STARTS', name })
    const staticsTask = yield fork([ this, this.__checkStatics ], target)
    let startTask
    if (typeof this.processStarts === 'function') {
      startTask = yield fork([this, this.processStarts])
    }
    this.__classTasks.push(staticsTask, startTask)
    yield put({ type: 'WAIT' })
  }
}

export default Process