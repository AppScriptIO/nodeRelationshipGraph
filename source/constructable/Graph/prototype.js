import assert from 'assert'
export * as schemeReference from '../../dataModel/graphSchemeReference.js'

export async function load({ graphData } = {}) {
  // load graph into memory - load json graph data.
  assert(graphData.node && graphData.edge, `• Graph data object must contain node & edge arrays.`)
  return await this.database.implementation.loadGraphData({ nodeEntryData: graphData.node, connectionEntryData: graphData.edge })
}

export async function print({} = {}) {
  console.log(`______ Graph elements: ____________________`)
  let count = await this.count()
  let allNode = await this.database.implementation.getAllNode()
  let allEdge = await this.database.implementation.getAllEdge()
  console.log(`#Vertex = ${count.node}`)
  for (let node of allNode) {
    console.log(node.identity)
  }
  console.log(`\n#Edge = ${count.connection}`)
  for (let edge of allEdge) {
    console.log(`${edge.start} --> ${edge.end}`)
  }
  console.log(`___________________________________________`)
}

export async function count({} = {}) {
  return {
    node: await this.database.implementation.countNode(),
    connection: await this.database.implementation.countEdge(),
  }
}

export async function traverse({ traverser } = {}) {
  traverser ||= new this.configuredTraverser.clientInterface()
  this.statistics.traverserArray.push(traverser)
  traverser.result = await traverser.traverse(...arguments)
  return traverser
}
