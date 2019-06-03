import assert from 'assert'
import { Entity, Constructable, symbol } from '@dependency/entity'

/**
 ** Plugin system for supporting different graph implementation and database adapters.
 */
export const { class: Plugin, reference: Reference, constructablePrototype: Prototype, entityPrototype } = new Entity.clientInterface({ description: 'Plugin' })

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
    list: Symbol('Plugin:plugin.list'),
    getter: Symbol('Plugin:plugin.getter'),
    setter: Symbol('Plugin:plugin.setter'),
    fallback: {
      list: Symbol('Plugin:plugin.fallback.list'),
      getter: Symbol('Plugin:plugin.fallback.getter'), // plugin.fallback.getter
      setter: Symbol('Plugin:plugin.fallback.setter'),
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
  [Plugin.reference.key.setter](
    /**
     * register plugins where each plugin has multiple implementations
     *  {
     *      [groupKey]: {
     *          [implementationKey]: <function>
     *      }
     *  }
     */
    pluginList, // plugin groupKeys matching the above class instance properties
    self = this,
  ) {
    self[Plugin.reference.key.list] ||= {
      databaseModelAdapter: {},
      graphTraversalImplementation: {},
    }
    // add plugins to existing ones
    Object.entries(pluginList).forEach(([groupKey, implementationList]) => {
      assert(self[Plugin.reference.key.list][groupKey] !== undefined, '• plugin groupKey isn`t supported. Trying to add a plugin that the Plugin class does`t support.')
      self[Plugin.reference.key.list][groupKey] = Object.assign(self[Plugin.reference.key.list][groupKey], implementationList)
    })
  },
  /**
   * Retrieve plugin implementation according to parameter hierarchy (priority order) selection.
   * 1. Passed 'implementation' parameter.
   * 2. Default 'implementation' set in the '[Plugin:plugin.fallback.list]'.
   * 3. Fallback to first item in plugin object.
   */
  [Plugin.reference.key.getter]({
    pluginGroupKey, // the plugin group (object of implementations)
    implementation = null, // specific plugin implementation
    self = this,
  }) {
    assert(pluginGroupKey, '• "plugin" parameter must be set.')

    // return specific plugin
    if (implementation) return self[Plugin.reference.key.list][pluginGroupKey][implementation]

    // return default plugin if set.
    let defaultImplementation = self[Plugin.reference.key.fallback.getter]({ pluginGroupKey })
    if (defaultImplementation) return self[Plugin.reference.key.list][pluginGroupKey][defaultImplementation]

    // return first plugin implementation in the iterator
    let firstItemKey = Object.groupKeys(self[Plugin.reference.key.list][pluginGroupKey])[0]
    return self[Plugin.reference.key.list][pluginGroupKey][firstItemKey]
  },
  [Plugin.reference.key.fallback.setter](defaultPluginList: Object, self = this) {
    self[Plugin.reference.key.fallback.list] ||= {}
    Object.assign(self[Plugin.reference.key.fallback.list], defaultPluginList)
  },
  [Plugin.reference.key.fallback.getter]({ pluginGroupKey }) {
    return self[Plugin.reference.key.fallback.list][pluginGroupKey]
  },
})

/*
   ___       _ _   _       _ _         
  |_ _|_ __ (_) |_(_) __ _| (_)_______ 
   | || '_ \| | __| |/ _` | | |_  / _ \
   | || | | | | |_| | (_| | | |/ /  __/
  |___|_| |_|_|\__|_|\__,_|_|_/___\___|
*/
Plugin[Constructable.reference.initialize.functionality].setter({
  data({ data = {}, instanceObject }) {
    let { defaultPlugin, pluginList } = data
    instanceObject[Plugin.reference.key.fallback.list] = {} // default plugins implementations
    // supported plugin groupKeys - Each plugin is an object with multiple registered implementations
    instanceObject.databaseModelAdapter = {} // database model functions for retriving node, dataItem, and other documents. should be async functions
    instanceObject.graphTraversalImplementation = {}

    instanceObject[Plugin.reference.key.setter](pluginList)
    if (defaultPlugin) instanceObject[Plugin.reference.key.fallback.setter](defaultPlugin) // set default plugins in case passed
    //   Object.assign(this, data) // apply data to instance
    return instanceObject
  },
})

/*
    ____ _ _            _     _ _                    __                
   / ___| (_) ___ _ __ | |_  (_) |_ _ __   ___ _ __ / _| __ _  ___ ___ 
  | |   | | |/ _ \ '_ \| __| | | __| '_ \ / _ \ '__| |_ / _` |/ __/ _ \
  | |___| | |  __/ | | | |_  | | |_| | | |  __/ |  |  _| (_| | (_|  __/
   \____|_|_|\___|_| |_|\__| |_|\__|_| |_|\___|_|  |_|  \__,_|\___\___|
*/
Plugin.clientInterface =
  Plugin::Prototype[Constructable.reference.clientInterface.functionality].switch({ implementationKey: Entity.reference.key.instanceDelegatingToEntityInstancePrototype })
  |> (g =>
    g.next('intermittent') &&
    g.next({
      constructorImplementation: Entity.reference.key.data,
      argumentListAdapter: argumentList => {
        argumentList[0] = { data: argumentList[0] }
        return argumentList
      },
    }).value)
