import EventEmitter from 'events'
import assert from 'assert'
import { proxifyMethodDecorator } from '../../utility/proxifyMethodDecorator.js'
import { mergeDefaultParameter } from '../../utility/mergeDefaultParameter.js'
import { removeUndefinedFromObject } from '../../utility/removeUndefinedFromObject.js'

import { Context } from '../Context.class.js'
import { GraphTraversal, traversalOption } from '../GraphTraversal.class.js'
import { nodeLabel, connectionType, connectionProperty } from '../../graphSchemeReference.js'
import { EvaluatorFunction, evaluationOption } from '../Evaluator.class.js'
const Evaluator = EvaluatorFunction()

// load graph into memory
export async function load({ graphData, graphInstance = this } = {}) {
  // load json graph data.
  assert(graphData.node && graphData.edge, `• Graph data object must contain node & edge arrays.`)
  return await graphInstance.database.loadGraphData({ nodeEntryData: graphData.node, connectionEntryData: graphData.edge })
}

export async function print({ graphInstance = this } = {}) {
  console.log(`______ Graph elements: ____________________`)
  let count = await graphInstance.count()
  let allNode = await graphInstance.database.getAllNode()
  let allEdge = await graphInstance.database.getAllEdge()
  console.log(`#Vertex = ${count.node}`)
  for (let node of allNode) {
    console.log(node.identity)
  }
  console.log(`\n#Edge = ${count.connection}`)
  for (let edge of allEdge) {
    console.log(`${edge.start} --> ${edge.end}`)
  }
  console.log(`___________________________________________`)
}

export async function count({ graphInstance = this } = {}) {
  // count number of cached elements
  return {
    node: await graphInstance.database.countNode(),
    connection: await graphInstance.database.countEdge(),
  }
}

// load `subgraph template` node parameters for traversal call usage.
export async function laodSubgraphTemplateParameter({ node, graphInstance = this }) {
  let rootRelationshipArray = await graphInstance.database.getNodeConnection({ direction: 'outgoing', nodeID: node.identity, connectionType: connectionType.root })
  assert(rootRelationshipArray.every(n => n.destination.labels.includes(nodeLabel.stage)), `• Unsupported node type for a ROOT connection.`) // verify node type
  let extendRelationshipArray = await graphInstance.database.getNodeConnection({ direction: 'outgoing', nodeID: node.identity, connectionType: connectionType.extend })
  assert(extendRelationshipArray.every(n => n.destination.labels.includes(nodeLabel.subgraphTemplate)), `• Unsupported node type for a EXTEND connection.`) // verify node type
  let configureRelationshipArray = await graphInstance.database.getNodeConnection({ direction: 'incoming', nodeID: node.identity, connectionType: connectionType.configure })
  assert(configureRelationshipArray.every(n => n.destination.labels.includes(nodeLabel.configuration)), `• Unsupported node type for a EXTEND connection.`) // verify node type

  let rootNode,
    traversalConfiguration = {},
    additionalChildNode = [] // additional nodes

  // get traversal configuration node
  if (configureRelationshipArray.length > 0) {
    function extractTraversalConfigProperty(propertyObject) {
      return Object.entries(propertyObject).reduce((accumulator, [key, value]) => {
        if (traversalOption.includes(key)) accumulator[key] = value
        return accumulator
      }, {})
    }
    let configureNode = configureRelationshipArray[0].destination
    traversalConfiguration = extractTraversalConfigProperty(configureNode.properties)
  }

  // get additional nodes
  let insertRelationshipArray = await graphInstance.database.getNodeConnection({ direction: 'incoming', nodeID: node.identity, connectionType: connectionType.insert })
  insertRelationshipArray.sort((former, latter) => former.connection.properties.order - latter.connection.properties.order) // using `order` property // Bulk actions on forks - sort forks
  for (let insertRelationship of insertRelationshipArray) {
    let insertNode = insertRelationship.destination
    assert(insertNode.labels.includes(nodeLabel.stage), `• "${insertNode.labels}" Unsupported node type for a ROOT connection.`) // verify node type
    additionalChildNode.push({
      node: insertNode,
      placement: {
        // convention for data structure of placement array - 0: 'before' | 'after', 1: connectionKey
        position: insertRelationship.connection.properties.placement[0],
        connectionKey: insertRelationship.connection.properties.placement[1],
      },
    })
  }

  // get rootNode and handle extended node.
  if (rootRelationshipArray.length > 0) {
    rootNode = rootRelationshipArray[0].destination
  } else if (extendRelationshipArray.length > 0) {
    let extendNode = extendRelationshipArray[0].destination
    let recursiveCallResult = await graphInstance::graphInstance.laodSubgraphTemplateParameter({ node: extendNode, graphInstance })
    additionalChildNode = [...recursiveCallResult.additionalChildNode, ...additionalChildNode]
    traversalConfiguration = Object.assign(recursiveCallResult.traversalConfiguration, traversalConfiguration)
    rootNode = recursiveCallResult.rootNode
  } else {
    return // in case no `ROOT` relation or `EXTEND` are present
  }

  return { rootNode, additionalChildNode, traversalConfiguration } // rootNode will be used as entrypoint to traversal call
}

