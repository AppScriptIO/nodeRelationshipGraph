"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configurationFileLookup = configurationFileLookup;
exports.findTargetProjectRoot = findTargetProjectRoot;

var _path = _interopRequireDefault(require("path"));

var _assert = _interopRequireDefault(require("assert"));

var _ConfigurationClass = require("./Configuration.class.js");

// This module should not depend on runtime transpilation, as it is used by the javascript tranpilation module.

/**
 * Find configuration file according to specific assumptions and configuration of this module with preset defaults.
 * Assumptions made:
 *  - 'configuration' argument set relative to current working directory.
 * or
 *  - current working directory is the location where 'configuration' module should be present (e.g. '<app path>/setup')
 */
function configurationFileLookup({
  configurationPath = 'configuration',
  // could be absolute or relative to CWD & base path. (can be also the name of the file)
  currentDirectory,
  // path to start from
  configurationBasePath = [],
  // [string | array of strings] path of directories where the configuration file should be searched in (additional starting path to look from). In case relative path it will be relative to the current working directory or relative to the current directory in the traversal algorithm.
  possibleConfigurationPath = [] // accumulator of possible configuration paths to look for.

} = {}) {
  // TODO:(deal with this comment) default where the assumption that script executed in path '<app path>/setup'

  /** Parameters initialization, sanitization, and validation */
  // if `configurationBasePath` is a string, convert it to an array.
  if (!Array.isArray(configurationBasePath)) configurationBasePath = [configurationBasePath]; // transform all configuration base paths to absolute

  let configurationAbsoluteBasePath = configurationBasePath.map(basePath => {
    if (_path.default.isAbsolute(basePath)) return basePath;else return _path.default.join(currentDirectory, basePath);
  }); // add CWD to base paths that search will start from - by default search will always CWD as starting point.

  configurationAbsoluteBasePath.push(currentDirectory);
  /** Create possible absolute configuration paths */
  // add provided configuration path to possible configuration paths (the lookup algorithm will be executed regardless of provided configuration path).

  if (_path.default.isAbsolute(configurationPath)) // absolute
    possibleConfigurationPath.push(configurationPath);else {
    // relative path to base hierarchy paths.
    configurationAbsoluteBasePath = configurationAbsoluteBasePath.reduce((accumulator, basePath) => {
      // get all traversal paths starting from the base paths.
      return accumulator.concat(traversePath({
        initialPath: basePath
      }));
    }, []);
    let additionalPossibleConfigPath = configurationAbsoluteBasePath.map(basePath => _path.default.join(basePath, configurationPath)); // build configuration file absolute path.

    possibleConfigurationPath = possibleConfigurationPath.concat(additionalPossibleConfigPath);
  } // remove duplicate paths if any

  possibleConfigurationPath = [...new Set(possibleConfigurationPath)]; // filters any duplicates as `Set` creates an iterable with unique elements, i.e. filtering duplicates.

  /** try loading configuration file, on first success break. */

  let errorAccumulator = [],
      index = 0,
      configurationAbsolutePath;

  while (index < possibleConfigurationPath.length) {
    let configurationPath = possibleConfigurationPath[index];

    try {
      require.resolve(configurationPath);

      configurationAbsolutePath = configurationPath;
      break;
    } catch (error) {
      // try requiring all array loops
      errorAccumulator.push(error);
    }

    index++;
  }

  if (!configurationAbsolutePath) {
    console.log(`%c45455455`, 'color: #F99157;', 'X `configuration` parameter (relative configuration path from PWD) in command line argument must be set, because the configuration algorithm failed to look it up.');
    console.log(errorAccumulator);
    throw new Error('• Lookup algorithm for target project configuration path failed.');
  } // cleanup command arguments in case a chain of directly executed scripts is used.


  process.argv = process.argv.filter(value => value !== `configuration=${configurationPath}`); // remove configuration paramter

  return {
    configuration: loadConfiguration(configurationAbsolutePath),
    // configuration object
    path: configurationAbsolutePath // configuration absolute path

  };
}

function loadConfiguration(configPath) {
  let configurationObject = require(configPath);

  return new _ConfigurationClass.Configuration({
    configuration: configurationObject
  });
}
/**
 * returns all paths in the heirarchy by traversing to the parents till the reaching the root.
 */


function traversePath({
  initialPath,
  stopPath = ['node_modules']
}) {
  let pathAccumulator = [];
  let isRootDirectory = false,
      currentPath = initialPath;

  while (!isRootDirectory) {
    if (stopPath.includes(_path.default.basename(currentPath))) // stop lookup upon reaching any of the stop paths.
      break;
    pathAccumulator.push(currentPath);
    currentPath = _path.default.dirname(currentPath);
    isRootDirectory = currentPath == _path.default.dirname(currentPath); // The logic behind checking if root directory.
  }

  return pathAccumulator;
} // retrieve the project config using array of initial paths to start from.
// expose a specific implementation of the lookup that relies on passing starting paths to lookup from.


function findTargetProjectRoot({
  nestedProjectPath
  /* Array of paths [process.cwd(), module.parent.filename] */

} = {}) {
  let targetProjectConfig;

  for (let lookupPath of nestedProjectPath) {
    try {
      ;
      ({
        configuration: targetProjectConfig
      } = configurationFileLookup({
        currentDirectory: lookupPath
      }));
      break;
    } catch (error) {// ignore
    }
  }

  (0, _assert.default)(targetProjectConfig, `• target project configuration file was not found from possible lookup paths.`);
  return targetProjectConfig;
}