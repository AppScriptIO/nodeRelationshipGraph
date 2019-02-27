process.env['SZN_DEBUG'] = true
import assert from 'assert'
import { assert as chaiAssertion } from 'chai'
import { clientInterface, Plugin, InstanceContext, linkConstructor } from '../source/script.js'
import { databaseModelAdapterFunction } from '../source/implementationPlugin/databaseModelAdapter/memoryModelAdapter.js'
import * as graphData from './asset/graphData' // load sample data

describe('Interface integration with the module in different initialization scenarios', () => {
    describe.only('Initializing interface instance by function calling (Reflect.apply)', () => {
        let configuredInterface = clientInterface({ pluginInstance: null, contextInstance: null, constructorPrototypeChain: null })
        it('Should return configured interface', async () => {
            console.log(configuredInterface)
            assert(configuredInterface, '')
        })

    })
    describe('Initializing interface instance with pluggable instances of Plugin, Context, & constructorPrototypeChain', () => {
        let plugin = new Plugin({
                databaseModelAdapter: { // database simple memory adapter
                    memoryModelAdapter: databaseModelAdapterFunction({ nodeArray: graphData.nodeDataItem.nodeArray })
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
                    graphTraversalImplementation: 'aggregateIntoArray' 
                }
            }
        )

        let sharedContext = new InstanceContext({
            data: 'This string is shared between instances of the same context.'
        })
        
        let constructorPrototypeChain = linkConstructor({
            specificClassImplementation: {
                GraphControllerMixin: null,
                NodeFunction: null,
                DataItemFunction: null        
            }
        })

        let configuredProxyInterface1 = clientInterface({
            pluginInstance: plugin, 
            contextInstance: sharedContext, 
            constructorPrototypeChain
        })

        it('Should load plugins & adapter and traverse graph successfully', async () => {
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


// describe('database dapter registration to NodeRelationshipGraph', () => {
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
// describe('Invoke NodeRelationshipGraph using static class, caching setting in Node process', () => {
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
// describe('Invoke NodeRelationshipGraph using instance class, allowing creation of different module settings', () => {
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

