import assert from 'assert'
import { Entity, Constructable } from '@dependency/entity'
import * as ImplementationManagement from './ImplementationManagement.class.js'

/**
 ** Database system for supporting different database adapters.
 * Create concrete behavior of database that will be used in the client target.
 * 'databaseModelAdaper' - database model functions for retriving node, dataItem, and other documents. should be async functions.
 */
const { class: Class, reference: $ } = new ImplementationManagement.clientInterface({ label: 'Database' })

const clientInterface = Class::Class[Entity.$.clientInterface.switch](Entity.$.key.stateInstance)({ constructorImplementation: Entity.$.key.handleDataInstance })

export { Class as class, $, clientInterface }
