import { removeUndefinedFromObject } from './removeUndefinedFromObject.js'

// TODO: Implement default values merge algorithm or Use `mergeNonexistentProperties` from Entity module to create a decorator method that assigns default values and makes checks outside the main scope of the target method.
// Merge default values into passed arguments (1 level object merge) - this function is used as a pattern to set default parameters and make them accessible to latter/following decorator functions that wrap the target method.
export function mergeDefaultParameter({ defaultArg, passedArg }) {
  let loopLength = Math.max(defaultArg.length, passedArg.length)
  for (let index = 0; index < loopLength; index++) {
    if (typeof passedArg[index] == 'object' && typeof defaultArg[index] == 'object') {
      passedArg[index] = Object.assign(defaultArg[index], passedArg[index] |> removeUndefinedFromObject)
    } else if (!passedArg[index]) {
      passedArg[index] = defaultArg[index]
    } else {
      passedArg[index] = passedArg[index]
    }
  }
  return passedArg
}
