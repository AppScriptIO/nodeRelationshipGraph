import assert from 'assert'
const boltProtocolDriver = require('neo4j-driver').v1

// convention of data structure - `connection: { source: [<nodeKey>, <portKey>], destination: [<nodeKey>, <portKey>] }`
const jsonToCepherAdapter = {
  convertObjectToCepherProperty(object) {
    let propertyArray = []
    for (let [key, value] of Object.entries(object)) {
      ;`${key}: ${typeof value == 'boolean' || typeof value == 'number' ? value : `'${value}'`}` |> propertyArray.push
    }
    return propertyArray.join(', ')
  },
  convertArrayToCepherLabel(array) {
    return array.join(':')
  },
}

export function boltCypherModelAdapterFunction({ url = { protocol: 'bolt', hostname: 'localhost', port: 7687 }, authentication = { username: 'neo4j', password: 'test' } } = {}) {
  const graphDBDriver = boltProtocolDriver.driver(`${url.protocol}://${url.hostname}:${url.port}`, boltProtocolDriver.auth.basic(authentication.username, authentication.password), {
    disableLosslessIntegers: true, // neo4j represents IDs as integers, and through the JS driver transforms them to strings to represent high values approximately 2^53 +
  })
  const implementation = {
    driverInstance: graphDBDriver, // expose driver instance
    // load nodes and connections from json file data.
    async loadGraphData({ nodeEntryData = [], connectionEntryData = [] } = {}) {
      for (let entry of nodeEntryData) {
        await implementation.addNode({ nodeData: entry })
      }
      // rely on `key` property to create connections
      connectionEntryData.map(connection => {
        connection.startKey = nodeEntryData.filter(node => node.identity == connection.start)[0].properties.key
        connection.endKey = nodeEntryData.filter(node => node.identity == connection.end)[0].properties.key
      })
      for (let entry of connectionEntryData) {
        await implementation.addConnection({ connectionData: entry })
      }
    },
    addNode: async ({ nodeData /*conforms with the Cypher query results data convention*/ }) => {
      assert(nodeData.properties?.key, '• Node data must have a key property.')

      let session = await graphDBDriver.session()
      let query = `
        create (n:${jsonToCepherAdapter.convertArrayToCepherLabel(nodeData.labels)} {${jsonToCepherAdapter.convertObjectToCepherProperty(nodeData.properties)}})
        return n
      `
      let result = await session.run(query)
      // result.records.forEach(record => record.toObject() |> console.log)
      await session.close()
      return result
    },
    addConnection: async ({ connectionData /*conforms with the Cypher query results data convention*/ }) => {
      assert(connectionData.start && connectionData.end, `• Connection must have a start and end nodes.`)
      assert(connectionData.properties?.key, '• Connection object must have a key property.')
      let nodeArray = await implementation.getAllNode()
      let session = await graphDBDriver.session()
      let query = `
        match (source { key: '${connectionData.startKey}' })
        match (destination { key: '${connectionData.endKey}' })
        create 
          (source)
          -[l:${connectionData.type} {${jsonToCepherAdapter.convertObjectToCepherProperty(connectionData.properties)}}]->
          (destination) 
        return l
      `
      let result = await session.run(query)
      // result.records.forEach(record => record.toObject() |> console.log)
      await session.close()
      return result
    },
    getNodeConnection: async function({
      direction = 'outgoing' /* filter connection array to match outgoing connections only*/,
      sourceKey,
      destinationNodeType,
    }: {
      direction: 'outgoing' | 'incoming',
    }) {
      assert(direction == 'outgoing', '• `direction` parameter unsupported.')
      let session = await graphDBDriver.session()
      let query = `
        match 
          (source { key: '${sourceKey}' })
          -[l:NEXT]->
          (destination${destinationNodeType ? `:${destinationNodeType}` : ''}) 
        return l
      `
      let result = await session.run(query)
      result = result.records.map(record => record.toObject().l)
      await session.close()
      return result
    },
    getNodeByKey: async function({ key }) {
      let session = await graphDBDriver.session()
      let query = `
        match (n {key: '${key}'})
        return n
      `
      let result = await session.run(query)
      await session.close()
      return result.records[0].toObject().n
    },
    getNodeByID: async function({ id }) {
      let session = await graphDBDriver.session()
      let query = `
        match (n) where id(n)=${id}
        return n
      `
      let result = await session.run(query)
      await session.close()
      return result.records[0].toObject().n
    },
    getAllNode: async function() {
      let session = await graphDBDriver.session()
      let query = `
        match (n) return n
      `
      let result = await session.run(query)
      await session.close()
      return result.records
        .map(record => record.toObject().n)
        .map(node => {
          // node.identity = node.identity.toString()
          return node
        })
    },
    getAllEdge: async function() {
      let session = await graphDBDriver.session()
      let query = `
        match ()-[l]->() return l
      `
      let result = await session.run(query)
      await session.close()
      return result.records
        .map(record => record.toObject().l)
        .map(edge => {
          // Note: Bolt driver option handles integer transformation.
          // change numbers to string representation
          // edge.identity = edge.identity.toString()
          // edge.start = edge.start.toString()
          // edge.end = edge.end.toString()
          return edge
        })
    },
    countNode: async function() {
      let session = await graphDBDriver.session()
      let query = `
        MATCH (n)
        RETURN count(n) as count
      `
      let result = await session.run(query)
      await session.close()
      return result.records[0].toObject().count
    },
    countEdge: async function() {
      let session = await graphDBDriver.session()
      let query = `
        MATCH ()-[r]->()
        RETURN count(r) as count
      `
      let result = await session.run(query)
      await session.close()
      return result.records[0].toObject().count
    },
  }
  return implementation
}
