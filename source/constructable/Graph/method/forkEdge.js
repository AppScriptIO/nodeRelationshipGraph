import assert from 'assert'

/**
 * The purpose of this function is to find & yield next nodes.
 * @description loops through all the `node ports` and initializes each one to execute the `node connections` specific for it.
 * @return {Object} node feed - nested object containing Fork/Port iterator with nested Next/Stage iterator for each.
 * TODO: add ability to pass traversal configuration to a group of connections. Each port holds traversal cofigs that should affect all connection connected to this port.
 **/
export async function* forkEdge({ node, additionalChildNode, getImplementation, graphInstance = this }) {
  const { forkArray } = await graphInstance.databaseWrapper.getFork({ concreteDatabase: graphInstance.database, nodeID: node.identity })
  if (forkArray.length == 0) return
  // Bulk actions on forks - sort forks
  forkArray.sort((former, latter) => former.connection.properties.order - latter.connection.properties.order) // using `order` property

  for (let fork of forkArray) {
    assert(fork.destination.labels.includes(graphInstance.schemeReference.nodeLabel.port), `• "${fork.destination.labels}" Unsupported node type for a FORK connection.`) // verify node type

    let nodeImplementationKey // traversal implementation key from the node properties (node/edge properties implementation hierarchy)
    if (fork.destination.properties.handlePropagationImplementation) nodeImplementationKey = { handlePropagation: fork.destination.properties.handlePropagationImplementation }
    let implementation = getImplementation({ nodeImplementationKey }) // calculate and pick correct implementation according to parameter hierarchy.

    let nextIterator = graphInstance::graphInstance.portNode({
      nodeIteratorFeed: await iterateNext({ node: fork.destination, additionalChildNode, graphInstance }),
      implementation: node::implementation,
    })

    // iterator of Next nodes
    yield { nextIterator, fork }
  }
}

/**
 * Loops through node connection to traverse the connected nodes' graphs
 * @param {*} nodeConnectionArray - array of connection for the particular node
 */
async function* iterateNext({ node, additionalChildNode, graphInstance } = {}) {
  const { nextArray } = await graphInstance.databaseWrapper.getNext({ concreteDatabase: graphInstance.database, nodeID: node.identity })
  if (nextArray.length == 0) return

  // Bulk action - sort connection array - in addition to the database sorting of the query results.
  nextArray.sort((former, latter) => former.connection.properties?.order - latter.connection.properties?.order) // using `order` property

  for (let next of nextArray) {
    // deal with additional nodes
    let insertAdditional = additionalChildNode.reduce(
      (accumolator, additional, index, array) => {
        if (additional.placement.connectionKey == next.connection.properties.key) {
          // additional.placement.position is a string that can be 'before' | 'after'
          accumolator[additional.placement.position].push(additional.node) && delete array[index]
        }
        return accumolator
      },
      { before: [], after: [] },
    )
    additionalChildNode = additionalChildNode.filter(n => n) // filter empty (deleted) items

    // add additional nodes to current node and yield all sequentially.
    for (let nextNode of [...insertAdditional.before, next.destination, ...insertAdditional.after]) {
      yield nextNode
    }
  }
}
