import * as schemeReference from '../../../dataModel/graphSchemeReference.js'

/**
 * Reroute node is an entrypoint node that the graph traversal can be started from.
 */

export async function returnReference({ traverserPosition, additionalChildNode }, { traverseCallContext }) {
  const { node } = traverserPosition
  let referencedNode = await this::this.traverserInstruction.referenceResolution.resolveReference({ targetNode: node, traverseCallContext })
  if (referencedNode)
    // if the reference node is a reroute itself, traverse it recursively
    while (referencedNode && referencedNode.labels.includes(schemeReference.nodeLabel.reroute)) {
      ;({ result: referencedNode } = await this.graph::this.graph.traverse(
        {
          nodeInstance: referencedNode,
          implementationKey: {
            [schemeReference.nodeLabel.reroute]: 'returnReference',
          },
        },
        {
          traverseCallContext,
        },
      ))
    }

  return referencedNode
}

// TODO: provide a way to mark subgraph templates, to distinguish them from other reroute nodes in the traverser.graph.
export async function traverseReference({ traverserPosition, additionalChildNode }, { traverseCallContext }) {
  const { node } = traverserPosition
  // get referencedNode and handle extended node.
  let referencedNode
  const { extend, insertArray } = await this.graph.database::this.graph.database.getRerouteTraverseReferenceElement({ nodeID: node.identity })

  referencedNode =
    (await this::this.traverserInstruction.referenceResolution.resolveReference({ targetNode: node, traverseCallContext })) ||
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
  traverserPosition.node = referencedNode // referencedNode will be used as entrypoint to traversal call
  arguments[0].traverserPosition = traverserPosition
  arguments[0].additionalChildNode = additionalChildNode
  // traverse reference node in the same traversal recursive scopes.
  return await this::this.traverse(...arguments)
}
