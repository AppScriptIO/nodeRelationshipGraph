import assert from 'assert'
import { Entity, Constructable } from '@dependency/entity'
import { MultipleDelegation } from '@dependency/handlePrototypeDelegation'

/**
 * Context is responsible for creating a grouping context - where information could be shared between instances of some class that belong/inherit the context.
 */
const { class: Class, reference: $ } = new Entity.clientInterface.constructableInstance({ label: 'Context' })

Object.assign($, {
  key: {
    setter: Symbol('Context.setter'),
  },
})

Class::Class[$.prototypeDelegation.getter](Entity.$.key.stateInstance).instancePrototype
  |> (prototype =>
    Object.assign(prototype, {
      //  concerete behavior initialization on the target instance.
      [Entity.$.key.concereteBehavior]({ targetInstance }, { concereteBehavior }) {
        // add to prototype delegation
        MultipleDelegation.addDelegation({ targetObject: targetInstance, delegationList: [concereteBehavior] })
        return targetInstance
      },

      [$.key.setter](contextObject = {}) {
        assert(typeof contextObject == 'object', '• contextObject must be an object.')
        Object.assign(this, contextObject)
      },
    }))

Class::Class[$.prototypeDelegation.getter](Constructable.$.key.constructableInstance).instancePrototype
  |> (prototype => {
    Class::prototype[Entity.$.initialize.setter]({
      [Entity.$.key.handleDataInstance]({ targetInstance }, { data }) {
        targetInstance[$.key.setter](data)
        return targetInstance
      },
    })
  })

const clientInterface = Class::Class[Entity.$.clientInterface.switch](Entity.$.key.stateInstance)({ constructorImplementation: Entity.$.key.handleDataInstance })

export { Class as class, $, clientInterface }
