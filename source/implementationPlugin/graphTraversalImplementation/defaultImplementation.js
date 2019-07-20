import assert from 'assert'
import * as aggregator from './concreteFunction/aggregator.js'
import * as processData from './concreteFunction/processData.js'
import * as handlePropagation from './concreteFunction/handlePropagation.js'
import * as traverseNode from './concreteFunction/traverseNode.js'
import * as traversalInterception from './concreteFunction/traversalInterception.js'
import * as evaluatePosition from './concreteFunction/evaluatePosition.js'

export const implementation = {
  traverseNode,
  handlePropagation,
  traversalInterception,
  aggregator,
  processData,
  evaluatePosition,
}
