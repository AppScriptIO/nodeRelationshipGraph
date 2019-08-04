import assert from 'assert'
import { nodeLabel, connectionType, connectionProperty } from '../../../graphSchemeReference.js'
import { traversalOption } from '../../GraphTraversal.class.js'

// load `subgraph template` node parameters for traversal call usage.
export async function laodSubgraphTemplateParameter({ node, graphInstance = this }) {
  let rootRelationshipArray = await graphInstance.database.getNodeConnection({ direction: 'outgoing', nodeID: node.identity, connectionType: connectionType.root })
  assert(rootRelationshipArray.every(n => n.destination.labels.includes(nodeLabel.stage)), `• Unsupported node type for a ROOT connection.`) // verify node type
  let extendRelationshipArray = await graphInstance.database.getNodeConnection({ direction: 'outgoing', nodeID: node.identity, connectionType: connectionType.extend })
  assert(extendRelationshipArray.every(n => n.destination.labels.includes(nodeLabel.subgraphTemplate)), `• Unsupported node type for a EXTEND connection.`) // verify node type
  let configureRelationshipArray = await graphInstance.database.getNodeConnection({ direction: 'incoming', nodeID: node.identity, connectionType: connectionType.configure })
  assert(configureRelationshipArray.every(n => n.destination.labels.includes(nodeLabel.configuration)), `• Unsupported node type for a EXTEND connection.`) // verify node type

  let rootNode,
    traversalConfiguration = {},
    additionalChildNode = [] // additional nodes

  // get traversal configuration node
  if (configureRelationshipArray.length > 0) {
    function extractTraversalConfigProperty(propertyObject) {
      return Object.entries(propertyObject).reduce((accumulator, [key, value]) => {
        if (traversalOption.includes(key)) accumulator[key] = value
        return accumulator
      }, {})
    }
    let configureNode = configureRelationshipArray[0].destination
    traversalConfiguration = extractTraversalConfigProperty(configureNode.properties)
  }

  // get additional nodes
  let insertRelationshipArray = await graphInstance.database.getNodeConnection({ direction: 'incoming', nodeID: node.identity, connectionType: connectionType.insert })
  insertRelationshipArray.sort((former, latter) => former.connection.properties.order - latter.connection.properties.order) // using `order` property // Bulk actions on forks - sort forks
  for (let insertRelationship of insertRelationshipArray) {
    let insertNode = insertRelationship.destination
    assert(insertNode.labels.includes(nodeLabel.stage), `• "${insertNode.labels}" Unsupported node type for a ROOT connection.`) // verify node type
    additionalChildNode.push({
      node: insertNode,
      placement: {
        // convention for data structure of placement array - 0: 'before' | 'after', 1: connectionKey
        position: insertRelationship.connection.properties.placement[0],
        connectionKey: insertRelationship.connection.properties.placement[1],
      },
    })
  }

  // get rootNode and handle extended node.
  if (rootRelationshipArray.length > 0) {
    rootNode = rootRelationshipArray[0].destination
  } else if (extendRelationshipArray.length > 0) {
    let extendNode = extendRelationshipArray[0].destination
    let recursiveCallResult = await graphInstance::graphInstance.laodSubgraphTemplateParameter({ node: extendNode, graphInstance })
    additionalChildNode = [...recursiveCallResult.additionalChildNode, ...additionalChildNode]
    traversalConfiguration = Object.assign(recursiveCallResult.traversalConfiguration, traversalConfiguration)
    rootNode = recursiveCallResult.rootNode
  } else {
    return // in case no `ROOT` relation or `EXTEND` are present
  }

  return { rootNode, additionalChildNode, traversalConfiguration } // rootNode will be used as entrypoint to traversal call
}
