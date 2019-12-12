import { resolveValue } from './valueResolution.js'
import { isSelfEdge } from '../dataModel/concreteDatabaseWrapper.js'

// Resolution of reference node using different mechanisms.
export async function resolveReference({ targetNode, graphInstance, traverseCallContext }) {
  const { reference } = await graphInstance.databaseWrapper.getReferenceResolutionElement({ concreteDatabase: graphInstance.database, nodeID: targetNode.identity })
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
      resolvedNode = await selectionReferenceResolution({ graphInstance, targetNode: reference.destination, traverseCallContext })
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
 */
export async function selectionReferenceResolution({ graphInstance, targetNode, traverseCallContext }) {
  let resolvedReferenceNode
  const { selectArray, fallback: fallbackRelationship } = await graphInstance.databaseWrapper.getSelectionElement({ concreteDatabase: graphInstance.database, nodeID: targetNode.identity })
  selectArray.sort((former, latter) => former.connection.properties.order - latter.connection.properties.order) // using `order` property // Bulk actions on forks - sort forks

  // TODO: support parallel / promise.all selection - where the first selected will be returned. When SELECT has an order it will be chronologically executed, but the selects that lack order property will be executed with promise.all
  // TODO: Use same logic in propagation as used for Port NEXT nodes. (chronological, raceFirstPromise, allPromise, etc.)
  let index = 0
  while (selectArray.length > index && !resolvedReferenceNode) {
    resolvedReferenceNode = await conditionSwitchResolution({ graphInstance, targetNode: selectArray[index].destination, traverseCallContext })
    index++
  }

  resolvedReferenceNode ||= fallbackRelationship?.destination
  return resolvedReferenceNode || null
}

/** resolves VALUE and picks the matching CASE node.
  * @param targetNode Stage node with VALUE connection representing the condition

*/
export async function conditionSwitchResolution({ graphInstance, targetNode, traverseCallContext }) {
  let matchingNode
  const { caseArray } = await graphInstance.databaseWrapper.getConditionSwitchElement({ concreteDatabase: graphInstance.database, nodeID: targetNode.identity })
  let value = await resolveValue({ targetNode: targetNode, graphInstance, traverseCallContext })
  // Switch cases: return evaluation configuration
  if (caseArray) {
    // compare expected value with result
    let caseRelationship = caseArray.filter(caseRelationship => caseRelationship.connection.properties?.expected == value)[0]
    matchingNode = caseRelationship?.destination
  }
  return matchingNode || null
}
