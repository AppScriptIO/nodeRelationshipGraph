export const nodeLabel = {
  subgraphTemplate: 'SubgraphTemplate',
  port: 'Port',
  stage: 'Stage',
  switch: 'Switch',
  switchBoolean: 'SwitchBoolean',
  process: 'Process',
  configuration: 'Configuration',
  evaluation: 'Evaluation',
  file: 'File',
  function: 'Function',
  nodeReference: 'NodeReference', // holding reference information to a node that exist in another location, when imported to an existing graph database, a connection will be created to the referenced graph
}

export const connectionType = {
  // Stage
  next: 'NEXT',
  fork: 'FORK',
  configure: 'CONFIGURE',
  run: 'RUN', // run as subgraph where the result of the subgraph traversal is to be used in the stage node calling it.
  // SubgraphTemplate
  insert: 'INSERT',
  extend: 'EXTEND',
  root: 'ROOT',
  // Process
  execute: 'EXECUTE',
  resource: 'RESOURCE',
  value: 'VALUE', // {type: 'node' || 'properties'} i.e. return the node reference or return its properties.
  // Evaluation
  case: 'CASE',
  default: 'DEFAULT',

  inherit: 'INHERIT',
}

export const connectionProperty = {
  context: ['applicationReference', 'filesystemReference'],
}

export const evaluationOption = {
  propagation: {
    // traverse neighbours or not.
    continue: 'continue',
    break: 'break',
    hult: 'hult',
  },
  aggregation: {
    // execute & include or don't execute & exclude from aggregated results.
    include: 'process&include',
    exclude: 'process&exclude',
    skip: 'skipProcess',
  },
}

export const traversalOption = ['processData', 'handlePropagation', 'traverseNode', 'aggregator', 'traversalInterception']

const traversalImplementationKey = {
  // the the default registered implementations or internal module implementations.
  processData: ['returnDataItemKey', 'returnKey', 'timeout'],
  traverseNode: ['allPromise', 'chronological', 'raceFirstPromise'],
  aggregator: ['AggregatorArray', 'ConditionCheck'],
  traversalInterception: ['processThenTraverse', 'conditionCheck'],
}
