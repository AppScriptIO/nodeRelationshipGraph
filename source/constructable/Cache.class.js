import assert from 'assert'
import { Entity, Constructable, symbol } from '@dependency/entity'
import { MultipleDelegation } from '@dependency/multiplePrototypeDelegation'

/**
 ** Cache system for supporting different graph implementation and database adapters.
 */
export const { class: Cache, reference: Reference, constructablePrototype: Prototype, entityPrototype } = new Entity.clientInterface({ description: 'Cache' })

Object.assign(Reference, {
  key: {
    list: Symbol('Cache list'),
    getter: Symbol('Cache getter'),
    setter: Symbol('Cache setter'),
    getLength: Symbol('Cache getLength of cached items'),
  },
})

/*
                   _        _                    ____       _                  _   _             
   _ __  _ __ ___ | |_ ___ | |_ _   _ _ __   ___|  _ \  ___| | ___  __ _  __ _| |_(_) ___  _ __  
  | '_ \| '__/ _ \| __/ _ \| __| | | | '_ \ / _ \ | | |/ _ \ |/ _ \/ _` |/ _` | __| |/ _ \| '_ \ 
  | |_) | | | (_) | || (_) | |_| |_| | |_) |  __/ |_| |  __/ |  __/ (_| | (_| | |_| | (_) | | | |
  | .__/|_|  \___/ \__\___/ \__|\__, | .__/ \___|____/ \___|_|\___|\__, |\__,_|\__|_|\___/|_| |_|
  |_|                           |___/|_|                           |___/                         
*/
Object.assign(entityPrototype, {
  [Entity.reference.key.concereteBehavior]({ constructorCallback, currentConcereteBehavior }) {
    return new Proxy(constructorCallback, {
      apply(target, thisArg, argumentList) {
        const { data } = argumentList[0]
        let instance = Reflect.apply(...arguments)
        MultipleDelegation.addDelegation({ targetObject: instance, delegationList: [currentConcereteBehavior] })
        return instance
      },
    })
  },
  [Reference.key.getter](key) {
    return this[Reference.key.list].get(key) || undefined
  },
  [Reference.key.setter](key, value) {
    if (key === undefined || key === null) throw new Error('• Invalid key argument.')
    this[Reference.key.list].set(key, value)
  },
  [Reference.key.getLength]() {
    return this[Reference.key.list].size
  },
})

/*
   ___       _ _   _       _ _         
  |_ _|_ __ (_) |_(_) __ _| (_)_______ 
   | || '_ \| | __| |/ _` | | |_  / _ \
   | || | | | | |_| | (_| | | |/ /  __/
  |___|_| |_|_|\__|_|\__,_|_|_/___\___|
*/
Cache::Cache[Constructable.reference.initialize.functionality].setter({
  // initialization for instance of Cache - i.e. a concrete behavior of Cache (an implemeantation)
  [Entity.reference.key.handleDataInstance]({ targetInstance, data }, previousResult /* in case multiple constructor function found and executed. */) {
    targetInstance[Cache.reference.key.list] = new Map() // initialize an empty cache list
    return targetInstance
  },
})

/*
    ____ _ _            _     _ _                    __                
   / ___| (_) ___ _ __ | |_  (_) |_ _ __   ___ _ __ / _| __ _  ___ ___ 
  | |   | | |/ _ \ '_ \| __| | | __| '_ \ / _ \ '__| |_ / _` |/ __/ _ \
  | |___| | |  __/ | | | |_  | | |_| | | |  __/ |  |  _| (_| | (_|  __/
   \____|_|_|\___|_| |_|\__| |_|\__|_| |_|\___|_|  |_|  \__,_|\___\___|
*/
Cache.clientInterface = Cache::Prototype[Constructable.reference.clientInterface.functionality].switch({
  implementationKey: Entity.reference.key.instanceDelegatingToEntityInstancePrototype,
})({
  constructorImplementation: Entity.reference.key.handleDataInstance,
})
