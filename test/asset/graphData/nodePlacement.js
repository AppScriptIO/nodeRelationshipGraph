// Control arrangement of nodes -
// nested data structure: position: { order: 1, placement: { labels: 'after', connectionKey: 'x'}}

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

export let connection = [{ properties: { key: 'connection-key-1', order: '1', placement: ['after/before', 'connection-key-x'] }, source: 'node-key-1', destination: 'node-key-2' }]
