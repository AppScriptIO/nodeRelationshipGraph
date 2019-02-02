const path = require('path')
const resolvedModule = {
    get deploymentScript() { return path.dirname( require.resolve(`@dependency/deploymentScript/package.json`) )  },
    get javascriptTestRunner() { return path.dirname( require.resolve(`@dependency/javascriptTestRunner/package.json`) ) }
}

console.log(`${resolvedModule.deploymentScript}/script`)

module.exports = {
    script: [
        {
            type: 'directory',
            path: `${resolvedModule.deploymentScript}/script`,
        },
        {
            type: 'directory', 
            path: './script'
        },
        {
            key: 'test',
            type: 'module',
            methodName: 'runTest',
            adapterFunction: ({ callback, args }) => {
                // change api to specific script parameter name
                args[0].targetProject = args[0].api.project
                return () => callback(...args) // specific interface of the callback
            },
            path: `${resolvedModule.javascriptTestRunner}/source/entrypoint/module/transpilation.entrypoint.js`,
        }
    ]
}