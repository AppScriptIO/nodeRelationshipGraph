import assert from 'assert'
import { linkConstructor } from './prototypeChain/linkConstructor.js'
import { add, execute, applyMixin, conditional } from '@dependency/commonPattern/source/decoratorUtility.js'
import { createProxyHandlerReflectedToTargetObject, addRequiredPropertyForConstructorProxy } from '@dependency/commonPattern/source/proxyUtility.js'
import { shallowMergeNonExistingPropertyOnly } from './utility/shallowObjectMerge.js'

const self = 
    @execute({ staticMethod: 'initializeStaticClass', args: [], self: true })
    class ClientInterfaceClass {

        // on creation of instance choose class implementation.
        static constructorPrototypeChain = { // items must be related to the same constructor chain.
            GraphController:  null, 
            Node: null, 
            DataItem: null
        }; // class prototype chian with default implementation. 
        static defaultClientInterfaceInstance;

        static initializeStaticClass(self) { // Overcome restrictions in initialization of static variables where 'self' is not defained.
            self.constructorPrototypeChain = linkConstructor({})
            self.defaultClientInterfaceInstance = new self({ constructorPrototypeChain: self.constructorPrototypeChain }).proxiedInstance
        }

        constructorPrototypeChain = {};

        constructor(args = {}) {
            const self = this.constructor
            const instance = this 

            instance.setInstanceProperty(args)
            return { 
                instance,  
                get proxiedInstance() {
                    return instance.createInstanceProxy()
                }
            }
        }

        // set instance properties or overwrite existing ones.
        setInstanceProperty(args = {}, { instance = this  } = {}) {
            // arguments sanitization
            const { pluginInstance, contextInstance, constructorPrototypeChain = null } = args           
            if(constructorPrototypeChain) {
                assert(constructorPrototypeChain.GraphController, '`constructorPrototypeChain` object must contain `GraphController` property.')
                assert(constructorPrototypeChain.Node, '`constructorPrototypeChain` object must contain `Node` property.')
                assert(constructorPrototypeChain.DataItem, '`constructorPrototypeChain` object must contain `DataItem` property.')
                instance.constructorPrototypeChain = constructorPrototypeChain
            }
            if(pluginInstance) instance.pluginInstance = pluginInstance
            if(contextInstance) instance.contextInstance = contextInstance
        }
        
        createInstanceProxy({ instance = this } = {}) {
            const self = instance.constructor

            // proxy handler reflects all opertaions to instance object and adds additional 'construct' & 'apply' operations.
            let reflectedInstanceTrap = createProxyHandlerReflectedToTargetObject({ target: instance })
            let proxyHandler = Object.assign(
                reflectedInstanceTrap, 
                {
                    // set new properties or overwrite existing.
                    apply(target, thisArg, argumentList) {
                        // create a new clientInterface using the current ClientInterface instance.
                        let clientInterface = self.createNewInstanceWithInitialInstanceValue({ baseInstance: instance, constructorArgumentList: argumentList })
                        return clientInterface
                    }, 
                    construct: self.constructGraphInstance.bind(instance),
                }
            )
            
            proxyHandler = addRequiredPropertyForConstructorProxy({ proxyHandler }) // IMPORTANT: ensures that constructor proxy traps comply with Ecmascript proxy specification.
            return new Proxy(function() {} /* Enables traps for 'apply' & 'construct' */, proxyHandler)
        }


        // create an instance using an passed instance as initial object (using an instance as a base for creating another one).
        static createNewInstanceWithInitialInstanceValue({ baseInstance, constructorArgumentList }) {
            let { instance: newInstance, proxiedInstance } = new self(...constructorArgumentList)
            // if(constructorArgumentList[0].x == '3') console.log(newInstance)
            shallowMergeNonExistingPropertyOnly({ baseObject: baseInstance, targetObject: newInstance })
            return proxiedInstance
        }

        static constructGraphInstance(target /* the function used in proxy */, argumentsList, proxiedTarget) { // proxy trap
            const self = proxiedTarget.constructor
            const clientInterfaceInstance = proxiedTarget,
                  defaultClientInterfaceInstance = self.defaultClientInterfaceInstance;
            // // assert(this.databaseModelAdapter, '• `databaseModelAdapter` Should be set. either default `rethinkdbConnection` parameter for the default adapter object is not set, or adapter is missing.' )
            const   GraphController =   clientInterfaceInstance.constructorPrototypeChain.GraphController || 
                                        defaultClientInterfaceInstance.constructorPrototypeChain.GraphController,
                    Node =              clientInterfaceInstance.constructorPrototypeChain.Node,
                    DataItem =          clientInterfaceInstance.constructorPrototypeChain.DataItem,
                    pluginInstance =    proxiedTarget.pluginInstance,
                    contextInstance =   proxiedTarget.contextInstance, // traversalImplementationType: 'aggregateIntoArray' 
                    cacheInstance =     proxiedTarget.cacheInstance;
            
            // GraphController.getSubclass('Node') // relies on the static method added to the class constructor.
            // // • Approach of creating a controller instance that will contain the extending plugin instances.
            let graphController = new GraphController()
            // let controller = new GraphController({
            //     Node: new Proxy(Node), 
            //     DataItem: new Proxy(DataItem)
            // })
            // controller.getSubclass('Node') // relies on the context added prototype function "getSubclass"

            // wrap instance construction with passed object context (thisArg.pluginInstance, thisArg.contextInstance) with plugin and context added to prototype chain.
            let graphTraversalResult = graphController.traverseGraph({ nodeKey: 'k1' }/*argumentsList*/)

            /** TODO: 
             * the returned node created, the proxy will wrap the instance in the new prototype chain. 
             * While subsequent internal calls, won't be affected.
             * => Therefore the constructors used by the controller to create internal instances should be configurable. 
            */
            
            return graphTraversalResult
        }
    }

