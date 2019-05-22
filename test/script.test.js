debugger
process.env['SZN_DEBUG'] = true
import assert from 'assert'
import { assert as chaiAssertion } from 'chai'
import util from 'util'
import { Entity } from '@dependency/entity'
import { GraphElement } from '../source/constructable/GraphElement.class.js'
import { Plugin } from '../source/constructable/Plugin.class.js'
import { linkConstructor } from '../source/prototypeChain/linkConstructor.js'
import { InstanceContext } from '../source/constructable/InstanceContext.class.js'
import { databaseModelAdapterFunction } from '../source/implementationPlugin/databaseModelAdapter/memoryModelAdapter.js'
import * as graphData from './asset/graphData' // load sample data

/**
 * Graph will contain the prototype chain to install on the instances (previously 'classes hierarchy connections`)
 * 1. configuredConstructable1 = Graph(<plugins>)
 * 2. configuredConstructable2 = configuredConstructable1(<context>)
 * 3. new configuredConstructable2(<instance data>) // creates instance
 * 4. traverse graph: e.g. instance.traverseGraph()
 */
suite('Graph traversal scenarios - Traversing graphs with different implementations', () => {
  suite('configured graph with loading plugins and database adapter', async () => {
    let pluginInstance = new Plugin.clientInterface({
      pluginList: {
        databaseModelAdapter: {
          // database simple memory adapter
          memoryModelAdapter: databaseModelAdapterFunction({ nodeArray: graphData.nodeDataItem.nodeArray }),
          memoryModelAdapter2: databaseModelAdapterFunction({
            nodeArray: graphData.nodeDataItemAsReference.nodeArray,
            dataItemArray: graphData.nodeDataItemAsReference.dataItemArray,
          }),
        },
        graphTraversalImplementation: {
          aggregateIntoArray() {
            return require('./implementation/graphTraversalImplementation/debugImplementation.js').aggregateIntoArray
          },
          condition() {
            // return require('./implementation/graphTraversalImplementation/condition.js').condition
          },
          middleware() {
            // return require('./implementation/graphTraversalImplementation/middleware.js').middleware
          },
          schema() {
            // return require('./implementation/graphTraversalImplementation/schema.js').schema
          },
          shellscript() {
            // return require('./implementation/graphTraversalImplementation/shellscript.js').shellscript
          },
          template() {
            // return require('./implementation/graphTraversalImplementation/template.js').template
          },
        },
      },
      defaultPlugin: {
        databaseModelAdapter: 'memoryModelAdapter',
        graphTraversalImplementation: 'aggregateIntoArray',
      },
    })

    let configuredGraph = GraphElement.clientInterfaceData({
      pluginInstance,
      contextInstance: new InstanceContext({ data: 'This string is shared between instances of the same context.' }),
      //? prototype chain for creating instance with unique prototype chain ???
    })

    test('Should traverse graph successfully', async () => {
      const fixture = { traversalResult: ['dataItem-key-1'] }
      try {
        // traverse using implemenation `aggregateArray` which will return an array of data items of the nodes.
        let resultArray = await (new configuredGraph({ key: 'node-key-1' }) |> (instance => instance.traverseGraph()))
        chaiAssertion.deepEqual(resultArray, fixture.traversalResult)
      } catch (error) {
        throw new Error(error)
      }
    })
  })
})
