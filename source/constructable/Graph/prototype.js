import assert from 'assert'
import { proxifyMethodDecorator } from '../../utility/proxifyMethodDecorator.js'
import { mergeDefaultParameter } from '../../utility/mergeDefaultParameter.js'
import { removeUndefinedFromObject } from '../../utility/removeUndefinedFromObject.js'
import { Context } from '../Context.class.js'
import { Traversal } from '../Traversal.class.js'
import * as schemeReference from '../../dataModel/graphSchemeReference.js'
import { extractConfigProperty } from '../../../utility/extractPropertyFromObject.js'

// Each exported property ends up as the prototype property of the class.
export * from './method/evaluatePosition.js'
export * from './method/stageNode.js'
export * from './method/subgraphTemplateNode.js'
export * from './method/forkEdge.js'
export * from './method/executeEdge.js'
export * as databaseWrapper from '../../dataModel/concreteDatabaseWrapper.js'
export * as schemeReference from '../../dataModel/graphSchemeReference.js'

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
export class TraversalConfig {
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
      processNode: graphInstance.traversal.processNode[implementationKey.processNode],
      portNode: graphInstance.traversal.portNode[implementationKey.portNode],
      traversalInterception: graphInstance.traversal.traversalInterception[implementationKey.traversalInterception],
      aggregator: graphInstance.traversal.aggregator[implementationKey.aggregator],
    }
    Object.entries(implementation).forEach(([key, value]) => {
      assert(
        Boolean(value),
        `• All traversal implementation concerete functions must be registered, the implementationKey "${key}" provided doesn't match any of the registered implementaions - ${implementation[key]}`,
      )
    })
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
      this.traversalImplementationHierarchy.default,
      this.traversalImplementationHierarchy.parent,
      this.traversalImplementationHierarchy.configuration,
      nodeImplementationKey,
      this.traversalImplementationHierarchy.context,
      this.traversalImplementationHierarchy.parameter,
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
      case schemeReference.evaluationOption.propagation.continue:
        return true
        break
      case schemeReference.evaluationOption.propagation.break:
      case schemeReference.evaluationOption.propagation.hult:
        return false
        break
      default:
        throw new Error(`• Unknown option for 'evaluator.propagation' = ${this.evaluation.propagation}.`)
        break
    }
  }
  shouldIncludeResult() {
    switch (this.evaluation.aggregation) {
      case schemeReference.evaluationOption.aggregation.include:
        return true
        break
      case schemeReference.evaluationOption.aggregation.exclude:
      case schemeReference.evaluationOption.aggregation.skip:
        return false
        break
      default:
        throw new Error(`• Unknown option for 'evaluator.aggregation' = ${this.evaluation.aggregation}.`)
        break
    }
  }
  shouldExecuteProcess() {
    switch (this.evaluation.aggregation) {
      case schemeReference.evaluationOption.aggregation.include:
      case schemeReference.evaluationOption.aggregation.exclude:
        return true
        break
      case schemeReference.evaluationOption.aggregation.skip:
        return false
        break
      default:
        throw new Error(`• Unknown option for 'evaluator.aggregation' = ${this.evaluation.aggregation}.`)
        break
    }
  }
}

/** Graph traversal integration layer (core) - Controls the traversing the nodes in the graph. Which includes processing of data items and aggregation of results.
 * Dynamic implementation - not restricted to specific initialization algorithm, rather choosen from setting of each node in the traversed graph.
 * Edge functions are part of the integration layer where node implementations are called.
 */
// Note: wrapping in object allows the usage of decorators as they couldn't be used on separate functions.
export const { traverse } = {
  /** The `traverse` method is used to traverse entrypoint nodes only (Stage & SubgraphTemplate). */
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
    { parentTraversalArg, traverseCallContext } = {},
  ) {
    traversalConfig ||= new graphInstance.TraversalConfig({
      traversalImplementationHierarchy: {
        // Context instance parameter
        context: (graphInstance[Context.reference.key.getter] ? graphInstance[Context.reference.key.getter]()?.implementationKey : {}) || {} |> removeUndefinedFromObject,
        // implementation keys of node instance own config parameters and of default values set in function scope
        // hardcoded default implementation values matching the implementations from the instance initialization of Graph class.
        default: {
          processNode: 'returnDataItemKey',
          portNode: 'portNextImplementation',
          aggregator: 'AggregatorArray',
          traversalInterception: 'processThenTraverse',
        },
        // parent arguments
        // TODO: deal with depth property configuration effect in nested nodes.
        parent: parentTraversalArg ? parentTraversalArg[0].traversalConfig.getTraversalImplementationKey() || {} : {},
      },
      evaluationHierarchy: {
        default: { propagation: schemeReference.evaluationOption.propagation.continue, aggregation: schemeReference.evaluationOption.aggregation.include },
      },
    })
    if (implementationKey) {
      traversalConfig.setImplementationHierarchy('parameter', implementationKey |> removeUndefinedFromObject)
      // TODO: Add if statement to check for configuration depth value, where it controls the effect of the configuratiopn option on the next nested nodes in the graph. i.e. Passing the parent argument or removing it.
      /* for now, pass argument to all nested nodes by default (by not removing the argument)
       delete arguments[0].implementationKey */
    }
    // remove undefined values because native Object.assign doesn't override keys with `undefined` values
    if (evaluation) {
      traversalConfig.setEvaluationHierarchy('parameter', evaluation)
      // TODO: Add if statement to check for configuration depth value, where it controls the effect of the configuratiopn option on the next nested nodes in the graph. i.e. Passing the parent argument or removing it.
      delete arguments[0].evaluation
    }
    // get configuration of type 'evaluation' & 'implementation'
    let { implementationConfiguration, evaluationConfiguration } = await graphInstance.evaluatePosition({ node: nodeInstance })
    traversalConfig.setImplementationHierarchy('configuration', implementationConfiguration)
    traversalConfig.setEvaluationHierarchy('configuration', evaluationConfiguration)

    if (nodeInstance.labels.includes(schemeReference.nodeLabel.subgraphTemplate)) {
      let subgraphTemplateResult = await graphInstance.traverseSubgraphTemplate({ nodeInstance, graphInstance })
      if (!subgraphTemplateResult) return // in case no root node was configured in the subgraph template node.
      let { rootNode, additionalChildNode } = subgraphTemplateResult
      // set additional parameters
      arguments[0].traversalConfig = traversalConfig
      arguments[0].nodeInstance = rootNode
      arguments[0].additionalChildNode = [...(arguments[0].additionalChildNode || []), ...additionalChildNode]
      return await graphInstance.traverse(...arguments)
    } else if (nodeInstance.labels.includes(schemeReference.nodeLabel.stage))
      return await graphInstance.stageNode(
        { graphInstance, nodeInstance, traversalConfig, traversalDepth, path, additionalChildNode, eventEmitter, aggregator },
        { parentTraversalArg, traverseCallContext },
      )
    else throw new Error(`• Unsupported node type for traversal function - ${nodeInstance.labels}`)
  },
}