/** 
 * The client interface allows to interact with the module in multiple ways. i.e. it doesn't contain the core logic, but the wiring simplifying the configuration & usage of the different componenets of this module.
 * It defines: 
 *      - The initialization behavior - e.g. through instantiation (executing interface as constructor with `new` keyword) or executing the interface by calling (executing interface as function).
 *              • Apply => Create constructor with specific implementation, manipulating the behavior of the instance creation. 
 *              • Construct => Create instance from default class. E.g. Node subclass instance.
 *      - Sets default parameters for the different components of the module.
 *      - Manages interface instances allowing to create new interface from a previously configured interface instance. (TODO: This feature could be separated as its own module)
 *      - Provides a consistent exposed client interface - allowing easier refactoring of internal components when needed.
 */
export const clientInterface = new Proxy(self, {
    apply(target, thisArg, argumentsList) {
        let { proxiedInstance: configuredInterface } = new self(...argumentsList)
        return configuredInterface

        // // Choose to create a cached context or anonymous garbage collected one.
        // const MC = ModuleContext({ cacheReferenceName: `ModuleContext-${'1'}` /*  used to combine all related contexts under same object */ })
        // // Create new context for the modules using proxy. And cache them with unique names if 'cacheName' is set.
        // const connectClassPrototypeProxied = new MC({ target: connectClassPrototype, cacheName: (cacheName) ? `${cacheName}` : null  })

        // Rethinkdb default adapter: 
        // import { rethinkDBModelAdapter } from './implementation/databaseModelAdapter/rethinkDBModelAdapter.js'
        // rethinkdbConnection, // for default adapter in case model is not passed
        // // set database model for interacting with database during graph traversal. Either the default database or the passed adapter
        // if(!databaseModelAdapter && rethinkdbConnection)
        //     databaseModelAdapter = rethinkDBModelAdapter({ rethinkdbConnection })
    }, 
    construct: self.constructGraphInstance
})

