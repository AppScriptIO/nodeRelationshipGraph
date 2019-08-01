"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rethinkdb = _interopRequireDefault(require("rethinkdb"));

function getTableDocument(documentId) {
  return async function getCondition(connection, key) {
    let result;

    if (key) {
      result = await _rethinkdb.default.db("webapp").table("setting").get(documentId)(documentId).filter(_rethinkdb.default.row("key").eq(key)).run(connection);
      return result[0];
    } else {
      result = await _rethinkdb.default.db("webapp").table("setting").get(documentId)(documentId).run(connection);
      return result;
    }
  };
}

var _default = getTableDocument;
exports.default = _default;