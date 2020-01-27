process.env['SZN_DEBUG'] = true
import assert from 'assert'
import { assert as chaiAssertion } from 'chai'
import util from 'util'
import path from 'path'
import filesystem from 'fs'
import { performance, PerformanceObserver } from 'perf_hooks'
const boltProtocolDriver = require('neo4j-driver').v1
import * as ownConfig from '../configuration'

import { Entity } from '@dependency/entity'
import * as Graph from '../source/constructable/Graph'
import * as Traverser from '../source/constructable/Traverser'
import * as Database from '../source/constructable/Database'
import * as Context from '../source/constructable/Context.class.js'
import * as schemeReference from '../source/dataModel/graphSchemeReference.js'
import * as implementation from '@dependency/graphTraversal-implementation'
import graphData from './graph.json' // load sample data
const fixture = { traversalResult: ['dataItem-key-1'] }

async function clearGraphData() {
  // Delete all nodes in the in-memory database
  const url = { protocol: 'bolt', hostname: 'localhost', port: 7687 },
    authentication = { username: 'neo4j', password: 'test' }
  const graphDBDriver = boltProtocolDriver.driver(`${url.protocol}://${url.hostname}:${url.port}`, boltProtocolDriver.auth.basic(authentication.username, authentication.password))
  let session = await graphDBDriver.session()
  let result = await session.run(`match (n) detach delete n`)
  session.close()
}

let contextInstance = new Context.clientInterface({
  implementationKey: {
    processNode: 'returnDataItemKey',
    portNode: 'nestedNode',
    aggregator: 'AggregatorArray',
    traversalInterception: 'processThenTraverse',
  },
})

let concreteDatabaseBehavior = new Database.clientInterface({
  implementationList: {
    redisModelAdapterFunction: implementation.database.redisModelAdapterFunction,
    simpleMemoryModelAdapter: implementation.database.simpleMemoryModelAdapterFunction,
    boltCypher: implementation.database.boltCypherModelAdapterFunction({}),
  },
  defaultImplementation: 'boltCypher',
})

let configuredTraverser = Traverser.clientInterface({
  parameter: [
    {
      concreteBehaviorList: [contextInstance],
      implementationList: {
        default: {
          portNode: implementation.traversal.portNode, // Port
          traversalInterception: implementation.traversal.traversalInterception, // Stage
          aggregator: implementation.traversal.aggregator,
          processNode: implementation.traversal.processNode, // Process
        },
      },
      defaultImplementation: 'default',
    },
  ],
})

let configuredGraph = Graph.clientInterface({
  parameter: [
    {
      database: concreteDatabaseBehavior,
      configuredTraverser: configuredTraverser,
      concreteBehaviorList: [],
    },
  ],
})

