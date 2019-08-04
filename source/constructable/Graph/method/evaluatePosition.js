import assert from 'assert'
import { nodeLabel, connectionType, connectionProperty } from '../../../graphSchemeReference.js'
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
  // default values
  evaluation = new Evaluator({ propagation: evaluationOption.propagation.continue, aggregation: evaluationOption.aggregation.include }) // Note: Additional default values for Evaluator constructor are set above during initialization of Evaluator static class.

  let configureRelationshipArray = await graphInstance.database.getNodeConnection({ direction: 'incoming', nodeID: node.identity, connectionType: connectionType.configure })

  for (let configureRelationship of configureRelationshipArray) {
    let configureNode = configureRelationship.destination

    // verify & switch node type
    let nodeEvaluationConfig = {}
    if (configureNode.labels.includes(nodeLabel.configuration)) {
      nodeEvaluationConfig = extractEvaluationConfigProperty(configureNode.properties)
    } else if (configureNode.labels.includes(nodeLabel.evaluation)) {
      nodeEvaluationConfig = await checkEvaluationNode({ evaluationNode: configureNode, node, graphInstance, implementation })
    } else throw new Error(`• "${configureNode.labels}" Unsupported node type for a NEXT connection.`)

    // manipulate evaluation config
    Object.assign(evaluation, nodeEvaluationConfig)
  }

  return evaluation
}

async function checkEvaluationNode({ node, evaluationNode, graphInstance, implementation }) {
  let caseRelationshipArray = await graphInstance.database.getNodeConnection({ direction: 'outgoing', nodeID: evaluationNode.identity, connectionType: connectionType.case })
  let defaultRelationshipArray = await graphInstance.database.getNodeConnection({ direction: 'outgoing', nodeID: evaluationNode.identity, connectionType: connectionType.default })
  let executeRelationshipArray = await graphInstance.database.getNodeConnection({ direction: 'outgoing', nodeID: evaluationNode.identity, connectionType: connectionType.execute })
  // TODO: apply RUN relationship on subgraph of conditions and execute it.

  // run condition check
  let checkResult
  if (executeRelationshipArray.length > 0) {
    let executeNode = executeRelationshipArray[0].destination
    // execute chek process to retrieve checkResult.
    checkResult = await implementation({ node, evaluationNode, executeNode, graphInstance })
  } else {
    checkResult = evaluationNode.properties?.switchValue || undefined
  }
  caseRelationshipArray = caseRelationshipArray.filter(caseRelationship => caseRelationship.connection.properties?.expected == checkResult)

  // return evaluation configuration
  if (caseRelationshipArray.length > 0) {
    let caseNode = caseRelationshipArray[0].destination
    assert(caseNode.labels.includes(nodeLabel.configuration), `• "${caseNode.labels}" Unsupported node type for a NEXT connection.`) // verify node type
    return extractEvaluationConfigProperty(caseNode.properties)
  } else {
    let defaultNode = defaultRelationshipArray[0].destination
    assert(defaultNode.labels.includes(nodeLabel.configuration), `• "${defaultNode.labels}" Unsupported node type for a NEXT connection.`) // verify node type
    return extractEvaluationConfigProperty(defaultNode.properties)
  }
}
