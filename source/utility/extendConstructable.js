import { inherits as extend } from 'util'

/* Delegate to Superconstructor */
export function extendFromConstructable(constructableTarget, constructableParent) {
  extend(constructableTarget, constructableParent)
  Object.setPrototypeOf(constructableTarget, constructableParent)
}

// inherit from null
export function extendFromNull(constructable) {
  Object.setPrototypeOf(constructable, null)
  Object.setPrototypeOf(constructable.prototype, null)
}
