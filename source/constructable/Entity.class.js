export const Entity = Object.create(null)

Object.assign(Entity, {
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
  prototypeDelegation: {},
  // programmaticAPIReference for the target extedning object to use.
  reference: {
    prototypeInstance: {
      method: {
        construct: {
          instantiate: Symbol('Entity:prototypeInstance.method.construct.instantiate'),
          initialize: Symbol('Entity:prototypeInstance.method.construct.initialize'),
        },
      },
      implementation: {
        prototypeDelegation: Symbol('Entity:prototypeInstance.implementation.prototypeDelegation'),
        instantiate: Symbol('Entity:prototypeInstance.implementation.instantiate'),
        initialize: Symbol('Entity:prototypeInstance.implementation.initialize'),
      },
      fallbackImplementation: {
        instantiate: Symbol('Entity:prototypeInstance.fallbackImplementation.instantiate'),
        initialize: Symbol('Entity:prototypeInstance.fallbackImplementation.initialize'),
      },
      setter: {
        prototypeDelegation: Symbol('Entity:prototypeInstance.setter.prototypeDelegation'),
        instantiate: Symbol('Entity:prototypeInstance.setter.instantiate'),
        initialize: Symbol('Entity:prototypeInstance.setter.initialize'),
      },
      getter: {
        prototypeDelegation: Symbol('Entity:prototypeInstance.getter.prototypeDelegation'),
        instantiate: Symbol('Entity:prototypeInstance.getter.instantiate'),
        initialize: Symbol('Entity:prototypeInstance.getter.initialize'),
      },
    },

    configuredConstructable: {
      method: {
        construct: Symbol('Entity:configuredConstructable.method.construct'),
      },
      implementation: {
        construct: Symbol('Entity:configuredConstructable.implementation.construct'),
      },
      fallbackImplementation: {
        construct: Symbol('Entity:configuredConstructable.fallbackImplementation.construct'),
        defaultConstructKey: Symbol('Entity:configuredConstructable.fallbackImplementation.defaultConstructKey'),
      },
      setter: {
        construct: Symbol('Entity:configuredConstructable.setter.construct'),
      },
      getter: {
        construct: Symbol('Entity:configuredConstructable.getter.construct'),
      },
    },

    clientInterface: {
      method: {
        construct: Symbol('Entity:clientInterface.method.construct'),
      },
      implementation: {
        construct: Symbol('Entity:clientInterface.implementation.construct'),
      },
      fallbackImplementation: {
        construct: Symbol('Entity:clientInterface.fallbackImplementation.construct'),
        defaultConstructKey: Symbol('Entity:clientInterface.fallbackImplementation.defaultConstructKey'),
      },
      setter: {
        construct: Symbol('Entity:clientInterface.setter.construct'),
      },
      getter: {
        construct: Symbol('Entity:clientInterface.getter.construct'),
      },
    },
  },
})

