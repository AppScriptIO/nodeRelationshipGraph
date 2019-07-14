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
import { boltCypherModelAdapterFunction } from '../source/implementationPlugin/databaseModelAdapter/boltCypherModelAdapter.js'
import { implementation as debugImplementation } from '../source/implementationPlugin/graphTraversalImplementation/debugImplementation.js'
import * as graphData from './asset/graphData' // load sample data
const fixture = { traversalResult: ['dataItem-key-1'] }

async function clearGraphData() {
  // Delete all nodes in the in-memory database
  const url = { protocol: 'bolt', hostname: 'localhost', port: 7687 },
    authentication = { username: 'neo4j', password: 'test' }
  const graphDBDriver = boltProtocolDriver.driver(`${url.protocol}://${url.hostname}:${url.port}`, boltProtocolDriver.auth.basic(authentication.username, authentication.password))
  let session = await graphDBDriver.session()
  let result = await session.run(`match (n) detach delete n`)
  session.close()
}

let concreteDatabaseBehavior = new Database.clientInterface({
  implementationList: {
    simpleMemoryModelAdapter: simpleMemoryModelAdapterFunction(),
    boltCypherModelAdapter: boltCypherModelAdapterFunction(),
  },
  defaultImplementation: 'boltCypherModelAdapter',
})
let concreteGraphTraversalBehavior = new GraphTraversal.clientInterface({
  // traverse using implemenation `aggregateArray` which will return an array of data items of the nodes.
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

suite('Graph traversal scenarios - Traversing graphs with different implementations', () => {
  setup(async () => await clearGraphData())

  suite('nodeDataItem graph data:', () => {
    const fixture = { 1: ['dataItem-key-1'], 2: ['dataItem-key-2'] }
    let graph = new configuredGraph({})
    test('Should traverse graph successfully ', async () => {
      await graph.loadGraphIntoMemory({ graphData: graphData.nodeDataItem })
      let result = await graph.traverse({
        nodeKey: 'node-key-1',
        implementationKey: {
          // traverseNode: 'allPromise'
        },
      })
      chaiAssertion.deepEqual(result, fixture[1])
    })
    test('Should traverse graph successfully', async () => {
      await graph.loadGraphIntoMemory({ graphData: graphData.nodeDataItem })
      let result = await graph.traverse({
        nodeKey: 'node-key-2',
        implementationKey: {
          // traverseNode: 'allPromise'
        },
      })
      chaiAssertion.deepEqual(result, fixture[2])
    })
  })

  suite('nodeConnection graph data:', () => {
    const fixture = ['dataItem-key-1', 'dataItem-key-2']
    let graph = new configuredGraph({})
    test('Should traverse graph successfully', async () => {
      await graph.loadGraphIntoMemory({ graphData: graphData.nodeConnection })
      let result = await graph.traverse({
        nodeKey: 'node-key-1',
        implementationKey: {
          // traverseNode: 'allPromise'
        },
      })
      chaiAssertion.deepEqual(result, fixture)
    })
  })

  suite('nodeConnectionParallelTraversal graph data:', () => {
    const fixture = ['dataItem-key-0', 'dataItem-key-3', 'dataItem-key-2', 'dataItem-key-4', 'dataItem-key-1']
    let graph = new configuredGraph({})
    test('Should traverse graph successfully', async () => {
      await graph.loadGraphIntoMemory({ graphData: graphData.nodeConnectionParallelTraversal })
      let result = await graph.traverse({
        nodeKey: 'node-key-0',
        implementationKey: {
          // traverseNode: 'allPromise'
        },
      })
      chaiAssertion.deepEqual(result, fixture)
    })
  })

  suite.only('nodePort graph data:', () => {
    const fixture = ['dataItem-key-0', false]
    let graph = new configuredGraph({})
    test('Should traverse graph successfully', async () => {
      await graph.loadGraphIntoMemory({ graphData: graphData.nodePort })
      let result = await graph.traverse({
        nodeKey: 'node-key-0',
        implementationKey: {
          // traverseNode: 'allPromise'
        },
      })
      chaiAssertion.deepEqual(result, fixture)
    })
  })
})
