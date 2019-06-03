import assert from 'assert'
import { Entity, Constructable, symbol } from '@dependency/entity'

/**
 * Context is responsible for creating a grouping context - where information could be shared between instances of some class that belong/inherit the context.
 */
export const { class: Context, reference: Reference, constructablePrototype: Prototype, entityPrototype } = new Entity.clientInterface({ description: 'Context' })

/*
                   _        _                    ____       _                  _   _             
   _ __  _ __ ___ | |_ ___ | |_ _   _ _ __   ___|  _ \  ___| | ___  __ _  __ _| |_(_) ___  _ __  
  | '_ \| '__/ _ \| __/ _ \| __| | | | '_ \ / _ \ | | |/ _ \ |/ _ \/ _` |/ _` | __| |/ _ \| '_ \ 
  | |_) | | | (_) | || (_) | |_| |_| | |_) |  __/ |_| |  __/ |  __/ (_| | (_| | |_| | (_) | | | |
  | .__/|_|  \___/ \__\___/ \__|\__, | .__/ \___|____/ \___|_|\___|\__, |\__,_|\__|_|\___/|_| |_|
  |_|                           |___/|_|                           |___/                         
*/
Prototype::Prototype[Constructable.reference.prototypeDelegation.functionality].setter({})

/*
   _       _ _   _       _ _         
  (_)_ __ (_) |_(_) __ _| (_)_______ 
  | | '_ \| | __| |/ _` | | |_  / _ \
  | | | | | | |_| | (_| | | |/ /  __/
  |_|_| |_|_|\__|_|\__,_|_|_/___\___|
*/
Prototype::Prototype[Constructable.reference.initialize.functionality].setter({
  [Entity.reference.key.entityInstance]({ targetInstance }, previousResult) {
    // instance properties
    targetInstance.sharedContext = {}
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
Context.clientInterface =
  Context::Prototype[Constructable.reference.clientInterface.functionality].switch({ implementationKey: Entity.reference.key.instanceDelegatingToEntityInstancePrototype })
  |> (g =>
    g.next('intermittent') &&
    g.next({
      constructorImplementation: Entity.reference.key.data,
      argumentListAdapter: argumentList => {
        argumentList[0] = { data: argumentList[0] }
        return argumentList
      },
    }).value)
