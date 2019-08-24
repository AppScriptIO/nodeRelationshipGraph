export const nodeLabel = {
  subgraphTemplate: 'SubgraphTemplate',
  port: 'Port',
  stage: 'Stage',
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
  run: 'RUN',

  inherit: 'INHERIT',
}

export const connectionProperty = {
  context: ['applicationReference', 'filesystemReference'],
}
