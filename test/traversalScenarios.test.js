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
import { implementation as defaultImplementation } from '../source/implementationPlugin/graphTraversalImplementation/defaultImplementation.js'
import graphData from './asset/graphData.exported.json' // load sample data
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
  implementationList: { defaultImplementation },
  defaultImplementation: 'defaultImplementation',
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

  suite('nodeConnection subgraph template:', () => {
    const fixture = ['dataItem-key-1', 'dataItem-key-2', 'dataItem-key-4', 'dataItem-key-5', 'dataItem-key-6', 'dataItem-key-7', 'dataItem-key-9']
    let graph = new configuredGraph({})
    test('Should traverse graph successfully ', async () => {
      await graph.load({ graphData })
      let result = await graph.traverse({
        nodeKey: '9160338f-6990-4957-9506-deebafdb6e29',
        implementationKey: {
          // traverseNode: 'allPromise'
        },
      })
      chaiAssertion.deepEqual(result, fixture)
    })
  })

  suite('nodeConnectionParallelTraversal subgraph template:', () => {
    const fixture = ['dataItem-key-0', 'dataItem-key-3', 'dataItem-key-2', 'dataItem-key-4', 'dataItem-key-1']
    let graph = new configuredGraph({})
    test('Should traverse graph successfully', async () => {
      await graph.load({ graphData })
      let result = await graph.traverse({
        nodeKey: 'd07188cb-d0d3-4d64-9308-3f38d817411b',
        implementationKey: {
          // handlePropagation: 'allPromise'
        },
      })
      chaiAssertion.deepEqual(result, fixture)
    })
  })

  suite('nodePort subgraph template', () => {
    const fixture = ['dataItem-key-0', 'dataItem-key-2', 'dataItem-key-4', 'dataItem-key-5', 'dataItem-key-1', 'dataItem-key-3']
    let graph = new configuredGraph({})
    test('Should traverse graph successfully', async () => {
      await graph.load({ graphData })
      let result = await graph.traverse({
        nodeKey: '5ab7f475-f5a1-4a23-bd9d-161e26e1aef6',
        implementationKey: {
          // handlePropagation: 'allPromise'
        },
      })
      chaiAssertion.deepEqual(result, fixture)
    })
  })

  suite('nodePlacement subgraph template:', () => {
    const fixture = ['dataItem-key-1', 'dataItem-key-3', 'dataItem-key-2']
    let graph = new configuredGraph({})
    test('Should traverse graph successfully', async () => {
      await graph.load({ graphData })
      let result = await graph.traverse({
        nodeKey: 'f463dc81-c871-4293-8a67-0a85e6d82473',
        implementationKey: {
          // handlePropagation: 'allPromise'
        },
      })
      chaiAssertion.deepEqual(result, fixture)
    })
  })

  suite('Extending nodePlacement subgraph template data:', () => {
    const fixture = ['dataItem-key-1', 'dataItem-key-3', 'dataItem-key-2', 'dataItem-key-4']
    let graph = new configuredGraph({})
    test('Should traverse graph successfully', async () => {
      await graph.load({ graphData })
      let result = await graph.traverse({
        nodeKey: '968f644a-ac89-11e9-a2a3-2a2ae2dbcce4',
        implementationKey: {
          // handlePropagation: 'allPromise'
        },
      })
      chaiAssertion.deepEqual(result, fixture)
    })
  })

  // TODO: Define node inheritance concept and implement it.
  // suite('nodeInheritance subgraph template data:', () => {})
})
