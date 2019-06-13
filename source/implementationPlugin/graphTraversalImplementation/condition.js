/**
 * @description loops through all the insertion points and initializes each one to execute the children specific for it.
 * @description when first called "this" context is assigned to the AppInstance for the comming request. And on subsequest calls it is assigned to the nestedUnit instance.
 * @param {Class Instance} nestedUnitInstance Tree instance of the module using "reusableNestedUnit" pattern. instance should have "initializeInsertionPoint" function & "insertionPoint" Array.
 * @returns undifiend for false or any type of value depending on the module being applied.
 */
export function condition({ thisArg }) {
  // function wrapper to set thisArg on implementaion object functions.

  let self = {
    async initializeNestedUnit({ nestedUnitKey, additionalChildNestedUnit = [], pathPointerKey = null }) {
      // Entrypoint Instance
      let conditionMet
      if (nestedUnitInstance.unitKey) {
        let { unitKey: unitKey } = nestedUnitInstance
        assert(unitKey, `• "${unitKey}" nestedUnit should have a unitKey field. The passed value is either undefined, null, or empty string.`)
        let unitInstance = await this.getUnit({ unitKey })
        await unitInstance.pupolateUnitWithFile()
        conditionMet = await unitInstance.checkCondition()
      } else {
        // if no unitKey set, then the neseted unit is considered a holder for other nested units and should pass to the nested children.
        conditionMet = true
      }

      // [3] Iterate over insertion points
      let callback
      if (conditionMet) {
        callback = await nestedUnitInstance.traversePort({ type: 'returnedFirstValue' })
        // if all subtrees rejected, get immediate callback
        if (!callback && 'callback' in nestedUnitInstance) callback = nestedUnitInstance.callback // fallback to immediate callback of instance.
      }

      // [4] Callback
      return callback ? callback : false
    },

    traversePort: async function returnedFirstValue() {
      let returned
      for (let insertionPoint of this.insertionPoint) {
        returned = await iteratePort()
        if (returned) break
      }
      return returned
    },
  }

  Object.keys(self).forEach(function(key) {
    self[key] = self[key].bind(thisArg)
  }, {})
  return self
}

import { curried as getTableDocumentCurried } from '@dependency/databaseUtility/source/query/getTableDocument.query.js'

//getDocument['Unit']
let getDocument = {
  Unit: getTableDocumentCurried({ databaseName: 'webappSetting', tableName: `condition_unit` }),
  File: getTableDocumentCurried({ databaseName: 'webappSetting', tableName: `condition_file` }),
}

async pupolateUnitWithFile() {
    await super.pupolateUnitWithFile({
      getDocument: getDocument['File'],
      fileKey: this.fileKey, // valueReturningFile
      extract: { destinationKey: 'file' },
    })
  }

  @executeOnceForEachInstance()
  async checkCondition() {
    // [2] require & check condition
    if (!this.conditionResult) {
      let expectedReturn = this.expectedReturn
      let filePath = this.file.filePath
      let returnedValue = await require(filePath).default(this.portAppInstance)
      if (process.env.SZN_DEBUG == 'true' && this.portAppInstance.context.headers.debug == 'true')
        console.log(`🔀 Comparing conditionKey: ${this.key} ${filePath}. \n • expected: ${expectedReturn} == ${returnedValue}. \n • compare result: ${returnedValue == expectedReturn} \n \n`)
      this.conditionResult = returnedValue == expectedReturn ? true : false
    }
    return this.conditionResult
  }
