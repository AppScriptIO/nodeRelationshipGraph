// Check ideas from `./documentation` folder notes.

export let nodeArray = [
  {
    type: ['traversalStep', 'executionProcess'],
    key: 'node-key-1',
    name: 'dataItem-key-1',
  },
  {
    type: ['traversalStep', 'executionProcess'],
    key: 'node-key-2',
    name: 'dataItem-key-2',
    inheritance: 'node-key-2', // inheritance from another node
  },
]

export let connection = [
  { key: 'connection-key-1', source: 'node-key-1', destination: 'node-key-2', order: '1' },
  { key: 'connection-key-2', source: 'node-key-2', destination: 'node-key-2', order: '1' },
]
