// Control arrangement of nodes -
// nested data structure: position: { order: 1, placement: { type: 'after', connectionKey: 'x'}}

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

export let connection = [{ key: 'connection-key-1', order: '1', placement: ['after/before', 'connection-key-x'], source: 'node-key-1', destination: 'node-key-2' }]
