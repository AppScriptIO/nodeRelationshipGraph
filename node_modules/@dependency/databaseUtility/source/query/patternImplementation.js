"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggregation = aggregation;
exports.documentRelatedToAggregation = documentRelatedToAggregation;
exports.multipleRelationship = multipleRelationship;
exports.getSingleDocumentOfSpecificLanguage = getSingleDocumentOfSpecificLanguage;
exports.getMergedMultipleDocumentOfSpecificLanguage = getMergedMultipleDocumentOfSpecificLanguage;
exports.getMultipleDocumentVersionOfSpecificLanguage = getMultipleDocumentVersionOfSpecificLanguage;

var _rethinkdb = _interopRequireDefault(require("rethinkdb"));

/** 
 * parent has type "aggregation" with array of all related versions in property "version"
 * returns RethinkDB sequence of related version for specific document aggregation.
*/
function aggregation({
  table,
  aggregatedDocumentKey
}) {
  let aggregatedDocument = table.filter({
    key: aggregatedDocumentKey
  });
  let version = aggregatedDocument.concatMap(function (document) {
    return document('version');
  }).concatMap(function (document) {
    let related = table.getAll(document, {
      index: 'key'
    });
    return related;
  });
  return version;
}
/** Version aggregation pattern - Get all version documents of a specific aggregation.
 * 
 */


async function documentRelatedToAggregation({
  // all documents of an article
  databaseConnection,
  dataAggregatedKey,
  dataTableName
}) {
  let dataTable = _rethinkdb.default.db('webappContent').table(dataTableName);

  let version = aggregation({
    table: dataTable,
    aggregatedDocumentKey: dataAggregatedKey
  }).coerceTo('array').run(databaseConnection);
  return version;
}
/**
 * relationship table matching two documents from different tables to create multiple-to-multiple relationship
 * the pattern relied on a schema structure of a relationship that includes - relationship key, table1 object, table2 object
 */


function multipleRelationship({
  relationshipTable,
  tableArray = [
    /* { name, table } */
  ]
}) {
  let relationshipSequence = relationshipTable.map(function (document) {
    return {
      relationship: document
    };
  }); // create field "relationship" with details of the relation (formatting)

  for (let table of tableArray) {
    relationshipSequence = relationshipSequence.concatMap(document => {
      let comparingKey;
      comparingKey = _rethinkdb.default.branch( // check if nested field present i.e. document.relationship.<tableName>
      document.hasFields({
        'relationship': {
          [table['name']]: true
        }
      }), document('relationship')(table['name'])('documentKey'), // if condition and value.
      [] // else value
      );
      let related = table['table'].getAll(comparingKey, {
        index: 'key'
      });
      return related.map(relatedDocument => {
        return document.merge({
          [table['name']]: relatedDocument
        });
      });
    });
  }

  return relationshipSequence;
}
/** aggregation of versions pattern - extract single version of an aggregation that compiles with a specific language relationship
 * 
 */


async function getSingleDocumentOfSpecificLanguage({
  languageDocumentKey,
  dataTableName,
  dataAggregatedKey,
  databaseConnection
}) {
  const contentDatabase = _rethinkdb.default.db('webappContent');

  let languageTable = contentDatabase.table('language');
  let relationshipTable = contentDatabase.table('relationship');
  let dataTable = contentDatabase.table(dataTableName);
  let version = aggregation({
    table: dataTable,
    aggregatedDocumentKey: dataAggregatedKey
  });
  return await multipleRelationship({
    relationshipTable,
    tableArray: [{
      name: dataTableName,
      table: dataTable
    }, {
      name: 'language',
      table: languageTable
    }]
  }).filter(document => {
    return document('language')('key').eq(languageDocumentKey);
  }).filter(document => {
    return version.contains(version => {
      return document(dataTableName)('key').eq(version('key'));
    });
  }).getField(dataTableName) // extract relationship field of the concerning table.
  // .coerceTo('array')
  .nth(0) // select first array item
  .run(databaseConnection);
}
/** Aggregation of versions pattern - extract all document of a specific language and merge them to a single object.
 * 
 */


async function getMergedMultipleDocumentOfSpecificLanguage({
  languageDocumentKey,
  dataTableName,
  databaseConnection
}) {
  const contentDatabase = _rethinkdb.default.db('webappContent');

  var dataTable = contentDatabase.table(dataTableName);
  let languageTable = contentDatabase.table('language');
  let relationshipTable = contentDatabase.table('relationship');
  let tableArray = [{
    name: dataTableName,
    table: dataTable
  }, {
    name: 'language',
    table: languageTable
  }];
  let result = await multipleRelationship({
    relationshipTable,
    tableArray
  }).filter(function (document) {
    return document('language')('key').eq(languageDocumentKey);
  }).getField(dataTableName) // from each sequence unit.
  .reduce((previous, current) => {
    return previous.merge(current);
  }) // .coerceTo('array')
  .run(databaseConnection);
  return result;
}
/** aggregation of versions pattern - extract multiple version document of an aggregation that compiles with a specific language relationship
 * 
 */


async function getMultipleDocumentVersionOfSpecificLanguage({
  databaseConnection,
  languageDocumentKey,
  dataTableName
}) {
  const contentDatabase = _rethinkdb.default.db('webappContent');

  var article = contentDatabase.table(dataTableName);
  let language = contentDatabase.table('language');
  let relationshipTable = contentDatabase.table('relationship');
  let tableArray = [{
    name: dataTableName,
    table: article
  }, {
    name: 'language',
    table: language
  }];
  let result = await multipleRelationship({
    relationshipTable,
    tableArray
  }).filter(function (document) {
    return document('language')('key').eq(languageDocumentKey);
  }).getField(dataTableName).coerceTo('array').run(databaseConnection);
  return result;
}