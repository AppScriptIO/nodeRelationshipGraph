import promiseProperRace from '@dependency/promiseProperRace'
// import { iterateConnection } from './iterateConnection.js'

/**
 * Race promise of nodes - first to resolve is the one to be returned
 */
export async function* raceFirstPromise({ nodeIteratorFeed, emit }) {
  let g = { iterator: nodeIteratorFeed }
  g.result = await g.iterator.next() // initialize generator function execution and pass execution configurations.
  let nodePromiseArray = []
  while (!g.result.done) {
    let nextNodeConfig = g.result.value
    yield { nodeInstance: nextNodeConfig.nodeKey }
    let { promise } = function.sent
    nodePromiseArray.push(promise)
    g.result = await g.iterator.next()
  }
  let nodeResolvedResult = await promiseProperRace(nodePromiseArray)
    .then(resolvedPromiseArray => {
      return resolvedPromiseArray[0] // as only one promise is return in the array - the first promise to be resolved.
    })
    .catch(error => {
      if (process.env.SZN_DEBUG == 'true') console.error(`🔀⚠️ promiseProperRace rejected because: ${error}`)
      else console.log(`🔀⚠️ promiseProperRace rejected because: ${error}`)
    })
  if (nodeResolvedResult) {
    emit(nodeResolvedResult) // emitting result is not immediate in this case, because the objective is to get a single resolved promise, and "promiseProperRace" maybe doesn't have the ability to stop uncompleted promises.
    return [nodeResolvedResult] // returned results must be wrapped in array so it could be forwarded through yeild* generator.
  }
}

/**
 * Insures all nodeConnection promises resolves.
 **/
export async function* allPromise({ nodeIteratorFeed, emit }) {
  let g = { iterator: nodeIteratorFeed }
  g.result = await g.iterator.next() // initialize generator function execution and pass execution configurations.
  let nodePromiseArray = [] // order of call initialization
  let resolvedOrderedNodeResolvedResult = [] // order of completion
  while (!g.result.done) {
    let nextNodeConfig = g.result.value
    yield { nodeInstance: nextNodeConfig.nodeKey }
    let { promise } = function.sent
    nodePromiseArray.push(promise) // promises are in the same arrangment of connection iteration.
    promise.then(result => emit(result)) // emit result for immediate usage by lisnters
    promise.then(result => resolvedOrderedNodeResolvedResult.push(result)) // arrange promises according to resolution order.
    g.result = await g.iterator.next()
  }
  // resolve all promises
  let nodeResolvedResultArray = await Promise.all(nodePromiseArray).catch(error => {
    if (process.env.SZN_DEBUG == 'true') console.error(`🔀⚠️ \`Promise.all\` for nodeConnectionArray rejected because: ${error}`)
    else console.log(error)
  })

  // ordered results according to promise completion.
  return resolvedOrderedNodeResolvedResult // return for all resolved results

  // Preserves the order of nodes original in connection array, i.e. does not order the node results according to the execution completion, rather according to the first visited during traversal.
  // for (let nextResult of nodeResolvedResultArray) {
  //   emit(nextResult)
  // }
}

/**
 * Sequential node execution - await each node till it finishes execution.
 **/
export async function* chronological({ nodeIteratorFeed, emit }) {
  let g = { iterator: nodeIteratorFeed }
  g.result = await g.iterator.next() // initialize generator function execution and pass execution configurations.
  let nodeResultList = []
  while (!g.result.done) {
    let nextNodeConfig = g.result.value
    yield { nodeInstance: nextNodeConfig.nodeKey }
    let { promise } = function.sent
    let nextResult = await promise
    emit(nextResult) // emit for immediate consumption
    nodeResultList.push(nextResult)
    g.result = await g.iterator.next()
  }
  return nodeResultList
}

/**
 * @description loops through all the `node ports` and initializes each one to execute the `node connections` specific for it.
 */
export const iteratePort = async function({ nodePortArray = thisArg.port, executePort = implementation.executePort }) {
  // filter port array to match outgoing ports only
  nodePortArray = nodePortArray.filter(item => item.tag.direction == 'output')

  // sort array
  function sortAccordingToOrder(former, latter) {
    return former.order - latter.order
  } // using `order` property
  nodePortArray.sort(sortAccordingToOrder)

  let aggregationArray = []
  for (let nodePort of nodePortArray) {
    let subsequentArray = await executePort({ nodePort: nodePort })
    Array.prototype.push.apply(aggregationArray, subsequentArray)
  }

  return aggregationArray
}

/**
 * Execute node port with relevant implementation - Call correct execution type method according to `node port` settings
 */
export async function executePort({ nodePort, nodeInstance = thisArg, iterateConnection = iterateConnection, executionTypeArray }) {
  // filter connection to match the current port
  let currentPortConnectionArray = nodeInstance.connection.filter(item => item.source.portKey == nodePort.key)

  return await iterateConnection({ nodeConnectionArray: currentPortConnectionArray, implementationType: nodePort.tag?.iterateConnectionImplementation })
}
