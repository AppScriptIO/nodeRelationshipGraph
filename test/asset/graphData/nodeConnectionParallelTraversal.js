export let nodeArray = [
  {
    label: { name: 'node' },
    key: 'node-key-0',
    dataItem: {
      key: 'dataItem-key-0',
      timerDelay: 0,
    },
    connection: [
      {
        key: 'connection-key-x', // pathPointerKey
        source: {
          position: {
            order: '1',
            // or
            // placement: { type: 'after/before', connectionKey: 'KeyXXXX', }
          },
        },
        destination: {
          node: [
            {
              key: 'node-key-1',
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
          position: {
            order: '1',
            // or
            // placement: { type: 'after/before', connectionKey: 'KeyXXXX', }
          },
        },
        destination: {
          node: [
            {
              key: 'node-key-2',
            },
          ],
        },
        tag: {
          direction: 'outgoing', // 'ingoing'/'outgoing'
        },
      },
      {
        key: 'connection-key-v', // pathPointerKey
        source: {
          position: {
            order: '1',
            // or
            // placement: { type: 'after/before', connectionKey: 'KeyXXXX', }
          },
        },
        destination: {
          node: [
            {
              key: 'node-key-3',
            },
          ],
        },
        tag: {
          direction: 'outgoing', // 'ingoing'/'outgoing'
        },
      },
      {
        key: 'connection-key-b', // pathPointerKey
        source: {
          position: {
            order: '1',
            // or
            // placement: { type: 'after/before', connectionKey: 'KeyXXXX', }
          },
        },
        destination: {
          node: [
            {
              key: 'node-key-4',
            },
          ],
        },
        tag: {
          direction: 'outgoing', // 'ingoing'/'outgoing'
        },
      },
    ],
    tag: {
      processDataImplementation: 'timeout',
      traversalImplementationType: 'logNode',
      traverseNodeImplementation: 'allPromise' || 'raceFirstPromise',
    },
  },
  {
    label: { name: 'node' },
    key: 'node-key-1',
    dataItem: {
      key: 'dataItem-key-1',
      timerDelay: 90,
    },
    tag: {
      processDataImplementation: 'timeout',
    },
  },
  {
    label: { name: 'node' },
    key: 'node-key-2',
    dataItem: {
      key: 'dataItem-key-2',
      timerDelay: 50,
    },
    tag: {
      processDataImplementation: 'timeout',
    },
  },
  {
    label: { name: 'node' },
    key: 'node-key-3',
    dataItem: {
      key: 'dataItem-key-3',
      timerDelay: 20,
    },
    tag: {
      processDataImplementation: 'timeout',
    },
  },
  {
    label: { name: 'node' },
    key: 'node-key-4',
    dataItem: {
      key: 'dataItem-key-4',
      timerDelay: 70,
    },
    tag: {
      processDataImplementation: 'timeout',
    },
  },
]