const traversalConfigList = [
  {
    label: 'Reroute',
    entrypointNode: '968f644a-ac89-11e9-a2a3-2a2ae2dbcce4',
    createInstance: () => {
      let graph = new configuredGraph.clientInterface({})
      return { graph }
    },
    implementationKey: {},
  },
  {
    label: 'Configure',
    entrypointNode: '9160338f-6990-4957-9506-deebafdb6e29',
    createInstance: () => {
      let graph = new configuredGraph.clientInterface({})
      return { graph }
    },
    implementationKey: { processNode: 'returnDataItemKey' },
  },
  {
    label: 'Fork',
    entrypointNode: '5ab7f475-f5a1-4a23-bd9d-161e26e1aef6',
    createInstance: () => {
      let graph = new configuredGraph.clientInterface({})
      return { graph }
    },
    implementationKey: {},
  },
  {
    label: 'Execute',
    entrypointNode: '28a486af-1c27-4183-8953-c40742a68ab0',
    createInstance: () => {
      let contextInstance = new Context.clientInterface({
        data: {
          // modify context to include the filesystem stat information of the file to be referenced during the graph traversal.
          fileContext: {
            shellscript: path.join(__dirname, './asset/shellscript.sh'),
          },
          functionReferenceContext: {
            prefixWithWord: ({ node, graph }) => string => `prefix_${string}`,
            wrapWithTag: ({ node, graph }) => string => `<tag>${string}</tag>`,
          },
        },
      })
      let _configuredTraverser = configuredTraverser.clientInterface({ parameter: [{ concreteBehaviorList: [contextInstance] }] })
      let graph = new configuredGraph.clientInterface({ configuredTraverser: _configuredTraverser })
      return { graph }
    },
    implementationKey: {},
  },
  {
    label: 'Template',
    entrypointNode: '528ec4f4-824e-4952-b42f-a92ff70414f0',
    createInstance: () => {
      let contextInstance = new Context.clientInterface({
        data: {
          templateParameter: {},
          // modify context to include the filesystem stat information of the file to be referenced during the graph traversal.
          fileContext: {
            template: path.join(__dirname, './asset/template/template.html'),
            fileCss: path.join(__dirname, './asset/template/file.css'),
            fileText: path.join(__dirname, './asset/template/file.txt'),
            fileHtml: path.join(__dirname, './asset/template/file.html'),
          },
          functionReferenceContext: {
            wrapWithTag: ({ node, graph }) => string => {
              let tagName = node.properties.tagName || 'tag'
              return `<${tagName}>${string}</${tagName}>`
            },
          },
        },
      })
      let _configuredTraverser = configuredTraverser.clientInterface({ parameter: [{ concreteBehaviorList: [contextInstance] }] })
      let graph = new configuredGraph.clientInterface({ configuredTraverser: _configuredTraverser })
      return { graph }
    },
    implementationKey: {
      processNode: 'templateRenderingWithInseritonPosition',
      traversalInterception: 'traverseThenProcess',
      aggregator: 'AggregatorObjectOfArray',
    },
  },
  {
    label: 'MiddlewareLinear',
    entrypointNode: '80629744-a860-439e-8869-717989e72a6a',
    createInstance: () => {
      let middlewareExecutionOrder = []
      let contextInstance = new Context.clientInterface({
        data: {
          middlewareParameter: {},
          functionReferenceContext: {
            middleware1: traverser => async next => {
              middlewareExecutionOrder.push(`${traverser.node.properties.name} BEFORE`)
              await next()
              middlewareExecutionOrder.push(`${traverser.node.properties.name} AFTER`)
            },
            middleware2: traverser => async next => {
              middlewareExecutionOrder.push(`${traverser.node.properties.name} BEFORE`)
              await next()
              middlewareExecutionOrder.push(`${traverser.node.properties.name} AFTER`)
            },
            middleware3: traverser => async next => {
              middlewareExecutionOrder.push(`${traverser.node.properties.name} BEFORE`)
              await next()
              middlewareExecutionOrder.push(`${traverser.node.properties.name} AFTER`)
            },
          },
        },
      })
      let _configuredTraverser = configuredTraverser.clientInterface({ parameter: [{ concreteBehaviorList: [contextInstance] }] })
      let graph = new configuredGraph.clientInterface({ configuredTraverser: _configuredTraverser })
      return { graph, middlewareExecutionOrder }
    },
    implementationKey: {
      processNode: 'immediatelyExecuteMiddleware',
      traversalInterception: 'handleMiddlewareNextCall_linearGraph',
    },
  },
  {
    label: 'MiddlewareBranching',
    entrypointNode: 'c12af985-225e-4d3d-adea-36a813d22077',
    createInstance: () => {
      let middlewareExecutionOrder = []
      let contextInstance = new Context.clientInterface({
        data: {
          middlewareParameter: {},
          functionReferenceContext: {
            middleware1: traverser => async next => {
              middlewareExecutionOrder.push(`${traverser.node.properties.name} BEFORE`)
              await next()
              middlewareExecutionOrder.push(`${traverser.node.properties.name} AFTER`)
            },
            middleware2: traverser => async next => {
              middlewareExecutionOrder.push(`${traverser.node.properties.name} BEFORE`)
              await next()
              middlewareExecutionOrder.push(`${traverser.node.properties.name} AFTER`)
            },
            middleware3: traverser => async next => {
              middlewareExecutionOrder.push(`${traverser.node.properties.name} BEFORE`)
              await next()
              middlewareExecutionOrder.push(`${traverser.node.properties.name} AFTER`)
            },
            middleware4: traverser => async next => {
              middlewareExecutionOrder.push(`${traverser.node.properties.name} BEFORE`)
              await next()
              middlewareExecutionOrder.push(`${traverser.node.properties.name} AFTER`)
            },
            middleware5: traverser => async next => {
              middlewareExecutionOrder.push(`${traverser.node.properties.name} BEFORE`)
              await next()
              middlewareExecutionOrder.push(`${traverser.node.properties.name} AFTER`)
            },
            middleware6: traverser => async next => {
              middlewareExecutionOrder.push(`${traverser.node.properties.name} BEFORE`)
              await next()
              middlewareExecutionOrder.push(`${traverser.node.properties.name} AFTER`)
            },
            middleware7: traverser => async next => {
              middlewareExecutionOrder.push(`${traverser.node.properties.name} BEFORE`)
              await next()
              middlewareExecutionOrder.push(`${traverser.node.properties.name} AFTER`)
            },
            middleware8: traverser => async next => {
              middlewareExecutionOrder.push(`${traverser.node.properties.name} BEFORE`)
              await next()
              middlewareExecutionOrder.push(`${traverser.node.properties.name} AFTER`)
            },
          },
        },
      })
      let _configuredTraverser = configuredTraverser.clientInterface({ parameter: [{ concreteBehaviorList: [contextInstance] }] })
      let graph = new configuredGraph.clientInterface({ configuredTraverser: _configuredTraverser })
      return { graph, middlewareExecutionOrder }
    },
    implementationKey: {
      processNode: 'immediatelyExecuteMiddleware',
      traversalInterception: 'handleMiddlewareNextCall_branchedGraph',
    },
  },
]

