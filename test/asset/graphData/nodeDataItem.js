export let nodeArray = [
    {
        label: { name: 'node' }, 
        key: 'node-key-1',
        dataItem: {
            key: 'dataItem-key-1',
        },
        connection: [],
        tag: {
            traversalImplementationType: 'logNode', // traversal implementation
            executionType: 'returnDataItemKey'
        }
    },
    {
        label: { name: 'node' }, 
        key: 'node-key-2',
        dataItem: {
            key: 'dataItem-key-2',
        },
        tag: {
            executionType: 'returnDataItemKey'
        }

    }
]

