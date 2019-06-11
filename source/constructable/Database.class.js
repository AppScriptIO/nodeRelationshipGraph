import assert from 'assert'
import { Entity, Constructable, symbol } from '@dependency/entity'
import { MultipleDelegation } from '@dependency/multiplePrototypeDelegation'

/**
 ** Database system for supporting different database adapters.
 * Create concrete behavior of database that will be used in the client target.
 */
export const { class: Database, reference: Reference, constructablePrototype: Prototype, entityPrototype } = new Entity.clientInterface({ description: 'Database' })

/*
   ____       __                                 ___     ____            _        _                    
  |  _ \ ___ / _| ___ _ __ ___ _ __   ___ ___   ( _ )   |  _ \ _ __ ___ | |_ ___ | |_ _   _ _ __   ___ 
  | |_) / _ \ |_ / _ \ '__/ _ \ '_ \ / __/ _ \  / _ \/\ | |_) | '__/ _ \| __/ _ \| __| | | | '_ \ / _ \
  |  _ <  __/  _|  __/ | |  __/ | | | (_|  __/ | (_>  < |  __/| | | (_) | || (_) | |_| |_| | |_) |  __/
  |_| \_\___|_|  \___|_|  \___|_| |_|\___\___|  \___/\/ |_|   |_|  \___/ \__\___/ \__|\__, | .__/ \___|
                                                                                      |___/|_|         
*/
Object.assign(Reference, {
  key: {
    list: Symbol('Database:database.list'),
    getter: Symbol('Database:database.getter'),
    setter: Symbol('Database:database.setter'),
    fallback: {
      list: Symbol('Database:database.fallback.list'),
      getter: Symbol('Database:database.fallback.getter'), // database.fallback.getter
      setter: Symbol('Database:database.fallback.setter'),
    },
  },
})

/*
                   _        _                    ____       _                  _   _             
   _ __  _ __ ___ | |_ ___ | |_ _   _ _ __   ___|  _ \  ___| | ___  __ _  __ _| |_(_) ___  _ __  
  | '_ \| '__/ _ \| __/ _ \| __| | | | '_ \ / _ \ | | |/ _ \ |/ _ \/ _` |/ _` | __| |/ _ \| '_ \ 
  | |_) | | | (_) | || (_) | |_| |_| | |_) |  __/ |_| |  __/ |  __/ (_| | (_| | |_| | (_) | | | |
  | .__/|_|  \___/ \__\___/ \__|\__, | .__/ \___|____/ \___|_|\___|\__, |\__,_|\__|_|\___/|_| |_|
  |_|                           |___/|_|                           |___/                         
*/
Object.assign(entityPrototype, {
  //  concerete behavior initialization on the target instance.
  [Entity.reference.key.concereteBehavior]({ constructorCallback, currentConcereteBehavior }) {
    return new Proxy(constructorCallback, {
      apply(target, thisArg, argumentList) {
        let instance = Reflect.apply(...arguments)
        console.log('initialize instance in DB concerete behavior')
        MultipleDelegation.addDelegation({ targetObject: instance, delegationList: [currentConcereteBehavior] })
        return instance
      },
    })
  },
  [Database.reference.key.setter](
    /**
     * register plugins where each database has multiple implementations
     *  {
     *      [groupKey]: {
     *          [implementationKey]: <function>
     *      }
     *  }
     */
    pluginList, // database groupKeys matching the above class instance properties
    self = this,
  ) {
    self[Database.reference.key.list] ||= {
      databaseModelAdapter: {},
    }
    // add plugins to existing ones
    Object.entries(pluginList).forEach(([groupKey, implementationList]) => {
      assert(self[Database.reference.key.list][groupKey] !== undefined, '• database groupKey isn`t supported. Trying to add a database that the Database class does`t support.')
      self[Database.reference.key.list][groupKey] = Object.assign(self[Database.reference.key.list][groupKey], implementationList)
    })
  },
  /**
   * Retrieve database implementation according to parameter hierarchy (priority order) selection.
   * 1. Passed 'implementation' parameter.
   * 2. Default 'implementation' set in the '[Database:database.fallback.list]'.
   * 3. Fallback to first item in database object.
   */
  [Database.reference.key.getter]({
    pluginGroupKey, // the database group (object of implementations)
    implementation = null, // specific database implementation
    self = this,
  }) {
    assert(pluginGroupKey, '• "database" parameter must be set.')

    // return specific database
    if (implementation) return self[Database.reference.key.list][pluginGroupKey][implementation]

    // return default database if set.
    let defaultImplementation = self[Database.reference.key.fallback.getter]({ pluginGroupKey })
    if (defaultImplementation) return self[Database.reference.key.list][pluginGroupKey][defaultImplementation]

    // return first database implementation in the iterator
    let firstItemKey = Object.groupKeys(self[Database.reference.key.list][pluginGroupKey])[0]
    return self[Database.reference.key.list][pluginGroupKey][firstItemKey]
  },
  [Database.reference.key.fallback.setter](defaultPluginList: Object, self = this) {
    self[Database.reference.key.fallback.list] ||= {}
    Object.assign(self[Database.reference.key.fallback.list], defaultPluginList)
  },
  [Database.reference.key.fallback.getter]({ pluginGroupKey, self = this }) {
    return self[Database.reference.key.fallback.list][pluginGroupKey]
  },
})

/*
   ___       _ _   _       _ _         
  |_ _|_ __ (_) |_(_) __ _| (_)_______ 
   | || '_ \| | __| |/ _` | | |_  / _ \
   | || | | | | |_| | (_| | | |/ /  __/
  |___|_| |_|_|\__|_|\__,_|_|_/___\___|
*/
Database::Database[Constructable.reference.initialize.functionality].setter({
  // initialization for instance of Database - i.e. a concrete behavior of Database (an implemeantation)
  [Entity.reference.key.handleDataInstance]({ targetInstance, data }, previousResult /* in case multiple constructor function found and executed. */) {
    /*
      Supported database groupKeys: Each database is an object with multiple registered implementations
      • 'databaseModelAdaper' - database model functions for retriving node, dataItem, and other documents. should be async functions
    */
    let { defaultPlugin, pluginList } = data
    targetInstance[Database.reference.key.setter](pluginList)

    targetInstance[Database.reference.key.fallback.list] = {} // default plugins implementations
    if (defaultPlugin) targetInstance[Database.reference.key.fallback.setter](defaultPlugin) // set default plugins in case passed

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
Database.clientInterface = Database::Prototype[Constructable.reference.clientInterface.functionality].switch({ implementationKey: Entity.reference.key.instanceDelegatingToEntityInstancePrototype })({
  constructorImplementation: Entity.reference.key.handleDataInstance,
})
