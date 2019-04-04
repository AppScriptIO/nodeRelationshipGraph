import { deepFreeze } from '../../utility/deepObjectFreeze.js'

const nestedPropertyDelegatedLookup = ({ target, directProperty, nestedProperty }) => {
  const hasOwnProperty = Object.prototype.hasOwnProperty // allows supporting objects delefating null.
  let value
  do {
    if (hasOwnProperty.call(target, directProperty) && hasOwnProperty.call(target[directProperty], nestedProperty)) value = target[directProperty][nestedProperty]
    target = Object.getPrototypeOf(target)
  } while (!value && target != null)
  return value
}
const mergeOwnNestedProperty = ({ target, ownProperty, value }) => {
  if (!Object.prototype.hasOwnProperty.call(target, ownProperty)) {
    Object.defineProperty(target, ownProperty, {
      enumerable: true,
      writable: true,
      value: {},
    })
  }
  Object.assign(target[ownProperty], value)
  return target
}
// set properties only if they do not exist on the target object.
const mergeNonexistentProperties = ({ defaultValue, targetObject }: { defaultValue: Object }) => {
  Object.entries(defaultValue).forEach(([key, value]) => {
    if (!Object.prototype.hasOwnProperty.call(targetObject, key)) Object.defineProperty(targetObject, key, { value, writable: true, enumerable: true })
  })
}

