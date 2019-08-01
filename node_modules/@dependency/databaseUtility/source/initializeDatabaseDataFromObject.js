"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _initializeDatabaseQuery = require("@dependency/databaseUtility/source/initializeDatabase.query.js");

var _rethinkdb = _interopRequireDefault(require("rethinkdb"));

function initializeDatabaseData({
  databaseData,
  connection
}) {
  return (0, _initializeDatabaseQuery.createDatabase)('webappSetting', connection, _rethinkdb.default).then(async () => {
    await (0, _initializeDatabaseQuery.createTableAndInsertData)('webappSetting', databaseData.webappSetting, connection, _rethinkdb.default);
  }).catch(error => {
    throw error;
  });
}

var _default = initializeDatabaseData;
exports.default = _default;