"use strict";




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

`;
}

function port() {
  ;`  create (n)-[:FORK]->(n)
  set n:Port
  set n.handlePropagationImplementation = "chronological"
`;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9kYXRhTW9kZWwvY3JlYXRlR3JhcGhFbGVtZW50LmpzIl0sIm5hbWVzIjpbInJlcm91dGUiLCJwb3J0Il0sIm1hcHBpbmdzIjoiOzs7OztBQUtBLFNBQVNBLE9BQVQsR0FBbUI7QUFDakIsR0FBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FBRDtBQWtCRjs7QUFFRCxTQUFTQyxJQUFULEdBQWdCO0FBQ2QsR0FBRTs7O0NBQUQ7QUFJRiIsInNvdXJjZXNDb250ZW50IjpbIi8vIERhdGFiYXNlIG1vZGVscyBmb3IgY3JlYXRpbmcgR3JhcGggZWxlbWVudHMgKG11bHRpcGxlIHJlbGF0ZWQgbm9kZXMgd2l0aCB0aGVpciBjb25uZWN0aW9ucykuXG4vKiogR3JhcGggVHJhdmVyc2FsIE1vZGVsXG4gKiBUT0RPOiBjcmVhdGUgcXVlcnkgZnVuY3Rpb25zIGZvciBlYWNoIGdyYXBoIGVsZW1lbnQuXG4gKi9cblxuZnVuY3Rpb24gcmVyb3V0ZSgpIHtcbiAgO2AgIG1hdGNoIChuIHtrZXk6Jyd9KVxuICBjcmVhdGUgKG4pXG4gICAgLVs6Q0FTRSB7ZXhwZWN0ZWQ6IFwiR0VUXCJ9XS0+XG4gICAgKHI6UmVyb3V0ZSB7bmFtZTogJ3JlcXVlc3QgVVJMIHBhdGggc3dpdGNoJ30pXG4gICAgICAgIGNyZWF0ZSAociktWzpSRUZFUkVOQ0Uge3Jlc29sdXRpb25JbXBsZW1lbnRhdGlvbjogXCJjYXNlU3dpdGNoXCJ9XS0+IChyKVxuICBjcmVhdGUgKHIpXG4gICAgPC1bOlZBTFVFIHtpbXBsZW1lbnRhdGlvbjogXCJjb25kaXRpb25TdWJncmFwaFwifV0tXG4gICAgKHM6U3RhZ2U6UHJvY2VzczpGdW5jdGlvbiB7ZnVuY3Rpb25OYW1lOiBcImdldFVybFBhdGhMZXZlbDFcIn0pXG4gICAgICAgIGNyZWF0ZSAocyktWzpFWEVDVVRFXS0+KHMpXG4gICAgICAgIGNyZWF0ZSAocyktWzpSRVNPVVJDRSB7Y29udGV4dDogXCJhcHBsaWNhdGlvblJlZmVyZW5jZVwifV0tPihzKVxuXG4gIG1hdGNoIChuIHtrZXk6ICcnfSlcbiAgICBjcmVhdGUgKG4pIC1bOlZBTFVFIHtpbXBsZW1lbnRhdGlvbjogXCJjb25kaXRpb25TdWJncmFwaFwifV0tPiAobilcbiAgICBjcmVhdGUgKG4pIC1bOkVYRUNVVEVdLT4gKG4pXG4gICAgY3JlYXRlIChuKSAtWzpSRVNPVVJDRSB7Y29udGV4dDogXCJhcHBsaWNhdGlvblJlZmVyZW5jZVwifV0tPiAobilcbiAgc2V0IG46U3RhZ2U6UHJvY2VzczpGdW5jdGlvbjsgc2V0IG4uZnVuY3Rpb25OYW1lID0gXCJnZXRSZXF1ZXN0TWV0aG9kXCJcblxuYFxufVxuXG5mdW5jdGlvbiBwb3J0KCkge1xuICA7YCAgY3JlYXRlIChuKS1bOkZPUktdLT4obilcbiAgc2V0IG46UG9ydFxuICBzZXQgbi5oYW5kbGVQcm9wYWdhdGlvbkltcGxlbWVudGF0aW9uID0gXCJjaHJvbm9sb2dpY2FsXCJcbmBcbn1cbiJdfQ==