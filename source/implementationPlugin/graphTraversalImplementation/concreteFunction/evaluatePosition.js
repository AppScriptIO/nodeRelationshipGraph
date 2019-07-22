import { connectionType, nodeLabel } from '../../../graphSchemeReference.js'
import assert from 'assert'
import { evaluationOption } from '../../../constructable/Evaluator.class.js'

export async function evaluateCondition({ evaluation, node, graphInstance }) {
  let configureRelationshipArray = await graphInstance.database.getNodeConnection({ direction: 'incoming', nodeID: node.identity, connectionType: connectionType.configure })

  for (let configureRelationship of configureRelationshipArray) {
    let configureNode = configureRelationship.destination

    // verify & switch node type
    let nodeEvaluationConfig = {}
    if (configureNode.labels.includes(nodeLabel.configuration)) {
      nodeEvaluationConfig = extractEvaluationConfigProperty(configureNode.properties)
    } else if (configureNode.labels.includes(nodeLabel.evaluation)) {
      nodeEvaluationConfig = await checkEvaluationNode({ evaluationNode: configureNode, graphInstance })
    } else throw new Error(`• "${configureNode.labels}" Unsupported node type for a NEXT connection.`)

    Object.assign(evaluation, nodeEvaluationConfig)
  }
}

async function checkEvaluationNode({ evaluationNode, graphInstance }) {
  let caseRelationshipArray = await graphInstance.database.getNodeConnection({ direction: 'outgoing', nodeID: evaluationNode.identity, connectionType: connectionType.case })
  let defaultRelationshipArray = await graphInstance.database.getNodeConnection({ direction: 'outgoing', nodeID: evaluationNode.identity, connectionType: connectionType.default })
  let executeRelationshipArray = await graphInstance.database.getNodeConnection({ direction: 'outgoing', nodeID: evaluationNode.identity, connectionType: connectionType.execute })

  // run condition check
  let checkResult
  if (executeRelationshipArray.length > 0) {
    let executeNode = executeRelationshipArray[0].destination
    // TODO: execute chek process to retrieve checkResult.
    // TODO: apply RUN on subgraph of conditions.
    checkResult = undefined // execute process
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

function extractEvaluationConfigProperty(propertyObject) {
  return Object.entries(propertyObject).reduce((accumulator, [key, value]) => {
    if (Object.keys(evaluationOption).includes(key)) accumulator[key] = value
    return accumulator
  }, {})
}
