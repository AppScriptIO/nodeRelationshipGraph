/**
 * Graph basic form with connection :
 * connection - provides all edges of a specific node
 **/
export let node = [
  {
    type: ['traversalStep', 'executionProcess'],
    key: 'node-key-1',
    name: 'dataItem-key-1',
  },
  {
    type: ['traversalStep', 'executionProcess'],
    key: 'node-key-2',
    name: 'dataItem-key-2',
  },
]

export let connection = [{ key: 'connection-key-1', source: 'node-key-1', destination: 'node-key-2', order: '1' }]
