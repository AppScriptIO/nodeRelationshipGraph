import { Entity } from './Entity.class.js'

interface GraphElementData {
  label: object;
  key: string | number;
  [key: string]: any; // optional other fields
}

export const GraphElement = Entity.constructEntity({ description: 'GraphElement' })

Object.assign(GraphElement.prototypeDelegation, {
  getKey: function(key) {
    return this.key
  },
})

GraphElement[Entity.reference.prototypeInstance.setter.initialize]({
  data([{ data }: { data: GraphElementData }], { instanceObject } = {}) {
    Object.assign(instanceObject, data) // apply data to instance
    return instanceObject
  },
  //* constructor that is made to work with the plugin functionality.
  key([{ key }: { key: string | number }], { instanceObject, prototypeDelegation }) {
    instanceObject.key = key
    let data = true || instanceObject.plugin.databaseModelAdapter({ key: instanceObject.key })
    Object.assign(instanceObject, data)
    return instanceObject
  },
})

GraphElement[Entity.reference.configuredConstructable.setter.construct]({
  plugin(args, { self = this, instanceObject }) {
    instanceObject ||= Object.create(GraphElement)
    //! Apply multiple inheritance from argument list instances.
    instanceObject.prototypeDelegatedInstance = (...argumentList) => self::self.prototypeDelegatedInstance.construct(argumentList, { implementationKey: 'key' })
    return instanceObject
  },
})

GraphElement.clientInterface = GraphElement[Entity.reference.clientInterface.method.construct]([
  {
    configuredConstructable: GraphElement[Entity.reference.configuredConstructable.method.construct]([
      {
        instantiateImplementationKey: Entity.reference.prototypeInstance.fallbackImplementation.instantiatePrototypeInstanceKey,
        initializeImplementationKey: 'data',
      },
    ]),
  },
])
