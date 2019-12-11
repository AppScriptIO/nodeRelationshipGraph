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
    case 'caseSwitch':
      resolvedNode = await switchReferenceResolution({ graphInstance, targetNode: reference.destination, traverseCallContext })
      break
    case 'node':
    default:
      resolvedNode = reference.destination
      break
  }

  return resolvedNode
}

export async function switchReferenceResolution({ graphInstance, targetNode, traverseCallContext }) {
  let resolvedReferenceNode
  const { caseArray, default: defaultRelationship } = await graphInstance.databaseWrapper.getSwitchElement({ concreteDatabase: graphInstance.database, nodeID: targetNode.identity })
  let value = await resolveValue({ targetNode: targetNode, graphInstance, traverseCallContext })
  // Switch cases: return evaluation configuration
  if (caseArray) {
    // compare expected value with result
    let caseRelationship = caseArray.filter(caseRelationship => caseRelationship.connection.properties?.expected == value)[0]
    resolvedReferenceNode = caseRelationship?.destination
  }
  resolvedReferenceNode ||= defaultRelationship?.destination
  return resolvedReferenceNode || null
}

// TODO:
export async function ifElseReferenceResolution({ graphInstance, targetNode, traverseCallContext }) {}
