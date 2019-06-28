import assert from 'assert'
import { AggregatorArray, ConditionCheck } from './concreteFunction/aggregator.js'
import { returnDataItemKey, returnKey, timeout } from './concreteFunction/processDataItem.js'
import { allPromise, chronological, raceFirstPromise, iteratePort } from './concreteFunction/traverseNode.js'
import { processThenTraverse, conditionCheck } from './concreteFunction/traversalInterception.js'

export const implementation = {
  traverseNode: { allPromise, chronological, raceFirstPromise },
  traversalInterception: { processThenTraverse, conditionCheck },
  aggregator: { AggregatorArray, ConditionCheck },
  processData: { returnDataItemKey, returnKey, timeout },
}
