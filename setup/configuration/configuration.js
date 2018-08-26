const path = require('path')
const   projectPath = "/project";
const appDeploymentLifecyclePath = path.dirname( require.resolve(`@dependency/appDeploymentLifecycle/package.json`) ) 

module.exports = {
    projectPath,
    script: {
        hostMachine: {
            path: './setup/script/hostMachine' // relative to applicaiton repository root.
        },
        container: [ // entrypoint configuration map, paths are relative to external app.
            {
                key: 'test',
                path: `${appDeploymentLifecyclePath}/containerScript/test`,
            },
            {
                key: 'sleep',
                path: `${appDeploymentLifecyclePath}/containerScript/sleep`,
            }
        ]
    }
}
