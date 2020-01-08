import assert from 'assert'
import { proxifyMethodDecorator } from '../../utility/proxifyMethodDecorator.js'
import { removeUndefinedFromObject } from '../../utility/removeUndefinedFromObject.js'
import * as Context from '../Context.class.js'
import * as Traversal from '../Traversal.class.js' // traversal implementation management
import { Traverser } from './Traverser.class.js'

// Each exported property ends up as the prototype property of the class.
export * from './method/stageNode.js'
export * from './method/rerouteNode.js'
export * from './method/forkEdge.js'
export * from './method/executeEdge.js'
export * as traverserInstruction from '../../traverserInstruction'
export * as databaseWrapper from '../../dataModel/concreteDatabaseWrapper.js'
export * as schemeReference from '../../dataModel/graphSchemeReference.js'

// load graph into memory
export async function load({ graphData } = {}) {
  // load json graph data.
  assert(graphData.node && graphData.edge, `• Graph data object must contain node & edge arrays.`)
  return await this.database.loadGraphData({ nodeEntryData: graphData.node, connectionEntryData: graphData.edge })
}

export async function print({} = {}) {
  console.log(`______ Graph elements: ____________________`)
  let count = await this.count()
  let allNode = await this.database.getAllNode()
  let allEdge = await this.database.getAllEdge()
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

export async function count({} = {}) {
  // count number of cached elements
  return {
    node: await this.database.countNode(),
    connection: await this.database.countEdge(),
  }
}

/** Graph traversal integration layer (core) - Controls the traversing the nodes in the graph. Which includes processing of data items and aggregation of results.
 * Dynamic implementation - not restricted to specific initialization algorithm, rather choosen from setting of each node in the traversed graph.
 * Edge functions are part of the integration layer where node implementations are called.
 */
// Note: wrapping in object allows the usage of decorators as they couldn't be used on separate functions.
export const { traverse } = {
  // Initiate traversal or an existing traversal sequence.
  /** The `traverse` method is used to traverse entrypoint nodes only (Stage & Reroute/SubgraphTemplate). */
  @proxifyMethodDecorator(async (target, thisArg, argumentsList, targetClass, methodName) => {
    // create node instance, in case string key is passed as parameter.
    let { nodeInstance /* type Node */, nodeKey, nodeID, traverser } = argumentsList[0]
    if (!nodeInstance) {
      if (nodeKey) nodeInstance = await thisArg.database.getNodeByKey({ key: nodeKey })
      // retrieve node data on-demand
      else if (nodeID) nodeInstance = await thisArg.database.getNodeByID({ id: nodeID })
      // in case an already initiated traverser instance is passed.
      else if (traverser) nodeInstance = traverser.node
      // retrieve node data on-demand
      else throw new Error('• node identifier or object must be passed in.')
      ;['nodeKey', 'nodeID'].forEach(property => delete argumentsList[0][property]) // remove node related identifiers.
    }
    // Verify entrypoint, and mark the label being used as entrypoint node type (as multiple entrypoint node types could be registered on the same node)
    nodeInstance.entrypointNodeType = Traverser.getEntrypointNodeType({ node: nodeInstance })

    argumentsList[0].nodeInstance ||= nodeInstance // set node data
    return Reflect.apply(target, thisArg, argumentsList)
  })
  async traverse(
    {
      nodeInstance,
      implementationKey,
      evaluation,
      additionalChildNode,
      // current node related parameters
      traverser,
      // represents a traversal sequence that has it's own cache, aggregator, statistics, and other parameters.
      // traversal sequence related parameters -
      traversalSequenceState, // TODO: implement traversal sequence
    },
    { parentTraverser, traverseCallContext } = {},
  ) {
    traversalSequenceState ||= {}

    {
      // each call creates new traverser with calculation of traversal implementation hierarchy  and position evaluation for the current node
      traverser ||= new Traverser({
        graph: this,
        node: nodeInstance,
        parentTraverser,
      })

      if (implementationKey) {
        traverser.setImplementationHierarchy('parameter', implementationKey |> removeUndefinedFromObject)
        // TODO: Add if statement to check for configuration depth value, where it controls the effect of the configuratiopn option on the next nested nodes in the graph. i.e. Passing the parent argument or removing it.
        /* for now, pass argument to all nested nodes by default (by not removing the argument)
      delete arguments[0].implementationKey */
      }

      // remove undefined values because native Object.assign doesn't override keys with `undefined` values
      if (evaluation) {
        traverser.setEvaluationHierarchy('parameter', evaluation)
        // TODO: Add if statement to check for configuration depth value, where it controls the effect of the configuratiopn option on the next nested nodes in the graph. i.e. Passing the parent argument or removing it.
        delete arguments[0].evaluation
      }

      // Evaluation that affects the traverser itself - get configuration of type 'evaluation' & 'implementation'
      let { implementationConfiguration, evaluationConfiguration } = await this.traverserInstruction.configurationEvaluation.resolveEvaluationConfiguration({ targetNode: traverser.node, graph: this })
      traverser.setImplementationHierarchy('configuration', implementationConfiguration)
      traverser.setEvaluationHierarchy('configuration', evaluationConfiguration)

      // set aggregator using own calculated implementation
      traverser.initialize()
    }

    let implementation = traverser.getEntrypointNodeImplementation()
    return await this::implementation({ traverser, additionalChildNode }, { traverseCallContext })
  },
}

/** next iterator returns entrypoint nodes (Stage or Reroute/SubgraphTemplate nodes)
 * @param nodeIterator - iterator of object { node: <node data> }
 */
export async function traverseIterationRecursiveCallback({ traversalIterator /*2-way communication with propagation implamentation*/, additionalChildNode, traverser, traverseCallContext }) {
  // first call is used to initialize the function (using non-standard function.sent)
  let nextYielded = await traversalIterator.next({ eventEmitterCallback: (...args) => traverser.eventEmitter.emit('nodeTraversalCompleted', ...args) })
  // call traverse for each node
  // TODO: Pass next function to control traversal initiation of next sibling node inline.
  while (!nextYielded.done) {
    let traversalInvocation = function() {}
    let traversalPromise = this::this.traverse({ nodeInstance: nextYielded.value.node /* next node */, additionalChildNode }, { parentTraverser: traverser, traverseCallContext })
    // 🔁 recursion traversal call (with next node)
    nextYielded = await traversalIterator.next({ traversalPromise })
  }
  return nextYielded.value // last yielded value is the result array.
}

/**
 * Controls execution of node traversals & Hands over control to implementation:
 *  1. Accepts new nodes from implementing function.
 *  2. returns back to the implementing function a promise, handing control of flow and arragement of running traversals.
 * @return {iterator feed of object} - {config: { port: <port node> }, result: <array of next nodes>}
 */
export async function* traverseGroupIterationRecursiveCall({
  groupIterator /** Feeding iterator that will accept node parameters for traversals */,
  additionalChildNode,
  traverseCallContext,
  /** 
    Important Note:  
    Below parameters are used in the interception proxy to decide what to traverse and how to aggregate the results. 
    `Traversal config` in the interception will limit the traversal and processing, i.e. it decides if to process current node, if to include it to aggragation, and if to traverse the nested nodes.
    If interception proxy is excluded (no implementation set), the graph should traverse all nodes with no restrictions.
  */
  traverser,
  processDataCallback,
}) {
  // port traversal result - last node iterator feed should be an array of resolved node promises that will be forwarded through this function
  // forward array of resolved results
  for await (let { group } of groupIterator)
    yield {
      group: {
        result: await this::this.traverseIterationRecursiveCallback({
          traversalIterator: group.traversalIterator,
          additionalChildNode,
          traverser,
          traverseCallContext,
        }),
        config: {
          portNode: group.config.forkEdge.destination, // the related port which the stage originated from.
        },
      },
    }
}
