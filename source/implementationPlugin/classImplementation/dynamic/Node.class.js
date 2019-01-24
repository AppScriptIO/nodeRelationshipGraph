import r from 'rethinkdb'
import { classDecorator as prototypeChainDebug} from '@dependency/prototypeChainDebug'
import { add, execute, applyMixin, conditional } from '@dependency/commonPattern/source/decoratorUtility.js'
import promiseProperRace from '@dependency/promiseProperRace'
import { extendedSubclassPattern } from '@dependency/commonPattern/source/extendedSubclassPattern.js'

export function NodeFunction({ Superclass }) {
    let self = 
        @conditional({ decorator: prototypeChainDebug, condition: process.env.SZN_DEBUG })
        @extendedSubclassPattern.Subclass()            
        class ImplementationNode extends Superclass {
        }
    return self
}