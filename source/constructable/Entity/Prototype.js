import { deepFreeze } from '../../utility/deepObjectFreeze.js'
import { Reference } from './Reference.js'
const GeneratorFunction = function*() {}.constructor,
  isGeneratorFunction = value => {
    if (typeof value !== 'function') {
      return false
    }
    return (value.constructor && value.constructor.name === 'GeneratorFunction') || toString.call(value) === '[object GeneratorFunction]'
    // another way is to check for iterator symbol `if(func[Symbol.iterator])`
  }
/**
 * Generators pattern
 * @param executionType - in a generator the first next(<argument>) call argument, catched using `function.sent`
 **/
const shouldHandOverControl = executionType => {
  switch (executionType) {
    case 'intermittent':
      return true
    default:
    case 'complete':
      return false
  }
}
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
const createSwitchGeneratorFunction = function({ fallbackSymbol, implementationListSymbol }) {
  return function*({ implementationKey, self = this }: { implementationKey: String } = {}) {
    implementationKey ||= self[fallbackSymbol]
    const implementation = {
      func: self[implementationListSymbol](implementationKey) || throw new Error(`• No implementation constructor found for key ${implementationKey}`),
      passThroughArg: {},
    }

    if (shouldHandOverControl(function.sent)) implementation.passThroughArg = yield implementation.passThroughArg

    // redirect construct to particular implementation using specific execution depending of function type.
    if (isGeneratorFunction(implementation.func)) {
      let result = self::implementation.func(implementation.passThroughArg)
      // generator function when conforming to iterable protocol.
      return result.next('complete').value
    } else {
      return self::implementation.func(implementation.passThroughArg)
    }
  }
}
const createConstructableWithoutContructor = description => {
  // returns an anonymous function, that when called produces a named function.
  return new Function(`return function ${description}(){ throw new Error('• Construction should not be reached, rather the proxy wrapping it should deal with the construct handler.') }`)
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
  [Reference.instance.instantiate.switch]: createSwitchGeneratorFunction({
    fallbackSymbol: Reference.instance.instantiate.fallback,
    implementationListSymbol: Reference.instance.instantiate.getter.list,
  }),
  [Reference.instance.instantiate.list]: {},

  /**
   * instance - initialize
   */
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
  [Reference.instance.initialize.switch]: createSwitchGeneratorFunction({
    fallbackSymbol: Reference.instance.initialize.fallback,
    implementationListSymbol: Reference.instance.initialize.getter.list,
  }),
  [Reference.instance.initialize.list]: {},

  /**
   * configuredConstructable
   **/
  [Reference.configuredConstructable.setter.list](implementation: Object) {
    return mergeOwnNestedProperty({ target: this, ownProperty: Reference.configuredConstructable.switch, value: implementation })
  },
  [Reference.configuredConstructable.getter.list](implementationKey: String) {
    return nestedPropertyDelegatedLookup({
      target: this,
      directProperty: Reference.configuredConstructable.list,
      nestedProperty: implementationKey,
    })
  },
  [Reference.configuredConstructable.switch]: createSwitchGeneratorFunction({
    fallbackSymbol: Reference.configuredConstructable.fallback,
    implementationListSymbol: Reference.configuredConstructable.getter.list,
  }),
  [Reference.configuredConstructable.fallback]: Reference.configuredConstructable.key.constructable,
  [Reference.configuredConstructable.list]: {},

  /**
   * clientInterface
   **/
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
  [Reference.clientInterface.switch]: createSwitchGeneratorFunction({
    fallbackSymbol: Reference.clientInterface.fallback,
    implementationListSymbol: Reference.clientInterface.getter.list,
  }),
  [Reference.clientInterface.fallback]: Reference.clientInterface.key.prototypeConstruct,
  [Reference.clientInterface.list]: {},
})

