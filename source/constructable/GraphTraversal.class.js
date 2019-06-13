import assert from 'assert'
import { Entity, Constructable, symbol } from '@dependency/entity'

/**
 ** GraphTraversal system for supporting different graph implementation.
 * Create concrete behavior of plugin that will be used in the client target.
 */
export const { class: GraphTraversal, reference: Reference, constructablePrototype: Prototype, entityPrototype } = new Entity.clientInterface({ description: 'GraphTraversal' })

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
    list: Symbol('GraphTraversal:plugin.list'),
    getter: Symbol('GraphTraversal:plugin.getter'),
    setter: Symbol('GraphTraversal:plugin.setter'),
    fallback: {
      list: Symbol('GraphTraversal:plugin.fallback.list'),
      getter: Symbol('GraphTraversal:plugin.fallback.getter'), // plugin.fallback.getter
      setter: Symbol('GraphTraversal:plugin.fallback.setter'),
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
  traverseGraph() {
    console.log('traversing graph')
    return null
  },

  /**
   * register plugins where each plugin has multiple implementations
   *  {
   *      [groupKey]: {
   *          [implementationKey]: <function>
   *      }
   *  }
   */
  [GraphTraversal.reference.key.setter](
    pluginList, // plugin groupKeys matching the above class instance properties
    self = this,
  ) {
    self[GraphTraversal.reference.key.list] ||= {
      databaseModelAdapter: {},
      graphTraversalImplementation: {},
    }
    // add plugins to existing ones
    Object.entries(pluginList).forEach(([groupKey, implementationList]) => {
      assert(self[GraphTraversal.reference.key.list][groupKey] !== undefined, '• plugin groupKey isn`t supported. Trying to add a plugin that the GraphTraversal class does`t support.')
      self[GraphTraversal.reference.key.list][groupKey] = Object.assign(self[GraphTraversal.reference.key.list][groupKey], implementationList)
    })
  },
  /**
   * Retrieve plugin implementation according to parameter hierarchy (priority order) selection.
   * 1. Passed 'implementation' parameter.
   * 2. Default 'implementation' set in the '[GraphTraversal:plugin.fallback.list]'.
   * 3. Fallback to first item in plugin object.
   */
  [GraphTraversal.reference.key.getter]({
    pluginGroupKey, // the plugin group (object of implementations)
    implementation = null, // specific plugin implementation
    self = this,
  }) {
    assert(pluginGroupKey, '• "plugin" parameter must be set.')

    // return specific plugin
    if (implementation) return self[GraphTraversal.reference.key.list][pluginGroupKey][implementation]

    // return default plugin if set.
    let defaultImplementation = self[GraphTraversal.reference.key.fallback.getter]({ pluginGroupKey })
    if (defaultImplementation) return self[GraphTraversal.reference.key.list][pluginGroupKey][defaultImplementation]

    // return first plugin implementation in the iterator
    let firstItemKey = Object.groupKeys(self[GraphTraversal.reference.key.list][pluginGroupKey])[0]
    return self[GraphTraversal.reference.key.list][pluginGroupKey][firstItemKey]
  },
  [GraphTraversal.reference.key.fallback.setter](defaultPluginList: Object, self = this) {
    self[GraphTraversal.reference.key.fallback.list] ||= {}
    Object.assign(self[GraphTraversal.reference.key.fallback.list], defaultPluginList)
  },
  [GraphTraversal.reference.key.fallback.getter]({ pluginGroupKey, self = this }) {
    return self[GraphTraversal.reference.key.fallback.list][pluginGroupKey]
  },
})

/*
   ___       _ _   _       _ _         
  |_ _|_ __ (_) |_(_) __ _| (_)_______ 
   | || '_ \| | __| |/ _` | | |_  / _ \
   | || | | | | |_| | (_| | | |/ /  __/
  |___|_| |_|_|\__|_|\__,_|_|_/___\___|
*/
GraphTraversal::GraphTraversal[Constructable.reference.initialize.functionality].setter({
  /*
    initialization for instance of GraphTraversal.
    Supported plugin groupKeys: Each plugin is an object with multiple registered implementations
    • 'databaseModelAdaper' - database model functions for retriving node, dataItem, and other documents. should be async functions
    • 'graphTraversalImplementation' - used to traverse node graphs.
  */
  [Entity.reference.key.handleDataInstance]({ targetInstance, data }, previousResult /* in case multiple constructor function found and executed. */) {
    let { defaultPlugin, pluginList } = data
    targetInstance[GraphTraversal.reference.key.setter](pluginList)

    targetInstance[GraphTraversal.reference.key.fallback.list] = {} // default plugins implementations
    if (defaultPlugin) targetInstance[GraphTraversal.reference.key.fallback.setter](defaultPlugin) // set default plugins in case passed

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
GraphTraversal.clientInterface = GraphTraversal::Prototype[Constructable.reference.clientInterface.functionality].switch({
  implementationKey: Entity.reference.key.instanceDelegatingToEntityInstancePrototype,
})({
  constructorImplementation: Entity.reference.key.handleDataInstance,
})
