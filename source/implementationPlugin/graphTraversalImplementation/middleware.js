/**
 * Creates middleware array from graph
 * The graph traversal @return {Array of Objects} where each object contains instruction settings to be used through an implementing module to add to a chain of middlewares.
 */
export function middleware({ thisArg }) {
  // function wrapper to set thisArg on implementaion object functions.

  let self = {}

  Object.keys(self).forEach(function(key) {
    self[key] = self[key].bind(thisArg)
  }, {})
  return self
}

import { curried as getTableDocumentCurried } from '@dependency/databaseUtility/source/query/getTableDocument.query.js'

let getDocument = {
  Unit: getTableDocumentCurried({ databaseName: 'webappSetting', tableName: `middleware_}unit` }),
  File: getTableDocumentCurried({ databaseName: 'webappSetting', tableName: `middleware_}file` }),
}

async pupolateUnitWithFile() {
    // getDocument['Unit']  is set for unit
    await super.pupolateUnitWithFile({
      getDocument: getDocument['File'],
      fileKey: this.fileKey,
      extract: { destinationKey: 'file' },
    })
  }
