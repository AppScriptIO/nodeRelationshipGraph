// Aggregates graph traversal results
export class AggregatorArray {
  value: Array
  constructor(initialValue: Array) {
    this.value = initialValue || []
    return this
  }
  // add item to aggregator
  add(item, aggregator = this) {
    // filter null and undefined
    // if (!item) throw new Error(`• Returned undefined or null result of data processing.`)
    if (item) aggregator.value.push(item)
    // return aggregator.value.unshift(item) // insert at start
  }
  // merge aggregators
  merge(additionalAggregatorArray: [Aggregator], targetAggregator: Aggregator = this) {
    for (let additionalAggregator of additionalAggregatorArray) {
      targetAggregator.value = [...targetAggregator.value, ...additionalAggregator.value]
    }
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

// Conditions aggregator
export class ConditionAggregator {
  value: Boolean
  constructor(initialValue: Boolean) {
    this.value = initialValue || true
    return this
  }
  // add item to aggregator
  add(item, aggregator = this) {
    if (item) {
      aggregator.value = aggregator.value && Boolean(item)
    }
    // return aggregator.value.unshift(item) // insert at start
  }
  // merge aggregators
  merge(additionalAggregator: Boolean, targetAggregator: Aggregator = this) {
    targetAggregator.value = additionalAggregator && targetAggregator.value
    return targetAggregator
  }
}
