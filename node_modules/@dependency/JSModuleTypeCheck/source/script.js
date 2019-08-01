"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IsFileOrFolderJSModule = IsFileOrFolderJSModule;

var _fs = _interopRequireDefault(require("fs"));

/**
 *  Check if javascript module is a module file or directory module.
 * @return String || Boolean
 */
function IsFileOrFolderJSModule({
  modulePath,
  // path to js module
  isType = false // 'file' || 'directory' - allows to return boolean in case set, respective to the type set.

}) {
  let moduleType;
  if (_fs.default.existsSync(modulePath) && _fs.default.lstatSync(modulePath).isDirectory()) moduleType = 'directory';else if (_fs.default.existsSync(`${modulePath}.js`) || _fs.default.existsSync(modulePath) && _fs.default.lstatSync(modulePath).isFile()) moduleType = 'file';else throw new Error(`Module ${modulePath} does not exist`); // return boolean respective to the type in question.

  if (isType) return isType === moduleType;
  return moduleType;
}