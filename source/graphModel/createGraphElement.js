"use strict";

function createStage() {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9ncmFwaE1vZGVsL2NyZWF0ZUdyYXBoRWxlbWVudC5qcyJdLCJuYW1lcyI6WyJjcmVhdGVTdGFnZSIsImNyZWF0ZVN1YmdyYXBoVGVtcGxhdGUiXSwibWFwcGluZ3MiOiI7O0FBRUEsU0FBU0EsV0FBVCxHQUF1QjtBQUNyQixHQUFFOzs7Ozs7R0FBRDtBQU9GOzs7Ozs7QUFNRCxTQUFTQyxzQkFBVCxHQUFrQztBQUNoQyxHQUFFOztHQUFEO0FBR0Y7O0FBRUQsQ0FBRTs7Ozs7Ozs7Q0FRQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBMkJBO0NBQ0E7OztDQUdBOzs7Ozs7Q0F2Q0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBEYXRhYmFzZSBtb2RlbHMgZm9yIGNyZWF0aW5nIEdyYXBoIGVsZW1lbnRzIChtdWx0aXBsZSByZWxhdGVkIG5vZGVzIHdpdGggdGhlaXIgY29ubmVjdGlvbnMpLlxuXG5mdW5jdGlvbiBjcmVhdGVTdGFnZSgpIHtcbiAgO2BcbiAgICBjcmVhdGUgKHN0YWdlOlN0YWdlIHsga2V5OiAnJyB9KVxuICAgIFxuICAgIC8vIGFkZCBleGVjdXRlIGNvbm5lY3Rpb24gdG8gaXRzZWxmXG4gICAgY3JlYXRlIChzdGFnZSktW2V4ZWN1dGU6RVhFQ1VURSB7IGtleTogJycgfV0tPihzdGFnZSlcbiAgICBzZXQgc3RhZ2U6UHJvY2Vzc1xuICBgXG59XG5cbi8qKiBHcmFwaCBUcmF2ZXJzYWwgTW9kZWxcbiAqIFRPRE86IGNyZWF0ZSBxdWVyeSBmdW5jdGlvbnMgZm9yIGVhY2ggZ3JhcGggZWxlbWVudC5cbiAqL1xuXG5mdW5jdGlvbiBjcmVhdGVTdWJncmFwaFRlbXBsYXRlKCkge1xuICA7YFxuICAgIGNyZWF0ZSAodGVtcGxhdGU6U3ViZ3JhcGhUZW1wbGF0ZSB7a2V5OicnLCBuYW1lOiAnJ30pXG4gIGBcbn1cblxuO2BcbmNyZWF0ZSAoc3RhZ2U6U3RhZ2U6UG9ydCB7IGtleTogJzdjNWM1Njc4LTgyZjQtNDllYS1hOGE1LTMwM2UxNDhjYjcxMCcsIGhhbmRsZVByb3BhZ2F0aW9uSW1wbGVtZW50YXRpb246ICdjaHJvbm9sb2dpY2FsJyB9KVxuY3JlYXRlIChzdGFnZSktW2Zvcms6Rk9SS10tPihzdGFnZSlcblxuXG5jcmVhdGUgKHRlbXBsYXRlOlN1YmdyYXBoVGVtcGxhdGUge2tleTonNThjMTVjYzgtNmY0MC00ZDBiLTgxNWEtMGI4NTk0YWViOTcyJywgbmFtZTogJ2J1aWxkJ30pXG5jcmVhdGUgKHRlbXBsYXRlKS1bOlJPT1RdLT4oc3RhZ2UpXG5cbmBgXG5tYXRjaCAocDpTdGFnZSB7a2V5Oic3YzVjNTY3OC04MmY0LTQ5ZWEtYThhNS0zMDNlMTQ4Y2I3MTAnfSlcblxuY3JlYXRlIChzdWJncmFwaDE6U3ViZ3JhcGhUZW1wbGF0ZSB7a2V5OidhOWUzYmUxMC1iZDczLTQ1YmMtOWY0NC0yNWY5YzYwYWRhYzEnLCBuYW1lOidzZXJ2ZXJTaWRlOmJ1aWxkJ30pXG5jcmVhdGUgKHN0YWdlMTpTdGFnZTpQcm9jZXNzIHsga2V5OiAnOWUzYWZmYTUtOGRjNS00MzliLTk5N2MtOWExMTU0MWFjNzAwJyB9KVxuY3JlYXRlIChzdGFnZTEpLVs6RVhFQ1VURSB7IGtleTogJzNhNjMzYjA5LThhMjctNGM0MC04NTMyLTQyYWUxN2I1YzI1NCcgfV0tPihzdGFnZTEpXG5jcmVhdGUgKHN1YmdyYXBoMSktWzpST09UXS0+KHN0YWdlMSlcblxuY3JlYXRlIChzdWJncmFwaDI6U3ViZ3JhcGhUZW1wbGF0ZSB7a2V5Oic3MmE5MjhlMC04Y2ZlLTQxZGEtYTgxYS01OGE5YTUxNjFlMjgnLCBuYW1lOidjbGllbnRTaWRlOmJ1aWxkJ30pXG5jcmVhdGUgKHN0YWdlMjpTdGFnZTpQcm9jZXNzIHsga2V5OiAnMmIxMjkwMGUtM2Q2OS00Yzk4LWI0MzAtY2RlZjNkZTg4ODlkJyB9KVxuY3JlYXRlIChzdGFnZTIpLVs6RVhFQ1VURSB7IGtleTogJ2M1ZDE3MGQ2LTE3NTctNGIyNS1iYzcxLWU3ZmYwN2Y2NWJiZScgfV0tPihzdGFnZTIpXG5jcmVhdGUgKHN1YmdyYXBoMiktWzpST09UXS0+KHN0YWdlMilcblxuY3JlYXRlIChzdWJncmFwaDM6U3ViZ3JhcGhUZW1wbGF0ZSB7a2V5OiczMWQyNjU0MC1jYzQ4LTRkNTQtOGViYy03NjU2MzI4MDA2NjcnLCBuYW1lOiduYXRpdmVDbGllbnRTaWRlOmJ1aWxkJ30pXG5jcmVhdGUgKHN0YWdlMzpTdGFnZTpQcm9jZXNzIHsga2V5OiAnMzEzYjEzMTYtMTkzNy00ODlkLTk2MTUtOTViZWE3MDA3NDRiJyB9KVxuY3JlYXRlIChzdGFnZTMpLVs6RVhFQ1VURSB7IGtleTogJzA2M2IxNDRmLTI1ZTQtNDMyNy04NTNjLTliZTA3YTU2ZTcwMCcgfV0tPihzdGFnZTMpXG5jcmVhdGUgKHN1YmdyYXBoMyktWzpST09UXS0+KHN0YWdlMylcblxuY3JlYXRlIChzdWJncmFwaDQ6U3ViZ3JhcGhUZW1wbGF0ZSB7a2V5Oic5MzNiOTE0Yy0zNWUwLTQyMzktODY4Yy1mYWRmNDhlNTlkMGUnLCBuYW1lOidwb2x5ZmlsbENsaWVudFNpZGU6YnVpbGQnfSlcbmNyZWF0ZSAoc3RhZ2U0OlN0YWdlOlByb2Nlc3MgeyBrZXk6ICc0NDc0YmY2Ni01MmQ0LTRiMWYtYjRhMi1mNTVmZmZjODQ0MDQnIH0pXG5jcmVhdGUgKHN0YWdlNCktWzpFWEVDVVRFIHsga2V5OiAnMDNkNWZkMDktMDFhNS00YmZiLTg3MmItZWZlNGIwMzZjNDQ1JyB9XS0+KHN0YWdlNClcbmNyZWF0ZSAoc3ViZ3JhcGg0KS1bOlJPT1RdLT4oc3RhZ2U0KVxuXG5jcmVhdGUgKHApLVs6TkVYVF0tPihzdWJncmFwaDEpXG5jcmVhdGUgKHApLVs6TkVYVF0tPihzdWJncmFwaDIpXG5jcmVhdGUgKHApLVs6TkVYVF0tPihzdWJncmFwaDMpXG5jcmVhdGUgKHApLVs6TkVYVF0tPihzdWJncmFwaDQpXG5gYC8vIGNyZWF0ZSAoczpTdGFnZTpQcm9jZXNzIHtrZXk6JzgyOTAwMDU2LTk4NzctNDliMC1iZDRjLWRmOTE2YmZiOTUwNycsIG5hbWU6Jyd9KTwtWzpSRVNPVVJDRSB7a2V5Oic0YzQ4YTM2NC1mMDc4LTQzMWQtYmUxNS02OGZmYzUxOTM2MjcnLCBjb250ZXh0OidhcHBsaWNhdGlvblJlZmVyZW5jZSd9XS0odDpUYXNrIHtrZXk6J2FjNjNmNDlhLWY1YzQtNDIwZC1iNTM2LTNlZGIxMGYwMTg0MScsIGZ1bmN0aW9uTmFtZTonJ30pXG5gYG1hdGNoIChzdWI6U3ViZ3JhcGhUZW1wbGF0ZSB7a2V5OicxNzFkMThmOC05ZDI1LTQ0ODMtYWViOS1hMjljOWZiZWQ2YWMnfSlcbmNyZWF0ZSAoc3ViKS1bOlJPT1RdLT4oczpTdGFnZTpQb3J0IHtrZXk6ICdkYzZhYTE1YS01ZjdjLTRkMmUtOWJjMC1lNjRkMzU4NDI5NmYnLCBoYW5kbGVQcm9wYWdhdGlvbkltcGxlbWVudGF0aW9uOiBcImNocm9ub2xvZ2ljYWxcIn0pXG5jcmVhdGUgKHMpLVs6Rk9SS10tPihzKVxuYGBcblxubWF0Y2ggKGU6RXZhbHVhdGlvbiB7a2V5OidiNTdmYmIxZC1jNjViLTRiY2YtOGY3Ni0wNGE5NDQ0ZDMwMWYnfSlcbmNyZWF0ZSAoZSktWzpDQVNFIHtrZXk6JzI1ODc0NjI4LWY1ODYtNDhhYi05Y2Q5LTk5YjVlMGQ3ODQxZicsZXhwZWN0ZWQ6dHJ1ZX1dLT4oYzI6Q29uZmlndXJhdGlvbiB7YWdncmVnYXRpb246ICdwcm9jZXNzJmluY2x1ZGUnLCBwcm9wYWdhdGlvbjogJ2NvbnRpbnVlJywga2V5OiczNWRmMDIxZi03OTk5LTQxOTQtOTdlNC04M2VjNzZhMmQ0ZTAnfSlcbmNyZWF0ZSAoZSktWzpDQVNFIHtrZXk6JzFkMTM2Y2EyLWE3ZmMtNDE3OS05ODRlLWIyMmIxZjM3NTg2OScsZXhwZWN0ZWQ6ZmFsc2V9XS0+KGMzOkNvbmZpZ3VyYXRpb24ge2FnZ3JlZ2F0aW9uOiAnc2tpcFByb2Nlc3MnLCBwcm9wYWdhdGlvbjogJ2JyZWFrJywga2V5Oic0YzAyYzJhMC00NDYwLTQxMjEtYjIxNC03ZjI3NDExYjFiMzMnfSlcbmNyZWF0ZSAoZSktWzpERUZBVUxUIHtrZXk6J2I3MDY3YTJhLTMzZTktNGYzYi05MjJhLWQ0MWEzZjdmNmRmMCd9XS0+KGMyKVxuYFxuIl19