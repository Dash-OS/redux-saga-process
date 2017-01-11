import { spawn } from 'redux-saga/effects'
import { createReducer } from 'reduxsauce'
import { createSelector } from 'reselect'

const props = { built: false }

function* runProcesses(categories) {
  for (const categoryID of Object.keys(categories)) {
    const category = categories[categoryID]
    for (const processID of Object.keys(category)) {
      const process = category[processID]
      const { config = {} } = process
      if ( ! props.built ) { 
        console.log('Did not connect to reducers before calling runProcesses')
        buildProcess(process)
      }
      const SagaProcess = new process(config)
      yield spawn(SagaProcess.call(SagaProcess.processInit, process))
    }
  }
}

function connectReducers(categories) {
  const processReducers = {}
  for ( const categoryID of Object.keys(categories) ) {
    const category = categories[categoryID]
    const { name: parentName } = Object.getPrototypeOf(process) || {}
    if ( parentName === 'redux-saga-process-class' ) {
      const { key, reducer } = buildProcess(process)
      if ( key && reducer ) { processReducers[key] = reducer }
    } else if ( typeof category === 'object' ) {
      for (const processID of Object.keys(category)) {
        const process = category[processID]
        const { key, reducer } = buildProcess(process)
        if ( key && reducer ) { processReducers[key] = reducer }
      }
    }
  }
  return processReducers
}

const buildProcess = process => {
  const { name: parentName } = process && Object.getPrototypeOf(process) || {}
  if ( parentName !== 'redux-saga-process-class' ) { return {} }
  const { config = {}, reducer, initialState, selectors } = process
  const processReducer = buildReducer({config, reducer, initialState})
  buildSelectors({selectors, config})
  return processReducer
}

const buildReducer = ({ config, reducer, initialState }) => ({
  key:     config.reduces,
  reducer: config.reduces && createReducer(initialState, reducer)
})

const buildSelectors = ({ selectors, config }) => {
  if ( selectors ) {
    for ( const selector in selectors ) {
      const selectorValue = selectors[selector]
      if ( Array.isArray(selectorValue) ) {
        if ( selectorValue.length === 1 ) {
          const coreSelector = config.reduces ? state => state[config.reduces] : state => state
          selectors[selector] = createSelector(coreSelector, ...selectors[selector])
        } else {
          selectors[selector] = createSelector(...selectors[selector])
        }
      } else { throw new Error('Process Selectors must be an array of selectors') }
    }
  }
}

export { connectReducers, buildProcess, runProcesses }