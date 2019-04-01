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

export const GraphElement = Object.assign(Entity.prototypeDelegation)

Object.assign(GraphElement, {
  // get [Symbol.species]() {
  //   return GraphElement
  // },
  reference: {},
  prototypeDelegation: Object.create(null),
})

Object.assign(GraphElement.prototypeDelegation, {
  getKey: function(key) {
    return this.key
  },
})

GraphElement[Entity.reference.prototypeInstance.setter.prototypeDelegation]({
  default: GraphElement.prototypeDelegation,
})

GraphElement[Entity.reference.prototypeInstance.setter.instantiate]({
  defaultPrototype({ instanceObject, prototypeDelegation } = {}) {
    prototypeDelegation ||= GraphElement[Entity.reference.prototypeInstance.getter.prototypeDelegation]('default')
    instanceObject ||= Object.create(prototypeDelegation)
    return instanceObject
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
  // default(args, { self = this, instanceObject }) {
  //   //! create and instance with plugin object and context.
  //   instanceObject ||= Object.create(GraphElement)
  //   // Execute default instance constructor
  //   instanceObject.prototypeDelegatedInstance = (...argumentList) => self::self.prototypeDelegatedInstance.construct(argumentList, { implementationKey: 'data' })
  //   return instanceObject
  // },
  // plugin(args, { self = this, instanceObject }) {
  //   //! Apply multiple inheritance from argument list instances.
  //   instanceObject.prototypeDelegatedInstance = (...argumentList) => self::self.prototypeDelegatedInstance.construct(argumentList, { implementationKey: 'key' })
  //   return instanceObject
  // },
})

GraphElement[Entity.reference.clientInterface.setter.construct]({
  constructableInterface(args, { interfaceTarget, self = this }) {
    const proxiedTarget = new Proxy(
      function() {} || interfaceTarget,
      Object.assign({
        apply(target, thisArg, argumentsList) {
          let instanceObject = self[Entity.reference.configuredConstructable.method.construct](argumentsList, { implementationKey: 'default' })
          return self[Entity.reference.clientInterface.method.construct]([], { instanceObject, implementationKey: 'constructableInterface' })
        },
        construct(target, argumentList, proxiedTarget) {
          return target.prototypeDelegatedInstance(...argumentList)
        },
      }),
    )
    return proxiedTarget
  },
})
