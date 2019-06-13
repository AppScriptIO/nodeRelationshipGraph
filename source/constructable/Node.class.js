import assert from 'assert'
import { Entity, Constructable, symbol } from '@dependency/entity'

export const { class: Node, reference: Reference, constructablePrototype: Prototype, entityPrototype } = new Entity.clientInterface({ description: 'Node' })

/*
                   _        _                    ____       _                  _   _             
   _ __  _ __ ___ | |_ ___ | |_ _   _ _ __   ___|  _ \  ___| | ___  __ _  __ _| |_(_) ___  _ __  
  | '_ \| '__/ _ \| __/ _ \| __| | | | '_ \ / _ \ | | |/ _ \ |/ _ \/ _` |/ _` | __| |/ _ \| '_ \ 
  | |_) | | | (_) | || (_) | |_| |_| | |_) |  __/ |_| |  __/ |  __/ (_| | (_| | |_| | (_) | | | |
  | .__/|_|  \___/ \__\___/ \__|\__, | .__/ \___|____/ \___|_|\___|\__, |\__,_|\__|_|\___/|_| |_|
  |_|                           |___/|_|                           |___/                         
*/
Object.assign(entityPrototype, {
  /**
   * Directed Graph - Graph that can have opposite pointers between same 2 nodes.
   * Oriented graph is a directed graph that has only one directrion between each 2 nodes (i.e. one arrow pointing to one direction from node to node)
   * @return {Array of Objects}  each object contains instruction settings to be used through an implementing module.
   */
  // @(function defaultParameters(targetClass, methodName, propertyDescriptor) { // make default parameters accesible to prior decorator proxy handlers
  //     propertyDescriptor.value = new Proxy(propertyDescriptor.value, {
  //         apply: async (target, thisArg, argumentsList) => {
  //             let defaultArgs = [{
  //                 implementationType: thisArg.sharedContext.traversalImplementationType,
  //                 nodeInstance: thisArg, // the current node to interact with.
  //                 additionalChildNode: [], // child nodes to add to the current node's children. These are added indirectly to a node without changing the node's children itself, as a way to extend current nodes.
  //                 nodeConnectionKey: null // pathPointerKey
  //             }]
  //             argumentsList = defaultArgs.map((defaultValue, index) => {
  //                 let passedValue = argumentsList[index]
  //                 if(typeof passedValue == 'object' && typeof defaultValue == 'object') {
  //                     return Object.assign(defaultValue, passedValue)
  //                 } else if(!passedValue) {
  //                     return defaultValue
  //                 } else {
  //                     passedValue
  //                 }
  //             })
  //             return target.apply(thisArg, argumentsList)
  //         }
  //     })
  //     return propertyDescriptor
  // })
  // @(function runImplementation(targetClass, methodName, propertyDescriptor) {
  //     let proxyHandler = {
  //         apply: async (target, thisArg, argumentsList) => {
  //             let {
  //                 implementationType,
  //                 nodeInstance,
  //             } = argumentsList[0]
  //             if(!implementationType && nodeInstance.tag)
  //                 implementationType = nodeInstance.tag.traversalImplementationType

  //             if(implementationType) {
  //                 let controller = thisArg.contextInstance
  //                 return controller.interceptMethod({ thisArg, implementationType, nodeInstance, argumentsList, methodName })
  //             }
  //             else {
  //                 console.error('• no implementation selected for ' + nodeInstance.key)
  //                 return target.apply(thisArg, argumentsList)
  //             }
  //         }
  //     }
  //     propertyDescriptor.value = new Proxy(propertyDescriptor.value, proxyHandler)
  //     return propertyDescriptor
  // })
  async traverseGraph({ implementationType, nodeInstance, additionalChildNode, nodeConnectionKey } = {}) {
    // Entrypoint Instance
    console.log('default traverse Graph executed.')
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
Node.clientInterface = Node::Prototype[Constructable.reference.clientInterface.functionality].switch({
  implementationKey: Entity.reference.key.instanceDelegatingToEntityInstancePrototype,
})({
  constructorImplementation: Entity.reference.key.mergeDataToInstance,
})