/**
 * Node's include/exclude evaluation - evaluate whether or not a node whould be included in the node feed and subsequently in the traversal.
 * continue child nodes traversal or break traversal.
 */
export async function evaluatePosition({ evaluation, node, implementation, graphInstance = this }) {
  // default values
  evaluation = new Evaluator({ propagation: evaluationOption.propagation.continue, aggregation: evaluationOption.aggregation.include }) // Note: Additional default values for Evaluator constructor are set above during initialization of Evaluator static class.
  // manipulate evaluation config
  await implementation({ evaluation, node, graphInstance })
  return evaluation
}

/**
 * The purpose of this function is to find & yield next nodes.
 * @yield node feed
 **/
export async function* traverseNode({ node, additionalChildNode, implementation, handlePropagationImplementation, graphInstance = this }) {
  let traversalIteratorFeed = await node::implementation({ node, additionalChildNode, graphInstance })
  async function* trapAsyncIterator(iterator) {
    for await (let traversalIteration of iterator) {
      let _handlePropagationImplementation
      if (traversalIteration.traversalConfig.handlePropagationImplementation) {
        _handlePropagationImplementation = graphInstance.traversal.handlePropagation[traversalIteration.traversalConfig.handlePropagationImplementation]
        assert(_handlePropagationImplementation, `• "${traversalIteration.traversalConfig.handlePropagationImplementation}" implementation isn't registered in traversal concrete instance.`)
      } else _handlePropagationImplementation = handlePropagationImplementation
      let nextIterator = graphInstance::graphInstance.handlePropagation({ nodeIteratorFeed: traversalIteration.nextIterator, implementation: node::_handlePropagationImplementation })
      yield { nextIterator, forkNode: traversalIteration.forkNode }
    }
  }
  yield* trapAsyncIterator(traversalIteratorFeed)
}

/**
 * Handles the graph traversal propagation order
 * @yields a traversal configuration feed/iterator
 * @return results array
 **/
export async function* handlePropagation({ nodeIteratorFeed, implementation /** Controls the iteration over nodes and execution arrangement. */, graphInstance = this }) {
  let { eventEmitterCallback: emit } = function.sent
  let traversalIteratorFeed = implementation({ nodeIteratorFeed, emit }) // pass iterator to implementation and propagate back (through return statement) the results of the node promises after completion
  async function* trapAsyncIterator(iterator) {
    let iteratorResult = await iterator.next()
    while (!iteratorResult.done) {
      let traversalConfig = iteratorResult.value
      yield traversalConfig
      let { promise } = function.sent
      iteratorResult = await iterator.next({ promise })
    }
    return iteratorResult.value
  }
  return yield* trapAsyncIterator(traversalIteratorFeed)
}

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
  evaluation,
  additionalChildNode,
  parentTraversalArg,
}: {
  eventEmitter: Event,
}) {
  if (!evaluation.shouldContinue()) return // skip traversal
  let eventEmitterCallback = (...args) => eventEmitter.emit('nodeTraversalCompleted', ...args)
  traversalDepth += 1 // increase traversal depth
  for await (let traversalIteration of traversalIteratorFeed) {
    let n = { iterator: traversalIteration.nextIterator, result: await traversalIteration.nextIterator.next({ eventEmitterCallback: eventEmitterCallback }) }
    while (!n.result.done) {
      let nextNode = n.result.value.node
      // 🔁 recursion call
      let nextCallArgument = [Object.assign({ nodeInstance: nextNode, traversalDepth, additionalChildNode }), { parentTraversalArg }]
      let promise = recursiveCallback(...nextCallArgument)
      n.result = await n.iterator.next({ promise })
    }
    // last node iterator feed should be an array of resolved node promises that will be forwarded through this function
    let portTraversalResult = { config: { name: traversalIteration.forkNode.properties.name }, result: n.result.value }
    yield portTraversalResult // forward array of resolved results
  }
}

