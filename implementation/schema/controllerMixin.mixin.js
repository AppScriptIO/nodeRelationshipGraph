import { Mixin } from 'mixwith'
import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { add, execute, applyMixin, conditional, executionLevel } from 'appscript/utilityFunction/decoratorUtility.js'
import assert from "assert"

/**
 * @description Extends a class by super class and adds some common functionality.
 */
export default Mixin(({ Superclass }) => {
    let self = 
    @conditional({ decorator: prototypeChainDebug, condition: process.env.SZN_DEBUG })    
    class MiddlewareMixin extends Superclass {

        /**
         * 
         * @return {Array of Objects}  each object contains instruction settings to be used through an implementing module.
         */
        /* exmple request body: 
        {
            "fieldName": "article",
            "field": [
                {
                    "fieldName": "title",
                    "field": []
                },
                {
                    "fieldName": "paragraph",
                    "field": []
                }
            ],
            "schemaMode": "nonStrict", // allow empty datasets for specified fields in the nested unit schema.
            "extrafield": true // includes fields that are not extracted using the schema.
        } */
        @executionLevel()        
        async initializeNestedUnit({ 
            nestedUnitKey, 
            additionalChildNestedUnit = [], 
            pathPointerKey = null, 
            parent = this,
            argument = {}
        }) { // Entrypoint Instance
            
            assert(nestedUnitKey, '• Key should be present. The passed value is either undefined, null, or empty string.')
            
            // [1] get nestedUnit
            let nestedUnitInstance = await this.getNestedUnit({ nestedUnitKey, additionalChildNestedUnit, pathPointerKey })
            let { unitKey: unitKey } = nestedUnitInstance
            let unitInstance = await this.getUnit({ unitKey })
            await unitInstance.pupolateUnitWithFile()

            // extract request data action arguments. arguments for a query/mutation/subscription.
            if(this.executionLevel == 'topLevel') {
                nestedUnitInstance.requestOption = this.portAppInstance.context.request.body
            } else { // child/nested
                let fieldArray = parent.requestOption.field // object array
                if(fieldArray && fieldArray.length == 0 || !fieldArray) { 
                    nestedUnitInstance.requestOption = {} // continue to resolve dataset and all subsequent Nestedunits of nested dataset in case are objects.
                } else if(fieldArray) {
                    nestedUnitInstance.requestOption = fieldArray.find(field => field.fieldName == unitInstance.fieldName) // where fieldNames match
                }
            }

            // check if fieldname exists in the request option, if not skip nested unit.
            if(!nestedUnitInstance.requestOption) return; // fieldName was not specified in the parent nestedUnit, therefore skip its execution
            nestedUnitInstance.dataset = await unitInstance.resolveDataset({ parentResult: argument.dataset || parent.dataset })
            // TODO: Fix requestOption - i.e. above it is used to pass "field" option only.
            if(this.portAppInstance.context.request.body.schemaMode == "nonStrict") { // Don't enforce strict schema, i.e. all nested children should exist.
                // if(nestedUnitInstance.dataset) nestedUnitInstance.dataset = null // TODO: throws error as next it is being used.
            } else {
                assert.notEqual(nestedUnitInstance.dataset, undefined, `• returned dataset cannot be undefined for fieldName: ${unitInstance.fieldName}.`)
            }


            // check type of dataset
            let datasetHandling;
            if(Array.isArray(nestedUnitInstance.dataset) && nestedUnitInstance.children && nestedUnitInstance.children.length > 0 ) { // array
                datasetHandling = 'sequence'
            } else if(typeof nestedUnitInstance.dataset == 'object' && nestedUnitInstance.children && nestedUnitInstance.children.length > 0) { // object
                datasetHandling = 'nested'
            } else { // non-nested value
                datasetHandling = 'nonNested'
            }

            // handle array, object, or non-nested value
            let object = {};// formatted object with requested fields
            switch (datasetHandling) {
                case 'sequence':
                    
                    let promiseArray = nestedUnitInstance.dataset.map(document => {
                        let argument = {}
                        argument['dataset'] = document
                        return nestedUnitInstance.loopInsertionPoint({ type: 'aggregateIntoContentArray', argument  })
                    })
                    let subsequentDatasetArray = await Promise.all(promiseArray)
                    object[unitInstance.fieldName] = subsequentDatasetArray.map((subsequentDataset, index) => {
                        return this.formatDatasetOfNestedType({ 
                            subsequentDataset, 
                            dataset: nestedUnitInstance.dataset[index], 
                            option: { 
                                extrafield: nestedUnitInstance.requestOption.extrafield 
                            } 
                        })
                    })

                break; 
                case 'nested': // if field treated as an object with nested fields 

                    let subsequentDataset = await nestedUnitInstance.loopInsertionPoint({ type: 'aggregateIntoContentArray' })      
                    object[unitInstance.fieldName] = this.formatDatasetOfNestedType({ 
                        subsequentDataset, 
                        dataset: nestedUnitInstance.dataset, 
                        option: { 
                            extrafield: nestedUnitInstance.requestOption.extrafield 
                        } 
                    })

                break;
                default: 
                case 'nonNested':

                    // looping over nested units can manipulate the data in a different way than regular aggregation into an array.
                    object[unitInstance.fieldName] = nestedUnitInstance.dataset

                break;
            }
            
            // deal with requested all fields without the field option where execution of subnestedunits is required to manipulate the data.
            
            return object
        }

        formatDatasetOfNestedType({ subsequentDataset, dataset, option }) {
            let object = {}
            subsequentDataset.forEach(field => {
                object = Object.assign(object, field)
            })
            if(option.extrafield) { // extrafield option
                object = Object.assign(dataset, object) // override subsequent fields and keep untracked fields.
            }
            return object  
        }

    }
    
    return self
})