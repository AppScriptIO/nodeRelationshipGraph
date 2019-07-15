process.env['SZN_DEBUG'] = true
import assert from 'assert'
import { assert as chaiAssertion } from 'chai'
import util from 'util'
import { MultipleDelegation } from '@dependency/multiplePrototypeDelegation'
import { Entity } from '@dependency/entity'
import { Graph } from '../source/constructable/Graph.class.js'
import { GraphTraversal } from '../source/constructable/GraphTraversal.class.js'
import { Database } from '../source/constructable/Database.class.js'
import { Cache } from '../source/constructable/Cache.class.js'
import { Context } from '../source/constructable/Context.class.js'
import { boltCypherModelAdapterFunction } from '../source/implementationPlugin/databaseModelAdapter/boltCypherModelAdapter.js'
import { implementation as defaultImplementation } from '../source/implementationPlugin/graphTraversalImplementation/defaultImplementation.js'

setup(async () => {})

suite('Configure Graph class', () => {
  let concreteDatabaseBehavior = new Database.clientInterface({
    implementationList: {
      boltCypherModelAdapter: boltCypherModelAdapterFunction(),
    },
    defaultImplementation: 'boltCypherModelAdapter',
  })
  let concreteGraphTraversalBehavior = new GraphTraversal.clientInterface({
    implementationList: {
      defaultImplementation,
    },
    defaultImplementation: 'defaultImplementation',
  })
  let contextInstance = new Context.clientInterface({
    implementationKey: {
      // traverseNode: 'chronological',
    },
  })

  suite('Configured graph with loading plugins and database adapter', async () => {
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

    test('Should inherit implementation classes', async () => {
      let graph = new configuredGraph({})
      let multiplePrototypeProxy = Object.getPrototypeOf(graph)
      let multiplePrototypeArray = multiplePrototypeProxy[MultipleDelegation.Reference.list]
      chaiAssertion.isTrue(
        multiplePrototypeArray.includes(contextInstance) && multiplePrototypeArray.includes(concreteGraphTraversalBehavior) && multiplePrototypeArray.includes(concreteDatabaseBehavior),
      )
    })
  })
})