Prototype[Reference.instance.instantiate.list]
  |> (_ =>
    Object.assign(_, {
      [Reference.instance.instantiate.key.prototypeObjectInstance]({
        instanceObject,
        prototypeDelegation,
        instancePrototypeSymbol = Reference.prototypeDelegation.key.entityPrototype,
        constructorPrototypeSymbol = Reference.prototypeDelegation.key.entityClass,
        self = this,
      } = {}) {
        prototypeDelegation ||= self[Reference.prototypeDelegation.getter.list](instancePrototypeSymbol)
        instanceObject ||= Object.create(prototypeDelegation)
        instanceObject.constructor = self[Reference.prototypeDelegation.getter.list](constructorPrototypeSymbol)
        return instanceObject
      },
      [Reference.instance.instantiate.key.configuredConstructableInstance]([], { instanceObject, prototypeDelegation, self = this }) {
        prototypeDelegation ||= self
        instanceObject ||= Object.create(prototypeDelegation)
        instanceObject.constructor = self
        return instanceObject
      },
      [Reference.instance.instantiate.key.entityObjectInstance]({
        instanceObject,
        prototypeDelegation,
        instancePrototypeSymbol = Reference.prototypeDelegation.key.entityPrototype,
        constructorPrototypeSymbol = Reference.prototypeDelegation.key.entityClass,
        self = this,
      }) {
        prototypeDelegation ||= self[Reference.prototypeDelegation.getter.list](instancePrototypeSymbol)
        instanceObject ||= Object.create(prototypeDelegation)
        instanceObject.constructor = self[Reference.prototypeDelegation.getter.list](constructorPrototypeSymbol)
        return instanceObject
      },
      [Reference.instance.instantiate.key.prototypeFunctionInstance]({
        description,
        instanceObject,
        prototypeDelegation,
        instancePrototypeSymbol = Reference.prototypeDelegation.key.entityPrototype,
        constructorPrototypeSymbol = Reference.prototypeDelegation.key.entityClass,
        self = this,
      }) {
        prototypeDelegation ||= self[Reference.prototypeDelegation.getter.list](instancePrototypeSymbol)
        instanceObject ||= createConstructableWithoutContructor(description)
        Object.setPrototypeOf(instanceObject, prototypeDelegation)
        instanceObject.constructor = self[Reference.prototypeDelegation.getter.list](constructorPrototypeSymbol)
        return instanceObject
      },
      [Reference.instance.instantiate.key.entityFunctionInstance]({
        description,
        instanceObject,
        prototypeDelegation,
        instancePrototypeSymbol = Reference.prototypeDelegation.key.entityPrototype,
        constructorPrototypeSymbol = Reference.prototypeDelegation.key.entityClass,
        self = this,
      }) {
        prototypeDelegation ||= self[Reference.prototypeDelegation.getter.list](instancePrototypeSymbol)
        instanceObject ||= createConstructableWithoutContructor(description)
        Object.setPrototypeOf(instanceObject, prototypeDelegation)
        instanceObject.constructor = self[Reference.prototypeDelegation.getter.list](constructorPrototypeSymbol)
        return instanceObject
      },
    }))

Prototype[Reference.instance.initialize.list]
  |> (_ =>
    Object.assign(_, {
      [Reference.instance.initialize.key.data]([{ data }], { instanceObject, self = this } = {}) {
        Object.assign(instanceObject, data) // apply data to instance
        return instanceObject
      },
      [Reference.instance.initialize.key.entityInstance]({ description, instanceObject } = {}) {
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
        instanceObject[Reference.prototypeDelegation.setter.list]({
          [Reference.prototypeDelegation.key.entityPrototype]: instanceObject.prototypeDelegation,
          [Reference.prototypeDelegation.key.entityClass]: instanceObject,
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
    }))

Prototype[Reference.configuredConstructable.list]
  |> (_ =>
    Object.assign(_, {
      [Reference.configuredConstructable.key.constructable]: function*({ description, instantiateFallback, iinitializeFallback, self = this, entityInstance } = {}) {
        const handOverControl = shouldHandOverControl(function.sent)

        if (!entityInstance) {
          let instantiate = {
            func: self::self[Reference.instance.instantiate.switch]({ implementationKey: Reference.instance.instantiate.key.entityObjectInstance }),
            passThroughArg: { description, prototypeDelegation: self },
          }
          if (handOverControl) instantiate.passThroughArg = yield instantiate.passThroughArg
          entityInstance =
            instantiate.func
            |> (g => {
              g.next('intermittent')
              return g.next(instantiate.passThroughArg).value
            })

          let initialize = {
            func: entityInstance::self[Reference.instance.initialize.switch]({ implementationKey: Reference.instance.initialize.key.entityInstance }),
            passThroughArg: { description, prototypeDelegation: self },
          }
          if (handOverControl) initialize.passThroughArg = yield initialize.passThroughArg
          initialize.func
            |> (g => {
              g.next('intermittent')
              return g.next(Object.assign({ instanceObject: entityInstance }, initialize.passThroughArg)).value
            })
        }

        entityInstance[Reference.instance.instantiate.fallback] = instantiateFallback
        entityInstance[Reference.instance.initialize.fallback] = iinitializeFallback
        return entityInstance
      },
    }))

Prototype[Reference.clientInterface.list]
  |> (_ =>
    Object.assign(_, {
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
    }))

// prevent accidental manipulation of delegated prototype
deepFreeze({ object: Prototype, getPropertyImplementation: Object.getOwnPropertySymbols })
