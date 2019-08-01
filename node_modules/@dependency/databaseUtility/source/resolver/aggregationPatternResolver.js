"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _patternImplementation = require("appscript/utilityFunction/database/query/patternImplementation.js");

/** Non default exports are used for server side requests, bypassing the schema nested unit module */
function _default({} = {}) {
  return async function resolver({
    portClassInstance,
    parentResult,
    args
  }) {
    let databaseConnection = portClassInstance.constructor.rethinkdbConnection;
    let context = portClassInstance.context;
    let parameter = context.request.query;
    let databaseName = 'webappContent';
    const dataTableName = args.databaseTable; // from nestedUnit file/extension.
    // extract parameters of url

    let dataAggregatedKey = parameter.key;
    let languageDocumentKey = parameter.language;
    let option = parameter.option;
    let result;

    if (dataAggregatedKey && languageDocumentKey) {
      result = await (0, _patternImplementation.getSingleDocumentOfSpecificLanguage)({
        databaseConnection,
        dataAggregatedKey,
        languageDocumentKey,
        dataTableName
      });
    } else if (!dataAggregatedKey && languageDocumentKey) {
      switch (option) {
        case 'merged':
          result = await (0, _patternImplementation.getMergedMultipleDocumentOfSpecificLanguage)({
            dataTableName,
            languageDocumentKey,
            databaseConnection
          });
          break;

        default:
          result = await (0, _patternImplementation.getMultipleDocumentVersionOfSpecificLanguage)({
            databaseConnection,
            languageDocumentKey,
            dataTableName
          });
          break;
      }
    } else if (dataAggregatedKey && !languageDocumentKey) {
      result = await (0, _patternImplementation.documentRelatedToAggregation)({
        databaseConnection,
        dataAggregatedKey,
        dataTableName
      });
    }

    return result;
  };
}