/**
 * @description loops through all the insertion points and initializes each one to execute the children specific for it.
 * 
 * @param {Class Instance} nestedUnitInstance Tree instance of the module using "reusableNestedUnit" pattern. instance should have "initializeInsertionPoint" function & "insertionPoint" Array.
 * @returns undifiend for false or any type of value depending on the module being applied.
 */
export function condition({thisArg}) { // function wrapper to set thisArg on implementaion object functions.

    let self = {
        /**
         * @description when first called "this" context is assigned to the AppInstance for the comming request. And on subsequest calls it is assigned to the nestedUnit instance.
         * 
         * @param {any} {nestedUnitKey} 
         * @returns { Object || False } Object containing instruction settings to be used through an implementing module.
         */
        async initializeNestedUnit({ nestedUnitKey, additionalChildNestedUnit = [], pathPointerKey = null}) { // Entrypoint Instance  
            assert(nestedUnitKey, `• "${nestedUnitKey}" Key should be present. The passed value is either undefined, null, or empty string.`)
            // [1] get nestedUnit
            let nestedUnitInstance = await this.getNestedUnit({ nestedUnitKey, additionalChildNestedUnit, pathPointerKey })

            let conditionMet;
            if(nestedUnitInstance.unitKey) {
                let { unitKey:unitKey } = nestedUnitInstance
                assert(unitKey, `• "${unitKey}" nestedUnit should have a unitKey field. The passed value is either undefined, null, or empty string.`)
                let unitInstance = await this.getUnit({ unitKey })
                await unitInstance.pupolateUnitWithFile()
                conditionMet = await unitInstance.checkCondition()
            } else { // if no unitKey set, then the neseted unit is considered a holder for other nested units and should pass to the nested children.
                conditionMet = true
            }
            
            // [3] Iterate over insertion points
            let callback;
            if (conditionMet) {
                callback = await nestedUnitInstance.loopInsertionPoint({ type: 'returnedFirstValue' })
                // if all subtrees rejected, get immediate callback
                if(!callback && 'callback' in  nestedUnitInstance) callback = nestedUnitInstance.callback // fallback to immediate callback of instance.
            }

            // [4] Callback
            return (callback) ? callback : false;
        }        

        traversePort: async function returnedFirstValue() {
            let returned;
            // get callback from subtrees
            for (let insertionPoint of this.insertionPoint) {
                // [1] get children immediate & relating to this insertion position.
                let children = await this.filterAndOrderChildren({ insertionPointKey: insertionPoint.key })                
                // let children = await this.filterChildrenOfCurrentInsertionPoint({ insertionPointKey: insertionPoint.key })
                returned = await this.initializeInsertionPoint({ insertionPoint, children })
                if (returned) break
            }
            return returned;        
        }
    
    }
    
    Object.keys(self).forEach(function(key) {
        self[key] = self[key].bind(thisArg)
    }, {})
    return self
}