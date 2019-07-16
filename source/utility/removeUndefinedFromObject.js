export const removeUndefinedFromObject = object => {
  Object.keys(object).forEach(key => object[key] === undefined && delete object[key])
  return object
}
