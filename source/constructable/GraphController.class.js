import EventEmitter from 'events'
import assert from 'assert'
import { Entity, Constructable, symbol } from '@dependency/entity'

export const { class: GraphController, reference: Reference, constructablePrototype: Prototype, entityPrototype } = new Entity.clientInterface({ description: 'GraphController' })

Object.assign(GraphController, {
  /**
   * Dynamic implementation - not restricted to specific initialization algorithm, rather choosen from setting of each node in the traversed graph.
   */
  traverseGraph: async function({ nodeKey }) {
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
  },
  createNodeInstance: async function({ nodeKey, additionalChildNestedUnit = [], nodeConnectionKey = null, nodeSubclass }) {},
  createDataItemInstance: async function({ dataItemKey, dataItemSubclass }) {},
})

/*
                   _        _                    ____       _                  _   _             
   _ __  _ __ ___ | |_ ___ | |_ _   _ _ __   ___|  _ \  ___| | ___  __ _  __ _| |_(_) ___  _ __  
  | '_ \| '__/ _ \| __/ _ \| __| | | | '_ \ / _ \ | | |/ _ \ |/ _ \/ _` |/ _` | __| |/ _ \| '_ \ 
  | |_) | | | (_) | || (_) | |_| |_| | |_) |  __/ |_| |  __/ |  __/ (_| | (_| | |_| | (_) | | | |
  | .__/|_|  \___/ \__\___/ \__|\__, | .__/ \___|____/ \___|_|\___|\__, |\__,_|\__|_|\___/|_| |_|
  |_|                           |___/|_|                           |___/                         
*/
Object.assign(entityPrototype, {
  // intercept a method call to choose the corresponding plugin to execute (setting/assigning the variables values according to passed parameters hierarchy)
  interceptMethod({ thisArg, implementationType, nodeInstance, argumentsList, methodName }) {
    let implementationFunction = this.getPlugin({ plugin: 'graphTraversalImplementation', implementation: implementationType })
    // TODO: add plugin settings that will allow to instantiate plugin depending on its settings - i.e. if function instantiate in a specific way
    let implementationObject = implementationFunction({ thisArg: nodeInstance })
    return implementationObject[methodName].apply(thisArg, argumentsList)
  },
})

/*
   _       _ _   _       _ _         
  (_)_ __ (_) |_(_) __ _| (_)_______ 
  | | '_ \| | __| |/ _` | | |_  / _ \
  | | | | | | |_| | (_| | | |/ /  __/
  |_|_| |_|_|\__|_|\__,_|_|_/___\___|
*/
Prototype::Prototype[Constructable.reference.initialize.functionality].setter({
  [Entity.reference.key.entityInstance]({ targetInstance, key }, previousResult /* in case multiple constructor function found and executed. */) {
    return (targetInstance.key = key)
  },
})

/*
    ____ _ _            _     _ _                    __                
   / ___| (_) ___ _ __ | |_  (_) |_ _ __   ___ _ __ / _| __ _  ___ ___ 
  | |   | | |/ _ \ '_ \| __| | | __| '_ \ / _ \ '__| |_ / _` |/ __/ _ \
  | |___| | |  __/ | | | |_  | | |_| | | |  __/ |  |  _| (_| | (_|  __/
   \____|_|_|\___|_| |_|\__| |_|\__|_| |_|\___|_|  |_|  \__,_|\___\___|
*/
GraphController.clientInterface = GraphController::Prototype[Constructable.reference.clientInterface.functionality].switch({
  implementationKey: Entity.reference.key.instanceDelegatingToEntityInstancePrototype,
})({
  constructorImplementation: Entity.reference.key.mergeDataToInstance,
})
