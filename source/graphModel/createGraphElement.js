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
``// create (s:Stage:Process {key:'82900056-9877-49b0-bd4c-df916bfb9507', name:''})<-[:RESOURCE {key:'4c48a364-f078-431d-be15-68ffc5193627', context:'applicationReference'}]-(t:Task {key:'ac63f49a-f5c4-420d-b536-3edb10f01841', functionName:''})
``match (sub:SubgraphTemplate {key:'171d18f8-9d25-4483-aeb9-a29c9fbed6ac'})
create (sub)-[:ROOT]->(s:Stage:Port {key: 'dc6aa15a-5f7c-4d2e-9bc0-e64d3584296f', handlePropagationImplementation: "chronological"})
create (s)-[:FORK]->(s)
``

match (e:Evaluation {key:'b57fbb1d-c65b-4bcf-8f76-04a9444d301f'})
create (e)-[:CASE {key:'25874628-f586-48ab-9cd9-99b5e0d7841f',expected:true}]->(c2:Configuration {aggregation: 'process&include', propagation: 'continue', key:'35df021f-7999-4194-97e4-83ec76a2d4e0'})
create (e)-[:CASE {key:'1d136ca2-a7fc-4179-984e-b22b1f375869',expected:false}]->(c3:Configuration {aggregation: 'skipProcess', propagation: 'break', key:'4c02c2a0-4460-4121-b214-7f27411b1b33'})
create (e)-[:DEFAULT {key:'b7067a2a-33e9-4f3b-922a-d41a3f7f6df0'}]->(c2)
`;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9ncmFwaE1vZGVsL2NyZWF0ZUdyYXBoRWxlbWVudC5qcyJdLCJuYW1lcyI6WyJjcmVhdGVTdGFnZSIsImNyZWF0ZVN1YmdyYXBoVGVtcGxhdGUiXSwibWFwcGluZ3MiOiJhQUFBLFNBQVNBLFdBQVQsR0FBdUI7QUFDckIsR0FBRTs7Ozs7O0dBQUQ7QUFPRjs7Ozs7O0FBTUQsU0FBU0Msc0JBQVQsR0FBa0M7QUFDaEMsR0FBRTs7R0FBRDtBQUdGOztBQUVELENBQUU7Ozs7Ozs7O0NBUUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQTJCQTtDQUNBOzs7Q0FHQTs7Ozs7O0NBdkNEIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gY3JlYXRlU3RhZ2UoKSB7XG4gIDtgXG4gICAgY3JlYXRlIChzdGFnZTpTdGFnZSB7IGtleTogJycgfSlcbiAgICBcbiAgICAvLyBhZGQgZXhlY3V0ZSBjb25uZWN0aW9uIHRvIGl0c2VsZlxuICAgIGNyZWF0ZSAoc3RhZ2UpLVtleGVjdXRlOkVYRUNVVEUgeyBrZXk6ICcnIH1dLT4oc3RhZ2UpXG4gICAgc2V0IHN0YWdlOlByb2Nlc3NcbiAgYFxufVxuXG4vKiogR3JhcGggVHJhdmVyc2FsIE1vZGVsXG4gKiBUT0RPOiBjcmVhdGUgcXVlcnkgZnVuY3Rpb25zIGZvciBlYWNoIGdyYXBoIGVsZW1lbnQuXG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlU3ViZ3JhcGhUZW1wbGF0ZSgpIHtcbiAgO2BcbiAgICBjcmVhdGUgKHRlbXBsYXRlOlN1YmdyYXBoVGVtcGxhdGUge2tleTonJywgbmFtZTogJyd9KVxuICBgXG59XG5cbjtgXG5jcmVhdGUgKHN0YWdlOlN0YWdlOlBvcnQgeyBrZXk6ICc3YzVjNTY3OC04MmY0LTQ5ZWEtYThhNS0zMDNlMTQ4Y2I3MTAnLCBoYW5kbGVQcm9wYWdhdGlvbkltcGxlbWVudGF0aW9uOiAnY2hyb25vbG9naWNhbCcgfSlcbmNyZWF0ZSAoc3RhZ2UpLVtmb3JrOkZPUktdLT4oc3RhZ2UpXG5cblxuY3JlYXRlICh0ZW1wbGF0ZTpTdWJncmFwaFRlbXBsYXRlIHtrZXk6JzU4YzE1Y2M4LTZmNDAtNGQwYi04MTVhLTBiODU5NGFlYjk3MicsIG5hbWU6ICdidWlsZCd9KVxuY3JlYXRlICh0ZW1wbGF0ZSktWzpST09UXS0+KHN0YWdlKVxuXG5gYFxubWF0Y2ggKHA6U3RhZ2Uge2tleTonN2M1YzU2NzgtODJmNC00OWVhLWE4YTUtMzAzZTE0OGNiNzEwJ30pXG5cbmNyZWF0ZSAoc3ViZ3JhcGgxOlN1YmdyYXBoVGVtcGxhdGUge2tleTonYTllM2JlMTAtYmQ3My00NWJjLTlmNDQtMjVmOWM2MGFkYWMxJywgbmFtZTonc2VydmVyU2lkZTpidWlsZCd9KVxuY3JlYXRlIChzdGFnZTE6U3RhZ2U6UHJvY2VzcyB7IGtleTogJzllM2FmZmE1LThkYzUtNDM5Yi05OTdjLTlhMTE1NDFhYzcwMCcgfSlcbmNyZWF0ZSAoc3RhZ2UxKS1bOkVYRUNVVEUgeyBrZXk6ICczYTYzM2IwOS04YTI3LTRjNDAtODUzMi00MmFlMTdiNWMyNTQnIH1dLT4oc3RhZ2UxKVxuY3JlYXRlIChzdWJncmFwaDEpLVs6Uk9PVF0tPihzdGFnZTEpXG5cbmNyZWF0ZSAoc3ViZ3JhcGgyOlN1YmdyYXBoVGVtcGxhdGUge2tleTonNzJhOTI4ZTAtOGNmZS00MWRhLWE4MWEtNThhOWE1MTYxZTI4JywgbmFtZTonY2xpZW50U2lkZTpidWlsZCd9KVxuY3JlYXRlIChzdGFnZTI6U3RhZ2U6UHJvY2VzcyB7IGtleTogJzJiMTI5MDBlLTNkNjktNGM5OC1iNDMwLWNkZWYzZGU4ODg5ZCcgfSlcbmNyZWF0ZSAoc3RhZ2UyKS1bOkVYRUNVVEUgeyBrZXk6ICdjNWQxNzBkNi0xNzU3LTRiMjUtYmM3MS1lN2ZmMDdmNjViYmUnIH1dLT4oc3RhZ2UyKVxuY3JlYXRlIChzdWJncmFwaDIpLVs6Uk9PVF0tPihzdGFnZTIpXG5cbmNyZWF0ZSAoc3ViZ3JhcGgzOlN1YmdyYXBoVGVtcGxhdGUge2tleTonMzFkMjY1NDAtY2M0OC00ZDU0LThlYmMtNzY1NjMyODAwNjY3JywgbmFtZTonbmF0aXZlQ2xpZW50U2lkZTpidWlsZCd9KVxuY3JlYXRlIChzdGFnZTM6U3RhZ2U6UHJvY2VzcyB7IGtleTogJzMxM2IxMzE2LTE5MzctNDg5ZC05NjE1LTk1YmVhNzAwNzQ0YicgfSlcbmNyZWF0ZSAoc3RhZ2UzKS1bOkVYRUNVVEUgeyBrZXk6ICcwNjNiMTQ0Zi0yNWU0LTQzMjctODUzYy05YmUwN2E1NmU3MDAnIH1dLT4oc3RhZ2UzKVxuY3JlYXRlIChzdWJncmFwaDMpLVs6Uk9PVF0tPihzdGFnZTMpXG5cbmNyZWF0ZSAoc3ViZ3JhcGg0OlN1YmdyYXBoVGVtcGxhdGUge2tleTonOTMzYjkxNGMtMzVlMC00MjM5LTg2OGMtZmFkZjQ4ZTU5ZDBlJywgbmFtZToncG9seWZpbGxDbGllbnRTaWRlOmJ1aWxkJ30pXG5jcmVhdGUgKHN0YWdlNDpTdGFnZTpQcm9jZXNzIHsga2V5OiAnNDQ3NGJmNjYtNTJkNC00YjFmLWI0YTItZjU1ZmZmYzg0NDA0JyB9KVxuY3JlYXRlIChzdGFnZTQpLVs6RVhFQ1VURSB7IGtleTogJzAzZDVmZDA5LTAxYTUtNGJmYi04NzJiLWVmZTRiMDM2YzQ0NScgfV0tPihzdGFnZTQpXG5jcmVhdGUgKHN1YmdyYXBoNCktWzpST09UXS0+KHN0YWdlNClcblxuY3JlYXRlIChwKS1bOk5FWFRdLT4oc3ViZ3JhcGgxKVxuY3JlYXRlIChwKS1bOk5FWFRdLT4oc3ViZ3JhcGgyKVxuY3JlYXRlIChwKS1bOk5FWFRdLT4oc3ViZ3JhcGgzKVxuY3JlYXRlIChwKS1bOk5FWFRdLT4oc3ViZ3JhcGg0KVxuYGAvLyBjcmVhdGUgKHM6U3RhZ2U6UHJvY2VzcyB7a2V5Oic4MjkwMDA1Ni05ODc3LTQ5YjAtYmQ0Yy1kZjkxNmJmYjk1MDcnLCBuYW1lOicnfSk8LVs6UkVTT1VSQ0Uge2tleTonNGM0OGEzNjQtZjA3OC00MzFkLWJlMTUtNjhmZmM1MTkzNjI3JywgY29udGV4dDonYXBwbGljYXRpb25SZWZlcmVuY2UnfV0tKHQ6VGFzayB7a2V5OidhYzYzZjQ5YS1mNWM0LTQyMGQtYjUzNi0zZWRiMTBmMDE4NDEnLCBmdW5jdGlvbk5hbWU6Jyd9KVxuYGBtYXRjaCAoc3ViOlN1YmdyYXBoVGVtcGxhdGUge2tleTonMTcxZDE4ZjgtOWQyNS00NDgzLWFlYjktYTI5YzlmYmVkNmFjJ30pXG5jcmVhdGUgKHN1YiktWzpST09UXS0+KHM6U3RhZ2U6UG9ydCB7a2V5OiAnZGM2YWExNWEtNWY3Yy00ZDJlLTliYzAtZTY0ZDM1ODQyOTZmJywgaGFuZGxlUHJvcGFnYXRpb25JbXBsZW1lbnRhdGlvbjogXCJjaHJvbm9sb2dpY2FsXCJ9KVxuY3JlYXRlIChzKS1bOkZPUktdLT4ocylcbmBgXG5cbm1hdGNoIChlOkV2YWx1YXRpb24ge2tleTonYjU3ZmJiMWQtYzY1Yi00YmNmLThmNzYtMDRhOTQ0NGQzMDFmJ30pXG5jcmVhdGUgKGUpLVs6Q0FTRSB7a2V5OicyNTg3NDYyOC1mNTg2LTQ4YWItOWNkOS05OWI1ZTBkNzg0MWYnLGV4cGVjdGVkOnRydWV9XS0+KGMyOkNvbmZpZ3VyYXRpb24ge2FnZ3JlZ2F0aW9uOiAncHJvY2VzcyZpbmNsdWRlJywgcHJvcGFnYXRpb246ICdjb250aW51ZScsIGtleTonMzVkZjAyMWYtNzk5OS00MTk0LTk3ZTQtODNlYzc2YTJkNGUwJ30pXG5jcmVhdGUgKGUpLVs6Q0FTRSB7a2V5OicxZDEzNmNhMi1hN2ZjLTQxNzktOTg0ZS1iMjJiMWYzNzU4NjknLGV4cGVjdGVkOmZhbHNlfV0tPihjMzpDb25maWd1cmF0aW9uIHthZ2dyZWdhdGlvbjogJ3NraXBQcm9jZXNzJywgcHJvcGFnYXRpb246ICdicmVhaycsIGtleTonNGMwMmMyYTAtNDQ2MC00MTIxLWIyMTQtN2YyNzQxMWIxYjMzJ30pXG5jcmVhdGUgKGUpLVs6REVGQVVMVCB7a2V5OidiNzA2N2EyYS0zM2U5LTRmM2ItOTIyYS1kNDFhM2Y3ZjZkZjAnfV0tPihjMilcbmBcbiJdfQ==