Object.assign(Entity.prototypeDelegation, {
  /**
   * Prototype Delegation
   */
  [Entity.reference.prototypeInstance.getter.prototypeDelegation](implementationKey: String) {
    return this[Entity.reference.prototypeInstance.implementation.prototypeDelegation][implementationKey]
  },
  [Entity.reference.prototypeInstance.setter.prototypeDelegation](implementation: Object) {
    this[Entity.reference.prototypeInstance.implementation.prototypeDelegation] ||= {}
    // set constractor property on prototype
    for (const key of Object.keys(implementation)) {
      implementation[key].constructor = this
    }
    Object.assign(this[Entity.reference.prototypeInstance.implementation.prototypeDelegation], implementation)
    return this
  },
  /**
   * Prototype instance
   */
  [Entity.reference.prototypeInstance.method.construct.instantiate](args = [], { implementationKey, instanceObject, prototypeDelegation, self = this }: { implementationKey: String } = {}) {
    implementationKey ||= self[Entity.reference.prototypeInstance.fallbackImplementation.instantiate]
    if (!implementationKey) throw new Error('• No implementation constructor key passed.')
    const implementationFunc = self[Entity.reference.prototypeInstance.getter.instantiate](implementationKey)
    return implementationFunc(args, { instanceObject, prototypeDelegation }) // redirect construct to particular implementation.
  },
  [Entity.reference.prototypeInstance.getter.instantiate](implementationKey: String) {
    return this[Entity.reference.prototypeInstance.implementation.instantiate][implementationKey]
  },
  [Entity.reference.prototypeInstance.setter.instantiate](implementation: Object) {
    this[Entity.reference.prototypeInstance.implementation.instantiate] ||= {}
    Object.assign(this[Entity.reference.prototypeInstance.implementation.instantiate], implementation)
    return this
  },
  [Entity.reference.prototypeInstance.method.construct.initialize](args = [], { implementationKey, instanceObject, self = this }: { implementationKey: String } = {}) {
    implementationKey ||= self[Entity.reference.prototypeInstance.fallbackImplementation.initialize]
    if (!implementationKey) throw new Error('• No implementation constructor key passed.')
    const implementationFunc = self[Entity.reference.prototypeInstance.getter.initialize](implementationKey)
    return implementationFunc(args, { instanceObject }) // redirect construct to particular implementation.
  },
  [Entity.reference.prototypeInstance.getter.initialize](implementationKey: String) {
    return this[Entity.reference.prototypeInstance.implementation.initialize][implementationKey]
  },
  [Entity.reference.prototypeInstance.setter.initialize](implementation: Object) {
    this[Entity.reference.prototypeInstance.implementation.initialize] ||= {}
    Object.assign(this[Entity.reference.prototypeInstance.implementation.initialize], implementation)
    return this
  },
  /**
   * Constructor instance
   * Config constructors - constructors that produce a configured constructable
   **/
  [Entity.reference.configuredConstructable.method.construct](args = [], { implementationKey, entityInstance, self = this } = {}) {
    implementationKey ||= self[Entity.reference.configuredConstructable.fallbackImplementation.construct]
    if (!implementationKey) throw new Error('• No implementation constructor key passed.')
    const implementationFunc = self[Entity.reference.configuredConstructable.getter.construct](implementationKey)
    return self::implementationFunc(args, { entityInstance })
  },
  [Entity.reference.configuredConstructable.getter.construct](implementationKey: String) {
    return this[Entity.reference.configuredConstructable.implementation.construct][implementationKey]
  },
  [Entity.reference.configuredConstructable.setter.construct](implementation: Object) {
    this[Entity.reference.configuredConstructable.implementation.construct] ||= {}
    Object.assign(this[Entity.reference.configuredConstructable.implementation.construct], implementation)
    return this
  },
  [Entity.reference.configuredConstructable.implementation.construct]: {
    [Entity.reference.configuredConstructable.fallbackImplementation.defaultConstructKey]([{ instantiateImplementationKey, initializeImplementationKey } = {}], { self = this, entityInstance } = {}) {
      // using function object as an instance allows to use `construct` & `apply` with Proxy.
      entityInstance ||= self[Entity.reference.prototypeInstance.method.construct.instantiate]([], { implementationKey: 'entityPrototype' })
      entityInstance[Entity.reference.prototypeInstance.fallbackImplementation.instantiate] = instantiateImplementationKey
      entityInstance[Entity.reference.prototypeInstance.fallbackImplementation.initialize] = initializeImplementationKey
      return entityInstance
    },
  },
  [Entity.reference.configuredConstructable.fallbackImplementation.construct]: Entity.reference.configuredConstructable.fallbackImplementation.defaultConstructKey,
  /**
   * Client Interface
   **/
  [Entity.reference.clientInterface.method.construct](args = [], { implementationKey, interfaceTarget, self = this }: { implementationKey: string } = {}) {
    implementationKey ||= self[Entity.reference.clientInterface.fallbackImplementation.construct]
    // Allows for configuring constructable target recursively.
    if (!implementationKey) throw new Error('• No implementation constructor key passed.')
    const implementationFunc = self[Entity.reference.clientInterface.getter.construct](implementationKey)
    return self::implementationFunc(args, { interfaceTarget })
  },
  [Entity.reference.clientInterface.getter.construct](implementationKey: String) {
    return this[Entity.reference.clientInterface.implementation.construct][implementationKey]
  },
  [Entity.reference.clientInterface.setter.construct](implementation: Object) {
    this[Entity.reference.clientInterface.implementation.construct] ||= {}
    Object.assign(this[Entity.reference.clientInterface.implementation.construct], implementation)
    return this
  },
  [Entity.reference.clientInterface.implementation.construct]: {
    [Entity.reference.clientInterface.fallbackImplementation.defaultConstructKey]([{ configuredConstructable }], { self = this, interfaceTarget } = {}) {
      interfaceTarget ||= self
      const proxiedTarget = new Proxy(
        function() {} || interfaceTarget,
        Object.assign({
          apply(target, thisArg, argumentList) {
            return self[Entity.reference.clientInterface.method.construct](argumentList)
          },
          construct(target, argumentList, proxiedTarget) {
            let instanceObject = configuredConstructable[Entity.reference.prototypeInstance.method.construct.instantiate]()
            configuredConstructable[Entity.reference.prototypeInstance.method.construct.initialize](argumentList, {
              instanceObject: instanceObject,
            })
            return instanceObject
          },
        }),
      )
      return proxiedTarget
    },
  },
  [Entity.reference.clientInterface.fallbackImplementation.construct]: Entity.reference.clientInterface.fallbackImplementation.defaultConstructKey,
})
