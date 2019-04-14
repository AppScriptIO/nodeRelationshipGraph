import assert from 'assert'
import { Entity } from '@dependency/entity'

/**
 ** Plugin system for supporting different graph implementation and database adapters.
 */
export const Reference = {
  plugin: {
    list: Symbol('Plugin:plugin.list'),
    getter: Symbol('Plugin:plugin.getter'),
    setter: Symbol('Plugin:plugin.setter'),
    fallback: {
      list: Symbol('Plugin:plugin.fallback.list'),
      getter: Symbol('Plugin:plugin.fallback.getter'), // plugin.fallback.getter
      setter: Symbol('Plugin:plugin.fallback.setter'),
    },
  },
}

export const Prototype = {
  [Reference.plugin.setter](
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
    self[Reference.plugin.list] ||= {}
    // add plugins to existing ones
    Object.entries(pluginList).forEach(([groupKey, implementationList]) => {
      assert(self[Reference.plugin.list][groupKey], '• plugin groupKey isn`t supported. Trying to add a plugin that the Plugin class does`t support.')
      self[Reference.plugin.list][groupKey] = Object.assign(self[Reference.plugin.list][groupKey], implementationList)
    })
  },
  /**
   * Retrieve plugin implementation according to parameter hierarchy (priority order) selection.
   * 1. Passed 'implementation' parameter.
   * 2. Default 'implementation' set in the '[Plugin:plugin.fallback.list]'.
   * 3. Fallback to first item in plugin object.
   */
  [Reference.plugin.getter]({
    pluginGroupKey, // the plugin group (object of implementations)
    implementation = null, // specific plugin implementation
    self = this,
  }) {
    assert(pluginGroupKey, '• "plugin" parameter must be set.')

    // return specific plugin
    if (implementation) return self[Reference.plugin.list][pluginGroupKey][implementation]

    // return default plugin if set.
    let defaultImplementation = self[Reference.plugin.fallback.getter]({ pluginGroupKey })
    if (defaultImplementation) return self[Reference.plugin.list][pluginGroupKey][defaultImplementation]

    // return first plugin implementation in the iterator
    let firstItemKey = Object.groupKeys(self[Reference.plugin.list][pluginGroupKey])[0]
    return self[Reference.plugin.list][pluginGroupKey][firstItemKey]
  },
  [Reference.plugin.fallback.setter](defaultPluginList: Object, self = this) {
    self[Reference.plugin.fallback.list] ||= {}
    Object.assign(self[Reference.plugin.fallback.list], defaultPluginList)
  },
  [Reference.plugin.fallback.getter]({ pluginGroupKey }) {
    return self[Reference.plugin.fallback.list][pluginGroupKey]
  },
}

export const Plugin = new Entity.clientInterface({ description: 'Plugin', instanceType: 'object' })

Object.assign(Plugin, {
  reference: Reference,
  prototypeDelegation: Prototype,
})

Plugin[Entity.reference.instance.initialize.setter.list]({
  data([{ pluginList, defaultPlugin } = {}], { instanceObject }) {
    instanceObject[plugin.fallback.list] = {} // default plugins implementations
    // supported plugin groupKeys - Each plugin is an object with multiple registered implementations
    instanceObject.databaseModelAdapter = {} // database model functions for retriving node, dataItem, and other documents. should be async functions
    instanceObject.graphTraversalImplementation = {}

    instanceObject[Reference.plugin.setter](pluginList)
    if (defaultPlugin) instanceObject[Reference.plugin.fallback.setter](defaultPlugin) // set default plugins in case passed
    //   Object.assign(this, data) // apply data to instance
    return instanceObject
  },
})

// Create client interface
const configuredConstructable = Plugin[Entity.reference.configuredConstructable.switch]([
  {
    description: 'pluginConstructable',
    instantiateImplementationKey: Entity.reference.instance.instantiate.key.prototypeObjectInstance,
    initializeImplementationKey: 'data',
  },
])
Plugin.clientInterface = Plugin[Entity.reference.clientInterface.switch](
  [
    {
      configuredConstructable,
    },
  ],
  {
    implementationKey: Entity.reference.clientInterface.key.prototypeConstruct,
  },
)
