import assert from 'assert'
import { Entity, Constructable, symbol } from '@dependency/entity'

/**
 * ! `getDocumentQuery` should be passed for configured constructable, i.e. used in group of instances.
 * ! Instance inherited from `Superclass`
 */
export const Node = new Entity.clientInterface({ description: 'Node' })

/*
   ____       __                                 ___     ____            _        _                    
  |  _ \ ___ / _| ___ _ __ ___ _ __   ___ ___   ( _ )   |  _ \ _ __ ___ | |_ ___ | |_ _   _ _ __   ___ 
  | |_) / _ \ |_ / _ \ '__/ _ \ '_ \ / __/ _ \  / _ \/\ | |_) | '__/ _ \| __/ _ \| __| | | | '_ \ / _ \
  |  _ <  __/  _|  __/ | |  __/ | | | (_|  __/ | (_>  < |  __/| | | (_) | || (_) | |_| |_| | |_) |  __/
  |_| \_\___|_|  \___|_|  \___|_| |_|\___\___|  \___/\/ |_|   |_|  \___/ \__\___/ \__|\__, | .__/ \___|
                                                                                      |___/|_|         
*/
const Reference = Object.assign(Node[Constructable.reference.reference], {})
const Prototype = Object.assign(Node[Constructable.reference.prototype], {})

/*
                   _        _                    ____       _                  _   _             
   _ __  _ __ ___ | |_ ___ | |_ _   _ _ __   ___|  _ \  ___| | ___  __ _  __ _| |_(_) ___  _ __  
  | '_ \| '__/ _ \| __/ _ \| __| | | | '_ \ / _ \ | | |/ _ \ |/ _ \/ _` |/ _` | __| |/ _ \| '_ \ 
  | |_) | | | (_) | || (_) | |_| |_| | |_) |  __/ |_| |  __/ |  __/ (_| | (_| | |_| | (_) | | | |
  | .__/|_|  \___/ \__\___/ \__|\__, | .__/ \___|____/ \___|_|\___|\__, |\__,_|\__|_|\___/|_| |_|
  |_|                           |___/|_|                           |___/                         
*/
Reference.prototypeDelegation = {
  key: {},
}
Prototype[Constructable.reference.prototypeDelegation.setter.list]({})
Object.assign(Node[Constructable.reference.prototypeDelegation.getter.list](Entity.reference.prototypeDelegation.key.entity).prototype, {
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
Prototype[Constructable.reference.initialize.setter.list]({
  [Reference.initialize.key.entity]({ targetInstance, databaseDocumentKey }, previousResult /* in case multiple constructor function found and executed. */) {
    targetInstance.key = databaseDocumentKey
    return targetInstance
  },
})

/*
    ____ _ _            _     _ _                    __                
   / ___| (_) ___ _ __ | |_  (_) |_ _ __   ___ _ __ / _| __ _  ___ ___ 
  | |   | | |/ _ \ '_ \| __| | | __| '_ \ / _ \ '__| |_ / _` |/ __/ _ \
  | |___| | |  __/ | | | |_  | | |_| | | |  __/ |  |  _| (_| | (_|  __/
   \____|_|_|\___|_| |_|\__| |_|\__|_| |_|\___|_|  |_|  \__,_|\___\___|
*/
Node.clientInterface =
  Prototype[Constructable.reference.clientInterface.switch]({ implementationKey: Entity.reference.clientInterface.key.instanceDelegatingToClassPrototype })
  |> (g =>
    g.next('intermittent') &&
    g.next({
      constructorImplementation: Entity.reference.constructor.key.data,
      argumentListAdapter: argumentList => {
        argumentList[0] = { data: argumentList[0] }
        return argumentList
      },
    }).value)
