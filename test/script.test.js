process.env['SZN_DEBUG'] = true
import assert from 'assert'
import { assert as chaiAssertion } from 'chai'
import util from 'util'
const boltProtocolDriver = require('neo4j-driver').v1

import { Entity } from '@dependency/entity'
import { Graph } from '../source/constructable/Graph.class.js'
import { GraphTraversal } from '../source/constructable/GraphTraversal.class.js'
import { Database } from '../source/constructable/Database.class.js'
import { Cache } from '../source/constructable/Cache.class.js'
import { Context } from '../source/constructable/Context.class.js'

import { simpleMemoryModelAdapterFunction } from '../source/implementationPlugin/databaseModelAdapter/simpleMemoryModelAdapter.js'
import { memgraphModelAdapterFunction } from '../source/implementationPlugin/databaseModelAdapter/memgraphModelAdapter.js'
import { implementation as debugImplementation } from '../source/implementationPlugin/graphTraversalImplementation/debugImplementation.js'
import * as graphData from './asset/graphData' // load sample data
const fixture = { traversalResult: ['dataItem-key-1'] }

// Delete all nodes in the in-memory database
setup(async () => {
  const url = { protocol: 'bolt', hostname: 'localhost', port: 7687 },
    authentication = { username: 'neo4j', password: 'test' }
  const graphDBDriver = boltProtocolDriver.driver(`${url.protocol}://${url.hostname}:${url.port}`, boltProtocolDriver.auth.basic(authentication.username, authentication.password))
  let session = await graphDBDriver.session()
  let result = await session.run(`match (n) detach delete n`)
  session.close()
})

/**
 * Graph will contain the prototype chain to install on the instances (previously 'classes hierarchy connections`)
 * 1. configuredConstructable1 = Graph(<plugins>)
 * 2. configuredConstructable2 = configuredConstructable1(<context>)
 * 3. new configuredConstructable2(<instance data>) // creates instance
 * 4. traverse graph: e.g. instance.traverseGraph()
 */
suite('Graph traversal scenarios - Traversing graphs with different implementations', () => {
  suite('configured graph with loading plugins and database adapter', async () => {
    let concreteDatabaseBehavior = new Database.clientInterface({
      implementationList: {
        simpleMemoryModelAdapter: simpleMemoryModelAdapterFunction(),
        memgraphModelAdapter: memgraphModelAdapterFunction(),
      },
      defaultImplementation: 'memgraphModelAdapter',
    })
    let concreteGraphTraversalBehavior = new GraphTraversal.clientInterface({
      implementationList: { debugImplementation, condition: {}, middleware: {}, schema: {}, shellscript: {}, template: {} },
      defaultImplementation: 'debugImplementation',
    })
    let contextInstance = new Context.clientInterface({
      implementationKey: {
        // traverseNode: 'chronological',
      },
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
      await graph.loadGraphIntoMemory({ nodeEntryData: graphData.nodeConnectionParallelTraversal.node, connectionEntryData: graphData.nodeConnectionParallelTraversal.connection })
      let result = await graph.traverse({
        nodeKey: 'node-key-1',
        implementationKey: {
          // traverseNode: 'allPromise'
        },
      })
      console.log(result)
      // graph.count().node |> console.log
      // traverse using implemenation `aggregateArray` which will return an array of data items of the nodes.
      // let resultArray = graph.traverseGraph()
      // chaiAssertion.deepEqual(resultArray, fixture.traversalResult)
    })
  })
})
