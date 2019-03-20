process.env['SZN_DEBUG'] = true
import assert from 'assert'
import { assert as chaiAssertion } from 'chai'

import { GraphElementFunction, PluginFunction, Graph } from '../source/script.js'
import { databaseModelAdapterFunction } from '../source/implementationPlugin/databaseModelAdapter/memoryModelAdapter.js'
import * as graphData from './asset/graphData' // load sample data

suite('Graph Element - construct', () => {
  // {
  //   let GraphElement = GraphElementFunction()
  //   let instance = new GraphElement({ data: graphData.nodeDataItem.nodeArray[0] }, { constructor: 'data' })
  //   test('instance should match data', () => {
  //     chaiAssertion.deepEqual(instance, graphData.nodeDataItem.nodeArray[0])
  //   })
  // }
  {
    //! Incomplete
    let GraphElement = GraphElementFunction()
    let Plugin = PluginFunction()
    let plugin = new Plugin(
      [
        {
          databaseModelAdapter: {
            // database simple memory adapter
            memoryModelAdapter: databaseModelAdapterFunction({ nodeArray: graphData.nodeDataItem.nodeArray }),
          },
        },
        {
          defaultPlugin: {
            databaseModelAdapter: 'memoryModelAdapter',
          },
        },
      ],
      {
        constructor: 'data',
      },
    )
    let configuredGraphElement1 = GraphElement({ plugin })
    // // let configuredGraphElement2 = configuredGraphElement1('plugin2')
    // // let configuredGraphElement3 = configuredGraphElement2('plugin3')
    let instance = new configuredGraphElement1({ key: 'X1' })
    // console.log(instance)
    test('instace should be created with database entry', () => {
      // chaiAssertion.deepEqual(GraphElement.prototype.constructor, configuredGraphElement2.prototype.constructor)
    })
  }
})
