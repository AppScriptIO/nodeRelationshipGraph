/**
 * Graph basic form with connection :
 * connection - provides all edges of a specific node
 **/
export let node = [
  {
    labels: ['Stage', 'ExecutionProcess'],
    properties: {
      key: 'node-key-1',
      name: 'dataItem-key-1',
    },
  },
  {
    labels: ['Stage', 'ExecutionProcess'],
    properties: {
      key: 'node-key-2',
      name: 'dataItem-key-2',
    },
  },
]

export let connection = [
  {
    source: 'node-key-1',
    destination: 'node-key-2',
    properties: { key: 'connection-key-1', order: 1 },
  },
]
