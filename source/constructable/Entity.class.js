// https://www.keithcirkel.co.uk/metaprogramming-in-es6-symbols/

function extendSymbol(targetObject, symbolObject) {
  Object.assign(targetObject, symbolObject)
}

let EntityReference = {
  prototypeInstance: {
    construct: Symbol('prototypeInstance.construct'),
  },
  // constructorInstance: {
  //   constructor: Symbol('constructorInstance.construct'),
  // },
  // clientInterface: {
  //   construct: Symbol('clientInterface.construct'),
  // },
}

let Entity = {
  [EntityReference.prototypeInstance.construct]: function(args = [], { constructorImplementation, constructableInstance, self = this } = {}) {
    constructableInstance ||= self::self.createDelegatedFunction() // function object as an instance allows to use `construct` & `apply` with Proxy.
    constructableInstance.plugin = args[0]
    return self::self.constructorDelegatedInstance[constructorImplementation](args, { constructableInstance })
  },
  // [EntityReference.clientInterface.construct]: function(
  //   args = [],
  //   { constructorImplementation = 'constructableInterface', constructableInstance, self = this }: { constructorImplementation: string } = {},
  // ) {
  //   constructableInstance ||= self::self.createConstructorDelegatedInstance.construct()
  //   // Allows for configuring constructable target recursively.
  //   return self::self.clientInterface[constructorImplementation](args, { interfaceTarget: constructableInstance })
  // },
  // [EntityReference.constructorInstance.construct]: function() {},
}

class Element {
  static get [Symbol.species]() {
    return Element
  }
}
extendSymbol(Element, Entity)

let instance = Element[EntityReference.prototypeInstance.construct]()
// let e = new Element()

// e.clientInterface.register({
//   constructableInterface() {
//     return new Proxy(Element, {
//       apply(target, thisArg, argumentsList) {
//         console.log('ok')
//       },
//     })
//   },
// })

// export const defaultClientInterface = e.clientInterface.construct({ constructorImplementation: 'constructableInterface' })
