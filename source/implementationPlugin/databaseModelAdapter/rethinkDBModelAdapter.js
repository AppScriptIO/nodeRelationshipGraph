// Default database adapter
import { curried as getTableDocumentCurried } from "@dependency/databaseUtility/source/query/getTableDocument.query.js";


// TODO: deal with `databasePrefix` for different implementations. And changes to names of database units e.g. `nestedUnit` to `node`
export function rethinkDBModelAdapter({ rethinkdbConnection, databasePrefix, databaseName = 'webappSetting', tableName = `${databasePrefix}nestedUnit` }) {
    let model = {}
    // pass rethinkdb connection to default query adapter
    let _getDocument = {
        Node: getTableDocumentCurried({ databaseName, tableName })
    }

    databasePrefix = 'middleware_' || 'condition_' || 'schema_' || 'shellscript_' || 'template_'
    model.getNodeDocumentQuery = _getDocument['Node']({ connection: rethinkdbConnection, databasePrefix }) // add connection variables
    model.getDataItemDocumentQuery = _getDocument['DataItem']({ connection: rethinkdbConnection, databasePrefix }) // add connection variables

    return model
}