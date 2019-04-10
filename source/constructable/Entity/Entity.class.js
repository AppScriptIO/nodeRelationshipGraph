import { Reference } from './Reference.js'
import { Prototype } from './Prototype.js'

const result =
  Prototype[Reference.configuredConstructable.switch]({ implementationKey: Reference.configuredConstructable.key.constructable })
  |> (g => {
    g.next('intermittent')
    return g.next({
      description: 'constructableForClientInterface',
      initializeFallback: Reference.instance.initialize.key.entityInstance,
    }).value
  })
console.log(result |> Object.getOwnPropertySymbols)

// let { value: argObject } = configuredConstructable.next('intermittent')
// Object.assign(argObject.initialize, {})
// Object.assign(argObject.instantiate, {})
// let entityInstance = configuredConstructable.next(argObject)

// console.log('complete')
// console.log(entityInstance)

// const E = ''

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
