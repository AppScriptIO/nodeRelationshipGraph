// port could be an input or output port.

export let node = [
  {
    type: ['traversalStep', 'executionProcess'],
    key: 'node-key-0',
    name: 'dataItem-key-0',
    traverseNodeImplementation: 'chronological',
    processDataImplementation: 'returnDataItemKey',
  },
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
  {
    type: ['traversalStep', 'executionProcess'],
    key: 'node-key-3',
    name: 'dataItem-key-3',
  },
  {
    type: ['traversalStep', 'executionProcess'],
    key: 'node-key-4',
    name: 'dataItem-key-4',
  },
  {
    type: ['traversalStep', 'executionProcess'],
    key: 'node-key-5',
    name: 'dataItem-key-5',
  },
  /*
                    _   
   _ __   ___  _ __| |_ 
  | '_ \ / _ \| '__| __|
  | |_) | (_) | |  | |_ 
  | .__/ \___/|_|   \__|
  |_|                   
  */
  {
    type: ['port'],
    key: 'port-key-1',
    order: 1,
    direction: 'output',
    traverseNodeImplementation: 'chronological',
  },
  {
    type: ['port'],
    key: 'port-key-2',
    order: 2,
    direction: 'output',
    traverseNodeImplementation: 'chronological',
  },
]

export let connection = [
  { key: 'connection-key-p', order: '2', source: ['node-key-0', 'port-key-2'], destination: ['node-key-1', null] },
  { key: 'connection-key-z', order: '1', source: ['node-key-0', 'port-key-1'], destination: ['node-key-2', null] },
  { key: 'connection-key-y', order: '3', source: ['node-key-0', 'port-key-2'], destination: ['node-key-3', null] },
  { key: 'connection-key-t', order: '2', source: ['node-key-0', 'port-key-1'], destination: ['node-key-4', null] },
  { key: 'connection-key-c', order: '1', source: ['node-key-0', 'port-key-2'], destination: ['node-key-5', null] },
]
