process.env['SZN_DEBUG'] = true
import assert from 'assert'
import { assert as chaiAssertion } from 'chai'
import util from 'util'
import { Plugin, Graph, GraphElement, Entity } from '../source/script.js'
import { databaseModelAdapterFunction } from '../source/implementationPlugin/databaseModelAdapter/memoryModelAdapter.js'
import * as graphData from './asset/graphData' // load sample data

suite('Entity', () => {
  let plugin = new Plugin.clientInterface({
    pluginList: {
      databaseModelAdapter: {
        // database simple memory adapter
        memoryModelAdapter: databaseModelAdapterFunction({ nodeArray: graphData.nodeDataItem.nodeArray }),
      },
    },
    defaultPlugin: {
      databaseModelAdapter: 'memoryModelAdapter',
    },
  })
  // console.log(plugin)
  // let element = new GraphElement.clientInterface({ data: { key: 'x' } })
  // console.log(element)
})
