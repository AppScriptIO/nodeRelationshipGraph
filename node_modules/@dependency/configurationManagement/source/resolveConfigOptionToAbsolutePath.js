"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveConfigOptionToAbsolutePath = resolveConfigOptionToAbsolutePath;

var _path = _interopRequireDefault(require("path"));

/**
 * Converts paths that are relative to absolute using `rootPath` as base for the relative paths.
 *
 */
function resolveConfigOptionToAbsolutePath({
  optionPath,
  rootPath // instance of Configuration class

}) {
  optionPath = !_path.default.isAbsolute(optionPath) // check if is relative or absolute.
  ? _path.default.join(rootPath, optionPath) // resolve path relative to root.
  : optionPath;
  return optionPath;
}