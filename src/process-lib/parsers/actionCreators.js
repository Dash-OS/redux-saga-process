import _ from 'lodash';
import invokeIf from 'invoke-if';
import ToReduxType from 'to-redux-type';

import saveToSharedSchema from '../utils/saveToSharedSchema';

/**
 * parseActionCreators
 * @param  {[type]} proc         [description]
 * @param  {[type]} SharedSchema [description]
 * @param  {[type]} Compiled     [description]
 * @return {[type]}              [description]
 */
export default function parseSagaProcessActionCreators(
  proc,
  SharedSchema,
  Compiled,
) {
  const { schema } = proc;
  const { actionCreators = {} } = schema;
  if (!schema.compiled) {
    schema.compiled = {};
  }
  for (let actionCreatorKey in actionCreators) {
    buildActionCreator(
      actionCreatorKey,
      actionCreators[actionCreatorKey],
      proc,
    );
  }

  return saveToSharedSchema(
    'compiled.public',
    'actionCreators',
    proc,
    SharedSchema,
  );
}

function createActionCreator(type, keys = [], merge = {}) {
  let action = { type, ...merge };
  return (...args) => {
    for (let key of keys) {
      action[key] = args.shift();
    }
    Object.assign(action, ...args);
    return action;
  };
}

function buildActionCreator(actionCreatorKey, actionCreator, proc) {
  const { schema } = proc;

  const scope = actionCreatorKey.startsWith('!') ? 'private' : 'public';

  invokeIf(
    [
      scope === 'private',
      () => {
        actionCreatorKey = actionCreatorKey.slice(1);
      },
    ],
    [
      () => !schema.compiled[scope],
      () => {
        schema.compiled[scope] = {};
      },
    ],
    [
      () => !schema.compiled[scope].actionCreators,
      () => {
        schema.compiled[scope].actionCreators = {};
      },
    ],
  );

  const type = ToReduxType(actionCreatorKey);

  let creatorFn;

  if (Array.isArray(actionCreator)) {
    creatorFn = createActionCreator(type, actionCreator);
  } else if (_.isPlainObject(actionCreator)) {
    creatorFn = createActionCreator(type, [], actionCreator);
  } else {
    creatorFn = createActionCreator(type);
  }

  Object.assign(schema.compiled[scope].actionCreators, {
    [actionCreatorKey]: creatorFn,
  });
}
