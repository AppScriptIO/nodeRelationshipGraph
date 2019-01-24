const path = require('path')
const resolvedModule = {
    get deploymentScript() { return path.dirname( require.resolve(`@dependency/deploymentScript/package.json`) )  },
    get javascriptTestRunner() { return path.dirname( require.resolve(`@dependency/javascriptTestRunner/package.json`) ) }
}

module.exports = {
    directory: {
        application: {
            rootPath: path.resolve(`${__dirname}/..`),
        }
    },
    script: [
        {
            type: 'directory',
            path: './setup/script'
        },
        {
            key: 'test',
            type: 'script',
            path: `${resolvedModule.javascriptTestRunner}/setup/script/bin/javascriptTestRunner.js`,
        },
        {
            key: 'sleep',
            type: 'script',
            path: `${resolvedModule.deploymentScript}/script/sleep`,
        }
    ]
}
