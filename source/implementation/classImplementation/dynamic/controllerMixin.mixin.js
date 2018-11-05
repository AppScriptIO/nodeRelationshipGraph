import { Mixin } from 'mixwith'
import { classDecorator as prototypeChainDebug} from '@dependency/prototypeChainDebug'
import { add, execute, applyMixin, conditional } from '@dependency/commonPattern/source/decoratorUtility.js'
import assert from "assert"

/**
 * @description Extends a class by super class and adds some common functionality.
 */
export let ControllerMixin = Mixin(({ Superclass }) => {
    let self = 
    @conditional({ decorator: prototypeChainDebug, condition: process.env.SZN_DEBUG })    
    class DynamicMixinController extends Superclass {
    }
    
    return self
})