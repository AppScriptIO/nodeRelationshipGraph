import { Reference } from './Reference.js'
import { Prototype } from './Prototype.js'

export const Entity = Object.create(Prototype, {
  prototypeDelegation: {
    writable: false,
    enumerable: true,
    value: Prototype,
  },
  reference: {
    writable: false,
    enumerable: true,
    value: Reference,
  },
})

// Initialize Entity
Entity[Reference.instance.initialize.switch]([{ description: 'Entity' }], {
  instanceObject: Entity,
  implementationKey: Reference.instance.initialize.key.entityInstance,
})

// Create client interface
const configuredConstructableForEntityInstances = Entity[Reference.configuredConstructable.switch]([
  {
    description: 'constructableForClientInterface',
    initializeImplementationKey: Reference.instance.initialize.key.entityInstance,
  },
])
Entity.clientInterface = Entity[Reference.clientInterface.switch](
  [
    {
      configuredConstructable: configuredConstructableForEntityInstances,
    },
  ],
  {
    implementationKey: Reference.clientInterface.key.entityConstruct,
  },
)

//* test
Entity.clientInterface([{ description: 'hello' }])
throw new Error('x')
