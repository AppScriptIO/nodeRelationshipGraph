export const nodeLabel = {
  subgraphTemplate: 'SubgraphTemplate',
  port: 'Port',
  stage: 'Stage',
  switch: 'Switch',
  // switchBoolean: 'SwitchBoolean',
  process: 'Process',
  configuration: 'Configuration',
  evaluation: 'Evaluation',
  file: 'File',
  function: 'Function',
  nodeReference: 'NodeReference', // holding reference information to a node that exist in another location, when imported to an existing graph database, a connection will be created to the referenced graph
  reroute: 'Reroute', // reroute/relay
}

export const connectionType = {
  // Stage
  next: 'NEXT',
  fork: 'FORK',
  configure: 'CONFIGURE',
  // run: 'RUN', // run as subgraph where the result of the subgraph traversal is to be used in the stage node calling it.
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

  // inherit: 'INHERIT',
}

export const connectionProperty = {
  context: ['applicationReference', 'filesystemReference'],
  type: ['properties', 'node', 'valueProperty'],
}

export const evaluationOption = {
  propagation: {
    // traverse neighbours or not.
    continue: 'continue', // continue traversal of child nodes
    break: 'break', // do not traverse subprocess
    hult: 'hult', // hult traversal all together and return.
  },
  aggregation: {
    // execute & include or don't execute & exclude from aggregated results.
    include: 'process&include',
    exclude: 'process&exclude',
    skip: 'skipProcess',
  },
}

export const traversalOption = ['processNode', 'portNode', 'aggregator', 'traversalInterception']