export const Prototype = Object.create(null)
Object.assign(Prototype, {
  /**
   * prototypeDelegation
   */
  [Reference.prototypeDelegation.setter.list](implementation: Object) {
    // set constractor property on prototype
    for (const key of Object.keys(implementation)) {
      implementation[key].constructor = this
    }
    return mergeOwnNestedProperty({
      target: this,
      ownProperty: Reference.prototypeDelegation.list,
      value: implementation,
    })
  },
  [Reference.prototypeDelegation.getter.list](implementationKey: String) {
    return nestedPropertyDelegatedLookup({
      target: this,
      directProperty: Reference.prototypeDelegation.list,
      nestedProperty: implementationKey,
    })
  },

  /**
   * instance - instantiate
   */
  [Reference.instance.instantiate.switch](args = [], { implementationKey, instanceObject, prototypeDelegation, self = this }: { implementationKey: String } = {}) {
    implementationKey ||= self[Reference.instance.instantiate.fallback]
    if (!implementationKey) throw new Error('• No implementation constructor key passed.')
    const implementationFunc = self[Reference.instance.instantiate.getter.list](implementationKey)
    return self::implementationFunc(args, { instanceObject, prototypeDelegation }) // redirect construct to particular implementation.
  },
  [Reference.instance.instantiate.setter.list](implementation: Object) {
    return mergeOwnNestedProperty({ target: this, ownProperty: Reference.instance.instantiate.list, value: implementation })
  },
  [Reference.instance.instantiate.getter.list](implementationKey: String) {
    return nestedPropertyDelegatedLookup({
      target: this,
      directProperty: Reference.instance.instantiate.list,
      nestedProperty: implementationKey,
    })
  },
  [Reference.instance.instantiate.list]: {
    [Reference.instance.instantiate.key.prototypeObjectInstance]([], { instanceObject, prototypeDelegation, self = this } = {}) {
      prototypeDelegation ||= self[Reference.prototypeDelegation.getter.list](Reference.prototypeDelegation.key.entityPrototype)
      instanceObject ||= Object.create(prototypeDelegation)
      instanceObject.constructor = self[Reference.prototypeDelegation.getter.list](Reference.prototypeDelegation.key.entityClass)
      return instanceObject
    },
    [Reference.instance.instantiate.key.prototypeFunctionInstance]([{ description }], { instanceObject, prototypeDelegation, self = this }) {
      const createConstructable = new Function(
        `return function ${
          description // returns an anonymous function, that when called produces a named function.
        }(){
          throw new Error('• Construction should not be reached, rather the proxy wrapping it should deal with the construct handler.')
        }`,
      )
      prototypeDelegation ||= self[Reference.prototypeDelegation.getter.list](Reference.prototypeDelegation.key.entityPrototype)
      instanceObject ||= createConstructable()
      Object.setPrototypeOf(instanceObject, prototypeDelegation)
      instanceObject.constructor = self[Reference.prototypeDelegation.getter.list](Reference.prototypeDelegation.key.entityClass)
      return instanceObject
    },
    [Reference.instance.instantiate.key.entityFunctionInstance]([{ description }], { instanceObject, prototypeDelegation, self = this }) {
      const createConstructable = new Function(
        `return function ${
          description // returns an anonymous function, that when called produces a named function.
        }(){
          throw new Error('• Construction should not be reached, rather the proxy wrapping it should deal with the construct handler.')
        }`,
      )
      prototypeDelegation ||= self[Reference.prototypeDelegation.getter.list](Reference.prototypeDelegation.key.entityPrototype)
      instanceObject ||= createConstructable()
      Object.setPrototypeOf(instanceObject, prototypeDelegation)
      instanceObject.constructor = self[Reference.prototypeDelegation.getter.list](Reference.prototypeDelegation.key.entityClass)
      return instanceObject
    },
    [Reference.instance.instantiate.key.entityObjectInstance]([], { instanceObject, prototypeDelegation, self = this }) {
      prototypeDelegation ||= self[Reference.prototypeDelegation.getter.list](Reference.prototypeDelegation.key.entityPrototype)
      instanceObject ||= Object.create(prototypeDelegation)
      instanceObject.constructor = self[Reference.prototypeDelegation.getter.list](Reference.prototypeDelegation.key.entityClass)
      return instanceObject
    },
    [Reference.instance.instantiate.key.configuredConstructableInstance]([], { instanceObject, prototypeDelegation, self = this }) {
      prototypeDelegation ||= self
      instanceObject ||= Object.create(prototypeDelegation)
      instanceObject.constructor = self
      return instanceObject
    },
  },

  /**
   * instance - initialize
   */
  [Reference.instance.initialize.switch](args = [], { implementationKey, instanceObject, self = this }: { implementationKey: String } = {}) {
    implementationKey ||= self[Reference.instance.initialize.fallback]
    if (!implementationKey) throw new Error('• No implementation constructor key passed.')
    const implementationFunc = self[Reference.instance.initialize.getter.list](implementationKey)
    if (true) {
      console.log(implementationKey)
      console.log(self[Reference.instance.initialize.list])
    }
    return self::implementationFunc(args, { instanceObject }) // redirect construct to particular implementation.
  },
  [Reference.instance.initialize.setter.list](implementation: Object) {
    return mergeOwnNestedProperty({ target: this, ownProperty: Reference.instance.initialize.list, value: implementation })
  },
  [Reference.instance.initialize.getter.list](implementationKey: String) {
    return nestedPropertyDelegatedLookup({
      target: this,
      directProperty: Reference.instance.initialize.list,
      nestedProperty: implementationKey,
    })
  },
  [Reference.instance.initialize.list]: {
    [Reference.instance.initialize.key.data]([{ data }], { instanceObject, self = this } = {}) {
      Object.assign(instanceObject, data) // apply data to instance
      return instanceObject
    },
    [Reference.instance.initialize.key.entityInstance]([{ description }], { instanceObject } = {}) {
      let entityPrototypeDelegationChain = instanceObject |> Object.getPrototypeOf
      mergeNonexistentProperties({
        defaultValue: {
          // set properties only if they do not exist on the target object.
          self: Symbol(description),
          // get [Symbol.species]() {
          //   return GraphElement
          // },
          reference: Object.create(null),
          prototypeDelegation: Object.create(entityPrototypeDelegationChain), // Entities prototypes delegate to each other.
        },
        targetObject: instanceObject,
      })
      instanceObject[Reference.prototypeInstance.setter.prototypeDelegation]({
        [Reference.Reference.prototypeDelegation.key.entityPrototype]: instanceObject.prototypeDelegation,
        [prototypeDelegation.key.entityClass]: instanceObject,
      })
      return instanceObject
    },
    [Reference.instance.initialize.key.configurableConstructor]([{ description }], { instanceObject } = {}) {
      mergeNonexistentProperties({
        defaultValue: {
          self: Symbol(description),
        },
        targetObject: instanceObject,
      })
      return instanceObject
    },
  },

  /**
   * configuredConstructable
   **/
  [Reference.configuredConstructable.switch](args = [], { implementationKey, entityInstance, self = this } = {}) {
    implementationKey ||= self[Reference.configuredConstructable.fallback]
    if (!implementationKey) throw new Error('• No implementation constructor key passed.')
    const implementationFunc = self[Reference.configuredConstructable.getter.list](implementationKey)
    return self::implementationFunc(args, { entityInstance })
  },
  [Reference.configuredConstructable.setter.list](implementation: Object) {
    return mergeOwnNestedProperty({ target: this, ownProperty: Reference.configuredConstructable.switch, value: implementation })
  },
  [Reference.configuredConstructable.getter.list](implementationKey: String) {
    return nestedPropertyDelegatedLookup({
      target: this,
      directProperty: Reference.configuredConstructable.switch,
      nestedProperty: implementationKey,
    })
  },
  [Reference.configuredConstructable.fallback]: Reference.configuredConstructable.key.constructable,
  [Reference.configuredConstructable.list]: {
    [Reference.configuredConstructable.key.constructable]([{ description, instantiateImplementationKey, initializeImplementationKey } = {}], { self = this, entityInstance } = {}) {
      // using function object as an instance allows to use `construct` & `apply` with Proxy.
      if (!entityInstance) {
        entityInstance = self[Reference.instance.instantiate.switch]([{ description }], {
          implementationKey: Reference.instance.instantiate.key.entityObjectInstance,
        })
        entityInstance[Reference.instance.initialize.switch]([{ description }], {
          instanceObject: entityInstance,
          implementationKey: Reference.instance.initialize.key.entityInstance,
        })
      }
      entityInstance[Reference.instance.instantiate.fallback] = instantiateImplementationKey
      entityInstance[Reference.instance.initialize.fallback] = initializeImplementationKey
      return entityInstance
    },
  },

  /**
   * clientInterface
   **/
  [Reference.clientInterface.switch](args = [], { implementationKey, interfaceTarget, self = this }: { implementationKey: string } = {}) {
    implementationKey ||= self[Reference.clientInterface.fallback]
    // Allows for configuring constructable target recursively.
    if (!implementationKey) throw new Error('• No implementation constructor key passed.')
    const implementationFunc = self[Reference.clientInterface.getter.list](implementationKey)
    return self::implementationFunc(args, { interfaceTarget })
  },
  [Reference.clientInterface.setter.construct](implementation: Object) {
    return mergeOwnNestedProperty({ target: this, ownProperty: Reference.clientInterface.list, value: implementation })
  },
  [Reference.clientInterface.getter.list](implementationKey: String) {
    return nestedPropertyDelegatedLookup({
      target: this,
      directProperty: Reference.clientInterface.list,
      nestedProperty: implementationKey,
    })
  },
  [Reference.clientInterface.fallback]: Reference.clientInterface.key.prototypeConstruct,
  [Reference.clientInterface.list]: {
    [Reference.clientInterface.key.prototypeConstruct]([{ configuredConstructable }], { self = this, interfaceTarget } = {}) {
      interfaceTarget ||= self
      const proxiedTarget = new Proxy(
        function() {} || interfaceTarget,
        Object.assign({
          apply(target, thisArg, argumentList) {
            return self[Reference.clientInterface.switch](argumentList)
          },
          construct(target, argumentList, proxiedTarget) {
            let instanceObject = configuredConstructable[Reference.instance.instantiate.switch]()
            configuredConstructable[Reference.instance.initialize.switch](argumentList, {
              instanceObject: instanceObject,
            })
            return instanceObject
          },
        }),
      )
      return proxiedTarget
    },
    [Reference.clientInterface.key.entityConstruct]([{ configuredConstructable }], { self = this, interfaceTarget } = {}) {
      interfaceTarget ||= self
      const proxiedTarget = new Proxy(
        function() {} || interfaceTarget,
        Object.assign({
          apply(target, thisArg, [[{ description } = {}] = []]) {
            //! move to configurable constructor
            let instance = self[Reference.instance.instantiate.switch]([], {
              implementationKey: Reference.instance.instantiate.key.configuredConstructableInstance,
            })
            self[Reference.instance.initialize.switch]([{ description }], {
              instanceObject: instance,
              implementationKey: Reference.instance.initialize.key.configurableConstructor,
            })

            return instance
          },
          construct(target, [{ description, instanceType }: { instanceType: 'object' | 'function' } = {}], proxiedTarget) {
            let instance
            switch (instanceType) {
              case 'function':
                instance = configuredConstructable[Reference.instance.instantiate.switch]([{ description }], {
                  implementationKey: Reference.instance.instantiate.key.entityFunctionInstance,
                })
                break
              case 'object':
                instance = configuredConstructable[Reference.instance.instantiate.switch]([], {
                  implementationKey: Reference.instance.instantiate.key.entityObjectInstance,
                })
                break
              default:
                throw new Error('• instanceType is not recognized as an option.')
                break
            }
            configuredConstructable[Reference.instance.initialize.switch]([{ description }], {
              instanceObject: instance,
            })
            return instance
          },
        }),
      )
      return proxiedTarget
    },
  },
})

// prevent accidental manipulation of delegated prototype
deepFreeze({ object: Prototype, getPropertyImplementation: Object.getOwnPropertySymbols })
