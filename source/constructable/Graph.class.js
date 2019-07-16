import assert from 'assert'
import { Entity, Constructable, symbol } from '@dependency/entity'
import { Node } from './Node.class.js'
import { Connection } from './Connection.class.js'
import { GraphTraversal } from './GraphTraversal.class.js'
import { Database } from './Database.class.js'
import { Cache } from './Cache.class.js'
import { Context } from './Context.class.js'
import { ImplementationManagement } from './ImplementationManagement.class.js'
import { proxifyMethodDecorator } from '../utility/proxifyMethodDecorator.js'
import { mergeDefaultParameter } from '../utility/mergeDefaultParameter.js'
import EventEmitter from 'events'
import { EvaluatorFunction } from './Evaluator.class.js'
const Evaluator = EvaluatorFunction({ traverse: 'continue', process: 'include' }) // initialize by setting default values.
import { removeUndefinedFromObject } from '../utility/removeUndefinedFromObject.js'

/** Conceptual Graph
 * Graph Class holds and manages graph elements and traversal algorithm implementations:
 *  - Cache: on-demand retrived nodes from DB are cached.
 *  - Database: get graph data and load it into memory.
 *  - Traversal: implementation for the traversal algorithm.
 *  - Context: shared data accessible between traversals.
 * The Graph instance should have an ability to set/change strategies/implementations on runtime and ability to use multiple registered implementations.
 */
export const { class: Graph, reference: Reference, constructablePrototype: Prototype, entityPrototype } = new Entity.clientInterface({ description: 'Graph' })

Object.assign(Reference, {
  key: {
    constructor: Symbol('Graph:key.constructor'),
  },
})

