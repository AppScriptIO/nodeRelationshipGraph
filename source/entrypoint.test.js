process.env['SZN_DEBUG'] = true
import assert from 'assert'
import { assert as chaiAssertion } from 'chai'
import { clientInterface, Plugin, InstanceContext, linkConstructor } from './entrypoint.js'
import { databaseModelAdapterFunction } from './implementationPlugin/databaseModelAdapter/memoryModelAdapter.js'
import * as graphData from '../test/asset/graphData' // load sample data

describe('Graph traversal scenarios - Traversing graphs with different implementations', () => {
    describe.only('Complete example of loading plugins and adapter (loading example plugins amd adapter) with graphData.nodeDataItem', () => {
        

        /*
        Previous implementation of client interface:
        
        • Approach 1
        1. import NodeRelationshipGraph
        2. nodeRelationshipGraph = new NodeRelationshipGraph({ <plugins>, <implementation parameters> })
        3. Controller = nodeRelationshipGraph.createClassesConnections({ <custom subclasses> })
        4. controller = Controller.createContext({ <Context impelementation parameters> })
        5. controller.traverseGraph({ <nodeKey>, <additional implementation parameters> })
        
        • Approuch 2
        1. import createClass
        2. Controller = createClassesConnections({ <custom subclasses> })
            or  import Controller
        3. import Controller // with specific <custom subclasses>
        4. controller = new Controller({ <plugins>, <implementation parameters>, <Context impelementation parameters> })
        5. controller.traverseGraph({ <nodeKey>, <additional implementation parameters> })
        
         */
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

        // TODO: migrate interface test to its own test suite.
        // let configuredProxyInterface2 = configuredProxyInterface1({
        //      constructorPrototypeChain: {
        //         GraphController: 't'
        //     }, 
        // }) // configure new proxy interface using an existing one.
        // let configuredProxyInterface3 = configuredProxyInterface2() // configure new proxy interface using an existing one.
        
        let instance = new configuredProxyInterface1({ nodeKey: 'node-key-1' })

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
    // describe('Testing graph traversal with execution of node dataItem (graphData.nodeDataItem).', () => {
    //     let nodeRelationshipGraph = new NodeRelationshipGraph({
    //         databaseModelAdapter: databaseModelAdapterFunction({ nodeArray: graphData.nodeDataItem.nodeArray }) // database simple memory adapter
    //     })
    //     nodeRelationshipGraph.registerPlugin({
    //         graphTraversalImplementation: {
    //             get aggregateIntoArray() {
    //                 return require('./implementation/graphTraversalImplementation/debugImplementation.js').aggregateIntoArray
    //             },
    //         }
    //     })  
    //     let Controller = nodeRelationshipGraph.createStaticInstanceClasses()
    //     it('Should execute node dataItem according to each node`s executionType.', async () => {
    //         try {
    //             let controller = await Controller.createContext({ 
    //                 traversalImplementationType: 'aggregateIntoArray' 
    //             })
    //             let resultArray1 = await controller.traverseGraph({ nodeKey: 'node-key-1' })
    //             let resultArray2 = await controller.traverseGraph({ nodeKey: 'node-key-2' })
    //             chaiAssertion.deepEqual(resultArray1, ['dataItem-key-1'])
    //             chaiAssertion.deepEqual(resultArray2, ['dataItem-key-2'])

    //         } catch (error) {
    //             throw new Error(error)
    //         }
    //     })        
    // })
    // describe('Testing graph traversal with `reference` dataItem type (graphData.nodeDataItemAsReference).', () => {
    //     let nodeRelationshipGraph = new NodeRelationshipGraph({
    //         databaseModelAdapter: databaseModelAdapterFunction({
    //             nodeArray: graphData.nodeDataItemAsReference.nodeArray, 
    //             dataItemArray: graphData.nodeDataItemAsReference.dataItemArray 
    //         }) // database simple memory adapter
    //     })
    //     nodeRelationshipGraph.registerPlugin({
    //         graphTraversalImplementation: {
    //             get aggregateIntoArray() {
    //                 return require('./implementation/graphTraversalImplementation/debugImplementation.js').aggregateIntoArray
    //             },
    //         }
    //     })  
    //     let Controller = nodeRelationshipGraph.createStaticInstanceClasses()
    //     it('Should instantiate dataItem from reference key and execute dataItem according to each node`s executionType.', async () => {
    //         try {
    //             let controller = await Controller.createContext({ 
    //                 traversalImplementationType: 'aggregateIntoArray' 
    //             })
    //             let resultArray1 = await controller.traverseGraph({ nodeKey: 'node-key-1' })
    //             let resultArray2 = await controller.traverseGraph({ nodeKey: 'node-key-2' })
    //             chaiAssertion.deepEqual(resultArray1, ['dataItem-key-1'])
    //             chaiAssertion.deepEqual(resultArray2, ['dataItem-key-2'])

    //         } catch (error) {
    //             throw new Error(error)
    //         }
    //     })        
    // })
    // describe('Testing graph traversal of with execution of node dataItem in parallel (graphData.nodeConnectionParallelTraversal).', () => {
    //     describe('Using `allPromise` traversal.', () => {
    //         let nodeRelationshipGraph = new NodeRelationshipGraph({
    //             databaseModelAdapter: databaseModelAdapterFunction({ nodeArray: graphData.nodeConnectionParallelTraversal_allPromise.nodeArray }) // database simple memory adapter
    //         })
    //         nodeRelationshipGraph.registerPlugin({
    //             graphTraversalImplementation: {
    //                 get aggregateIntoArray() {
    //                     return require('./implementation/graphTraversalImplementation/debugImplementation.js').aggregateIntoArray
    //                 },
    //             }
    //         })  
    //         let Controller = nodeRelationshipGraph.createStaticInstanceClasses()
    //         it('Should execute nodes in parallel fashion returning all resolved promises preserving order.', async () => {
    //             const dataItemValueOfGraph = ['dataItem-key-0','dataItem-key-1','dataItem-key-2','dataItem-key-3','dataItem-key-4']
    //             try {
    //                 let controller = await Controller.createContext({
    //                     traversalImplementationType: 'aggregateIntoArray' 
    //                 })
    //                 let resultArray = await controller.traverseGraph({ nodeKey: 'node-key-0' })
    //                 chaiAssertion.deepEqual(resultArray, dataItemValueOfGraph)

    //             } catch (error) {
    //                 throw new Error(error)
    //             }
    //         })        
    //     })
    //     describe('Using `raceFirstPromise` traversal.', () => {
    //         let nodeRelationshipGraph = new NodeRelationshipGraph({
    //             databaseModelAdapter: databaseModelAdapterFunction({ nodeArray: graphData.nodeConnectionParallelTraversal_raceFirstPromise.nodeArray }) // database simple memory adapter
    //         })
    //         nodeRelationshipGraph.registerPlugin({
    //             graphTraversalImplementation: {
    //                 get aggregateIntoArray() {
    //                     return require('./implementation/graphTraversalImplementation/debugImplementation.js').aggregateIntoArray
    //                 },
    //             }
    //         })  
    //         let Controller = nodeRelationshipGraph.createStaticInstanceClasses()
    //         it('Should execute nodes in parallel fashion returning the first to resolve.', async () => {
    //             const dataItemValueOfGraph = ['dataItem-key-0','dataItem-key-3']
    //             try {
    //                 let controller = await Controller.createContext({
    //                     traversalImplementationType: 'aggregateIntoArray'
    //                 })
    //                 let resultArray = await controller.traverseGraph({ nodeKey: 'node-key-0' })
    //                 chaiAssertion.deepEqual(resultArray, dataItemValueOfGraph)

    //             } catch (error) {
    //                 throw new Error(error)
    //             }
    //         })        
    //     })
    // })
    // describe('Testing graph traversal of outgoing node connections (graphData.nodeConnection).', () => {
    //     let nodeRelationshipGraph = new NodeRelationshipGraph({
    //         databaseModelAdapter: databaseModelAdapterFunction({ nodeArray: graphData.nodeConnection.nodeArray }) // database simple memory adapter
    //     })
    //     nodeRelationshipGraph.registerPlugin({
    //         graphTraversalImplementation: {
    //             get aggregateIntoArray() {
    //                 return require('./implementation/graphTraversalImplementation/debugImplementation.js').aggregateIntoArray
    //             },
    //         }
    //     })  
    //     let Controller = nodeRelationshipGraph.createStaticInstanceClasses()
    //     it('Should load plugins & adapter successfully', async () => {
    //         const dataItemValueOfGraph = ['dataItem-key-1', 'dataItem-key-2']
    //         try {
    //             let controller = await Controller.createContext({ 
    //                 traversalImplementationType: 'aggregateIntoArray' 
    //             })
    //             let resultArray = await controller.traverseGraph({ nodeKey: 'node-key-1' })
    //             chaiAssertion.deepEqual(resultArray, dataItemValueOfGraph)

    //         } catch (error) {
    //             throw new Error(error)
    //         }
    //     })        
    // })
    // describe('Testing graph traversal of outgoing node connections that are grouped into ports (graphData.nodePort).', () => {
    //     let nodeRelationshipGraph = new NodeRelationshipGraph({
    //         databaseModelAdapter: databaseModelAdapterFunction({ nodeArray: graphData.nodePort.nodeArray }) // database simple memory adapter
    //     })
    //     nodeRelationshipGraph.registerPlugin({
    //         graphTraversalImplementation: {
    //             get aggregateIntoArray() {
    //                 return require('./implementation/graphTraversalImplementation/debugImplementation.js').aggregateIntoArray
    //             },
    //         }
    //     })
    //     let Controller = nodeRelationshipGraph.createStaticInstanceClasses()
    //     it('Should load plugins & adapter successfully', async () => {
    //         const dataItemValueOfGraph = ['dataItem-key-0', 'dataItem-key-2', 'dataItem-key-4', 'dataItem-key-5', 'dataItem-key-1', 'dataItem-key-3']
    //         try {
    //             let controller = await Controller.createContext({
    //                 traversalImplementationType: 'aggregateIntoArray' 
    //             })
    //             let resultArray = await controller.traverseGraph({ nodeKey: 'node-key-0' })
    //             chaiAssertion.deepEqual(resultArray, dataItemValueOfGraph)

    //         } catch (error) {
    //             throw new Error(error)
    //         }
    //     })        
    // })
})


// describe('NodeRelationshipGraph interfaces', () => {

//     describe('database dapter registration to NodeRelationshipGraph', () => {
//         const adapter = databaseModelAdapterFunction({ nodeArray: graphData.node }) // database simple memory adapter
//         let nodeRelationshipGraph1 = new NodeRelationshipGraph({
//             databaseModelAdapter: adapter
//         })
//         nodeRelationshipGraph1.registerPlugin({})
//         let nodeRelationshipGraph2 = new NodeRelationshipGraph({})
//         nodeRelationshipGraph2.registerPlugin({
//             databaseModelAdapter: adapter
//         })
//         it('Should register databaseModelAdapter using both `registerPlugin` & new contructor arguments.', () => {
//             assert.equal(nodeRelationshipGraph1.databaseModelAdapter, nodeRelationshipGraph2.databaseModelAdapter)
//             assert(nodeRelationshipGraph1.databaseModelAdapter == adapter)
//         })
//     })
//     describe('Invoke NodeRelationshipGraph using static class, caching setting in Node process', () => {
//         NodeRelationshipGraph.registerAdapter({
//             databaseModelAdapter: {
//                 getNodeDocumentQuery: async function() {}
//             }
//         })
//         let Controller = NodeRelationshipGraph.createStaticInstanceClasses()
//         it('Should return a class reference', () => {
//             assert.equal(typeof Controller, 'function')
//         })
//     })
//     describe('Invoke NodeRelationshipGraph using instance class, allowing creation of different module settings', () => {
//         let nodeRelationshipGraph = new NodeRelationshipGraph()
//         nodeRelationshipGraph.registerAdapter({
//             databaseModelAdapter: {
//                 getNodeDocumentQuery: async function() {}
//             }
//         })
//         let Controller = nodeRelationshipGraph.createStaticInstanceClasses()
//         it('Should return a class reference', () => {
//             assert.equal(typeof Controller, 'function')
//         })
//     })
    
// })

// describe('ReusableNestedUnit module - Connecting class inhiritance dynamically', () => {

//     describe('Creating static classes without cache', () => {
        
//         let Controller1 = createStaticInstanceClasses({ 
//             Superclass: null, 
//             implementationType: 'Middleware',
//             cacheName: false
//         })
//         let Controller2 = createStaticInstanceClasses({ 
//             Superclass: null, 
//             implementationType: 'Middleware',
//             cacheName: false
//         })

//         it('Should return different class references', () => {
//             assert.notStrictEqual(Controller1, Controller2)
//         })
    
//     })
        
//     describe('Caching static classes using different passed cacheName', () => {
        
//         let Controller1 = createStaticInstanceClasses({
//             Superclass: null, 
//             implementationType: 'Middleware',
//             cacheName: 'X'
//         })
//         let Controller2 = createStaticInstanceClasses({ 
//             Superclass: null, 
//             implementationType: 'Middleware',
//             cacheName: 'Y'
//         })

//         it('Should return different class references', () => {
//             assert.notStrictEqual(Controller1, Controller2)
//         })
    
//     })

//     describe('Caching static classes using same passed cacheName', () => {
        
//         let Controller1 = createStaticInstanceClasses({ 
//             Superclass: null, 
//             implementationType: 'Middleware',
//             cacheName: 'X'
//         })
//         let Controller2 = createStaticInstanceClasses({ 
//             Superclass: null, 
//             implementationType: 'Middleware',
//             cacheName: 'X'
//         })

//         it('Should return same class references', () => {
//             assert.strictEqual(Controller1, Controller2)
//         })

//         it('Should return same subclass references', () => {
//             assert.strictEqual(Controller1.extendedSubclass.static['NestedUnit'], Controller1.extendedSubclass.static['NestedUnit'])
//             assert.strictEqual(Controller1.extendedSubclass.static['Unit'], Controller1.extendedSubclass.static['Unit'])
//         })

//     })

//     describe('Check new instance chain when using mixinController', () => {
//         const mixinController = (require('./implementation/condition').default).ControllerMixin
//         let ClassChain = mixinController({ Superclass: class S {} }) /* return Specific implementation Controller */
//         class Subclass extends ClassChain {}
//         let i = new Subclass()

//         it('Should not alter child class prototype, should create an object with prototype chain matching it\'s subclass class', () => {
//             assert.strictEqual(i.constructor.name, Subclass.name)
//         })

//     })

// //     // describe.skip('Check instance prototype chain', () => {
        
// //     //     let Controller = createStaticInstanceClasses({
// //     //         Superclass: Application, 
// //     //         implementationType: 'Middleware',
// //     //         cacheName: false
// //     //     })
// //     //     let portAppInstance = {
// //     //         context: { request:
// //     //             { method: 'GET',
// //     //               url: '/asset/metadata/icon/favicon.ico',
// //     //               header:
// //     //                { host: 'cdn.localhost',
// //     //                  connection: 'keep-alive',
// //     //                  pragma: 'no-cache',
// //     //                  'cache-control': 'no-cache',
// //     //                  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3276.0 Safari/537.36',
// //     //                  accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
// //     //                  referer: 'http://localhost/',
// //     //                  'accept-encoding': 'gzip, deflate, br',
// //     //                  'accept-language': 'en-US,en;q=0.9' } },
// //     //            response:
// //     //             { status: 404,
// //     //               message: 'Not Found',
// //     //               header: { connection: 'keep-alive' } },
// //     //            app: { subdomainOffset: 1, proxy: false, env: 'development' },
// //     //            originalUrl: '/asset/metadata/icon/favicon.ico',
// //     //            req: '<original node req>',
// //     //            res: '<original node res>',
// //     //            socket: '<original node socket>' }
             
// //     //     }
// //     //     let instance = new Controller.extendedSubclass.static['NestedUnit']('43d6e114-54b4-47d8-aa68-a2ae97b961d5', portAppInstance)
// //     //     let controller = new Controller(false, { portAppInstance })
// //     //     let middlewareArray = controller.initializeNestedUnit({ nestedUnitKey: '43d6e114-54b4-47d8-aa68-a2ae97b961d5' })
        
// //     //     it(' ', () => {
// //     //         assert.strictEqual(instance.initializeNestedUnit, controller.initializeNestedUnit)
// //     //         // middlewareArray.then(x => {console.log(x)}).then(done)
// //     //     })
    
// //     // })
    
// })
