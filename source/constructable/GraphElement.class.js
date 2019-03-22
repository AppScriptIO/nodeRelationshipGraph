import { extendFromNull, extendFromConstructable } from '../utility/extendConstructable.js'

interface GraphElementData {
  label: object;
  key: string | number;
  [key: string]: any; // optional other fields
}

/**
 ** Producing an `Entity`
 */
class Entity {}
Object.assign(Entity.prototype, {
  createDelegatedObject: function({ target = this } = {}) {
    let instance = Object.create(target.prototype)
    return instance
  },
  createDelegatedFunction: function({
    target = this, // may refer to a proxy of the original constructable.
  } = {}) {
    const createConstructableForProxyUsage = () =>
      function ProxyInterfaceFunction() {
        assert(false, '• Construction should not reach `proxyInterfaceFunction` function, rather the proxy wrapping it should deal with the construct handler.')
      }
    let instance = createConstructableForProxyUsage()
    instance.prototype = target.prototype // provide access for target.prototype.constructor (original constructor functions)
    instance.constructor = target // keep track of the proxy constructors chain.
    return instance
  },
  /**
   * Prototype instance
   */
  createPrototypeDelegatedInstance: {
    construct: function(args = [], { constructorImplementation = 'key', instanceObject, self = this }: { constructorImplementation: 'data' | 'key' } = {}) {
      instanceObject ||= self.createDelegatedObject()
      return self::self.prototypeDelegatedInstance[constructorImplementation](args, { instanceObject }) // redirect construct to particular implementation.
    },
  },

  /**
   * Constructor instance
   * Config constructors - constructors that produce a configured constructable
   **/
  createConstructorDelegatedInstance: {
    construct(args = [], { constructorImplementation = 'default', constructableInstance, self = this } = {}) {
      constructableInstance ||= self::self.createDelegatedFunction() // function object as an instance allows to use `construct` & `apply` with Proxy.
      constructableInstance.plugin = args[0]
      return self::self.constructorDelegatedInstance[constructorImplementation](args, { constructableInstance })
    },
  },

  createClientInterface: {
    construct(args = [], { constructorImplementation = 'constructableInterface', constructableInstance, self = this }: { constructorImplementation: string } = {}) {
      constructableInstance ||= self::self.createConstructorDelegatedInstance.construct()
      // Allows for configuring constructable target recursively.
      return self::self.clientInterface[constructorImplementation](args, { interfaceTarget: constructableInstance })
    },
  },
})

export function GraphElementFunction({ superConstructor = null } = {}) {
  const self = function GraphElement() {
    // assert(false, '• Construction should not reach the original function constructor, rather the proxy exposing its interface should deal with its behavior.')
  }

  // superConstructor == null ? extendFromNull(self) : extendFromConstructable(self, superConstructor)
  extendFromConstructable(self, Entity)

  self.prototype.entityImplementation = {
    clientInterface: {
      constructableInterface(args, { interfaceTarget, self = this }) {
        const proxiedTarget = new Proxy(
          interfaceTarget,
          Object.assign({
            apply(target, thisArg, argumentsList) {
              let constructableInstance = self::self.createConstructorDelegatedInstance.construct(argumentsList, { constructorImplementation: 'plugin' })
              return self::Entity.createClientInterface.construct(undefined, { constructableInstance })
            },
            construct(target, argumentList, proxiedTarget) {
              return target.prototypeDelegatedInstance(...argumentList)
            },
          }),
        )
        return proxiedTarget
      },
      speakInterface(args, { interfaceTarget, self = this }) {
        const proxiedTarget = new Proxy(
          interfaceTarget,
          Object.assign({
            apply(target, thisArg, argumentsList) {
              console.log('apply')
            },
            construct(target, argumentList, proxiedTarget) {
              console.log('construct')
            },
          }),
        )
        return proxiedTarget
      },
    },
    constructorDelegatedInstance: {
      default(args, { self = this, constructableInstance }) {
        // Execute default instance constructor
        constructableInstance.prototypeDelegatedInstance = (...argumentList) => self::self.prototypeDelegatedInstance.construct(argumentList, { constructorImplementation: 'data' })
        return constructableInstance
      },
      plugin(args, { self = this, constructableInstance }) {
        //! Apply multiple inheritance from argument list instances.
        constructableInstance.prototypeDelegatedInstance = (...argumentList) => self::self.prototypeDelegatedInstance.construct(argumentList, { constructorImplementation: 'key' })
        return constructableInstance
      },
    },
    prototypeDelegatedInstance: {
      /* Instance constructor implementations */
      data([{ data }: { data: GraphElementData }], { instanceObject }) {
        Object.assign(instanceObject, data) // apply data to instance
        return instanceObject
      },
      key([{ key }: { key: string | number }], { instanceObject }) {
        instanceObject.key = key
        let data = true || instanceObject.plugin.databaseModelAdapter({ key: instanceObject.key })
        console.log(data)
        Object.assign(instanceObject, data)
        return instanceObject
      },
    },
  }

  let selfInstance = new self()
  // console.log(selfInstance |> Object.getPrototypeOf |> Object.getPrototypeOf)
  const proxiedSelf = selfInstance::selfInstance.createClientInterface.construct()
  return proxiedSelf
}
