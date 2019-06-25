import assert from 'assert'
import { AggregatorArray, ConditionCheck } from './Aggregator.class.js'
import { processDataItem } from './processDataItem.js'
import { traverseGraph, processThenTraverse, conditionCheck, iteratePort } from './traverseGraph.js'

export const implementation = {
  graphTraversalInterception: processThenTraverse,
  traverseGraph: traverseGraph,
  processData: processDataItem,
  aggregator: AggregatorArray,
}
