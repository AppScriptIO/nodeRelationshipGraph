export let nodeArray = [
  {
    label: { name: 'node' },
    key: 'node-key-0',
    dataItem: {
      key: 'dataItem-key-0',
    },
    connection: [
      {
        key: 'connection-key-p', // pathPointerKey
        source: {
          portKey: 'port-key-2',
          position: {
            order: '2',
          },
        },
        destination: {
          node: [
            {
              key: 'node-key-1',
              port: null, // null uses default.
            },
          ],
        },
        tag: {
          direction: 'outgoing', // 'ingoing'/'outgoing'
        },
      },
      {
        key: 'connection-key-z', // pathPointerKey
        source: {
          portKey: 'port-key-1',
          position: {
            order: '1',
          },
        },
        destination: {
          node: [
            {
              key: 'node-key-2',
              port: null, // null uses default.
            },
          ],
        },
        tag: {
          direction: 'outgoing', // 'ingoing'/'outgoing'
        },
      },
      {
        key: 'connection-key-y', // pathPointerKey
        source: {
          portKey: 'port-key-2',
          position: {
            order: '3',
          },
        },
        destination: {
          node: [
            {
              key: 'node-key-3',
              port: null, // null uses default.
            },
          ],
        },
        tag: {
          direction: 'outgoing', // 'ingoing'/'outgoing'
        },
      },
      {
        key: 'connection-key-t', // pathPointerKey
        source: {
          portKey: 'port-key-1',
          position: {
            order: '2',
          },
        },
        destination: {
          node: [
            {
              key: 'node-key-4',
              port: null, // null uses default.
            },
          ],
        },
        tag: {
          direction: 'outgoing', // 'ingoing'/'outgoing'
        },
      },
      {
        key: 'connection-key-c', // pathPointerKey
        source: {
          portKey: 'port-key-2',
          position: {
            order: '1',
          },
        },
        destination: {
          node: [
            {
              key: 'node-key-5',
              port: null, // null uses default.
            },
          ],
        },
        tag: {
          direction: 'outgoing', // 'ingoing'/'outgoing'
        },
      },
    ],
    port: [
      {
        key: 'port-key-1',
        order: 1,
        tag: {
          direction: 'output', // 'output'/'input'
          iterateConnectionImplementation: 'chronological',
        },
      },
      {
        key: 'port-key-2',
        order: 2,
        tag: {
          direction: 'output', // 'output'/'input'
          iterateConnectionImplementation: 'chronological',
        },
      },
    ],
  },

  {
    label: { name: 'node' },
    key: 'node-key-1',
    dataItem: {
      key: 'dataItem-key-1',
    },
    connection: [],
    port: [],
  },
  {
    label: { name: 'node' },
    key: 'node-key-2',
    dataItem: {
      key: 'dataItem-key-2',
    },
    connection: [],
    port: [],
  },
  {
    label: { name: 'node' },
    key: 'node-key-3',
    dataItem: {
      key: 'dataItem-key-3',
    },
    connection: [],
    port: [],
  },
  {
    label: { name: 'node' },
    key: 'node-key-4',
    dataItem: {
      key: 'dataItem-key-4',
    },
    connection: [],
    port: [],
  },
  {
    label: { name: 'node' },
    key: 'node-key-5',
    dataItem: {
      key: 'dataItem-key-5',
    },
    connection: [],
    port: [],
  },
]
