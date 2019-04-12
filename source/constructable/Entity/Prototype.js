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
 * Note about `propagation` of contorl - cannot use `yield*` techniques because - as it will call next without arguments implicitly. Therefore propagating in this way won't work, as dealing with uncontrolled next call isn't possible.
 **/
const executionControl = {
  shouldHandOver: (executionType: Array | String) => {
    if (!Array.isArray(executionType)) executionType = [executionType]
    switch (true) {
      case executionType.includes('intermittent'):
      case executionType.includes('propagate'):
        return true
        break
      default:
      case executionType.includes('complete'):
        return false
    }
  },
  shouldPropagate: (executionType: Array | String) => {
    if (!Array.isArray(executionType)) executionType = [executionType]
    switch (true) {
      case executionType.includes('propagate'):
        return true
        break
      default:
      case executionType.includes('intermittent'):
      case executionType.includes('complete'):
        return false
    }
  },
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
const mergeNonexistentProperties = (targetObject, defaultValue: Object) => {
  Object.entries(defaultValue).forEach(([key, value]) => {
    if (!Object.prototype.hasOwnProperty.call(targetObject, key)) Object.defineProperty(targetObject, key, { value, writable: true, enumerable: true })
  })
}
const createSwitchGeneratorFunction = function({ fallbackSymbol, implementationListSymbol }) {
  return function*({ implementationKey, self = this }: { implementationKey: String } = {}) {
    const controlArg = function.sent
    implementationKey ||= self[fallbackSymbol]
    const implementation = {
      func: self[implementationListSymbol](implementationKey) || throw new Error(`• No implementation constructor found for key ${implementationKey}`),
      passThroughArg: {},
    }
    if (executionControl.shouldHandOver(controlArg)) {
      implementation.passThroughArg = yield implementation.passThroughArg
    }

    // redirect construct to particular implementation using specific execution depending of function type.
    if (isGeneratorFunction(implementation.func)) {
      if (executionControl.shouldPropagate(controlArg)) {
        return self::implementation.func(implementation.passThroughArg)
      } else {
        return self::implementation.func(implementation.passThroughArg) |> (g => g.next('complete').value)
      }
    } else {
      return self::implementation.func(implementation.passThroughArg)
    }
  }
}
const createConstructableWithoutContructor = description => {
  // returns an anonymous function, that when called produces a named function.
  return new Function(`return function ${description}(){ throw new Error('• Construction should not be reached, rather the proxy wrapping it should deal with the construct handler.') }`)
}

export const Prototype = Object.create(null, {
  metadata: {
    // debugging purposes.
    writable: false,
    enumerable: false,
    value: { self: Symbol('Top-level Prototype') },
  },
})
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
  [Reference.prototypeDelegation.list]: {},

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
    return mergeOwnNestedProperty({ target: this, ownProperty: Reference.configuredConstructable.list, value: implementation })
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
  [Reference.clientInterface.setter.list](implementation: Object) {
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
      [Reference.instance.instantiate.key.prototype]({
        instanceObject,
        prototypeDelegation,
        instancePrototypeSymbol,
        constructorPrototypeSymbol,
        self = this,
        objectType,
        description,
      }: {
        objectType: 'object' | 'function',
      }) {
        prototypeDelegation ||= self[Reference.prototypeDelegation.getter.list](instancePrototypeSymbol)
        switch (objectType) {
          case 'function':
            instanceObject ||= createConstructableWithoutContructor(description)
            instanceObject |> Object.setPrototypeOf(prototypeDelegation)
            break
          case 'object':
          default:
            instanceObject ||= Object.create(prototypeDelegation)
            break
        }
        instanceObject.constructor = self[Reference.prototypeDelegation.getter.list](constructorPrototypeSymbol)
        return instanceObject
      },
      [Reference.instance.instantiate.key.configuredConstructableInstance]([], { instanceObject, prototypeDelegation, self = this }) {
        prototypeDelegation ||= self
        instanceObject ||= Object.create(prototypeDelegation)
        instanceObject.constructor = self
        return instanceObject
      },
      [Reference.instance.instantiate.key.prototypeObjectInstance]() {
        let args = arguments[0]
        let implementationFunc = Prototype[Reference.instance.instantiate.getter.list](Reference.instance.instantiate.key.prototype)
        let instance = this::implementationFunc(
          Object.assign(args, {
            instancePrototypeSymbol: Reference.prototypeDelegation.key.entityPrototype,
            constructorPrototypeSymbol: Reference.prototypeDelegation.key.entityClass,
            objectType: 'object',
          }),
        )
        return instance
      },
      [Reference.instance.instantiate.key.prototypeFunctionInstance]() {
        let args = arguments[0]
        let implementationFunc = Prototype[Reference.instance.instantiate.getter.list](Reference.instance.instantiate.key.prototype)
        return this::implementationFunc(
          Object.assign(args, {
            instancePrototypeSymbol: Reference.prototypeDelegation.key.entityPrototype,
            constructorPrototypeSymbol: Reference.prototypeDelegation.key.entityClass,
            objectType: 'function',
          }),
        )
      },
      [Reference.instance.instantiate.key.entityObjectInstance]() {
        let args = arguments[0]
        let implementationFunc = Prototype[Reference.instance.instantiate.getter.list](Reference.instance.instantiate.key.prototype)
        return this::implementationFunc(Object.assign(args, { objectType: 'object' }))
      },
      [Reference.instance.instantiate.key.entityFunctionInstance]() {
        let args = arguments[0]
        let implementationFunc = Prototype[Reference.instance.instantiate.getter.list](Reference.instance.instantiate.key.prototype)
        return this::implementationFunc(
          Object.assign(args, {
            instancePrototypeSymbol: Reference.prototypeDelegation.key.entityPrototype,
            constructorPrototypeSymbol: Reference.prototypeDelegation.key.entityClass,
            objectType: 'function',
          }),
        )
      },
    }))

