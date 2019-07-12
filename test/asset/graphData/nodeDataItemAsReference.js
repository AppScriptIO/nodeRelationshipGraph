export let node = [
  {
    labels: ['Stage'],
    properties: {
      key: 'node-key-1',
      // traversal configuration
      dataItemlabels: 'reference',
      processDataImplementation: 'returnDataItemKey',
    },
  },
  {
    labels: ['Stage'],
    properties: {
      key: 'node-key-2',
      // traversal configuration
      dataItemlabels: 'reference',
      processDataImplementation: 'returnDataItemKey',
    },
  },

  /*
       _       _        ___ _                 
    __| | __ _| |_ __ _|_ _| |_ ___ _ __ ___  
   / _` |/ _` | __/ _` || || __/ _ \ '_ ` _ \ 
  | (_| | (_| | || (_| || || ||  __/ | | | | |
   \__,_|\__,_|\__\__,_|___|\__\___|_| |_| |_|
                                              
  */
  {
    labels: ['ExecutionProcess'],
    properties: {
      key: 'dataItem-key-1',
      resourceFileKey: '',
      initializationImplementationlabels: 'resourceFile',
    },
  },
  {
    labels: ['ExecutionProcess'],
    properties: {
      key: 'dataItem-key-2',
      resourceFileKey: '',
      initializationImplementationlabels: 'resourceFile',
    },
  },
]

export let conenction = [
  { properties: { key: 'connection-key-x' }, source: 'node-key-1', destination: 'dataItem-key-1' },
  { properties: { key: 'connection-key-z' }, source: 'node-key-2', destination: 'dataItem-key-2' },
]
