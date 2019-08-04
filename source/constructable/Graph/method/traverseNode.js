import assert from 'assert'

/**
 * The purpose of this function is to find & yield next nodes.
 * @yield node feed
 **/
export async function* traverseNode({ node, additionalChildNode, implementation, handlePropagationImplementation, graphInstance = this }) {
  let traversalIteratorFeed = await node::implementation({ node, additionalChildNode, graphInstance })
  async function* trapAsyncIterator(iterator) {
    for await (let traversalIteration of iterator) {
      let _handlePropagationImplementation
      if (traversalIteration.traversalConfig.handlePropagationImplementation) {
        _handlePropagationImplementation = graphInstance.traversal.handlePropagation[traversalIteration.traversalConfig.handlePropagationImplementation]
        assert(_handlePropagationImplementation, `• "${traversalIteration.traversalConfig.handlePropagationImplementation}" implementation isn't registered in traversal concrete instance.`)
      } else _handlePropagationImplementation = handlePropagationImplementation
      let nextIterator = graphInstance::graphInstance.handlePropagation({ nodeIteratorFeed: traversalIteration.nextIterator, implementation: node::_handlePropagationImplementation })
      yield { nextIterator, fork: traversalIteration.fork }
    }
  }
  yield* trapAsyncIterator(traversalIteratorFeed)
}
