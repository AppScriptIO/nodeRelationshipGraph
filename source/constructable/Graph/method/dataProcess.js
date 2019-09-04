import assert from 'assert'

export async function dataProcess({ node, nextProcessData, aggregator, evaluation, getImplementation, graphInstance }, additionalParameter) {
  if (!evaluation.shouldExecuteProcess()) return null
  const { resource, execute } = await graphInstance.databaseWrapper.getProcessElement({ concreteDatabase: graphInstance.database, nodeID: node.identity })
  if (!execute) return null // skip if no execute connection

  // node/edge properties implementation hierarchy
  let nodeImplementationKey
  if (execute.connection.properties.processDataImplementation) nodeImplementationKey = { processData: execute.connection.properties.processDataImplementation }
  let implementation = getImplementation({ nodeImplementationKey }) // calculate and pick correct implementation according to parameter hierarchy.

  // Execute node dataItem
  let result = await node::implementation({ node: execute.destination, resource, graphInstance, nextProcessData }, additionalParameter)

  if (evaluation.shouldIncludeResult()) aggregator.add(result)
  return result
}
