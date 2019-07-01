/** 
 * Graph basic form with minimal functionality: 
    - `label` for debugging purposes.
    - Consisting of nodes without connections. 
    - Node's data is an object.
    - Node processing algorithm is specified.
    - Traversal algorithm specified, affected beighboring nodes / subnodes in directed graph.
 **/
export let node = [
  {
    type: ['traversalStep', 'executionProcess'],
    key: 'node-key-1',
    // data item
    name: 'dataItem-key-1',
    // traversal config
    processDataImplementation: 'returnDataItemKey',
  },
  {
    type: ['traversalStep', 'executionProcess'],
    key: 'node-key-2',
    // data item
    name: 'dataItem-key-2',
    // traversal config
    processDataImplementation: 'returnDataItemKey',
  },
]
