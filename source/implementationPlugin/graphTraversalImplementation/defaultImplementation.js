import assert from 'assert'
import * as aggregator from './concreteFunction/aggregator.js'
import * as processDataItem from './concreteFunction/processDataItem.js'
import * as handlePropagation from './concreteFunction/handlePropagation.js'
import * as traverseNode from './concreteFunction/traverseNode.js'
import * as traversalInterception from './concreteFunction/traversalInterception.js'

export const implementation = {
  traverseNode: traverseNode,
  handlePropagation: handlePropagation,
  traversalInterception: traversalInterception,
  aggregator: aggregator,
  processData: processDataItem,
}
