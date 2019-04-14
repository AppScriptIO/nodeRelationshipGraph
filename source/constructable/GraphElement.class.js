import { Entity } from '@dependency/entity'

interface GraphElementData {
  label: object;
  key: string | number;
  [key: string]: any; // optional other fields
}

const Prototype = {
  getKey: function(key) {
    return this.key
  },
}

const Reference = {}

export const GraphElement = new Entity.clientInterface({ description: 'GraphElement', instanceType: 'object' })

Object.assign(GraphElement, {
  prototypeDelegation: Prototype,
  reference: Reference,
})

GraphElement[Entity.reference.instance.initialize.setter.list]({
  //* constructor that is made to work with the plugin functionality.
  key([{ key }: { key: string | number }], { instanceObject, prototypeDelegation }) {
    instanceObject.key = key
    let data = true || instanceObject.plugin.databaseModelAdapter({ key: instanceObject.key })
    Object.assign(instanceObject, data)
    return instanceObject
  },
})
GraphElement[Entity.reference.configuredConstructable.setter.list]({
  plugin(args, { self = this, instanceObject }) {
    instanceObject ||= Object.create(GraphElement)
    //! Apply multiple inheritance from argument list instances.
    // instanceObject.prototypeDelegatedInstance = (...argumentList) => self::self.prototypeDelegatedInstance.construct(argumentList, { implementationKey: 'key' })
    return instanceObject
  },
})

// Create client interface
GraphElement.clientInterface1 = GraphElement[Entity.reference.clientInterface.switch]([
  {
    configuredConstructable: GraphElement[Entity.reference.configuredConstructable.switch]([
      {
        instantiateImplementationKey: Entity.reference.instance.instantiate.key.prototypeObjectInstance,
        initializeImplementationKey: Entity.reference.instance.initialize.key.data,
      },
    ]),
  },
])
GraphElement.clientInterface2 = GraphElement[Entity.reference.clientInterface.switch]([
  {
    configuredConstructable: GraphElement[Entity.reference.configuredConstructable.switch]([
      {
        instantiateImplementationKey: Entity.reference.instance.instantiate.key.prototypeObjectInstance,
        initializeImplementationKey: 'key',
      },
    ]),
  },
])
