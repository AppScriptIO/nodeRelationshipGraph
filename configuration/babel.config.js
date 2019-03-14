const { getBabelConfig } = require('@dependency/javascriptTranspilation')

module.exports = (api) => {
  return getBabelConfig('serverRuntime.BabelConfig.js').babelConfig
}