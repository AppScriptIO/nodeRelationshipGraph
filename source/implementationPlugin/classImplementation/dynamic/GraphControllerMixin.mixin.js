import { Mixin } from 'mixwith'
import { classDecorator as prototypeChainDebug} from '@dependency/prototypeChainDebug'
import { add, execute, applyMixin, conditional } from '@dependency/commonPattern/source/decoratorUtility.js'
import assert from "assert"

/**
 * // Dynamic implementation - not restricted to specific initialization algorithm, rather choosen from setting of each node in the traversed graph.
 * @description Extends a class by super class and adds some common functionality.
 */
export let GraphControllerMixin = Mixin(({ Superclass }) => {
    let self = 
    @conditional({ decorator: prototypeChainDebug, condition: process.env.SZN_DEBUG })    
    class DynamicMixinController extends Superclass {
    }
    
    return self
})