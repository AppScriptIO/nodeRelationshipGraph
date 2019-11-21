import { resolveReference } from '../../../traverserInstruction/referenceResolution.js'
import * as schemeReference from '../../../dataModel/graphSchemeReference.js'

/**
 * Reroute node is an entrypoint node that the graph traversal can be started from.
 */

export async function returnReference(
  { graphInstance, nodeInstance, traversalConfig, traversalDepth, path, additionalChildNode, eventEmitter, aggregator },
  { parentTraversalArg, traverseCallContext },
) {
  let referencedNode = await resolveReference({ targetNode: nodeInstance, graphInstance, traverseCallContext })
  if (referencedNode)
    // if the reference node is a reroute itself, traverse it recursively
    while (referencedNode && referencedNode.labels.includes(schemeReference.nodeLabel.reroute))
      referencedNode = await graphInstance.traverse(
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

// TODO: provide a way to mark subgraph templates, to distinguish them from other reroute nodes in the graph.
export async function traverseReference(
  { graphInstance, nodeInstance, traversalConfig, traversalDepth, path, additionalChildNode, eventEmitter, aggregator },
  { parentTraversalArg, traverseCallContext },
) {
  // get referencedNode and handle extended node.
  let referencedNode
  const { extend, insertArray } = await graphInstance.databaseWrapper.getRerouteTraverseReferenceElement({ concreteDatabase: graphInstance.database, nodeID: nodeInstance.identity })

  referencedNode = await resolveReference({ targetNode: nodeInstance, graphInstance, traverseCallContext })
  if (!referencedNode) {
    // TODO: rethink the implementation of extend and how the overriding works.
    if (referencedNode) referencedNode = extend.destination
    else return // in case no reference node was resolved
  }

  // get additional nodes from insert array and add them to the passed array.
  let insertAdditionalNode = insertArray
    .sort((former, latter) => former.connection.properties.order - latter.connection.properties.order) // using `order` property // Bulk actions on forks - sort forks
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
  arguments[0].traversalConfig = traversalConfig
  arguments[0].nodeInstance = referencedNode // referencedNode will be used as entrypoint to traversal call
  arguments[0].additionalChildNode = additionalChildNode
  // traverse reference node in the same traversal recursive scopes.
  return await graphInstance.traverse(...arguments)
}
