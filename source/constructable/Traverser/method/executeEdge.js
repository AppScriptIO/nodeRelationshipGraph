import assert from 'assert'

// Responsible for processing data.
export async function executeEdge({ stageNode, nextProcessData, getImplementation }, { additionalParameter, traverseCallContext }) {
  let execute
  const { executeArray } = await this.graph.database::this.graph.database.getExecution({ nodeID: stageNode.identity })
  if (executeArray.length > 1) throw new Error(`• Multiple execute relationships are not supported in Stage node.`)
  // skip if no execute connection
  else if (executeArray.length == 0) return null
  else execute = executeArray[0]

  // Execute node dataItem
  let implementation = getImplementation(execute.connection.properties.implementation) // node/edge properties implementation hierarchy - calculate and pick correct implementation according to parameter hierarchy.
  let processResult = await this::implementation({ processNode: execute.destination, stageNode, nextProcessData }, { additionalParameter, traverseCallContext })

  // further processing from pipe process nodes:
  processResult = await this.traverserInstruction.pipeProcess.pipeProcessing({ targetNode: execute.destination, processResult, traverser: this })

  return processResult
}
