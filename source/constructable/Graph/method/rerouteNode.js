/**
 * Reroute/SubgraphTemplate node is an entrypoint node that the graph traversal can be started from.
 * load `subgraph template` node parameters for traversal call usage.
 * @return {Any} a result which could be an array or a string, etc. According to the Aggregation & traversal interception implementation used.
 */
// TODO: provide a way to mark subgraph templates, to distinguish them from other reroute nodes in the graph.
export async function rerouteNode({ graphInstance, nodeInstance, traversalConfig, traversalDepth, path, additionalChildNode, eventEmitter, aggregator }, { parentTraversalArg, traverseCallContext }) {
  const { reference, extend, insertArray } = await graphInstance.databaseWrapper.getRerouteElement({ concreteDatabase: graphInstance.database, nodeID: nodeInstance.identity })
  if (!reference && !extend) return // in case no `ROOT` relation or `EXTEND` are present

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

  // get referencedNode and handle extended node. referencedNode will be used as entrypoint to traversal call
  let referencedNode
  if (reference)
    switch (reference.connection.properties.implementation) {
      case 'returnedValue':
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

        break
      case 'node':
      default:
        referencedNode = reference.destination
        break
    }
  else if (extend) referencedNode = extend.destination
  else return // in case no root node was configured in the subgraph template node.

  // set additional parameters
  arguments[0].traversalConfig = traversalConfig
  arguments[0].nodeInstance = referencedNode
  arguments[0].additionalChildNode = [...(arguments[0].additionalChildNode || []), ...additionalChildNode]
  return await graphInstance.traverse(...arguments)
}
