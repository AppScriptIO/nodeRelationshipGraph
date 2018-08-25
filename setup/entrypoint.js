#!/usr/bin/env node
// Shebang (#!) above allows for invoking this file directly on Unix-like platforms.
/**
 * This is a CLI entrypoint, where commands could be called to run necessary development environment on host machine.
 */
const path = require('path')
const configuration = require('./configuration/configuration.js')
require('@dependency/hostCLIAdapter').hostCLIAdapter({
    hostScriptPath: path.join(`${__dirname}/..`, configuration.script.hostMachine.path)
})