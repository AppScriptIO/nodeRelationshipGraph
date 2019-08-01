"use strict";

const path = require('path'),
      {
  addModuleResolutionPathMultiple
} = require(`@dependency/addModuleResolutionPath`);

let eslintJSLinterFunc = require('./eslint.config.js');

let prettierJSFormatter = require('./prettier.config.js');

module.exports = {
  initialize: () => {
    const nodeModulesPath = path.dirname(path.dirname(path.dirname(require.resolve('eslint/package.json')))); // get the node_modules folder where plugins are installed. Could be own package root or parent packages root (when this modules is installed as a pacakge)

    addModuleResolutionPathMultiple({
      pathArray: [nodeModulesPath]
    }); // Add own node_modules to module resolving paths
  },
  eslintJSLinterFunc,
  prettierJSFormatter
};