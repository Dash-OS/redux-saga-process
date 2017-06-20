import _ from 'lodash';
import invokeIf from 'invoke-if';

/*
  When parsing the reducers, we need to capture and save all the reducers into
  a single SharedSchema.  This allows us to build the reducers in a way that will
  avoid conflict as much as possible (or at least be as predictable as possible)
  as we bring the reducers together to form a final reducer to send to redux.

  If the user defines an array for their config: { reduces: [ 'key1', 'key2' ] }
  then their reducer is expected to be an object mapping to the reducers
  { key1: <reducer>, key2: <reducer> }.  Otherwise the reducer is just the given
  value.

  We are not actually compiling the reducers at this point.  This is so that we can
  maintain a pure "SharedSchema" of our values that will allow us to better work with
  the environment.

  In addition, we also extract the initialState value, if given so that we can bring
  those values in.
*/
export default function parseSagaProcessReducer(proc, SharedSchema, Compiled) {
  const { schema } = proc;
  if (!schema.config.reduces) {
    return;
  }

  /*
    If the process provides a value for the 'reduces' config, we will
    create reducers for the process.
  */

  let reduces, reducer, initialState;

  if (Array.isArray(schema.config.reduces)) {
    // An array of keys that we will reduce.  In this situation the
    // options value will be an object
    if (!_.isPlainObject(schema.reducer)) {
      throw new Error(
        `${schema.processID} compiltation failed.  When providing an array for config.reducers, the reducer should be a plain object mapping each provided reducer key to a valid process reducer.`,
      );
    }
    reduces = schema.config.reduces;
    reducer = schema.reducer;
    initialState = schema.initialState || {};
  } else if (typeof schema.config.reduces === 'string') {
    reduces = [schema.config.reduces];
    reducer = { [schema.config.reduces]: schema.reducer };
    initialState = { [schema.config.reduces]: schema.initialState };
  }

  for (let reducerKey of reduces) {
    buildReducer(
      reducerKey,
      reducer,
      initialState,
      proc,
      SharedSchema,
      Compiled,
    );
  }
}

function buildReducer(
  reducerKey,
  reducer,
  initialState,
  proc,
  SharedSchema,
  Compiled,
) {
  const newReducer = reducer[reducerKey];

  if (!newReducer) {
    return;
  }

  const { schema: { processID } } = proc;
  const compiledConfig = Compiled.get('config');
  const newInitialState = initialState[reducerKey];
  const sharedReducers = SharedSchema.get('reducer');
  const sharedInitialState = SharedSchema.get('initialState');

  let keyReducers;
  let keyInitialState = {};

  const reducerConfig = {
    wildcard: compiledConfig.wildcard === false
      ? false
      : proc.schema.config.wildcard === true,
  };

  invokeIf(
    [
      sharedReducers.has(reducerKey),
      () => {
        keyReducers = sharedReducers.get(reducerKey);
      },
    ],
    // if we have an initial state, merge with previous (if it exists)
    // otherwise create and add the initial state for the reducerKey
    [
      newInitialState,
      () =>
        invokeIf(
          [
            sharedInitialState.has(reducerKey),
            () => {
              keyInitialState = sharedInitialState.get(reducerKey);
            },
          ],
          [
            true,
            () => {
              Object.assign(keyInitialState, newInitialState);
              sharedInitialState.set(reducerKey, keyInitialState);
            },
          ],
        ),
    ],
  );

  if (!keyReducers) {
    keyReducers = new Map();
  }

  keyReducers.set(processID, { config: reducerConfig, reducer: newReducer });
  sharedReducers.set(reducerKey, keyReducers);
}
