import assert from 'assert'

// Responsible for processing data.
export async function executeEdge({ node, nextProcessData, aggregator, traversalConfig, getImplementation, graphInstance }, { additionalParameter, traverseCallContext }) {
  if (!traversalConfig.shouldExecuteProcess()) return null

  let execute
  const { executeArray } = await graphInstance.databaseWrapper.getExecution({ concreteDatabase: graphInstance.database, nodeID: node.identity })
  if (executeArray.length > 1) throw new Error(`• Multiple execute relationships are not supported in Stage node.`)
  // skip if no execute connection
  else if (executeArray.length == 0) return null
  else execute = executeArray[0]

  // node/edge properties implementation hierarchy
  let nodeImplementationKey // traversal implementatio key
  if (execute.connection.properties.processNodeImplementation) nodeImplementationKey = { processNode: execute.connection.properties.processNodeImplementation }
  let implementation = getImplementation({ nodeImplementationKey }) // calculate and pick correct implementation according to parameter hierarchy.

  // Execute node dataItem
  let result = await node::implementation({ processNode: execute.destination, stageNode: node, graphInstance, nextProcessData }, { additionalParameter, traverseCallContext })

  if (traversalConfig.shouldIncludeResult()) aggregator.add(result)
  return result
}
