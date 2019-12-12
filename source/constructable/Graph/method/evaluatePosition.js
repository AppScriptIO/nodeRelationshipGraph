import assert from 'assert'
import { nodeLabel, connectionType, evaluationOption, traversalOption } from '../../../dataModel/graphSchemeReference.js'
import { extractConfigProperty } from '../../../utility/extractPropertyFromObject.js'

/**
 * Node's include/exclude evaluation - evaluate whether or not a node whould be included in the node feed and subsequently in the traversal. continue child nodes traversal or break traversal.
 * & traversal implementation configuration - chooses the custom functions to be used in the traversal.
 */
export async function evaluatePosition({ node, graphInstance = this }) {
  let { configureArray } = await graphInstance.databaseWrapper.getConfigure({ concreteDatabase: graphInstance.database, nodeID: node.identity })

  // evaluate configuration by traversing subgraph nodes (traverse switch stage node) & replace destination node with a configuration node:
  let configurationMap = new Map() // maps evaluated configuration to the CONFIGURE relationships.
  for (let configure of configureArray)
    if (configure.source.labels.includes(nodeLabel.reroute)) {
      // if reroute node, then request resolution to the reference node (run in a separate traversal recursive scopes)
      let configurationNode = await graphInstance.traverse(
        {
          nodeInstance: configure.source,
          implementationKey: {
            [nodeLabel.reroute]: 'returnReference',
          },
        },
        {
          traverseCallContext: {
            targetNode: configure.destination, // provide access in the reroute for the target node caller requesting the resolution of the reference.
          },
        },
      )
      if (!configurationNode) continue // if no Configuration was resolved skip.
      assert(configurationNode && configurationNode.labels.includes(nodeLabel.configuration), `• CONFIGURE sub-graph traversal must return a Configuration node.`)
      // replace destination node with appropriate evaluated configuration:
      configurationMap.set(configure, configurationNode)
    }

  // extract configuration parameters from configure relationship:
  let implementationConfigurationArray = configureArray
    .filter(configure => configure.connection.properties.setting == 'implementation')
    .map(configure => {
      let configuration
      if (configurationMap.get(configure)) configuration = configurationMap.get(configure)
      else configuration = configure.source
      return extractConfigProperty(configuration.properties, traversalOption)
    })
  let evaluationConfigurationArray = configureArray
    .filter(configure => configure.connection.properties.setting == 'evaluation')
    .map(configure => {
      let configuration
      if (configurationMap.get(configure)) configuration = configurationMap.get(configure)
      else configuration = configure.source
      return extractConfigProperty(configuration.properties, evaluationOption)
    })

  // merge multiple configurations of the same type
  let implementationConfiguration = implementationConfigurationArray.length > 0 ? Object.assign(...implementationConfigurationArray) : {}
  let evaluationConfiguration = evaluationConfigurationArray.length > 0 ? Object.assign(...evaluationConfigurationArray) : {}

  return { implementationConfiguration, evaluationConfiguration }
}
