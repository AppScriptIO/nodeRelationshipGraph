import assert from 'assert'
import { inherits as extend } from 'util'
import { extendFromNull as inheritNull } from '../utility/extendConstructable.js'

/**
 ** Plugin system for supporting different graph implementation and database adapters.
 */
export function PluginFunction({ superConstructor = null } = {}) {
  let self = function Plugin(args, { constructor = 'data' }: { constructor: 'data' }) {
    this.defaultPlugin = {} // default plugins implementations
    // supported plugin keys - Each plugin is an object with multiple registered implementations
    this.databaseModelAdapter = {} // database model functions for retriving node, dataItem, and other documents. should be async functions
    this.graphTraversalImplementation = {}

    return this::self.construction[constructor](...args) // redirect construct to particular implementation.
  }

  /* Delegate to Superconstructor */
  superConstructor == null ? inheritNull(self) : extend(self, superConstructor)

  /* constructor implementations */
  self.construction = {
    data(pluginList, { defaultPlugin } = {}) {
      this.registerPlugin(pluginList)
      if (defaultPlugin) this.setDefaultPlugin(defaultPlugin) // set default plugins in case passed
      //   Object.assign(this, data) // apply data to instance
      return this
    },
  }

  self = new Proxy(self, {
    set(target, property, value) {
      if (property == 'prototype') return Object.assign(target.prototype, value)
      else return Reflect.set(...arguments)
    },
  })

  self.prototype = {
    // register plugins where each plugin has multiple implementations
    registerPlugin(
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
    setDefaultPlugin(defaultPluginList) {
      this.defaultPlugin = Object.assign(this.defaultPlugin, defaultPluginList)
    },

    /**
     * Retrieve plugin implementation according to parameter hierarchy (priority order) selection.
     * 1. Passed 'implementation' parameter.
     * 2. Default 'implementation' set in the 'defaultPlugin'.
     * 3. Fallback to first item in plugin object.
     */
    getPlugin({
      plugin, // the plugin group (object of implementations)
      implementation = null, // specific plugin implementation
    }) {
      assert(plugin, '• "plugin" parameter must be set.')

      // return specific plugin
      if (implementation) return this[plugin][implementation]

      // return default plugin if set.
      let defaultImplementation = this.getDefaultPlugin({ plugin })
      if (defaultImplementation) return this[plugin][defaultImplementation]

      // return first plugin implementation in the iterator
      let firstItemKey = Object.keys(this[plugin])[0]
      return this[plugin][firstItemKey]
    },

    getDefaultPlugin({ plugin }) {
      return this.defaultPlugin[plugin]
    },
  }

  return self
}
