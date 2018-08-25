import { classDecorator as prototypeChainDebug} from '@dependency/prototypeChainDebug'
import { add, execute, applyMixin, conditional, executeOnceForEachInstance } from '@dependency/commonPattern/source/decoratorUtility.js'
import { extendedSubclassPattern } from '@dependency/commonPattern/source/extendedSubclassPattern.js'
import { curried as getTableDocumentCurried } from "@dependency/databaseUtility/source/getTableDocument.query.js";

let databasePrefix = 'schema_'
let getDocument = {
    'Unit': getTableDocumentCurried({ databaseName: 'webappSetting', tableName: `${databasePrefix}unit` }),
    'File': getTableDocumentCurried({ databaseName: 'webappSetting', tableName: `${databasePrefix}file` }),
}

export default ({ Superclass }) => {
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
                    fileKey: this.fileKey,
                    extract: { destinationKey: 'file' }
                })
            }

            async resolveDataset({ 
                parentResult = null,
                // this.args - nestedUnit args field.
            }) {
                // [2] require & check condition
                let dataset;
                const algorithm = this.file.algorithm // resolver for dataset
                switch (algorithm.type) { // in order to choose how to handle the algorithm (as a module ? a file to be imported ?...)
                    case 'file':
                    default: {
                        let module = require(algorithm.path).default
                        if(typeof module !== 'function') module = module.default // case es6 module loaded with require function (will load it as an object)
                        let resolver = module() /*initial execute for setting parameter context.*/
                        let resolverArgument = Object.assign(...[this.args, algorithm.argument].filter(Boolean)) // remove undefined/null/false objects before merging.
                        dataset = await resolver({
                            portClassInstance: this.portAppInstance, // contains also portClassInstance.context of the request. 
                            args: resolverArgument,
                            parentResult, // parent dataset result.
                        })
                    } break;
                }

                return dataset
            }

        }
    return self
}