import assert from 'assert'
import { AggregatorArray, ConditionCheck } from './Aggregator.class.js'
import { processDataItem } from './processDataItem.js'
import { traverseNode, iteratePort } from './traverseNode.js'
import { processThenTraverse, conditionCheck } from './traversalInterception.js'

export const implementation = {
  traverseNode: traverseNode,
  traversalInterception: processThenTraverse,
  processData: processDataItem,
  aggregator: AggregatorArray,
}
