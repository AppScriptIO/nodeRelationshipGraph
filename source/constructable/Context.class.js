import assert from 'assert'
import { Entity, Constructable, symbol } from '@dependency/entity'
import { MultipleDelegation } from '@dependency/multiplePrototypeDelegation'

/**
 * Context is responsible for creating a grouping context - where information could be shared between instances of some class that belong/inherit the context.
 */
export const { class: Context, reference: Reference, constructablePrototype: Prototype, entityPrototype } = new Entity.clientInterface({ description: 'Context' })

/*
   ____       __                                 ___     ____            _        _                    
  |  _ \ ___ / _| ___ _ __ ___ _ __   ___ ___   ( _ )   |  _ \ _ __ ___ | |_ ___ | |_ _   _ _ __   ___ 
  | |_) / _ \ |_ / _ \ '__/ _ \ '_ \ / __/ _ \  / _ \/\ | |_) | '__/ _ \| __/ _ \| __| | | | '_ \ / _ \
  |  _ <  __/  _|  __/ | |  __/ | | | (_|  __/ | (_>  < |  __/| | | (_) | || (_) | |_| |_| | |_) |  __/
  |_| \_\___|_|  \___|_|  \___|_| |_|\___\___|  \___/\/ |_|   |_|  \___/ \__\___/ \__|\__, | .__/ \___|
                                                                                      |___/|_|         
*/
Object.assign(Reference, {
  key: {
    // usage on instance `nodeInstance[Context.reference.key.sharedContext]`
    sharedContext: Symbol('Context.sharedContext'),
    getter: Symbol('Context.getter'),
    setter: Symbol('Context.setter'),
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
  //  concerete behavior initialization on the target instance.
  [Entity.reference.key.concereteBehavior]({ constructorCallback, currentConcereteBehavior }) {
    return new Proxy(constructorCallback, {
      apply(target, thisArg, [{ data }]) {
        let instance = Reflect.apply(...arguments)
        // add to prototype delegation
        MultipleDelegation.addDelegation({ targetObject: instance, delegationList: [currentConcereteBehavior] })
        return instance
      },
    })
  },

  [Reference.key.setter](contextObject = {}) {
    assert(typeof contextObject == 'object', '• contextObject must be an object.')
    this[Reference.key.sharedContext] ||= {}
    Object.assign(this[Reference.key.sharedContext], contextObject)
  },
  [Reference.key.getter]() {
    return this[Reference.key.sharedContext]
  },
})

/*
   _       _ _   _       _ _         
  (_)_ __ (_) |_(_) __ _| (_)_______ 
  | | '_ \| | __| |/ _` | | |_  / _ \
  | | | | | | |_| | (_| | | |/ /  __/
  |_|_| |_|_|\__|_|\__,_|_|_/___\___|
*/
Context::Prototype[Constructable.reference.initialize.functionality].setter({
  [Entity.reference.key.handleDataInstance]({ targetInstance, data }, previousResult) {
    targetInstance[Reference.key.setter](data)
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
Context.clientInterface = Context::Prototype[Constructable.reference.clientInterface.functionality].switch({ implementationKey: Entity.reference.key.instanceDelegatingToEntityInstancePrototype })({
  constructorImplementation: Entity.reference.key.handleDataInstance,
})
