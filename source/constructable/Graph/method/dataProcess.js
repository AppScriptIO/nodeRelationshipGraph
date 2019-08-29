import assert from 'assert'

export async function dataProcess({ node, nextProcessData, aggregator, evaluation, implementation, graphInstance }, additionalParameter) {
  if (!evaluation.shouldExecuteProcess()) return null
  const { resource, execute } = await graphInstance.databaseWrapper.getProcessElement({ concreteDatabase: graphInstance.database, nodeID: node.identity })
  if (!execute) return null // skip if no execute connection

  if (execute.connection.properties.processDataImplementation)
    implementation =
      graphInstance.traversal.processData[execute.connection.properties.processDataImplementation] ||
      throw new Error(`• "${execute.connection.properties.processDataImplementation}" implementation isn't registered in traversal concrete instance.`)

  // Execute node dataItem
  let result = await node::implementation({ node: execute.destination, resource, graphInstance, nextProcessData }, additionalParameter)

  if (evaluation.shouldIncludeResult()) aggregator.add(result)
  return result
}
