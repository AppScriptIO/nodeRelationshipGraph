import assert from 'assert'

// Responsible for processing data.
export async function executeEdge({ stageNode, nextProcessData, getImplementation, graph = this }, { additionalParameter, traverseCallContext }) {
  let execute
  const { executeArray } = await graph.databaseWrapper.getExecution({ concreteDatabase: graph.database, nodeID: stageNode.identity })
  if (executeArray.length > 1) throw new Error(`• Multiple execute relationships are not supported in Stage node.`)
  // skip if no execute connection
  else if (executeArray.length == 0) return null
  else execute = executeArray[0]

  // Execute node dataItem
  let implementation = getImplementation(execute.connection.properties.implementation) // node/edge properties implementation hierarchy - calculate and pick correct implementation according to parameter hierarchy.
  let processResult = await graph::implementation({ processNode: execute.destination, stageNode, nextProcessData }, { additionalParameter, traverseCallContext })

  // further processing from pipe process nodes:
  processResult = graph.traverserInstruction.pipeProcess.pipeProcessing({ targetNode: execute.destination, processResult, graph })

  return processResult
}
