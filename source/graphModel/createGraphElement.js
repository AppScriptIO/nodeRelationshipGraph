function createStage() {
  ;`
    create (stage:Stage { key: '' })
    
    // add execute connection to itself
    create (stage)-[execute:EXECUTE { key: '' }]->(stage)
    set stage:Process
  `
}

/** Graph Traversal Model
 * TODO: create query functions for each graph element.
 */

function createSubgraphTemplate() {
  ;`
    create (template:SubgraphTemplate {key:'', name: ''})
  `
}

;`
create (stage:Stage:Port { key: '7c5c5678-82f4-49ea-a8a5-303e148cb710', handlePropagationImplementation: 'chronological' })
create (stage)-[fork:FORK]->(stage)


create (template:SubgraphTemplate {key:'58c15cc8-6f40-4d0b-815a-0b8594aeb972', name: 'build'})
create (template)-[:ROOT]->(stage)

``
match (p:Stage {key:'7c5c5678-82f4-49ea-a8a5-303e148cb710'})

create (subgraph1:SubgraphTemplate {key:'a9e3be10-bd73-45bc-9f44-25f9c60adac1', name:'serverSide:build'})
create (stage1:Stage:Process { key: '9e3affa5-8dc5-439b-997c-9a11541ac700' })
create (stage1)-[:EXECUTE { key: '3a633b09-8a27-4c40-8532-42ae17b5c254' }]->(stage1)
create (subgraph1)-[:ROOT]->(stage1)

create (subgraph2:SubgraphTemplate {key:'72a928e0-8cfe-41da-a81a-58a9a5161e28', name:'clientSide:build'})
create (stage2:Stage:Process { key: '2b12900e-3d69-4c98-b430-cdef3de8889d' })
create (stage2)-[:EXECUTE { key: 'c5d170d6-1757-4b25-bc71-e7ff07f65bbe' }]->(stage2)
create (subgraph2)-[:ROOT]->(stage2)

create (subgraph3:SubgraphTemplate {key:'31d26540-cc48-4d54-8ebc-765632800667', name:'nativeClientSide:build'})
create (stage3:Stage:Process { key: '313b1316-1937-489d-9615-95bea700744b' })
create (stage3)-[:EXECUTE { key: '063b144f-25e4-4327-853c-9be07a56e700' }]->(stage3)
create (subgraph3)-[:ROOT]->(stage3)

create (subgraph4:SubgraphTemplate {key:'933b914c-35e0-4239-868c-fadf48e59d0e', name:'polyfillClientSide:build'})
create (stage4:Stage:Process { key: '4474bf66-52d4-4b1f-b4a2-f55fffc84404' })
create (stage4)-[:EXECUTE { key: '03d5fd09-01a5-4bfb-872b-efe4b036c445' }]->(stage4)
create (subgraph4)-[:ROOT]->(stage4)

create (p)-[:NEXT]->(subgraph1)
create (p)-[:NEXT]->(subgraph2)
create (p)-[:NEXT]->(subgraph3)
create (p)-[:NEXT]->(subgraph4)
``// create (s:Stage:Process {key:'82900056-9877-49b0-bd4c-df916bfb9507', name:''})<-[:RESOURCE {key:'4c48a364-f078-431d-be15-68ffc5193627', context:'applicationReference'}]-(t:Task {key:'ac63f49a-f5c4-420d-b536-3edb10f01841', functionName:''})
``match (sub:SubgraphTemplate {key:'171d18f8-9d25-4483-aeb9-a29c9fbed6ac'})
create (sub)-[:ROOT]->(s:Stage:Port {key: 'dc6aa15a-5f7c-4d2e-9bc0-e64d3584296f', handlePropagationImplementation: "chronological"})
create (s)-[:FORK]->(s)
``

match (e:Evaluation {key:'b57fbb1d-c65b-4bcf-8f76-04a9444d301f'})
create (e)-[:CASE {key:'25874628-f586-48ab-9cd9-99b5e0d7841f',expected:true}]->(c2:Configuration {aggregation: 'process&include', propagation: 'continue', key:'35df021f-7999-4194-97e4-83ec76a2d4e0'})
create (e)-[:CASE {key:'1d136ca2-a7fc-4179-984e-b22b1f375869',expected:false}]->(c3:Configuration {aggregation: 'skipProcess', propagation: 'break', key:'4c02c2a0-4460-4121-b214-7f27411b1b33'})
create (e)-[:DEFAULT {key:'b7067a2a-33e9-4f3b-922a-d41a3f7f6df0'}]->(c2)
`
