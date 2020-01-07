process.env['SZN_DEBUG'] = true
import assert from 'assert'
import { assert as chaiAssertion } from 'chai'
import util from 'util'
import path from 'path'
import filesystem from 'fs'
const boltProtocolDriver = require('neo4j-driver').v1

import { Entity } from '@dependency/entity'
import * as Graph from '../source/constructable/Graph'
import * as Traversal from '../source/constructable/Traversal.class.js'
import * as Database from '../source/constructable/Database.class.js'
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

let concreteDatabaseBehavior = new Database.clientInterface({
  implementationList: {
    redisModelAdapterFunction: implementation.database.redisModelAdapterFunction(),
    simpleMemoryModelAdapter: implementation.database.simpleMemoryModelAdapterFunction(),
    boltCypher: implementation.database.boltCypherModelAdapterFunction({ schemeReference }),
  },
  defaultImplementation: 'boltCypher',
})

let concreteGraphTraversalBehavior = new Traversal.clientInterface({
  implementationList: {
    default: {
      portNode: implementation.traversal.portNode, // Port
      traversalInterception: implementation.traversal.traversalInterception, // Stage
      aggregator: implementation.traversal.aggregator,
      processNode: implementation.traversal.processNode, // Process
    },
  },
  defaultImplementation: 'default',
})

let contextInstance = new Context.clientInterface({
  implementationKey: {
    processNode: 'returnDataItemKey',
    portNode: 'propagationControl',
    aggregator: 'AggregatorArray',
    traversalInterception: 'processThenTraverse',
  },
})

let configuredGraph = Graph.clientInterface({
  parameter: [
    {
      database: concreteDatabaseBehavior,
      traversal: concreteGraphTraversalBehavior,
      concreteBehaviorList: [contextInstance],
      data: {},
    },
  ],
})

