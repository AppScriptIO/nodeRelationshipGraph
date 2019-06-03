import assert from 'assert'
import { Entity, Constructable, symbol } from '@dependency/entity'

/**
 ** Cache system for supporting different graph implementation and database adapters.
 */
export const { class: Cache, reference: Reference, constructablePrototype: Prototype, entityPrototype } = new Entity.clientInterface({ description: 'Cache' })

/*
                   _        _                    ____       _                  _   _             
   _ __  _ __ ___ | |_ ___ | |_ _   _ _ __   ___|  _ \  ___| | ___  __ _  __ _| |_(_) ___  _ __  
  | '_ \| '__/ _ \| __/ _ \| __| | | | '_ \ / _ \ | | |/ _ \ |/ _ \/ _` |/ _` | __| |/ _ \| '_ \ 
  | |_) | | | (_) | || (_) | |_| |_| | |_) |  __/ |_| |  __/ |  __/ (_| | (_| | |_| | (_) | | | |
  | .__/|_|  \___/ \__\___/ \__|\__, | .__/ \___|____/ \___|_|\___|\__, |\__,_|\__|_|\___/|_| |_|
  |_|                           |___/|_|                           |___/                         
*/
Object.assign(entityPrototype, {
  get(key, defaultValue) {
    const value = this._doGet(key)
    if (value === undefined || value === null) {
      return defaultValue
    }
    return value
  },
  set(key, value) {
    if (key === undefined || key === null) {
      throw new Error('Invalid argument')
    }
    this._doSet(key, value)
  },
})

/*
    ____ _ _            _     _ _                    __                
   / ___| (_) ___ _ __ | |_  (_) |_ _ __   ___ _ __ / _| __ _  ___ ___ 
  | |   | | |/ _ \ '_ \| __| | | __| '_ \ / _ \ '__| |_ / _` |/ __/ _ \
  | |___| | |  __/ | | | |_  | | |_| | | |  __/ |  |  _| (_| | (_|  __/
   \____|_|_|\___|_| |_|\__| |_|\__|_| |_|\___|_|  |_|  \__,_|\___\___|
*/
Cache.clientInterface =
  Cache::Prototype[Constructable.reference.clientInterface.functionality].switch({ implementationKey: Entity.reference.key.instanceDelegatingToEntityInstancePrototype })
  |> (g =>
    g.next('intermittent') &&
    g.next({
      constructorImplementation: Entity.reference.key.data,
      argumentListAdapter: argumentList => {
        argumentList[0] = { data: argumentList[0] }
        return argumentList
      },
    }).value)
