import assert from 'assert'
import EventEmitter from 'events'
import { removeUndefinedFromObject } from '../../utility/removeUndefinedFromObject.js'
import * as schemeReference from '../../dataModel/graphSchemeReference.js'
import * as stageNode from './method/stageNode.js'
import * as rerouteNode from './method/rerouteNode.js'

// represents the current traversion of a node with it's properties.
// & represents traversal config - Handles parameter hierarchy handling
/** 
 * TODO:  REFACTOR adding Traversal description class - ability to pick a defined set of implementation keys to be used to gether - e.g. implementation type: Condition, Middleware, Template, Schema, Shellscript.
 - https://neo4j.com/docs/java-reference/3.5/javadocs/org/neo4j/graphdb/traversal/TraversalConfig.html
 - Implement 'depthAffected' for the affected depth of the configure connections on a stage and its child nodes.
 */
export class Traverser {
  static defaultEvaluationHierarchyKey = {
    propagation: schemeReference.evaluationOption.propagation.continue,
    aggregation: schemeReference.evaluationOption.aggregation.include,
  }
  // implementation keys of node instance own config parameters and of default values set in function scope
  // hardcoded default implementation values matching the implementations from the instance initialization of Graph class.
  static defaultTraversalImplementationKey = {
    processNode: 'returnDataItemKey',
    portNode: 'propagationControl',
    aggregator: 'AggregatorArray',
    traversalInterception: 'processThenTraverse',
    // entrypoint node implementations - in the core code
    [schemeReference.nodeLabel.reroute]: 'traverseReference',
    [schemeReference.nodeLabel.stage]: 'stageNode',
  }
  static entrypointNodeImplementation = {
    [schemeReference.nodeLabel.reroute]: rerouteNode,
    [schemeReference.nodeLabel.stage]: stageNode,
  }
  static entrypointNodeArray = [schemeReference.nodeLabel.reroute, schemeReference.nodeLabel.stage]
  // get the type of current node labels which is considered an entrypoint
  static getEntrypointNodeType({ node }) {
    for (let nodeLabel of Traverser.entrypointNodeArray) if (node.labels.includes(nodeLabel)) return nodeLabel
    // if no label is permitted as an entrypoint type:
    throw new Error(`• Unsupported entrypoint node type for traversal function - ${node.labels}`)
  }

  node
  graph
  aggregator
  traversalImplementationHierarchy = {}
  evaluationHierarchy = {} // evaluation object that contains configuration relating to traverser action on the current position
  evaluation
  implementation
  path
  depth
  eventEmitter

  constructor({
    node,
    graph,
    depth = 0, // <type Number> level of recursion - allows to identify entrypoint level (toplevel) that needs to return the value of aggregator.
    path = null, // path to the current traversal.  // TODO: implement path sequence preservation. allow for the node traverse function to rely on the current path data.
    /* supported events: 'nodeTraversalCompleted' */
    eventEmitter = new EventEmitter(), // create an event emitter to catch events from nested nodes of this node during their traversals.
    parentTraverser,
  }) {
    this.node = node
    this.graph = graph
    this.path = parentTraverser ? parentTraverser.path : path
    this.depth = parentTraverser ? parentTraverser.depth + 1 : depth // increase traversal depth
    this.eventEmitter = eventEmitter

    this.traversalImplementationHierarchy = {
      // Context instance parameter
      context: graph.context?.implementationKey || {} |> removeUndefinedFromObject,
      // parent arguments
      // TODO: deal with depth property configuration effect in nested nodes.
      parent: parentTraverser ? parentTraverser.getTraversalImplementationKey() || {} : {},
    }
    this.evaluationHierarchy = {}

    return this
  }

  // calculate config and set own parameters
  initialize() {
    if (!this.aggregator) {
      let Aggregator = this.getImplementationCallback({ key: 'aggregator' })() // returns a function that can be passed additional hierarchy parameters
      this.aggregator = new Aggregator()
    }
  }

