export async function resolveValue({ targetNode, graphInstance, traverseCallContext }) {
  const value = await graphInstance.databaseWrapper.getValueElement({ concreteDatabase: graphInstance.database, nodeID: targetNode.identity })
  if (!value) return

  let resolvedValue
  /* run condition check against comparison value. Hierarchy of comparison value calculation:   */
  switch (value.connection.properties.implementation) {
    case 'conditionSubgraph':
      resolvedValue = await conditionSubgraphValueResolution({ value, graphInstance, traverseCallContext })
      break
    case 'properties':   
      resolvedValue = value.destination.properties
      break
    case 'node':
      resolvedValue = value.destination
      break
    case 'valueProperty':
    default:
      resolvedValue = value.destination.properties.value
    break
  }
  return resolvedValue
}

/*
    ____                _ _ _   _             
   / ___|___  _ __   __| (_) |_(_) ___  _ __  
  | |   / _ \| '_ \ / _` | | __| |/ _ \| '_ \ 
  | |__| (_) | | | | (_| | | |_| | (_) | | | |
   \____\___/|_| |_|\__,_|_|\__|_|\___/|_| |_|
   Selective / Conditional
*/
/**
 * @return {Node Object} - a node object containing data.
 */
export async function conditionSubgraphValueResolution({ value, graphInstance, traverseCallContext }) {
  let resolvedValue
  // Run reference node in a separate traversal recursive scopes, and return result.
  // traverse the destination and extract node from the result value.
  let resultValueArray = await graphInstance.traverse(
    /* TODO: Note: this is a quick implementation because digging into the core code is time consuming, the different concepts used in here could be improved and built upon other already existing concepts: 
           TODO: create an instance graph from the current graphInstance, to allow passing additional context parametrs.
               • 'traversalCallContext' - the 2nd provided argument could be instead applied as a regular Context specific for the call, by creating a new graphInstance chain with it's unique context, in addition to the already existing context instance.
           was this done ? ~~• ConditionAggregator & traverseThenProcessWithLogicalOperator implementations could be integratted into the other implementations.~~
         */
    {
      nodeInstance: value.destination,
      implementationKey: {
        processNode: 'executeFunctionReference', // default implementation for processing stages in condition graph.
        traversalInterception: 'traverseThenProcessWithLogicalOperator',
        aggregator: 'ConditionAggregator',
      },
    },
    {
      traverseCallContext: {
        targetNode: traverseCallContext.targetNode || value.source, // pass the node requesting the resolution of the reroute node if it exists, or the reroute itself in case called as root level in the traversal.
      },
    },
  ) // traverse subgraph to retrieve a referenced node.

  if (resultValueArray.length > 1) resolvedValue = resultValueArray.every(item => Boolean(item))
  else if (resultValueArray.length != 0) resolvedValue = resultValueArray[0]
  return resolvedValue
}
