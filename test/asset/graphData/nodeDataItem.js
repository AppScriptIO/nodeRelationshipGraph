/** 
 * Graph basic form with minimal functionality: 
    - `label` for debugging purposes.
    - Consisting of nodes without connections. 
    - Node's data is an object.
    - Node processing algorithm is specified.
    - Traversal algorithm specified, affected beighboring nodes / subnodes in directed graph.
 **/
//! CHANGE `processDataImplementation` to `processingAlgorithm`
//! CHANGE `traversalImplementationType` TO `traversalAlgorithm`
export let nodeArray = [
  {
    label: { name: 'node' },
    key: 'node-key-1',
    dataItem: { key: 'dataItem-key-1' },
    connection: [],
    tag: {
      traversalImplementationType: 'logNode',
      processDataImplementation: 'returnDataItemKey',
    },
  },
  {
    label: { name: 'node' },
    key: 'node-key-2',
    dataItem: { key: 'dataItem-key-2' },
    tag: {
      processDataImplementation: 'returnDataItemKey',
    },
  },
]
