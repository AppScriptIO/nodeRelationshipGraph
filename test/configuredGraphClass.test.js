process.env['SZN_DEBUG'] = true
import assert from 'assert'
import { assert as chaiAssertion } from 'chai'
import util from 'util'
import * as multiplePrototypeDelegation from '@dependency/multiplePrototypeDelegation'
import { Entity } from '@dependency/entity'
import * as Graph from '../source/constructable/Graph'
import * as Traverser from '../source/constructable/Traverser'
import * as Database from '../source/constructable/Database'
import * as Context from '../source/constructable/Context.class.js'
import * as schemeReference from '../source/dataModel/graphSchemeReference.js'
import * as implementation from '@dependency/graphTraversal-implementation'

setup(async () => {})

suite('Configure Graph class', () => {
  let contextInstance1 = new Context.clientInterface({
      data: { key1: 'key1' },
    }),
    contextInstance2 = new Context.clientInterface({
      data: { key2: 'key2' },
    })

  let concreteDatabaseBehavior = new Database.clientInterface({
    implementationList: {
      boltCypher: implementation.database.boltCypherModelAdapterFunction({}),
    },
    defaultImplementation: 'boltCypher',
  })

  let configuredTraverser = Traverser.clientInterface({
    parameter: [
      {
        implementationList: {
          default: {
            portNode: implementation.traversal.portNode, // Port
            traversalInterception: implementation.traversal.traversalInterception, // Stage
            aggregator: implementation.traversal.aggregator,
            processNode: implementation.traversal.processNode, // Process
          },
        },
        defaultImplementation: 'default',
      },
    ],
  })

  suite('Configured graph with loading plugins and database adapter', async () => {
    let configuredGraph = Graph.clientInterface({
      parameter: [
        {
          database: concreteDatabaseBehavior,
          configuredTraverser: configuredTraverser,
          concreteBehaviorList: [contextInstance1],
        },
      ],
    })

    test('traverser & database  instance - Should set implementation lists', async () => {
      let graph = new configuredGraph.clientInterface({})
      let traverser = new graph.configuredTraverser.clientInterface({
        concreteBehaviorList: [contextInstance1, contextInstance2],
      })

      assert(Object.keys(traverser[Traverser.$.key.list]).length > 0, `• Implementation list not set correctly on traverser instance.`)
      assert(Object.keys(concreteDatabaseBehavior[Database.$.key.list]).length > 0, `• Implementation list not set correctly on database instance.`)
    })

    test('graph instance - Should inherit implementation classes', async () => {
      let graph = new configuredGraph.clientInterface({})
      let multiplePrototypeProxy = Object.getPrototypeOf(graph)
      let multiplePrototypeArray = multiplePrototypeProxy[multiplePrototypeDelegation.$.list]

      chaiAssertion.isTrue([contextInstance1, concreteDatabaseBehavior].every(behavior => multiplePrototypeArray.includes(behavior)))
    })

    test('graph instance - Should merge implementations of multiple arguments successfully', async () => {
      let graph = new configuredGraph.clientInterface({
        // pass additional arguments to trigger merging algorithm of arguments.
        concreteBehaviorList: [contextInstance2],
      })
      let multiplePrototypeProxy = Object.getPrototypeOf(graph)
      let multiplePrototypeArray = multiplePrototypeProxy[multiplePrototypeDelegation.$.list]
      chaiAssertion.isTrue([contextInstance1, contextInstance2, concreteDatabaseBehavior].every(behavior => multiplePrototypeArray.includes(behavior)))
    })

    test('traverser instance - Should inherit context instances', async () => {
      let graph = new configuredGraph.clientInterface({})
      let traverser = new graph.configuredTraverser.clientInterface({
        concreteBehaviorList: [contextInstance1, contextInstance2],
      })
      let multiplePrototypeProxy = Object.getPrototypeOf(traverser)
      let multiplePrototypeArray = multiplePrototypeProxy[multiplePrototypeDelegation.$.list]

      chaiAssertion.isTrue([contextInstance1, contextInstance2].every(behavior => multiplePrototypeArray.includes(behavior)))
    })
  })
})
