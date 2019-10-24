import EventEmitter from 'events'
import assert from 'assert'
import { proxifyMethodDecorator } from '../../utility/proxifyMethodDecorator.js'
import { mergeDefaultParameter } from '../../utility/mergeDefaultParameter.js'
import { removeUndefinedFromObject } from '../../utility/removeUndefinedFromObject.js'
import { Context } from '../Context.class.js'
import { GraphTraversal } from '../GraphTraversal.class.js'
import { nodeLabel, connectionType, connectionProperty, traversalOption, evaluationOption } from '../../graphModel/graphSchemeReference.js'
import { extractConfigProperty } from '../../../utility/extractPropertyFromObject.js'

// Each exported property ends up as the prototype property of the class.
export * from './method/evaluatePosition.js'
export * from './method/traverseNode.js'
export * from './method/handlePropagation.js'
export * from './method/processData.js'
export * from './method/recursiveIteration.js'
export * as databaseWrapper from '../../graphModel/concreteDatabaseWrapper.js'

// load graph into memory
export async function load({ graphData, graphInstance = this } = {}) {
  // load json graph data.
  assert(graphData.node && graphData.edge, `• Graph data object must contain node & edge arrays.`)
  return await graphInstance.database.loadGraphData({ nodeEntryData: graphData.node, connectionEntryData: graphData.edge })
}

export async function print({ graphInstance = this } = {}) {
  console.log(`______ Graph elements: ____________________`)
  let count = await graphInstance.count()
  let allNode = await graphInstance.database.getAllNode()
  let allEdge = await graphInstance.database.getAllEdge()
  console.log(`#Vertex = ${count.node}`)
  for (let node of allNode) {
    console.log(node.identity)
  }
  console.log(`\n#Edge = ${count.connection}`)
  for (let edge of allEdge) {
    console.log(`${edge.start} --> ${edge.end}`)
  }
  console.log(`___________________________________________`)
}

export async function count({ graphInstance = this } = {}) {
  // count number of cached elements
  return {
    node: await graphInstance.database.countNode(),
    connection: await graphInstance.database.countEdge(),
  }
}

/** Graph traversal - Controls the traversing the nodes in the graph. Which includes processing of data items and aggregation of results.
 * Dynamic implementation - not restricted to specific initialization algorithm, rather choosen from setting of each node in the traversed graph.
 */
