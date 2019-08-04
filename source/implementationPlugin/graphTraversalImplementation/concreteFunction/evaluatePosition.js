import assert from 'assert'
import { nodeLabel, connectionType, connectionProperty } from '../../../graphModel/graphSchemeReference.js'

export async function evaluateConditionReference({ node, configure, execute, resource, graphInstance }) {
  let conditionContext = graphInstance.context?.conditionContext
  assert(conditionContext, `• Context "conditionContext" variable is required to reference conditions from graph database strings.`)

  if (resource) {
    assert(resource.destination.labels.includes(nodeLabel.function), `• Unsupported Node type for resource connection.`)
    let functionName = resource.destination.properties.functionName || throw new Error(`• condition resource must have a "functionName" - ${resource.destination.properties.functionName}`)
    let functionCallback = conditionContext[functionName] || throw new Error(`• reference condition name doesn't exist.`)
    try {
      return await functionCallback({ node, context: graphInstance.context })
    } catch (error) {
      console.error(error) && process.exit()
    }
  }
}
