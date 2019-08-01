"use strict";

const path = require('path'),
      moduleSystem = require('module'),
      jsEntrypointPath = path.dirname(require.main.filename); // entrypoint directory path (current nodejs process root path)
// add root path (app base path) to the resolved module paths.
// Define server base path. Hackish way to make sure the path is always consistent. Base path in Nodejs is where the closest parent node_modules is located to the initiated js script.
// '${appRootPath}' allows for folders/modules inside the main folder to be called with out using relative paths.
// '${appRootPath}/node_modules' allows for modules from upper herarchies to call modules from sibling folders. e.g. source/x calls source/y/node_modules/module


function addModuleResolutionPath({
  nodeModulePath // path to add to the node module resolution paths

}) {
  /* Adding the default node_modules path isn't necessary anymore, as the current behavior (at least through babel) is to load NODE_PATH as additional resolution paths, and not overriding.
    add nodejs default path to NODE_PATH, i.e. "node_modules"  */
  // if(!process.env.NODE_PATH) process.env.NODE_PATH = `${jsEntrypointPath}/node_modules`
  // add paths to the NODE_PATH string
  process.env.NODE_PATH = `${process.env.NODE_PATH || ''}${path.delimiter}${nodeModulePath}`;
  process.env.NODE_PATH = process.env.NODE_PATH.replace(new RegExp(`/(^\\${path.delimiter}+)/`), ''); // ":<path>:<path>" -> "<path>:<path>" remove empty section in the beginning in case NODE_PATH was undefined.
  // Load new NODE_PATH variable

  moduleSystem._initPaths(); // reflect change on the running app.

} // interface for multiple paths


function addModuleResolutionPathMultiple({
  pathArray = []
}) {
  for (let nodeModulePath of pathArray) {
    addModuleResolutionPath({
      nodeModulePath
    });
  } // Log paths


  let nodePathArray = process.env.NODE_PATH.split(path.delimiter); // default NODE_PATH is composed of paths separated by semicolon (one complete string of paths).

  let nodePathFormatted = '\t'.concat(nodePathArray.join('\n\t')); // add a tab and linebreak between paths
  // console.group(`\x1b[2m\x1b[3m%s \n%s\x1b[0m`, `• Node\'s module resolution paths:`, `${nodePathFormatted}`)
  // console.groupEnd()
} // logging wrapper
// TODO: Log inside proxy.


module.exports = {
  addModuleResolutionPath,
  addModuleResolutionPathMultiple
};