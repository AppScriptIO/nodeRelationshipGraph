import EventEmitter from 'events'
import assert from 'assert'
import { mix } from 'mixwith'
import commonMethod from './utility/commonMethod.mixin.js'
import createInstance from '@dependency/commonPattern/source/createInstance.staticMethod'
import { usingGenericInstance as populateInstancePropertyFromJson, usingThis as populateInstancePropertyFromJson_this } from '@dependency/populateObjectPropertyFromObject'
import addStaticSubclassToClassArray from '@dependency/commonPattern/source/addStaticSubclassToClassArray.staticMethod'
import { classDecorator as prototypeChainDebug} from '@dependency/prototypeChainDebug'
import { add, execute, applyMixin, conditional } from '@dependency/commonPattern/source/decoratorUtility.js'
import { extendedSubclassPattern } from '@dependency/commonPattern/source/extendedSubclassPattern.js'
import { superclassInstanceContextPattern, cacheInstance } from '@dependency/commonPattern/source/superclassInstanceContextPattern.js'

/**
 * @class
 * @usage new instance is created for each check.
 */
export function GraphControllerFunction({
    methodInstanceName,
    Superclass = EventEmitter, // defaulting to EventEmitter and not Object / Function because extending Object/Function manipulates this prototype in new calls for some reason.
    mixin, 
    graphTraversalImplementation
    // rethinkdbConnection = (!!Superclass) && Superclass.rethinkdbConnection
} = {}) {
    // if(Superclass) Superclass.rethinkdbConnection = rethinkdbConnection // Setting this variable on Controller class below causes issues, which maybe related to the way rethinkdb is called or the proxies encapsulating the class.
    
    let mixinArray = [/*commonMethod*/]
    let self = 
        @add({ to: 'static'}, { 
            createInstance,
            populateInstancePropertyFromJson,
            addStaticSubclassToClassArray,
        })
        @add({ to: 'prototype'}, {
            populateInstancePropertyFromJson_this
        })
        @conditional({ decorator: prototypeChainDebug, condition: process.env.SZN_DEBUG })
        @extendedSubclassPattern.Superclass()
        @conditional({ decorator: extendedSubclassPattern.Subclass(), condition: (methodInstanceName && Superclass && Superclass.addSubclass != undefined ) })
        @conditional({ condition: mixin, decorator: applyMixin({ mixin }) })
        // creating objects for `Controller` class, rather than using static classes allows for caching instances during graph traversal in a garbage collected / loosely coupled references that lives only during server-client request.
        @superclassInstanceContextPattern() // applied on the mixin i.e. specific controller.
        class GraphController extends mix(Superclass).with(...mixinArray) {
            
            /**
             * Create nodeInstace from `nodeKey`, then forward call to `traverseGraph` to subclass function
            */
            async traverseGraph(/*arguments*/) {
                // [1] get node
                let { nodeKey } = arguments[0]
                assert(nodeKey, `• ${nodeKey} Key should be present. The passed value is either undefined, null, or empty string.`)
                let nodeInstance = await this.createNodeInstance({ nodeKey }) // returns a node object (instance) 
                // [2] Forward call to instance's traverse graph
                nodeInstance.traverseGraph(arguments)
            }

            @cacheInstance({
                cacheArrayName: 'node',
                keyArgumentName: 'nodeKey'
            })
            // TODO: change name from 'pathPointerKey' to 'nodeConnectionKey'
            // TODO: change function name from 'getNode'/'getNestedUnit' to 'createNodeInstance'
            async createNodeInstance({ nodeKey, additionalChildNestedUnit = [], nodeConnectionKey = null}) {
                let nodeSubclass = this.getSubclass({ subclassName: 'ImplementationNode' }) || this.getSubclass({ subclassName: 'Node' }) // get specific subclass or reusable subclass
                let instance = await Reflect.construct(nodeSubclass, [ nodeKey ]) // call 'new' on subclass
                
                // get json data from database/storage. (preveiously steps combined in `await instance.reflectDatabaseDataToAppObject()`)
                let getDocumentQuery = instance.constructor.getDocumentQuery
                let jsonData = await getDocumentQuery({ key: nodeKey })
                assert(jsonData, `• "${nodeKey}" nestedUnit document must be present in the database, the requested key does not exist in database. The passed value is either undefined, null, or empty string.`)
                await instance.populateInstancePropertyFromJson_this({ jsonData })

                // // add children trees: 
                // instance.additionalChildNestedUnit = additionalChildNestedUnit
                // // add nodeConnectionKey to allow applying additional corresponding additional children.
                // instance.nodeConnectionKey = nodeConnectionKey

                return instance
            }

            @cacheInstance({
                cacheArrayName: 'dataItem',
                keyArgumentName: 'dataItemKey'
            })
            async getDataItem({ dataItemKey }) {
                let instance = await this.callSubclass('DataItem', [dataItemKey])
                await instance.reflectDatabaseDataToAppObject()
                return instance
            }
            
            /**
             * @description gets document from database using documentKey and populates the data to the instance.
             * during which 'jsonData' property is set. if it is set, it means that the instance is already populated with data.
             * 
             */
            async reflectDatabaseDataToAppObject({
                object = this, 
                key = this.key, 
                queryFunc = this.constructor.getDocumentQuery,
                connection = self.rethinkdbConnection
            } = {}) {
                if(!('jsonData' in object)) { // if not already populated with data.
                    let jsonData = await queryFunc({ key, connection })
                    assert(jsonData, `• "${key}" nestedUnit document must be present in the database, the requested key does not exist in database. The passed value is either undefined, null, or empty string.`)
                    await this.populateInstancePropertyFromJson_this({ jsonData })
                }
            }

        }

    self.plugin = {
        graphTraversalImplementation
    }
    Object.defineProperty(self.prototype, 'getPlugin', { 
        value: function({ plugin, implementation }) { 
            return self.plugin[plugin][implementation]
        } 
    });

    return self
}
