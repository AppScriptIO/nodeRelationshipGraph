// produce json graph data from database queries

import path from 'path'
import { promises as filesystem } from 'fs'
import { Entity } from '@dependency/entity'
import { Database } from '../source/constructable/Database.class.js'
import { boltCypherModelAdapterFunction } from '../source/implementationPlugin/databaseModelAdapter/boltCypherModelAdapter.js'
import graphData from '../test/asset/graphData.exported.json' // load sample data

let concreteDatabaseBehavior = new Database.clientInterface({
  implementationList: {
    boltCypherModelAdapter: boltCypherModelAdapterFunction(),
  },
  defaultImplementation: 'boltCypherModelAdapter',
})
let concereteDatabaseInstance = concreteDatabaseBehavior[Entity.reference.getInstanceOf](Database)
let concereteDatabase = concereteDatabaseInstance[Database.reference.key.getter]()

;(async () => {
  // NOTE: lines are commented to prevent accidental override of json graph data.
  // await clearDatabase()
  // await concereteDatabase.loadGraphData({ nodeEntryData: graphData.node, connectionEntryData: graphData.edge })
  // await exportGraphData({ concereteDatabase })
  concereteDatabase.driverInstance.close()
})()

// Relies on the interface for concrete database plugins of graphTraversal module.
async function exportGraphData({ concereteDatabase, targetPath = path.normalize(path.join(__dirname, '..', 'test/asset/')), fileName = 'graphData.exported.json' } = {}) {
  let graphData = { node: await concereteDatabase.getAllNode(), edge: await concereteDatabase.getAllEdge() } |> JSON.stringify
  await filesystem.writeFile(path.join(targetPath, fileName), graphData, { encoding: 'utf8', flag: 'w' /*tructace file if exists and create a new one*/ })
  console.log(`• Created json file - ${path.join(targetPath, fileName)}`)
}

async function clearDatabase() {
  // Delete all nodes in the in-memory database
  const graphDBDriver = concereteDatabase.driverInstance
  let session = await graphDBDriver.session()
  await session.run(`match (n) detach delete n`)
  session.close()
}
