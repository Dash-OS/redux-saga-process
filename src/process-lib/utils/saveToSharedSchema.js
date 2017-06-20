import _ from 'lodash';

/*
  Saves a given value to the shared schema.  This
*/
export default function saveToSharedSchema(
  path,
  key,
  proc,
  SharedSchema,
  type = 'object',
) {
  const { schema } = proc;
  const { processID } = schema;
  const publicValues = _.get(schema, `${path}.${key}`);

  if (publicValues) {
    const sharedGlobalValues = SharedSchema.get(key) || new Map();
    let processLocalValues;

    /*
      TODO: We are merging here rather than replacing -- need to
      consider the implications of each here.  Keeping it for hot
      reloading sitautions.
    */

    if (type === 'object') {
      processLocalValues = Object.assign(
        {},
        sharedGlobalValues.get(processID),
        publicValues,
      );
    } else if (type === 'array') {
      processLocalValues = [].concat([
        ...sharedGlobalValues.get(processID),
        ...publicValues,
      ]);
    }

    sharedGlobalValues.set(processID, processLocalValues);
    SharedSchema.set(key, sharedGlobalValues);
  }
}
