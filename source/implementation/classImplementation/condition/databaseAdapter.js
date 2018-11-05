import { curried as getTableDocumentCurried } from "@dependency/databaseUtility/source/query/getTableDocument.query.js";

let databasePrefix = 'condition_'
let getDocument = {
    NestedUnit: getTableDocumentCurried({ databaseName: 'webappSetting', tableName: `${databasePrefix}nestedUnit` }),
}