/*
                   _        _                    ____       _                  _   _             
   _ __  _ __ ___ | |_ ___ | |_ _   _ _ __   ___|  _ \  ___| | ___  __ _  __ _| |_(_) ___  _ __  
  | '_ \| '__/ _ \| __/ _ \| __| | | | '_ \ / _ \ | | |/ _ \ |/ _ \/ _` |/ _` | __| |/ _ \| '_ \ 
  | |_) | | | (_) | || (_) | |_| |_| | |_) |  __/ |_| |  __/ |  __/ (_| | (_| | |_| | (_) | | | |
  | .__/|_|  \___/ \__\___/ \__|\__, | .__/ \___|____/ \___|_|\___|\__, |\__,_|\__|_|\___/|_| |_|
  |_|                           |___/|_|                           |___/                         
*/
Object.assign(entityPrototype, {
  // load graph into memory
  async load({ graphData, graphInstance = this } = {}) {
    // load json graph data.
    assert(graphData.node && graphData.edge, `• Graph data object must contain node & edge arrays.`)
    return await graphInstance.database.loadGraphData({ nodeEntryData: graphData.node, connectionEntryData: graphData.edge })
  },
  async print({ graphInstance = this } = {}) {
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
  },
  async count({ graphInstance = this } = {}) {
    // count number of cached elements
    return {
      node: await graphInstance.database.countNode(),
      connection: await graphInstance.database.countEdge(),
    }
  },

  /** Graph traversal - Controls the traversing the nodes in the graph. Which includes processing of data items and aggregation of results.
   * Dynamic implementation - not restricted to specific initialization algorithm, rather choosen from setting of each node in the traversed graph.
   */
  @proxifyMethodDecorator(async (target, thisArg, argumentsList, targetClass, methodName) => {
    // create node instance, in case string key is passed as parameter.
    let { nodeInstance, nodeKey, nodeID, graphInstance = thisArg } = argumentsList[0]
    assert([nodeInstance, nodeKey, nodeID].filter(element => element).length == 1, '• node identifier or object must be passed in.') // only one of the parameters should be passed.
    if (nodeKey) {
      argumentsList[0].nodeInstance = await graphInstance.database.getNodeByKey({ key: nodeKey }) // retrieve node data on-demand
    } else if (nodeID) {
      argumentsList[0].nodeInstance = await graphInstance.database.getNodeByID({ id: nodeID }) // retrieve node data on-demand
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
          graphInstance: thisArg,
          additionalChildNode: [], // child nodes to add to the current node's children. These are added indirectly to a node without changing the node's children itself, as a way to extend current nodes.
          nodeConnectionKey: null, // pathPointerKey
          nodeType: 'Stage', // Traversal step or stage - defines when and how to run processes.
          evaluator: new Evaluator({ traverse: 'continue', process: 'include' }),
        },
        { parentTraversalArg: null },
      ],
    })
    return Reflect.apply(target, thisArg, argumentsList)
  })
  // TODO: Add ability to pick a defined set of implementation keys to be used to gether - e.g. implementation type: Condition, Middleware, Template
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
        processData: nodeInstance.properties?.processDataImplementation || 'returnDataItemKey',
        handlePropagation: nodeInstance.properties?.handlePropagationImplementation || 'chronological',
        traverseNode: nodeInstance.properties?.traverseNodeImplementation || 'portConnection',
        aggregator: 'AggregatorArray',
        traversalInterception: 'traverseThenProcess' || 'processThenTraverse',
      } |> removeUndefinedFromObject // remove undefined values because native Object.assign doesn't override keys with `undefined` values

    // Context instance parameter
    let contextImplementationKey = graphInstance[Context.reference.key.getter] ? graphInstance[Context.reference.key.getter]()?.implementationKey : {}
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
      traversalInterception: graphInstance.traversal.traversalInterception[implementationKey.traversalInterception],
      aggregator: graphInstance.traversal.aggregator[implementationKey.aggregator],
    }
    assert(Object.entries(implementation).every(([key, value]) => Boolean(value)), '• All `implementation` concerete functions must be set.')
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
      nodeIteratorFeed, // iterator providing node parameters for recursive traversal calls.
      traversalDepth, // level of recursion - allows to identify entrypoint level (toplevel) that needs to return the value of aggregator.
      concreteTraversal, // implementation registered functions
      implementationKey, // used by decorator to retreive implementation functions
      implementation, // implementation functions
      additionalChildNode,
      nodeConnectionKey,
      eventEmitter = new EventEmitter(), // create an event emitter to catch events from nested nodes of this node during their traversals.
      aggregator = new (nodeInstance::implementation.aggregator)(), // used to aggregate results of nested nodes.
      nodeType, // the type of node to traverse
      evaluator, // evaluation object that contains configuration relating to traverser action on the current position
    }: {
      graphInstance: Graph,
      nodeInstance: String | Node,
      concreteTraversal: GraphTraversal /** TODO: Currently it is an object derived from a GraphTraversal instance */,
      traversalDepth: Number,
      implementaion: Object,
      implementationKey: {
        // these are the the default registered implementations or internal module implementations.
        processData: 'returnDataItemKey' | 'returnKey' | 'timeout',
        traverseNode: 'allPromise' | 'chronological' | 'raceFirstPromise',
        aggregator: 'AggregatorArray' | 'ConditionCheck',
        traversalInterception: 'processThenTraverse' | 'conditionCheck',
      },
      nodeType: 'Stage',
      evaluator: {
        process: 'include' | 'exclude', // execute & include or don't execute & exclude from aggregated results.
        traverse: 'continue' | 'break', // traverse neighbours or not.
      },
    } = {},
    { parentTraversalArg } = {},
  ) {
    let dataProcessCallback = nextProcessData =>
      graphInstance::graphInstance.dataProcess({ nodeInstance, nextProcessData, evaluator, aggregator, dataProcessImplementation: nodeInstance::implementation.dataProcess })

    let proxyify = implementation.traversalInterception
      ? target => graphInstance::implementation.traversalInterception({ targetFunction: target, aggregator, dataProcessCallback })
      : // in case no implementation exists for intercepting traversal, use an empty proxy.
        target => new Proxy(target, {})

    // Core functionality required is to traverse nodes, any additional is added through intercepting the traversal.
    nodeIteratorFeed ||= graphInstance::graphInstance.traverseNode({ nodeInstance, nodeType, traverseNodeImplementation: nodeInstance::implementation.traverseNode })
    let traversalIteratorFeed = graphInstance::graphInstance.handlePropagation({ nodeIteratorFeed, handlePropagationImplementation: nodeInstance::implementation.handlePropagation })
    let result = await (graphInstance::graphInstance.recursiveIteration |> proxyify)({
      traversalIteratorFeed,
      nodeInstance,
      traversalDepth,
      eventEmitter,
      evaluator,
      parentTraversalArg: arguments,
    })

    // in case the proxy didn't iterate over the target generator or the implementation of proxy doesn't exist.
    if (typeof result[Symbol.asyncIterator] === 'function') {
      eventEmitter.on('nodeTraversalCompleted', console.log)
      let iterator = result,
        iteratorResult
      do iteratorResult = await iterator.next()
      while (!iteratorResult.done)
      return nodeInstance // only traversal (without returning accumolative data) is required with the default iteration (that doesn't include an implementing `traversalInterception` function)
    }

    return result
  },

  /**
   * The purpose of this function is to find & yield next nodes.
   * @yield node feed
   **/
  traverseNode: async function*({ nodeInstance, nodeType, traverseNodeImplementation, graphInstance = this }) {
    let nodeIteratorFeed = traverseNodeImplementation({ nodeInstance, nodeType, graphInstance })
    async function* trapAsyncIterator(iterator) {
      for await (let nodeData of iterator) {
        // evaluate whether to include or exclude a node from traversal.
        if (graphInstance.evaluateNode({ node: nodeData })) yield nodeData
      }
    }
    yield* trapAsyncIterator(nodeIteratorFeed)
  },
  // Node's include/exclude evaluation - evaluate whether or not a node whould be included in the node feed and subsequently in the traversal.
  evaluateNode({ node }) {
    return true
  },

  /**
   * Handles the graph traversal propagation order
   * @yields a traversal configuration feed/iterator
   * @return results array
   **/
  handlePropagation: async function*({ nodeIteratorFeed, handlePropagationImplementation /** Controls the iteration over nodes and execution arrangement. */, graphInstance = this }) {
    let { eventEmitterCallback: emit } = function.sent
    let traversalIteratorFeed = handlePropagationImplementation({ nodeIteratorFeed, emit }) // pass iterator to implementation and propagate back (through return statement) the results of the node promises after completion
    async function* trapAsyncIterator(iterator) {
      let iteratorResult = await iterator.next()
      while (!iteratorResult.done) {
        let traversalConfig = iteratorResult.value
        // traversalConfig.evaluator = new Evaluator({ process: 'exclude' })
        yield traversalConfig
        let { promise } = function.sent
        iteratorResult = await iterator.next({ promise })
      }
      return iteratorResult.value
    }
    return yield* trapAsyncIterator(traversalIteratorFeed)
  },

  /**
   * Controls execution of node traversals & Hands over control to implementation:
   *  1. Accepts new nodes from implementing function.
   *  2. returns back to the implementing function a promise, handing control of flow and arragement of running traversals.
   */
  recursiveIteration: async function({
    traversalIteratorFeed /**Feeding iterator that will accept node parameters for traversals*/,
    graphInstance = this,
    recursiveCallback = graphInstance::graphInstance.traverse,
    traversalDepth,
    eventEmitter,
    evaluator,
    parentTraversalArg,
  }: {
    eventEmitter: Event,
  }) {
    if (!evaluator.shouldContinue()) return []

    let eventEmitterCallback = (...args) => eventEmitter.emit('nodeTraversalCompleted', ...args)
    traversalDepth += 1 // increase traversal depth
    let g = {}
    g.result = await traversalIteratorFeed.next({ eventEmitterCallback: eventEmitterCallback }) // initial execution
    while (!g.result.done) {
      let traversalConfig = g.result.value
      // 🔁 recursion call
      let promise = recursiveCallback(Object.assign({ nodeInstance: traversalConfig.node, evaluator: traversalConfig.evaluator, traversalDepth }), {
        parentTraversalArg,
      })
      g.result = await traversalIteratorFeed.next({ promise })
    }
    // last node iterator feed should be an array of resolved node promises that will be forwarded through this function
    return g.result.value // forward array of resolved results
  },

  dataProcess: async function({ nodeInstance, nextProcessData, aggregator, evaluator, dataProcessImplementation }) {
    if (!evaluator.shouldExecuteProcess()) return null

    let dataItem = nodeInstance
    // Execute node dataItem
    let result = dataItem ? await nodeInstance::dataProcessImplementation({ dataItem }) : null
    if (evaluator.shouldIncludeResult()) aggregator.add(result)
    return result
  },
})

