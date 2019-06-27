// Aggregates graph traversal results
export class AggregatorArray {
  value: Array
  constructor(initialValue: Array) {
    this.value = initialValue || []
    return this
  }
  // add item to aggregator
  add(item, aggregator = this) {
    debugger
    return aggregator.value.unshift(item) // insert at start
  }
  // merge aggregators
  merge(additionalAggregator: Aggregator, targetAggregator: Aggregator = this) {
    debugger
    targetAggregator.value = [...targetAggregator.value, ...additionalAggregator.value]
    return targetAggregator
  }
}

export class ConditionCheck {
  value: Boolean
  constructor(initialValue) {
    this.value = initialValue || true // assume true till check fails.
    return this
  }
}
