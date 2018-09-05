// run container manager with requested command.
import path from 'path'
import resolve from 'resolve'
import { runManagerAppInContainerWithClientApp } from "@dependency/appDeploymentManager"
const message_prefix = `\x1b[3m\x1b[2m•[${path.basename(__filename)} JS script]:\x1b[0m`
console.group(`%s \x1b[33m%s\x1b[0m`,`${message_prefix}`,`ƒ container manager - container with volumes & requested entrypoint script`)

runManagerAppInContainerWithClientApp({
    application: {
        hostPath: path.normalize(path.join(__dirname, '../../../')), // absolute path
    },
    managerApp: {
        hostRelativePath: path.dirname( resolve.sync('@dependency/appDeploymentManager/package.json', { preserveSymlinks: true }) ) // use 'resolve' module to allow passing 'preserve symlinks' option that is not supported by require.resolve module.
    }
})
