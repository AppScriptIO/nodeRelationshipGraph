export async function evaluateCondition({ evaluator, nodeInstance, graphInstance }) {
  /**
   * 1. load condition file
   * 2. execute condition function
   * 3. compare expectedResult property to function result
   * 3. set evaluation config
   */

  let checkResult = check(nodeInstance) |> expectedResult == conditionResult
  if (checkResult) return

  //
  let traversalConfig = {
    processData: 'returnDataItemKey',
    handlePropagation: 'chronological',
    traverseNode: 'portConnection',
    aggregator: 'AggregatorArray',
    traversalInterception: 'processThenTraverse',
    evaluatePosition: 'evaluateCondition',
  }
  //node config relation property
  let evaluationConfig = { process: 'include', traverse: 'continue' }
  evaluator = new Evaluator(evaluationConfig)
}

function check(nodeInstance) {
  if (true) return true
}
