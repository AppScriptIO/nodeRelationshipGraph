import assert from 'assert'
import { Entity, Constructable, symbol } from '@dependency/entity'
import { Node } from './Node.class.js'
import { DataItem } from './DataItem.class.js'
import { GraphTraversal } from './GraphTraversal.class.js'
import { Database } from './Database.class.js'
import { Cache } from './Cache.class.js'
import { ImplementationManagement } from './ImplementationManagement.class.js'
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
      let nodeInstance = new graphInstance.configuredNode(entry)
      graphInstance.addNode({ nodeInstance })
    }
    return entryData
  },
  // load node data on-demand from database
  async addNodeByKey({ key, graphInstance = this }) {
    let concereteDatabase = graphInstance[Entity.reference.getInstanceOf](Database),
      concereteCache = graphInstance[Entity.reference.getInstanceOf](Cache)

    let nodeInstance
    // retrieve from cache
    nodeInstance = concereteCache[Cache.reference.key.getter](key)
    // create node if doesn' exist
    if (!nodeInstance) {
      nodeInstance = new graphInstance.configuredNode({ key })
      let databaseEntry = await concereteDatabase[Database.reference.key.getter]().getByKey({ key })
      Object.assign(nodeInstance, databaseEntry)
      graphInstance.addNode({ nodeInstance })
    }
    return nodeInstance
  },
  addNode({ nodeInstance, graphInstance = this }) {
    let concereteCache = graphInstance[Entity.reference.getInstanceOf](Cache)
    assert(nodeInstance.key, '• Node instance must have a key property.')
    if (!concereteCache[Cache.reference.key.getter](nodeInstance.key)) concereteCache[Cache.reference.key.setter](nodeInstance.key, nodeInstance)
    return nodeInstance
  },
  addConnection() {},
  numberOfNode({ graphInstance = this } = {}) {
    let concereteCache = graphInstance[Entity.reference.getInstanceOf](Cache)
    return concereteCache[Cache.reference.key.getLength]()
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
  }) {
    assert(database, '• Database concrete behavior must be passed.')
    assert(traversal, '• traversal concrete behavior must be passed.')
    cache ||= new Cache.clientInterface()

    let instance = callerClass::Constructable[Constructable.reference.constructor.functionality].switch({ implementationKey: Entity.reference.key.concereteBehavior })({
      concreteBehaviorList: [...concreteBehaviorList, cache, database, traversal],
      data,
    })

    // configure Graph element classes
    instance.configuredNode = Node.clientInterface({ parameter: [{ concreteBehaviorList: [database] }] })
    instance.configuredDataItem = DataItem.clientInterface({ parameter: [{ concreteBehaviorList: [database] }] })

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
