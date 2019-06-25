/* Simplifies the usage of decorator with Proxy wrapping. */
export function proxifyMethodDecorator(
  callback: Function = (target, thisArg, argumentsList, targetClass, methodName) => Reflect.apply(targetClass[methodName], thisArg, argumentsList), // callback follows this convention
) {
  return function(targetClass, methodName, propertyDescriptor) {
    propertyDescriptor.value = new Proxy(propertyDescriptor.value, {
      apply: async (target, thisArg, argumentsList) => {
        return callback(target /*Non proxied original target*/, thisArg, argumentsList, targetClass, methodName)
      },
    })
    return propertyDescriptor
  }
}
