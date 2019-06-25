// function wrapper to set thisArg on target object methods.
export function bindAllMethod({ target /**target object holding the methods to bind */, thisArg }) {
  Object.keys(target).forEach(function(key) {
    target[key] = target[key].bind(thisArg)
  }, {})
  return target
}
