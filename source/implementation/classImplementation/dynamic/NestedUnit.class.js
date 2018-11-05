import r from 'rethinkdb'
import { classDecorator as prototypeChainDebug} from '@dependency/prototypeChainDebug'
import { add, execute, applyMixin, conditional } from '@dependency/commonPattern/source/decoratorUtility.js'
import promiseProperRace from '@dependency/promiseProperRace'
import { extendedSubclassPattern } from '@dependency/commonPattern/source/extendedSubclassPattern.js'

export function NestedUnitFunction({ Superclass }) {
    let self = 
        @conditional({ decorator: prototypeChainDebug, condition: process.env.SZN_DEBUG })
        // @execute({ staticMethod: 'initializeStaticClass', args: [] }) // Remove this line to prevent execution twice
        @extendedSubclassPattern.Subclass()            
        class NestedUnit extends Superclass {

        }
    return self
}