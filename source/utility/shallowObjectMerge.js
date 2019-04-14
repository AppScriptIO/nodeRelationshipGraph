// add base object to target object without overwriting existing properties.
export function shallowMergeNonExistingPropertyOnly({ targetObject, baseObject }) {
  return Object.keys(baseObject).reduce(function(accumulator, key) {
    if (!accumulator[key]) accumulator[key] = baseObject[key]
    return accumulator
  }, targetObject)
}
