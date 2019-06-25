import assert from 'assert'
import { Entity, Constructable, symbol } from '@dependency/entity'
import { Node } from './Node.class.js'
import { DataItem } from './DataItem.class.js'
import { GraphTraversal } from './GraphTraversal.class.js'
import { Database } from './Database.class.js'
import { Cache } from './Cache.class.js'
import { ImplementationManagement } from './ImplementationManagement.class.js'
import { proxifyMethodDecorator } from '../utility/proxifyMethodDecorator.js'
import { mergeDefaultParameter } from '../utility/mergeDefaultParameter.js'

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
    let entryData = concereteDatabase[ImplementationManagement.reference.key.getter]().getAll() || []
    for (let entry of entryData) {
      graphInstance.addNode({ nodeInstance: entry })
    }
    return entryData
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
    nodeInstance = concereteCache[Cache.reference.key.getter](key)
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
    let cachedNode = concereteCache[Cache.reference.key.getter](nodeInstance.key)
    if (!cachedNode) {
      // Note: `nodeInstance instanceof Node` will not work as Entity module creates Objects rather than callable Function instances. Could consider changing this behavior to allow native constructor checking to work.
      if (!(nodeInstance.constructor == Node)) nodeInstance = new graphInstance.configuredNode(nodeInstance)
      concereteCache[Cache.reference.key.setter](nodeInstance.key, nodeInstance)
    } else {
      // retrieve the cached entry
      nodeInstance = cachedNode
    }
    return nodeInstance
  },
  addConnection() {},
  // count number of cached elements
  count({ graphInstance = this } = {}) {
    let concereteCache = graphInstance[Entity.reference.getInstanceOf](Cache)
    return {
      node: concereteCache[Cache.reference.key.getLength](),
    }
  },

  /** Graph traversal - Controls the traversing the nodes in the graph. Which includes processing of data items and aggregation of results.
   * Dynamic implementation - not restricted to specific initialization algorithm, rather choosen from setting of each node in the traversed graph.
   */
  @proxifyMethodDecorator(async (target, thisArg, argumentsList, targetClass, methodName) => {
    // create node instance, in case string key is passed as parameter.
    let { nodeInstance, graphInstance = thisArg } = argumentsList[0]
    let concreteTraversal = graphInstance[Entity.reference.getInstanceOf](GraphTraversal)
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
          // implementationType: thisArg.sharedContext.traversalImplementationType,
          entrypointLevel: true,
          graphInstance: thisArg,
          additionalChildNode: [], // child nodes to add to the current node's children. These are added indirectly to a node without changing the node's children itself, as a way to extend current nodes.
          nodeConnectionKey: null, // pathPointerKey
        },
      ],
    })
    return Reflect.apply(target, thisArg, argumentsList)
  })
  @proxifyMethodDecorator((target, thisArg, argumentsList, targetClass, methodName) => {
    //? Aggregator implementation
    // runImplementation - Read traversal implementation configuration from Node instance and run implementation run implementaion
    // let { implementationType, nodeInstance } = argumentsList[0]
    // if (!implementationType && nodeInstance.tag) implementationType = nodeInstance.tag.traversalImplementationType

    // if (implementationType) {
    //   let controller = thisArg.contextInstance
    //   return controller.interceptMethod({ thisArg, implementationType, nodeInstance, argumentsList, methodName })
    // } else {
    //   console.error('• no implementation selected for ' + nodeInstance.key)
    //   return Reflect.apply(target, thisArg, argumentsList)
    // }

    return Reflect.apply(target, thisArg, argumentsList)
  })
  async traverse({ implementationType, nodeInstance, additionalChildNode, nodeConnectionKey, graphInstance, entrypointLevel }: { nodeInstance: String | Node } = {}) {
    let concreteTraversal = graphInstance[Entity.reference.getInstanceOf](GraphTraversal),
      traversalImplementation = concreteTraversal[ImplementationManagement.reference.key.getter]()
    let aggregator = new traversalImplementation.aggregator()

    let dataProcessCallback = nextProcessData =>
      graphInstance::graphInstance.dataProcess({ nodeInstance, nextProcessData, dataProcessImplementation: nodeInstance::traversalImplementation.processData })

    let implementationIterator = traversalImplementation.traverseGraph({ nodeInstance, graphInstance, aggregatorCallbackMerge: nextResult => (aggregator = aggregator.merge(nextResult)) })
    let proxied = traversalImplementation.graphTraversalInterception({
      recursiveIterationCallback: graphInstance::graphInstance.recursiveIteration,
      dataProcessCallback,
      getNextProcessData: () => aggregator.value,
      aggregatorCallbackAdd: nodeResult => aggregator.add(nodeResult),
    })
    await proxied({ implementationIterator, nodeInstance })

    // check if top level call and not an initiated nested recursive call.
    return entrypointLevel ? aggregator.value : aggregator
  },

  /**
   * Controls execution of node traversals
   * & Hands over control to implementation by:
   *  • Accepts new nodes from implementing function.
   *  • returns back to the implementing function a promise, handing control of flow and arragement of running traversals.
   */
  recursiveIteration: async function({ implementationIterator, graphInstance = this }) {
    let g = {}
    g.result = await implementationIterator.next() // initial execution
    while (!g.result.done) {
      let nextNodeConfig = g.result.value
      // 🔁 recursion call
      let promise = graphInstance.traverse(Object.assign(nextNodeConfig, { entrypointLevel: false }))
      g.result = await implementationIterator.next({ promise })
    }
  },
  dataProcess: async function({ nodeInstance, nextProcessData, dataProcessImplementation }) {
    // get node dataItem - either dataItem instance object or regular object
    let dataItem
    // if (nodeInstance.tag?.dataItemType == 'reference') {
    //   // creating data item instance, load dataItem by reference i.e. using `key`
    //   dataItem = await traversalImplementation.initializeDataItem({ dataItem: nodeInstance.dataItem })
    // } else
    dataItem = nodeInstance.dataItem // default dataItem by property
    // Execute node dataItem
    return dataItem ? await nodeInstance::dataProcessImplementation({ dataItem, executionType: nodeInstance.tag?.executionType }) : null
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
  }: {
    cache: Cache,
    database: Database,
    traversal: GraphTraversal,
    concereteBehavior: List,
  }) {
    assert(database, '• Database concrete behavior must be passed.')
    assert(traversal, '• traversal concrete behavior must be passed.')
    cache ||= new Cache.clientInterface()

    let instance = callerClass::Constructable[Constructable.reference.constructor.functionality].switch({ implementationKey: Entity.reference.key.concereteBehavior })({
      concreteBehaviorList: [...concreteBehaviorList, cache, database, traversal],
      data,
    })

    // configure Graph element classes
    instance.configuredNode = Node.clientInterface({ parameter: [{ concreteBehaviorList: [] }] })
    instance.configuredDataItem = DataItem.clientInterface({ parameter: [{ concreteBehaviorList: [] }] })

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
