process.env['SZN_DEBUG'] = true
import assert from 'assert'
import { assert as chaiAssertion } from 'chai'
import { Graph, Plugin, InstanceContext, linkConstructor } from '../source/script.js'
import { databaseModelAdapterFunction } from '../source/implementationPlugin/databaseModelAdapter/memoryModelAdapter.js'
import * as graphData from './asset/graphData' // load sample data

// suite.only('Test classes', () => {

//     class Node {}
//     class DataItem {}
//     class Controller {}

//     class Context {}

//     const p = new Proxy(function(){}, {

//     })

//     let interface2 = p

//     let instanceWithUniquePrototypeChain = new interface2()

//     test('', async () => {
//         assert(true, '')
//     })

// })

suite('Interface integration with the module in different initialization scenarios', () => {
  // suite('Initializing interface instance by function calling (Reflect.apply)', () => {
  //     let configuredGraph = Graph({ pluginInstance: null, contextInstance: null, constructorPrototypeChain: null })
  //     test('Should return configured interface', async () => {
  //         let traversalResult = await new configuredGraph({ nodeKey: 'node-key-1' })
  //         console.log(traversalResult)
  //         assert(traversalResult, '')
  //     })
  // })
  // suite('Initialize GraphController by instantiating interface using "new" keyword', () => {
  //     test('Should return configured interface', async () => {
  //         let traversalResult = await new Graph({ nodeKey: 'node-key-1' })
  //         console.log(traversalResult)
  //         assert(traversalResult, '')
  //     })

  //     // GraphControllerInstance.traverseGraph()

  // })

  suite('Initializing interface instance with pluggable instances of Plugin, Context, & constructorPrototypeChain', () => {
    let plugin = new Plugin(
      {
        databaseModelAdapter: {
          // database simple memory adapter
          memoryModelAdapter: databaseModelAdapterFunction({ nodeArray: graphData.nodeDataItem.nodeArray }),
        },
        graphTraversalImplementation: {
          aggregateIntoArray() {
            return require('./implementation/graphTraversalImplementation/debugImplementation.js').aggregateIntoArray
          },
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
      },
      {
        defaultPlugin: {
          graphTraversalImplementation: 'aggregateIntoArray',
        },
      },
    )

    let sharedContext = new InstanceContext({
      data: 'This string is shared between instances of the same context.',
    })

    let configuredProxyInterface1 = Graph({
      pluginInstance: plugin,
      contextInstance: sharedContext,
    })

    let nodeInstance = new Graph({ nodeKey: 'node-key-1' })

    test('Should load plugins & adapter and traverse graph successfully', async () => {
      const dataItemValueOfGraph = ['dataItem-key-1']
      try {
        // let nodeInstance = new Constructor2() // one way of creating instances
        // or using a function in the constructor to create instnaces
        // let resultArray = await Constructor1.traverseGraph({ nodeKey: 'node-key-1' })
        // chaiAssertion.deepEqual(resultArray, dataItemValueOfGraph)
      } catch (error) {
        throw new Error(error)
      }
    })
  })
})

// suite('database dapter registration to NodeRelationshipGraph', () => {
//     const adapter = databaseModelAdapterFunction({ nodeArray: graphData.node }) // database simple memory adapter
//     let nodeRelationshipGraph1 = new NodeRelationshipGraph({
//         databaseModelAdapter: adapter
//     })
//     nodeRelationshipGraph1.registerPlugin({})
//     let nodeRelationshipGraph2 = new NodeRelationshipGraph({})
//     nodeRelationshipGraph2.registerPlugin({
//         databaseModelAdapter: adapter
//     })
//     it('Should register databaseModelAdapter using both `registerPlugin` & new contructor arguments.', () => {
//         assert.equal(nodeRelationshipGraph1.databaseModelAdapter, nodeRelationshipGraph2.databaseModelAdapter)
//         assert(nodeRelationshipGraph1.databaseModelAdapter == adapter)
//     })
// })
// suite('Invoke NodeRelationshipGraph using static class, caching setting in Node process', () => {
//     NodeRelationshipGraph.registerAdapter({
//         databaseModelAdapter: {
//             getNodeDocumentQuery: async function() {}
//         }
//     })
//     let Controller = NodeRelationshipGraph.createStaticInstanceClasses()
//     it('Should return a class reference', () => {
//         assert.equal(typeof Controller, 'function')
//     })
// })
// suite('Invoke NodeRelationshipGraph using instance class, allowing creation of different module settings', () => {
//     let nodeRelationshipGraph = new NodeRelationshipGraph()
//     nodeRelationshipGraph.registerAdapter({
//         databaseModelAdapter: {
//             getNodeDocumentQuery: async function() {}
//         }
//     })
//     let Controller = nodeRelationshipGraph.createStaticInstanceClasses()
//     it('Should return a class reference', () => {
//         assert.equal(typeof Controller, 'function')
//     })
// })
