import { Mixin } from 'mixwith'
import { classDecorator as prototypeChainDebug} from '@dependency/prototypeChainDebug'
import { add, execute, applyMixin, conditional } from '@dependency/commonPattern/source/decoratorUtility.js'
import assert from "assert"

/**
 * @description Extends a class by super class and adds some common functionality.
 */
export default Mixin(({ Superclass }) => {
    let self = 
    @conditional({ decorator: prototypeChainDebug, condition: process.env.SZN_DEBUG })    
    class ConditionMixin extends Superclass {

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
    }
    
    return self
})