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

  let interfaceGraphElement = GraphElement.clientInterface({
    configuredConstructable: GraphElement[Entity.reference.configuredConstructable.method.construct]([
      {
        instantiateImplementationKey: 'defaultPrototype',
        initializeImplementationKey: 'data',
      },
    ]),
  })

  let element1 = new interfaceGraphElement({ data: { key: 'x' } })
  let element2 = new GraphElement.clientInterface({ data: { key: 'x' } })

  //     return new Proxy(GraphElement, {
  //       apply(target, thisArg, argumentsList) {
  //         console.log('ok')
  //       },
  //     })
  //   },
  // })

  // export const defaultClientInterface = e.clientInterface.construct({ constructorImplementation: 'constructableInterface' })
})
