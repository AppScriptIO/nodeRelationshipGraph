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

export function memgraphModelAdapterFunction({ url = { protocol: 'bolt', hostname: 'localhost', port: 7687 }, authentication = { username: 'neo4j', password: 'test' } } = {}) {
  const graphDBDriver = boltProtocolDriver.driver(`${url.protocol}://${url.hostname}:${url.port}`, boltProtocolDriver.auth.basic(authentication.username, authentication.password))
  return {
    addNode: async ({ nodeData }) => {
      assert(nodeData.properties?.key, '• Node data must have a key property.')

      let session = await graphDBDriver.session()
      let query = `
        create (n:${jsonToCepherAdapter.convertArrayToCepherLabel(nodeData.labels)} {${jsonToCepherAdapter.convertObjectToCepherProperty(nodeData.properties)}})
        return n
      `
      let result = await session.run(query)
      // result.records.forEach(record => record.toObject() |> console.log)
      session.close()
      return result
    },
    addConnection: async ({ connectionData }) => {
      assert(connectionData.source && connectionData.destination, `• Connection must have a source and destination nodes.`)
      assert(connectionData.properties?.key, '• Connection object must have a key property.')
      let session = await graphDBDriver.session()
      let query = `
        match (source { key: '${connectionData.source}' })
        match (destination { key: '${connectionData.destination}' })
        create 
          (source)
          -[l:NEXT {${jsonToCepherAdapter.convertObjectToCepherProperty(connectionData.properties)}}]->
          (destination) 
        return l
      `
      let result = await session.run(query)
      // result.records.forEach(record => record.toObject() |> console.log)
      session.close()
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
      session.close()
      return result
    },
    getNodeByKey: async function({ key }) {
      let session = await graphDBDriver.session()
      let query = `
        match (n {key: '${key}'})
        return n
      `
      let result = await session.run(query)
      session.close()
      return result.records[0].toObject().n
    },
    getNodeByID: async function({ id }) {
      let session = await graphDBDriver.session()
      let query = `
        match (n) where id(n)=${id}
        return n
      `
      let result = await session.run(query)
      session.close()
      return result.records[0].toObject().n
    },
    countNode: async function() {
      let session = await graphDBDriver.session()
      let query = `
        MATCH (n)
        RETURN count(n) as count
      `
      let result = await session.run(query)
      session.close()
      return result.records[0].toObject().count
    },
    countEdge: async function() {
      let session = await graphDBDriver.session()
      let query = `
        MATCH ()-[r]->()
        RETURN count(r) as count
      `
      let result = await session.run(query)
      session.close()
      return result.records[0].toObject().count
    },
  }
}
