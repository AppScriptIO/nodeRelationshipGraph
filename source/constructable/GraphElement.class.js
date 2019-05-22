import { Entity, Constructable } from '@dependency/entity'

interface GraphElementData {
  label: object;
  key: string | number;
  [key: string]: any; // optional other fields
}

export const GraphElement = new Entity.clientInterface({ description: 'GraphElement' })

/*
   ____       __                                 ___     ____            _        _                    
  |  _ \ ___ / _| ___ _ __ ___ _ __   ___ ___   ( _ )   |  _ \ _ __ ___ | |_ ___ | |_ _   _ _ __   ___ 
  | |_) / _ \ |_ / _ \ '__/ _ \ '_ \ / __/ _ \  / _ \/\ | |_) | '__/ _ \| __/ _ \| __| | | | '_ \ / _ \
  |  _ <  __/  _|  __/ | |  __/ | | | (_|  __/ | (_>  < |  __/| | | (_) | || (_) | |_| |_| | |_) |  __/
  |_| \_\___|_|  \___|_|  \___|_| |_|\___\___|  \___/\/ |_|   |_|  \___/ \__\___/ \__|\__, | .__/ \___|
                                                                                      |___/|_|         
*/
const Reference = Object.assign(GraphElement[Constructable['reference'].reference], {})
const Prototype = Object.assign(GraphElement[Constructable['reference'].prototype], {
  getKey: function(key) {
    return this.key
  },
})

/*
   _       _ _   _       _ _         
  (_)_ __ (_) |_(_) __ _| (_)_______ 
  | | '_ \| | __| |/ _` | | |_  / _ \
  | | | | | | |_| | (_| | | |/ /  __/
  |_|_| |_|_|\__|_|\__,_|_|_/___\___|
*/
Prototype[Constructable['reference'].initialize.setter.list]({
  //* constructor that is made to work with the plugin functionality.
  key([{ key }: { key: string | number }], { instanceObject, prototypeDelegation }) {
    instanceObject.key = key
    let data = true || instanceObject.plugin.databaseModelAdapter({ key: instanceObject.key })
    Object.assign(instanceObject, data)
    return instanceObject
  },
})

/*
                       _                   _             
    ___ ___  _ __  ___| |_ _ __ _   _  ___| |_ ___  _ __ 
   / __/ _ \| '_ \/ __| __| '__| | | |/ __| __/ _ \| '__|
  | (_| (_) | | | \__ \ |_| |  | |_| | (__| || (_) | |   
   \___\___/|_| |_|___/\__|_|   \__,_|\___|\__\___/|_|   
*/
Prototype[Constructable['reference'].constructor.setter.list]({
  plugin(args, { self = this, instanceObject }) {
    instanceObject ||= Object.create(GraphElement)
    //! Apply multiple inheritance from argument list instances.
    // instanceObject.prototypeDelegatedInstance = (...argumentList) => self::self.prototypeDelegatedInstance.construct(argumentList, { implementationKey: 'key' })
    return instanceObject
  },
})

/*
        _ _            _   ___       _             __                
    ___| (_) ___ _ __ | |_|_ _|_ __ | |_ ___ _ __ / _| __ _  ___ ___ 
   / __| | |/ _ \ '_ \| __|| || '_ \| __/ _ \ '__| |_ / _` |/ __/ _ \
  | (__| | |  __/ | | | |_ | || | | | ||  __/ |  |  _| (_| | (_|  __/
   \___|_|_|\___|_| |_|\__|___|_| |_|\__\___|_|  |_|  \__,_|\___\___|
*/
GraphElement.clientInterfaceData =
  Prototype[Constructable['reference'].clientInterface.switch]({ implementationKey: Constructable['reference'].clientInterface.key.constructable }) |> (g => g.next('intermittent') && g.next().value)
