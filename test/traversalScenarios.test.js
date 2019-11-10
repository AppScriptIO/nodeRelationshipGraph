process.env['SZN_DEBUG'] = true
import assert from 'assert'
import { assert as chaiAssertion } from 'chai'
import util from 'util'
import path from 'path'
import filesystem from 'fs'
const boltProtocolDriver = require('neo4j-driver').v1

import { Entity } from '@dependency/entity'
import { Graph } from '../source/constructable/Graph'
import { GraphTraversal } from '../source/constructable/GraphTraversal.class.js'
import { Database } from '../source/constructable/Database.class.js'
import { Cache } from '../source/constructable/Cache.class.js'
import { Context } from '../source/constructable/Context.class.js'
import * as schemeReference from '../source/graphModel/graphSchemeReference.js'

import * as implementation from '@dependency/graphTraversal-implementation'
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
    redisModelAdapterFunction: implementation.database.redisModelAdapterFunction(),
    simpleMemoryModelAdapter: implementation.database.simpleMemoryModelAdapterFunction(),
    boltCypher: implementation.database.boltCypherModelAdapterFunction({ schemeReference }),
  },
  defaultImplementation: 'boltCypher',
})
let concreteGraphTraversalBehavior = new GraphTraversal.clientInterface({
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
    const fixture = [
      'dataItem-key-1',
      'dataItem-key-2',
      /*skipped* 'dataItem-key-3',*/
      'dataItem-key-4',
      'dataItem-key-5',
      'dataItem-key-6',
      'dataItem-key-7',
      /*skipped* 'dataItem-key-8',*/
      'dataItem-key-9',
    ]
    let graph = new configuredGraph({})
    test('Should traverse graph successfully ', async () => {
      await graph.load({ graphData })
      let result = await graph.traverse({ nodeKey: '9160338f-6990-4957-9506-deebafdb6e29', implementationKey: {} })
      chaiAssertion.deepEqual(result, fixture)
    })
  })

  suite('nodeConnectionParallelTraversal subgraph template:', () => {
    const fixture = ['dataItem-key-0', 'dataItem-key-3', 'dataItem-key-2', 'dataItem-key-4', 'dataItem-key-1']
    let graph = new configuredGraph({})
    test('Should traverse graph successfully', async () => {
      await graph.load({ graphData })
      let result = await graph.traverse({ nodeKey: 'd07188cb-d0d3-4d64-9308-3f38d817411b', implementationKey: {} })
      chaiAssertion.deepEqual(result, fixture)
    })
  })

  suite('nodePort subgraph template', () => {
    const fixture = ['dataItem-key-0', 'dataItem-key-2', 'dataItem-key-5', 'dataItem-key-1', 'dataItem-key-3']
    contextInstance[Context.reference.key.setter]({
      // modify context to include the filesystem stat information of the file to be referenced during the graph traversal.
      fileContext: { shellscript: path.join(__dirname, './asset/shellscript.sh') },
    })
    let graph = new configuredGraph({})
    test('Should traverse graph successfully', async () => {
      await graph.load({ graphData })
      let result = await graph.traverse({ nodeKey: '5ab7f475-f5a1-4a23-bd9d-161e26e1aef6', implementationKey: {} })
      chaiAssertion.deepEqual(result, fixture)
    })
  })

  suite('Extending nodePlacement subgraph template data:', () => {
    const fixture = ['dataItem-key-1', 'dataItem-key-3', 'dataItem-key-2', 'dataItem-key-4']
    let graph = new configuredGraph({})
    test('Should traverse graph successfully', async () => {
      await graph.load({ graphData })
      let result = await graph.traverse({ nodeKey: '968f644a-ac89-11e9-a2a3-2a2ae2dbcce4', implementationKey: {} })
      chaiAssertion.deepEqual(result, fixture)
    })
  })

  suite('CONFIGURE relationship:', () => {
    const fixture = ['stage-1'] // traverses graph and skips "stage-0"
    let graph = new configuredGraph({})
    test('Should traverse graph successfully', async () => {
      await graph.load({ graphData })
      let result = await graph.traverse({ nodeKey: 'aadfac41-66bf-4b78-a039-1e25480a2f50', implementationKey: { processData: 'returnDataItemKey' } })
      chaiAssertion.deepEqual(result, fixture)
    })
  })

  // TODO: Define node inheritance concept and implement it.
  // suite('nodeInheritance subgraph template data:', () => {})
})
