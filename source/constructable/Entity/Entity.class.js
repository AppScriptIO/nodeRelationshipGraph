import { Reference } from './Reference.js'
import { Prototype, toplevelConfiguredConstructable } from './Prototype.js'

export const Entity = new toplevelConfiguredConstructable.clientInterface({ description: 'Entity' })

// Create client interface
const configuredConstructable =
  Entity[Reference.configuredConstructable.switch]({ implementationKey: Reference.configuredConstructable.key.constructable })
  |> (g => {
    g.next('intermittent')
    return g.next({
      description: 'EntityConstructableForClientInterface',
      instantiateFallback: Reference.instance.instantiate.key.entityInstance,
      initializeFallback: Reference.instance.initialize.key.entityInstance,
    }).value
  })

Entity.clientInterface =
  Entity[Reference.clientInterface.switch]({ implementationKey: Reference.clientInterface.key.entityConstruct })
  |> (g => {
    g.next('intermittent')
    return g.next({
      configuredConstructable: configuredConstructable,
    }).value
  })