suite('Graph traversal scenarios - basic features and core implementations of traversal', () => {
  suiteSetup(async () => {
    await clearGraphData()
    let graph = new configuredGraph.clientInterface({}) // instance creation for using prototype methods.
    await graph.load({ graphData })
  })

  suite('Reroute node with Extend, Insert, Reference edges:', () => {
    const fixture = ['referencedTarget-0', 'insert-before', 'dataItem-1', 'insert-after']
    let graph = new configuredGraph.clientInterface({})
    test('Should traverse graph successfully', async () => {
      let result = await graph.traverse({ nodeKey: '968f644a-ac89-11e9-a2a3-2a2ae2dbcce4', implementationKey: {} })
      chaiAssertion.deepEqual(result, fixture)
    })
  })

  suite('Configure edge with Configuration node - evaluation & traversal implementations', () => {
    const fixture = ['include-0', 'include-1', 'include-2', 'include-3']
    let graph = new configuredGraph.clientInterface({})
    test('Should traverse graph successfully', async () => {
      let result = await graph.traverse({ nodeKey: '9160338f-6990-4957-9506-deebafdb6e29', implementationKey: { processNode: 'returnDataItemKey' } })
      chaiAssertion.deepEqual(result, fixture)
    })
  })

  suite('Fork edge & Port node - propgation implementations: parallel, chronological, etc.', () => {
    //
    const fixture = ['dataItem-0', 'parallel-1', 'parallel-2', 'parallel-3', 'parallel-4', 'chronological-1', 'chronological-2', 'chronological-3', 'race-firstSetteled']
    let graph = new configuredGraph.clientInterface({})
    test('Should traverse graph successfully ', async () => {
      let result = await graph.traverse({ nodeKey: '5ab7f475-f5a1-4a23-bd9d-161e26e1aef6', implementationKey: {} })
      chaiAssertion.deepEqual(result, fixture)
    })
  })

  suite('Execute edge with Process node & reference context.', () => {
    suite('Execute function with a processes that doesnt return result + a process returning with further processing through pipe functions', () => {
      const fixture = ['<tag>prefix_dataItem</tag>']

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

      let graph = new configuredGraph.clientInterface({ concreteBehaviorList: [contextInstance] })

      test('Should traverse graph successfully - during which a shell script executed', async () => {
        let result = await graph.traverse({ nodeKey: '28a486af-1c27-4183-8953-c40742a68ab0', implementationKey: {} })
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

      let graph = new configuredGraph.clientInterface({ concreteBehaviorList: [contextInstance] })

      test('Should traverse graph successfully and return a rendered template', async () => {
        let renderedDocument = await graph.traverse({
          nodeKey: '528ec4f4-824e-4952-b42f-a92ff70414f0',
          implementationKey: {
            processNode: 'templateRenderingWithInseritonPosition',
            traversalInterception: 'traverseThenProcess',
            aggregator: 'AggregatorObjectOfArray',
          },
        })
        // filesystem.writeFileSync(path.join(__dirname, 'fixture', 'renderedDocument'), renderedDocument)
        assert(renderedDocument === fixture.renderedDocument, `• Document must be rendered correctly.`)
      })
    })

    suite('Middleware implementation - execute middlewares in chain and execution (downstream & upstream)', () => {
      suite('Linear graph of middlewares', () => {
        const fixture = { middlewareExecutionOrder: ['ce BEFORE', 'a4 BEFORE', 'aa BEFORE', 'aa AFTER', 'a4 AFTER', 'ce AFTER'] }

        let middlewareExecutionOrder = []
        let contextInstance = new Context.clientInterface({
          data: {
            middlewareParameter: {},
            functionReferenceContext: {
              middleware1: traverser => async next => {
                middlewareExecutionOrder.push(`${traverser.node.properties.key.substring(0, 2)} BEFORE`)
                await next()
                middlewareExecutionOrder.push(`${traverser.node.properties.key.substring(0, 2)} AFTER`)
              },
              middleware2: traverser => async next => {
                middlewareExecutionOrder.push(`${traverser.node.properties.key.substring(0, 2)} BEFORE`)
                await next()
                middlewareExecutionOrder.push(`${traverser.node.properties.key.substring(0, 2)} AFTER`)
              },
              middleware3: traverser => async next => {
                middlewareExecutionOrder.push(`${traverser.node.properties.key.substring(0, 2)} BEFORE`)
                await next()
                middlewareExecutionOrder.push(`${traverser.node.properties.key.substring(0, 2)} AFTER`)
              },
            },
          },
        })

        let graph = new configuredGraph.clientInterface({ concreteBehaviorList: [contextInstance] })

        test('Should traverse graph successfully - during which middlewares are executed in chain with downstream and upstream execution.', async () => {
          let middlewareArray = await graph.traverse({
            nodeKey: '80629744-a860-439e-8869-717989e72a6a',
            implementationKey: {
              processNode: 'immediatelyExecuteMiddleware',
              traversalInterception: 'handleMiddlewareNextCall',
            },
          })

          chaiAssertion.deepEqual(middlewareExecutionOrder, fixture.middlewareExecutionOrder)
          assert(
            middlewareArray.every(item => typeof item == 'function'),
            `• Non function value in middleware result array.`,
          )
        })
      })
      suite('neighbour children graph of middlewares (non-linear chain structure)', () => {
        // const fixture = { middlewareExecutionOrder: ['ce BEFORE', 'a4 BEFORE', 'aa BEFORE', 'aa AFTER', 'a4 AFTER', 'ce AFTER'] }
        // let middlewareExecutionOrder = []
        // let contextInstance = new Context.clientInterface({
        //   data: {
        //     middlewareParameter: {},
        //     functionReferenceContext: {
        //       middleware1: traverser => async next => {
        //         middlewareExecutionOrder.push(`${traverser.node.properties.key.substring(0, 2)} BEFORE`)
        //         await next()
        //         middlewareExecutionOrder.push(`${traverser.node.properties.key.substring(0, 2)} AFTER`)
        //       },
        //       middleware2: traverser => async next => {
        //         middlewareExecutionOrder.push(`${traverser.node.properties.key.substring(0, 2)} BEFORE`)
        //         await next()
        //         middlewareExecutionOrder.push(`${traverser.node.properties.key.substring(0, 2)} AFTER`)
        //       },
        //       middleware3: traverser => async next => {
        //         middlewareExecutionOrder.push(`${traverser.node.properties.key.substring(0, 2)} BEFORE`)
        //         await next()
        //         middlewareExecutionOrder.push(`${traverser.node.properties.key.substring(0, 2)} AFTER`)
        //       },
        //     },
        //   },
        // })
        // let graph = new configuredGraph.clientInterface({ concreteBehaviorList: [contextInstance] })
        // test('Should traverse graph successfully - during which middlewares are executed in chain with downstream and upstream execution.', async () => {
        //   let middlewareArray = await graph.traverse({
        //     nodeKey: '80629744-a860-439e-8869-717989e72a6a',
        //     implementationKey: {
        //       processNode: 'immediatelyExecuteMiddleware',
        //       traversalInterception: 'handleMiddlewareNextCall',
        //     },
        //   })
        //   chaiAssertion.deepEqual(middlewareExecutionOrder, fixture.middlewareExecutionOrder)
        //   assert(
        //     middlewareArray.every(item => typeof item == 'function'),
        //     `• Non function value in middleware result array.`,
        //   )
        // })
      })
    })

    // TODO:
    suite('Condition implementation - Value resolution with condition graph', () => {})
  })
})
