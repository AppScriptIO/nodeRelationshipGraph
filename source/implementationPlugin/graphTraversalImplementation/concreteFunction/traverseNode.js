export async function* portConnection({ nodeInstance, nodeType, graphInstance }) {
  let connection = await graphInstance.database.getNodeConnection({ sourceKey: nodeInstance.properties.key, direction: 'outgoing', destinationNodeType: nodeType })
  let port = (await graphInstance.database.getNodeConnection({ nodeInstance, direction: 'outgoing', destinationNodeType: 'port' })).map(connection => connection.destination) // extract port instance from relationships relating to ports.
  if (connection.length == 0) return

  let nodeIteratorFeed =
    port.length > 0
      ? // iterate over ports
        await iteratePort({ nodePortArray: port, nodeConnectionArray: connection, iterateConnectionCallback: iterateConnection, graphInstance })
      : // Iterate over connection
        await iterateConnection({ nodeConnectionArray: connection, graphInstance })
  yield* nodeIteratorFeed
}

/**
 * Loops through node connection to traverse the connected nodes' graphs
 * @param {*} nodeConnectionArray - array of connection for the particular node
 */
async function* iterateConnection({ nodeConnectionArray, graphInstance } = {}) {
  const controlArg = function.sent
  // sort connection array - in addition to the database sorting of the query results.
  nodeConnectionArray.sort((former, latter) => former.properties?.order - latter.properties?.order) // using `order` property

  for (let nodeConnection of nodeConnectionArray) {
    let nodeData = await graphInstance.database.getNodeByID({ id: nodeConnection.end })
    yield nodeData // iteration implementaiton
  }
}

/**
 * @description loops through all the `node ports` and initializes each one to execute the `node connections` specific for it.
 * TODO: add ability to pass traversal configuration to a group of connections. Each port holds traversal cofigs that should affect all connection connected to this port.
 */
async function* iteratePort({ nodePortArray, nodeConnectionArray, iterateConnectionCallback, graphInstance }) {
  // filter port array to match outgoing ports only
  nodePortArray = nodePortArray.filter(item => item.direction == 'output')

  // sort array
  const sortAccordingToOrder = (former, latter) => former.order - latter.order // using `order` property
  nodePortArray.sort(sortAccordingToOrder)
  for (let nodePort of nodePortArray) {
    // filter connection to match the current port
    let currentPortConnectionArray = nodeConnectionArray.filter(connection => connection.source[1]?.key == nodePort.key)
    yield* await iterateConnectionCallback({ nodeConnectionArray: currentPortConnectionArray, implementationType: nodePort.traverseNodeImplementation })
  }
}
