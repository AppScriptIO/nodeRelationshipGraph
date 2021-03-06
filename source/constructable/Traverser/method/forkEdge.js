import assert from 'assert'
import * as schemeReference from '../../../dataModel/graphSchemeReference.js'

/**
 * @description loops through all the `node ports` and initializes each one to execute the `node connections` specific for it.
 * @yield  {iterator feed of object} nodes group object - nested object containing Fork/Port iterator with nested Next/Stage iterator for each.
 * TODO: add ability to pass traversal configuration to a group of connections. Each port holds traversal cofigs that should affect all connection connected to this port.
 * OR
 * @return {undefined} in case no forks.
 **/
export async function* forkEdge({ stageNode, additionalChildNode, getImplementation, nestedTraversalCallParameter }) {
  const { forkArray } = await this.graph.database::this.graph.database.getFork({ nodeID: stageNode.identity })
  if (forkArray.length == 0) return
  // Bulk actions on forks - sort forks
  forkArray.sort((former, latter) => former.connection.properties.order - latter.connection.properties.order || isNaN(former.connection.properties.order) - isNaN(latter.connection.properties.order)) // using `order` property

  for (let forkEdge of forkArray) {
    assert(forkEdge.destination.labels.includes(schemeReference.nodeLabel.port), `• "${forkEdge.destination.labels}" Unsupported node type for a FORK connection.`) // verify node type

    // get node iteartor from "portNode" implemenation - e.g. "nestedNode"
    let implementation = getImplementation(forkEdge.destination.properties.implementation) // Traversal implementation - node/edge properties implementation hierarchy - calculate and pick correct implementation according to parameter hierarchy.
    let nodeIterator = this::implementation({ forkEdge, additionalChildNode })
    // pipe node itrator to create a traversal iterator (where traversal invocation callback is provided)
    let traversalIterator = this::this.traversalIteration({ nodeIteratorFeed: nodeIterator, nestedTraversalCallParameter })

    yield {
      group: {
        traversalIterator,
        // nodes group configuration and info
        config: {
          forkEdge,
          handlePropagationImplementationKey: forkEdge.connection.properties.handlePropagationImplementation,
        },
      },
    }
  }
}
