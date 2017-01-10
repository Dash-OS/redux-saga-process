import { spawn } from 'redux-saga/effects'
import { createReducer } from 'reduxsauce'
import { createSelector } from 'reselect'

function* runProcesses(categories) {
  for (const categoryID of Object.keys(categories)) {
    const category = categories[categoryID]
    for (const processID of Object.keys(category)) {
      const process = category[processID]
      const { config = {} } = process
      const SagaProcess = new process(config)
      yield spawn(SagaProcess.call(SagaProcess.processInit, process))
    }
  }
}

function connectReducers(categories) {
  const processReducers = {}
  for ( const categoryID of Object.keys(categories) ) {
    const category = categories[categoryID]
    for (const processID of Object.keys(category)) {
      const process = category[processID]
      const { 
        config = {}, 
        reducer, 
        initialState = {}, 
        actionRoutes,
        selectors
      } = process
      if (config.reduces && reducer) {
        processReducers[config.reduces] = createReducer(initialState, reducer)
      }
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
  }
  return processReducers
}

export { connectReducers, runProcesses }