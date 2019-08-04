/**
 * Handles the graph traversal propagation order
 * @yields a traversal configuration feed/iterator
 * @return results array
 **/
export async function* handlePropagation({ nodeIteratorFeed, implementation /** Controls the iteration over nodes and execution arrangement. */, graphInstance = this }) {
  let { eventEmitterCallback: emit } = function.sent
  let traversalIteratorFeed = implementation({ nodeIteratorFeed, emit }) // pass iterator to implementation and propagate back (through return statement) the results of the node promises after completion
  async function* trapAsyncIterator(iterator) {
    let iteratorResult = await iterator.next()
    while (!iteratorResult.done) {
      let traversalConfig = iteratorResult.value
      yield traversalConfig
      let { promise } = function.sent
      iteratorResult = await iterator.next({ promise })
    }
    return iteratorResult.value
  }
  return yield* trapAsyncIterator(traversalIteratorFeed)
}
