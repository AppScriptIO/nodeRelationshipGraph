import { isSelfEdge } from '../dataModel/concreteDatabaseWrapper.js'
// Fallback node for unresolved reference reroute. This is an implicit node, that doesn't actually exist in the graph.
const emptyStageNode = {
  identity: -1,
  labels: ['Stage'],
  properties: {
    key: null,
  },
}

// Resolution of reference node using different mechanisms.
export async function resolveReference({ targetNode, graph, traverseCallContext }) {
  const { reference } = await graph.databaseWrapper.getReferenceResolutionElement({ concreteDatabase: graph.database, nodeID: targetNode.identity })
  if (!reference) return

  // prevent circular traversal, in case multiple types are used for the same node and the reference edge is self edge:
  if (isSelfEdge(reference)) {
    // workaround is to remove the Reroute type from the labels array. TODO: consider allowing a parameter that controls which entrypoint node implementations are ignored.
    let labelIndex = reference.destination.labels.indexOf(targetNode.entrypointNodeType)
    reference.destination.labels[labelIndex] += `-ignore` // ignore on next traversal (keep the entry for debugging purposes).
  }

  let resolvedNode
  switch (reference.connection.properties.resolutionImplementation) {
    case 'selection':
      resolvedNode = await graph.traverserInstruction.referenceResolution.selectionReferenceResolution({ graph, targetNode: reference.destination, traverseCallContext })
      break
    case 'node':
    default:
      resolvedNode = reference.destination
      break
  }

  return resolvedNode
}

/**
 * Control flow structure supporting binary selecation (if statement), if else if, switch case (multi-way selection). A combined If Else and Switch Case concepts.
  TODO: Consider using "Comparison" as the node label for selection destinations.
 */
export async function selectionReferenceResolution({ graph, targetNode, traverseCallContext }) {
  let resolvedReferenceNode
  const { selectArray, fallback: fallbackRelationship } = await graph.databaseWrapper.getSelectionElement({ concreteDatabase: graph.database, nodeID: targetNode.identity })
  selectArray.sort((former, latter) => former.connection.properties.order - latter.connection.properties.order) // using `order` property // Bulk actions on forks - sort forks

  // TODO: support parallel / promise.all selection - where the first selected will be returned. When SELECT has an order it will be chronologically executed, but the selects that lack order property will be executed with promise.all
  // TODO: Use same logic in propagation as used for Port NEXT nodes. (chronological, raceFirstPromise, allPromise, etc.)
  let index = 0
  while (selectArray.length > index && !resolvedReferenceNode) {
    resolvedReferenceNode = await graph.traverserInstruction.referenceResolution.conditionSwitchResolution({ graph, targetNode: selectArray[index].destination, traverseCallContext })
    index++
  }

  // Important: reroute resolution must return a node even if no actual one was resolved. This will prevent returning an undefined that will throw during aggregation of results. Instead return a Stage that will be skipped.
  resolvedReferenceNode ||= fallbackRelationship?.destination || emptyStageNode
  return resolvedReferenceNode
}

/** resolves VALUE and picks the matching CASE node.
  * @param targetNode Stage node with VALUE connection representing the condition

*/
export async function conditionSwitchResolution({ graph, targetNode, traverseCallContext }) {
  let matchingNode
  const { caseArray } = await graph.databaseWrapper.getConditionSwitchElement({ concreteDatabase: graph.database, nodeID: targetNode.identity })
  let value = await graph.traverserInstruction.valueResolution.resolveValue({ targetNode: targetNode, graph, traverseCallContext, allowSelfEdge: true })
  // Switch cases: return evaluation configuration
  if (caseArray) {
    // compare expected value with result
    let caseRelationship = caseArray.filter(caseRelationship => caseRelationship.connection.properties?.expected == value)[0]
    matchingNode = caseRelationship?.destination
  }
  return matchingNode || null
}
