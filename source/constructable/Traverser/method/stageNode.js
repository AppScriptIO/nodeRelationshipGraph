// import { proxifyMethodDecorator } from '../utility/proxifyMethodDecorator.js'

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
          graph: thisArg,
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
      traverserPosition,
      additionalChildNode = [], // child nodes to add to the current node's children. These are added indirectly to a node without changing the node's children itself, as a way to extend current nodes.
    } = {},
    { traverseCallContext = {} } = {},
  ) {
    const { node } = traverserPosition
    let { implementation } = traverserPosition.calculateConfig()

    let traversalInterceptionImplementation = implementation.traversalInterception || (targetFunction => new Proxy(targetFunction, {})) // in case no implementation exists for intercepting traversal, use an empty proxy.

    /** Core functionality required is to traverse nodes, any additional is added through intercepting the traversal.
     * FORK edge - traverse stage node to other next nodes through the port nodes.
     * @return {iterator} providing node parameters for recursive traversal calls.
     */
    let groupIterator = this::this.forkEdge({
      stageNode: node,
      getImplementation: implementationKey =>
        traverserPosition.getImplementationCallback({ key: 'portNode' })({ nodeImplementationKey: implementationKey ? { portNode: implementationKey } : undefined }),
      additionalChildNode,
      nestedTraversalCallParameter: {
        additionalChildNode,
        traverserPosition,
        traverseCallContext,
      },
    })

    // EXECUTE edge
    const processDataCallback = ({ nextProcessData, additionalParameter }) =>
      this::this.executeEdge(
        {
          stageNode: node,
          nextProcessData,
          getImplementation: implementationKey =>
            traverserPosition.getImplementationCallback({ key: 'processNode' })({
              nodeImplementationKey: implementationKey ? { processNode: implementationKey } : undefined,
            }),
        },
        { additionalParameter, traverseCallContext },
      )

    // intercept and return result (Stage interception)
    let proxifiedRecursiveIteration = this::this.traverseGroupIterationRecursiveCall |> this::traversalInterceptionImplementation
    let result = await this::proxifiedRecursiveIteration({
      groupIterator,
      traverserPosition,
      processDataCallback,
      additionalChildNode,
      traverseCallContext,
    })

    return result
  },
}
