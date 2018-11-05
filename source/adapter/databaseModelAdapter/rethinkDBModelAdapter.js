// Default database adapter
import { curried as getTableDocumentCurried } from "@dependency/databaseUtility/source/query/getTableDocument.query.js";
let databasePrefix = 'middleware_'
let _getDocument = {
    Node: getTableDocumentCurried({ databaseName: 'webappSetting', tableName: `${databasePrefix}nestedUnit`})
}

export function rethinkDBModelAdapter({ rethinkdbConnection }) {
    let model = {}
    // pass rethinkdb connection to default query adapter
    model.getNodeDocumentQuery = _getDocument['Node']({ connection: rethinkdbConnection }) // add connection variables
    return model
}