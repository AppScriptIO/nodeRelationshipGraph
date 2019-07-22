import assert from 'assert'
import { Entity, Constructable, symbol } from '@dependency/entity'
import { ImplementationManagement } from './ImplementationManagement.class.js'
import { MultipleDelegation } from '@dependency/multiplePrototypeDelegation'
import { proxifyMethodDecorator } from '../utility/proxifyMethodDecorator.js'

interface TraversalImplementation {
  // Usage of async generators will prevent handing the control to called function (against `Run-to-complete` principle), and will allow interceptin the execution mid way.
  traverseGraph: Function;
}

export const traversalOption = ['processData', 'handlePropagation', 'traverseNode', 'aggregator', 'traversalInterception', 'evaluatePosition']

/**
 ** GraphTraversal system for supporting different graph implementation (concrete behavior of plugin that will be used in the client target).
 */
export const { class: GraphTraversal, reference: Reference, constructablePrototype: Prototype, entityPrototype } = new ImplementationManagement.clientInterface({ description: 'GraphTraversal' })

/*
   ____       __                                 ___     ____            _        _                    
  |  _ \ ___ / _| ___ _ __ ___ _ __   ___ ___   ( _ )   |  _ \ _ __ ___ | |_ ___ | |_ _   _ _ __   ___ 
  | |_) / _ \ |_ / _ \ '__/ _ \ '_ \ / __/ _ \  / _ \/\ | |_) | '__/ _ \| __/ _ \| __| | | | '_ \ / _ \
  |  _ <  __/  _|  __/ | |  __/ | | | (_|  __/ | (_>  < |  __/| | | (_) | || (_) | |_| |_| | |_) |  __/
  |_| \_\___|_|  \___|_|  \___|_| |_|\___\___|  \___/\/ |_|   |_|  \___/ \__\___/ \__|\__, | .__/ \___|
                                                                                      |___/|_|         
*/
Object.assign(Reference, {
  key: {},
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
        MultipleDelegation.addDelegation({ targetObject: instance, delegationList: [currentConcereteBehavior] })
        return instance
      },
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
GraphTraversal::GraphTraversal[Constructable.reference.initialize.functionality].setter({})

/*
    ____ _ _            _     _ _                    __                
   / ___| (_) ___ _ __ | |_  (_) |_ _ __   ___ _ __ / _| __ _  ___ ___ 
  | |   | | |/ _ \ '_ \| __| | | __| '_ \ / _ \ '__| |_ / _` |/ __/ _ \
  | |___| | |  __/ | | | |_  | | |_| | | |  __/ |  |  _| (_| | (_|  __/
   \____|_|_|\___|_| |_|\__| |_|\__|_| |_|\___|_|  |_|  \__,_|\___\___|
*/
GraphTraversal.clientInterface = GraphTraversal::Prototype[Constructable.reference.clientInterface.functionality].switch({
  implementationKey: Entity.reference.key.instanceDelegatingToEntityInstancePrototype,
})({
  constructorImplementation: Entity.reference.key.handleDataInstance,
})
