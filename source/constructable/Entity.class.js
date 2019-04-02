import { deepFreezePropertySymbol } from '../utility/deepObjectFreeze.js'

export const Entity = Object.create(null)

Object.assign(Entity, {
  self: Symbol('Entity'),
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
        instantiatePrototypeInstanceKey: Symbol('Entity:prototypeInstance.fallbackImplementation.instantiatePrototypeInstanceKey'),
        instantiateEntityInstanceKey: Symbol('Entity:prototypeInstance.fallbackImplementation.instantiateEntityInstanceKey'),
        prototypeDelegationInstance: Symbol('Entity:prototypeInstance.fallbackImplementation.prototypeDelegationInstance'),
        prototypeDelegationEntityClass: Symbol('Entity:prototypeInstance.fallbackImplementation.prototypeDelegationEntityClass'),
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
  nestedPropertyDelegatedLookup({ target, directProperty, nestedProperty }) {
    let value
    do {
      value = target[directProperty][nestedProperty]
      target = Object.getPrototypeOf(target)
    } while (!value && target != null)
    return value
  },
  mergeOwnNestedProperty({ target, ownProperty, value }) {
    if (!target.hasOwnProperty(ownProperty))
      Object.defineProperty(target, ownProperty, {
        value: {},
      })
    Object.assign(target[ownProperty], value)
    return target
  },
  createDelegatedObject({ delegationTarget = this } = {}) {
    return Object.create(delegationTarget)
  },
  createDelegatedFunction({ delegationTarget = this, description } = {}) {
    const createConstructable = new Function(
      `return function ${
        description // returns an anonymous function, that when called produces a named function.
      }(){
        throw new Error('• Construction should not be reached, rather the proxy wrapping it should deal with the construct handler.')
      }`,
    )

    let constructable = createConstructable()
    Object.setPrototypeOf(constructable, delegationTarget)
    return constructable
  },
  constructEntity({ description, target } = {}) {
    // target ||= Entity.createDelegatedFunction({ delegationTarget: Entity.prototypeDelegation, description }) // create instance based on function.
    target ||= Entity.createDelegatedObject({ delegationTarget: Entity.prototypeDelegation }) // create instance based on object.

    Object.assign(target, {
      self: Symbol(description),
      // get [Symbol.species]() {
      //   return GraphElement
      // },
      reference: Object.create(null),
      prototypeDelegation: Object.create(null),
    })
    target[Entity.reference.prototypeInstance.setter.prototypeDelegation]({
      [Entity.reference.prototypeInstance.fallbackImplementation.prototypeDelegationInstance]: target.prototypeDelegation,
      [Entity.reference.prototypeInstance.fallbackImplementation.prototypeDelegationEntityClass]: target,
    })
    return target
  },
})

