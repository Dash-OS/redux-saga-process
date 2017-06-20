/*
  Mark the Process Schema as asynchronous.  We will load the process asynchronously
  including its dependencies  in this case.
*/
export default function parseSagaProcessLoadProcess(
  proc,
  SharedSchema,
  Compiled,
) {
  const { schema } = proc;
  const { processID, selectors = {} } = schema;
  schema.isAsync = true;
}
