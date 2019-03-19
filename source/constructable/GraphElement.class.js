import { inherits as extend } from 'util'
import inheritNull from '../utility/extendFromNull.js'
function createDelegatedObjectDecorator(target) {
  target.createDelegatedObject = () => {
    let instance = Object.create(target.prototype)
    return instance
  }
  return target
}
function createDelegatedFunctionDecorator(target) {
  target.createDelegatedFunction = () => {
    let instance = function() {}
    Object.setPrototypeOf(instance, target.prototype)
    return instance
  }
  return target
}

interface GraphElementData {
  label: object;
  key: string | number;
  [key: string]: any; // optional other fields
}

/**
 *
 */
export function GraphElementFunction({ superConstructor = null } = {}) {
  const self =
    function GraphElement() {
      console.log('constructor applied')
    }
    |> createDelegatedObjectDecorator
    |> createDelegatedFunctionDecorator

  /* Delegate to Superconstructor */
  superConstructor == null ? inheritNull(self) : extend(self, superConstructor)

  self.constructorInstance = {
    construct: function(args = [], { constructor = 'key' }: { constructor: 'data' | 'key' }) {
      let instance = self.createDelegatedObject()
      return instance::self.constructorInstance[constructor](...args) // redirect construct to particular implementation.
    },
    /* Instance constructor implementations */
    data({ data }: { data: GraphElementData }) {
      Object.assign(this, data) // apply data to instance
      return this
    },
    key({ key }: { key: string | number }) {
      this.key = key
      // read from database and apply data to `this`
      let data = database({ key: this.key })
      Object.assign(this, data)
      return this
    },
  }

  /* Config constructors - constructors that produce a configured constructable */
  self.constructorConfig = {
    plugin({ constructableTarget, args }) {
      let funcInstance = self.createDelegatedFunction() // function object as an instance allows to use `construct` & `apply` with Proxy.
      funcInstance.args = args
      return new Proxy(funcInstance, {
        construct(_target, argumentList, _proxiedTarget) {
          return Reflect.construct(constructableTarget, argumentList)
        },
      }) // altered constructable
    },
  }

  const proxiedSelf = new Proxy(self, {
    construct(target, argumentList, proxiedTarget) {
      // Execute default instance constructor
      return self.constructorInstance.construct(argumentList, { constructor: 'data' })
    },
    apply(target, thisArg, argumentsList) {
      let proxiedTarget = proxiedSelf // the proxied target
      return thisArg::target.constructorConfig.plugin({ constructableTarget: proxiedTarget, args: argumentsList })
    },
  })
  return proxiedSelf
}
