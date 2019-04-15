process.env['SZN_DEBUG'] = true
import assert from 'assert'
import { assert as chaiAssertion } from 'chai'
import util from 'util'
import { Entity } from '@dependency/entity'
import { GraphElement } from '../source/constructable/GraphElement.class.js'
import { Plugin } from '../source/constructable/Plugin.class.js'
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
  console.log(plugin)

  //? How to integrate Plugin with GraphElement

  let element = new GraphElement.clientInterfaceData({ key: 'x', plugin: plugin })
  console.log(element)
})
