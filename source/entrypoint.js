import ModuleContext from '@dependency/moduleContext'
import { ControllerFunction } from './Controller.class.js'
import { NestedUnitFunction } from './NestedUnit.class.js' // Tree
import { UnitFunction } from './Unit.class.js' // Unit

let implementationTypeObject = {
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
    }
}

/**
 * API: 
 * Static class tree generator
 *  ⇓
 * Copy of static class tree → Unique static context for class tree.
 *  ⇓
 * new Contex with specific variables → soft linked context for subsequent calls.
 *  ⇓
 * Commands → execute tasks inside above context.
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
        <!-- implementationType: 'Shellscript', --> 
        cacheName: 'z', 
        rethinkdbConnection: connection
    })
    ShellscriptController.initializeNestedUnit('X') // each unit will call the implementation it needs.

 */

/**
 * Create connections between static classes (constructors) in a required/wanted way. 
 * @return {Object} Related Classes 
 */
function createStaticInstanceClasses({
    Superclass, /* Usually the higher Application class */
    /* When defined the exported classes include the specific implementation for node initialization (class tree of ReusableNestedUnit will include a specific implementation class), i.e. all subsequent nodes are executed using the speicifc algorithm of the implementaiton. */
    implementationType, // Specific node class implementation for node instance initialization.
    cacheName = null, /* {String} */
    rethinkdbConnection
} = {}) {

    // load specific implementation functions (class producers).
    let specificImplementationConfig;
    for (let key in implementationTypeObject) {
        if(implementationType == key) {
            specificImplementationConfig = implementationTypeObject[key] // which will execute getter function and require the module.
            break;
        }
    }
    // default:
    if(!specificImplementationConfig) {
        // Dynamic implementation - not restricted to specific initialization algorithm, rather choosen from setting of each node in the traversed graph.
    }

    // Choose to create a cached context or anonymous garbage collected one.
    const MC = ModuleContext({ cacheReferenceName: `ModuleContext-${implementationType}` /*  used to combine all related contexts under same object */ })
        
    function connectClassPrototype() {
        // Call class producer functions to return a new class with the specific connections.
        let Controller = ControllerFunction({
            methodInstanceName: cacheName,
            Superclass,
            mixin: specificImplementationConfig.ControllerMixin, 
            rethinkdbConnection
        })
        let NestedUnit = NestedUnitFunction({ Superclass: Controller })
        let Unit = UnitFunction({ Superclass: Controller })
        specificImplementationConfig.NestedUnitFunction({ Superclass: NestedUnit })
        specificImplementationConfig.UnitFunction({ Superclass: Unit })
        Controller.eventEmitter.emit('addSubclass') // register subclasses that are listening for the event to register themselves in extendedSubclass.static array.
        
        // return Controller in which it holds the tree structure.
        return Controller
    }
    // Create new context for the modules using proxy. And cache them with unique names if 'cacheName' is set.
    const connectClassPrototypeProxied = new MC({ target: connectClassPrototype, cacheName: (cacheName) ? `${cacheName}` : null  })
    return connectClassPrototypeProxied()
}

export default createStaticInstanceClasses
