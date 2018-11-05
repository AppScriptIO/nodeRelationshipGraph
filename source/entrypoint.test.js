process.env['SZN_DEBUG'] = true
import assert from 'assert'
import { NodeRelationshipGraph, createStaticInstanceClasses } from './entrypoint.js'
// import { default as Application } from '../../class/Application.class.js'
// load sample data
import { nodeArray as nodeInheritanceGraph } from '../test/asset/databaseData/nodeInheritanceGraph.js'
import { nodeArray as treeRelationshipAndPortGraph } from '../test/asset/databaseData/treeRelationshipAndPortGraph.js'
import { nodeArray as simpleConnectionWithDataItemGraph } from '../test/asset/databaseData/simpleConnectionWithDataItemGraph.js'
import { databaseModelAdapterFunction } from '../test/asset/storageAdapter/memoryModelAdapter.js'

describe.only('Traversing graphs with different implementations', () => {
    let nodeRelationshipGraph = new NodeRelationshipGraph({
        databaseModelAdapter: databaseModelAdapterFunction({ nodeArray: simpleConnectionWithDataItemGraph }) // database simple memory adapter
    })
    nodeRelationshipGraph.registerPlugin({
        graphTraversalImplementation: {
            get logNode() {
                return require('./implementation/graphTraversalImplementation/debugImplementation.js').logNode
            },
            get condition() {
                return require('./implementation/graphTraversalImplementation/condition.js').condition
            },
            get middleware() {
                return require('./implementation/graphTraversalImplementation/middleware.js').middleware
            },
            get schema() {
                return require('./implementation/graphTraversalImplementation/schema.js').schema
            },
            get shellscript() {
                return require('./implementation/graphTraversalImplementation/shellscript.js').shellscript
            },
            get template() {
                return require('./implementation/graphTraversalImplementation/template.js').template
            },
        }, 
        classImplementation: {
            get Middleware() {
                return require('./implementation/middleware').default
            }, 
            get Condition() {
                return require('./implementation/condition').default
            },
            get Template() {
                return require('./implementation/template').default
            },
            get Shellscript() {
                return require('./implementation/shellscript').default
            },
            get Schema() {
                return require('./implementation/schema').default
            },
            get Dynamic() {
                return require('./implementation/dynamic').default
            }        
        }
    })
    let Controller = nodeRelationshipGraph.createStaticInstanceClasses()
    it('*', async () => {
        try {
            let promiseFunction = async function () {
                let controller = await Controller.createContext({ 
                    implementationType: 'logNode' 
                })
                return controller
            }
            let controller = await promiseFunction()
            await controller.traverseGraph({ nodeKey: 'node-key-1' })
        } catch (error) {
            throw new Error(error)
        }
    })
})


// describe('NodeRelationshipGraph interfaces', () => {
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

//     // describe.skip('Check instance prototype chain', () => {
        
//     //     let Controller = createStaticInstanceClasses({
//     //         Superclass: Application, 
//     //         implementationType: 'Middleware',
//     //         cacheName: false
//     //     })
//     //     let portAppInstance = {
//     //         context: { request:
//     //             { method: 'GET',
//     //               url: '/asset/metadata/icon/favicon.ico',
//     //               header:
//     //                { host: 'cdn.localhost',
//     //                  connection: 'keep-alive',
//     //                  pragma: 'no-cache',
//     //                  'cache-control': 'no-cache',
//     //                  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3276.0 Safari/537.36',
//     //                  accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
//     //                  referer: 'http://localhost/',
//     //                  'accept-encoding': 'gzip, deflate, br',
//     //                  'accept-language': 'en-US,en;q=0.9' } },
//     //            response:
//     //             { status: 404,
//     //               message: 'Not Found',
//     //               header: { connection: 'keep-alive' } },
//     //            app: { subdomainOffset: 1, proxy: false, env: 'development' },
//     //            originalUrl: '/asset/metadata/icon/favicon.ico',
//     //            req: '<original node req>',
//     //            res: '<original node res>',
//     //            socket: '<original node socket>' }
             
//     //     }
//     //     let instance = new Controller.extendedSubclass.static['NestedUnit']('43d6e114-54b4-47d8-aa68-a2ae97b961d5', portAppInstance)
//     //     let controller = new Controller(false, { portAppInstance })
//     //     let middlewareArray = controller.initializeNestedUnit({ nestedUnitKey: '43d6e114-54b4-47d8-aa68-a2ae97b961d5' })
        
//     //     it(' ', () => {
//     //         assert.strictEqual(instance.initializeNestedUnit, controller.initializeNestedUnit)
//     //         // middlewareArray.then(x => {console.log(x)}).then(done)
//     //     })
    
//     // })
    
// })
