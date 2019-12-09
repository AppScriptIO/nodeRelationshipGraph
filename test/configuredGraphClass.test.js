process.env['SZN_DEBUG'] = true
import assert from 'assert'
import { assert as chaiAssertion } from 'chai'
import util from 'util'
import * as multiplePrototypeDelegation from '@dependency/multiplePrototypeDelegation'
import { Entity } from '@dependency/entity'
import * as Graph from '../source/constructable/Graph'
import * as Traversal from '../source/constructable/Traversal.class.js'
import * as Database from '../source/constructable/Database.class.js'
import * as Context from '../source/constructable/Context.class.js'
import * as schemeReference from '../source/dataModel/graphSchemeReference.js'
import * as implementation from '@dependency/graphTraversal-implementation'

setup(async () => {})

suite('Configure Graph class', () => {
  let concreteDatabaseBehavior = new Database.clientInterface({
    implementationList: {
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

  let contextInstance1 = new Context.clientInterface({
      data: { key1: 'key1' },
    }),
    contextInstance2 = new Context.clientInterface({
      data: { key2: 'key2' },
    })

  suite('Configured graph with loading plugins and database adapter', async () => {
    let configuredGraph = Graph.clientInterface({
      parameter: [
        {
          database: concreteDatabaseBehavior,
          traversal: concreteGraphTraversalBehavior,
          concreteBehaviorList: [contextInstance1],
          data: {},
        },
      ],
    })

    {
      test('Should inherit implementation classes', async () => {
        let graph = new configuredGraph.clientInterface({})
        let multiplePrototypeProxy = Object.getPrototypeOf(graph)
        let multiplePrototypeArray = multiplePrototypeProxy[multiplePrototypeDelegation.$.list]
        debugger
        chaiAssertion.isTrue([contextInstance1, concreteGraphTraversalBehavior, concreteDatabaseBehavior].every(behavior => multiplePrototypeArray.includes(behavior)))
      })
    }
    {
      test('Should merge implementations of multiple arguments successfully', async () => {
        let graph = new configuredGraph.clientInterface({
          // pass additional arguments to trigger merging algorithm of arguments.
          concreteBehaviorList: [contextInstance2],
        })
        let multiplePrototypeProxy = Object.getPrototypeOf(graph)
        let multiplePrototypeArray = multiplePrototypeProxy[multiplePrototypeDelegation.$.list]
        chaiAssertion.isTrue([contextInstance1, contextInstance2, concreteGraphTraversalBehavior, concreteDatabaseBehavior].every(behavior => multiplePrototypeArray.includes(behavior)))
      })
    }
  })
})
