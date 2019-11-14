/**
 * SubgraphTemplate node is an entrypoint node that the graph traversal can be started from.
 * load `subgraph template` node parameters for traversal call usage.
 */
export async function traverseSubgraphTemplate({ nodeInstance, graphInstance = this }) {
  const { root, extend, insertArray } = await graphInstance.databaseWrapper.getSubgraphTemplateElement({ concreteDatabase: graphInstance.database, nodeID: nodeInstance.identity })
  if (!root && !extend) return false // in case no `ROOT` relation or `EXTEND` are present

  // get additional nodes
  let additionalChildNode = insertArray
    .sort((former, latter) => former.connection.properties.order - latter.connection.properties.order) // using `order` property // Bulk actions on forks - sort forks
    .map(insert => ({
      node: insert.source,
      placement: {
        // convention for data structure of placement array - 0: 'before' | 'after', 1: connectionKey
        position: insert.connection.properties?.placement[0],
        connectionKey: insert.connection.properties?.placement[1],
      },
    }))

  // get rootNode and handle extended node. rootNode will be used as entrypoint to traversal call
  let rootNode
  if (root) rootNode = root.destination
  else if (extend) rootNode = extend.destination

  return { rootNode, additionalChildNode }
}
