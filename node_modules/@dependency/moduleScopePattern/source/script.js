"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _path = _interopRequireDefault(require("path"));

var _fs = require("fs");

var _recursiveCreateDirectory = require("@dependency/recursiveCreateDirectory");

async function moduleScopePattern({
  rootScopeModulePath,
  // destination path - full path of the root scope module i.e. <path to node_modules>/<folders to scope module>
  rootFolderArray,
  // folders to be symlinked to the module scope folder (paths relative to rootPath).
  rootPath // path to the project root folder where files should be symlinked from.

} = {}) {
  console.group(`\x1b[2m\x1b[3m%s`, '• Setup container environment - root scope pattern:');
  rootScopeModulePath = rootScopeModulePath; // scope module for top-level directory symlinks
  // if directory doesn't exist

  await _fs.promises.access(rootScopeModulePath, _fs.constants.F_OK).catch(error => (0, _recursiveCreateDirectory.recursiveCreateDirectory)({
    directoryPath: rootScopeModulePath
  })); // symlink each folder from root path to module scope path.

  for (let folderName of rootFolderArray) {
    let folderSourcePath = _path.default.join(rootPath, folderName);

    let folderDestinationPath = _path.default.join(rootScopeModulePath, folderName);

    await _fs.promises.symlink(folderSourcePath, folderDestinationPath).catch(error => console.log(`Symlink created for ${folderName}`));
  }

  console.groupEnd();
}

module.exports = {
  moduleScopePattern
};