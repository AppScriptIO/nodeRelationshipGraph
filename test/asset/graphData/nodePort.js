// port could be an input or output port.

export let node = [
  {
    labels: ['Stage', 'ExecutionProcess'],
    properties: {
      key: 'node-key-0',
      name: 'dataItem-key-0',
      traverseNodeImplementation: 'chronological',
      processDataImplementation: 'returnDataItemKey',
    },
  },
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
  {
    labels: ['Stage', 'ExecutionProcess'],
    properties: {
      key: 'node-key-3',
      name: 'dataItem-key-3',
    },
  },
  {
    labels: ['Stage', 'ExecutionProcess'],
    properties: {
      key: 'node-key-4',
      name: 'dataItem-key-4',
    },
  },
  {
    labels: ['Stage', 'ExecutionProcess'],
    properties: {
      key: 'node-key-5',
      name: 'dataItem-key-5',
    },
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
    labels: ['port'],
    properties: {
      key: 'port-key-1',
      direction: 'output',
      traverseNodeImplementation: 'chronological',
    },
  },
  {
    labels: ['port'],
    properties: {
      key: 'port-key-2',
      direction: 'output',
      traverseNodeImplementation: 'chronological',
    },
  },
]

export let connection = [
  { properties: { key: 'connection-key-p1', order: '1' }, source: 'node-key-0', destination: 'port-key-1' },
  { properties: { key: 'connection-key-p2', order: '2' }, source: 'node-key-0', destination: 'port-key-2' },
  { properties: { key: 'connection-key-u', order: '2' }, source: ['node-key-0', 'port-key-2'], destination: ['node-key-1', null] },
  { properties: { key: 'connection-key-z', order: '1' }, source: ['node-key-0', 'port-key-1'], destination: ['node-key-2', null] },
  { properties: { key: 'connection-key-y', order: '3' }, source: ['node-key-0', 'port-key-2'], destination: ['node-key-3', null] },
  { properties: { key: 'connection-key-t', order: '2' }, source: ['node-key-0', 'port-key-1'], destination: ['node-key-4', null] },
  { properties: { key: 'connection-key-c', order: '1' }, source: ['node-key-0', 'port-key-2'], destination: ['node-key-5', null] },
]
