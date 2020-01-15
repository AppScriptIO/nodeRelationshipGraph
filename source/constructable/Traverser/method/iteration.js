import promiseProperRace from '@dependency/promiseProperRace'

/** 
This function is a middleware between 'traverseIterationRecursiveCall' external function and internal handlePropagation implementation.
Async generator trap (all port propagation handlers pass through this trap) which verifies that all port implementations follow a 2 way iterator communication.
 * @receive [function.sent] Object { eventEmitterCallback: <function emitting a traversal complete event> } - during iterator initialization.
 *
 * Iteration 2 way communication:
 * 1. @yield object { node: <node data> }
 * 2. @recieve [function.sent] object { traversalPromise }
 *
 * @return {Array} results array
*/
export async function* traversalIteration({ nodeIteratorFeed, nestedTraversalCallParameter, traverser = this }) {
  let iteratorObject = await nodeIteratorFeed.next()
  while (!iteratorObject.done) {
    yield {
      node: iteratorObject.value.node,
      /** @return traversal promise from a new traversal call. */
      traversalInvocation: nextFunction =>
        traverser::traverser.traverse(
          { nodeInstance: iteratorObject.value.node /* next node */, additionalChildNode: nestedTraversalCallParameter.additionalChildNode },
          { parentTraverserPosition: nestedTraversalCallParameter.traverserPosition, traverseCallContext: nestedTraversalCallParameter.traverseCallContext },
        ),
    }
    iteratorObject = await nodeIteratorFeed.next()
  }
}

/* TODO: 
  Missing ability to await next node in chain traversal P- e.g. Pass next function to control traversal initiation of next node in line
  Use generator function to stop traversal function and signal to the control code to await specific group of node iterators. This will keep the control of iteration in the originating port controller/function, instead of iterating from within many other nodes (which will be hard to debug).
  pass Iterator - from within next - call iterator.next & traverse
*/
/** next iterator returns entrypoint nodes (Stage or Reroute/SubgraphTemplate nodes)
 * @param nodeIterator - iterator of object { node: <node data> }
 */
export async function* traverseIterationRecursiveCall({ traversalIterator, traverser = this }) {
  // first call is used to initialize the function (using non-standard function.sent)
  let iteratorObject = await traversalIterator.next()
  // call traverse for each node - 🔁 recursion traversal call (with next node)
  while (!iteratorObject.done) {
    let traversalPromise = iteratorObject.value.traversalInvocation()
    yield { traversalPromise }
    iteratorObject = await traversalIterator.next()
  }
}

/**
 * Controls execution of node traversals & Hands over control to implementation:
 *  1. Accepts new nodes from implementing function.
 *  2. returns back to the implementing function a promise, handing control of flow and arragement of running traversals.
 * @return {iterator feed of object} - {config: { port: <port node> }, result: <array of next nodes>}
 */
export async function* traverseGroupIterationRecursiveCall({
  groupIterator /** Feeding iterator that will accept node parameters for traversals */,
  additionalChildNode,
  traverseCallContext,
  /** 
    Important Note:  
    Below parameters are used in the interception proxy to decide what to traverse and how to aggregate the results. 
    `Traversal config` in the interception will limit the traversal and processing, i.e. it decides if to process current node, if to include it to aggragation, and if to traverse the nested nodes.
    If interception proxy is excluded (no implementation set), the graph should traverse all nodes with no restrictions.
  */
  traverserPosition,
  processDataCallback,
}) {
  // port traversal result - last node iterator feed should be an array of resolved node promises that will be forwarded through this function
  // forward array of resolved results
  for await (let { group } of groupIterator) {
    let handlePropagationImplementation = handlePropagation[group.config.handlePropagationImplementationKey || 'chronological']

    /*
      2-way communication with propagation implamentation -  next nodes iterator with receiving promise of node traversal
      the first iterator object call is used to initialize the function, in addition to the iterator function call.
    */
    let invokedPromiseIterator = await this::this.traverseIterationRecursiveCall({ traversalIterator: group.traversalIterator })
    let traversalResult = await handlePropagationImplementation({ invokedPromiseIterator, emit: traverserPosition.emitCompletedTraversal }) // pass iterator to implementation and propagate back (through return statement) the results of the node promises after completion

    yield {
      group: {
        result: traversalResult,
        config: {
          portNode: group.config.forkEdge.destination, // the related port which the stage originated from.
        },
      },
    }
  }
}

