export let node = [
  {
    type: ['traversalStep'],
    key: 'node-key-1',
    // traversal configuration
    dataItemType: 'reference',
    processDataImplementation: 'returnDataItemKey',
  },
  {
    type: ['traversalStep'],
    key: 'node-key-2',
    // traversal configuration
    dataItemType: 'reference',
    processDataImplementation: 'returnDataItemKey',
  },

  /*
       _       _        ___ _                 
    __| | __ _| |_ __ _|_ _| |_ ___ _ __ ___  
   / _` |/ _` | __/ _` || || __/ _ \ '_ ` _ \ 
  | (_| | (_| | || (_| || || ||  __/ | | | | |
   \__,_|\__,_|\__\__,_|___|\__\___|_| |_| |_|
                                              
  */
  {
    type: ['executionProcess'],
    key: 'dataItem-key-1',
    resourceFileKey: '',
    initializationImplementationType: 'resourceFile',
  },
  {
    type: ['executionProcess'],
    key: 'dataItem-key-2',
    resourceFileKey: '',
    initializationImplementationType: 'resourceFile',
  },
]

export let conenction = [{ key: 'connection-key-x', source: 'node-key-1', destination: 'dataItem-key-1' }, { key: 'connection-key-z', source: 'node-key-2', destination: 'dataItem-key-2' }]
