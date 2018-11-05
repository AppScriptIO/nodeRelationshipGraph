import { classDecorator as prototypeChainDebug} from '@dependency/prototypeChainDebug'
import { add, execute, applyMixin, conditional, executeOnceForEachInstance } from '@dependency/commonPattern/source/decoratorUtility.js'
import { extendedSubclassPattern } from '@dependency/commonPattern/source/extendedSubclassPattern.js'
import { curried as getTableDocumentCurried } from "@dependency/databaseUtility/source/query/getTableDocument.query.js";

let databasePrefix = 'condition_'
let getDocument = {
    Unit: getTableDocumentCurried({ databaseName: 'webappSetting', tableName: `${databasePrefix}unit` }),
    File: getTableDocumentCurried({ databaseName: 'webappSetting', tableName: `${databasePrefix}file` }),
}

export function UnitFunction({ Superclass }) {
    let self = 
        @conditional({ decorator: prototypeChainDebug, condition: process.env.SZN_DEBUG })
        @execute({
            staticMethod: 'initializeStaticClass', 
            args: [ getDocument['Unit'] ] 
        })
        @extendedSubclassPattern.Subclass()
        class Unit extends Superclass {
            async pupolateUnitWithFile() {
                await super.pupolateUnitWithFile({
                    getDocument: getDocument['File'],
                    fileKey: this.fileKey, // valueReturningFile
                    extract: { destinationKey: 'file' }
                })
            }

            @executeOnceForEachInstance()                        
            async checkCondition() {
                // [2] require & check condition
                if(!this.conditionResult) {
                    let expectedReturn = this.expectedReturn
                    let filePath = this.file.filePath
                    let returnedValue = await require(filePath).default(this.portAppInstance)
                    if(process.env.SZN_DEBUG == 'true' && this.portAppInstance.context.headers.debug == 'true') console.log(`🔀 Comparing conditionKey: ${this.key} ${filePath}. \n • expected: ${expectedReturn} == ${returnedValue}. \n • compare result: ${(returnedValue == expectedReturn)} \n \n`)
                    this.conditionResult = (returnedValue == expectedReturn) ? true : false;            
                }
                return  this.conditionResult
            }
        }
    
    return self
}