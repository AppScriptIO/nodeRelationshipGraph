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

  let contextInstance = new Context.clientInterface({
    implementationKey: {},
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
      let graph = new configuredGraph.clientInterface({})
      let multiplePrototypeProxy = Object.getPrototypeOf(graph)
      let multiplePrototypeArray = multiplePrototypeProxy[multiplePrototypeDelegation.$.list]
      chaiAssertion.isTrue([contextInstance, concreteGraphTraversalBehavior, concreteDatabaseBehavior].every(behavior => multiplePrototypeArray.includes(behavior)))
    })
  })
})
