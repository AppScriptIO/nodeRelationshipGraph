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
            type: 'script',
            path: `${resolvedModule.javascriptTestRunner}/source/entrypoint/cli/transpilation.entrypoint.js`,
        }  
    ]
}