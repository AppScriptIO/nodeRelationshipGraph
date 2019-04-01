process.env['SZN_DEBUG'] = true
import assert from 'assert'
import { assert as chaiAssertion } from 'chai'
import util from 'util'
import { Plugin, Graph, GraphElement, Entity } from '../source/script.js'
import { databaseModelAdapterFunction } from '../source/implementationPlugin/databaseModelAdapter/memoryModelAdapter.js'
import * as graphData from './asset/graphData' // load sample data

suite('Entity', () => {
  let configuredPlugin = Plugin[Entity.reference.configuredConstructable.method.construct]([
    {
      instantiateImplementationKey: 'defaultPrototype',
      initializeImplementationKey: 'data',
    },
  ])
  let plugin = configuredPlugin[Entity.reference.prototypeInstance.method.construct.instantiate]()
  configuredPlugin[Entity.reference.prototypeInstance.method.construct.initialize](
    [
      {
        pluginList: {
          databaseModelAdapter: {
            // database simple memory adapter
            memoryModelAdapter: databaseModelAdapterFunction({ nodeArray: graphData.nodeDataItem.nodeArray }),
          },
        },
        defaultPlugin: {
          databaseModelAdapter: 'memoryModelAdapter',
        },
      },
    ],
    {
      instanceObject: plugin,
    },
  )
  console.log(plugin)

  // let plugin = Plugin[Entity.reference.prototypeInstance.method.construct.instantiate]([], { implementationKey: 'defaultPrototype' })
  // Plugin[Entity.reference.prototypeInstance.method.construct.initialize](
  //   [
  //     {
  //       pluginList: {
  //         databaseModelAdapter: {
  //           // database simple memory adapter
  //           memoryModelAdapter: databaseModelAdapterFunction({ nodeArray: graphData.nodeDataItem.nodeArray }),
  //         },
  //       },
  //       defaultPlugin: {
  //         databaseModelAdapter: 'memoryModelAdapter',
  //       },
  //     },
  //   ],
  //   {
  //     implementationKey: 'data',
  //     instanceObject: plugin,
  //   },
  // )

  // console.log(plugin)

  // let interfaceGraphElement = GraphElement[Entity.reference.clientInterface.construct]([], { implementationKey: 'constructableInterface' })
  // let i2 = interfaceGraphElement()

  // let configuredGraphElement = GraphElement[Entity.reference.configuredConstructable.construct](
  //   [
  //     {
  //       plugin,
  //     },
  //   ],
  //   {
  //     implementationKey: 'default',
  //   },
  // )

  // console.log(configuredGraphElement)

  // let instance = GraphElement[Entity.reference.prototypeInstance.method.construct.instantiate]([], { implementationKey: 'defaultPrototype' })
  // GraphElement[Entity.reference.prototypeInstance.method.construct.initialize]([{ data: { key: 'x2' } }], { implementationKey: 'data', instanceObject: instance })

  //     return new Proxy(GraphElement, {
  //       apply(target, thisArg, argumentsList) {
  //         console.log('ok')
  //       },
  //     })
  //   },
  // })

  // export const defaultClientInterface = e.clientInterface.construct({ constructorImplementation: 'constructableInterface' })
})
