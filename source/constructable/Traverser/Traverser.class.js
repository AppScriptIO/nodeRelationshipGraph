import assert from 'assert'
import { MultipleDelegation } from '@dependency/handlePrototypeDelegation'
import { Entity, Constructable } from '@dependency/entity'
import * as Context from '../Context.class.js'
import * as ImplementationManagement from '../ImplementationManagement.class.js'

// interface TraversalImplementation {
//   // Usage of async generators will prevent handing the control to called function (against `Run-to-complete` principle), and will allow interceptin the execution mid way.
//   traverseGraph: Function;
// }

/*
 ** Traverser - holds traversal methods & plugins/implementations, and Traverser instances represent traversal sequences Which tracks & holds traversal information.
 traverser call recursive chain - represents a traversal sequence that has it's own cache, aggregator, statistics, and other parameters.
 Traversal system for supporting different graph implementation (concrete behavior of plugin that will be used in the client target).

  Traversal implementations allow for providing custom logic during traversal of the graph for different purposes: 
    - Template system traversal logic 
    - Middleware execution traversal logic
    - Condition trees and with complex logical operation combinations.
    etc.

 *  - Context: shared data accessible between traversals.
 */
const { class: Class, reference: $ } = new ImplementationManagement.clientInterface({ label: 'Traverser' })

Class::Class[$.prototypeDelegation.getter](Entity.$.key.stateInstance).instancePrototype |> (prototype => Object.assign(prototype, require('./prototype.js')))

Class::Class[$.prototypeDelegation.getter](Constructable.$.key.constructableInstance).instancePrototype
  |> (prototype => {
    prototype::Class[Entity.$.initialize.setter]({
      [Entity.$.key.handleDataInstance]: function*({ targetInstance, callerClass = this }, { graph }) {
        // super implementation should take care of setting the constructableDelegationSetting
        let { superCallback } = function.sent
        if (superCallback) targetInstance = callerClass::superCallback(...arguments) // call implementation higher in the hierarchy.

        targetInstance.statistics = {
          traversedNodeList: [], // track traversed nodes.
        }
        targetInstance.graph = graph
        assert(targetInstance.graph, `• A graph instance must be passed to the Traverser class instances.`)

        // for providing shared iterator for all traversal sequence
        targetInstance.iteratorObjectList = [] // Note: these are not iterator functions, rather the objects created by them.

        return targetInstance
      },
    })
  })

const clientInterface = Class::Class[Entity.$.clientInterface.switch](Entity.$.key.stateInstance)({ constructorImplementation: Entity.$.key.stateInstance })

export { Class as class, $, clientInterface }
