"use strict";

const {
  execSync,
  spawn,
  spawnSync
} = require('child_process'),
      {
  constants: filesystemConstants,
  promises: filesystem
} = require('fs'),
      path = require('path');

async function installModule({
  installPath,
  // path of package.json.
  options = {
    checkIfInstalled: true
  }
}) {
  // Install nodejs packages before
  let nodeModulesPath = path.join(installPath, 'node_modules');
  let nodeModulesExist;
  if (options.checkIfInstalled) nodeModulesExist = await filesystem.access(nodeModulesPath, filesystemConstants.F_OK) // check if directory exist
  .then(() => true).catch(error => false);

  if (!nodeModulesExist || !options.checkIfInstalled) {
    console.log(`\x1b[2m%s\x1b[0m'`, `• yarn install for folder: ${installPath}`);
    spawnSync('yarn', ['install --pure-lockfile --production=false'], {
      cwd: installPath,
      shell: true,
      stdio: [0, 1, 2]
    });
  } else {// skip installation
  }
} // Interface for multiple install locations.


async function installModuleMultiple({
  installPathArray,
  options = {}
}) {
  for (let installPath of installPathArray) {
    await installModule({
      installPath
    });
  }
}

module.exports = {
  installModule,
  installModuleMultiple
};