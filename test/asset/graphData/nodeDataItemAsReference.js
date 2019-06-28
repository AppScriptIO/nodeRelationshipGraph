export let nodeArray = [
  {
    label: { name: 'node' },
    key: 'node-key-1',
    dataItem: {
      key: 'dataItem-key-1',
    },
    connection: [],
    tag: {
      dataItemType: 'reference',
      processDataImplementation: 'returnDataItemKey',
    },
  },
  {
    label: { name: 'node' },
    key: 'node-key-2',
    dataItem: {
      key: 'dataItem-key-2',
    },
    tag: {
      dataItemType: 'reference',
      processDataImplementation: 'returnDataItemKey',
    },
  },
]

export let dataItemArray = [
  {
    key: 'dataItem-key-1',
    resourceFileKey: '',
    tag: {
      initializationImplementationType: 'resourceFile',
    },
  },
  {
    key: 'dataItem-key-2',
    resourceFileKey: '',
    tag: {
      initializationImplementationType: 'resourceFile',
    },
  },
]
