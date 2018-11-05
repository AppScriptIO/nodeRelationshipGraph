import { classDecorator as prototypeChainDebug} from '@dependency/prototypeChainDebug'
import { add, execute, applyMixin, conditional } from '@dependency/commonPattern/source/decoratorUtility.js'
import { extendedSubclassPattern } from '@dependency/commonPattern/source/extendedSubclassPattern.js'
import { curried as getTableDocumentCurried } from "@dependency/databaseUtility/source/query/getTableDocument.query.js";

let databasePrefix = 'middleware_'
let getDocument = {
    'Unit': getTableDocumentCurried({ databaseName: 'webappSetting', tableName: `${databasePrefix}unit` }),
    'File': getTableDocumentCurried({ databaseName: 'webappSetting', tableName: `${databasePrefix}file` }),
}

export function UnitFunction({ Superclass }) {
    let self = 
        @conditional({ decorator: prototypeChainDebug, condition: process.env.SZN_DEBUG })
        @extendedSubclassPattern.Subclass()
        class Unit extends Superclass {
            async pupolateUnitWithFile() {
                await super.pupolateUnitWithFile({
                    getDocument: getDocument['File'],
                    fileKey: this.fileKey,
                    extract: { destinationKey: 'file' }
                })
            }
        }
    return self
}