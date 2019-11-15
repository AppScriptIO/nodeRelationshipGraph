import EventEmitter from 'events'

/**
 * Stage node is an entrypoint node that the graph traversal can be started from.
 *
 */
// Note: wrapping in object allows the usage of decorators as they couldn't be used on separate functions.
export const { stageNode } = {
  /** An approach to set default parameters for the function.
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
  }) */
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

    aggregator ||= new (nodeInstance::implementation.aggregator)()

    /** Core functionality required is to traverse nodes, any additional is added through intercepting the traversal.
     * FORK edge - traverse stage node to other next nodes through the port nodes.
     * @return {iterator} providing node parameters for recursive traversal calls.
     */
    const forkIteratorCallback = () =>
      graphInstance::graphInstance.forkEdge({ stageNode: nodeInstance, getImplementation: traversalConfig.getImplementationCallback({ key: 'portNode', graphInstance }), additionalChildNode })

    // EXECUTE edge
    const processDataCallback = ({ nextProcessData, additionalParameter }) =>
      graphInstance::graphInstance.executeEdge(
        { stageNode: nodeInstance, nextProcessData, traversalConfig, aggregator, getImplementation: traversalConfig.getImplementationCallback({ key: 'processNode', graphInstance }), graphInstance },
        { additionalParameter, traverseCallContext },
      )

    // intercept and return result (Stage interception)
    let traversalInterceptionImplementation = implementation.traversalInterception || (targetFunction => new Proxy(targetFunction, {})) // in case no implementation exists for intercepting traversal, use an empty proxy.
    let proxifiedRecursiveIteration = graphInstance::graphInstance.recursiveIteration |> graphInstance::traversalInterceptionImplementation
    let result = await proxifiedRecursiveIteration({
      forkIteratorCallback,
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

/**
 * Controls execution of node traversals & Hands over control to implementation:
 *  1. Accepts new nodes from implementing function.
 *  2. returns back to the implementing function a promise, handing control of flow and arragement of running traversals.
 */
export async function* recursiveIteration({
  forkIteratorCallback,
  processDataCallback,
  aggregator,
  graphInstance = this,
  recursiveCallback = graphInstance::graphInstance.traverse,
  traversalDepth,
  eventEmitter,
  traversalConfig,
  additionalChildNode,
  parentTraversalArg,
  traverseCallContext,
}: {
  eventEmitter: Event,
}) {
  if (!traversalConfig.shouldContinue()) return // skip traversal
  /** Feeding iterator that will accept node parameters for traversals - e.g. { nextIterator, fork } */
  let forkIterator = forkIteratorCallback()
  traversalDepth += 1 // increase traversal depth
  for await (let forkObject of forkIterator) {
    let nextIterator = forkObject.nextIterator // NEXT connection iterator

    // first call is used to initialize the function (using non-standard function.sent)
    let nextYielded = await nextIterator.next({ eventEmitterCallback: (...args) => eventEmitter.emit('nodeTraversalCompleted', ...args) })
    while (!nextYielded.done)
      // 🔁 recursion traversal call (with next node)
      nextYielded = await nextIterator.next({
        promise: recursiveCallback({ nodeInstance: nextYielded.value.node /* next node */, traversalDepth, additionalChildNode }, { parentTraversalArg, traverseCallContext }),
      })

    // port traversal result - last node iterator feed should be an array of resolved node promises that will be forwarded through this function
    // forward array of resolved results
    yield {
      config: {
        port: forkObject.fork.destination, // the related port which the stage originated from.
      },
      result: nextYielded.value, // last yielded value is the result array.
    }
  }
}
