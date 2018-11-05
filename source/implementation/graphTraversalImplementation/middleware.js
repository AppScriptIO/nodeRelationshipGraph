export function middleware({thisArg}) { // function wrapper to set thisArg on implementaion object functions.

    let self = {
        /**
         * 
         * @return {Array of Objects}  each object contains instruction settings to be used through an implementing module.
         */
        async initializeNestedUnit({ nestedUnitKey, additionalChildNestedUnit = [], pathPointerKey = null }) { // Entrypoint Instance
            assert(nestedUnitKey, `• ${nestedUnitKey} Key should be present. The passed value is either undefined, null, or empty string.`)

            // [1] get nestedUnit
            let nestedUnitInstance = await this.getNestedUnit({ nestedUnitKey, additionalChildNestedUnit, pathPointerKey })
             let { unitKey: unitKey } = nestedUnitInstance
            let unitInstance = await this.getUnit({ unitKey })
            await unitInstance.pupolateUnitWithFile()
            
            let middlewareArray = []
            middlewareArray.push(unitInstance)

            // [3] Iterate over insertion points
            let subsequentMiddleware = await nestedUnitInstance.loopInsertionPoint({ type: 'aggregateIntoArray' })
             
            if(middlewareArray.length != 0) {
                await Array.prototype.push.apply(middlewareArray, subsequentMiddleware)
            } else {
                middlewareArray = await subsequentMiddleware.slice()
            }
            return middlewareArray
        }

        traversePort: async function aggregateIntoArray() {
            let array = []
            if(this.insertionPoint) { // get callback from subtrees
                for (let insertionPoint of this.insertionPoint) {
                    let children = await this.filterAndOrderChildren({ insertionPointKey: insertionPoint.key })                                        
                    let subsequentArray = await this.initializeInsertionPoint({ insertionPoint, children })
                    if(array.length != 0) {
                        await Array.prototype.push.apply(array, subsequentArray)
                    } else {
                        array = await subsequentArray.slice()
                    }
                }
            }
            return array;
        }
    
    }
    
    Object.keys(self).forEach(function(key) {
        self[key] = self[key].bind(thisArg)
    }, {})
    return self
}