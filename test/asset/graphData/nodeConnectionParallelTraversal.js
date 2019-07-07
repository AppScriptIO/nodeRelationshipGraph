export let node = [
  {
    type: ['Stage', 'ExecutionProcess'],
    key: 'node-key-0',
    // data item
    name: 'dataItem-key-0',
    timerDelay: 0,
    // traversal config
    processDataImplementation: 'timeout',
    traverseNodeImplementation: 'allPromise' || 'raceFirstPromise',
  },
  {
    type: ['Stage', 'ExecutionProcess'],
    key: 'node-key-1',
    // data item
    name: 'dataItem-key-1',
    timerDelay: 90,
    // traversal config
    processDataImplementation: 'timeout',
  },
  {
    type: ['Stage', 'ExecutionProcess'],
    key: 'node-key-2',
    // data item
    name: 'dataItem-key-2',
    timerDelay: 50,
    // traversal config
    processDataImplementation: 'timeout',
  },
  {
    type: ['Stage', 'ExecutionProcess'],
    key: 'node-key-3',
    // data item
    name: 'dataItem-key-3',
    timerDelay: 20,
    // traversal config
    processDataImplementation: 'timeout',
  },
  {
    type: ['Stage', 'ExecutionProcess'],
    key: 'node-key-4',
    // data item
    name: 'dataItem-key-4',
    timerDelay: 70,
    // traversal config
    processDataImplementation: 'timeout',
  },
]

export let connection = [
  { key: 'connection-key-x', source: 'node-key-0', destination: 'node-key-1' },
  { key: 'connection-key-c', source: 'node-key-0', destination: 'node-key-2' },
  { key: 'connection-key-v', source: 'node-key-0', destination: 'node-key-3' },
  { key: 'connection-key-b', source: 'node-key-0', destination: 'node-key-4' },
]
