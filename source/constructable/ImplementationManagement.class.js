import assert from 'assert'
import { Entity, Constructable } from '@dependency/entity'
import { MultipleDelegation } from '@dependency/multiplePrototypeDelegation'

/**
 * Manages implementation list with ability to assign fallback value. i.e. set and retrieve an implementation or fallback to default.
 */
const { class: Class, reference: $ } = new Entity.clientInterface.constructableInstance({ label: 'ImplementationManagement' })

Object.assign($, {
  key: {
    list: Symbol('implementation.list'),
    getter: Symbol('implementation.getter'),
    setter: Symbol('implementation.setter'),
    fallback: Symbol('implementation.fallback'),
    fallbackSetter: Symbol('implementation.fallbackSetter'),
  },
})

// TODO: make registering multiple implementations for same function possible and providing a default fallback for a specific function in the implementation group. Currently this functionality is hard coded in the graph traversal function. E.g. Registering implemenations for each of "processNode", "nodeTraverse", "traversalImplementation", "aggregator", where each one will have several possible functions, if non is passed, a default fallback will be used as set in the concrete traversal instance.
Class::Class[$.prototypeDelegation.getter](Entity.$.key.stateInstance).instancePrototype
  |> (prototype =>
    Object.assign(prototype, {
      //  concerete behavior initialization on the target instance.
      [Entity.$.key.concereteBehavior]({ targetInstance }, { concereteBehavior /** state instance */ }) {
        MultipleDelegation.addDelegation({ targetObject: targetInstance, delegationList: [concereteBehavior] })
        return targetInstance
      },

      /** Register ImplementationManagement */
      [$.key.setter](implemeantationList, self = this) {
        self[$.key.list] ||= {}
        Object.assign(self[$.key.list], implemeantationList)
      },
      /**
       * Retrieve implementation according to parameter hierarchy (priority order) selection.
       * 1. Passed 'implementation' parameter.
       * 2. Default 'implementation' set in the fallback property.
       * 3. Fallback to first item in the implementation list.
       */
      [$.key.getter]({ implementation = null, self = this } = {}) {
        if (implementation) return self[$.key.list][implementation]

        let defaultImplementation = self[$.key.fallback]
        if (defaultImplementation) return self[$.key.list][defaultImplementation]

        let firstItemKey = Object.groupKeys(self[$.key.list])[0]
        return self[$.key.list][firstItemKey]
      },
      // set fallback value on own instance - this allows to overwrite the fallback from sub instances (that delegate to the concrete behavior).
      [$.key.fallbackSetter](implementationKey, self = this) {
        Object.defineProperty(self, $.key.fallback, {
          value: implementationKey,
        })
      },
    }))

Class::Class[$.prototypeDelegation.getter](Constructable.$.key.constructableInstance).instancePrototype
  |> (prototype => {
    prototype::prototype[Entity.$.initialize.setter]({
      /* Each concerete behavior can hold multiple implementations that can be used depending on requested parameters during execution. */
      [Entity.$.key.concereteBehavior]: function*({ targetInstance, callerClass = this }, { implementationList, defaultImplementation } /** `data` parameter used to merge data to instance */) {
        // super implementation should take care of setting the constructableDelegationSetting
        let { superCallback } = function.sent
        if (superCallback) targetInstance = callerClass::superCallback(...arguments) // call implementation higher in the hierarchy.

        targetInstance[$.key.setter](implementationList)
        if (defaultImplementation) targetInstance[$.key.fallback] = defaultImplementation
        return targetInstance
      },
    })
  })

// client interface for creating sub class instance delegating to the `Entity` & `Constructable` functionality chain + in addition to the ImplementationManagement delegation in both Construtable & Entity instance prototype.
const clientInterface = Class::Class[Entity.$.clientInterface.switch](Constructable.$.key.constructableInstance)({ constructorImplementation: Constructable.$.key.constructableInstance })

export { Class as class, $, clientInterface }
