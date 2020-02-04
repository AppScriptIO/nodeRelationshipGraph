import assert from 'assert'
import { Entity, Constructable } from '@dependency/entity'
import { MultipleDelegation } from '@dependency/handlePrototypeDelegation'

/**
 ** Cache system for supporting different graph implementation and database adapters.
 */
export const { class: Cache, reference: Reference, constructablePrototype: Prototype, entityPrototype } = new Entity.clientInterface.constructableInstance({ label: 'Cache' })

Object.assign(Reference, {
  key: {
    defaultGroupKey: Symbol('Cache defaultGroupKey'),
    list: Symbol('Cache list'),
    getter: Symbol('Cache getter'),
    setter: Symbol('Cache setter'),
    getLength: Symbol('Cache getLength of cached items'),
    initializeGroup: Symbol('Cache initializeGroup'), // cache group
  },
})

const defaultGroupKey = Reference.key.defaultGroupKey
Object.assign(entityPrototype, {
  [Entity.$.key.concereteBehavior]({ targetInstance, concereteBehavior }) {
    MultipleDelegation.addDelegation({ targetObject: targetInstance, delegationList: [concereteBehavior] })
    return targetInstance
  },
  [Reference.key.getter](key, groupKey = defaultGroupKey) {
    if (!key) return this[Reference.key.list][groupKey] |> (map => [...map.values()]) // retrieve entire list group
    return this[Reference.key.list][groupKey].get(key) || undefined
  },
  [Reference.key.setter](key, value, groupKey = defaultGroupKey) {
    if (key === undefined || key === null) throw new Error('• Invalid key argument.')
    this[Reference.key.list][groupKey].set(key, value)
  },
  [Reference.key.getLength](groupKey = defaultGroupKey) {
    return this[Reference.key.list][groupKey].size
  },
  [Reference.key.initializeGroup](groupKey) {
    if (!this[Reference.key.list][groupKey]) this[Reference.key.list][groupKey] = new Map() // initialize an empty cache list
  },
})

Cache::Cache[Entity.$.initialize.setter]({
  // initialization for instance of Cache - i.e. a concrete behavior of Cache (an implemeantation)
  [Entity.$.key.handleDataInstance]({ targetInstance, data }) {
    let groupKeyArray = data.groupKeyArray || []
    targetInstance[Reference.key.list] = {} // initialize list
    for (let groupKey of groupKeyArray) {
      targetInstance::targetInstance[Reference.key.initializeGroup](groupKey)
    }
    targetInstance::targetInstance[Reference.key.initializeGroup](defaultGroupKey) // initialize default cache group
    return targetInstance
  },
})

Cache.clientInterface = Cache::Cache[Entity.$.clientInterface.switch](Entity.$.key.stateInstance)({ constructorImplementation: Entity.$.key.handleDataInstance })
