import assert from 'assert'
import { nodeLabel, connectionType, connectionProperty } from '../../../graphModel/graphSchemeReference.js'
import { traversalOption } from '../../../graphModel/graphSchemeReference.js'
import { extractConfigProperty } from '../../../utility/extractPropertyFromObject.js'

// load `subgraph template` node parameters for traversal call usage.
export async function laodSubgraphTemplateParameter({ node, graphInstance = this }) {
  let { configureArray } = await graphInstance.databaseWrapper.getConfigure({ concreteDatabase: graphInstance.database, nodeID: node.identity })
  const { root, extend, insertArray } = await graphInstance.databaseWrapper.getSubgraphTemplateElement({ concreteDatabase: graphInstance.database, nodeID: node.identity })

  // get traversal configuration node
  let traversalConfiguration = {}
  for (let configure of configureArray) {
    Object.assign(traversalConfiguration, extractConfigProperty(configure.destination.properties, traversalOption))
  }

  // get additional nodes
  let additionalChildNode = [] // additional nodes
  insertArray.sort((former, latter) => former.connection.properties.order - latter.connection.properties.order) // using `order` property // Bulk actions on forks - sort forks
  for (let insert of insertArray) {
    additionalChildNode.push({
      node: insert.destination,
      placement: {
        // convention for data structure of placement array - 0: 'before' | 'after', 1: connectionKey
        position: insert.connection.properties?.placement[0],
        connectionKey: insert.connection.properties?.placement[1],
      },
    })
  }

  // get rootNode and handle extended node.
  let rootNode
  if (root) {
    rootNode = root.destination
  } else if (extend) {
    let recursiveCallResult = await graphInstance::graphInstance.laodSubgraphTemplateParameter({ node: extend.destination, graphInstance })
    additionalChildNode = [...recursiveCallResult.additionalChildNode, ...additionalChildNode]
    traversalConfiguration = Object.assign(recursiveCallResult.traversalConfiguration, traversalConfiguration)
    rootNode = recursiveCallResult.rootNode
  } else {
    return // in case no `ROOT` relation or `EXTEND` are present
  }

  return { rootNode, additionalChildNode, traversalConfiguration } // rootNode will be used as entrypoint to traversal call
}
