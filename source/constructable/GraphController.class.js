/* eslint-disable prettier/prettier */
import EventEmitter from 'events'
import assert from 'assert'
import { mix, decorator as applyMixin } from '@dependency/classMixin'
import createInstance from '../utility/createInstanceStaticMethod.js'
import addStaticSubclassToClassArray from '@dependency/commonPattern/source/addStaticSubclassToClassArray.staticMethod'
import { classDecorator as prototypeChainDebug} from '@dependency/prototypeChainDebug'
import { add, execute, conditional } from '@dependency/commonPattern/source/decoratorUtility.js'
import { extendedSubclassPattern } from '@dependency/commonPattern/source/extendedSubclassPattern.js'
import { superclassInstanceContextPattern, cacheInstance } from '@dependency/commonPattern/source/superclassInstanceContextPattern.js'

export function GraphControllerFunction({  
    Superclass = EventEmitter, // defaulting to EventEmitter and not Object / Function because extending Object/Function manipulates this prototype in new calls for some reason.
    methodInstanceName,
    mixin, 
    // rethinkdbConnection = (!!Superclass) && Superclass.rethinkdbConnection,
} = {}) {
    // if(Superclass) Superclass.rethinkdbConnection = rethinkdbConnection // Setting this variable on Controller class below causes issues, which maybe related to the way rethinkdb is called or the proxies encapsulating the class.
    
    /**
     * @class
     * @usage through method `traverseGraph`.
     */
    let self = 
        @add({ to: 'static'}, { 
            createInstance,
            addStaticSubclassToClassArray,
        })
        @conditional({ decorator: prototypeChainDebug, condition: process.env.SZN_DEBUG })
        // Add ability to track exdending subclasses
        @extendedSubclassPattern.Superclass()
        // In case the class is an extended subclass of another super class and the subclass tracking pattern is used in the superclass.
        @conditional({ decorator: extendedSubclassPattern.Subclass(), condition: (methodInstanceName && Superclass && Superclass.addSubclass != undefined ) })
        @conditional({ condition: mixin, decorator: applyMixin({ mixin }) })
        // creating objects for `Controller` class, rather than using static classes allows for caching instances during graph traversal in a garbage collected / loosely coupled references that lives only during server-client request.
        @superclassInstanceContextPattern() // applied on the mixin i.e. specific controller.
        class GraphController extends Superclass {
            
            // Configure multiple chain in a proxy that will wrap GraphController
            ownConstructor({
                additionalDelegatedChain = {} // array of additional prototype chain (prototypes/objects/instances) to be added to the delegated prototype chain of the instances produced by the methods of the Graph controller.
            }) {
                additionalDelegatedChain.plugin
                additionalDelegatedChain.context
                additionalDelegatedChain.cache

                return proxiedInterface // of GraphController
            }

            constructor({}) {
                super()
                return this
            }

            // intercept a method call to choose the corresponding plugin to execute (setting/assigning the variables values according to passed parameters hierarchy)
            interceptMethod({ thisArg, implementationType, nodeInstance, argumentsList, methodName }) {
                let implementationFunction = this.getPlugin({ plugin: 'graphTraversalImplementation', implementation: implementationType })
                // TODO: add plugin settings that will allow to instantiate plugin depending on its settings - i.e. if function instantiate in a specific way
                let implementationObject = implementationFunction({ thisArg: nodeInstance })
                return implementationObject[methodName].apply(thisArg, argumentsList)
            }

            /**
             * Create nodeInstace from `nodeKey`, then forward call to `traverseGraph` subclass method
            */
            async traverseGraph({ nodeKey }) {
            }
            static async traverseGraph({ nodeKey,  }) {
                // TODO: Usage of async generators will prevent handing the control to called function (against `Run-to-complete` principle), and will allow interceptin the execution mid way.
                
                // [1] get node
                assert(nodeKey, `• ${nodeKey} Key should be present. The passed value is either undefined, null, or empty string.`)
                let nodeInstance = await this.createNodeInstance({ nodeKey }) // returns a node object (instance) 
                // [2] Forward call to instance's traverse graph
                
                //execute to complete
                // intercepting execution & keeping control
                //{nextNode, } = traverse*(Node)

                // let iteratorObject = Traverse*(Node)
                // let result = iteratorObject.next()
                // let result = iteratorObject.next()
                // let result = iteratorObject.next()
                // result.value.nodeKey
                // if(result.done) let finalNodeResult.next(result1, result2, result3, result4)
                // return finalNoderesult;

                return await nodeInstance.traverseGraph(arguments)
            }

            async initializeDataItem({ dataItemKey }) {
                assert(dataItemKey, `• Missing "dataItem key" - for dataItemType "reference" a key must exist in "node.dataItem".`)
                // get data item
                let dataItemInstance = await this.createDataItemInstance({ dataItemKey })
                // forward call to instance's implementation
                await dataItemInstance.initializeDataItem(arguments)
                return dataItemInstance
            }

            // Add "createObjectWithPrototypeChain"

            /* @cacheInstance({
            //     cacheArrayName: 'node',
            //     keyArgumentName: 'nodeKey'
            // })
            // TODO: change name from 'pathPointerKey' to 'nodeConnectionKey'
            // TODO: change function name from 'getNode'/'getNestedUnit' to 'createNodeInstance'
             */
            async createNodeInstance({ nodeKey, additionalChildNestedUnit = [], nodeConnectionKey = null }) {
                    let nodeSubclass = this.getSubclass({ subclassName: 'ImplementationNode' }) || this.getSubclass({ subclassName: 'Node' }) // get specific subclass or reusable subclass
                    return await self.createNodeInstance({ nodeKey, additionalChildNestedUnit, nodeConnectionKey, nodeSubclass })
            }
            static async createNodeInstance({ nodeKey, additionalChildNestedUnit = [], nodeConnectionKey = null, nodeSubclass }) {
                console.log(new nodeSubclass()) // TODO: FIx proxy that wraps Node - the returned instance is not an object error.
                // create instance or get cached instance
                let instance = await Reflect.construct(nodeSubclass, [ nodeKey ]) // call 'new' on subclass

                // // get json data from database/storage. gets document from database using documentKey and populates the data to the instance. during which 'jsonData' property is set. if it is set, it means that the instance is already populated with data.
                // if(!('jsonData' in instance)) { // if not already populated with data.
                //     let getDocumentQuery = instance.constructor.getDocumentQuery
                //     // TODO: get plugin datatbase adapter
                //     databaseModelAdapter.getNodeDocumentQuery
                //     databaseModelAdapter.getDataItemDocumentQuery
                //     let jsonData = await getDocumentQuery({ key: nodeKey })
                //     assert(jsonData, `• "${nodeKey}" nestedUnit document must be present in the database, the requested key does not exist in database. The passed value is either undefined, null, or empty string.`)
                //     await instance.populateInstancePropertyFromJson_this({ jsonData })
                // }

                return instance
            }

            @cacheInstance({
                cacheArrayName: 'dataItem',
                keyArgumentName: 'dataItemKey'
            })
            async createDataItemInstance({ dataItemKey }) {
                let dataItemSubclass = this.getSubclass({ subclassName: 'ImplementationDataItem' }) || this.getSubclass({ subclassName: 'DataItem' }) // get specific subclass or reusable subclass
                return await self.createDataItemInstance({ dataItemKey, dataItemSubclass })
            }
            static async createDataItemInstance({ dataItemKey, dataItemSubclass }) {
                // create instance or get cached instance
                let instance = await Reflect.construct(dataItemSubclass, [ dataItemKey ]) // call 'new' on subclass
                
                // get json data from database/storage. gets document from database using documentKey and populates the data to the instance. during which 'jsonData' property is set. if it is set, it means that the instance is already populated with data.
                if(!('jsonData' in instance)) { // if not already populated with data.
                    let getDocumentQuery = instance.constructor.getDocumentQuery
                    let jsonData = await getDocumentQuery({ key: dataItemKey })
                    assert(jsonData, `• "${dataItemKey}" nestedUnit document must be present in the database, the requested key does not exist in database. The passed value is either undefined, null, or empty string.`)
                    await instance.populateInstancePropertyFromJson_this({ jsonData })
                }

                return instance
            }

        }


    return self
}