suite('Graph traversal scenarios - basic features and core implementations of traversal', () => {
  suiteSetup(async () => {
    await clearGraphData()
    let graph = new configuredGraph.clientInterface({}) // instance creation for using prototype methods.
    await graph.load({ graphData })
  })

  suite('Reroute node with Extend, Insert, Reference edges:', () => {
    const fixture = ['referencedTarget-0', 'insert-before', 'dataItem-1', 'insert-after']
    const traversalConfig = traversalConfigList.find(item => item.label == 'Reroute')
    const { graph } = traversalConfig.createInstance()
    test('Should traverse graph successfully', async () => {
      let { result } = await graph.traverse({ nodeKey: traversalConfig.entrypointNode, implementationKey: traversalConfig.implementationKey })
      chaiAssertion.deepEqual(result, fixture)
    })
  })

  suite('Configure edge with Configuration node - evaluation & traversal implementations', () => {
    const fixture = ['include-0', 'include-1', 'include-2', 'include-3']
    const traversalConfig = traversalConfigList.find(item => item.label == 'Configure')
    const { graph } = traversalConfig.createInstance()
    test('Should traverse graph successfully', async () => {
      let { result } = await graph.traverse({ nodeKey: traversalConfig.entrypointNode, implementationKey: traversalConfig.implementationKey })
      chaiAssertion.deepEqual(result, fixture)
    })
  })

  suite('Fork edge & Port node - propgation implementations: parallel, chronological, etc.', () => {
    const fixture = ['dataItem-0', 'parallel-1', 'parallel-2', 'parallel-3', 'parallel-4', 'chronological-1', 'chronological-2', 'chronological-3', 'race-firstSetteled']
    const traversalConfig = traversalConfigList.find(item => item.label == 'Fork')
    const { graph } = traversalConfig.createInstance()
    test('Should traverse graph successfully ', async () => {
      let { result } = await graph.traverse({ nodeKey: traversalConfig.entrypointNode, implementationKey: traversalConfig.implementationKey })
      chaiAssertion.deepEqual(result, fixture)
    })
  })

  suite('Execute edge with Process node & reference context.', () => {
    suite('Execute function with a processes that doesnt return result + a process returning with further processing through pipe functions', () => {
      const fixture = ['<tag>prefix_dataItem</tag>']
      const traversalConfig = traversalConfigList.find(item => item.label == 'Execute')
      const { graph } = traversalConfig.createInstance()
      test('Should traverse graph successfully - during which a shell script executed', async () => {
        let { result } = await graph.traverse({ nodeKey: traversalConfig.entrypointNode, implementationKey: traversalConfig.implementationKey })
        chaiAssertion.deepEqual(result, fixture)
      })
    })
  })

  suite('Traversing graphs with different external implementations', () => {
    const fixture =
      {}
      |> (object => {
        filesystem.readdirSync(path.join(__dirname, 'fixture')).forEach(filename => {
          object[filename] = filesystem.readFileSync(path.join(__dirname, 'fixture', filename), { encoding: 'utf-8' })
        })
        return object
      })

    suite('Template implementation - Template graph rendering.', () => {
      // set underscore settings:
      const underscore = require('underscore')
      const underscoreTemplateInterpolationSetting = { evaluate: /\{\%(.+?)\%\}/g, interpolate: /\{\%=(.+?)\%\}/g, escape: /\{\%-(.+?)\%\}/g } // initial underscore template settings on first import gets applied on the rest.
      underscore.templateSettings = underscoreTemplateInterpolationSetting
      const traversalConfig = traversalConfigList.find(item => item.label == 'Template')
      const { graph } = traversalConfig.createInstance()
      test('Should traverse graph successfully and return a rendered template', async () => {
        let { result: renderedDocument } = await graph.traverse({ nodeKey: traversalConfig.entrypointNode, implementationKey: traversalConfig.implementationKey })
        // filesystem.writeFileSync(path.join(__dirname, 'fixture', 'renderedDocument'), renderedDocument)
        assert(renderedDocument === fixture.renderedDocument, `• Document must be rendered correctly.`)
      })
    })

    suite('Middleware implementation - execute middlewares in chain and execution (downstream & upstream)', () => {
      suite('Linear graph of middlewares', () => {
        const fixture = { middlewareExecutionOrder: ['middleware 1 BEFORE', 'middleware 2 BEFORE', 'middleware 3 BEFORE', 'middleware 3 AFTER', 'middleware 2 AFTER', 'middleware 1 AFTER'] }
        const traversalConfig = traversalConfigList.find(item => item.label == 'MiddlewareLinear')
        const { graph, middlewareExecutionOrder } = traversalConfig.createInstance()
        test('Should traverse graph successfully - during which middlewares are executed in chain with downstream and upstream execution.', async () => {
          let { result: middlewareArray } = await graph.traverse({ nodeKey: traversalConfig.entrypointNode, implementationKey: traversalConfig.implementationKey })
          chaiAssertion.deepEqual(middlewareExecutionOrder, fixture.middlewareExecutionOrder)
          assert(
            middlewareArray.every(item => typeof item == 'function'),
            `• Non function value in middleware result array.`,
          )
        })
      })
      suite('branching (neighbour children) graph of middlewares (non-linear chain structure)', () => {
        const fixture = {
          middlewareExecutionOrder: [
            'middleware 1 BEFORE',
            'middleware 2 BEFORE',
            'middleware 3 BEFORE',
            'middleware 4 BEFORE',
            'middleware 5 BEFORE',
            'middleware 6 BEFORE',
            'middleware 7 BEFORE',
            'middleware 8 BEFORE',
            'middleware 8 AFTER',
            'middleware 7 AFTER',
            'middleware 6 AFTER',
            'middleware 5 AFTER',
            'middleware 4 AFTER',
            'middleware 3 AFTER',
            'middleware 2 AFTER',
            'middleware 1 AFTER',
          ],
        }
        const traversalConfig = traversalConfigList.find(item => item.label == 'MiddlewareBranching')
        const { graph, middlewareExecutionOrder } = traversalConfig.createInstance()
        test('Should traverse graph successfully - during which middlewares are executed in chain with downstream and upstream execution.', async () => {
          let { result: middlewareArray } = await graph.traverse({ nodeKey: traversalConfig.entrypointNode, implementationKey: traversalConfig.implementationKey })
          let { statistics } = graph

          chaiAssertion.deepEqual(middlewareExecutionOrder, fixture.middlewareExecutionOrder)
          assert(
            middlewareArray.every(item => typeof item == 'function'),
            `• Non function value in middleware result array.`,
          )
        })
      })
    })

    // TODO:
    suite('Condition implementation - Value resolution with condition graph', () => {})
  })
})

