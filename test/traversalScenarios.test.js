process.env['SZN_DEBUG'] = true
import assert from 'assert'
import { assert as chaiAssertion } from 'chai'
import util from 'util'
import path from 'path'
import filesystem from 'fs'
const boltProtocolDriver = require('neo4j-driver').v1

import { Entity } from '@dependency/entity'
import * as Graph from '../source/constructable/Graph'
import * as Traversal from '../source/constructable/Traversal.class.js'
import * as Database from '../source/constructable/Database.class.js'
import * as Context from '../source/constructable/Context.class.js'
import * as schemeReference from '../source/dataModel/graphSchemeReference.js'
import * as implementation from '@dependency/graphTraversal-implementation'
import graphData from './asset/graph.json' // load sample data
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

let concreteGraphTraversalBehavior = new Traversal.clientInterface({
  implementationList: {
    default: {
      portNode: implementation.traversal.portNode, // Port
      traversalInterception: implementation.traversal.traversalInterception, // Stage
      aggregator: implementation.traversal.aggregator,
      processNode: implementation.traversal.processNode, // Process
    },
  },
  defaultImplementation: 'default',
})

let contextInstance = new Context.clientInterface({
  implementationKey: {
    processNode: 'returnDataItemKey',
    portNode: 'propagationControl',
    aggregator: 'AggregatorArray',
    traversalInterception: 'processThenTraverse',
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

  suite('Reroute node with Extend, Insert, Reference edges:', () => {
    const fixture = ['referencedTarget-0', 'insert-before', 'dataItem-1', 'insert-after']
    let graph = new configuredGraph.clientInterface({})
    test('Should traverse graph successfully', async () => {
      await graph.load({ graphData })
      let result = await graph.traverse({ nodeKey: '968f644a-ac89-11e9-a2a3-2a2ae2dbcce4', implementationKey: {} })
      chaiAssertion.deepEqual(result, fixture)
    })
  })

  suite('Configure edge with Configuration node - evaluation & traversal implementations', () => {
    const fixture = ['include-0', 'include-1', 'include-2']
    let graph = new configuredGraph.clientInterface({})
    test('Should traverse graph successfully', async () => {
      await graph.load({ graphData })
      let result = await graph.traverse({ nodeKey: '9160338f-6990-4957-9506-deebafdb6e29', implementationKey: { processNode: 'returnDataItemKey' } })
      chaiAssertion.deepEqual(result, fixture)
    })
  })

  suite('Fork edge & Port node - propgation implementations: parallel, chronological, etc.', () => {
    //
    const fixture = ['dataItem-0', 'parallel-1', 'parallel-2', 'parallel-3', 'parallel-4', 'chronological-1', 'chronological-2', 'chronological-3', 'race-firstSetteled']
    let graph = new configuredGraph.clientInterface({})
    test('Should traverse graph successfully ', async () => {
      await graph.load({ graphData })
      let result = await graph.traverse({ nodeKey: '5ab7f475-f5a1-4a23-bd9d-161e26e1aef6', implementationKey: {} })
      chaiAssertion.deepEqual(result, fixture)
    })
  })

  suite('Execute edge with Process node & reference context.', () => {
    const fixture = []
    contextInstance[Context.$.key.setter]({
      // modify context to include the filesystem stat information of the file to be referenced during the graph traversal.
      fileContext: { shellscript: path.join(__dirname, './asset/shellscript.sh') },
    })
    let graph = new configuredGraph.clientInterface({})
    test('Should traverse graph successfully - during which a shell script executed', async () => {
      await graph.load({ graphData })
      let result = await graph.traverse({ nodeKey: '28a486af-1c27-4183-8953-c40742a68ab0', implementationKey: {} })
      chaiAssertion.deepEqual(result, fixture)
    })
  })
})
