export function shellscript({thisArg}) { // function wrapper to set thisArg on implementaion object functions.

    let self = {
        /**
         * @description when first called "this" context is assigned to the AppInstance for the comming request. And on subsequest calls it is assigned to the nestedUnit instance.
         * 
         * @param {any} {nestedUnitKey} 
         * @returns { Object || False } Object containing instruction settings to be used through an implementing module.
         */
        async initializeNestedUnit({ nestedUnitKey, additionalChildNestedUnit = [], pathPointerKey = null }) { // Entrypoint Instance         
            assert(nestedUnitKey, '• Key should be present. The passed value is either undefined, null, or empty string.')

            // [1] get nestedUnit
            let nestedUnitInstance = await this.getNestedUnit({ nestedUnitKey, additionalChildNestedUnit, pathPointerKey })
            
            if(nestedUnitInstance.unit) {
                let { unit: unitKey} = nestedUnitInstance
                let unitInstance = await this.getUnit({ unitKey })
                // execute command
                await unitInstance.executeScript()
            }
            
            // [3] Iterate over insertion points
            await nestedUnitInstance.loopInsertionPoint({ type: 'executeScript' })
        }

        traversePort: async function executeScript() {
            for (let insertionPoint of this.insertionPoint) {
                // [1] get children immediate & relating to this insertion position.
                let children = await this.filterAndOrderChildren({ insertionPointKey: insertionPoint.key })                
                // let children = await this.filterChildrenOfCurrentInsertionPoint({ insertionPointKey: insertionPoint.key })
                await this.initializeInsertionPoint({ insertionPoint, children })
            }
        }
    
    }
    
    Object.keys(self).forEach(function(key) {
        self[key] = self[key].bind(thisArg)
    }, {})
    return self
}