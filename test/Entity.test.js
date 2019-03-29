process.env['SZN_DEBUG'] = true
import assert from 'assert'
import { assert as chaiAssertion } from 'chai'

import { PluginFunction, Graph, GraphElement, Entity } from '../source/script.js'
import { databaseModelAdapterFunction } from '../source/implementationPlugin/databaseModelAdapter/memoryModelAdapter.js'
import * as graphData from './asset/graphData' // load sample data

suite('Entity', () => {
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

  let interfaceGraphElement = GraphElement[Entity.reference.clientInterface.construct]([], { implementationKey: 'constructableInterface' })
  let i2 = interfaceGraphElement()
  console.log(i2)

  let configuredGraphElement = GraphElement[Entity.reference.configuredConstructable.construct](
    [
      {
        plugin,
      },
    ],
    {
      implementationKey: 'default',
    },
  )

  console.log(configuredGraphElement)

  let instance
  instance = GraphElement[Entity.reference.prototypeInstance.construct](
    [
      {
        data: { key: 'X1' },
      },
    ],
    {
      implementationKey: 'data',
    },
  )

  console.log(instance.constructor)

  //     return new Proxy(GraphElement, {
  //       apply(target, thisArg, argumentsList) {
  //         console.log('ok')
  //       },
  //     })
  //   },
  // })

  // export const defaultClientInterface = e.clientInterface.construct({ constructorImplementation: 'constructableInterface' })
})
