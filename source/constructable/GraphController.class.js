import EventEmitter from 'events'
import assert from 'assert'
import { Entity, Constructable, symbol } from '@dependency/entity'
import createInstance from '../utility/createInstanceStaticMethod.js'
import addStaticSubclassToClassArray from '@dependency/commonPattern/source/addStaticSubclassToClassArray.staticMethod'

/**
 * Create unit instance, query data, and populate json data to instance.
 * @param  {array} controllerInstanceArray
 * @param  {string} dataKey
 * @param  {function} getDocumentQueryCallback
 * @return {instance} class instance
 */
async function createInstanceStaticMethod(controllerInstanceArray, dataKey, getDocumentQueryCallback) {
  let Class = this

  // [1] Create new instance
  let instance
  if (!(dataKey in controllerInstanceArray)) {
    instance = await new Class(dataKey)
    controllerInstanceArray[dataKey] = instance
  } else {
    instance = controllerInstanceArray[dataKey] // Preserved between requests. Causes problems
  }

  // [2] Populate properties.
  if (!('jsonData' in instance)) {
    // if not already populated with data.
    let jsonData = await getDocumentQueryCallback(Class.rethinkdbConnection, dataKey)
    await Object.assign(instance, jsonData)
    instance.jsonData = jsonData
  }

  return instance // return the newly cr
}

/**
 *
 */
export const GraphController = new Entity.clientInterface({ description: 'GraphController' })

Object.assign(GraphController, {
  createInstance,
  addStaticSubclassToClassArray,

  traverseGraph: async function({ nodeKey }) {
    // TODO: Usage of async generators will prevent handing the control to called function (against `Run-to-complete` principle), and will allow interceptin the execution mid way.

    // [1] get node
    assert(nodeKey, `• ${nodeKey} Key should be present. The passed value is either undefined, null, or empty string.`)
    let nodeInstance = await this.createNodeInstance({ nodeKey }) // returns a node object (instance)
    // [2] Forward call to instance's traverse graph

    //execute to complete
    // intercepting execution & keeping control
    //{nextNode, } = traverse*(Node)

    // let iteratorObject = Traverse*(Node)
    // let result = iteratorObject.next()
    // let result = iteratorObject.next()
    // let result = iteratorObject.next()
    // result.value.nodeKey
    // if(result.done) let finalNodeResult.next(result1, result2, result3, result4)
    // return finalNoderesult;

    return await nodeInstance.traverseGraph(arguments)
  },

  // Add "createObjectWithPrototypeChain"
  createNodeInstance: async function({ nodeKey, additionalChildNestedUnit = [], nodeConnectionKey = null, nodeSubclass }) {
    console.log(new nodeSubclass()) // TODO: FIx proxy that wraps Node - the returned instance is not an object error.
    // create instance or get cached instance
    let instance = await Reflect.construct(nodeSubclass, [nodeKey]) // call 'new' on subclass

    // // get json data from database/storage. gets document from database using documentKey and populates the data to the instance. during which 'jsonData' property is set. if it is set, it means that the instance is already populated with data.
    // if(!('jsonData' in instance)) { // if not already populated with data.
    //     let getDocumentQuery = instance.constructor.getDocumentQuery
    //     // TODO: get plugin datatbase adapter
    //     databaseModelAdapter.getNodeDocumentQuery
    //     databaseModelAdapter.getDataItemDocumentQuery
    //     let jsonData = await getDocumentQuery({ key: nodeKey })
    //     assert(jsonData, `• "${nodeKey}" nestedUnit document must be present in the database, the requested key does not exist in database. The passed value is either undefined, null, or empty string.`)
    //     await instance.populateInstancePropertyFromJson_this({ jsonData })
    // }

    return instance
  },

  createDataItemInstance: async function({ dataItemKey, dataItemSubclass }) {
    // create instance or get cached instance
    let instance = await Reflect.construct(dataItemSubclass, [dataItemKey]) // call 'new' on subclass

    // get json data from database/storage. gets document from database using documentKey and populates the data to the instance. during which 'jsonData' property is set. if it is set, it means that the instance is already populated with data.
    if (!('jsonData' in instance)) {
      // if not already populated with data.
      let getDocumentQuery = instance.constructor.getDocumentQuery
      let jsonData = await getDocumentQuery({ key: dataItemKey })
      assert(
        jsonData,
        `• "${dataItemKey}" nestedUnit document must be present in the database, the requested key does not exist in database. The passed value is either undefined, null, or empty string.`,
      )
      await instance.populateInstancePropertyFromJson_this({ jsonData })
    }

    return instance
  },
})

