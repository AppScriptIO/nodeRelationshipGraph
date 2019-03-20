class Entity {}
Entity.prototype.clientInterface = {
  construct(args = [], { constructorImplementation = 'constructableInterface', constructableInstance, self = this }: { constructorImplementation: string } = {}) {
    constructableInstance ||= self::self.createConstructorDelegatedInstance.construct()
    // Allows for configuring constructable target recursively.
    return self::self.clientInterface[constructorImplementation](args, { interfaceTarget: constructableInstance })
  },
  register() {},
}

class Element extends Entity {}

let e = new Element()

e.clientInterface.register({
  constructableInterface() {
    return new Proxy(Element, {
      apply(target, thisArg, argumentsList) {
        console.log('ok')
      },
    })
  },
})

export const defaultClientInterface = e.clientInterface.construct({ constructorImplementation: 'constructableInterface' })
