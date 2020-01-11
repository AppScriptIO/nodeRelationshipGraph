import assert from 'assert'
import { Entity, Constructable } from '@dependency/entity'
import * as ImplementationManagement from '../ImplementationManagement.class.js'
import * as schemeReference from '../../dataModel/graphSchemeReference.js'

/**
 ** Database system for supporting different database adapters, and containing the wrapper model methods.
 * Create concrete behavior of database that will be used in the client target.
 * 'databaseModelAdaper' - database model functions for retriving node, dataItem, and other documents. should be async functions.

  Database instance examples: 
    - JSON file database.
    - In-memory Memgraph database.
    - Neo4j graph database.
 */
const { class: Class, reference: $ } = new ImplementationManagement.clientInterface({ label: 'Database' })

Class::Class[$.prototypeDelegation.getter](Entity.$.key.stateInstance).instancePrototype |> (prototype => Object.assign(prototype, require('./prototype.js')))

Class::Class[$.prototypeDelegation.getter](Constructable.$.key.constructableInstance).instancePrototype
  |> (prototype => {
    prototype::Class[Entity.$.initialize.setter]({
      [Entity.$.key.concreteBehaviorList]: function*({ targetInstance, callerClass = this }, { implementationList, defaultImplementation } /** `data` parameter used to merge data to instance */) {
        // plugin functions initialization with schemeReference used by Traverser.
        implementationList = implementationList.map(implementation => implementation({ schemeReference }))

        // super implementation should take care of setting the constructableDelegationSetting
        let { superCallback } = function.sent
        if (superCallback) targetInstance = callerClass::superCallback({ targetInstance }, { implementationList, defaultImplementation }) // call implementation higher in the hierarchy.

        return targetInstance
      },
    })
  })

const clientInterface = Class::Class[Entity.$.clientInterface.switch](Entity.$.key.stateInstance)({ constructorImplementation: Entity.$.key.concereteBehavior })

export { Class as class, $, clientInterface }
