import assert from 'assert'
const boltProtocolDriver = require('neo4j-driver').v1
import generateUUID from 'uuid/v4'
import { nodeLabel } from '../../graphSchemeReference.js'

// convention of data structure - `connection: { source: [<nodeKey>, <portKey>], destination: [<nodeKey>, <portKey>] }`
const jsonToCepherAdapter = {
  convertObjectToCepherProperty(object) {
    let propertyArray = []
    for (let [key, value] of Object.entries(object)) {
      switch (typeof value) {
        case 'boolean':
        case 'number':
          propertyArray.push(`${key}: ${value}`)
          break
        case 'string':
          propertyArray.push(`${key}:"${value}"`)
          break
        case 'object': // an array (as the property cannot be an object in property graph databases)
          propertyArray.push(`${key}: [${value.map(item => (typeof item == 'string' ? `"${item}"` : item)).join(', ')}]`)
          break
        default:
          throw new Error(`• "${typeof value}" Property value type for graph data is not supported.`)
          break
      }
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
    // maxConnectionPoolSize: process.env.DRIVER_MAX_CONNECTION_POOL_SIZE || 50,                     // maximum number of connections to the connection pool
    // maxConnectionLifetime: process.env.DRIVER_MAX_CONNECTION_LIFETIME || 4 * 60 * 60 * 1000,      // time in ms, 4 hours maximum connection lifetime
    // maxTransactionRetryTime: process.env.DRIVER_MAX_TRANSACTION_RETRY_TIME || 3 * 1000,           // time in ms to retry a transaction
    // connectionAcquisitionTimeout: process.env.DRIVER_CONNECTION_ACQUISITION_TIMEOUT || 2 * 1000,  // time in ms to wait for a connection to become available in the pool
    // trust: process.env.DRIVER_TLS_TRUST || 'TRUST_ALL_CERTIFICATES',                              // tls trust configuration
    // encrypted: process.env.DRIVER_TLS_ENABLED || 'ENCRYPTION_OFF'                                 // enable/disable TLS encryption to client
  })

  const implementation = {
    driverInstance: graphDBDriver, // expose driver instance
    // load nodes and connections from json file data.
    async loadGraphData({ nodeEntryData = [], connectionEntryData = [] } = {}) {
      // {
      //   const map = {
      //     nodeKey: new Map(),
      //     connectionKey: new Map(),
      //   }
      //   // create unique keys for each node and connection
      //   nodeEntryData.map(node => {
      //     let oldKey = node.properties.key
      //     map.nodeKey.set(oldKey, generateUUID())
      //     node.properties.key = map.nodeKey.get(oldKey)
      //     return node
      //   })
      //   connectionEntryData.map(c => {
      //     let oldKey = c.properties.key
      //     map.connectionKey.set(oldKey, generateUUID())
      //     c.properties.key = map.connectionKey.get(oldKey)
      //     return c
      //   })
      // }

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
      assert(typeof connectionData.start == 'number' && typeof connectionData.end == 'number', `• Connection must have a start and end nodes.`)
      if (connectionData.type == 'NEXT') assert(connectionData.properties?.key, '• Connection object must have a key property.')
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
    getNodeConnectionByKey: async function({
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
        order by destination.key
      `
      let result = await session.run(query)
      result = result.records.map(record => record.toObject().l)
      await session.close()
      return result
    },
    /**
     * @returns Array of objects [{
     *  connection: Object,
     *  source: Object,
     *  destination: Object
     * }]
     */
    getNodeConnection: async function({
      direction /* filter connection array to match outgoing connections only*/,
      nodeID,
      destinationNodeType,
      connectionType,
    }: {
      direction: 'outgoing' | 'incoming' | undefined /*both incoming and outgoing*/,
    }) {
      let session = await graphDBDriver.session()
      let connection = direction == 'outgoing' ? `-[connection:${connectionType}]->` : direction == 'incoming' ? `<-[connection:${connectionType}]-` : `-[connection:${connectionType}]-`
      let query = `
        match 
          (source)
          ${connection}
          (destination${destinationNodeType ? `:${destinationNodeType}` : ''}) 
        where id(source)=${nodeID}
        return connection, source, destination
        order by destination.key
      `
      let result = await session.run(query)
      result = result.records.map(record => record.toObject())
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
        match (n) return n order by n.key
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
        match ()-[l]->(n) return l order by n.key
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
