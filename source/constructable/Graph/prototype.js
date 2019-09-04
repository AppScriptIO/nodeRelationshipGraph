import EventEmitter from 'events'
import assert from 'assert'
import { proxifyMethodDecorator } from '../../utility/proxifyMethodDecorator.js'
import { mergeDefaultParameter } from '../../utility/mergeDefaultParameter.js'
import { removeUndefinedFromObject } from '../../utility/removeUndefinedFromObject.js'
import { Context } from '../Context.class.js'
import { GraphTraversal } from '../GraphTraversal.class.js'
import { nodeLabel, connectionType, connectionProperty } from '../../graphModel/graphSchemeReference.js'
import { EvaluatorFunction } from '../../Evaluator.class.js'
const Evaluator = EvaluatorFunction()

// Each exported property ends up as the prototype property of the class.
export * from './method/evaluatePosition.js'
export * from './method/traverseNode.js'
export * from './method/handlePropagation.js'
export * from './method/laodSubgraphTemplateParameter.js'
export * from './method/dataProcess.js'
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

/** 
 * TODO:  REFACTOR adding Traversal description class - ability to pick a defined set of implementation keys to be used to gether - e.g. implementation type: Condition, Middleware, Template, Schema, Shellscript.
  - https://neo4j.com/docs/java-reference/3.5/javadocs/org/neo4j/graphdb/traversal/TraversalConfig.html
  - Implement 'depthAffected' for the affected depth of the configure connections on a stage and its child nodes.
  */
// Handles parameter hierarchy handling:
class TraversalConfig {
  traversalImplementationHierarchy = {}
  evaluation // evaluation object that contains configuration relating to traverser action on the current position

  constructor({ traversalImplementationHierarchy, evaluationHierarchy }) {
    this.traversalImplementationHierarchy = traversalImplementationHierarchy
    this.evaluationHierarchy = this.evaluationHierarchy
  }

  getAllImplementation({ graphInstance }) {
    let implementationKey = this.getTraversalImplementationKey()
    let implementation = {
      dataProcess: graphInstance.traversal.processData[implementationKey.processData],
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
      let implementationKey = getTraversalImplementationKey({ key: key, nodeImplementationKey })
      let implementation = graphInstance.traversal[key][implementationKey]
      assert(implementation, '• `implementation` concerete function must be registered, the implementationKey provided doesn`t match any of the registered implementaions.')
      return implementation
    }
  }
  // get implementation functions
  getTraversalImplementationKey({ key } = {}) {
    let implementationKey = this.calculateImplementationHierarchy()
    if (key) return implementationKey[key]
    else return implementationKey
  }

  calculateImplementationHierarchy({ nodeImplementationKey = {} }) {
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
    let evaluation = Object.assign({}, this.evaluationHierarchy.default, this.evaluationHierarchy.configuration, this.evaluationHierarchy.parameter)
    return evaluation
  }
}

/** Graph traversal - Controls the traversing the nodes in the graph. Which includes processing of data items and aggregation of results.
 * Dynamic implementation - not restricted to specific initialization algorithm, rather choosen from setting of each node in the traversed graph.
 */
