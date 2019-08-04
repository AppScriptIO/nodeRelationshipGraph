import assert from 'assert'
import { nodeLabel, connectionType, connectionProperty } from '../../../graphModel/graphSchemeReference.js'
import { EvaluatorFunction, evaluationOption } from '../../Evaluator.class.js'
const Evaluator = EvaluatorFunction()

function extractEvaluationConfigProperty(propertyObject) {
  return Object.entries(propertyObject).reduce((accumulator, [key, value]) => {
    if (Object.keys(evaluationOption).includes(key)) accumulator[key] = value
    return accumulator
  }, {})
}

/**
 * Node's include/exclude evaluation - evaluate whether or not a node whould be included in the node feed and subsequently in the traversal.
 * continue child nodes traversal or break traversal.
 */
export async function evaluatePosition({ evaluation, node, implementation, graphInstance = this }) {
  let { configureArray } = await graphInstance.databaseWrapper.getConfigure({ concreteDatabase: graphInstance.database, nodeID: node.identity })
  // default values
  evaluation = new Evaluator({ propagation: evaluationOption.propagation.continue, aggregation: evaluationOption.aggregation.include }) // Note: Additional default values for Evaluator constructor are set above during initialization of Evaluator static class.

  for (let configure of configureArray) {
    // verify & switch node type
    let nodeEvaluationConfig = {}
    if (configure.destination.labels.includes(nodeLabel.configuration)) {
      nodeEvaluationConfig = extractEvaluationConfigProperty(configure.destination.properties)
    } else if (configure.destination.labels.includes(nodeLabel.evaluation)) {
      nodeEvaluationConfig = await checkEvaluationNode({ node, configure, graphInstance, implementation })
    } else throw new Error(`• "${configure.destination.labels}" Unsupported node type for a NEXT connection.`)

    // manipulate evaluation config
    Object.assign(evaluation, nodeEvaluationConfig)
  }

  return evaluation
}

async function checkEvaluationNode({ node, configure, graphInstance, implementation }) {
  let evaluationNode = configure.destination
  const { resource, execute } = await graphInstance.databaseWrapper.getProcessElement({ concreteDatabase: graphInstance.database, nodeID: evaluationNode.identity })

  // run condition check
  // TODO: apply RUN relationship on subgraph of conditions and execute it.
  let checkResult
  if (evaluationNode.properties?.switchValue) {
    checkResult = evaluationNode.properties?.switchValue
  } else if (execute) {
    // execute chek process to retrieve checkResult.
    checkResult = await implementation({ node, configure: configure, execute, resource, graphInstance })
  } else {
    checkResult = undefined
  }

  // Switch cases: return evaluation configuration
  const { caseArray, default: defaultRelationship } = await graphInstance.databaseWrapper.getSwitchElement({ concreteDatabase: graphInstance.database, nodeID: evaluationNode.identity })
  let configurationProperty
  if (caseArray) {
    // compare expected value with result
    let caseRelationship = caseArray.filter(caseRelationship => caseRelationship.connection.properties?.expected == checkResult)[0]
    configurationProperty = caseRelationship?.destination.properties
  }
  configurationProperty ||= defaultRelationship?.destination.properties || {}
  return extractEvaluationConfigProperty(configurationProperty)
}
