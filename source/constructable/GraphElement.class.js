import { inherits as extend } from 'util'
import inheritNull from '../utility/extendFromNull.js'

export function GraphElementFunction({ superConstructor = null } = {}) {
  let self = function GraphElement(args, { constructor = 'key' }) {
    // redirect construct to particular implementation.
    return this::self.construction[constructor](args)
  }

  self.construction = {
    data({ data: object }) {
      Object.assign(this, data)
      return this
    },
    key({ key }) {
      return this
    },
  }

  /* Delegate to Superconstructor */
  superConstructor == null ? inheritNull(self) : extend(self, superConstructor)

  self = new Proxy(self, {})
  return self
}
