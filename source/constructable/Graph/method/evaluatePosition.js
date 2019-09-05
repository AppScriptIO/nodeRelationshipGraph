import assert from 'assert'
import { nodeLabel, connectionType, connectionProperty } from '../../../graphModel/graphSchemeReference.js'
import { evaluationOption, traversalOption } from '../../../graphModel/graphSchemeReference.js'
import { isArray } from 'util'
import { extractConfigProperty } from '../../../utility/extractPropertyFromObject.js'

/**
 * Node's include/exclude evaluation - evaluate whether or not a node whould be included in the node feed and subsequently in the traversal. continue child nodes traversal or break traversal.
 * & traversal implementation configuration - chooses the custom functions to be used in the traversal.
 */
export async function evaluatePosition({ node, graphInstance = this }) {
  let { configureArray } = await graphInstance.databaseWrapper.getConfigure({ concreteDatabase: graphInstance.database, nodeID: node.identity })

  // evaluate configuration by traversing subgraph nodes (traverse switch stage node) & replace destination node with a configuration node:
  for (let configure of configureArray)
    if (configure.destination.labels.includes(nodeLabel.stage)) {
      let configurationNode = await graphInstance.traverse({
        nodeInstance: configure.destination,
        implementationKey: {
          processData: 'evaluateConditionReference',
          traversalInterception: 'traverseBooleanCheck',
        },
      }) // traverse subgraph to retrieve a configuration node.
      assert(configurationNode.labels.include(nodeLabel.configuration), `• CONFIGURE subgraph traversal must return a Configuration node.`)
      // replace destination node with appropriate evaluated configuration:
      configure.destination = configurationNode
    }

  // extract configuration parameters from configure relationship:
  let implementationConfigurationArray = configureArray
    .filter(configure => configure.connection.properties.setting == 'implementation')
    .map(configure => extractConfigProperty(configure.destination.properties, traversalOption))
  let evaluationConfigurationArray = configureArray
    .filter(configure => configure.connection.properties.setting == 'evaluation')
    .map(configure => extractConfigProperty(configure.destination.properties, evaluationOption))

  // merge multiple configurations of the same type
  let implementationConfiguration = Object.assign(...implementationConfigurationArray)
  let evaluationConfiguration = Object.assign(...evaluationConfigurationArray)

  return { implementationConfiguration, evaluationConfiguration }
}
