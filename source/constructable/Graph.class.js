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
const removeUndefinedFromObject = object => {
  Object.keys(object).forEach(key => object[key] === undefined && delete object[key])
  return object
}

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
  async loadGraphIntoMemoryFromDatabase({ graphInstance = this } = {}) {
    let concereteDatabase = graphInstance[Entity.reference.getInstanceOf](Database)

    let nodeEntryData = concereteDatabase[ImplementationManagement.reference.key.getter]().getAllNode() || []
    for (let entry of nodeEntryData) {
      graphInstance.addNode({ nodeInstance: entry })
    }

    let connectionEntryData = concereteDatabase[ImplementationManagement.reference.key.getter]().getAllConnection() || []
    for (let entry of connectionEntryData) {
      graphInstance.addConnection({ connectionInstance: entry })
    }

    return { nodeEntryData, connectionEntryData }
  },

  /** Load node data on-demand from database
   * 1. return cached - check if node is cached using key parameter.
   * 2. return new - create node instance and load data from database on-demand.
   */
  @proxifyMethodDecorator(async (target, thisArg, argumentsList, targetClass, methodName) => {
    // meta programming - add caching functinality.
    let { key, graphInstance = thisArg } = argumentsList[0]
    let concereteCache = graphInstance[Entity.reference.getInstanceOf](Cache)
    let nodeInstance
    // retrieve from cache
    nodeInstance = concereteCache[Cache.reference.key.getter](key, 'node')
    // create node if doesn' exist
    if (!nodeInstance) {
      nodeInstance = await Reflect.apply(target, thisArg, argumentsList)
      graphInstance.addNode({ nodeInstance })
    }
    return nodeInstance
  })
  async addNodeByKey({ key, graphInstance = this }: { key: String }) {
    let concereteDatabase = graphInstance[Entity.reference.getInstanceOf](Database)
    let nodeInstance = new graphInstance.configuredNode({ key })
    let databaseEntry = await concereteDatabase[Database.reference.key.getter]().getByKey({ key })
    Object.assign(nodeInstance, databaseEntry)
    return nodeInstance
  },
  addNode({ nodeInstance, graphInstance = this }: { nodeInstance: Object | Node /* object with key or instance of Node */ }) {
    let concereteCache = graphInstance[Entity.reference.getInstanceOf](Cache)
    assert(nodeInstance.key, '• Node instance must have a key property.')
    let cache = concereteCache[Cache.reference.key.getter](nodeInstance.key, 'node')
    if (!cache) {
      // Note: `nodeInstance instanceof Node` will not work as Entity module creates Objects rather than callable Function instances. Could consider changing this behavior to allow native constructor checking to work.
      if (!(nodeInstance.constructor == Node)) nodeInstance = new graphInstance.configuredNode(nodeInstance)
      concereteCache[Cache.reference.key.setter](nodeInstance.key, nodeInstance, 'node')
    } else {
      nodeInstance = cache // retrieve the cached entry
    }
    return nodeInstance
  },
  getNode({ nodeKey, graphInstance = this }) {
    let concereteCache = graphInstance[Entity.reference.getInstanceOf](Cache)
    return concereteCache[Cache.reference.key.getter](nodeKey, 'node')
  },
  addConnection({ connectionInstance, graphInstance = this }) {
    let concereteCache = graphInstance[Entity.reference.getInstanceOf](Cache)
    assert(connectionInstance.source && connectionInstance.destination, `• Connection must have a source and destination nodes.`)
    assert(connectionInstance.key, '• Connection object must have a key property.')
    let cache = concereteCache[Cache.reference.key.getter](connectionInstance.key, 'connection')
    if (!cache) {
      // replace keys with instances
      let replaceKeyWithNodeInstanceCallback = key => graphInstance.getNode({ nodeKey: key })
      connectionInstance.source =
        connectionInstance.source |> Array.isArray ? connectionInstance.source.map(replaceKeyWithNodeInstanceCallback) : replaceKeyWithNodeInstanceCallback(connectionInstance.source)
      connectionInstance.destination =
        connectionInstance.destination |> Array.isArray ? connectionInstance.destination.map(replaceKeyWithNodeInstanceCallback) : replaceKeyWithNodeInstanceCallback(connectionInstance.destination)
      // Note: `connectionInstance instanceof Connection` will not work as Entity module creates Objects rather than callable Function instances. Could consider changing this behavior to allow native constructor checking to work.
      if (!(connectionInstance.constructor == Connection)) connectionInstance = new graphInstance.configuredConnection(connectionInstance)
      concereteCache[Cache.reference.key.setter](connectionInstance.key, connectionInstance, 'connection')
    } else {
      connectionInstance = cache // retrieve the cached entry
    }
    return connectionInstance
  },
  // count number of cached elements
  count({ graphInstance = this } = {}) {
    let concereteCache = graphInstance[Entity.reference.getInstanceOf](Cache)
    return {
      node: concereteCache[Cache.reference.key.getLength]('node'),
      connection: concereteCache[Cache.reference.key.getLength]('connection'),
    }
  },
  /**
   * convention of data structure - `connection: { source: [<nodeKey>, <portKey>], destination: [<nodeKey>, <portKey>] }`
   */
  getConnection({
    nodeInstance,
    direction = 'outgoing' /* filter connection array to match outgoing connections only*/,
    destinationNodeType,
    graphInstance = this,
  }: {
    direction: 'outgoing' | 'incoming',
  }) {
    // filter connection of traversal node type
    let concereteCache = graphInstance[Entity.reference.getInstanceOf](Cache)
    let connectionArray = concereteCache[Cache.reference.key.getter](false, 'connection')
    const isNodeType = nodeInstance => Boolean(nodeInstance.type.includes(destinationNodeType))
    let isSourceNode = sourceConnection => Boolean(sourceConnection == nodeInstance)
    connectionArray = connectionArray.filter(connection => {
      let sourceNode = connection.source |> Array.isArray ? connection.source[0] : connection.source
      let destinationNode = connection.destination |> Array.isArray ? connection.destination[0] : connection.destination
      return isSourceNode(sourceNode) && (destinationNodeType ? isNodeType(destinationNode) : true)
    })
    return connectionArray
  },

  /** Graph traversal - Controls the traversing the nodes in the graph. Which includes processing of data items and aggregation of results.
   * Dynamic implementation - not restricted to specific initialization algorithm, rather choosen from setting of each node in the traversed graph.
   */
  @proxifyMethodDecorator(async (target, thisArg, argumentsList, targetClass, methodName) => {
    // create node instance, in case string key is passed as parameter.
    let { nodeInstance, graphInstance = thisArg } = argumentsList[0]
    if (typeof nodeInstance === 'string') {
      nodeInstance = await graphInstance.addNodeByKey({ key: nodeInstance }) // retrieve node data on-demand in case not cached.
      argumentsList[0].nodeInstance = nodeInstance
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
          nodeType: 'traversalStep',
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
      { parentTraversalArg } = argumentsList[1],
      concreteTraversalInstance = graphInstance[Entity.reference.getInstanceOf](GraphTraversal),
      concreteTraversal = concreteTraversalInstance[ImplementationManagement.reference.key.getter]()

    // TODO: refactor parameter hirerchy merging to be more readable.
    // implementation keys of node instance own config parameters and of default values set in function scope
    let implementationKey =
      {
        processData: nodeInstance.processDataImplementation || 'returnDataItemKey',
        traverseNode: nodeInstance.traverseNodeImplementation || 'chronological',
        aggregator: 'AggregatorArray',
        traversalInterception: 'processThenTraverse',
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
      dataProcess: concreteTraversal.processData[implementationKey.processData],
      traverseNode: concreteTraversal.traverseNode[implementationKey.traverseNode],
      traversalInterception: concreteTraversal.traversalInterception[implementationKey.traversalInterception],
      aggregator: concreteTraversal.aggregator[implementationKey.aggregator],
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
      nodeType: 'traversalStep',
    } = {},
    { parentTraversalArg } = {},
  ) {
    let dataProcessCallback = nextProcessData => graphInstance::graphInstance.dataProcess({ nodeInstance, nextProcessData, dataProcessImplementation: nodeInstance::implementation.dataProcess })

    let proxyify = implementation.traversalInterception
      ? target => graphInstance::implementation.traversalInterception({ targetFunction: target, aggregator, dataProcessCallback })
      : // in case no implementation exists for intercepting traversal, use an empty proxy.
        target => new Proxy(target, {})

    // Core functionality required is to traverse nodes, any additional is added through intercepting the traversal.
    nodeIteratorFeed ||= graphInstance::graphInstance.traverseNode({ nodeInstance, graphInstance, nodeType, traverseNodeImplementation: nodeInstance::implementation.traverseNode })
    let result = await (graphInstance::graphInstance.recursiveIteration |> proxyify)({ nodeIteratorFeed, nodeInstance, traversalDepth, eventEmitter, parentTraversalArg: arguments })

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
   * Controls execution of node traversals & Hands over control to implementation:
   *  1. Accepts new nodes from implementing function.
   *  2. returns back to the implementing function a promise, handing control of flow and arragement of running traversals.
   */
  recursiveIteration: async function*({
    nodeIteratorFeed /**Feeding iterator that will accept node parameters for traversals*/,
    graphInstance = this,
    recursiveCallback = graphInstance::graphInstance.traverse,
    traversalDepth,
    eventEmitter,
    parentTraversalArg,
  }: {
    eventEmitter: Event,
  }) {
    let eventEmitterCallback = (...args) => eventEmitter.emit('nodeTraversalCompleted', ...args)
    traversalDepth += 1 // increase traversal depth
    let g = {}
    g.result = await nodeIteratorFeed.next({ eventEmitterCallback: eventEmitterCallback }) // initial execution
    while (!g.result.done) {
      let nextNodeConfig = g.result.value
      // 🔁 recursion call
      let promise = recursiveCallback(Object.assign(nextNodeConfig, { traversalDepth }), { parentTraversalArg })
      g.result = await nodeIteratorFeed.next({ promise })
    }
    // last node iterator feed should be an array of resolved node promises that will be forwarded through this function
    let returnedResultArray = g.result.value || []
    yield* returnedResultArray // forward resolved results
  },
  traverseNode: async function*({ nodeInstance, graphInstance, nodeType, traverseNodeImplementation /** Controls the iteration over nodes and execution arrangement. */ }) {
    let { eventEmitterCallback: emit } = function.sent

    let connection = graphInstance.getConnection({ nodeInstance, direction: 'outgoing', destinationNodeType: nodeType }),
      port = graphInstance.getConnection({ nodeInstance, direction: 'outgoing', destinationNodeType: 'port' }).map(connection => connection.destination)
    if (connection.length == 0) return

    let nodeIteratorFeed = port
      ? // iterate over ports
        await graphInstance.iteratePort({ nodePortArray: port, nodeConnectionArray: connection, iterateConnectionCallback: graphInstance.iterateConnection })
      : // Iterate over connection
        await graphInstance.iterateConnection({ nodeConnectionArray: connection })

    // pass iterator to implementation and propagate back (through return statement) the results of the node promises after completion
    return yield* traverseNodeImplementation({ nodeIteratorFeed, emit })
  },
  /**
   * Loops through node connection to traverse the connected nodes' graphs
   * @param {*} nodeConnectionArray - array of connection for the particular node
   */
  iterateConnection: async function*({ nodeConnectionArray } = {}) {
    const controlArg = function.sent

    // sort connection array
    nodeConnectionArray.sort((former, latter) => former.order - latter.order) // using `order` property

    for (let nodeConnection of nodeConnectionArray) {
      let destinationNode = nodeConnection.destination |> Array.isArray ? nodeConnection.destination[0] : nodeConnection.destination
      yield { nodeKey: destinationNode } // iteration implementaiton
    }
  },
  /**
   * @description loops through all the `node ports` and initializes each one to execute the `node connections` specific for it.
   * TODO: add ability to pass traversal configuration to a group of connections. Each port holds traversal cofigs that should affect all connection connected to this port.
   */
  iteratePort: async function*({ nodePortArray, nodeConnectionArray, iterateConnectionCallback }) {
    // filter port array to match outgoing ports only
    nodePortArray = nodePortArray.filter(item => item.direction == 'output')

    // sort array
    const sortAccordingToOrder = (former, latter) => former.order - latter.order // using `order` property
    nodePortArray.sort(sortAccordingToOrder)
    for (let nodePort of nodePortArray) {
      // filter connection to match the current port
      let currentPortConnectionArray = nodeConnectionArray.filter(connection => connection.source[1]?.key == nodePort.key)
      yield* await iterateConnectionCallback({ nodeConnectionArray: currentPortConnectionArray, implementationType: nodePort.traverseNodeImplementation })
    }
  },
  dataProcess: async function({ nodeInstance, nextProcessData, dataProcessImplementation }) {
    // get node dataItem - either dataItem instance object or regular object
    let dataItem
    // if (nodeInstance.tag?.dataItemType == 'reference') {
    //   // creating data item instance, load dataItem by reference i.e. using `key`
    //   dataItem = await concreteTraversal.initializeDataItem({ dataItem: nodeInstance.dataItem })
    // } else
    dataItem = nodeInstance // default dataItem by property
    // Execute node dataItem
    return dataItem ? await nodeInstance::dataProcessImplementation({ dataItem }) : null
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
  [Reference.key.constructor]({
    // Concerete behaviors / implementaions
    cache,
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
    cache ||= new Cache.clientInterface({ groupKeyArray: ['node', 'connection'] })

    let instance = callerClass::Constructable[Constructable.reference.constructor.functionality].switch({ implementationKey: Entity.reference.key.concereteBehavior })({
      concreteBehaviorList: [...concreteBehaviorList, cache, database, traversal],
      data,
    })

    // configure Graph element classes
    instance.configuredNode = Node.clientInterface({ parameter: [{ concreteBehaviorList: [] }] })
    instance.configuredConnection = Connection.clientInterface({ parameter: [{ concereteBehavior: [] }] })

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
