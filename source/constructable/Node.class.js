import assert from 'assert'
import { Entity, Constructable, symbol } from '@dependency/entity'
import { GraphElement } from './GraphElement.class.js'

interface Node {
  tag: {
    processingAlgorithm: String, // processing/execution of data item
  };
}

export const { class: Node, reference: Reference, constructablePrototype: Prototype, entityPrototype } = new GraphElement.clientInterface({ description: 'Node' })

Object.assign(Reference, {
  key: {
    constructor: Symbol('Node:key.constructor'),
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
Object.assign(entityPrototype, {})

/*
   _       _ _   _       _ _         
  (_)_ __ (_) |_(_) __ _| (_)_______ 
  | | '_ \| | __| |/ _` | | |_  / _ \
  | | | | | | |_| | (_| | | |/ /  __/
  |_|_| |_|_|\__|_|\__,_|_|_/___\___|
*/
Prototype::Prototype[Constructable.reference.initialize.functionality].setter({})

/*
                       _                   _             
    ___ ___  _ __  ___| |_ _ __ _   _  ___| |_ ___  _ __ 
   / __/ _ \| '_ \/ __| __| '__| | | |/ __| __/ _ \| '__|
  | (_| (_) | | | \__ \ |_| |  | |_| | (__| || (_) | |   
   \___\___/|_| |_|___/\__|_|   \__,_|\___|\__\___/|_|   
*/
Prototype::Prototype[Constructable.reference.constructor.functionality].setter({
  [Reference.key.constructor]({
    data, // data to be merged into the instance
    concreteBehaviorList,
    callerClass = this,
  }) {
    let { key } = data
    assert(key, `• ${key} Key should be present. The passed value is either undefined, null, or empty string.`)
    let instance = callerClass::Constructable[Constructable.reference.constructor.functionality].switch({ implementationKey: Entity.reference.key.concereteBehavior })({ concreteBehaviorList, data })
    instance.key = key
    //? get dataItem in case referenced.
    return instance
  },
})

/*
    ____ _ _            _     _ _                    __                
   / ___| (_) ___ _ __ | |_  (_) |_ _ __   ___ _ __ / _| __ _  ___ ___ 
  | |   | | |/ _ \ '_ \| __| | | __| '_ \ / _ \ '__| |_ / _` |/ __/ _ \
  | |___| | |  __/ | | | |_  | | |_| | | |  __/ |  |  _| (_| | (_|  __/
   \____|_|_|\___|_| |_|\__| |_|\__|_| |_|\___|_|  |_|  \__,_|\___\___|
*/
Node.clientInterface = Node::Prototype[Constructable.reference.clientInterface.functionality].switch({
  implementationKey: Entity.reference.key.instanceDelegatingToEntityInstancePrototype,
})({
  constructorImplementation: Reference.key.constructor,
})
