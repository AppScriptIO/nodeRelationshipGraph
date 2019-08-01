"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default({} = {}) {
  return async function ({
    portClassInstance,
    parentResult,
    args
  }) {
    let connection = portClassInstance.constructor.rethinkdbConnection;
    let context = portClassInstance.context;
    let parameter = context.request.query;
    let databaseName = 'webappContent';
    return parentResult[args.fieldToExtract];
  };
}