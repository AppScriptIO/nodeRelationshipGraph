// TODO: Implement default values merge algorithm or Use `mergeNonexistentProperties` from Entity module to create a decorator method that assigns default values and makes checks outside the main scope of the target method.
// Merge default values into passed arguments (1 level object merge) - this function is used as a pattern to set default parameters and make them accessible to latter/following decorator functions that wrap the target method.
export function mergeDefaultParameter({ defaultArg, passedArg }) {
  passedArg = defaultArg.map((defaultValue, index) => {
    let passedValue = passedArg[index]
    if (typeof passedValue == 'object' && typeof defaultValue == 'object') {
      return Object.assign(defaultValue, passedValue)
    } else if (!passedValue) {
      return defaultValue
    } else {
      passedValue
    }
  })
  return passedArg
}