/**
   
  //! Update comments - Refactored to control of feed of promises
 * Methods controlling the iteration over nodes and execution arrangement.
 * Propagation Control implementation - Handles the graph traversal propagation order of Next nodes: 
    - Parallel
    - Chronological
    - Race first
    - etc...
 * @param nodeIteratorFeed iterator of object {node:<node data>}
 * @param emit event emitter callback used to indicate immediate resolution of node traversal promise (i.e. when the node completes it's traversal).
 */
const handlePropagation = {
  // TODO: down & upstream - implement a port implementation that will word with the downAndUpstream interception function.

  /**
   * Sequential node execution - await each node till it finishes execution.
   **/
  chronological: async function({ invokedPromiseIterator, emit }) {
    let nodeResultList = []
    for await (let { traversalPromise } of invokedPromiseIterator) {
      let nextResult = await traversalPromise
      emit(nextResult) // emit for immediate consumption
      nodeResultList.push(nextResult)
    }
    return nodeResultList
  },
  // Note: kept for future reference. Implementation using while loop instead of `for await`, as it allows for passing initial config value for the generator function (that will use function.sent to catch it.)
  chronological_implementationUsingWhileLoop: async function({ invokedPromiseIterator, emit }) {
    let nodeResultList = []

    let iteratorObject = await invokedPromiseIterator.next() // initialize generator function execution and pass execution configurations.
    while (!iteratorObject.done) {
      let nextResult = await iteratorObject.value.traversalPromise
      emit(nextResult) // emit for immediate consumption
      nodeResultList.push(nextResult)
      iteratorObject = await invokedPromiseIterator.next()
    }

    return nodeResultList
  },

  /**
   * Race promise of nodes - first to resolve is the one to be returned
   */
  raceFirstPromise: async function({ invokedPromiseIterator, emit }) {
    let traversalPromiseArray = []

    let iteratorObject = await invokedPromiseIterator.next() // initialize generator function execution and pass execution configurations.
    while (!iteratorObject.done) {
      let traversalPromise = iteratorObject.value.traversalPromise
      traversalPromiseArray.push(traversalPromise)
      iteratorObject = await invokedPromiseIterator.next()
    }

    let nodeResolvedResult = await promiseProperRace(traversalPromiseArray)
      .then(resolvedPromiseArray => {
        return resolvedPromiseArray[0] // as only one promise is return in the array - the first promise to be resolved.
      })
      .catch(error => {
        // TODO: catch all error and output them for each rejected promise. (edit promiseProperRace module)
        console.error(`🔀⚠️ promiseProperRace rejected because: ${error}`)
      })

    if (nodeResolvedResult) {
      emit(nodeResolvedResult) // emitting result is not immediate in this case, because the objective is to get a single resolved promise, and "promiseProperRace" maybe doesn't have the ability to stop uncompleted promises.
      return [nodeResolvedResult] // returned results must be wrapped in array so it could be forwarded through yeild* generator.
    } else return []
  },

  /**
   * Insures all nodeConnection promises resolves.
   **/
  allPromise: async function({ invokedPromiseIterator, emit }) {
    let traversalPromiseArray = [] // order of call initialization
    let resolvedOrderedNodeResolvedResult = [] // order of completion

    let iteratorObject = await invokedPromiseIterator.next() // initialize generator function execution and pass execution configurations.
    while (!iteratorObject.done) {
      let traversalPromise = iteratorObject.value.traversalPromise.then(result => {
        emit(result) // emit result for immediate usage by lisnters
        resolvedOrderedNodeResolvedResult.push(result) // array of node process results.
      }) // arrange promises according to resolution order.
      traversalPromiseArray.push(traversalPromise) // promises are in the same arrangment of connection iteration.
      iteratorObject = await invokedPromiseIterator.next()
    }

    // resolve all promises
    let promiseResolvedResultArray = await Promise.all(traversalPromiseArray).catch(error => {
      if (process.env.SZN_DEBUG == 'true') console.error(`🔀⚠️ \`Promise.all\` for nodeConnectionArray rejected because: ${error}`)
      else console.log(error)
    })

    // ordered results according to promise completion.
    return resolvedOrderedNodeResolvedResult // return for all resolved results

    // Preserves the order of nodes original in connection array, i.e. does not order the node results according to the execution completion, rather according to the first visited during traversal.
    // for (let nextResult of promiseResolvedResultArray) {
    //   emit(nextResult)
    // }
  },
}
