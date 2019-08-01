"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listContent = void 0;

var _fs = _interopRequireDefault(require("fs"));

// get direcotry contents list
const listContent = ({
  dir,
  // single path or array of directory paths.
  filelist = [],
  option
} = {}) => {
  if (!Array.isArray(dir)) dir = [dir]; // in case a single string, convert it to array to work with the function.

  for (let directoryPath of dir) {
    filelist = filelist.concat(listContentSingleContent({
      directoryPath,
      option
    }));
  }

  return filelist;
};

exports.listContent = listContent;

function listContentSingleContent({
  directoryPath,
  filelist = [],
  option = {
    recursive: false
  }
}) {
  if (!_fs.default.existsSync(directoryPath)) return filelist;

  _fs.default.readdirSync(directoryPath).forEach(content => {
    if (option.recursive) {
      filelist = _fs.default.statSync(path.join(directoryPath, content)).isDirectory() ? listContent(path.join(directoryPath, content), filelist) : filelist.push(content);
    } else {
      filelist.push(content);
    }
  });

  return filelist;
}