Object.assign(Entity.prototypeDelegation, {
  /**
   * Prototype Delegation
   */
  [Entity.reference.prototypeInstance.getter.prototypeDelegation](implementationKey: String) {
    return Entity.nestedPropertyDelegatedLookup({
      target: this,
      directProperty: Entity.reference.prototypeInstance.implementation.prototypeDelegation,
      nestedProperty: implementationKey,
    })
  },
  [Entity.reference.prototypeInstance.setter.prototypeDelegation](implementation: Object) {
    // set constractor property on prototype
    for (const key of Object.keys(implementation)) {
      implementation[key].constructor = this
    }
    return Entity.mergeOwnNestedProperty({ target: this, ownProperty: Entity.reference.prototypeInstance.implementation.prototypeDelegation, value: implementation })
  },

  /**
   * Prototype instance
   */
  [Entity.reference.prototypeInstance.method.construct.instantiate](args = [], { implementationKey, instanceObject, prototypeDelegation, self = this }: { implementationKey: String } = {}) {
    implementationKey ||= self[Entity.reference.prototypeInstance.fallbackImplementation.instantiate]
    if (!implementationKey) throw new Error('• No implementation constructor key passed.')
    const implementationFunc = self[Entity.reference.prototypeInstance.getter.instantiate](implementationKey)
    return self::implementationFunc(args, { instanceObject, prototypeDelegation }) // redirect construct to particular implementation.
  },
  [Entity.reference.prototypeInstance.getter.instantiate](implementationKey: String) {
    return Entity.nestedPropertyDelegatedLookup({
      target: this,
      directProperty: Entity.reference.prototypeInstance.implementation.instantiate,
      nestedProperty: implementationKey,
    })
  },
  [Entity.reference.prototypeInstance.setter.instantiate](implementation: Object) {
    return Entity.mergeOwnNestedProperty({ target: this, ownProperty: Entity.reference.prototypeInstance.implementation.instantiate, value: implementation })
  },
  [Entity.reference.prototypeInstance.implementation.instantiate]: {
    [Entity.reference.prototypeInstance.fallbackImplementation.instantiatePrototypeInstanceKey]({ instanceObject, prototypeDelegation, self = this } = {}) {
      prototypeDelegation ||= self[Entity.reference.prototypeInstance.getter.prototypeDelegation](Entity.reference.prototypeInstance.fallbackImplementation.prototypeDelegationInstance)
      instanceObject ||= Object.create(prototypeDelegation)
      return instanceObject
    },
    [Entity.reference.prototypeInstance.fallbackImplementation.instantiateEntityInstanceKey]({ instanceObject, prototypeDelegation, self = this }) {
      prototypeDelegation ||= self[Entity.reference.prototypeInstance.getter.prototypeDelegation](Entity.reference.prototypeInstance.fallbackImplementation.prototypeDelegationEntityClass)
      instanceObject ||= Object.create(prototypeDelegation)
      return instanceObject
    },
  },
  [Entity.reference.prototypeInstance.method.construct.initialize](args = [], { implementationKey, instanceObject, self = this }: { implementationKey: String } = {}) {
    implementationKey ||= self[Entity.reference.prototypeInstance.fallbackImplementation.initialize]
    if (!implementationKey) throw new Error('• No implementation constructor key passed.')
    const implementationFunc = self[Entity.reference.prototypeInstance.getter.initialize](implementationKey)
    return implementationFunc(args, { instanceObject }) // redirect construct to particular implementation.
  },
  [Entity.reference.prototypeInstance.getter.initialize](implementationKey: String) {
    return Entity.nestedPropertyDelegatedLookup({
      target: this,
      directProperty: Entity.reference.prototypeInstance.implementation.initialize,
      nestedProperty: implementationKey,
    })
  },
  [Entity.reference.prototypeInstance.setter.initialize](implementation: Object) {
    return Entity.mergeOwnNestedProperty({ target: this, ownProperty: Entity.reference.prototypeInstance.implementation.initialize, value: implementation })
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
    return Entity.nestedPropertyDelegatedLookup({
      target: this,
      directProperty: Entity.reference.configuredConstructable.implementation.construct,
      nestedProperty: implementationKey,
    })
  },
  [Entity.reference.configuredConstructable.setter.construct](implementation: Object) {
    return Entity.mergeOwnNestedProperty({ target: this, ownProperty: Entity.reference.configuredConstructable.implementation.construct, value: implementation })
  },
  [Entity.reference.configuredConstructable.implementation.construct]: {
    [Entity.reference.configuredConstructable.fallbackImplementation.defaultConstructKey]([{ instantiateImplementationKey, initializeImplementationKey } = {}], { self = this, entityInstance } = {}) {
      // using function object as an instance allows to use `construct` & `apply` with Proxy.
      entityInstance ||= self[Entity.reference.prototypeInstance.method.construct.instantiate]([], {
        implementationKey: Entity.reference.prototypeInstance.fallbackImplementation.instantiateEntityInstanceKey,
      })
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
    return Entity.nestedPropertyDelegatedLookup({
      target: this,
      directProperty: Entity.reference.clientInterface.implementation.construct,
      nestedProperty: implementationKey,
    })
  },
  [Entity.reference.clientInterface.setter.construct](implementation: Object) {
    return Entity.mergeOwnNestedProperty({ target: this, ownProperty: Entity.reference.clientInterface.implementation.construct, value: implementation })
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

// prevent accidental manipulation of delegated prototype
deepFreezePropertySymbol(Entity.prototypeDelegation)
