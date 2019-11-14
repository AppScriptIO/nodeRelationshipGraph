import assert from 'assert'

/**
 * The purpose of this function is to find & yield next nodes.
 * @description loops through all the `node ports` and initializes each one to execute the `node connections` specific for it.
 * @return {Object} node feed - nested object containing Fork/Port iterator with nested Next/Stage iterator for each.
 * TODO: add ability to pass traversal configuration to a group of connections. Each port holds traversal cofigs that should affect all connection connected to this port.
 **/
export async function* forkEdge({ node, additionalChildNode, implementation, graphInstance = this }) {
  const { forkArray } = await graphInstance.databaseWrapper.getFork({ concreteDatabase: graphInstance.database, nodeID: node.identity })
  if (forkArray.length == 0) return
  // Bulk actions on forks - sort forks
  forkArray.sort((former, latter) => former.connection.properties.order - latter.connection.properties.order) // using `order` property

  for (let fork of forkArray) {
    assert(fork.destination.labels.includes(graphInstance.schemeReference.nodeLabel.port), `• "${fork.destination.labels}" Unsupported node type for a FORK connection.`) // verify node type

    let nextIterator = graphInstance::implementation({ forkEdge: fork, additionalChildNode, graphInstance })

    // iterator of Next nodes
    yield { nextIterator, fork }
  }
}
