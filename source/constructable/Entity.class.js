function extendSymbol(targetObject, symbolObject) {
  Object.assign(targetObject, symbolObject)
}

export const Entity = {
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
      construct: Symbol('Entity:prototypeInstance.construct'),
      implementation: Symbol('Entity:prototypeInstance.implementation'),
      setter: {
        implementation: Symbol('Entity:prototypeInstance.setter.implementation'),
      },
      getter: {
        implementation: Symbol('Entity:prototypeInstance.getter.implementation'),
      },
    },

    configuredConstructable: {
      construct: Symbol('Entity:configuredConstructable.construct'),
      implementation: Symbol('Entity:configuredConstructable.implementation'),
      setter: {
        implementation: Symbol('Entity:configuredConstructable.setter.implementation'),
      },
      getter: {
        implementation: Symbol('Entity:configuredConstructable.getter.implementation'),
      },
    },

    clientInterface: {
      construct: Symbol('Entity:clientInterface.construct'),
      implementation: Symbol('Entity:clientInterface.implementation'),
      setter: {
        implementation: Symbol('Entity:clientInterface.setter.implementation'),
      },
      getter: {
        implementation: Symbol('Entity:clientInterface.getter.implementation'),
      },
    },
  },
}

/**
 * Prototype instance
 */
Object.assign(Entity.prototypeDelegation, {
  [Entity.reference.prototypeInstance.construct](args = [], { implementationKey, instanceObject, self = this }: { implementationKey: String } = {}) {
    // instanceObject ||= self.createDelegatedObject()
    // instanceObject.plugin = args[0]
    if (!implementationKey) throw new Error('• No implementation constructor key passed.')
    const implementationFunc = self[Entity.reference.prototypeInstance.getter.implementation](implementationKey)
    return self::implementationFunc(args, { instanceObject }) // redirect construct to particular implementation.
  },
  [Entity.reference.prototypeInstance.getter.implementation](implementationKey: String) {
    return this[Entity.reference.prototypeInstance.implementation][implementationKey]
  },
  [Entity.reference.prototypeInstance.setter.implementation](implementation: Object) {
    this[Entity.reference.prototypeInstance.implementation] ||= {}
    Object.assign(this[Entity.reference.prototypeInstance.implementation], implementation)
    return this
  },
})

/**
 * Constructor instance
 * Config constructors - constructors that produce a configured constructable
 **/
Object.assign(Entity.prototypeDelegation, {
  [Entity.reference.configuredConstructable.construct](args = [], { implementationKey, instanceObject, self = this } = {}) {
    // instanceObject ||= self::self.createDelegatedFunction() // function object as an instance allows to use `construct` & `apply` with Proxy.
    // instanceObject.plugin = args[0]
    if (!implementationKey) throw new Error('• No implementation constructor key passed.')
    const implementationFunc = self[Entity.reference.configuredConstructable.getter.implementation](implementationKey)
    return self::implementationFunc(args, { instanceObject })
  },
  [Entity.reference.configuredConstructable.getter.implementation](implementationKey: String) {
    return this[Entity.reference.configuredConstructable.implementation][implementationKey]
  },
  [Entity.reference.configuredConstructable.setter.implementation](implementation: Object) {
    this[Entity.reference.configuredConstructable.implementation] ||= {}
    Object.assign(this[Entity.reference.configuredConstructable.implementation], implementation)
    return this
  },
})

/**
 * Client Interface
 **/
Object.assign(Entity.prototypeDelegation, {
  [Entity.reference.clientInterface.construct]: function(args = [], { implementationKey, instanceObject, self = this }: { implementationKey: string } = {}) {
    instanceObject ||= self::self[Entity.reference.configuredConstructable.construct]([], { implementationKey: 'default' })
    // Allows for configuring constructable target recursively.
    if (!implementationKey) throw new Error('• No implementation constructor key passed.')
    const implementationFunc = self[Entity.reference.clientInterface.getter.implementation](implementationKey)
    return self::implementationFunc(args, { interfaceTarget: instanceObject })
  },
  [Entity.reference.clientInterface.getter.implementation](implementationKey: String) {
    return this[Entity.reference.clientInterface.implementation][implementationKey]
  },
  [Entity.reference.clientInterface.setter.implementation](implementation: Object) {
    this[Entity.reference.clientInterface.implementation] ||= {}
    Object.assign(this[Entity.reference.clientInterface.implementation], implementation)
    return this
  },
})
