import { Reference } from './Reference.js'
import { Prototype } from './Prototype.js'

const toplevelConfiguredConstructable =
  Prototype[Reference.configuredConstructable.switch]({ implementationKey: Reference.configuredConstructable.key.toplevelConstructable })
  |> (g => {
    g.next('intermittent')
    return g.next().value
  })

let Entity =
  toplevelConfiguredConstructable[Reference.instance.instantiate.switch]()
  |> (g => {
    g.next('intermittent')
    return g.next({ description: 'Entity' }).value
  })

toplevelConfiguredConstructable[Reference.instance.initialize.switch]()
  |> (g => {
    g.next('intermittent')
    return g.next({
      description: 'Entity',
      instanceObject: Entity,
    }).value
  })

console.log(Entity.reference)

// client interface

// export const Entity = new configuredConstructable()
// export const Entity = Object.create(Prototype, {
//   prototypeDelegation: {
//     writable: false,
//     enumerable: true,
//     value: Prototype,
//   },
//   reference: {
//     writable: false,
//     enumerable: true,
//     value: Reference,
//   },
// })

// // Initialize Entity
// Entity[Reference.instance.initialize.switch]([{ description: 'Entity' }], {
//   instanceObject: Entity,
//   implementationKey: Reference.instance.initialize.key.entityInstance,
// })

// Create client interface
// const configuredConstructable2 = Prototype[Reference.configuredConstructable.switch](
//   [
//     {
//       description: 'constructableForClientInterface',
//       initializeImplementationKey: Reference.instance.initialize.key.entityInstance,
//     },
//   ],
//   {
//     implementationKey: Reference.configuredConstructable.key.constructable,
//   },
// )
// Entity.clientInterface = Entity[Reference.clientInterface.switch](
//   [
//     {
//       configuredConstructable: configuredConstructable,
//     },
//   ],
//   {
//     implementationKey: Reference.clientInterface.key.entityConstruct,
//   },
// )

//* test
// let x = configuredConstructable2
// console.log(x |> Object.getOwnPropertySymbols)

// console.log(Entity.clientInterface)
// Entity.clientInterface([{ description: 'hello' }])
throw new Error('x')
