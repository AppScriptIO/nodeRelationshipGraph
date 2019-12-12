// Database models for creating Graph elements (multiple related nodes with their connections).
/** Graph Traversal Model
 * TODO: create query functions for each graph element.
 */

function reroute() {
  match (n {key:''})
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

}  

function port() {
  create (n)-[:FORK]->(n)
  set n:Port
  set n.handlePropagationImplementation = "chronological"

}