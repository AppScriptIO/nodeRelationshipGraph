import { proxifyMethodDecorator } from '../../utility/proxifyMethodDecorator.js'
import { removeUndefinedFromObject } from '@dependency/handleJSNativeDataStructure'
import * as Context from '../Context.class.js'
import { TraverserPosition } from './TraverserPosition.class.js'

// Each exported property ends up as the prototype property of the class.
export * from './method/iteration.js'
export * from './method/stageNode.js'
export * from './method/rerouteNode.js'
export * from './method/forkEdge.js'
export * from './method/executeEdge.js'
export * as traverserInstruction from './method/traverserInstruction'

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
    let { nodeInstance /* type Node */, nodeKey, nodeID, traverserPosition } = argumentsList[0]
    if (!nodeInstance) {
      if (nodeKey) nodeInstance = await thisArg.graph.database::thisArg.graph.database.implementation.getNodeByKey({ key: nodeKey })
      // retrieve node data on-demand
      else if (nodeID) nodeInstance = await thisArg.graph.database::thisArg.graph.database.implementation.getNodeByID({ id: nodeID })
      // in case an already initiated traverser instance is passed.
      else if (traverserPosition) nodeInstance = traverserPosition.node
      // retrieve node data on-demand
      else throw new Error('• node identifier or object must be passed in.')
      ;['nodeKey', 'nodeID'].forEach(property => delete argumentsList[0][property]) // remove node related identifiers.
    }
    // Verify entrypoint, and mark the label being used as entrypoint node type (as multiple entrypoint node types could be registered on the same node)
    nodeInstance.entrypointNodeType = TraverserPosition.getEntrypointNodeType({ node: nodeInstance })

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
      traverserPosition, //? could rename it to "traversalDescription"
    },
    { parentTraverserPosition, traverseCallContext } = {},
  ) {
    // console.log(`\x1b[33m%s\x1b[0m  \x1b[90m- %s\x1b[0m`,  `🦚 [${nodeInstance.labels.join(', ')}]`, `${nodeInstance.properties.key}`)

    this.statistics.traversedNodeList.push(nodeInstance)

    // each call creates new traverser with calculation of traversal implementation hierarchy  and position evaluation for the current node
    traverserPosition ||= new TraverserPosition({ traverser: this, node: nodeInstance, parentTraverserPosition })

    if (implementationKey) {
      traverserPosition.setImplementationHierarchy('parameter', implementationKey |> removeUndefinedFromObject)
      // TODO: Add if statement to check for configuration depth value, where it controls the effect of the configuratiopn option on the next nested nodes in the graph. i.e. Passing the parent argument or removing it.
      /* for now, pass argument to all nested nodes by default (by not removing the argument)
           delete arguments[0].implementationKey */
    }

    // remove undefined values because native Object.assign doesn't override keys with `undefined` values
    if (evaluation) {
      traverserPosition.setEvaluationHierarchy('parameter', evaluation)
      // TODO: Add if statement to check for configuration depth value, where it controls the effect of the configuratiopn option on the next nested nodes in the graph. i.e. Passing the parent argument or removing it.
      delete arguments[0].evaluation
    }

    // Evaluation that affects the traverser itself - get configuration of type 'evaluation' & 'implementation'
    let { implementationConfiguration, evaluationConfiguration } = await this::this.traverserInstruction.configurationEvaluation.resolveEvaluationConfiguration({
      targetNode: traverserPosition.node,
    })
    traverserPosition.setImplementationHierarchy('configuration', implementationConfiguration)
    traverserPosition.setEvaluationHierarchy('configuration', evaluationConfiguration)

    // set aggregator using own calculated implementation
    traverserPosition.initialize()

    let entrypointNodeImplementation = traverserPosition.getEntrypointNodeImplementation()
    return await this::entrypointNodeImplementation({ traverserPosition, additionalChildNode }, { traverseCallContext })
  },
}

// encapsulates iterators during traversal of the graph (relating to a traverser sequence)
export async function invokeNextTraversalPromise() {
  if (this.iteratorObjectList.length == 0) return // if no iterators

  let iteratorObject
  do {
    if (this.iteratorObjectList.length == 0) return // no more iterators
    let iterator = this.iteratorObjectList[this.iteratorObjectList.length - 1] // last iterator added during traverser
    iteratorObject = await iterator.next()
    if (iteratorObject.done) this.iteratorObjectList.pop()
  } while (iteratorObject.done)

  let traversalPromise = iteratorObject.value.traversalInvocation()
  return { traversalPromise, node: iteratorObject.value.node }
}
