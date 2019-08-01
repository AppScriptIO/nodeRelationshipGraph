"use strict";function createStage() {
  ;`
    create (stage:Stage { key: '' })
    
    // add execute connection to itself
    create (stage)-[execute:EXECUTE { key: '' }]->(stage)
    set stage:Process
  `;
}





function createSubgraphTemplate() {
  ;`
    create (template:SubgraphTemplate {key:'', name: ''})
  `;
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
`;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9ncmFwaE1vZGVsL2NyZWF0ZUdyYXBoRWxlbWVudC5qcyJdLCJuYW1lcyI6WyJjcmVhdGVTdGFnZSIsImNyZWF0ZVN1YmdyYXBoVGVtcGxhdGUiXSwibWFwcGluZ3MiOiJhQUFBLFNBQVNBLFdBQVQsR0FBdUI7QUFDckIsR0FBRTs7Ozs7O0dBQUQ7QUFPRjs7Ozs7O0FBTUQsU0FBU0Msc0JBQVQsR0FBa0M7QUFDaEMsR0FBRTs7R0FBRDtBQUdGOztBQUVELENBQUU7Ozs7Ozs7O0NBUUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQVJEIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gY3JlYXRlU3RhZ2UoKSB7XG4gIDtgXG4gICAgY3JlYXRlIChzdGFnZTpTdGFnZSB7IGtleTogJycgfSlcbiAgICBcbiAgICAvLyBhZGQgZXhlY3V0ZSBjb25uZWN0aW9uIHRvIGl0c2VsZlxuICAgIGNyZWF0ZSAoc3RhZ2UpLVtleGVjdXRlOkVYRUNVVEUgeyBrZXk6ICcnIH1dLT4oc3RhZ2UpXG4gICAgc2V0IHN0YWdlOlByb2Nlc3NcbiAgYFxufVxuXG4vKiogR3JhcGggVHJhdmVyc2FsIE1vZGVsXG4gKiBUT0RPOiBjcmVhdGUgcXVlcnkgZnVuY3Rpb25zIGZvciBlYWNoIGdyYXBoIGVsZW1lbnQuXG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlU3ViZ3JhcGhUZW1wbGF0ZSgpIHtcbiAgO2BcbiAgICBjcmVhdGUgKHRlbXBsYXRlOlN1YmdyYXBoVGVtcGxhdGUge2tleTonJywgbmFtZTogJyd9KVxuICBgXG59XG5cbjtgXG5jcmVhdGUgKHN0YWdlOlN0YWdlOlBvcnQgeyBrZXk6ICc3YzVjNTY3OC04MmY0LTQ5ZWEtYThhNS0zMDNlMTQ4Y2I3MTAnLCBoYW5kbGVQcm9wYWdhdGlvbkltcGxlbWVudGF0aW9uOiAnY2hyb25vbG9naWNhbCcgfSlcbmNyZWF0ZSAoc3RhZ2UpLVtmb3JrOkZPUktdLT4oc3RhZ2UpXG5cblxuY3JlYXRlICh0ZW1wbGF0ZTpTdWJncmFwaFRlbXBsYXRlIHtrZXk6JzU4YzE1Y2M4LTZmNDAtNGQwYi04MTVhLTBiODU5NGFlYjk3MicsIG5hbWU6ICdidWlsZCd9KVxuY3JlYXRlICh0ZW1wbGF0ZSktWzpST09UXS0+KHN0YWdlKVxuXG5gYFxubWF0Y2ggKHA6U3RhZ2Uge2tleTonN2M1YzU2NzgtODJmNC00OWVhLWE4YTUtMzAzZTE0OGNiNzEwJ30pXG5cbmNyZWF0ZSAoc3ViZ3JhcGgxOlN1YmdyYXBoVGVtcGxhdGUge2tleTonYTllM2JlMTAtYmQ3My00NWJjLTlmNDQtMjVmOWM2MGFkYWMxJywgbmFtZTonc2VydmVyU2lkZTpidWlsZCd9KVxuY3JlYXRlIChzdGFnZTE6U3RhZ2U6UHJvY2VzcyB7IGtleTogJzllM2FmZmE1LThkYzUtNDM5Yi05OTdjLTlhMTE1NDFhYzcwMCcgfSlcbmNyZWF0ZSAoc3RhZ2UxKS1bOkVYRUNVVEUgeyBrZXk6ICczYTYzM2IwOS04YTI3LTRjNDAtODUzMi00MmFlMTdiNWMyNTQnIH1dLT4oc3RhZ2UxKVxuY3JlYXRlIChzdWJncmFwaDEpLVs6Uk9PVF0tPihzdGFnZTEpXG5cbmNyZWF0ZSAoc3ViZ3JhcGgyOlN1YmdyYXBoVGVtcGxhdGUge2tleTonNzJhOTI4ZTAtOGNmZS00MWRhLWE4MWEtNThhOWE1MTYxZTI4JywgbmFtZTonY2xpZW50U2lkZTpidWlsZCd9KVxuY3JlYXRlIChzdGFnZTI6U3RhZ2U6UHJvY2VzcyB7IGtleTogJzJiMTI5MDBlLTNkNjktNGM5OC1iNDMwLWNkZWYzZGU4ODg5ZCcgfSlcbmNyZWF0ZSAoc3RhZ2UyKS1bOkVYRUNVVEUgeyBrZXk6ICdjNWQxNzBkNi0xNzU3LTRiMjUtYmM3MS1lN2ZmMDdmNjViYmUnIH1dLT4oc3RhZ2UyKVxuY3JlYXRlIChzdWJncmFwaDIpLVs6Uk9PVF0tPihzdGFnZTIpXG5cbmNyZWF0ZSAoc3ViZ3JhcGgzOlN1YmdyYXBoVGVtcGxhdGUge2tleTonMzFkMjY1NDAtY2M0OC00ZDU0LThlYmMtNzY1NjMyODAwNjY3JywgbmFtZTonbmF0aXZlQ2xpZW50U2lkZTpidWlsZCd9KVxuY3JlYXRlIChzdGFnZTM6U3RhZ2U6UHJvY2VzcyB7IGtleTogJzMxM2IxMzE2LTE5MzctNDg5ZC05NjE1LTk1YmVhNzAwNzQ0YicgfSlcbmNyZWF0ZSAoc3RhZ2UzKS1bOkVYRUNVVEUgeyBrZXk6ICcwNjNiMTQ0Zi0yNWU0LTQzMjctODUzYy05YmUwN2E1NmU3MDAnIH1dLT4oc3RhZ2UzKVxuY3JlYXRlIChzdWJncmFwaDMpLVs6Uk9PVF0tPihzdGFnZTMpXG5cbmNyZWF0ZSAoc3ViZ3JhcGg0OlN1YmdyYXBoVGVtcGxhdGUge2tleTonOTMzYjkxNGMtMzVlMC00MjM5LTg2OGMtZmFkZjQ4ZTU5ZDBlJywgbmFtZToncG9seWZpbGxDbGllbnRTaWRlOmJ1aWxkJ30pXG5jcmVhdGUgKHN0YWdlNDpTdGFnZTpQcm9jZXNzIHsga2V5OiAnNDQ3NGJmNjYtNTJkNC00YjFmLWI0YTItZjU1ZmZmYzg0NDA0JyB9KVxuY3JlYXRlIChzdGFnZTQpLVs6RVhFQ1VURSB7IGtleTogJzAzZDVmZDA5LTAxYTUtNGJmYi04NzJiLWVmZTRiMDM2YzQ0NScgfV0tPihzdGFnZTQpXG5jcmVhdGUgKHN1YmdyYXBoNCktWzpST09UXS0+KHN0YWdlNClcblxuY3JlYXRlIChwKS1bOk5FWFRdLT4oc3ViZ3JhcGgxKVxuY3JlYXRlIChwKS1bOk5FWFRdLT4oc3ViZ3JhcGgyKVxuY3JlYXRlIChwKS1bOk5FWFRdLT4oc3ViZ3JhcGgzKVxuY3JlYXRlIChwKS1bOk5FWFRdLT4oc3ViZ3JhcGg0KVxuYFxuIl19