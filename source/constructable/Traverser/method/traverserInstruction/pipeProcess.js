// post rendering processing algorithms, when required e.g. further processing of rendred templates
export async function pipeProcessing({ targetNode, processResult, traverser = this }) {
  // get pipe edge
  let pipe
  const { pipeArray } = await traverser.graph.database::traverser.graph.database.getPipe({ nodeID: targetNode.identity })
  if (pipeArray.length > 1) throw new Error(`• Multiple pipe relationships are not supported in Processs node.`)
  // skip if no pipe connection - return value without change
  else if (pipeArray.length == 0) return processResult
  else pipe = pipeArray[0]

  let pipeResult = processResult // set initial result

  let functionCallback = await traverser::traverser.traverserInstruction.resourceResolution.resolveResource({ targetNode: pipe.destination, contextPropertyName: 'functionReferenceContext' })
  if (functionCallback) {
    let pipeFunction = await functionCallback({ node: pipe.destination }) // expected to return a pipe function.
    pipeResult = traverser::pipeFunction(processResult)
  }

  // recursive call for nested pipe edges (forming a pipeline from the main process node).
  pipeResult = traverser::pipeProcessing({ targetNode: pipe.destination, processResult: pipeResult })

  return pipeResult
}
