"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getTableDocument;
exports.curried = void 0;

var _rethinkdb = _interopRequireDefault(require("rethinkdb"));

var _namedCurry = require("@dependency/namedCurry");

var _assert = _interopRequireDefault(require("assert"));

// IMPORTANT: when false value (null, empty, undefined) is passed as key, the query will get all keys in db document.
function getTableDocument(databaseName, tableName) {
  return async function getCondition(connection, key) {
    (0, _assert.default)(connection, 'Rethinkdb `connection` should be set.');

    _assert.default.strictEqual(Object.getPrototypeOf(connection).constructor.name, 'TcpConnection');

    let result;

    if (key) {
      result = await _rethinkdb.default.db(databaseName).table(tableName).filter({
        key: key
      }).coerceTo('array').run(connection); // result = await cursor.toArray(function(err, result) { // convert cursor stream to an array.
      //     if (err) throw err;
      //     return result
      // });

      return result[0];
    } else {
      result = await _rethinkdb.default.db(databaseName).table(tableName).coerceTo('array').run(connection);
      return result;
    }
  };
}

async function getTableDocumentAllParams({
  databaseName,
  tableName,
  connection,
  key
}) {
  (0, _assert.default)(connection, 'Rethinkdb `connection` should be set.');

  _assert.default.strictEqual(Object.getPrototypeOf(connection).constructor.name, 'TcpConnection');

  let result;

  if (key) {
    result = await _rethinkdb.default.db(databaseName).table(tableName).filter({
      key: key
    }).coerceTo('array').run(connection); // result = await cursor.toArray(function(err, result) { // convert cursor stream to an array.
    //     if (err) throw err;
    //     return result
    // });

    return result[0];
  } else {
    result = await _rethinkdb.default.db(databaseName).table(tableName).coerceTo('array').run(connection);
    return result;
  }
}

let requiredArgument = ['databaseName', 'tableName', 'connection', 'key']; // commented out are optional

let curried = (0, _namedCurry.curryNamed)(requiredArgument, getTableDocumentAllParams); // 

exports.curried = curried;