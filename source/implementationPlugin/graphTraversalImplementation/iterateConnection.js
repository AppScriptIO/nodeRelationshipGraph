/**
 * Loops through node connection to traverse the connected nodes' graphs
 * @param {*} nodeConnectionArray - array of connection for the particular node
 */
export async function* iterateConnection({
  nodeConnectionArray, // = thisArg.connection || [],
} = {}) {
  const controlArg = function.sent

  // filter connection array to match outgoing connections only
  // nodeConnectionArray = nodeConnectionArray.filter(item => item.tag.direction == 'outgoing')

  // sort connection array
  const sortAccordingToOrder = (former, latter) => former.source.position.order - latter.source.position.order // using `order` property
  nodeConnectionArray.sort(sortAccordingToOrder)

  for (let nodeConnection of nodeConnectionArray) {
    // iteration implementaiton
    for (let destinationNode of nodeConnection.destination.node) {
      yield { nodeKey: destinationNode.key }
    }
  }
}

// Connection Arrangment
let x = {
  /**
   * @description filters & modifies array by removing truthy indexes.
   *
   * @param {any} {insertionPointKey, insertionPath = null}
   * @returns
   */
  async filterAndOrderChildren({ insertionPointKey, children = this.children }) {
    let ownFilteredChildren = await this.filterAndModifyChildrenArray(children, insertionPointKey, null)
    let additionalFilteredChildren = await this.filterAndModifyChildrenArray(this.additionalChildNestedUnit, insertionPointKey, this.pathPointerKey)
    let merged = await this.mergeAndOrderChildren(ownFilteredChildren, additionalFilteredChildren)
    return merged
  },
  /**
   * Get children corresponding to the current insertion point.
   * // Take into consideration the indirect children added from previous (inhereted) trees.
   * // filteredTreeChildren + immediateNextChildren
   * // let nextChildren;
   */
  async filterAndModifyChildrenArray(children, insertionPointKey, pathPointerKey) {
    return children.filter((child, index) => {
      // filter children that correspont to the current insertionpoint.
      let result = child.insertionPosition.insertionPoint == insertionPointKey && child.insertionPosition.insertionPathPointer == pathPointerKey
      // if (result) children.splice(index, 1); // was ment to increase the performance of the program, preventing rechecking of already checked array items. But it causes some issues.
      return result
    })
  },
  // order additional children that will be mixed into ownChildren. According to a setting that needs to be added into each child object.
  async mergeAndOrderChildren(ownFilteredChildren, additionalFilteredChildren) {
    // metrge 2 arrays., appending one to the other.
    // let filteredChildren = []
    // await Array.prototype.push.apply(filteredChildren, ownFilteredChildren, additionalFilteredChildren);
    let firstChildren = [],
      lastChildren = [],
      orderedChildren = []
    await additionalFilteredChildren.sort((prior, subsequent) => {
      return prior.order <= subsequent.order ? 1 : -1
    })
    await ownFilteredChildren.sort((prior, subsequent) => {
      return prior.order <= subsequent.order ? 1 : -1
    })

    // filter children that correspont to the current insertionpoint.
    additionalFilteredChildren = additionalFilteredChildren.filter((child, index) => {
      // default fallback is to add the child to the beginning/end of the array, in case no pathPointerKey is specified (pathPointerKey decides which node to place the child relative to).
      if (!child.insertionPosition.placement.pathPointer && child.insertionPosition.placement.type) {
        switch (child.insertionPosition.placement.type) {
          case 'before':
            firstChildren.push(child)
            break
          case 'after':
          default:
            lastChildren.push(child)
            break
        }
        return false
        // additionalFilteredChildren.splice(index, 1);
      }
      return true
    })

    // insert additional child if it matches current child path pointer key.
    ownFilteredChildren.map((ownChild, ownChildIndex) => {
      orderedChildren.push(ownChild) // add child to ordered array
      let currentChildPosition = orderedChildren.length - 1 // last array item index.
      additionalFilteredChildren.map((additionalChild, additionalChildIndex) => {
        if (
          additionalChild.insertionPosition.placement.type &&
          additionalChild.insertionPosition.placement.pathPointer &&
          additionalChild.insertionPosition.placement.pathPointer == ownChild.pathPointerKey
        ) {
          switch (additionalChild.insertionPosition.placement.type) {
            case 'before':
              orderedChildren.splice(currentChildPosition, 0, additionalChild) // insert before currentPosition
              break
            case 'after':
            default:
              orderedChildren.splice(currentChildPosition + 1, 0, additionalChild) // insert after currentPosition.
              break
          }
        }
      })
    })

    return Array.prototype.concat(firstChildren, orderedChildren, lastChildren)
  },
  async addAdditionalChildNestedUnit({ nestedUnit }) {
    // Add the rest of the immediate children to the next tree as additional children. propagate children to the next tree.
    if (nestedUnit.children.length != 0) {
      await Array.prototype.push.apply(nestedUnit.children, nestedUnit.additionalChildNestedUnit)
    } else {
      nestedUnit.children = await nestedUnit.additionalChildNestedUnit.slice()
    }
  },
}
