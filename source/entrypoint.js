import assert from 'assert'
import ModuleContext from '@dependency/moduleContext'
import { GraphControllerFunction } from './GraphController.class.js'
import { NodeFunction } from './Node.class.js' // Tree
import { DataItemFunction } from './DataItem.class.js' // Unit
import { rethinkDBModelAdapter } from './adapter/databaseModelAdapter/rethinkDBModelAdapter.js'

/**
 * API: 
 * Static class tree generator
 *  ⇓
 * Copy of static class tree → Unique static context for class tree.
 *  ⇓
 * new Contex with specific variables → soft linked context for subsequent calls.
 *  ⇓
 * Commands → execute tasks inside above context using non-static methods (`this.<method>`).
 *  ⇓
 * returns results
 * 
 * 
 * USAGE: 
 * 1. create new context for subclasses.
 * 2. use new context as base for subclasses.
 *     
    import createStaticInstanceClasses from '@dependency/nodeRelationshipGraph'
    let ShellscriptController = await createStaticInstanceClasses({
        <!-- classImplementationType: 'Shellscript', --> 
        cacheName: 'z', 
        rethinkdbConnection: connection
    })
    let shellscriptController = await ShellscriptController.createContext({ })

    shellscriptController.initializeNestedUnit('X') // each unit will call the implementation it needs.

 */

/**
 * TODO: Refector - this is a quick abstraction .
 * Interface for adding specific settings using instances or static class interfaces to the module before usage, like databaseDataAdapter, node graph traversal implementation adapters.
 * • instaces allow creating multiple different nodeRelationshipGraph settings
 * • static class invocation allows caching setting throughout Node process.
 */
const self = class NodeRelationshipGraph {
    static databaseModelAdapter
    databaseModelAdapter
    constructor(/* arguments */) {
        this.registerAdapter(...arguments)
    }
}

// set database model for interacting with database during graph traversal.
function registerAdapter({
    databaseModelAdapter, // database model functions for retriving node, dataItem, and other documents. should be async functions
    rethinkdbConnection // for default adapter in case model is not passed
} = {}) {
    databaseModelAdapter = (!databaseModelAdapter) ? rethinkDBModelAdapter({ rethinkdbConnection }) : databaseModelAdapter;
    this.databaseModelAdapter = databaseModelAdapter
}
self.registerAdapter = registerAdapter.bind(self) // `this` = static class
self.prototype.registerAdapter = registerAdapter // `this` = instace of `self`

// register plugins
function registerPlugin({
    graphTraversalImplementation,
    classImplementation
} = {}) {
    this.graphTraversalImplementation = graphTraversalImplementation
    this.classImplementation = classImplementation
}
self.registerPlugin = registerPlugin.bind(self) // `this` = static class
self.prototype.registerPlugin = registerPlugin // `this` = instace of `NodeRelationshipGraph`

// call `createStaticInstanceClasses` using cached NodeRelationshipGraph parameters.
function _createStaticInstanceClasses(objectArg) {
    assert(this.databaseModelAdapter, '• `databaseModelAdapter` Should be set. either default `rethinkdbConnection` parameter for the default adapter object is not set, or adapter is missing.' )
    
    // TODO: implement `curryNamedInvokeManually` using `curryNamed` module (check module's todo list)
    // execute curried version, where parameters could be passed in steps
    // return createStaticInstanceClasses({ databaseModelAdapter: this.databaseModelAdapter })(args)
    // Allow overriding of parameters
    if(!objectArg) objectArg = {}
    if(!objectArg.databaseModelAdapter) objectArg.databaseModelAdapter = this.databaseModelAdapter
    if(!objectArg.graphTraversalImplementation) objectArg.graphTraversalImplementation = this.graphTraversalImplementation
    if(!objectArg.classImplementation) objectArg.classImplementation = this.classImplementation
    return createStaticInstanceClasses(objectArg)
}
self.createStaticInstanceClasses = _createStaticInstanceClasses.bind(registerPlugin) // `this` = static class
self.prototype.createStaticInstanceClasses = _createStaticInstanceClasses  // `this` = instace of `NodeRelationshipGraph`

export { self as NodeRelationshipGraph }

/**
 * Create connections between static classes (constructors) in a required/wanted way. 
 * @return {Object} Related Classes 
 */
export function createStaticInstanceClasses({
    Superclass, /* Usually the higher Application class */
    /* When defined the exported classes include the specific implementation for node initialization (class tree of ReusableNestedUnit will include a specific implementation class), i.e. all subsequent nodes are executed using the speicifc algorithm of the implementaiton. */
    classImplementationType, // Specific node class implementation for node instance initialization.
    graphTraversalImplementation,
    classImplementation,
    cacheName = null, /* {String} */
    databaseModelAdapter = {} // in case no model is passed, the model functions will be undefined.
} = {}) {

    // load specific implementation functions (class producers).
    let specificClassImplementationConfig;
    for (let key in classImplementation) {
        if(classImplementationType == key) {
            specificClassImplementationConfig = classImplementation[key] // which will execute getter function and require the module.
            break;
        }
    }
    // default:
    // if(!specificClassImplementationConfig) {
    //     // Dynamic implementation - not restricted to specific initialization algorithm, rather choosen from setting of each node in the traversed graph.
    //     specificClassImplementationConfig = classImplementation['Dynamic'] // which will execute getter function and require the module.
    // }

    function connectClassPrototype() {
        // Call class producer functions to return a new class with the specific connections.
        let GraphController = GraphControllerFunction({
            methodInstanceName: cacheName,
            Superclass,
            mixin: (specificClassImplementationConfig && specificClassImplementationConfig.GraphControllerMixin) ? specificClassImplementationConfig.GraphControllerMixin : null, // conditionally extend `Controller` with specific mixin.
            // rethinkdbConnection,
            graphTraversalImplementation
        })
        let Node = NodeFunction({ Superclass: GraphController, getDocumentQuery: databaseModelAdapter.getNodeDocumentQuery })
        let DataItem = DataItemFunction({ Superclass: GraphController, getDocumentQuery: databaseModelAdapter.getDataItemDocumentQuery })

        if(specificClassImplementationConfig && specificClassImplementationConfig.NodeFunction) specificClassImplementationConfig.NodeFunction({ Superclass: Node })
        if(specificClassImplementationConfig && specificClassImplementationConfig.DataItemFunction) specificClassImplementationConfig.DataItemFunction({ Superclass: DataItem })

        // add subclass - either specific or reusable depending on the last chained subclass
        GraphController.eventEmitter.emit('addSubclass') // register subclasses that are listening for the event to register themselves in extendedSubclass.static array.
        
        // return Controller in which it holds the tree structure.
        return GraphController
    }
    
    // Choose to create a cached context or anonymous garbage collected one.
    const MC = ModuleContext({ cacheReferenceName: `ModuleContext-${classImplementationType}` /*  used to combine all related contexts under same object */ })
    // Create new context for the modules using proxy. And cache them with unique names if 'cacheName' is set.
    const connectClassPrototypeProxied = new MC({ target: connectClassPrototype, cacheName: (cacheName) ? `${cacheName}` : null  })
    return connectClassPrototypeProxied()
}
