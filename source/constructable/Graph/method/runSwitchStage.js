export async function runSwitchStage({ node, configure, graphInstance, implementation }) {
  let evaluationNode = configure.destination
  const { resource, execute } = await graphInstance.databaseWrapper.getProcessElement({ concreteDatabase: graphInstance.database, nodeID: evaluationNode.identity })

  // run condition check
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
  let configurationNode
  if (caseArray) {
    // compare expected value with result
    let caseRelationship = caseArray.filter(caseRelationship => caseRelationship.connection.properties?.expected == checkResult)[0]
    configurationNode = caseRelationship?.destination
  }
  configurationNode ||= defaultRelationship?.destination || {}
  return configurationNode
}
