export const nodeLabel = {
  stage: 'Stage',
  port: 'Port',
  process: 'Process',
  configuration: 'Configuration',
  file: 'File',
  function: 'Function',
  reroute: 'Reroute',
  // evaluation: 'Evaluation',
  // subgraphTemplate: 'SubgraphTemplate',
  // nodeReference: 'NodeReference',
  // switch: 'Switch',
  // switchBoolean: 'SwitchBoolean',
}

export const connectionType = {
  // Reroute
  reference: 'REFERENCE',
  insert: 'INSERT',
  extend: 'EXTEND',
  // Stage
  next: 'NEXT',
  fork: 'FORK',
  configure: 'CONFIGURE',
  // Process & Evaluation
  execute: 'EXECUTE',
  resource: 'RESOURCE',
  value: 'VALUE', // {type: 'node' || 'properties'} i.e. return the node reference or return its properties.
  case: 'CASE',
  default: 'DEFAULT',
  // root: 'ROOT',
  // run: 'RUN', // run as subgraph where the result of the subgraph traversal is to be used in the stage node calling it.
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

export const rerouteProperty = {
  externalReferenceNodeKey: 'externalReferenceNodeKey',
}

export const referenceProperty = {
  implementation: ['node', 'returnedValue'],
}
