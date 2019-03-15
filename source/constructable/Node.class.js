import assert from 'assert'
import { classDecorator as prototypeChainDebug} from '@dependency/prototypeChainDebug'
import { add, execute, conditional } from '@dependency/commonPattern/source/decoratorUtility.js'
import { extendedSubclassPattern } from '@dependency/commonPattern/source/extendedSubclassPattern.js'

export function NodeFunction({ Superclass, getDocumentQuery } = {}) {
    let self = 
    @conditional({ decorator: prototypeChainDebug, condition: process.env.SZN_DEBUG })
    @execute({ staticMethod: 'initializeStaticClass', args: [] })
    @extendedSubclassPattern.Subclass() // in case specificNestedUnit subclass isn't registered, this class will be used as Controller subclass when called. 
    class Node extends Superclass {

        static getDocumentQuery;

        static initializeStaticClass(self) {
            self.getDocumentQuery = getDocumentQuery 
        }

        constructor(databaseDocumentKey) {
            super()
            this.key = databaseDocumentKey
            return this
        }
        
        /**
         * Directed Graph - Graph that can have opposite pointers between same 2 nodes.
         * Oriented graph is a directed graph that has only one directrion between each 2 nodes (i.e. one arrow pointing to one direction from node to node)
         * TODO: change 'initializeNestedUnit' to 'traverseGraph'
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
        async traverseGraph({
            implementationType,
            nodeInstance,
            additionalChildNode,
            nodeConnectionKey
        } = {}) { // Entrypoint Instance
            console.log('default traverse Graph executed.')
        }

    }
    
    return self
}