// Note: wrapping in object allows the usage of decorators
export const { TraversalConfig, Evaluator, traverse, traverseStage, traverseSubgraphTemplate } = {
  /** 
 * TODO:  REFACTOR adding Traversal description class - ability to pick a defined set of implementation keys to be used to gether - e.g. implementation type: Condition, Middleware, Template, Schema, Shellscript.
  - https://neo4j.com/docs/java-reference/3.5/javadocs/org/neo4j/graphdb/traversal/TraversalConfig.html
  - Implement 'depthAffected' for the affected depth of the configure connections on a stage and its child nodes.
  */
  // Handles parameter hierarchy handling:
  TraversalConfig: class TraversalConfig {
    traversalImplementationHierarchy = {}
    evaluationHierarchy = {} // evaluation object that contains configuration relating to traverser action on the current position
    evaluation
    implementation

    constructor({ traversalImplementationHierarchy, evaluationHierarchy }) {
      this.traversalImplementationHierarchy = traversalImplementationHierarchy
      this.evaluationHierarchy = evaluationHierarchy
    }

    setEvaluationHierarchy(parameterType, evaluation) {
      if (!this.evaluationHierarchy[parameterType]) this.evaluationHierarchy[parameterType] = {}
      Object.assign(this.evaluationHierarchy[parameterType], evaluation)
    }

    setImplementationHierarchy(parameterType, implementationKey) {
      if (!this.traversalImplementationHierarchy[parameterType]) this.traversalImplementationHierarchy[parameterType] = {}
      Object.assign(this.traversalImplementationHierarchy[parameterType], implementationKey)
    }

    calculateConfig({ graphInstance }) {
      return {
        evaluation: this.calculateEvaluationHierarchy(),
        implementation: this.getAllImplementation({ graphInstance }),
      }
    }

    getAllImplementation({ graphInstance }) {
      let implementationKey = this.getTraversalImplementationKey()
      let implementation = {
        processData: graphInstance.traversal.processData[implementationKey.processData],
        handlePropagation: graphInstance.traversal.handlePropagation[implementationKey.handlePropagation],
        traverseNode: graphInstance.traversal.traverseNode[implementationKey.traverseNode],
        traversalInterception: graphInstance.traversal.traversalInterception[implementationKey.traversalInterception],
        aggregator: graphInstance.traversal.aggregator[implementationKey.aggregator],
      }
      assert(
        Object.entries(implementation).every(([key, value]) => Boolean(value)),
        '• All `implementation` concerete functions must be registered, the implementationKey provided doesn`t match any of the registered implementaions.',
      )
      return implementation
    }

    getImplementationCallback({ key, graphInstance }) {
      let getTraversalImplementationKey = this.getTraversalImplementationKey
      return ({ nodeImplementationKey }) => {
        let implementationKey = this.getTraversalImplementationKey({ key: key, nodeImplementationKey })
        let implementation = graphInstance.traversal[key][implementationKey]
        assert(implementation, '• `implementation` concerete function must be registered, the implementationKey provided doesn`t match any of the registered implementaions.')
        return implementation
      }
    }
    // get implementation functions
    getTraversalImplementationKey({ key, nodeImplementationKey } = {}) {
      let implementationKey = this.calculateImplementationHierarchy({ nodeImplementationKey })
      if (key) return implementationKey[key]
      else return implementationKey
    }

    calculateImplementationHierarchy({ nodeImplementationKey = {} } = {}) {
      // overwrite (for all subtraversals) implementation through directly passed parameters - overwritable traversal implementation ignoring each nodes configuration, i.e. overwritable over nodeInstance own property implementation keys
      /** Pick implementation function from implemntation keys
       * Parameter hirerchy for graph traversal implementations: (1 as first priority)
       * 1. shared context configurations - that could be used as overwriting values. e.g. nodeInstance[Context.getSharedContext].concereteImplementationKeys
       * 2. call parameters that are passed directly
       * 3. node instance and edge properties
       * 4. node configurations
       * 5. default values specified in the function scope.
       * 6. parent parameters
       */
      let implementationKey = Object.assign(
        {},
        this.traversalImplementationHierarchy.parent,
        this.traversalImplementationHierarchy.default,
        this.traversalImplementationHierarchy.configuration,
        nodeImplementationKey,
        this.traversalImplementationHierarchy.parameter,
        this.traversalImplementationHierarchy.context,
      )
      return implementationKey
    }

    calculateEvaluationHierarchy() {
      this.evaluation = Object.assign({}, this.evaluationHierarchy.default, this.evaluationHierarchy.configuration, this.evaluationHierarchy.parameter)
      return this.evaluation
    }

    /**
     * Responsible for creating evaluator configuration for each traverser and deciding whether traversal and actions should be performed on each position accordingly.
     */
    shouldContinue() {
      switch (this.evaluation.propagation) {
        case evaluationOption.propagation.continue:
          return true
          break
        case evaluationOption.propagation.break:
        case evaluationOption.propagation.hult:
          return false
          break
        default:
          throw new Error(`• Unknown option for 'evaluator.propagation' = ${this.evaluation.propagation}.`)
          break
      }
    }
    shouldIncludeResult() {
      switch (this.evaluation.aggregation) {
        case evaluationOption.aggregation.include:
          return true
          break
        case evaluationOption.aggregation.exclude:
        case evaluationOption.aggregation.skip:
          return false
          break
        default:
          throw new Error(`• Unknown option for 'evaluator.aggregation' = ${this.evaluation.aggregation}.`)
          break
      }
    }
    shouldExecuteProcess() {
      switch (this.evaluation.aggregation) {
        case evaluationOption.aggregation.include:
        case evaluationOption.aggregation.exclude:
          return true
          break
        case evaluationOption.aggregation.skip:
          return false
          break
        default:
          throw new Error(`• Unknown option for 'evaluator.aggregation' = ${this.evaluation.aggregation}.`)
          break
      }
    }
  },

  @proxifyMethodDecorator(async (target, thisArg, argumentsList, targetClass, methodName) => {
    // create node instance, in case string key is passed as parameter.
    let { nodeInstance /* type Node */, nodeKey, nodeID, graphInstance = thisArg } = argumentsList[0]

    if (!nodeInstance) {
      if (nodeKey) nodeInstance = await graphInstance.database.getNodeByKey({ key: nodeKey })
      // retrieve node data on-demand
      else if (nodeID) nodeInstance = await graphInstance.database.getNodeByID({ id: nodeID })
      // retrieve node data on-demand
      else throw new Error('• node identifier or object must be passed in.')
      ;['nodeKey', 'nodeID'].forEach(property => delete argumentsList[0][property]) // remove node related identifiers.
      argumentsList[0].nodeInstance = nodeInstance // set node data
    }
    return Reflect.apply(target, thisArg, argumentsList)
  })
  async traverse(
    {
      graphInstance = this,
      nodeInstance,
      traversalConfig,
      implementationKey,
      evaluation,
      traversalDepth,
      path,
      additionalChildNode,
      eventEmitter,
      aggregator,
      nodeType = 'Stage', // Traversal step or stage - defines when and how to run processes.-  the type of node to traverse
    },
    { parentTraversalArg } = {},
  ) {
    traversalConfig ||= new graphInstance.TraversalConfig({
      traversalImplementationHierarchy: {
        // Context instance parameter
        context: (graphInstance[Context.reference.key.getter] ? graphInstance[Context.reference.key.getter]()?.implementationKey : {}) || {} |> removeUndefinedFromObject,
        // implementation keys of node instance own config parameters and of default values set in function scope
        default: {
          processData: 'returnDataItemKey',
          handlePropagation: 'chronological',
          traverseNode: 'iterateFork',
          aggregator: 'AggregatorArray',
          traversalInterception: 'processThenTraverse',
        },
        // parent arguments
        parent: parentTraversalArg ? parentTraversalArg[0].implementationKey || {} : {},
      },
      evaluationHierarchy: {
        default: { propagation: evaluationOption.propagation.continue, aggregation: evaluationOption.aggregation.include },
      },
    })

    // parameter arguments
    if (implementationKey) traversalConfig.setImplementationHierarchy('parameter', implementationKey |> removeUndefinedFromObject) && delete arguments[0].implementationKey
    // remove undefined values because native Object.assign doesn't override keys with `undefined` values
    if (evaluation) traversalConfig.setEvaluationHierarchy('parameter', evaluation) && delete arguments[0].evaluation

    // get configuration of type 'evaluation' & 'implementation'
    let { implementationConfiguration, evaluationConfiguration } = await graphInstance.evaluatePosition({ node: nodeInstance })
    traversalConfig.setImplementationHierarchy('configuration', implementationConfiguration)
    traversalConfig.setEvaluationHierarchy('configuration', evaluationConfiguration)

    if (nodeInstance.labels.includes(nodeLabel.subgraphTemplate)) {
      let subgraphTemplateResult = await graphInstance.traverseSubgraphTemplate({ nodeInstance, graphInstance })
      if (!subgraphTemplateResult) return // in case no root node was configured in the subgraph template node.
      let { rootNode, additionalChildNode } = subgraphTemplateResult
      // set additional parameters
      arguments[0].traversalConfig = traversalConfig
      arguments[0].nodeInstance = rootNode
      arguments[0].additionalChildNode = [...(arguments[0].additionalChildNode || []), ...additionalChildNode]
      return await graphInstance.traverse(...arguments)
    } else if (nodeInstance.labels.includes(nodeLabel.stage))
      return await graphInstance.traverseStage({ graphInstance, nodeInstance, traversalConfig, traversalDepth, path, additionalChildNode, eventEmitter, aggregator }, { parentTraversalArg })
    else throw new Error(`• Unsupported node type for traversal function - ${nodeInstance.labels}`)
  },

  // load `subgraph template` node parameters for traversal call usage.
  async traverseSubgraphTemplate({ nodeInstance, graphInstance = this }) {
    const { root, extend, insertArray } = await graphInstance.databaseWrapper.getSubgraphTemplateElement({ concreteDatabase: graphInstance.database, nodeID: nodeInstance.identity })
    if (!root && !extend) return false // in case no `ROOT` relation or `EXTEND` are present

    // get additional nodes
    let additionalChildNode = insertArray
      .sort((former, latter) => former.connection.properties.order - latter.connection.properties.order) // using `order` property // Bulk actions on forks - sort forks
      .map(insert => ({
        node: insert.destination,
        placement: {
          // convention for data structure of placement array - 0: 'before' | 'after', 1: connectionKey
          position: insert.connection.properties?.placement[0],
          connectionKey: insert.connection.properties?.placement[1],
        },
      }))

    // get rootNode and handle extended node. rootNode will be used as entrypoint to traversal call
    let rootNode
    if (root) rootNode = root.destination
    else if (extend) rootNode = extend.destination

    return { rootNode, additionalChildNode }
  },

  /** An approach to set default parameters for the function.
   * @proxifyMethodDecorator((target, thisArg, argumentsList, targetClass, methodName) => {
    // set default parameters and expose them to subsequent method decorators. - deep merge of nested parameter
    argumentsList = mergeDefaultParameter({
      passedArg: argumentsList,
      defaultArg: [
        {
          graphInstance: thisArg,
          traversalDepth: 0,
          path: null,
          additionalChildNode: [],
        },
        { parentTraversalArg: null },
      ],
    })
    return Reflect.apply(target, thisArg, argumentsList)
  }) */
  async traverseStage(
    {
      graphInstance = this, // <type Graph>
      nodeInstance,
      traversalConfig,
      traversalDepth = 0, // <type Number> level of recursion - allows to identify entrypoint level (toplevel) that needs to return the value of aggregator.
      path = null, // path to the current traversal.  // TODO: implement path sequence preservation. allow for the node traverse function to rely on the current path data.
      additionalChildNode = [], // child nodes to add to the current node's children. These are added indirectly to a node without changing the node's children itself, as a way to extend current nodes.
      // supported events: 'nodeTraversalCompleted'
      eventEmitter = new EventEmitter(), // create an event emitter to catch events from nested nodes of this node during their traversals.
      aggregator, // used to aggregate results of nested nodes.
    } = {},
    { parentTraversalArg = null } = {},
  ) {
    let { implementation } = traversalConfig.calculateConfig({ graphInstance })

    aggregator ||= new (nodeInstance::implementation.aggregator)()

    // Core functionality required is to traverse nodes, any additional is added through intercepting the traversal.
    // iterator providing node parameters for recursive traversal calls.
    let traversalIteratorFeed = graphInstance::graphInstance.traverseNode({
      node: nodeInstance,
      implementation: implementation.traverseNode,
      handlePropagationImplementation: implementation.handlePropagation,
      additionalChildNode,
    })

    let dataProcessCallback = ({ nextProcessData, additionalParameter }) =>
      graphInstance::graphInstance.processData(
        { node: nodeInstance, nextProcessData, traversalConfig, aggregator, getImplementation: traversalConfig.getImplementationCallback({ key: 'processData', graphInstance }), graphInstance },
        additionalParameter,
      )

    let traversalInterceptionImplementation = implementation.traversalInterception || (({ targetFunction }) => new Proxy(targetFunction, {})) // in case no implementation exists for intercepting traversal, use an empty proxy.
    let proxyify = target => graphInstance::traversalInterceptionImplementation({ targetFunction: target, aggregator, dataProcessCallback })
    let result = await (graphInstance::graphInstance.recursiveIteration |> proxyify)({
      traversalIteratorFeed,
      nodeInstance,
      traversalDepth,
      eventEmitter,
      traversalConfig,
      additionalChildNode,
      parentTraversalArg: arguments,
    })

    return result
  },
}
