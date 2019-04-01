import assert from 'assert'
import { Entity } from './Entity.class.js'

/**
 ** Plugin system for supporting different graph implementation and database adapters.
 */
export const Plugin = Object.create(Entity.prototypeDelegation)

Object.assign(Plugin, {
  reference: {
    registerPlugin: Symbol('registerPlugin'),
    setDefaultPlugin: Symbol('setDefaultPlugin'),
    getPlugin: Symbol('getPlugin'),
    getDefaultPlugin: Symbol('getDefaultPlugin'),
  },
  prototypeDelegation: Object.create(Object.prototype),
  constructable: function() {},
})

Object.assign(Plugin.prototypeDelegation, {
  // register plugins where each plugin has multiple implementations
  [Plugin.reference.registerPlugin](
    /**
     *  {
     *      [pluginKey]: {
     *          [implementationKey]: <function>
     *      }
     *  }
     */
    pluginList, // plugin keys matching the above class instance properties
  ) {
    // add plugins to existing ones
    Object.entries(pluginList).forEach(([pluginKey, pluginImplementationList]) => {
      assert(this[pluginKey], '• plugin key isn`t supported. Trying to add a plugin that the Plugin class does`t support.')
      this[pluginKey] = Object.assign(this[pluginKey], pluginImplementationList)
    })
  },

  /**
   * Set default plugin implementation to be retrived.
   */
  [Plugin.reference.setDefaultPlugin](defaultPluginList) {
    this.defaultPlugin = Object.assign(this.defaultPlugin, defaultPluginList)
  },

  /**
   * Retrieve plugin implementation according to parameter hierarchy (priority order) selection.
   * 1. Passed 'implementation' parameter.
   * 2. Default 'implementation' set in the 'defaultPlugin'.
   * 3. Fallback to first item in plugin object.
   */
  [Plugin.reference.getPlugin]({
    plugin, // the plugin group (object of implementations)
    implementation = null, // specific plugin implementation
  }) {
    assert(plugin, '• "plugin" parameter must be set.')

    // return specific plugin
    if (implementation) return this[plugin][implementation]

    // return default plugin if set.
    let defaultImplementation = this[Plugin.reference.getDefaultPlugin]({ plugin })
    if (defaultImplementation) return this[plugin][defaultImplementation]

    // return first plugin implementation in the iterator
    let firstItemKey = Object.keys(this[plugin])[0]
    return this[plugin][firstItemKey]
  },

  [Plugin.reference.getDefaultPlugin]({ plugin }) {
    return this.defaultPlugin[plugin]
  },
})

Plugin[Entity.reference.prototypeInstance.setter.prototypeDelegation]({
  // default prototypeDelegation
  defaultPrototype: Plugin.prototypeDelegation,
  entity: Plugin,
})

Plugin[Entity.reference.prototypeInstance.setter.instantiate]({
  defaultPrototype({ instanceObject, prototypeDelegation } = {}) {
    prototypeDelegation ||= Plugin[Entity.reference.prototypeInstance.getter.prototypeDelegation]('defaultPrototype')
    instanceObject ||= Object.create(prototypeDelegation)
    return instanceObject
  },
  entityPrototype({ instanceObject, prototypeDelegation }) {
    prototypeDelegation ||= Plugin[Entity.reference.prototypeInstance.getter.prototypeDelegation]('entity')
    instanceObject ||= Object.create(prototypeDelegation)
    return instanceObject
  },
})

Plugin[Entity.reference.prototypeInstance.setter.initialize]({
  data([{ pluginList, defaultPlugin } = {}], { instanceObject }) {
    instanceObject.defaultPlugin = {} // default plugins implementations
    // supported plugin keys - Each plugin is an object with multiple registered implementations
    instanceObject.databaseModelAdapter = {} // database model functions for retriving node, dataItem, and other documents. should be async functions
    instanceObject.graphTraversalImplementation = {}

    instanceObject[Plugin.reference.registerPlugin](pluginList)
    if (defaultPlugin) instanceObject[Plugin.reference.setDefaultPlugin](defaultPlugin) // set default plugins in case passed
    //   Object.assign(this, data) // apply data to instance
    return instanceObject
  },
})
