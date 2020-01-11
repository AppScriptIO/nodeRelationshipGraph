import { MultipleDelegation } from '@dependency/multiplePrototypeDelegation'
import { Entity, Constructable } from '@dependency/entity'
import * as Traversal from '../Traversal.class.js'
import * as Database from '../Database.class.js'
import * as Context from '../Context.class.js'
import * as ImplementationManagement from '../ImplementationManagement.class.js'

import * as implementation from '@dependency/graphTraversal-implementation'

/** Conceptual Graph - encapsulates different elements of used to work with a graph.
 * Graph (GraphTraverser) Class holds and manages graph elements and traversal algorithm implementations:
 *  - Cache: on-demand retrived nodes from DB are cached.
 *  - Database: get graph data and load it into memory.
 *  - Traversal: implementation for the traversal algorithm.
 *  - Context: shared data accessible between traversals.
 * The Graph instance should have an ability to set/change strategies/implementations on runtime and ability to use multiple registered implementations.
 */
const { class: Class, reference: $ } = new Entity.clientInterface.constructableInstance({ label: 'Graph' })

Object.assign($, {
  key: {},
})

Class::Class[$.prototypeDelegation.getter](Entity.$.key.stateInstance).instancePrototype |> (prototype => Object.assign(prototype, require('./prototype.js')))

Class::Class[$.prototypeDelegation.getter](Constructable.$.key.constructableInstance).instancePrototype
  |> (prototype => {
    prototype::prototype[Entity.$.initialize.setter]({
      [Entity.$.key.concereteBehavior]({ targetInstance }, { concereteBehaviorList } = {}) {},
    })

    prototype::prototype[Entity.$.constructor.setter]({
      /**
     * Graph will contain the prototype chain to install on the instances (previously 'classes hierarchy connections`)
     * 1. configuredConstructable1 = Graph(<plugins>)
     * 2. configuredConstructable2 = configuredConstructable1(<context>)
     * 3. new configuredConstructable2(<instance data>) // creates instance
     * 4. traverse graph: e.g. instance.traverseGraph()
     * 
     * Usage: 
     * - way to pass properties to the graphInstance itself, instead of the context instance:
         let graph = new configuredGraph({ data: { propertyOnGraphInstance: 'value' } })
         console.log(graph.propertyOnGraphInstance)
    */
      /* TODO: document the way to combine contexts and add additional data to the context during graph instance creation, and how multiple inherted conetxts are resolved or modified.
        i.e. define a better way to extend an existing configuredGraph with another contextes that extend existing - `configuredGraph = configuredGraph({ concreteBehaviorList: [additionalContext] })  
      */
      [Entity.$.key.stateInstance](
        {},
        {
          // Concerete behaviors / implementaions
          // cache,
          database, // database concrete behavior
          traversal, // traversal concrete behavior
          // additional behaviors
          concreteBehaviorList = [],
          data, // data to be merged into the instance (i.e. graphInstance.propety)
          callerClass = this,
          mode = 'applicationInMemory' || 'databaseInMemory',
        }: {
          cache: Cache,
          database: Database,
          traversal: Traversal,
          concreteBehaviorList: List,
        } = {},
      ) {
        database ||= new Database.clientInterface({
          implementationList: {
            boltCypher: implementation.database.boltCypherModelAdapterFunction,
          },
          defaultImplementation: 'boltCypher',
        })

        traversal ||= new Traversal.clientInterface({
          implementationList: {
            default: {
              traversalInterception: implementation.traversal.traversalInterception, // Stage
              aggregator: implementation.traversal.aggregator,
              processNode: implementation.traversal.processNode, // Process
              portNode: implementation.traversal.portNode, // Port
            },
          },
          defaultImplementation: 'default',
        })

        let instance = callerClass::callerClass[Entity.$.constructor.switch](Entity.$.key.concereteBehavior)(
          {}, // options
          {
            concreteBehaviorList: [...concreteBehaviorList, database, traversal],
          },
        )

        // expose functionality for direct simplified access:

        let concereteDatabase = instance[Entity.$.getInstanceOf](Database.class)
        instance.database = concereteDatabase[Database.$.key.getter]()

        let concreteTraversal = instance[Entity.$.getInstanceOf](Traversal.class)
        instance.traversal = concreteTraversal[ImplementationManagement.$.key.getter]()

        /*
        - Retrieve all context instances in the delegation chain.
        - Provide interface for accessing properties from these context instances.
        Note: Assums that prototype chain of the graph instance will not be changed after creation of the instance. Which will make algotrithm lighter and simplified, and prevent repeated lookups.
        */
        let instanceList = instance[Entity.$.getInstanceOf](Context.class, { recursive: true })
        let { proxy } = new MultipleDelegation(instanceList) // create a proxy to for looking up properties of all context instances
        instance.context = proxy

        return instance
      },
    })
  })

const clientInterface = Class::Class[Entity.$.clientInterface.switch](Entity.$.key.stateInstance)({ constructorImplementation: Entity.$.key.stateInstance })

export { Class as class, $, clientInterface }
