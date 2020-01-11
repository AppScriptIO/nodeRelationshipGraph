import assert from 'assert'

export * as schemeReference from '../../dataModel/graphSchemeReference.js'

// load graph into memory
export async function load({ graphData } = {}) {
  // load json graph data.
  assert(graphData.node && graphData.edge, `• Graph data object must contain node & edge arrays.`)
  return await this.database.loadGraphData({ nodeEntryData: graphData.node, connectionEntryData: graphData.edge })
}

export async function print({} = {}) {
  console.log(`______ Graph elements: ____________________`)
  let count = await this.count()
  let allNode = await this.database.getAllNode()
  let allEdge = await this.database.getAllEdge()
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
  // count number of cached elements
  return {
    node: await this.database.countNode(),
    connection: await this.database.countEdge(),
  }
}

export async function traverse() {
  let T = new Traverser({ graph: this })
  T.traverse(...arguments)
  T.statistics()
  return T.result()
}
