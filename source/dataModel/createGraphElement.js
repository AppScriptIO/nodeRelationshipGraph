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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9kYXRhTW9kZWwvY3JlYXRlR3JhcGhFbGVtZW50LmpzIl0sIm5hbWVzIjpbImNyZWF0ZVN0YWdlIiwiY3JlYXRlU3ViZ3JhcGhUZW1wbGF0ZSJdLCJtYXBwaW5ncyI6Ijs7QUFFQSxTQUFTQSxXQUFULEdBQXVCO0FBQ3JCLEdBQUU7Ozs7OztHQUFEO0FBT0Y7Ozs7OztBQU1ELFNBQVNDLHNCQUFULEdBQWtDO0FBQ2hDLEdBQUU7O0dBQUQ7QUFHRjs7QUFFRCxDQUFFOzs7Ozs7OztDQVFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0EyQkE7Q0FDQTs7O0NBR0E7Ozs7OztDQXZDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIERhdGFiYXNlIG1vZGVscyBmb3IgY3JlYXRpbmcgR3JhcGggZWxlbWVudHMgKG11bHRpcGxlIHJlbGF0ZWQgbm9kZXMgd2l0aCB0aGVpciBjb25uZWN0aW9ucykuXG5cbmZ1bmN0aW9uIGNyZWF0ZVN0YWdlKCkge1xuICA7YFxuICAgIGNyZWF0ZSAoc3RhZ2U6U3RhZ2UgeyBrZXk6ICcnIH0pXG4gICAgXG4gICAgLy8gYWRkIGV4ZWN1dGUgY29ubmVjdGlvbiB0byBpdHNlbGZcbiAgICBjcmVhdGUgKHN0YWdlKS1bZXhlY3V0ZTpFWEVDVVRFIHsga2V5OiAnJyB9XS0+KHN0YWdlKVxuICAgIHNldCBzdGFnZTpQcm9jZXNzXG4gIGBcbn1cblxuLyoqIEdyYXBoIFRyYXZlcnNhbCBNb2RlbFxuICogVE9ETzogY3JlYXRlIHF1ZXJ5IGZ1bmN0aW9ucyBmb3IgZWFjaCBncmFwaCBlbGVtZW50LlxuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZVN1YmdyYXBoVGVtcGxhdGUoKSB7XG4gIDtgXG4gICAgY3JlYXRlICh0ZW1wbGF0ZTpTdWJncmFwaFRlbXBsYXRlIHtrZXk6JycsIG5hbWU6ICcnfSlcbiAgYFxufVxuXG47YFxuY3JlYXRlIChzdGFnZTpTdGFnZTpQb3J0IHsga2V5OiAnN2M1YzU2NzgtODJmNC00OWVhLWE4YTUtMzAzZTE0OGNiNzEwJywgaGFuZGxlUHJvcGFnYXRpb25JbXBsZW1lbnRhdGlvbjogJ2Nocm9ub2xvZ2ljYWwnIH0pXG5jcmVhdGUgKHN0YWdlKS1bZm9yazpGT1JLXS0+KHN0YWdlKVxuXG5cbmNyZWF0ZSAodGVtcGxhdGU6U3ViZ3JhcGhUZW1wbGF0ZSB7a2V5Oic1OGMxNWNjOC02ZjQwLTRkMGItODE1YS0wYjg1OTRhZWI5NzInLCBuYW1lOiAnYnVpbGQnfSlcbmNyZWF0ZSAodGVtcGxhdGUpLVs6Uk9PVF0tPihzdGFnZSlcblxuYGBcbm1hdGNoIChwOlN0YWdlIHtrZXk6JzdjNWM1Njc4LTgyZjQtNDllYS1hOGE1LTMwM2UxNDhjYjcxMCd9KVxuXG5jcmVhdGUgKHN1YmdyYXBoMTpTdWJncmFwaFRlbXBsYXRlIHtrZXk6J2E5ZTNiZTEwLWJkNzMtNDViYy05ZjQ0LTI1ZjljNjBhZGFjMScsIG5hbWU6J3NlcnZlclNpZGU6YnVpbGQnfSlcbmNyZWF0ZSAoc3RhZ2UxOlN0YWdlOlByb2Nlc3MgeyBrZXk6ICc5ZTNhZmZhNS04ZGM1LTQzOWItOTk3Yy05YTExNTQxYWM3MDAnIH0pXG5jcmVhdGUgKHN0YWdlMSktWzpFWEVDVVRFIHsga2V5OiAnM2E2MzNiMDktOGEyNy00YzQwLTg1MzItNDJhZTE3YjVjMjU0JyB9XS0+KHN0YWdlMSlcbmNyZWF0ZSAoc3ViZ3JhcGgxKS1bOlJPT1RdLT4oc3RhZ2UxKVxuXG5jcmVhdGUgKHN1YmdyYXBoMjpTdWJncmFwaFRlbXBsYXRlIHtrZXk6JzcyYTkyOGUwLThjZmUtNDFkYS1hODFhLTU4YTlhNTE2MWUyOCcsIG5hbWU6J2NsaWVudFNpZGU6YnVpbGQnfSlcbmNyZWF0ZSAoc3RhZ2UyOlN0YWdlOlByb2Nlc3MgeyBrZXk6ICcyYjEyOTAwZS0zZDY5LTRjOTgtYjQzMC1jZGVmM2RlODg4OWQnIH0pXG5jcmVhdGUgKHN0YWdlMiktWzpFWEVDVVRFIHsga2V5OiAnYzVkMTcwZDYtMTc1Ny00YjI1LWJjNzEtZTdmZjA3ZjY1YmJlJyB9XS0+KHN0YWdlMilcbmNyZWF0ZSAoc3ViZ3JhcGgyKS1bOlJPT1RdLT4oc3RhZ2UyKVxuXG5jcmVhdGUgKHN1YmdyYXBoMzpTdWJncmFwaFRlbXBsYXRlIHtrZXk6JzMxZDI2NTQwLWNjNDgtNGQ1NC04ZWJjLTc2NTYzMjgwMDY2NycsIG5hbWU6J25hdGl2ZUNsaWVudFNpZGU6YnVpbGQnfSlcbmNyZWF0ZSAoc3RhZ2UzOlN0YWdlOlByb2Nlc3MgeyBrZXk6ICczMTNiMTMxNi0xOTM3LTQ4OWQtOTYxNS05NWJlYTcwMDc0NGInIH0pXG5jcmVhdGUgKHN0YWdlMyktWzpFWEVDVVRFIHsga2V5OiAnMDYzYjE0NGYtMjVlNC00MzI3LTg1M2MtOWJlMDdhNTZlNzAwJyB9XS0+KHN0YWdlMylcbmNyZWF0ZSAoc3ViZ3JhcGgzKS1bOlJPT1RdLT4oc3RhZ2UzKVxuXG5jcmVhdGUgKHN1YmdyYXBoNDpTdWJncmFwaFRlbXBsYXRlIHtrZXk6JzkzM2I5MTRjLTM1ZTAtNDIzOS04NjhjLWZhZGY0OGU1OWQwZScsIG5hbWU6J3BvbHlmaWxsQ2xpZW50U2lkZTpidWlsZCd9KVxuY3JlYXRlIChzdGFnZTQ6U3RhZ2U6UHJvY2VzcyB7IGtleTogJzQ0NzRiZjY2LTUyZDQtNGIxZi1iNGEyLWY1NWZmZmM4NDQwNCcgfSlcbmNyZWF0ZSAoc3RhZ2U0KS1bOkVYRUNVVEUgeyBrZXk6ICcwM2Q1ZmQwOS0wMWE1LTRiZmItODcyYi1lZmU0YjAzNmM0NDUnIH1dLT4oc3RhZ2U0KVxuY3JlYXRlIChzdWJncmFwaDQpLVs6Uk9PVF0tPihzdGFnZTQpXG5cbmNyZWF0ZSAocCktWzpORVhUXS0+KHN1YmdyYXBoMSlcbmNyZWF0ZSAocCktWzpORVhUXS0+KHN1YmdyYXBoMilcbmNyZWF0ZSAocCktWzpORVhUXS0+KHN1YmdyYXBoMylcbmNyZWF0ZSAocCktWzpORVhUXS0+KHN1YmdyYXBoNClcbmBgLy8gY3JlYXRlIChzOlN0YWdlOlByb2Nlc3Mge2tleTonODI5MDAwNTYtOTg3Ny00OWIwLWJkNGMtZGY5MTZiZmI5NTA3JywgbmFtZTonJ30pPC1bOlJFU09VUkNFIHtrZXk6JzRjNDhhMzY0LWYwNzgtNDMxZC1iZTE1LTY4ZmZjNTE5MzYyNycsIGNvbnRleHQ6J2FwcGxpY2F0aW9uUmVmZXJlbmNlJ31dLSh0OlRhc2sge2tleTonYWM2M2Y0OWEtZjVjNC00MjBkLWI1MzYtM2VkYjEwZjAxODQxJywgZnVuY3Rpb25OYW1lOicnfSlcbmBgbWF0Y2ggKHN1YjpTdWJncmFwaFRlbXBsYXRlIHtrZXk6JzE3MWQxOGY4LTlkMjUtNDQ4My1hZWI5LWEyOWM5ZmJlZDZhYyd9KVxuY3JlYXRlIChzdWIpLVs6Uk9PVF0tPihzOlN0YWdlOlBvcnQge2tleTogJ2RjNmFhMTVhLTVmN2MtNGQyZS05YmMwLWU2NGQzNTg0Mjk2ZicsIGhhbmRsZVByb3BhZ2F0aW9uSW1wbGVtZW50YXRpb246IFwiY2hyb25vbG9naWNhbFwifSlcbmNyZWF0ZSAocyktWzpGT1JLXS0+KHMpXG5gYFxuXG5tYXRjaCAoZTpFdmFsdWF0aW9uIHtrZXk6J2I1N2ZiYjFkLWM2NWItNGJjZi04Zjc2LTA0YTk0NDRkMzAxZid9KVxuY3JlYXRlIChlKS1bOkNBU0Uge2tleTonMjU4NzQ2MjgtZjU4Ni00OGFiLTljZDktOTliNWUwZDc4NDFmJyxleHBlY3RlZDp0cnVlfV0tPihjMjpDb25maWd1cmF0aW9uIHthZ2dyZWdhdGlvbjogJ3Byb2Nlc3MmaW5jbHVkZScsIHByb3BhZ2F0aW9uOiAnY29udGludWUnLCBrZXk6JzM1ZGYwMjFmLTc5OTktNDE5NC05N2U0LTgzZWM3NmEyZDRlMCd9KVxuY3JlYXRlIChlKS1bOkNBU0Uge2tleTonMWQxMzZjYTItYTdmYy00MTc5LTk4NGUtYjIyYjFmMzc1ODY5JyxleHBlY3RlZDpmYWxzZX1dLT4oYzM6Q29uZmlndXJhdGlvbiB7YWdncmVnYXRpb246ICdza2lwUHJvY2VzcycsIHByb3BhZ2F0aW9uOiAnYnJlYWsnLCBrZXk6JzRjMDJjMmEwLTQ0NjAtNDEyMS1iMjE0LTdmMjc0MTFiMWIzMyd9KVxuY3JlYXRlIChlKS1bOkRFRkFVTFQge2tleTonYjcwNjdhMmEtMzNlOS00ZjNiLTkyMmEtZDQxYTNmN2Y2ZGYwJ31dLT4oYzIpXG5gXG4iXX0=