Prototype[Reference.instance.initialize.list]
  |> (_ =>
    Object.assign(_, {
      [Reference.instance.initialize.key.data]({ data, instanceObject, self = this } = {}) {
        Object.assign(instanceObject, data) // apply data to instance
        return instanceObject
      },
      [Reference.instance.initialize.key.configurableConstructor]({ description, instanceObject } = {}) {
        mergeNonexistentProperties(instanceObject, {
          self: Symbol(description),
        })
        return instanceObject
      },
      [Reference.instance.initialize.key.entityInstance]({ description, instanceObject, reference, prototypeDelegation } = {}) {
        mergeNonexistentProperties(instanceObject, {
          // set properties only if they do not exist on the target object.
          self: Symbol(description),
          // get [Symbol.species]() {
          //   return GraphElement
          // },
          reference: reference || Object.create(null),
          prototypeDelegation: prototypeDelegation || Object.create(instanceObject |> Object.getPrototypeOf), // Entities prototypes delegate to each other.
        })
        instanceObject[Reference.prototypeDelegation.setter.list]({
          [Reference.prototypeDelegation.key.entityPrototype]: instanceObject.prototypeDelegation,
          [Reference.prototypeDelegation.key.entityClass]: instanceObject,
        })
        return instanceObject
      },
      [Reference.instance.initialize.key.toplevelEntityInstance]({ description, instanceObject } = {}) {
        let implementationFunc = Prototype[Reference.instance.initialize.getter.list](Reference.instance.initialize.key.entityInstance)
        return this::implementationFunc({
          instanceObject,
          description,
          reference: Reference,
          prototypeDelegation: Prototype,
        })
      },
    }))

Prototype[Reference.configuredConstructable.list]
  |> (_ =>
    Object.assign(_, {
      [Reference.configuredConstructable.key.constructable]: function*({
        description,
        instantiateFallback,
        initializeFallback,
        self = this,
        entityInstance,
        instantiateSwitchSymbol,
        initializeSwitchSymbol,
      } = {}) {
        const shouldHandOverControl = executionControl.shouldHandOver(function.sent)
        const step = [
          {
            passThroughArg: { description },
            func: function(previousArg, arg) {
              let instance =
                self::self[Reference.instance.instantiate.switch]({ implementationKey: instantiateSwitchSymbol })
                |> (g => {
                  g.next('intermittent')
                  return g.next(arg).value
                })
              return { instance }
            },
            condition: !Boolean(entityInstance),
          },
          {
            passThroughArg: { description },
            func: function({ instance }, arg) {
              instance::self[Reference.instance.initialize.switch]({ implementationKey: initializeSwitchSymbol })
                |> (g => {
                  g.next('intermittent')
                  return g.next(Object.assign({ instanceObject: instance }, arg)).value
                })
              return instance
            },
            condition: !Boolean(entityInstance),
          },
        ]

        // Run chain of step functions
        let i = 0,
          result
        while (i < step.length) {
          if (step[i].condition && !step[i].condition) {
            i++
            continue
          }
          if (shouldHandOverControl) {
            yield step[i].passThroughArg
            result = step[i].func(result, function.sent)
          } else {
            result = step[i].func(result, step[i].passThroughArg)
          }
          i++
        }
        entityInstance ||= result
        entityInstance[Reference.instance.instantiate.fallback] = instantiateFallback
        entityInstance[Reference.instance.initialize.fallback] = initializeFallback
        return entityInstance
      },
      [Reference.configuredConstructable.key.toplevelConstructable]: function({ description = 'ToplevelConstructable', prototypeDelegation = Prototype } = {}) {
        let implementationFunc = Prototype[Reference.configuredConstructable.getter.list](Reference.configuredConstructable.key.constructable)
        let entityInstance =
          this::implementationFunc({
            description: description,
            instantiateFallback: Reference.instance.instantiate.key.prototypeObjectInstance,
            initializeFallback: Reference.instance.initialize.key.toplevelEntityInstance,
            instantiateSwitchSymbol: Reference.instance.instantiate.key.entityObjectInstance,
            initializeSwitchSymbol: Reference.instance.initialize.key.entityInstance,
          })
          |> (iterateConstructable => {
            let instantiateArg = iterateConstructable.next('intermittent').value
            let initializeArg = iterateConstructable.next(Object.assign(instantiateArg, { prototypeDelegation: Prototype })).value
            return iterateConstructable.next(Object.assign(initializeArg, { prototypeDelegation })).value
          })
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
