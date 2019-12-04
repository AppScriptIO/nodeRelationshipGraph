import assert from 'assert'
import { Entity, Constructable } from '@dependency/entity'
import * as ImplementationManagement from './ImplementationManagement.class.js'

interface TraversalImplementation {
  // Usage of async generators will prevent handing the control to called function (against `Run-to-complete` principle), and will allow interceptin the execution mid way.
  traverseGraph: Function;
}

/**
 ** Traversal system for supporting different graph implementation (concrete behavior of plugin that will be used in the client target).
 */
const { class: Class, reference: $ } = new ImplementationManagement.clientInterface({ label: 'Traversal' })

const clientInterface = Class::Class[Entity.$.clientInterface.switch](Entity.$.key.stateInstance)({ constructorImplementation: Entity.$.key.handleDataInstance })

export { Class as class, $, clientInterface }
