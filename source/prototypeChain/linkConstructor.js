import assert from 'assert'
import ModuleContext from '@dependency/moduleContext'
import { GraphControllerFunction } from '../constructable/GraphController.class.js'
import { NodeFunction } from '../constructable/Node.class.js' // Tree
import { DataItemFunction } from '../constructable/DataItem.class.js' // Unit

/**
 * PrototypeHierarchyGenerator - for performance this function should be executed on load-time (program startup time where afterwards its ready to take requests)
 * Create connections between static classes (constructors) in a required/wanted way. 
 * @return {Object} Related Classes 
 */
// TODO: implement `curryNamedInvokeManually` using `curryNamed` module (check module's todo list)
// execute curried version, where parameters could be passed in steps
// return createStaticInstanceClasses({ databaseModelAdapter: this.databaseModelAdapter })(args)
export function linkConstructor({
    Superclass, /* Usually the higher Application class */
    /* When defined the exported classes include the specific implementation for node initialization (class tree of ReusableNestedUnit will include a specific implementation class), i.e. all subsequent nodes are executed using the speicifc algorithm of the implementaiton. */
    specificClassImplementation = { // specific implementation classes for Node / DataItem instance initialization or controlelr mixin.
        GraphControllerMixin: null,
        NodeFunction: null,
        DataItemFunction: null
    },
    cacheName = null, /* {String} */
} = {}) {
    let specificNode, specificDataItem;
    // Call class producer functions to return a new class with the specific connections.
    let GraphController = GraphControllerFunction({
        methodInstanceName: cacheName,
        Superclass,
        mixin: (specificClassImplementation.GraphControllerMixin) ? specificClassImplementation.GraphControllerMixin : null, // conditionally extend `Controller` with specific mixin.
    })
    let Node = NodeFunction({ Superclass: GraphController })
    if(specificClassImplementation.NodeFunction) specificNode = specificClassImplementation.NodeFunction({ Superclass: Node })
    let DataItem = DataItemFunction({ Superclass: GraphController })
    if(specificClassImplementation.DataItemFunction) specificDataItem = specificClassImplementation.DataItemFunction({ Superclass: DataItem })

    // add subclass - either specific or reusable depending on the last chained subclass
    GraphController.eventEmitter.emit('addSubclass') // register subclasses that are listening for the event to register themselves in extendedSubclass.static array.
    
    // return the linked tree of constructors.
    return {
        GraphController, 
        DataItem: specificDataItem || DataItem,
        Node: specificNode || Node
    }
}
