import assert from 'assert'

/**
 *  @param contextPropertyName TODO: consider using Symbols instead of string keys and export them for client usage.
 */
export async function resolveResource({ targetNode, graph, contextPropertyName = 'referenceContext' }) {
  let referenceContext = graph.context[contextPropertyName]
  assert(referenceContext, `• Context "${contextPropertyName}" variable is required to reference functions from graph database strings.`)

  let resource
  const { resourceArray } = await graph.databaseWrapper.getResource({ concreteDatabase: graph.database, nodeID: targetNode.identity })
  if (resourceArray.length > 1) throw new Error(`• Multiple resource relationships are not supported for Process node.`)
  else if (resourceArray.length == 0) return
  else resource = resourceArray[0]

  let resolvedResource
  switch (resource.connection.properties.context) {
    case 'filesystemReference':
      throw new Error('• filesystemReference is not implemented in resource resolution functionality.')
      break
    case 'applicationReference':
    default:
      resolvedResource = await graph.traverserInstruction.resourceResolution.applicationReference({ graph, targetNode: resource.source, referenceContext })
      break
  }

  return resolvedResource
}

export async function applicationReference({ targetNode, graph, referenceContext }) {
  if (targetNode.labels.includes(graph.schemeReference.nodeLabel.function)) {
    let referenceKey = targetNode.properties.functionName || throw new Error(`• function resource must have a "functionName" - ${targetNode.properties.functionName}`)
    // a function that complies with graphTraversal processData implementation.
    let functionCallback = referenceContext[referenceKey] || throw new Error(`• reference function name "${referenceKey}" doesn't exist in graph context.`)
    return functionCallback
  } else if (targetNode.labels.includes(graph.schemeReference.nodeLabel.file)) {
    let referenceKey = targetNode.properties.referenceKey || throw new Error(`• resource File node (with key: ${targetNode.properties.key}) must have "referenceKey" property.`)
    let filePath = referenceContext[referenceKey] || throw new Error(`• File reference key "${referenceKey}" doesn't exist in graph context.`)
    return filePath
  } else throw new Error(`• Unsupported Node type for resource connection.`)
}
