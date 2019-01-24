/**
 * Implementation type aggregateIntoContentArray
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
import { add, execute, applyMixin, conditional, executionLevel } from '@dependency/commonPattern/source/decoratorUtility.js'

export function schema({ thisArg }) { // function wrapper to set thisArg on implementaion object functions.

    let self = {
        @executionLevel()        
        async initializeNestedUnit({ 
            nestedUnitKey, 
            additionalChildNestedUnit = [], 
            pathPointerKey = null, 
            parent = this,
            argument = {}
        }) { // Entrypoint Instance
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
        },

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
    
    Object.keys(self).forEach(function(key) {
        self[key] = self[key].bind(thisArg)
    }, {})
    return self
}