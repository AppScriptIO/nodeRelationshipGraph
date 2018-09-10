// import { Condition } from 'appscript/module/condition'
import r from 'rethinkdb'
import _ from 'underscore'
import filesystem from 'fs'
import { classDecorator as prototypeChainDebug} from '@dependency/prototypeChainDebug'
import { add, execute, applyMixin, conditional } from '@dependency/commonPattern/source/decoratorUtility.js'
import { extendedSubclassPattern } from '@dependency/commonPattern/source/extendedSubclassPattern.js'
import { curried as getTableDocumentCurried } from "@dependency/databaseUtility/source/query/getTableDocument.query.js";

let databasePrefix = 'template_'
let getDocument = {
    NestedUnit: getTableDocumentCurried({ databaseName: 'webappSetting', tableName: `${databasePrefix}nestedUnit` }),
}

export default ({ Superclass }) => {
    let self = 
        @conditional({ decorator: prototypeChainDebug, condition: process.env.SZN_DEBUG })  
        @execute({ 
            staticMethod: 'initializeStaticClass', 
            args: [ getDocument['NestedUnit'] ]
        })
        @extendedSubclassPattern.Subclass()
        class NestedUnit extends Superclass {

        }
    
    return self
}