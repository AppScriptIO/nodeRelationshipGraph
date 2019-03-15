import assert from 'assert'

/**
 * Plugin system for supporting different graph implementation and database adapters.
*/
const self = class Plugin {

    defaultPlugin = {} // default plugins implementations
    // supported plugin keys - Each plugin is an object with multiple registered implementations
    databaseModelAdapter = {} // database model functions for retriving node, dataItem, and other documents. should be async functions
    graphTraversalImplementation = {}
    
    constructor(
        pluginList, // -> register plugins
        { // options
            defaultPlugin // -> set default plugins
        } = {}
    ) {
        this.registerPlugin(pluginList)
        if(defaultPlugin) this.setDefaultPlugin(defaultPlugin) // set default plugins in case passed
    }

    // register plugins where each plugin has multiple implementations
    registerPlugin(
        /**
         *  {
         *      [pluginKey]: {
         *          [implementationKey]: <function>
         *      }
         *  } 
         */    
        pluginList // plugin keys matching the above class instance properties 
    ) {
        // add plugins to existing ones
        Object.entries(pluginList).forEach(
            ([pluginKey, pluginImplementationList]) => {
                assert(this[pluginKey], '• plugin key isn`t supported. Trying to add a plugin that the Plugin class does`t support.')
                this[pluginKey] = Object.assign(this[pluginKey], pluginImplementationList)
            }
        )
    }
 
    /**
     * Set default plugin implementation to be retrived. 
     */
    setDefaultPlugin(defaultPluginList) {
        this.defaultPlugin = Object.assign(this.defaultPlugin, defaultPluginList)
    }

    /**
     * Retrieve plugin implementation according to parameter hierarchy (priority order) selection.
     * 1. Passed 'implementation' parameter.
     * 2. Default 'implementation' set in the 'defaultPlugin'. 
     * 3. Fallback to first item in plugin object.
     */
    getPlugin({ 
        plugin, // the plugin group (object of implementations)
        implementation = null // specific plugin implementation 
    }) { 
        assert(plugin, '• "plugin" parameter must be set.')

        // return specific plugin
        if(implementation)
            return this[plugin][implementation]

        // return default plugin if set.
        let defaultImplementation = this.getDefaultPlugin({ plugin })
        if(defaultImplementation) 
            return this[plugin][defaultImplementation]

        // return first plugin implementation in the iterator
        let firstItemKey = Object.keys(this[plugin])[0]
        return this[plugin][firstItemKey]
    }

    getDefaultPlugin({ plugin }) {
        return this.defaultPlugin[plugin] 
    }
}

export { self as Plugin }

