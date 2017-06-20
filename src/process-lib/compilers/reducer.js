import _ from 'lodash';
import ToReduxType from 'to-redux-type';

import createObjectMapReducer from 'reducer-generator-object-map';
import createArrayMapReducer from 'reducer-generator-array-map';
import createReducerReducer from 'reducer-generator-reducer';
import createWildcardReducer from 'reducer-generator-wildcard';

// TODO: This can be cleaned up

export default function compileSagaProcessReducers(
  value,
  Processes,
  ProcessSchema,
  SharedSchema,
  Compiled,
) {
  const compiledReducers = Compiled.get('reducers') || {};
  for (let [reducerKey, reducers] of value) {
    // each reducer will be a Set of reducer primitives which we
    // will merge into a single reducer.
    const initialState = SharedSchema.get('initialState').get(reducerKey);
    compiledReducers[reducerKey] = createArrayMapReducer(
      initialState || {},
      compileSagaProcessReducerValue(reducerKey, reducers, Compiled),
    );
  }
  Compiled.set('reducers', compiledReducers);
}

function compileSagaProcessReducerValue(
  reducerKey,
  reducers,
  Compiled,
  config = {},
) {
  const compiledConfig = Compiled.get('config');

  let compiledReducer = [],
    isWildcardReducer = false,
    reducerConfig = Object.assign({}, config);

  for (let value of reducers) {
    const _reducer = value[1];
    let reducer;
    if (_reducer.config) {
      reducerConfig = Object.assign(reducerConfig, _reducer.config);
      reducer = _reducer.reducer;
    } else {
      reducer = _reducer;
    }
    if (typeof reducer === 'function') {
      /*
          If a function-type reducer is given then we will not be
          able to optimize reducers as we can't know all types that
          we are interested in.
        */
      compiledConfig.optimizeReducers = false;
      compiledReducer.push(createReducerReducer(undefined, reducer));
    } else if (Array.isArray(reducer)) {
      // if an array, compile each in the array
      compiledReducer.push(
        ...compileSagaProcessReducerValue(
          reducerKey,
          reducer,
          Compiled,
          reducerConfig,
        ),
      );
    } else if (_.isPlainObject(reducer)) {
      /*
          An object indicates that we want to reduce the given types.  In this
          case we can optimize by maintaining a "Set" of types that our processes
          have specified reducers for.
        */
      if (compiledConfig.transformTypes !== false) {
        // convert the keys of the reducer into screaming snake case values
        reducer = ToReduxType(reducer);
      }

      // console.log(reducer)
      if (compiledConfig.wildcard === true && reducerConfig.wildcard === true) {
        for (let type of Object.keys(reducer)) {
          if (type.includes('*')) {
            isWildcardReducer = true;
            break;
          }
        }
      }
      if (isWildcardReducer) {
        compiledReducer.push(createWildcardReducer(undefined, reducer));
      } else {
        compiledReducer.push(createObjectMapReducer(undefined, reducer));
      }
    }
  }

  Compiled.set('config', compiledConfig);

  return compiledReducer;
}
