import assert from 'assert'
import { Entity, Constructable, symbol } from '@dependency/entity'

/**
 * ! `getDocumentQuery` should be passed for configured constructable, i.e. used in group of instances.
 * ! Instance inherited from `Superclass`
 */
export const { class: DataItem, reference: Reference, constructablePrototype: Prototype, entityPrototype } = new Entity.clientInterface({ description: 'DataItem' })

/*
                   _        _                    ____       _                  _   _             
   _ __  _ __ ___ | |_ ___ | |_ _   _ _ __   ___|  _ \  ___| | ___  __ _  __ _| |_(_) ___  _ __  
  | '_ \| '__/ _ \| __/ _ \| __| | | | '_ \ / _ \ | | |/ _ \ |/ _ \/ _` |/ _` | __| |/ _ \| '_ \ 
  | |_) | | | (_) | || (_) | |_| |_| | |_) |  __/ |_| |  __/ |  __/ (_| | (_| | |_| | (_) | | | |
  | .__/|_|  \___/ \__\___/ \__|\__, | .__/ \___|____/ \___|_|\___|\__, |\__,_|\__|_|\___/|_| |_|
  |_|                           |___/|_|                           |___/                         
*/
Object.assign(entityPrototype, {
  async initializeDataItem() {
    // let initializationImplementationType = dataItem.tag.initializationImplementationType
    console.log('• DataItem class, initializeDataItem function')
  },
  // TODO: Add function for loading file using the file object settings, i.e. load filepath as es6 module or as regular module with default export.
})

/*
   _       _ _   _       _ _         
  (_)_ __ (_) |_(_) __ _| (_)_______ 
  | | '_ \| | __| |/ _` | | |_  / _ \
  | | | | | | |_| | (_| | | |/ /  __/
  |_|_| |_|_|\__|_|\__,_|_|_/___\___|
*/
Prototype::Prototype[Constructable.reference.initialize.functionality].setter({
  [Entity.reference.key.entityInstance]({ targetInstance, databaseDocumentKey }, previousResult /* in case multiple constructor function found and executed. */) {
    targetInstance.key = databaseDocumentKey
    // must be executed once.
    async function pupolateUnitWithFile({
      fileKey,
      getDocument, // function
      extract = null, // object with two properties - extract: { sourceKey: 'key from source object', destinationKey: 'key to "this" destination' }
    }) {
      assert.strictEqual(Object.getPrototypeOf(self.rethinkdbConnection).constructor.name, 'TcpConnection')
      let file = await getDocument({ key: fileKey, connection: self.rethinkdbConnection })
      if (extract) this[extract.destinationKey] = extract.sourceKey ? file[extract.sourceKey] : file
    }
    pupolateUnitWithFile()

    return targetInstance
  },
})

/*
    ____ _ _            _     _ _                    __                
   / ___| (_) ___ _ __ | |_  (_) |_ _ __   ___ _ __ / _| __ _  ___ ___ 
  | |   | | |/ _ \ '_ \| __| | | __| '_ \ / _ \ '__| |_ / _` |/ __/ _ \
  | |___| | |  __/ | | | |_  | | |_| | | |  __/ |  |  _| (_| | (_|  __/
   \____|_|_|\___|_| |_|\__| |_|\__|_| |_|\___|_|  |_|  \__,_|\___\___|
*/
DataItem.clientInterface =
  DataItem::Prototype[Constructable.reference.clientInterface.functionality].switch({ implementationKey: Entity.reference.key.instanceDelegatingToEntityInstancePrototype })
  |> (g =>
    g.next('intermittent') &&
    g.next({
      constructorImplementation: Entity.reference.key.data,
      argumentListAdapter: argumentList => {
        argumentList[0] = { data: argumentList[0] }
        return argumentList
      },
    }).value)
