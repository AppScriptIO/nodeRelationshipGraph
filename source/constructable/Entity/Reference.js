import { deepFreeze } from '../../utility/deepObjectFreeze.js'

/**
 * ProgrammaticAPIReference for the target extedning object to use. Entity api reference
 * switch - function that redirects to an implementation.
 * list - object holding the implementations.
 * key - built-in implementations keys.
 * getter/setter - functions for implementation lookup and addition.
 **/
export const Reference = {
  prototypeDelegation: {
    setter: {
      list: Symbol('Entity:prototypeDelegation.setter.list'),
    },
    getter: {
      list: Symbol('Entity:prototypeDelegation.getter.list'),
    },
    list: Symbol('Entity:prototypeDelegation.list'),
    key: {
      entityPrototype: Symbol('Entity:prototypeDelegation.key.entityPrototype'),
      entityClass: Symbol('Entity:prototypeDelegation.key.entityClass'),
    },
  },

  instance: {
    instantiate: {
      switch: Symbol('Entity:instance.instantiate.switch'),
      setter: {
        list: Symbol('Entity:instance.instantiate.setter.list'),
      },
      getter: {
        list: Symbol('Entity:instance.instantiate.getter.list'),
      },
      fallback: Symbol('Entity:instance.instantiate.fallback'),
      list: Symbol('Entity:instance.instantiate.list'),
      key: {
        prototype: Symbol('Entity:instance.instantiate.key.prototype'),
        prototypeInstance: Symbol('Entity:instance.instantiate.key.prototypeInstance'),
        entityObjectInstance: Symbol('Entity:instance.instantiate.key.entityObjectInstance'),
        entityFunctionInstance: Symbol('Entity:instance.instantiate.key.entityFunctionInstance'),
        configuredConstructableInstance: Symbol('Entity:instance.instantiate.key.configuredConstructableInstance'),
      },
    },
    initialize: {
      switch: Symbol('Entity:instance.initialize.switch'),
      setter: {
        list: Symbol('Entity:instance.initialize.setter.list'),
      },
      getter: {
        list: Symbol('Entity:instance.initialize.getter.list'),
      },
      fallback: Symbol('Entity:instance.initialize.fallback'),
      list: Symbol('Entity:instance.initialize.list'),
      key: {
        data: Symbol('Entity:instance.initialize.key.data'),
        entityInstance: Symbol('Entity:instance.initialize.key.entityInstance'),
        toplevelEntityInstance: Symbol('Entity:instance.initialize.key.toplevelEntityInstance'),
        configurableConstructor: Symbol('Entity:instance.initialize.key.configurableConstructor'),
      },
    },
  },

  configuredConstructable: {
    switch: Symbol('Entity:configuredConstructable.switch'),
    setter: {
      list: Symbol('Entity:configuredConstructable.setter.list'),
    },
    getter: {
      list: Symbol('Entity:configuredConstructable.getter.list'),
    },
    fallback: Symbol('Entity:configuredConstructable.fallback'),
    list: Symbol('Entity:configuredConstructable.list'),
    key: {
      constructable: Symbol('Entity:configuredConstructable.key.constructable'),
      toplevelConstructable: Symbol('Entity:configuredConstructable.key.toplevelConstructable'),
    },
  },

  clientInterface: {
    switch: Symbol('Entity:clientInterface.switch'),
    setter: {
      list: Symbol('Entity:clientInterface.setter.list'),
    },
    getter: {
      list: Symbol('Entity:clientInterface.getter.list'),
    },
    fallback: Symbol('Entity:clientInterface.fallback'),
    list: Symbol('Entity:clientInterface.list'),
    key: {
      entityConstruct: Symbol('Entity:clientInterface.key.entityConstruct'),
      prototypeConstruct: Symbol('Entity:clientInterface.key.prototypeConstruct'),
    },
  },
}

deepFreeze({ object: Reference, getPropertyImplementation: Object.getOwnPropertyNames })
