import assert from 'assert'
import { nodeLabel, connectionType, connectionProperty } from '../../../graphModel/graphSchemeReference.js'
import { evaluationOption, traversalOption } from '../../../graphModel/graphSchemeReference.js'
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
    if (configure.source.labels.includes(nodeLabel.stage)) {
      // TODO: create an instance graph from the current graphInstance, to allow passing additional context parametrs.
      let configurationNodeArray = await graphInstance.traverse(
        /* TODO: Note: this is a quick implementation because digging into the core code is time consuming, the different concepts used in here could be improved and built upon other already existing concepts: 
          • 'traversalCallContext' - the 2nd provided argument could be instead applied as a regular Context specific for the call, by creating a new graphInstance chain with it's unique context, in addition to the already existing context instance.
          was this done ? ~~• ConditionAggregator & traverseThenProcessWithLogicalOperator implementations could be integratted into the other implementations.~~
        */
        {
          nodeInstance: configure.source,
          implementationKey: {
            processData: 'switchCase',
            traversalInterception: 'traverseThenProcessWithLogicalOperator',
            aggregator: 'ConditionAggregator',
          },
        },
        {
          traverseCallContext: {
            targetNode: configure.destination,
          },
        },
      ) // traverse subgraph to retrieve a configuration node.
      if (configurationNodeArray.length > 1) throw new Error('• CONFIGURE relationship that returns multiple configurations is not supported.')
      else if (configurationNodeArray.length != 0) {
        let configurationNode = configurationNodeArray[0]
        assert(configurationNode.labels.includes(nodeLabel.configuration), `• CONFIGURE sub-graph traversal must return a Configuration node.`)
        // replace destination node with appropriate evaluated configuration:
        configurationMap.set(configure, configurationNode)
      }
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
