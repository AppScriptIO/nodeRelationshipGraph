"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ApplicationClass = _interopRequireDefault(require("../../class/Application.class.js"));

var _initializeDatabaseQuery = require("./initializeDatabase.query.js");

function initializeDatabaseData({
  databaseVersion,
  databaseData
} = {}) {
  return async () => {
    const connection = _ApplicationClass.default.rethinkdbConnection;
    console.groupCollapsed('Database data insertion:');
    console.log(`SZN Database version: ${databaseVersion}`);
    if (!databaseVersion) await (0, _initializeDatabaseQuery.deleteAllDatabase)(connection).then(console.log('SZN Rethinkdb - All databases dropped.'));
    await (0, _initializeDatabaseQuery.createDatabase)('webappSetting', connection).then(async () => {
      try {
        await (0, _initializeDatabaseQuery.createTableAndInsertData)('webappSetting', databaseData.webappSetting, connection);
      } catch (error) {
        console.log('webappSetting - cannot create table / insert data for webappSetting');
        console.log(error);
        process.exit(1);
      }
    });
    await (0, _initializeDatabaseQuery.createDatabase)('webappContent', connection).then(async () => {
      try {
        await (0, _initializeDatabaseQuery.createTableAndInsertData)('webappContent', databaseData.webappContent, connection);
      } catch (error) {
        console.log('webappContent - cannot create table / insert data for webappContent');
        console.log(error);
      }
    });
    console.groupEnd();
  };
}

var _default = initializeDatabaseData;
exports.default = _default;