export async function dataProcess({ node, nextProcessData, aggregator, evaluation, implementation, graphInstance }) {
  if (!evaluation.shouldExecuteProcess()) return null
  let executeConnectionArray = await graphInstance.database.getNodeConnection({ direction: 'outgoing', nodeID: node.identity, connectionType: connectionType.execute })
  assert(executeConnectionArray.every(n => n.destination.labels.includes(nodeLabel.process)), `• Unsupported node type for a EXECUTE connection.`) // verify node type
  let resourceConnectionArray = await graphInstance.database.getNodeConnection({ direction: 'incoming', nodeID: node.identity, connectionType: connectionType.resource })
  assert(resourceConnectionArray.every(n => connectionProperty.context.includes(n.connection.properties.context)), `• Unsupported property value for a RESOURCE connection.`) // verify node type
  if (executeConnectionArray.length == 0) return null // skip if no execute connection

  let resourceRelation
  if (resourceConnectionArray.length > 0) resourceRelation = resourceConnectionArray[0]

  let executeConnection = executeConnectionArray[0].connection
  let dataProcessImplementation
  if (executeConnection.properties.processDataImplementation) {
    dataProcessImplementation = graphInstance.traversal.processData[executeConnection.properties.processDataImplementation]
    assert(dataProcessImplementation, `• "${executeConnection.properties.processDataImplementation}" implementation isn't registered in traversal concrete instance.`)
  } else dataProcessImplementation = implementation

  let executeNode = executeConnectionArray[0].destination
  // Execute node dataItem
  let result = await node::dataProcessImplementation({ node: executeNode, resourceRelation, graphInstance })

  if (evaluation.shouldIncludeResult()) aggregator.add(result)
  return result
}

