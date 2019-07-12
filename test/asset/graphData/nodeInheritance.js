// Check ideas from `./documentation` folder notes.

export let nodeArray = [
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
      inheritance: 'node-key-2', // inheritance from another node
    },
  },
]

export let connection = [
  { properties: { key: 'connection-key-1', order: '1' }, source: 'node-key-1', destination: 'node-key-2' },
  { properties: { key: 'connection-key-2', order: '1' }, source: 'node-key-2', destination: 'node-key-2' },
]
