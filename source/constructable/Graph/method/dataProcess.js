import assert from 'assert'
import { nodeLabel, connectionType, connectionProperty } from '../../../graphSchemeReference.js'

export async function dataProcess({ node, nextProcessData, aggregator, evaluation, implementation, graphInstance }) {
  if (!evaluation.shouldExecuteProcess()) return null
  let executeConnectionArray = await graphInstance.database.getNodeConnection({ direction: 'outgoing', nodeID: node.identity, connectionType: connectionType.execute })
  assert(executeConnectionArray.every(n => n.destination.labels.includes(nodeLabel.process)), `• Unsupported node type for a EXECUTE connection.`) // verify node type
  let resourceConnectionArray = await graphInstance.database.getNodeConnection({ direction: 'incoming', nodeID: node.identity, connectionType: connectionType.resource })
  assert(resourceConnectionArray.every(n => connectionProperty.context.includes(n.connection.properties.context)), `• Unsupported property value for a RESOURCE connection.`) // verify node type
  if (executeConnectionArray.length == 0) return null // skip if no execute connection

  let resourceRelation
  if (resourceConnectionArray.length > 0) resourceRelation = resourceConnectionArray[0]

  let executeConnection = executeConnectionArray[0].connection
  let dataProcessImplementation
  if (executeConnection.properties.processDataImplementation) {
    dataProcessImplementation = graphInstance.traversal.processData[executeConnection.properties.processDataImplementation]
    assert(dataProcessImplementation, `• "${executeConnection.properties.processDataImplementation}" implementation isn't registered in traversal concrete instance.`)
  } else dataProcessImplementation = implementation

  let executeNode = executeConnectionArray[0].destination
  // Execute node dataItem
  let result = await node::dataProcessImplementation({ node: executeNode, resourceRelation, graphInstance })

  if (evaluation.shouldIncludeResult()) aggregator.add(result)
  return result
}
