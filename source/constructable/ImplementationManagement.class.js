import assert from 'assert'
import { Entity, Constructable, symbol } from '@dependency/entity'

/**
 * Manages implementation list with ability to assign fallback value. i.e. set and retrieve an implementation or fallback to default.
 */
export const { class: ImplementationManagement, reference: Reference, constructablePrototype, entityPrototype } = new Entity.clientInterface({ description: 'ImplementationManagement' })

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
    list: Symbol('implementation.list'),
    getter: Symbol('implementation.getter'),
    setter: Symbol('implementation.setter'),
    fallback: Symbol('implementation.fallback'),
    fallbackSetter: Symbol('implementation.fallbackSetter'),
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
  /** Register ImplementationManagement */
  [Reference.key.setter](implemeantationList, self = this) {
    self[Reference.key.list] ||= {}
    Object.assign(self[Reference.key.list], implemeantationList)
  },
  /**
   * Retrieve implementation according to parameter hierarchy (priority order) selection.
   * 1. Passed 'implementation' parameter.
   * 2. Default 'implementation' set in the fallback property.
   * 3. Fallback to first item in the implementation list.
   */
  [Reference.key.getter]({ implementation = null, self = this } = {}) {
    if (implementation) return self[Reference.key.list][implementation]

    let defaultImplementation = self[Reference.key.fallback]
    if (defaultImplementation) return self[Reference.key.list][defaultImplementation]

    let firstItemKey = Object.groupKeys(self[Reference.key.list])[0]
    return self[Reference.key.list][firstItemKey]
  },
  // set fallback value on own instance - this allows to overwrite the fallback from sub instances (that delegate to the concrete behavior).
  [Reference.key.fallbackSetter](implementationKey, self = this) {
    Object.defineProperty(self, Reference.key.fallback, {
      value: implementationKey,
    })
  },
})

/*
   ___       _ _   _       _ _         
  |_ _|_ __ (_) |_(_) __ _| (_)_______ 
   | || '_ \| | __| |/ _` | | |_  / _ \
   | || | | | | |_| | (_| | | |/ /  __/
  |___|_| |_|_|\__|_|\__,_|_|_/___\___|
*/
constructablePrototype::ImplementationManagement[Constructable.reference.initialize.functionality].setter({
  /* Each concerete behavior can hold multiple implementations that can be used depending on requested parameters during execution. */
  [Entity.reference.key.handleDataInstance]({ targetInstance, data }, previousResult /* in case multiple constructor function found and executed. */) {
    let { implementationList, defaultImplementation } = data
    targetInstance[Reference.key.setter](implementationList)
    if (defaultImplementation) targetInstance[Reference.key.fallback] = defaultImplementation
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
// client interface for creating sub class instance delegating to the `Entity` & `Constructable` functionality chain + in addition to the ImplementationManagement delegation in both Construtable & Entity instance prototype.
ImplementationManagement.clientInterface = ImplementationManagement::ImplementationManagement[Constructable.reference.clientInterface.functionality].switch({
  implementationKey: Entity.reference.key.entityClass,
})({})
