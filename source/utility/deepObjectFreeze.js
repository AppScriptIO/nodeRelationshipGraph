export function deepFreezePropertyName(object) {
  Object.freeze(object)

  Object.getOwnPropertyNames(object).forEach(function(prop) {
    if (object.hasOwnProperty(prop) && object[prop] !== null && (typeof object[prop] === 'object' || typeof object[prop] === 'function') && !Object.isFrozen(object[prop])) {
      deepFreezePropertyName(object[prop])
    }
  })

  return object
}

export function deepFreezePropertySymbol(object) {
  Object.freeze(object)

  Object.getOwnPropertySymbols(object).forEach(function(symbol) {
    if (object.hasOwnProperty(symbol) && object[symbol] !== null && (typeof object[symbol] === 'object' || typeof object[symbol] === 'function') && !Object.isFrozen(object[symbol])) {
      deepFreezePropertySymbol(object[symbol])
    }
  })

  return object
}