// Note: wrapping in object allows the usage of decorators
export const { traverse } = {
  /** Graph traversal - Controls the traversing the nodes in the graph. Which includes processing of data items and aggregation of results.
   * Dynamic implementation - not restricted to specific initialization algorithm, rather choosen from setting of each node in the traversed graph.
   */
  @proxifyMethodDecorator(async (target, thisArg, argumentsList, targetClass, methodName) => {
    // create node instance, in case string key is passed as parameter.
    let { nodeInstance, nodeKey, nodeID, graphInstance = thisArg } = argumentsList[0]
    let nodeData
    if (nodeInstance) {
      nodeData = nodeInstance
    } else if (nodeKey) {
      nodeData = await graphInstance.database.getNodeByKey({ key: nodeKey }) // retrieve node data on-demand
    } else if (nodeID) {
      nodeData = await graphInstance.database.getNodeByID({ id: nodeID }) // retrieve node data on-demand
    } else {
      throw new Error('• node identifier or object must be passed in.')
    }

    // deal with SubgraphTemplate
    if (nodeData.labels.includes(nodeLabel.subgraphTemplate)) {
      let parameter = await graphInstance.laodSubgraphTemplateParameter({ node: nodeData })
      if (!parameter)
        return // in case no destination node (ROOT/Extend) are present
        // set additional parameters
      ;['nodeInstance', 'nodeKey', 'nodeID'].forEach(property => delete argumentsList[0][property]) // remove subgraph template node related identifiers.
      argumentsList[0].implementationKey = argumentsList[0].implementationKey ? Object.assign(parameter.traversalConfiguration, argumentsList[0].implementationKey) : parameter.traversalConfiguration
      argumentsList[0].additionalChildNode = argumentsList[0].additionalChildNode ? [...argumentsList[0].additionalChildNode, ...parameter.additionalChildNode] : parameter.additionalChildNode
      Object.assign(argumentsList[0], { nodeInstance: parameter.rootNode })
    } else {
      argumentsList[0].nodeInstance = nodeData // set node data
    }
    return Reflect.apply(target, thisArg, argumentsList)
  })
  @proxifyMethodDecorator((target, thisArg /*Graph Instance*/, argumentsList, targetClass, methodName) => {
    // set default parameters and expose them to subsequent method decorators.
    argumentsList = mergeDefaultParameter({
      passedArg: argumentsList,
      defaultArg: [
        {
          traversalDepth: 0,
          path: null, // TODO: implement path sequence preservation. allow for the node traverse function to rely on the current path data.
          graphInstance: thisArg,
          additionalChildNode: [], // child nodes to add to the current node's children. These are added indirectly to a node without changing the node's children itself, as a way to extend current nodes.
          nodeType: 'Stage', // Traversal step or stage - defines when and how to run processes.
        },
        { parentTraversalArg: null },
      ],
    })
    return Reflect.apply(target, thisArg, argumentsList)
  })
  /** 
   * TODO:  REFACTOR adding Traversal description class - ability to pick a defined set of implementation keys to be used to gether - e.g. implementation type: Condition, Middleware, Template, Schema, Shellscript.
    - https://neo4j.com/docs/java-reference/3.5/javadocs/org/neo4j/graphdb/traversal/TraversalDescription.html
    - Split traversal configurations that are configured by the node graph data itself from those that are passed to the call as parameters. OR merge them, by using some as defaults in case both are set.
    - Implement 'depthAffected' for the affected depth of the configure connections on a stage and its child nodes.
   */
  @proxifyMethodDecorator((target, thisArg, argumentsList, targetClass, methodName) => {
    /** Choose concrete implementation
     * Parameter hirerchy for graph traversal implementations: (1 as first priority)
     * 1. shared context configurations - that could be used as overwriting values. e.g. nodeInstance[Context.getSharedContext].concereteImplementationKeys
     * 2. call parameters that are passed directly
     * 3. node instance configuration/properties
     * 4. default values specified in the function scope.
     */
    let { nodeInstance, implementationKey: parameterImplementationKey = {}, graphInstance } = argumentsList[0],
      { parentTraversalArg } = argumentsList[1]

    // TODO: refactor parameter hirerchy merging to be more readable.
    // implementation keys of node instance own config parameters and of default values set in function scope
    let implementationKey =
      {
        processData: 'returnDataItemKey',
        handlePropagation: 'chronological',
        traverseNode: 'iterateFork',
        aggregator: 'AggregatorArray',
        traversalInterception: 'processThenTraverse' || 'traverseThenProcess',
        evaluatePosition: 'evaluateCondition',
      } |> removeUndefinedFromObject // remove undefined values because native Object.assign doesn't override keys with `undefined` values

    // Context instance parameter
    let contextImplementationKey = (graphInstance[Context.reference.key.getter] ? graphInstance[Context.reference.key.getter]()?.implementationKey : {}) || {}
    // parent arguments
    let parentImplementationKey = parentTraversalArg ? parentTraversalArg[0].implementationKey || {} : {}
    // overwrite (for all subtraversals) implementation through directly passed parameters - overwritable traversal implementation ignoring each nodes configuration, i.e. overwritable over nodeInstance own property implementation keys
    implementationKey
      |> (targetObject =>
        Object.assign(targetObject, parentImplementationKey, implementationKey, parameterImplementationKey |> removeUndefinedFromObject, contextImplementationKey |> removeUndefinedFromObject))
    argumentsList[0].implementationKey = implementationKey

    // get implementation functions
    let implementation = {
      dataProcess: graphInstance.traversal.processData[implementationKey.processData],
      handlePropagation: graphInstance.traversal.handlePropagation[implementationKey.handlePropagation],
      traverseNode: graphInstance.traversal.traverseNode[implementationKey.traverseNode],
      traversalInterception: graphInstance.traversal.traversalInterception[implementationKey.traversalInterception] || (({ targetFunction }) => new Proxy(targetFunction, {})), // in case no implementation exists for intercepting traversal, use an empty proxy.
      aggregator: graphInstance.traversal.aggregator[implementationKey.aggregator],
      evaluatePosition: graphInstance.traversal.evaluatePosition[implementationKey.evaluatePosition],
    }
    assert(
      Object.entries(implementation).every(([key, value]) => Boolean(value)),
      '• All `implementation` concerete functions must be registered, the implementationKey provided doesn`t match any of the registered implementaions.',
    )
    // deep merge of nested parameter (TODO: use utility function from different module that does this function.)
    argumentsList = mergeDefaultParameter({
      passedArg: argumentsList,
      defaultArg: [
        {
          implementation,
        },
      ],
    })

    return Reflect.apply(target, thisArg, argumentsList)
  })
  async traverse(
    {
      graphInstance,
      nodeInstance,
      traversalIteratorFeed, // iterator providing node parameters for recursive traversal calls.
      traversalDepth, // level of recursion - allows to identify entrypoint level (toplevel) that needs to return the value of aggregator.
      path,
      concreteTraversal, // implementation registered functions
      implementationKey, // used by decorator to retreive implementation functions
      implementation, // implementation functions
      additionalChildNode,
      eventEmitter = new EventEmitter(), // create an event emitter to catch events from nested nodes of this node during their traversals.
      aggregator = new (nodeInstance::implementation.aggregator)(), // used to aggregate results of nested nodes.
      nodeType, // the type of node to traverse
      evaluation, // evaluation object that contains configuration relating to traverser action on the current position
    }: {
      graphInstance: Graph,
      nodeInstance: String | Node,
      concreteTraversal: GraphTraversal /** TODO: Currently it is an object derived from a GraphTraversal instance */,
      traversalDepth: Number,
      implementaion: Object,
      implementationKey: {
        // the the default registered implementations or internal module implementations.
        processData: 'returnDataItemKey' | 'returnKey' | 'timeout',
        traverseNode: 'allPromise' | 'chronological' | 'raceFirstPromise',
        aggregator: 'AggregatorArray' | 'ConditionCheck',
        traversalInterception: 'processThenTraverse' | 'conditionCheck',
      },
      nodeType: 'Stage',
      evaluation: {
        process: 'include' | 'exclude', // execute & include or don't execute & exclude from aggregated results.
        traverse: 'continue' | 'break', // traverse neighbours or not.
      },
    } = {},
    { parentTraversalArg } = {},
  ) {
    evaluation ||= await graphInstance.evaluatePosition({ evaluation, node: nodeInstance, implementation: nodeInstance::implementation.evaluatePosition })

    // Core functionality required is to traverse nodes, any additional is added through intercepting the traversal.
    traversalIteratorFeed ||= graphInstance::graphInstance.traverseNode({
      node: nodeInstance,
      implementation: implementation.traverseNode,
      handlePropagationImplementation: implementation.handlePropagation,
      additionalChildNode,
    })

    let dataProcessCallback = nextProcessData =>
      graphInstance::graphInstance.dataProcess({ node: nodeInstance, nextProcessData, evaluation, aggregator, implementation: implementation.dataProcess, graphInstance })

    let proxyify = target => graphInstance::implementation.traversalInterception({ targetFunction: target, aggregator, dataProcessCallback })
    let result = await (graphInstance::graphInstance.recursiveIteration |> proxyify)({
      traversalIteratorFeed,
      nodeInstance,
      traversalDepth,
      eventEmitter,
      evaluation,
      additionalChildNode,
      parentTraversalArg: arguments,
    })

    return result
  },
}
