import assert from 'assert'
import { Entity, Constructable, symbol } from '@dependency/entity'
import { ImplementationManagement } from './ImplementationManagement.class.js'
import { MultipleDelegation } from '@dependency/multiplePrototypeDelegation'

/**
 ** GraphTraversal system for supporting different graph implementation (concrete behavior of plugin that will be used in the client target).
 */
export const { class: GraphTraversal, reference: Reference, constructablePrototype: Prototype, entityPrototype } = new ImplementationManagement.clientInterface({ description: 'GraphTraversal' })

/*
   ____       __                                 ___     ____            _        _                    
  |  _ \ ___ / _| ___ _ __ ___ _ __   ___ ___   ( _ )   |  _ \ _ __ ___ | |_ ___ | |_ _   _ _ __   ___ 
  | |_) / _ \ |_ / _ \ '__/ _ \ '_ \ / __/ _ \  / _ \/\ | |_) | '__/ _ \| __/ _ \| __| | | | '_ \ / _ \
  |  _ <  __/  _|  __/ | |  __/ | | | (_|  __/ | (_>  < |  __/| | | (_) | || (_) | |_| |_| | |_) |  __/
  |_| \_\___|_|  \___|_|  \___|_| |_|\___\___|  \___/\/ |_|   |_|  \___/ \__\___/ \__|\__, | .__/ \___|
                                                                                      |___/|_|         
*/
Object.assign(Reference, {
  key: {},
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
  //  concerete behavior initialization on the target instance.
  [Entity.reference.key.concereteBehavior]({ constructorCallback, currentConcereteBehavior }) {
    return new Proxy(constructorCallback, {
      apply(target, thisArg, [{ data }]) {
        // let key = data.key
        let instance = Reflect.apply(...arguments)
        MultipleDelegation.addDelegation({ targetObject: instance, delegationList: [currentConcereteBehavior] })
        return instance
      },
    })
  },

  // // set default parameters and make them accessible to following decorator functions wrapping the target method.
  // @(function defaultParameters(targetClass, methodName, propertyDescriptor) {
  //   propertyDescriptor.value = new Proxy(propertyDescriptor.value, {
  //     apply: async (target, thisArg, argumentsList) => {
  //       let defaultArgs = [
  //         {
  //           implementationType: thisArg.sharedContext.traversalImplementationType,
  //           nodeInstance: thisArg, // the current node to interact with.
  //           additionalChildNode: [], // child nodes to add to the current node's children. These are added indirectly to a node without changing the node's children itself, as a way to extend current nodes.
  //           nodeConnectionKey: null, // pathPointerKey
  //         },
  //       ]
  //       argumentsList = defaultArgs.map((defaultValue, index) => {
  //         let passedValue = argumentsList[index]
  //         if (typeof passedValue == 'object' && typeof defaultValue == 'object') {
  //           return Object.assign(defaultValue, passedValue)
  //         } else if (!passedValue) {
  //           return defaultValue
  //         } else {
  //           passedValue
  //         }
  //       })
  //       return target.apply(thisArg, argumentsList)
  //     },
  //   })
  //   return propertyDescriptor
  // })
  // // Read traversal implementation configuration from Node instance and run implementation run implementaion
  // @(function runImplementation(targetClass, methodName, propertyDescriptor) {
  //   let proxyHandler = {
  //     apply: async (target, thisArg, argumentsList) => {
  //       let { implementationType, nodeInstance } = argumentsList[0]
  //       if (!implementationType && nodeInstance.tag) implementationType = nodeInstance.tag.traversalImplementationType

  //       if (implementationType) {
  //         let controller = thisArg.contextInstance
  //         return controller.interceptMethod({ thisArg, implementationType, nodeInstance, argumentsList, methodName })
  //       } else {
  //         console.error('• no implementation selected for ' + nodeInstance.key)
  //         return Reflect.apply(arguments)
  //       }
  //     },
  //   }
  //   propertyDescriptor.value = new Proxy(propertyDescriptor.value, proxyHandler)
  //   return propertyDescriptor
  // })
  async traverseGraph({ implementationType, nodeInstance, additionalChildNode, nodeConnectionKey } = {}) {
    // Dynamic implementation - not restricted to specific initialization algorithm, rather choosen from setting of each node in the traversed graph.
    let traversalImplementation = this[ImplementationManagement.reference.key.getter]()
    console.log('Traverse Graph executed. ')
    traversalImplementation |> console.log
    // TODO: Usage of async generators will prevent handing the control to called function (against `Run-to-complete` principle), and will allow interceptin the execution mid way.
    // execute to complete vs intercepting execution & keeping control
    // let iteratorObject = Traverse*(Node)
    // While loop if(result.done) let finalNodeResult = resultArray // do something with result array
    // iteratorObject.next().value |> result.push
    // return await nodeInstance.traverseGraph(arguments)
  },
})

/*
   ___       _ _   _       _ _         
  |_ _|_ __ (_) |_(_) __ _| (_)_______ 
   | || '_ \| | __| |/ _` | | |_  / _ \
   | || | | | | |_| | (_| | | |/ /  __/
  |___|_| |_|_|\__|_|\__,_|_|_/___\___|
*/
GraphTraversal::GraphTraversal[Constructable.reference.initialize.functionality].setter({})

/*
    ____ _ _            _     _ _                    __                
   / ___| (_) ___ _ __ | |_  (_) |_ _ __   ___ _ __ / _| __ _  ___ ___ 
  | |   | | |/ _ \ '_ \| __| | | __| '_ \ / _ \ '__| |_ / _` |/ __/ _ \
  | |___| | |  __/ | | | |_  | | |_| | | |  __/ |  |  _| (_| | (_|  __/
   \____|_|_|\___|_| |_|\__| |_|\__|_| |_|\___|_|  |_|  \__,_|\___\___|
*/
GraphTraversal.clientInterface = GraphTraversal::Prototype[Constructable.reference.clientInterface.functionality].switch({
  implementationKey: Entity.reference.key.instanceDelegatingToEntityInstancePrototype,
})({
  constructorImplementation: Entity.reference.key.handleDataInstance,
})
