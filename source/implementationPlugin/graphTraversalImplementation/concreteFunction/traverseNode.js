import { nodeLabel, connectionType } from '../../../graphSchemeReference.js'
import assert from 'assert'

/**
 * @description loops through all the `node ports` and initializes each one to execute the `node connections` specific for it.
 * TODO: add ability to pass traversal configuration to a group of connections. Each port holds traversal cofigs that should affect all connection connected to this port.
 */
export async function* iterateFork({ node, nodeType, additionalChildNode, graphInstance }) {
  let forkArray = await graphInstance.database.getNodeConnection({ direction: 'outgoing', nodeID: node.identity, connectionType: connectionType.fork })
  if (forkArray.length == 0) return

  // Bulk actions on forks - sort forks
  forkArray.sort((former, latter) => former.connection.properties.order - latter.connection.properties.order) // using `order` property

  for (let fork of forkArray) {
    let forkNode = fork.destination
    assert(forkNode.labels.includes(nodeLabel.port), `• "${forkNode.labels}" Unsupported node type for a FORK connection.`) // verify node type
    let traversalConfig = { handlePropagationImplementation: forkNode.properties.handlePropagationImplementation }
    let nextIterator = yield {
      traversalConfig: traversalConfig,
      forkNode,
      nextIterator: await iterateNext({ node: forkNode, additionalChildNode, graphInstance }),
    }
  }
}

/**
 * Loops through node connection to traverse the connected nodes' graphs
 * @param {*} nodeConnectionArray - array of connection for the particular node
 */
async function* iterateNext({ node, additionalChildNode, graphInstance } = {}) {
  let nextArray = await graphInstance.database.getNodeConnection({ direction: 'outgoing', nodeID: node.identity, connectionType: connectionType.next })
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
      assert(nextNode.labels.includes(nodeLabel.stage) || nextNode.labels.includes(nodeLabel.subgraphTemplate), `• "${nextNode.labels}" Unsupported node type for a NEXT connection.`) // verify node type
      yield nextNode
    }
  }
}