// Note: wrapping in object allows the usage of decorators
export const { traverse } = {
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
          nodeType: 'Stage',
        },
        { parentTraversalArg: null },
      ],
    })
    return Reflect.apply(target, thisArg, argumentsList)
  }) */
  @proxifyMethodDecorator(async (target, thisArg, argumentsList, targetClass, methodName) => {
    // create node instance, in case string key is passed as parameter.
    let { nodeInstance /* type Node */, nodeKey, nodeID, graphInstance = thisArg } = argumentsList[0]

    let nodeData
    if (nodeInstance) nodeData = nodeInstance
    else if (nodeKey) nodeData = await graphInstance.database.getNodeByKey({ key: nodeKey })
    // retrieve node data on-demand
    else if (nodeID) nodeData = await graphInstance.database.getNodeByID({ id: nodeID })
    // retrieve node data on-demand
    else throw new Error('• node identifier or object must be passed in.')

    argumentsList[0].nodeInstance = nodeData // set node data
    return Reflect.apply(target, thisArg, argumentsList)
  })
  @proxifyMethodDecorator(async (target, thisArg, argumentsList, targetClass, methodName) => {
    // handle nodes with different labels
    let { nodeInstance } = argumentsList[0]
    // deal with SubgraphTemplate
    if (nodeInstance.labels.includes(nodeLabel.subgraphTemplate)) {
      let parameter = await graphInstance.laodSubgraphTemplateParameter({ node: nodeInstance })
      // in case no destination node (ROOT/Extend) are present
      if (!parameter) return
      ;['nodeInstance', 'nodeKey', 'nodeID'].forEach(property => delete argumentsList[0][property]) // remove subgraph template node related identifiers.
      // set additional parameters
      argumentsList[0].implementationKey = argumentsList[0].implementationKey ? Object.assign(parameter.traversalConfiguration, argumentsList[0].implementationKey) : parameter.traversalConfiguration
      argumentsList[0].additionalChildNode = argumentsList[0].additionalChildNode ? [...argumentsList[0].additionalChildNode, ...parameter.additionalChildNode] : parameter.additionalChildNode
      Object.assign(argumentsList[0], { nodeInstance: parameter.rootNode })
    }

    return Reflect.apply(target, thisArg, argumentsList)
  })
  async traverse(
    {
      graphInstance = this, // <type Graph>
      nodeInstance,
      implementationKey: parameterImplementationKey = {},
      evaluation: parameterEvaluation = {},
      traversalDepth = 0, // <type Number> level of recursion - allows to identify entrypoint level (toplevel) that needs to return the value of aggregator.
      path = null, // path to the current traversal.  // TODO: implement path sequence preservation. allow for the node traverse function to rely on the current path data.
      additionalChildNode = [], // child nodes to add to the current node's children. These are added indirectly to a node without changing the node's children itself, as a way to extend current nodes.
      eventEmitter = new EventEmitter(), // create an event emitter to catch events from nested nodes of this node during their traversals.
      aggregator, // used to aggregate results of nested nodes.
      nodeType = 'Stage', // Traversal step or stage - defines when and how to run processes.-  the type of node to traverse
    } = {},
    { parentTraversalArg = null } = {},
  ) {
    // get configuration of type 'evaluation' & 'implementation'
    let { implementationConfiguration, evaluationConfiguration } = await graphInstance.evaluatePosition({ node: nodeInstance })

    let traversalConfig = new TraversalConfig({
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
        configuration: implementationConfiguration,
        // parameter arguments
        parameter: parameterImplementationKey |> removeUndefinedFromObject, // remove undefined values because native Object.assign doesn't override keys with `undefined` values
        // parent arguments
        parent: parentTraversalArg ? parentTraversalArg[0].implementationKey || {} : {},
      },
      evaluationHierarchy: {
        default: new Evaluator({ propagation: evaluationOption.propagation.continue, aggregation: evaluationOption.aggregation.include }),
        configuration: evaluationConfiguration,
        parameter: parameterEvaluation,
      },
    })

    let implementation = traversalConfig.getAllImplementation({ graphInstance })
    let evaluation = traversalConfig.calculateEvaluationHierarchy()

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
      graphInstance::graphInstance.dataProcess(
        { node: nodeInstance, nextProcessData, evaluation, aggregator, getImplementation: traversalConfig.getImplementationCallback({ key: 'dataProcess', graphInstance }), graphInstance },
        additionalParameter,
      )

    let traversalInterceptionImplementation = implementation.traversalInterception || (({ targetFunction }) => new Proxy(targetFunction, {})) // in case no implementation exists for intercepting traversal, use an empty proxy.
    let proxyify = target => graphInstance::traversalInterceptionImplementation({ targetFunction: target, aggregator, dataProcessCallback })
    let result = await (graphInstance::graphInstance.recursiveIteration |> proxyify)({
      traversalIteratorFeed,
      nodeInstance,
      traversalDepth,
      eventEmitter,
      evaluation,
      additionalChildNode,
      parentTraversalArg: arguments,
    })

    return result
  },
}
