/** Use concrete Database class instances to retrieve nodes and verify the results with a schema - wrap the concrete database with more specific query functions */

import assert from 'assert'
import * as schemeReference from '../../dataModel/graphSchemeReference.js'

export function isSelfEdge(edge) {
  return edge.source.identity == edge.destination.identity
}

export async function getResource({ nodeID }) {
  let resourceArray = await this::this.getNodeConnection({ direction: 'incoming', nodeID, connectionType: schemeReference.connectionType.resource })
  assert(
    resourceArray.every(n => schemeReference.resourceProperty.context.includes(n.connection.properties.context)),
    `• Unsupported property value for a RESOURCE connection.`,
  ) // verify node type
  return { resourceArray }
}

export async function getValue({ nodeID }) {
  let valueArray = await this::this.getNodeConnection({ direction: 'incoming', nodeID, connectionType: schemeReference.connectionType.value })
  return { valueArray: valueArray }
}

export async function getExecution({ nodeID }) {
  let executeArray = await this::this.getNodeConnection({ direction: 'outgoing', nodeID, connectionType: schemeReference.connectionType.execute })
  assert(
    executeArray.every(n => n.destination.labels.includes(schemeReference.nodeLabel.process)),
    `• Unsupported node type for a EXECUTE connection.`,
  ) // verify node type
  return { executeArray }
}

export async function getPipe({ nodeID }) {
  let pipeArray = await this::this.getNodeConnection({ direction: 'outgoing', nodeID, connectionType: schemeReference.connectionType.pipe })
  assert(
    pipeArray.every(n => n.destination.labels.includes(schemeReference.nodeLabel.process)),
    `• Unsupported node type for a PIPE connection.`,
  ) // verify node type
  return { pipeArray }
}

export async function getFork({ nodeID }) {
  let forkArray = await this::this.getNodeConnection({ direction: 'outgoing', nodeID: nodeID, connectionType: schemeReference.connectionType.fork })
  assert(
    forkArray.every(n => n.destination.labels.includes(schemeReference.nodeLabel.port)),
    `• Unsupported property value for a FORK connection.`,
  ) // verify node type
  return { forkArray }
}

export async function getNext({ nodeID }) {
  let nextArray = await this::this.getNodeConnection({ direction: 'outgoing', nodeID: nodeID, connectionType: schemeReference.connectionType.next })
  assert(
    nextArray.every(n => n.destination.labels.includes(schemeReference.nodeLabel.stage) || n.destination.labels.includes(schemeReference.nodeLabel.reroute)),
    `• Unsupported property value for a NEXT connection.`,
  ) // verify node type
  return { nextArray }
}

export async function getConfigure({ nodeID }) {
  let configureArray = await this::this.getNodeConnection({ direction: 'incoming', nodeID: nodeID, connectionType: schemeReference.connectionType.configure })
  assert(
    configureArray.every(n => n.source.labels.includes(schemeReference.nodeLabel.configuration) || n.source.labels.includes(schemeReference.nodeLabel.reroute)),
    `• Unsupported node type for a CONFIGURE connection.`,
  ) // verify node type
  assert(
    configureArray.every(n => n.connection.properties.setting),
    `• Missing "setting" property on a CONFIGURE connection.`,
  )

  return { configureArray }
}

export async function getCase({ nodeID }) {
  let caseArray = await this::this.getNodeConnection({ direction: 'outgoing', nodeID, connectionType: schemeReference.connectionType.case })
  // Note: node type could be any node
  return { caseArray }
}

export async function getSelect({ nodeID }) {
  let selectArray = await this::this.getNodeConnection({ direction: 'outgoing', nodeID, connectionType: schemeReference.connectionType.select })
  // Note: node type could be any node
  return { selectArray }
}

export async function getFallback({ nodeID }) {
  let fallbackArray = await this::this.getNodeConnection({ direction: 'outgoing', nodeID, connectionType: schemeReference.connectionType.fallback })
  // Note: node type could be any node
  return { fallbackArray }
}

export async function getReference({ nodeID }) {
  let referenceArray = await this::this.getNodeConnection({ direction: 'outgoing', nodeID: nodeID, connectionType: schemeReference.connectionType.reference })
  // TODO: use entrypoint array from TraversalConfig class.
  assert(
    referenceArray.every(n => n.destination.labels.includes(schemeReference.nodeLabel.stage) || n.destination.labels.includes(schemeReference.nodeLabel.reroute)),
    `• Unsupported node type for a ${schemeReference.connectionType.reference} connection.`,
  ) // verify node type
  return { referenceArray }
}

export async function getExtend({ nodeID }) {
  let extendArray = await this::this.getNodeConnection({ direction: 'outgoing', nodeID: nodeID, connectionType: schemeReference.connectionType.extend })
  assert(
    extendArray.every(n => n.destination.labels.includes(schemeReference.nodeLabel.reroute)),
    `• Unsupported node type for a EXTEND connection.`,
  ) // verify node type
  return { extendArray }
}

export async function getInsert({ nodeID }) {
  let insertArray = await this::this.getNodeConnection({ direction: 'incoming', nodeID: nodeID, connectionType: schemeReference.connectionType.insert })
  assert(
    insertArray.every(n => n.source.labels.includes(schemeReference.nodeLabel.stage)),
    `• Unsupported node type for a INSERT connection.`,
  ) // verify node type
  return { insertArray }
}

