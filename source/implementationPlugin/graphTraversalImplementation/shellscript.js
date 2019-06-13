// TODO: rename `shellscript.js` to `taskScript.js` as shell scripts are only part of the execution types possible.

/**
 * implementationType = executeScript
 * @description when first called "this" context is assigned to the AppInstance for the comming request. And on subsequest calls it is assigned to the nestedUnit instance.
 *
 * @param {any} {nestedUnitKey}
 * @returns { Object || False } Object containing instruction settings to be used through an implementing module.
 */
import { exec, execSync, spawn, spawnSync } from 'child_process'

export function shellscript({ thisArg }) {
  // function wrapper to set thisArg on implementaion object functions.

  let self = {
    async executeDataItem({ dataItem, nodeInstance = thisArg, executionType }) {
      // execute command
      await dataItemInstance.executeScript()
    },
    // dataItem instance methods
    async executeScript() {
      let message = ` _____                          _        
| ____|__  __ ___   ___  _   _ | |_  ___ 
|  _|  \\ \\/ // _ \\ / __|| | | || __|/ _ \\
| |___  >  <|  __/| (__ | |_| || |_|  __/    
|_____|/_/\\_\\\\___| \\___| \\__,_| \\__|\\___|`
      let childProcess
      switch (this.implementation) {
        case 'spawn':
          try {
            console.log(message)
            console.log(`\x1b[45m%s\x1b[0m`, `${this.command} ${this.argument.join(' ')}`)
            childProcess = spawnSync(this.command, this.argument, this.option)
            if (childProcess.status > 0) throw childProcess.error
          } catch (error) {
            process.exit(childProcess.status)
          }
          break
        case 'spawnIgnoreError':
          try {
            console.log(message)
            console.log(`\x1b[45m%s\x1b[0m`, `${this.command} ${this.argument.join(' ')}`)
            childProcess = spawnSync(this.command, this.argument, this.option)
            if (childProcess.status > 0) throw childProcess.error
          } catch (error) {
            console.log(childProcess.status)
          }
          break
        case 'spawnAsynchronous':
          try {
            console.log(message)
            console.log(`\x1b[45m%s\x1b[0m`, `${this.command} ${this.argument.join(' ')}`)
            childProcess = spawn(this.command, this.argument, this.option)
            if (childProcess.status > 0) throw childProcess.error
          } catch (error) {
            process.exit(childProcess.status)
          }
          break
        case 'file':
          try {
            console.log(message)
            console.log(`\x1b[45m%s\x1b[0m`, `shellscript file: ${this.filename}, shellscriptPath: ${this.shellscriptPath}`)
            this.option.cwd = this.shellscriptPath
            execSync(`sh ${this.filename}`, this.option)
          } catch (error) {
            throw error
            process.exit(1)
          }
          break
        default:
          console.log('X shellscriptUnit.implementation does not match any option.')
          break
      }
      // important to prevent 'unable to re-open stdin' error between shells.
      await new Promise(resolve => setTimeout(resolve, 500)) // wait x seconds before next script execution.
    },
  }

  Object.keys(self).forEach(function(key) {
    self[key] = self[key].bind(thisArg)
  }, {})
  return self
}

import { curried as getTableDocumentCurried } from '@dependency/databaseUtility/source/query/getTableDocument.query.js'

let getDocument = {
  Unit: getTableDocumentCurried({ databaseName: 'webappSetting', tableName: `shellscript_unit` }),
}
