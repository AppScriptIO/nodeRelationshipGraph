const path = require('path')
const { script } = require('./script.config.js')

module.exports = {
    directory: {
        application: {
            rootPath: path.resolve(`${__dirname}/..`),
        }
    },
    script
}
