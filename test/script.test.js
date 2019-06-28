process.env['SZN_DEBUG'] = true
import assert from 'assert'
import { assert as chaiAssertion } from 'chai'
import util from 'util'

import { Entity } from '@dependency/entity'
import { Graph } from '../source/constructable/Graph.class.js'
import { GraphTraversal } from '../source/constructable/GraphTraversal.class.js'
import { Database } from '../source/constructable/Database.class.js'
import { Cache } from '../source/constructable/Cache.class.js'
import { Context } from '../source/constructable/Context.class.js'

import { databaseModelAdapterFunction } from '../source/implementationPlugin/databaseModelAdapter/memoryModelAdapter.js'
import { implementation as debugImplementation } from '../source/implementationPlugin/graphTraversalImplementation/debugImplementation.js'
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
    let concreteGraphTraversalBehavior = new GraphTraversal.clientInterface({
      implementationList: {
        debugImplementation,
        condition() {
          // return require('./implementation/graphTraversalImplementation/condition.js').condition
        },
        middleware() {
          // return require('./implementation/graphTraversalImplementation/middleware.js').middleware
        },
        schema() {
          // return require('./implementation/graphTraversalImplementation/schema.js').schema
        },
        shellscript() {
          // return require('./implementation/graphTraversalImplementation/shellscript.js').shellscript
        },
        template() {
          // return require('./implementation/graphTraversalImplementation/template.js').template
        },
      },
      defaultImplementation: 'debugImplementation',
    })
    let contextInstance = new Context.clientInterface({
      implementationKey: {
        traverseNode: 'chronological',
      },
    })
    let concreteDatabaseBehavior = new Database.clientInterface({
      implementationList: {
        // database simple memory adapter
        memoryModelAdapter: databaseModelAdapterFunction({ nodeArray: graphData.nodeConnectionParallelTraversal.nodeArray }),
        memoryModelAdapter2: databaseModelAdapterFunction({
          nodeArray: graphData.nodeDataItemAsReference.nodeArray,
          dataItemArray: graphData.nodeDataItemAsReference.dataItemArray,
        }),
      },
      defaultImplementation: 'memoryModelAdapter',
    })

    let configuredGraph = Graph.clientInterface({
      parameter: [
        {
          database: concreteDatabaseBehavior,
          traversal: concreteGraphTraversalBehavior,
          concreteBehaviorList: [contextInstance],
          data: {},
        },
      ],
    })

    test('Should traverse graph successfully', async () => {
      let graph = new configuredGraph({})
      await graph.loadGraphIntoMemoryFromDatabase()
      let result = await graph.traverse({ nodeInstance: 'node-key-0', implementationKey: { traverseNode: 'allPromise' } })
      console.log(result)
      // graph.count().node |> console.log
      // traverse using implemenation `aggregateArray` which will return an array of data items of the nodes.
      // let resultArray = graph.traverseGraph()
      // chaiAssertion.deepEqual(resultArray, fixture.traversalResult)
    })
  })
})
