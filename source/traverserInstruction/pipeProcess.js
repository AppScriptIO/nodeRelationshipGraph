// post rendering processing algorithms, when required e.g. further processing of rendred templates
export async function pipeProcessing({ targetNode, processResult, graph }) {
  // get pipe edge
  let pipe
  const { pipeArray } = await graph.databaseWrapper.getPipe({ concreteDatabase: graph.database, nodeID: targetNode.identity })
  if (pipeArray.length > 1) throw new Error(`• Multiple pipe relationships are not supported in Processs node.`)
  // skip if no pipe connection - return value without change
  else if (pipeArray.length == 0) return processResult
  else pipe = pipeArray[0]

  let pipeResult = processResult // set initial result

  let functionCallback = await graph.traverserInstruction.resourceResolution.resolveResource({ targetNode: pipe.destination, graph, contextPropertyName: 'functionReferenceContext' })
  let pipeFunction = await functionCallback({ node: pipe.destination, graph }) // expected to return a pipe function.
  pipeResult = pipeFunction(processResult)

  // recursive call for nested pipe edges (forming a pipeline from the main process node).
  pipeResult = pipeProcessing({ targetNode: pipe.destination, processResult: pipeResult, graph })

  return pipeResult
}
