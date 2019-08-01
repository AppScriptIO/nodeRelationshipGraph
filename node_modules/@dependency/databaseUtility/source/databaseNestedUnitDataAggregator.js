"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _default = ({
  localPath,
  implementation,
  dataArray
}) => {
  let tablePrefix = `${implementation}_`;
  let settingArray = [];

  for (let value of dataArray) {
    let setting = {
      databaseTableName: value
    };
    let local = [],
        shared = [];
    {
      // let modulePath = path.dirname(require.resolve('appscript'))
      let filePath = _path.default.resolve(_path.default.join(__dirname, '../../', `databaseData/${implementation}/${value}.js`));

      if (_fs.default.existsSync(filePath)) {
        shared = require(filePath).default;
      } else {
        console.log(`• dbData - shared data ${filePath} not present, skipping.`);
      }
    }
    {
      let filePath = `${localPath}/${value}.js`;
      if (_fs.default.existsSync(filePath)) local = require(filePath).default;
    }
    setting.data = [...shared, ...local];
    if (setting.data.length < 1) console.log(implementation + ' ' + value);
    settingArray.push(setting);
  }

  return settingArray.map(object => {
    object.databaseTableName = tablePrefix.concat(object.databaseTableName);
    return object;
  });
};

exports.default = _default;