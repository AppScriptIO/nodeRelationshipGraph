import EventEmitter from 'events'

/**
 * Stage node is an entrypoint node that the graph traversal can be started from.
 * @return {Any} a result which could be an array or a string, etc. According to the Aggregation & traversal interception implementation used.
 */
// Note: wrapping in object allows the usage of decorators as they couldn't be used on separate functions.
export const { stageNode } = {
  /** 
   * An approach to set default parameters for the function.
   * @proxifyMethodDecorator((target, thisArg, argumentsList, targetClass, methodName) => {
    // set default parameters and expose them to subsequent method decorators. - deep merge of nested parameter
    argumentsList = mergeDefaultParameter({
      passedArg: argumentsList,
      defaultArg: [
        {
          graphInstance: thisArg,
          traversalDepth: 0,
          path: null,
          additionalChildNode: [],
        },
        { parentTraversalArg: null },
      ],
    })
    return Reflect.apply(target, thisArg, argumentsList)
  }) 
  */
  async stageNode(
    {
      graphInstance = this, // <type Graph>
      nodeInstance,
      traversalConfig,
      traversalDepth = 0, // <type Number> level of recursion - allows to identify entrypoint level (toplevel) that needs to return the value of aggregator.
      path = null, // path to the current traversal.  // TODO: implement path sequence preservation. allow for the node traverse function to rely on the current path data.
      additionalChildNode = [], // child nodes to add to the current node's children. These are added indirectly to a node without changing the node's children itself, as a way to extend current nodes.
      // supported events: 'nodeTraversalCompleted'
      eventEmitter = new EventEmitter(), // create an event emitter to catch events from nested nodes of this node during their traversals.
      aggregator, // used to aggregate results of nested nodes.
    } = {},
    { parentTraversalArg = null, traverseCallContext = {} } = {},
  ) {
    let { implementation } = traversalConfig.calculateConfig({ graphInstance })
    let traversalInterceptionImplementation = implementation.traversalInterception || (targetFunction => new Proxy(targetFunction, {})) // in case no implementation exists for intercepting traversal, use an empty proxy.
    aggregator ||= new (nodeInstance::implementation.aggregator)()

    // EXECUTE edge
    const processDataCallback = ({ nextProcessData, additionalParameter }) =>
      graphInstance::graphInstance.executeEdge(
        {
          stageNode: nodeInstance,
          nextProcessData,
          traversalConfig,
          aggregator,
          getImplementation: implementationKey =>
            traversalConfig.getImplementationCallback({ key: 'processNode', graphInstance })({
              nodeImplementationKey: implementationKey ? { processNode: implementationKey } : undefined,
            }),
          graphInstance,
        },
        { additionalParameter, traverseCallContext },
      )

    /** Core functionality required is to traverse nodes, any additional is added through intercepting the traversal.
     * FORK edge - traverse stage node to other next nodes through the port nodes.
     * @return {iterator} providing node parameters for recursive traversal calls.
     */
    let groupIterator = graphInstance::graphInstance.forkEdge({
      stageNode: nodeInstance,
      getImplementation: implementationKey =>
        traversalConfig.getImplementationCallback({ key: 'portNode', graphInstance })({ nodeImplementationKey: implementationKey ? { portNode: implementationKey } : undefined }),
      additionalChildNode,
    })

    // intercept and return result (Stage interception)
    let proxifiedRecursiveIteration = graphInstance::graphInstance.traverseGroupIterationRecursiveCall |> graphInstance::traversalInterceptionImplementation
    let result = await proxifiedRecursiveIteration({
      groupIterator,
      processDataCallback,
      aggregator,
      nodeInstance,
      traversalDepth,
      eventEmitter,
      traversalConfig,
      additionalChildNode,
      parentTraversalArg: arguments,
      traverseCallContext,
    })

    return result
  },
}
