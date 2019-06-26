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
