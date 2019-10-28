/**
 * Controls execution of node traversals & Hands over control to implementation:
 *  1. Accepts new nodes from implementing function.
 *  2. returns back to the implementing function a promise, handing control of flow and arragement of running traversals.
 */
export async function* recursiveIteration({
  traversalIteratorFeed /**Feeding iterator that will accept node parameters for traversals*/,
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
    // last node iterator feed should be an array of resolved node promises that will be forwarded through this function
    let portTraversalResult = {
      config: {
        port: traversalIteration.fork.destination, // the related port which the stage originated from.
      },
      result: n.result.value,
    }
    yield portTraversalResult // forward array of resolved results
  }
}
