"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rethinkdb = _interopRequireDefault(require("rethinkdb"));

function getTableDocument(tableName) {
  return async (connection, filterObject) => {
    let result;

    if (filterObject) {
      result = await _rethinkdb.default.db("webappSetting").table(tableName).filter(filterObject).coerceTo('array').run(connection); // result = await cursor.toArray(function(err, result) { // convert cursor stream to an array.
      //     if (err) throw err;
      //     return result
      // });

      return result[0];
    } else {
      result = await _rethinkdb.default.db("webappSetting").table(tableName).coerceTo('array').run(connection);
      return result;
    }
  };
}

var _default = getTableDocument;
exports.default = _default;