/*
   ____       __                                 ___     ____            _        _                    
  |  _ \ ___ / _| ___ _ __ ___ _ __   ___ ___   ( _ )   |  _ \ _ __ ___ | |_ ___ | |_ _   _ _ __   ___ 
  | |_) / _ \ |_ / _ \ '__/ _ \ '_ \ / __/ _ \  / _ \/\ | |_) | '__/ _ \| __/ _ \| __| | | | '_ \ / _ \
  |  _ <  __/  _|  __/ | |  __/ | | | (_|  __/ | (_>  < |  __/| | | (_) | || (_) | |_| |_| | |_) |  __/
  |_| \_\___|_|  \___|_|  \___|_| |_|\___\___|  \___/\/ |_|   |_|  \___/ \__\___/ \__|\__, | .__/ \___|
                                                                                      |___/|_|         
*/
const Reference = Object.assign(GraphController[Constructable.reference.reference], {})
const Prototype = Object.assign(GraphController[Constructable.reference.prototype], {})

/*
                   _        _                    ____       _                  _   _             
   _ __  _ __ ___ | |_ ___ | |_ _   _ _ __   ___|  _ \  ___| | ___  __ _  __ _| |_(_) ___  _ __  
  | '_ \| '__/ _ \| __/ _ \| __| | | | '_ \ / _ \ | | |/ _ \ |/ _ \/ _` |/ _` | __| |/ _ \| '_ \ 
  | |_) | | | (_) | || (_) | |_| |_| | |_) |  __/ |_| |  __/ |  __/ (_| | (_| | |_| | (_) | | | |
  | .__/|_|  \___/ \__\___/ \__|\__, | .__/ \___|____/ \___|_|\___|\__, |\__,_|\__|_|\___/|_| |_|
  |_|                           |___/|_|                           |___/                         
*/
Reference.prototypeDelegation = {
  key: {},
}
Prototype[Constructable.reference.prototypeDelegation.setter.list]({})
Object.assign(GraphController[Constructable.reference.prototypeDelegation.getter.list](Entity.reference.prototypeDelegation.key.entity).prototype, {
  // intercept a method call to choose the corresponding plugin to execute (setting/assigning the variables values according to passed parameters hierarchy)
  interceptMethod({ thisArg, implementationType, nodeInstance, argumentsList, methodName }) {
    let implementationFunction = this.getPlugin({ plugin: 'graphTraversalImplementation', implementation: implementationType })
    // TODO: add plugin settings that will allow to instantiate plugin depending on its settings - i.e. if function instantiate in a specific way
    let implementationObject = implementationFunction({ thisArg: nodeInstance })
    return implementationObject[methodName].apply(thisArg, argumentsList)
  },

  /**
   * Create nodeInstace from `nodeKey`, then forward call to `traverseGraph` subclass method
   */
  async traverseGraph({ nodeKey }) {},
  async initializeDataItem({ dataItemKey }) {
    assert(dataItemKey, `• Missing "dataItem key" - for dataItemType "reference" a key must exist in "node.dataItem".`)
    // get data item
    let dataItemInstance = await this.createDataItemInstance({ dataItemKey })
    // forward call to instance's implementation
    await dataItemInstance.initializeDataItem(arguments)
    return dataItemInstance
  },

  /* @cacheInstance({ // import { cacheInstance } from '@dependency/commonPattern/source/superclassInstanceContextPattern.js'
      //     cacheArrayName: 'node',
      //     keyArgumentName: 'nodeKey'
      // })
      // TODO: change name from 'pathPointerKey' to 'nodeConnectionKey'
      // TODO: change function name from 'getNode'/'getNestedUnit' to 'createNodeInstance'
       */
  async createNodeInstance({ nodeKey, additionalChildNestedUnit = [], nodeConnectionKey = null }) {
    let nodeSubclass = this.getSubclass({ subclassName: 'ImplementationNode' }) || this.getSubclass({ subclassName: 'Node' }) // get specific subclass or reusable subclass
    return await self.createNodeInstance({ nodeKey, additionalChildNestedUnit, nodeConnectionKey, nodeSubclass })
  },

  //   @cacheInstance({
  //     cacheArrayName: 'dataItem',
  //     keyArgumentName: 'dataItemKey'
  // })
  async createDataItemInstance({ dataItemKey }) {
    let dataItemSubclass = this.getSubclass({ subclassName: 'ImplementationDataItem' }) || this.getSubclass({ subclassName: 'DataItem' }) // get specific subclass or reusable subclass
    return await self.createDataItemInstance({ dataItemKey, dataItemSubclass })
  },
})

/*
   _       _ _   _       _ _         
  (_)_ __ (_) |_(_) __ _| (_)_______ 
  | | '_ \| | __| |/ _` | | |_  / _ \
  | | | | | | |_| | (_| | | |/ /  __/
  |_|_| |_|_|\__|_|\__,_|_|_/___\___|
*/
Prototype[Constructable.reference.initialize.setter.list]({
  [Reference.initialize.key.entity]({ targetInstance, databaseDocumentKey }, previousResult /* in case multiple constructor function found and executed. */) {
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
GraphController.clientInterface =
  Prototype[Constructable.reference.clientInterface.switch]({ implementationKey: Entity.reference.clientInterface.key.instanceDelegatingToClassPrototype })
  |> (g =>
    g.next('intermittent') &&
    g.next({
      constructorImplementation: Entity.reference.constructor.key.data,
      argumentListAdapter: argumentList => {
        argumentList[0] = { data: argumentList[0] }
        return argumentList
      },
    }).value)
