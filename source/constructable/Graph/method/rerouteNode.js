import * as schemeReference from '../../../dataModel/graphSchemeReference.js'
import { isSelfEdge } from '../../../dataModel/concreteDatabaseWrapper.js'
/**
 * Reroute node is an entrypoint node that the graph traversal can be started from.
 */

export async function returnReference(
  { graphInstance, nodeInstance, traversalConfig, traversalDepth, path, additionalChildNode, eventEmitter, aggregator },
  { parentTraversalArg, traverseCallContext },
) {
  const { reference } = await graphInstance.databaseWrapper.getRerouteReturnReferenceElement({ concreteDatabase: graphInstance.database, nodeID: nodeInstance.identity })
  let resolvedNode = await resolveReference({ reference, graphInstance, traverseCallContext })

  // TODO: add while loop to verify that the resolved reference is non-route

  return resolvedNode
}

// TODO: provide a way to mark subgraph templates, to distinguish them from other reroute nodes in the graph.
export async function traverseReference(
  { graphInstance, nodeInstance, traversalConfig, traversalDepth, path, additionalChildNode, eventEmitter, aggregator },
  { parentTraversalArg, traverseCallContext },
) {
  const { reference, extend, insertArray } = await graphInstance.databaseWrapper.getRerouteTraverseReferenceElement({ concreteDatabase: graphInstance.database, nodeID: nodeInstance.identity })

  // get referencedNode and handle extended node.
  let referencedNode
  if (reference) referencedNode = await resolveReference({ reference, graphInstance, traverseCallContext })
  // TODO: rethink the implementation of extend and how the overriding works.
  else if (extend) referencedNode = extend.destination
  else return // in case no reference node was resolved

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

// Resolution of reference node using different mechanisms.
async function resolveReference({ reference, graphInstance, traverseCallContext }) {
  // prevent circular traversal, in case multiple types are used for the same node and the reference edge is self edge:
  if (isSelfEdge(reference)) {
    // workaround is to remove the Reroute type from the labels array. TODO: consider allowing a parameter that controls which entrypoint node implementations are ignored.
    let labelIndex = reference.destination.labels.indexOf(schemeReference.nodeLabel.reroute)
    reference.destination.labels[labelIndex] += `-ignore` // ignore on next traversal (keep the entry for debugging purposes).
  }

  let resolvedNode
  switch (reference.connection.properties.resolutionImplementation) {
    case 'caseSwitch':
      resolvedNode = await switchResolution({ graphInstance, reference, traverseCallContext })
      break
    case 'node':
    default:
      resolvedNode = reference.destination
      break
  }

  return resolvedNode
}

async function switchResolution({ graphInstance, reference, traverseCallContext }) {
  let referencedNode
  // Run reference node in a separate traversal recursive scopes, and return result.
  // traverse the destination and extract node from the result value.
  let resultNodeArray = await graphInstance.traverse(
    /* TODO: Note: this is a quick implementation because digging into the core code is time consuming, the different concepts used in here could be improved and built upon other already existing concepts: 
            TODO: create an instance graph from the current graphInstance, to allow passing additional context parametrs.
                • 'traversalCallContext' - the 2nd provided argument could be instead applied as a regular Context specific for the call, by creating a new graphInstance chain with it's unique context, in addition to the already existing context instance.
            was this done ? ~~• ConditionAggregator & traverseThenProcessWithLogicalOperator implementations could be integratted into the other implementations.~~
          */
    {
      nodeInstance: reference.destination,
      implementationKey: {
        processNode: 'switchCase',
        traversalInterception: 'traverseThenProcessWithLogicalOperator',
        aggregator: 'ConditionAggregator',
      },
    },
    {
      traverseCallContext: {
        targetNode: traverseCallContext.targetNode || reference.source, // pass the node requesting the resolution of the reroute node if it exists, or the reroute itself in case called as root level in the traversal.
      },
    },
  ) // traverse subgraph to retrieve a referenced node.

  if (resultNodeArray.length > 1) throw new Error('• REFERENCE relationship that returns multiple nodes is not supported.')
  else if (resultNodeArray.length != 0) referencedNode = resultNodeArray[0]
  return referencedNode
}