export async function getSubgraph({ nodeID }) {
  let subgraphArray = await this::this.getNodeConnection({ direction: 'incoming', nodeID: nodeID, connectionType: schemeReference.connectionType.subgraph })
  assert(
    subgraphArray.every(n => n.source.labels.includes(schemeReference.nodeLabel.stage) || n.source.labels.includes(schemeReference.nodeLabel.reroute)),
    `• Unsupported node type for a SUBGRAPH connection.`,
  ) // verify node type
  return { subgraphArray }
}

/*
      _                                    _           _                         _           
     / \   __ _  __ _ _ __ ___  __ _  __ _| |_ ___  __| |   __ _ _   _  ___ _ __(_) ___  ___ 
    / _ \ / _` |/ _` | '__/ _ \/ _` |/ _` | __/ _ \/ _` |  / _` | | | |/ _ \ '__| |/ _ \/ __|
   / ___ \ (_| | (_| | | |  __/ (_| | (_| | ||  __/ (_| | | (_| | |_| |  __/ |  | |  __/\__ \
  /_/   \_\__, |\__, |_|  \___|\__, |\__,_|\__\___|\__,_|  \__, |\__,_|\___|_|  |_|\___||___/
          |___/ |___/          |___/                          |_|                            
*/

export async function getRerouteTraverseReferenceElement({ nodeID }) {
  const { extendArray } = await this::this.getExtend({ nodeID })
  const { insertArray } = await this::this.getInsert({ nodeID })

  if (extendArray.length > 1) throw new Error(`• Multiple extend relationships are not supported for Reroute node.`)

  return { extend: extendArray.length > 0 ? extendArray[0] : null, insertArray }
}

export async function getReferenceResolutionElement({ nodeID }) {
  const { referenceArray } = await this::this.getReference({ nodeID })

  if (referenceArray.length > 1) throw new Error(`• Multiple reference relationships are not supported for Reroute node.`)

  return { reference: referenceArray.length > 0 ? referenceArray[0] : null }
}

export async function getSelectionElement({ nodeID }) {
  const { selectArray } = await this::this.getSelect({ nodeID })
  const { fallbackArray } = await this::this.getFallback({ nodeID })

  if (fallbackArray.length > 1) throw new Error(`• Multiple "fallback" relationships are not supported for Selection/Switch node.`)

  return { selectArray: selectArray.length > 0 ? selectArray : null, fallback: fallbackArray.length > 0 ? fallbackArray[0] : null }
}

export async function getConditionSwitchElement({ nodeID }) {
  const { caseArray } = await this::this.getCase({ nodeID })

  return { caseArray: caseArray.length > 0 ? caseArray : null }
}

// Value connection concept implementation
export async function getValueElement({ nodeID }) {
  // get VALUE connection
  let value
  const { valueArray } = await this::this.getValue({ nodeID })
  if (valueArray.length > 1) throw new Error(`• Multiple VALUE relationships are not supported for Process node.`)
  else if (valueArray.length != 0 && valueArray[0]) return valueArray[0]
}

/*
   __  __             _             _       _   _                          _ _                  
  |  \/  | __ _ _ __ (_)_ __  _   _| | __ _| |_(_) ___  _ __     __ _  ___(_) |_ ___  _ __  ___ 
  | |\/| |/ _` | '_ \| | '_ \| | | | |/ _` | __| |/ _ \| '_ \   / _` |/ __| | __/ _ \| '_ \/ __|
  | |  | | (_| | | | | | |_) | |_| | | (_| | |_| | (_) | | | | | (_| | (__| | || (_) | | | \__ \
  |_|  |_|\__,_|_| |_|_| .__/ \__,_|_|\__,_|\__|_|\___/|_| |_|  \__,_|\___|_|\__\___/|_| |_|___/
                       |_|                                                                      
*/
// Database models for creating Graph elements (multiple related nodes with their connections).

/** Graph Traversal Model
 * TODO: create query functions for each graph element.
 */
function reroute() {
  ;`  match (n {key:''})
  create (n)
    -[:CASE {expected: "GET"}]->
    (r:Reroute {name: 'request URL path switch'})
        create (r)-[:REFERENCE {resolutionImplementation: "caseSwitch"}]-> (r)
  create (r)
    <-[:VALUE {implementation: "conditionSubgraph"}]-
    (s:Stage:Process:Function {functionName: "getUrlPathLevel1"})
        create (s)-[:EXECUTE]->(s)
        create (s)-[:RESOURCE {context: "applicationReference"}]->(s)

  match (n {key: ''})
    create (n) -[:VALUE {implementation: "conditionSubgraph"}]-> (n)
    create (n) -[:EXECUTE]-> (n)
    create (n) -[:RESOURCE {context: "applicationReference"}]-> (n)
  set n:Stage:Process:Function; set n.functionName = "getRequestMethod"

`
}

function port() {
  ;`  create (n)-[:FORK]->(n)
  set n:Port
  set n.handlePropagationImplementation = "chronological"
`
}
