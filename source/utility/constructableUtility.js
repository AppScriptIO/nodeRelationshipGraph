import assert from 'assert'

/**
 * Hackish way to allow creating a proxy with `constuct` and `apply` handlers. Because the native JS doesn't allow for non-constructables to specify these handlers.
 */
function createConstructableForProxyUsage() {}

export function createDelegatedObjectDecorator(decoratorTarget) {
  decoratorTarget.createDelegatedObject = decoratorTarget::createDelegatedObject // always refer to the original constructable.
  return decoratorTarget
}
export function createDelegatedFunctionDecorator(decoratorTarget) {
  decoratorTarget.createDelegatedFunction = decoratorTarget::createDelegatedFunction
  return decoratorTarget
}
