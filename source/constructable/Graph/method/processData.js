import assert from 'assert'

export async function processData({ node, nextProcessData, aggregator, traversalConfig, getImplementation, graphInstance }, additionalParameter) {
  if (!traversalConfig.shouldExecuteProcess()) return null

  let execute
  const { executeArray } = await graphInstance.databaseWrapper.getExecution({ concreteDatabase: graphInstance.database, nodeID: node.identity })
  if (executeArray.length > 1) throw new Error(`• Multiple execute relationships are not supported in Stage node.`)
  // skip if no execute connection
  else if (executeArray.length == 0) return null
  else execute = executeArray[0]

  // node/edge properties implementation hierarchy
  let nodeImplementationKey
  if (execute.connection.properties.processDataImplementation) nodeImplementationKey = { processData: execute.connection.properties.processDataImplementation }
  let implementation = getImplementation({ nodeImplementationKey }) // calculate and pick correct implementation according to parameter hierarchy.

  // Execute node dataItem
  let result = await node::implementation({ node: execute.destination, graphInstance, nextProcessData }, additionalParameter)

  if (traversalConfig.shouldIncludeResult()) aggregator.add(result)
  return result
}
