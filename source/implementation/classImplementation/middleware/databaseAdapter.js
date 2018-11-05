import { curried as getTableDocumentCurried } from "@dependency/databaseUtility/source/query/getTableDocument.query.js";

let databasePrefix = 'middleware_'
let getDocument = {
    NestedUnit: getTableDocumentCurried({ databaseName: 'webappSetting', tableName: `${databasePrefix}nestedUnit`})
}