/*
   _       _ _   _       _ _         
  (_)_ __ (_) |_(_) __ _| (_)_______ 
  | | '_ \| | __| |/ _` | | |_  / _ \
  | | | | | | |_| | (_| | | |/ /  __/
  |_|_| |_|_|\__|_|\__,_|_|_/___\___|
*/
Prototype::Prototype[Constructable.reference.initialize.functionality].setter({
  [Entity.reference.key.concereteBehavior]({ targetInstance, concereteBehaviorList } = {}, previousResult) {},
})

/*
                       _                   _             
    ___ ___  _ __  ___| |_ _ __ _   _  ___| |_ ___  _ __ 
   / __/ _ \| '_ \/ __| __| '__| | | |/ __| __/ _ \| '__|
  | (_| (_) | | | \__ \ |_| |  | |_| | (__| || (_) | |   
   \___\___/|_| |_|___/\__|_|   \__,_|\___|\__\___/|_|   
*/
Prototype::Prototype[Constructable.reference.constructor.functionality].setter({
  /**
   * Graph will contain the prototype chain to install on the instances (previously 'classes hierarchy connections`)
   * 1. configuredConstructable1 = Graph(<plugins>)
   * 2. configuredConstructable2 = configuredConstructable1(<context>)
   * 3. new configuredConstructable2(<instance data>) // creates instance
   * 4. traverse graph: e.g. instance.traverseGraph()
   */
  [Reference.key.constructor]({
    // Concerete behaviors / implementaions
    // cache,
    database,
    traversal,
    // additional behaviors
    concreteBehaviorList = [],
    data, // data to be merged into the instance
    callerClass = this,
    mode = 'applicationInMemory' || 'databaseInMemory',
  }: {
    cache: Cache,
    database: Database,
    traversal: GraphTraversal,
    concereteBehavior: List,
  }) {
    assert(database, '• Database concrete behavior must be passed.')
    assert(traversal, '• traversal concrete behavior must be passed.')
    // cache ||= new Cache.clientInterface({ groupKeyArray: ['node', 'connection'] })

    let instance = callerClass::Constructable[Constructable.reference.constructor.functionality].switch({ implementationKey: Entity.reference.key.concereteBehavior })({
      concreteBehaviorList: [...concreteBehaviorList, /*cache,*/ database, traversal],
      data,
    })
    // expose functionality for direct simplified access:
    let concereteDatabase = instance[Entity.reference.getInstanceOf](Database)
    instance.database = concereteDatabase[Database.reference.key.getter]()
    let concreteTraversal = instance[Entity.reference.getInstanceOf](GraphTraversal)
    instance.traversal = concreteTraversal[ImplementationManagement.reference.key.getter]()

    // configure Graph element classes
    // instance.configuredNode = Node.clientInterface({ parameter: [{ concreteBehaviorList: [] }] })
    // instance.configuredConnection = Connection.clientInterface({ parameter: [{ concereteBehavior: [] }] })

    return instance
  },
})

/*
        _ _            _   ___       _             __                
    ___| (_) ___ _ __ | |_|_ _|_ __ | |_ ___ _ __ / _| __ _  ___ ___ 
   / __| | |/ _ \ '_ \| __|| || '_ \| __/ _ \ '__| |_ / _` |/ __/ _ \
  | (__| | |  __/ | | | |_ | || | | | ||  __/ |  |  _| (_| | (_|  __/
   \___|_|_|\___|_| |_|\__|___|_| |_|\__\___|_|  |_|  \__,_|\___\___|
*/
Graph.clientInterface = Graph::Prototype[Constructable.reference.clientInterface.functionality].switch({
  implementationKey: Entity.reference.key.instanceDelegatingToEntityInstancePrototype,
})({
  constructorImplementation: Reference.key.constructor,
  clientInterfaceInterceptCallback: false,
})