  setEvaluationHierarchy(parameterType, evaluation) {
    if (!this.evaluationHierarchy[parameterType]) this.evaluationHierarchy[parameterType] = {}
    Object.assign(this.evaluationHierarchy[parameterType], evaluation)
  }

  setImplementationHierarchy(parameterType, implementationKey) {
    if (!this.traversalImplementationHierarchy[parameterType]) this.traversalImplementationHierarchy[parameterType] = {}
    Object.assign(this.traversalImplementationHierarchy[parameterType], implementationKey)
  }

  calculateConfig() {
    return {
      evaluation: this.calculateEvaluationHierarchy(),
      implementation: this.getAllImplementation(),
    }
  }

  getEntrypointNodeImplementation({ nodeLabel = this.node.entrypointNodeType, implementationKey } = {}) {
    let implementationPropertyName = `${nodeLabel}_implementation` // associate an implementation to a node type incase multiple types present. e.g. "Stage_implementation"
    implementationKey ||= this.node.properties[implementationPropertyName] ? this.node.properties[implementationPropertyName] : undefined // node implementatio property that will affect the hierarchy implementation calculation.
    let nodeImplementationKey = implementationKey ? { [nodeLabel]: implementationKey } : undefined
    // TODO: use the same rule for node implementation properies for non entrypoints as well (e.g. Process, Port, etc.), when multiple types are used for the current node. OR reconsider and use a different way to configure type of a node with multiple labels.
    let calculatedImplementationKey = this.getTraversalImplementationKey({ key: nodeLabel, nodeImplementationKey })
    return Traverser.entrypointNodeImplementation[nodeLabel][calculatedImplementationKey]
  }

  getAllImplementation() {
    let implementationKey = this.getTraversalImplementationKey()
    let implementation = {
      processNode: this.graph.traversal.processNode[implementationKey.processNode],
      portNode: this.graph.traversal.portNode[implementationKey.portNode],
      traversalInterception: this.graph.traversal.traversalInterception[implementationKey.traversalInterception],
      aggregator: this.graph.traversal.aggregator[implementationKey.aggregator],
    }
    Object.entries(implementation).forEach(([key, value]) => {
      assert(
        Boolean(value),
        `• All traversal implementation concerete functions must be registered, the implementationKey "${key}" provided doesn't match any of the registered implementaions - ${implementation[key]}`,
      )
    })
    return implementation
  }

  getImplementationCallback({ key }) {
    let getTraversalImplementationKey = this.getTraversalImplementationKey
    return ({ nodeImplementationKey } = {}) => {
      let implementationKey = this.getTraversalImplementationKey({ key: key, nodeImplementationKey })
      let implementation = this.graph.traversal[key][implementationKey]
      assert(implementation, `• 'implementation' concerete function must be registered, the implementationKey "${implementationKey}" provided doesn't match any of the registered implementaions.`)
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
     ** Parameter hirerchy for graph traversal implementations: (1 as first priority):*/
    let implementationKey = Object.assign(
      {},
      // * 6. default values specified in the function scope.
      Traverser.defaultTraversalImplementationKey,
      // * 5. shared context configurations - that could be used as overwriting values. e.g. nodeInstance[Context.getSharedContext].concereteImplementationKeys
      this.traversalImplementationHierarchy.context,
      // * 4. parent parameters
      this.traversalImplementationHierarchy.parent,
      // * 3. node configurations
      this.traversalImplementationHierarchy.configuration,
      // * 2. node instance and edge properties
      nodeImplementationKey,
      // * 1. call parameters that are passed directly
      this.traversalImplementationHierarchy.parameter,
    )
    return implementationKey
  }

  calculateEvaluationHierarchy() {
    this.evaluation = Object.assign({}, Traverser.defaultEvaluationHierarchyKey, this.evaluationHierarchy.configuration, this.evaluationHierarchy.parameter)
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
