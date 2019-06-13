process.env['SZN_DEBUG'] = true
import assert from 'assert'
import { assert as chaiAssertion } from 'chai'
import util from 'util'

import { Entity } from '@dependency/entity'
import { GraphElement } from '../source/constructable/GraphElement.class.js'
import { GraphTraversal } from '../source/constructable/GraphTraversal.class.js'
import { Database } from '../source/constructable/Database.class.js'
import { Cache } from '../source/constructable/Cache.class.js'
import { Context } from '../source/constructable/Context.class.js'
import { databaseModelAdapterFunction } from '../source/implementationPlugin/databaseModelAdapter/memoryModelAdapter.js'

import * as graphData from './asset/graphData' // load sample data
const fixture = { traversalResult: ['dataItem-key-1'] }

/**
 * Graph will contain the prototype chain to install on the instances (previously 'classes hierarchy connections`)
 * 1. configuredConstructable1 = Graph(<plugins>)
 * 2. configuredConstructable2 = configuredConstructable1(<context>)
 * 3. new configuredConstructable2(<instance data>) // creates instance
 * 4. traverse graph: e.g. instance.traverseGraph()
 */
suite('Graph traversal scenarios - Traversing graphs with different implementations', () => {
  suite('configured graph with loading plugins and database adapter', async () => {
    // let concreteGraphTraversalBehavior = new GraphTraversal.clientInterface({
    //   pluginList: {
    //     graphTraversalImplementation: {
    //       aggregateIntoArray() {
    //         return require('./implementation/graphTraversalImplementation/debugImplementation.js').aggregateIntoArray
    //       },
    //       condition() {
    //         // return require('./implementation/graphTraversalImplementation/condition.js').condition
    //       },
    //       middleware() {
    //         // return require('./implementation/graphTraversalImplementation/middleware.js').middleware
    //       },
    //       schema() {
    //         // return require('./implementation/graphTraversalImplementation/schema.js').schema
    //       },
    //       shellscript() {
    //         // return require('./implementation/graphTraversalImplementation/shellscript.js').shellscript
    //       },
    //       template() {
    //         // return require('./implementation/graphTraversalImplementation/template.js').template
    //       },
    //     },
    //   },
    //   defaultPlugin: {
    //     graphTraversalImplementation: 'aggregateIntoArray',
    //   },
    // })
    let contextInstance = new Context.clientInterface({ someString: 'hello' })
    let concereteCacheBehavior = new Cache.clientInterface()
    let concreteDatabaseBehavior = new Database.clientInterface({
      pluginList: {
        databaseModelAdapter: {
          // database simple memory adapter
          memoryModelAdapter: databaseModelAdapterFunction({ nodeArray: graphData.nodeDataItem.nodeArray }),
          memoryModelAdapter2: databaseModelAdapterFunction({
            nodeArray: graphData.nodeDataItemAsReference.nodeArray,
            dataItemArray: graphData.nodeDataItemAsReference.dataItemArray,
          }),
        },
      },
      defaultPlugin: {
        databaseModelAdapter: 'memoryModelAdapter',
      },
    })

    // let key = 'x',
    //   instance
    // instance = Cache::Constructable[Constructable.reference.initialize.functionality].switch({ implementationKey: Entity.reference.key.checkCache })({ instanceCache, key })
    // if (!instance) {
    //   instance = GraphElement::Constructable[Constructable.reference.constructor.functionality].switch({ implementationKey: Entity.reference.key.mergeDataToInstance })({ data: { key: key } })
    //   Database::Constructable[Constructable.reference.initialize.functionality].switch({ implementationKey: Entity.reference.key.db })({ instanceDatabase, targetInstance: instance })
    // }

    let configuredGraph = GraphElement.clientInterface({
      parameter: [
        {
          concreteBehaviorList: [concereteCacheBehavior, concreteDatabaseBehavior, contextInstance],
        },
      ],
    })

    test('Should traverse graph successfully', async () => {
      let nodeInstance = await new configuredGraph({ key: 'node-key-1' })
      // console.log(concreteDatabaseBehavior)
      // console.log(concreteGraphTraversalBehavior)
      // console.log(concereteCacheBehavior)
      // console.log(contextInstance)
      // console.log(configuredGraph)
      debugger
      console.log(nodeInstance)
      // traverse using implemenation `aggregateArray` which will return an array of data items of the nodes.
      let resultArray = nodeInstance.traverseGraph()
      chaiAssertion.deepEqual(resultArray, fixture.traversalResult)
    })
  })
})