// TODO: split performance and prevent other tests from interfering/affecting with the metrics results.
suite('Graph traversal performance measuring', () => {
  suiteSetup(async () => {
    await clearGraphData()
    let graph = new configuredGraph.clientInterface({}) // instance creation for using prototype methods.
    await graph.load({ graphData })
  })

  suite('Time it takes to run traversals', () => {
    // Activate the observer
    let performanceResult = {}
    const observer = new PerformanceObserver(list => {
      const entry = list.getEntries()[0]
      performanceResult[entry.name] = entry.duration
      console.log(`Traversal graph "${entry.name}'":   %s ms`, entry.duration)
    })
    observer.observe({ entryTypes: ['measure' /*all marks*/ || 'function' /**each mark*/], buffered: false }) //we want to react to full measurements and not individual marks

    test('Run traversals and measure performance', async () => {
      let graph = new configuredGraph.clientInterface({}) // instance creation for using prototype methods.

      for (let traversalConfig of traversalConfigList) {
        const label = traversalConfig.label
        performance.mark(label + '-init') //initial mark for the current label

        const { graph } = traversalConfig.createInstance()
        let { result } = await graph.traverse({ nodeKey: traversalConfig.entrypointNode, implementationKey: traversalConfig.implementationKey })

        performance.mark(label + '-end') //final mark for the same label
        performance.measure(label, label + '-init', label + '-end') //calculate the time difference between the start and end
      }

      // log performance metrics organized by package version number
      // filesystem.writeFileSync(path.join(__dirname, 'performanceMetrics', `v${ownConfig.getPackageJson.version}.json`), performanceResult |> JSON.stringify)
    })
  })
})
