import assert from 'assert'
import promiseProperRace from '@dependency/promiseProperRace'

export function aggregateIntoArray({thisArg}) { // function wrapper to set thisArg on implementaion object functions.

    let self = {

        // TODO: specify the parameter hirerchy that will be used in graph traversal and the location of the parameters (instance, context instance, static superclass, global, whatever.)
        traverseGraph: async function*({
            nodeInstance,
            controller = nodeInstance.contextInstance, // get shared controller
            iteratePort = self.iteratePort,
            iterateConnection = self.iterateConnection,
            executeDataItem = self.executeDataItem,
            aggregationArray = [],
            subsequentArray = [],
        }) {

            // get node dataItem - either dataItem instance object or regular object
            let dataItem;
            if(nodeInstance.tag && nodeInstance.tag.dataItemType == 'reference') { // creating data item instance
                // load dataItem by reference i.e. using `key`
                dataItem = await controller.initializeDataItem.apply(controller, [{ dataItemKey: nodeInstance.dataItem && nodeInstance.dataItem.key }]) 
            } else { // default dataItem by property
                dataItem = nodeInstance.dataItem
            }
            
            // Execute node dataItem 
            let nodeResult = (dataItem) ? 
                await executeDataItem({ dataItem, executionType: nodeInstance.tag && nodeInstance.tag.executionType }) :
                null;

            // Process returned result
            aggregationArray.push(nodeResult)
            
            // Iterate over connection
            if(nodeInstance.port) {
                subsequentArray = await iteratePort({ nodePortArray: nodeInstance.port })
            } else if(nodeInstance.connection && nodeInstance.connection.length != 0) {
                subsequentArray = await iterateConnection({ nodeConnectionArray: nodeInstance.connection })
            }

            Array.prototype.push.apply(aggregationArray, subsequentArray)

            return aggregationArray
        },

        // TODO: create multiple implementations
        async initializeDataItem({
            dataItem,
            nodeInstance = thisArg,
            executionType
        }) {

            let implementationObject = {
                async getResourceFile() {

                },
            }

            // specific execution implementation
            if(executionType) {
                let callback;

                // pick implementation
                for( let index in implementationObject) {
                    if(index == executionType) {
                        callback = implementationObject[index]
                        break;
                    }
                }

                // execute implementation
                return await callback.apply(this, arguments)
            } 

            // default execution
            else return /// TODO:
        },

        async executeDataItem({
            dataItem,
            nodeInstance = thisArg,
            executionType
        }) {

            let implementationObject = {
                async returnDataItemKey() {
                    return dataItem.key
                },
                // implementation delays promises for testing `iterateConnection` of promises e.g. `allPromise`, `raceFirstPromise`, etc. 
                async timeout() {
                    let delay = dataItem.timerDelay || 0
                    return await new Promise((resolve, reject) => setTimeout(() => {
                        // console.log(`${delay}ms passed for key ${dataItem.key}.`) // debug
                        resolve(dataItem.key) 
                    }, delay))
                },
            }

            // specific execution implementation
            if(executionType) {
                let callback;

                // pick implementation
                for( let index in implementationObject) {
                    if(index == executionType) {
                        callback = implementationObject[index]
                        break;
                    }
                }

                // execute implementation
                return await callback.apply(this, arguments)
            } 

            // default execution
            else return dataItem.key
        },

        /**  
         * @description loops through all the `node ports` and initializes each one to execute the `node connections` specific for it.
         */
        async iteratePort({
            nodePortArray = thisArg.port,
            executePort = self.executePort
        }) {

                // filter port array to match outgoing ports only
                nodePortArray = nodePortArray.filter(item => item.tag.direction == 'output')

                // sort array 
                function sortAccordingToOrder(former, latter) { return former.order - latter.order } // using `order` property
                nodePortArray.sort(sortAccordingToOrder)
                
                let aggregationArray = []
                for (let nodePort of nodePortArray) {
                    let subsequentArray = await executePort({ nodePort: nodePort })
                    Array.prototype.push.apply(aggregationArray, subsequentArray)                    
                }

                return aggregationArray
        },

        /**
         * Execute node port with relevant implementation - Call correct execution type method according to `node port` settings
         */
        async executePort({
            nodePort, 
            nodeInstance = thisArg,
            iterateConnection = self.iterateConnection,
            executionTypeArray
        }) {
            // filter connection to match the current port 
            let currentPortConnectionArray = nodeInstance.connection.filter(item => item.source.portKey == nodePort.key)
    
            return await iterateConnection({ nodeConnectionArray: currentPortConnectionArray, implementationType: nodePort.tag && nodePort.tag.iterateConnectionImplementation })
        }, 

        /**
         * Loops through node connection to traverse the connected nodes' graphs
         * @param {*} nodeConnectionArray - array of connection for the particular node 
         */
        async iterateConnection({
            nodeConnectionArray = thisArg.connection || [], 
            executeConnection = self.executeConnection,
            implementationType = thisArg.tag && thisArg.tag.iterateConnectionImplementation,
            aggregationArray = []
        } = {}) {
            
            // filter connection array to match outgoing connections only
            nodeConnectionArray = nodeConnectionArray.filter(item => item.tag.direction == 'outgoing')

            // sort connection array 
            function sortAccordingToOrder(former, latter) { return former.source.position.order - latter.source.position.order } // using `order` property
            nodeConnectionArray.sort(sortAccordingToOrder)

            let implementationObject = {
                // implementation using plain "for loops" which wait for async function 
                async simpleChronological() {
                    for (let nodeConnection of nodeConnectionArray) {
                        let subsequentArray = await executeConnection({ nodeConnection })
                        Array.prototype.push.apply(aggregationArray, subsequentArray)
                    }
                    aggregationArray = aggregationArray.filter(item => item) // remove null results, where nested unit is not executed (i.e. fields are not mentioned i nthe request.)
                    return aggregationArray
                },
                // implementation using array.reduce to sequentially accumolate values from `async functions`.
                async chronological() {
                    let array = await nodeConnectionArray.reduce(async (accumulatorPromise, nodeConnection, index) => { // sequential accumolation of results
                        let accumulatorArray = await accumulatorPromise
                        let subsequentResult = await executeConnection({ nodeConnection })

                        // subsequentResult can be an array or single item
                        let subsequentArray = Array.isArray(subsequentResult) ? subsequentResult : [ subsequentResult ]; // change to array if not

                        // cocatinate arrays 
                        (accumulatorArray.length != 0) ? 
                            Array.prototype.push.apply(accumulatorArray, subsequentArray) : 
                            accumulatorArray = subsequentArray.slice() // prevents error when acculator is not an array. 
                        
                        return accumulatorArray
                    }, Promise.resolve([]))
                    return array
                },
                /**
                 * Insures all nodeConnection promises resolves. 
                 * Preserves the order of nodes original in connection array, i.e. does not order the node results according to the execution completion, rather according to the first visited during traversal. 
                 **/ 
                async allPromise() {
                    let nodePromiseArray = []
                    nodePromiseArray = nodeConnectionArray.map(nodeConnection => {
                        return new Promise(async (resolve, reject) => {
                            let result = await executeConnection({ nodeConnection })
                            resolve(result)
                        })
                    })
                
                    let nodeResolvedResultArray = await Promise.all(nodePromiseArray)
                        .catch(error => {
                            if(process.env.SZN_DEBUG == 'true') console.error(`🔀⚠️ \`Promise.all\` for nodeConnectionArray rejected because: ${error}`) 
                            else console.log(error)
                        })

                    let array = nodeResolvedResultArray
                        .reduce((accumulatorArray, nodeResult, index) => {
                            let subsequentArray = Array.isArray(nodeResult) ? nodeResult : [ nodeResult ];

                            // cocatinate arrays 
                            (accumulatorArray.length != 0) ? 
                                Array.prototype.push.apply(accumulatorArray, subsequentArray) : 
                                accumulatorArray = subsequentArray.slice() // prevents error when acculator is not an array. 

                            return accumulatorArray
                        }, [])
                        .filter(item => item) // remove null results, where nested unit is not executed (i.e. fields are not mentioned i nthe request.)
                    return array;
                },
                /**
                 * Race promise of nodes - first to resolve is the one to be returned
                 */
                async raceFirstPromise() {
                    let nodePromiseArray = []
                    nodePromiseArray = nodeConnectionArray.map(nodeConnection => {
                        return new Promise(async (resolve, reject) => {
                            try {
                                let result = await executeConnection({ nodeConnection })
                                resolve(result)
                            } catch (error) {
                                reject(error)
                            }
                        })
                    })
                
                    let nodeResolvedResult =
                        await promiseProperRace(nodePromiseArray)
                            .then( resolvedPromiseArray => {
                                return resolvedPromiseArray[0] // as only one promise is return in the array - the first promise to be resolved.
                            })
                            .catch(error => {
                                if(process.env.SZN_DEBUG == 'true') console.error(`🔀⚠️ promiseProperRace rejected because: ${error}`) 
                                else console.log(`🔀⚠️ promiseProperRace rejected because: ${error}`) 
                            })
                    return nodeResolvedResult ? nodeResolvedResult : false;
                },
            }
            
            // retreive matching implementation to execute.
            let callback;
            for( let index in implementationObject) {
                if(index == implementationType) {
                    callback = implementationObject[index]
                    break;
                }
            }
            // set fallback value for callback function
            // in case `implementationType` exist, i.e. was not found in the registered implemenation array.
            if(!callback && implementationType) console.error(`• no implementation found for "${implementationType}", node connection iteration stopped.`)
            // default implementation
            else if(!callback) callback = implementationObject['simpleChronological']
                        
            // execute implementation
            return callback.apply(this, arguments)
        },

        /**
         * Execute node connection implementation
         */
        async executeConnection({
            nodeConnection, 
            iterateDestinationNode = self.iterateDestinationNode, 
        }) {
            return await iterateDestinationNode({ connectionDestinationNodeArray: nodeConnection.destination.node })
        }, 

        /**
         * Loop through connected nodes
         */
        async iterateDestinationNode({
            connectionDestinationNodeArray,
            executeDestinationNode = self.executeDestinationNode, 
            aggregationArray = []
        } = {}) {
            // iteration implementaiton
            for (let destinationNode of connectionDestinationNodeArray) {
                let subsequentArray = await executeDestinationNode({ destinationNodeKey: destinationNode.key })
                Array.prototype.push.apply(aggregationArray, subsequentArray)
            }
            return aggregationArray
        },

        /**
         * Execute connection destination node implementation
         */
        async executeDestinationNode({
            destinationNodeKey, 
            controller = thisArg.contextInstance
        }) {
            return await controller.traverseGraph({ nodeKey: destinationNodeKey })
        },

        /**
         * @description filters & modifies array by removing truthy indexes.
         * 
         * @param {any} {insertionPointKey, insertionPath = null} 
         * @returns 
         */
        async filterAndOrderChildren({ insertionPointKey, children = this.children }) {
            let ownFilteredChildren = await this.filterAndModifyChildrenArray(children, insertionPointKey, null)
            let additionalFilteredChildren = await this.filterAndModifyChildrenArray(this.additionalChildNestedUnit, insertionPointKey, this.pathPointerKey)
            let merged = await this.mergeAndOrderChildren(ownFilteredChildren, additionalFilteredChildren);
            return merged
        },
        /**
         * Get children corresponding to the current insertion point.
         * // Take into consideration the indirect children added from previous (inhereted) trees.
         * // filteredTreeChildren + immediateNextChildren
         * // let nextChildren;
         */
        async filterAndModifyChildrenArray(children, insertionPointKey, pathPointerKey) {
            return children.filter((child, index) => { // filter children that correspont to the current insertionpoint.
                let result = (
                    child.insertionPosition.insertionPoint == insertionPointKey &&
                    child.insertionPosition.insertionPathPointer == pathPointerKey
                )
                // if (result) children.splice(index, 1); // was ment to increase the performance of the program, preventing rechecking of already checked array items. But it causes some issues.
                return result
            })
        },
        // order additional children that will be mixed into ownChildren. According to a setting that needs to be added into each child object.
        async mergeAndOrderChildren(ownFilteredChildren, additionalFilteredChildren) {
            // metrge 2 arrays., appending one to the other.
            // let filteredChildren = []
            // await Array.prototype.push.apply(filteredChildren, ownFilteredChildren, additionalFilteredChildren);
            let firstChildren = [],
                lastChildren = [],
                orderedChildren = []
            await additionalFilteredChildren.sort((prior, subsequent) => {
                return (prior.order <= subsequent.order) ? 1 : -1;
            })
            await ownFilteredChildren.sort((prior, subsequent) => {
                return (prior.order <= subsequent.order) ? 1 : -1;
            })

            // filter children that correspont to the current insertionpoint.
            additionalFilteredChildren = additionalFilteredChildren.filter((child, index) => { 
                // default fallback is to add the child to the beginning/end of the array, in case no pathPointerKey is specified (pathPointerKey decides which node to place the child relative to).
                if ( !child.insertionPosition.placement.pathPointer && child.insertionPosition.placement.type ) {
                    switch (child.insertionPosition.placement.type) {
                        case 'before':
                            firstChildren.push(child)
                        break;
                        case 'after':
                        default:
                            lastChildren.push(child)
                        break;
                    }
                    return false
                    // additionalFilteredChildren.splice(index, 1);
                }
                return true
            })

            // insert additional child if it matches current child path pointer key.
            ownFilteredChildren.map((ownChild, ownChildIndex) => {
                orderedChildren.push(ownChild) // add child to ordered array
                let currentChildPosition =  orderedChildren.length - 1 // last array item index.
                additionalFilteredChildren.map((additionalChild, additionalChildIndex) => {
                    if (additionalChild.insertionPosition.placement.type
                        && additionalChild.insertionPosition.placement.pathPointer
                        && additionalChild.insertionPosition.placement.pathPointer == ownChild.pathPointerKey
                    ) {
                        switch (additionalChild.insertionPosition.placement.type) {
                            case 'before':
                                orderedChildren.splice(currentChildPosition, 0, additionalChild) // insert before currentPosition
                            break;
                            case 'after':
                            default:
                                orderedChildren.splice(currentChildPosition + 1, 0, additionalChild) // insert after currentPosition.
                            break;
                        }
                    }
                })
            })

            return Array.prototype.concat(firstChildren, orderedChildren, lastChildren)
        },

        async addAdditionalChildNestedUnit({ nestedUnit }) {
            // Add the rest of the immediate children to the next tree as additional children. propagate children to the next tree.
            if(nestedUnit.children.length != 0) {
                await Array.prototype.push.apply(nestedUnit.children, nestedUnit.additionalChildNestedUnit)
            } else {
                nestedUnit.children = await nestedUnit.additionalChildNestedUnit.slice()
            }
        },

    }
    
    Object.keys(self).forEach(function(key) {
        self[key] = self[key].bind(thisArg)
    }, {})
    return self
}