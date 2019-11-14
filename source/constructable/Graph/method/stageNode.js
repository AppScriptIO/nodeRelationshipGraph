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
  let traversalIteratorFeed = forkIteratorCallback() /**Feeding iterator that will accept node parameters for traversals*/
  let eventEmitterCallback = (...args) => eventEmitter.emit('nodeTraversalCompleted', ...args)
  traversalDepth += 1 // increase traversal depth
  for await (let traversalIteration of traversalIteratorFeed) {
    let n = { iterator: traversalIteration.nextIterator, result: await traversalIteration.nextIterator.next({ eventEmitterCallback: eventEmitterCallback }) }
    while (!n.result.done) {
      let nextNode = n.result.value.node
      // 🔁 recursion call
      let nextCallArgument = [Object.assign({ nodeInstance: nextNode, traversalDepth, additionalChildNode }), { parentTraversalArg, traverseCallContext }]
      let promise = recursiveCallback(...nextCallArgument)
      n.result = await n.iterator.next({ promise })
    }
    // port traversal result - last node iterator feed should be an array of resolved node promises that will be forwarded through this function
    yield {
      config: {
        port: traversalIteration.fork.destination, // the related port which the stage originated from.
      },
      result: n.result.value,
    } // forward array of resolved results
  }
}
