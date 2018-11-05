### nodeRelationshipGraph concepts

- Relationship Graph: conveying of relational information. Directed graph. _Terminolog: ReusableNestedUnit_
- Trees: herarchies - nested treemaps = is a connected unweighted acyclic graph
- node - _similar terminology: nestedUnit_
- Unit: data item / record. Resource implementation
- File: Resource record
https://medium.freecodecamp.org/all-you-need-to-know-about-tree-data-structures-bceacb85490c
- port: _similar terminology = junction, synapse, group, insetionPoint, inlet/outlet, channel, junctionPoint, portal, relationship, relation_
- source/destination nodes - are nodes that make up the edges of a connection. _Or start/end nodes_
- path: a sequence of edges/connections that connect a sequence of nodes.
- connectionKey - _similar terminology: pathPointerKey_
- node inheritance - node that extends another node, in a way that any changes of the parent node is retained by the child node. _terminology: subnode, supernode, node extension/inheritance_ 
This is a better implementaiton for tree templates (extending an existing node tree without changing it) that used pathPointer or connectionPathSequence to reach the desired position for adding nodes inthe nested subtree/subnodes.
- override connection - node that extends/inherit from another node and overrides a specific connection of the supernode, if the supernode connectionKey is removed then the overriding connection of the subclass will be ignored.
____
• JS AST can be saved in a flat structure implemented in relationship graph, allowing reusability of nodes/units.
___
## Meta-API 
• Regarding Api of Api - Data about data is called metadata, and therefore api about an apit is metaApi. Used to create visual programming app, that reads the language api to choose AST options.
___
## Design Patterns
Modular Application Architecture / Plugin-based architecture / plugin-based application / Plugin System Structure / Extending modules using a plugin architecture
- https://stackoverflow.com/questions/10763006/plugin-architecture-in-web-apps-examples-or-code-snippets
- 
___
## Concept/Abstraction visual programming - programming using abstractions in a visual interface.