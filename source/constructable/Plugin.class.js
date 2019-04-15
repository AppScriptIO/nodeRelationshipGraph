import assert from 'assert'
import { Entity } from '@dependency/entity'

/**
 ** Plugin system for supporting different graph implementation and database adapters.
 */
export const Plugin = new Entity.clientInterface({ description: 'Plugin', instanceType: 'object' })

Plugin.reference
  |> (_ =>
    Object.assign(_, {
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
    }))

Plugin.prototypeDelegation
  |> (_ =>
    Object.assign(_, {
      [Plugin.reference.plugin.setter](
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
        self[Plugin.reference.plugin.list] ||= {
          databaseModelAdapter: {},
        }
        // add plugins to existing ones
        Object.entries(pluginList).forEach(([groupKey, implementationList]) => {
          assert(self[Plugin.reference.plugin.list][groupKey] !== undefined, '• plugin groupKey isn`t supported. Trying to add a plugin that the Plugin class does`t support.')
          self[Plugin.reference.plugin.list][groupKey] = Object.assign(self[Plugin.reference.plugin.list][groupKey], implementationList)
        })
      },
      /**
       * Retrieve plugin implementation according to parameter hierarchy (priority order) selection.
       * 1. Passed 'implementation' parameter.
       * 2. Default 'implementation' set in the '[Plugin:plugin.fallback.list]'.
       * 3. Fallback to first item in plugin object.
       */
      [Plugin.reference.plugin.getter]({
        pluginGroupKey, // the plugin group (object of implementations)
        implementation = null, // specific plugin implementation
        self = this,
      }) {
        assert(pluginGroupKey, '• "plugin" parameter must be set.')

        // return specific plugin
        if (implementation) return self[Plugin.reference.plugin.list][pluginGroupKey][implementation]

        // return default plugin if set.
        let defaultImplementation = self[Plugin.reference.plugin.fallback.getter]({ pluginGroupKey })
        if (defaultImplementation) return self[Plugin.reference.plugin.list][pluginGroupKey][defaultImplementation]

        // return first plugin implementation in the iterator
        let firstItemKey = Object.groupKeys(self[Plugin.reference.plugin.list][pluginGroupKey])[0]
        return self[Plugin.reference.plugin.list][pluginGroupKey][firstItemKey]
      },
      [Plugin.reference.plugin.fallback.setter](defaultPluginList: Object, self = this) {
        self[Plugin.reference.plugin.fallback.list] ||= {}
        Object.assign(self[Plugin.reference.plugin.fallback.list], defaultPluginList)
      },
      [Plugin.reference.plugin.fallback.getter]({ pluginGroupKey }) {
        return self[Plugin.reference.plugin.fallback.list][pluginGroupKey]
      },
    }))

Plugin[Entity.reference.instance.initialize.setter.list]({
  data({ data = {}, instanceObject }) {
    let { defaultPlugin, pluginList } = data
    instanceObject[Plugin.reference.plugin.fallback.list] = {} // default plugins implementations
    // supported plugin groupKeys - Each plugin is an object with multiple registered implementations
    instanceObject.databaseModelAdapter = {} // database model functions for retriving node, dataItem, and other documents. should be async functions
    instanceObject.graphTraversalImplementation = {}

    instanceObject[Plugin.reference.plugin.setter](pluginList)
    if (defaultPlugin) instanceObject[Plugin.reference.plugin.fallback.setter](defaultPlugin) // set default plugins in case passed
    //   Object.assign(this, data) // apply data to instance
    return instanceObject
  },
})

// Client itnerface
let configuredConstructable =
  Plugin[Entity.reference.configuredConstructable.switch]({ implementationKey: Entity.reference.configuredConstructable.key.prototypeInstanceConstructable })
  |> (g => {
    g.next('intermittent')
    return g.next({
      description: 'EntityConstructableForClientInterfaceData',
      initializeFallback: 'data',
    }).value
  })
Plugin.clientInterface =
  Plugin[Entity.reference.clientInterface.switch]({ implementationKey: Entity.reference.clientInterface.key.prototypeConstruct })
  |> (g => {
    g.next('intermittent')
    return g.next({ configuredConstructable }).value
  })
