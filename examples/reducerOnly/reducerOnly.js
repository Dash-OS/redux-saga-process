import Process from 'redux-saga-process'

import { INCREMENT, DECREMENT, RESET } from './types'

/*
  ReducerOnlyProcess
    This is an example to show how we can easily build a reducer which 
    will automatically be added for us.  This will create a reducer with 
    'counters' as its key.  It will then start reducing INCREMENT, DECREMENT,
    and RESET as shown.
    
    While this probably is far less efficient than a standard reducer and does 
    not really add any new features, it is just an example to show the simplicity 
    and composability of the package.
    
*/

export default class ReducerOnlyProcess extends Process {

  static config = { reduces: 'counters' };

  static reducer = {
    [INCREMENT]: (state, { id = '_default', by = 1 }) => ({
      ...state,
      [id]: ( state[id] || 0 ) + by
    }),
    [DECREMENT]: (state, { id = '_default', by = 1 }) => ({
      ...state,
      [id]: ( state[id] || 0 ) - by
    }),
    [RESET]: (state, { id = '_default' }) => ({
      ...state,
      [id]: 0
    })
  };

}
