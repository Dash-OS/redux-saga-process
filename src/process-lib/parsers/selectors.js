import saveToSharedSchema from '../utils/saveToSharedSchema';

/**
 * parseSagaProcessSelectors
 * @param  {[type]} proc         [description]
 * @param  {[type]} SharedSchema [description]
 * @param  {[type]} Compiled     [description]
 * @return {[type]}              [description]
 */
export default function parseSagaProcessSelectors(
  proc,
  SharedSchema,
  Compiled,
) {
  const { schema } = proc;
  const { selectors = {} } = schema;
  if (!schema.compiled) {
    schema.compiled = {};
  }
  for (let selectorKey of Object.keys(selectors)) {
    buildSelector(selectorKey, selectors[selectorKey], schema);
  }
  saveToSharedSchema('compiled.public', 'selectors', proc, SharedSchema);
}

function buildSelector(selectorKey, selector, schema) {
  if (!selector) {
    return;
  }

  const scope = selectorKey.startsWith('!') ? 'private' : 'public';

  if (scope === 'private') {
    selectorKey = selectorKey.slice(1);
  }

  if (!schema.compiled[scope]) {
    schema.compiled[scope] = {};
  }

  if (selector.recomputations) {
    if (!schema.compiled[scope].selectors) {
      schema.compiled[scope].selectors = {};
    }

    Object.assign(schema.compiled[scope].selectors, {
      [selectorKey]: selector,
    });
  } else {
    if (!schema.compiled[scope].selectorCreators) {
      schema.compiled[scope].selectorCreators = {};
    }

    Object.assign(schema.compiled[scope].selectorCreators, {
      [selectorKey]: selector,
    });
  }
}
