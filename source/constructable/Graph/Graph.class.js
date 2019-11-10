import { Entity, Constructable, symbol } from '@dependency/entity'
import { Node } from './Node.class.js'
import { GraphTraversal } from '../GraphTraversal.class.js'
import { Connection } from '../Connection.class.js'
import { Database } from '../Database.class.js'
import { Cache } from '../Cache.class.js'
import { Context } from '../Context.class.js'
import { ImplementationManagement } from '../ImplementationManagement.class.js'
import * as entityPrototype from './prototype.js'
import * as implementation from '@dependency/graphTraversal-implementation'

/** Conceptual Graph
 * Graph Class holds and manages graph elements and traversal algorithm implementations:
 *  - Cache: on-demand retrived nodes from DB are cached.
 *  - Database: get graph data and load it into memory.
 *  - Traversal: implementation for the traversal algorithm.
 *  - Context: shared data accessible between traversals.
 * The Graph instance should have an ability to set/change strategies/implementations on runtime and ability to use multiple registered implementations.
 */
export const { class: Graph, reference: Reference, constructablePrototype: Prototype, entityPrototype: initialEntityPrototype } = new Entity.clientInterface({ description: 'Graph' })

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
Object.assign(initialEntityPrototype, entityPrototype)

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
    database, // database concrete behavior
    traversal, // traversal concrete behavior
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
    database ||= new Database.clientInterface({
      implementationList: {
        boltCypher: implementation.database.boltCypherModelAdapterFunction({}),
      },
      defaultImplementation: 'boltCypher',
    })
    traversal ||= new GraphTraversal.clientInterface({
      implementationList: {
        default: {
          traverseNode: implementation.traversal.traverseNode,
          handlePropagation: implementation.traversal.handlePropagation, // Port
          traversalInterception: implementation.traversal.traversalInterception, // Stage
          aggregator: implementation.traversal.aggregator,
          processData: implementation.traversal.processData, // Process
        },
      },
      defaultImplementation: 'default',
    })

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
    let context = instance[Entity.reference.getInstanceOf](Context)
    instance.context = context ? context[Context.reference.key.getter]() : {}

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
