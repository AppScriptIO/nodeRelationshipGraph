import * as schemeReference from '../../../dataModel/graphSchemeReference.js'

/**
 * Reroute node is an entrypoint node that the graph traversal can be started from.
 */

export async function returnReference({ traverser, additionalChildNode, graph = this }, { traverseCallContext }) {
  const { node } = traverser
  let referencedNode = await graph.traverserInstruction.referenceResolution.resolveReference({ targetNode: node, graph, traverseCallContext })
  if (referencedNode)
    // if the reference node is a reroute itself, traverse it recursively
    while (referencedNode && referencedNode.labels.includes(schemeReference.nodeLabel.reroute))
      referencedNode = await graph::graph.traverse(
        {
          nodeInstance: referencedNode,
          implementationKey: {
            [schemeReference.nodeLabel.reroute]: 'returnReference',
          },
        },
        {
          traverseCallContext,
        },
      )

  return referencedNode
}

// TODO: provide a way to mark subgraph templates, to distinguish them from other reroute nodes in the traverser.graph.
export async function traverseReference({ traverser, additionalChildNode, graph = this }, { traverseCallContext }) {
  const { node } = traverser
  // get referencedNode and handle extended node.
  let referencedNode
  const { extend, insertArray } = await graph.databaseWrapper.getRerouteTraverseReferenceElement({ concreteDatabase: graph.database, nodeID: node.identity })

  referencedNode =
    (await graph.traverserInstruction.referenceResolution.resolveReference({ targetNode: node, graph, traverseCallContext })) ||
    // TODO: rethink the implementation of extend and how the overriding works.
    (extend && extend.destination)
  if (!referencedNode) return // in case no reference node was resolved

  // get additional nodes from insert array and add them to the passed array.
  let insertAdditionalNode = insertArray
    .sort((former, latter) => former.connection.properties.order - latter.connection.properties.order || isNaN(former.connection.properties.order) - isNaN(latter.connection.properties.order)) // using `order` property // Bulk actions on forks - sort forks
    .map(insert => ({
      node: insert.source,
      placement: {
        // convention for data structure of placement array - 0: 'before' | 'after', 1: connectionKey
        position: insert.connection.properties?.placement[0],
        connectionKey: insert.connection.properties?.placement[1],
      },
    }))
  additionalChildNode = [...(additionalChildNode || []), ...insertAdditionalNode]

  // set additional parameters
  traverser.node = referencedNode // referencedNode will be used as entrypoint to traversal call
  arguments[0].traverser = traverser
  arguments[0].additionalChildNode = additionalChildNode
  // traverse reference node in the same traversal recursive scopes.
  return await graph::graph.traverse(...arguments)
}
