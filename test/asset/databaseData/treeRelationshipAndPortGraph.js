export let nodeArray = [
    {
        label: { name: 'node' }, 
        key: 'node-key-1',
        // inheritance: {
        //     nodeKey: ''
        // }, // inheritance from another node
        dataItemKey: 'dataItem-key-1',
        connection: [
            {
                key: 'connection-key-1', // pathPointerKey
                source: {
                    portKey: 'port-key-1',
                    position: {
                        order: '1',
                        // or 
                        // placement: { type: 'after/before', connectionKey: 'KeyXXXX', } 
                    }
                },
                destination: {
                    node: [
                        {
                            key: 'node-key-2',
                            port: null // null uses default.
                        }
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
                    executionType: 'raceFirstPromise' 
                },
            },
        ],
    }
]