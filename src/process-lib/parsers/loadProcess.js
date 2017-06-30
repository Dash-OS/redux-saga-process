/*
  Mark the Process Schema as asynchronous.  We will load the process asynchronously
  including its dependencies  in this case.
*/
export default function parseSagaProcessLoadProcess(proc) {
  const { schema } = proc;
  schema.isAsync = true;
}
