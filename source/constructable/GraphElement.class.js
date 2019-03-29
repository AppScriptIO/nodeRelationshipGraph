import { Entity } from './Entity.class.js'

interface GraphElementData {
  label: object;
  key: string | number;
  [key: string]: any; // optional other fields
}

export function GraphElementFunction({ superConstructor = null } = {}) {
  const self = function GraphElement() {
    assert(false, '• Construction should not reach the original function constructor, rather the proxy exposing its interface should deal with its behavior.')
  }

  // superConstructor == null ? extendFromNull(self) : extendFromConstructable(self, superConstructor)
  extendFromConstructable(self, Entity)

  self.prototype.entityImplementation = {}

  let selfInstance = new self()
  // console.log(selfInstance |> Object.getPrototypeOf |> Object.getPrototypeOf)
  const proxiedSelf = selfInstance::selfInstance.createClientInterface.construct()
  return proxiedSelf
}

export const GraphElement = {
  get [Symbol.species]() {
    return GraphElement
  },
  prototypeDelegation: {},
}

GraphElement.prototypeDelegation.constructor = GraphElement
Object.setPrototypeOf(GraphElement, Entity.prototypeDelegation)

GraphElement[Entity.reference.prototypeInstance.setter.implementation]({
  data([{ data }: { data: GraphElementData }], { instanceObject, prototypeDelegation } = {}) {
    prototypeDelegation ||= GraphElement.prototypeDelegation
    instanceObject ||= Object.create(prototypeDelegation)
    Object.assign(instanceObject, data) // apply data to instance
    return instanceObject
  },
  key([{ key }: { key: string | number }], { instanceObject, prototypeDelegation }) {
    instanceObject.key = key
    let data = true || instanceObject.plugin.databaseModelAdapter({ key: instanceObject.key })
    console.log(data)
    Object.assign(instanceObject, data)
    return instanceObject
  },
})

GraphElement[Entity.reference.configuredConstructable.setter.implementation]({
  default(args, { self = this, instanceObject }) {
    instanceObject ||= Object.create(GraphElement)
    // Execute default instance constructor
    instanceObject.prototypeDelegatedInstance = (...argumentList) => self::self.prototypeDelegatedInstance.construct(argumentList, { implementationKey: 'data' })
    return instanceObject
  },
  plugin(args, { self = this, instanceObject }) {
    //! Apply multiple inheritance from argument list instances.
    instanceObject.prototypeDelegatedInstance = (...argumentList) => self::self.prototypeDelegatedInstance.construct(argumentList, { implementationKey: 'key' })
    return instanceObject
  },
})

GraphElement[Entity.reference.clientInterface.setter.implementation]({
  constructableInterface(args, { interfaceTarget, self = this }) {
    const proxiedTarget = new Proxy(
      function() {} || interfaceTarget,
      Object.assign({
        apply(target, thisArg, argumentsList) {
          let instanceObject = self::self[Entity.reference.configuredConstructable.construct](argumentsList, { implementationKey: 'default' })
          return self::self[Entity.reference.clientInterface.construct]([], { instanceObject, implementationKey: 'constructableInterface' })
        },
        construct(target, argumentList, proxiedTarget) {
          console.log('construct')
          // return target.prototypeDelegatedInstance(...argumentList)
        },
      }),
    )
    return proxiedTarget
  },
})
