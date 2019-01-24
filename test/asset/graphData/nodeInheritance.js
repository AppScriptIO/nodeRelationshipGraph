export let node1 = {
    label: { name: 'node' }, 
    key: 'node-key-1',
    // inheritance: {
    //     nodeKey: ''
    // }, // inheritance from another node
    dataItem: {
        key: 'dataItem-key-1'
    },
    connection: [
        {
            key: 'connection-key-1', // pathPointerKey
            source: {
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
                    }
                ],
            }, 
            tag: {
                direction: 'outgoing', // 'ingoing'/'outgoing'
            },
        },
    ],
}

export let node2 = {
    label: { name: 'node' }, 
    key: 'node-key-2',
    inheritance: {
        nodeKey: 'node-key-2'
    }, // inheritance from another node
    dataItem: {
        key: 'dataItem-key-2'
    },
    connection: [
        {
            key: 'connection-key-2', // pathPointerKey
            source: {
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
                    }
                ],
            }, 
            tag: {
                direction: 'outgoing', // 'ingoing'/'outgoing'
            },
        },
    ],
}
