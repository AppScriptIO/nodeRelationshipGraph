import ModuleContext from '@dependency/moduleContext'
import { ControllerFunction } from './Controller.class.js'
import NestedUnitFunction from './NestedUnit.class.js' // Tree
import UnitFunction from './Unit.class.js' // Unit

let counter = [] // allows to have a unique set of relations among different nested unit classes (Tree of classes).

/**
 * API: 
 * Static class tree generator
 * ⇓
 * Copy of static class tree → Unique static context for class tree.
 * ⇓
 * new Contex with specific variables → soft linked context for subsequent calls.
 * ⇓
 * Commands → execute tasks inside above context.
 * ⇓
 * returns results
 * 
 * 
 * USAGE: 
 * 1. create new context for subclasses.
 * 2. use new context as base for subclasses.
 */

/**
 * Create connections between static classes (constructors) in a required way. 
 * @return {Object} Related Classes 
 */
function createStaticInstanceClasses({
    Superclass, /* Usually the higher Application class */
    /* When defined the exported classes include the specific implementation for node initialization (class tree of ReusableNestedUnit will include a specific implementation class), i.e. all subsequent nodes are executed using the speicifc algorithm of the implementaiton. */
    implementationType, // Specific node class implementation for node instance initialization.
    cacheName = false, /* {Boolean || String} */
    rethinkdbConnection
} = {}) {
    // Used as caching key.
    let automaticCacheNaming;
    if(cacheName && typeof cacheName == 'boolean') {
        automaticCacheNaming = true
        cacheName = implementationType
    }

    // load specific implementation functions (class producers).
    let implementationConfig;
    switch (implementationType) {
        case 'Middleware':
            implementationConfig = require('./implementation/middleware').default
        break;
        case 'Condition':
            implementationConfig = require('./implementation/condition').default
        break;
        case 'Template':
            implementationConfig = require('./implementation/template').default
        break;
        case 'Shellscript':
            implementationConfig = require('./implementation/shellscript').default
        break;
        case 'Schema':
            implementationConfig = require('./implementation/schema').default
        break;
        default:
            // Dynamic implementation - not restricted to specific initialization algorithm, rather choosen from setting of each node in the traversed graph.
            
        break;
    }

    // Choose to create a cached context or anonymous garbage collected one.
    const MC = ModuleContext({ referenceName: implementationType /*  used to combine all related contexts under same object */ })
    
    // Create new context for the modules using proxy.
    let ControllerFunc = new MC({ target: ControllerFunction })
    let NestedUnitFunc = new MC({ target: NestedUnitFunction })
    let UnitFunc = new MC({ target: UnitFunction })
    const SpecificNestedUnitFunc = new MC({ target: implementationConfig.NestedUnitFunction })
    const SpecificUnitFunc = new MC({ target: implementationConfig.UnitFunction })
    
    if(cacheName) {
        // Choose unique names to cache the related classes with.
        ControllerFunc.moduleContext.cacheName = `${cacheName}ReusableController`
        NestedUnitFunc.moduleContext.cacheName = `${cacheName}ReusableNestedUnit`
        UnitFunc.moduleContext.cacheName = `${cacheName}ReusableUnit`
        SpecificNestedUnitFunc.moduleContext.cacheName = `${cacheName}SpecificNestedUnit`
        SpecificUnitFunc.moduleContext.cacheName = `${cacheName}SpecificUnit`
    
        if(automaticCacheNaming) {
            counter[cacheName] = counter[cacheName] || 0
            ControllerFunc.moduleContext.cacheName += `${counter[cacheName]}`
            NestedUnitFunc.moduleContext.cacheName += `${counter[cacheName]}`
            UnitFunc.moduleContext.cacheName += `${counter[cacheName]}`
            SpecificNestedUnitFunc.moduleContext.cacheName += `${counter[cacheName]}`
            SpecificUnitFunc.moduleContext.cacheName += `${counter[cacheName]}`
            counter[cacheName] ++         
        }
    }

    // Call class producer functions to return a new class with the specific connections.
    let Controller = ControllerFunc({
        methodInstanceName: cacheName,
        Superclass,
        mixin: implementationConfig.ControllerMixin, 
        rethinkdbConnection
    })
    let NestedUnit = NestedUnitFunc({ Superclass: Controller })
    let Unit = UnitFunc({ Superclass: Controller })
    SpecificNestedUnitFunc({ Superclass: NestedUnit })
    SpecificUnitFunc({ Superclass: Unit })
    Controller.eventEmitter.emit('addSubclass') // register subclasses that are listening for the event to register themselves in extendedSubclass.static array.
    
    // return Controller in which it holds the tree structure.
    return Controller
}

export default createStaticInstanceClasses
