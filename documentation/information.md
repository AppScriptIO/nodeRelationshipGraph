# Graph Concepts: 
- Graph can represent any collection of objects having some kind of pairwise relationship. Many realworld systems and problems can be modeled using a graph.
- "Big O" (order of complexity) / complexity analysis of memory space and of operation time.
- Storage structure in computer's memory for the graph and nodes:
    - Data items to be processed are stored separetely from the graph nodes and edges. i.e. each data item can be referenced by multiple nodes (isn' strictly boudn to a single node).
    - Example of algorithms / data structures: 
        - Adjancency Matrix representation - using matrix array to store edeges for nodes. 
        - Adjacency list
- Handling multiple graphs in memory which are separated and traversals or caching are not shared. e.g. a graph for Middleware, another for Condition, Template, etc.

### Resources: 
- https://www.youtube.com/watch?v=gXgEDyodOJU&list=PL2_aWCzGMAwI3W_JlcBbtYTwiQSsOTa6P&index=38
- Graph workshop publications about different graph concepts including new researches http://www.termgraph.org.uk 

### Usage examples
Different applications may use this module:
- AST representation in NoSQL database.
- Task/command runner with ability for synchronous or async execution.
- Template system for creating complex templates. 
- etc.

### Graph / Node Relationship Graph / Nested Unit Tree concepts

- Usually the Graph that is used is Directed, Acyclic, Weighed, Sparsed (few edges in comparison to complexity analysis) Graph
    - Additional concepts: 
        - Multiedge/Parallel edges - Multiple connections between 2 verticies/nodes.
        - Loop allowed - i.e. self edges.
        - ports: group of connections that relate to each other or have specific configuration. (Similar concept - https://cs.stackexchange.com/questions/41320/terminology-for-a-graph-with-ports-on-its-nodes?newreg=33ff713616b04cdcbdd3df94b1ed841c) - https://hal.inria.fr/inria-00139363/en/ - https://pdf.sciencedirectassets.com/272990/1-s2.0-S1571066108X00398/1-s2.0-S1571066108004295/main.pdf?x-amz-security-token=AgoJb3JpZ2luX2VjEMf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIQCvZdWgrZO0wOBdg%2FjTVgf718GErc%2BXGpopAw45WVs%2FWgIgO3MA4xd%2BbFaJUV6g2LtDI7I%2FXnwo5T%2FHcL%2FxI9DMDqkq4wMI7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgwwNTkwMDM1NDY4NjUiDNM9FztsdW4tKsUwfSq3A8JVy7BnDSqkk4y7AF%2BNctHdBjymKOXej9nJt6iFJpcxrYoe7L2FE8Fusps8kkmOrVJO1GmENX9HCI%2FYOGn%2B1ruF8q3Xk43KuUlcnQ9E7oDm59OHzmq7K9PXuPo3VmPi%2Byy4OdWH%2Bcke7rnp9EU7MpYtRkPCpHmyvhFFQAkZKWU2o6v035BRYj%2Fad3sa%2F84u449%2FNPy%2Fp4IWjQ5AThG1GE3jdVPUbsScJepaHV2DAYoB7d%2BfuMgqdPUkfxAtsxInnop%2BCu4FUb33c4pyTW6%2FoWwryI%2BBHdgD64By6S3OK7b1zfFULIIxyr1E0%2BR8zcANV7nVgRwiPeywwyZFV3Cyl0j1depw2KPAmklyylq%2F%2FIOhbHkYLuMsoHn1VrxZ%2BWlSjvjMvdQt3wvAYDOKp2h%2F9jfDgHF5J%2BUzHzouDpVjjywJXNn8iyGPQJm7GQZux9agf50aCPjibTfv0XdZTQ2qb%2F%2B1HUhoszNiq2oCLis9h9CyoCPcyq%2FQJZEUUuOhzd6q9nI%2FKgUa02PZRQpOlXjlyhCV1%2FYImgLhciA3lXq2NDpG2RZEnzTV9Wn%2BgxnLBEnpHInCMTccAAAwzdqO6AU6tAHNRp3pBbeKfqX4wh1rSDMbgbirJoZ2ttS2Y1J1kougcviArz89sPoHyMrSCDwyyagp4iliwBzDXrTWHgIBBxWcvwM2SJbBbezdgbT%2Fj1CSKHTAvIy9gxyNvlruWHbuc%2FXMHiwHtutewMILYDdXGGX3WjCdtHaaz71gE9sG8nPY5BCxSV%2BRoC2DG6Xo656G5BzV4%2BU9%2FfCccO%2B7dFz6u4PVcpqG3l5zlyomrdYjplhjx0OPGlA%3D&AWSAccessKeyId=ASIAQ3PHCVTYXCAYIHPH&Expires=1560525929&Signature=gFYOp96H%2FODqGqldAqyADGIoaDQ%3D&hash=e7b16696987f9b907cdb54a17769fa584762761e1128f0b68cd2113e6c7d2f54&host=68042c943591013ac2b2430a89b270f6af2c76d8dfd086a07176afe7c76c2c61&pii=S1571066108004295&tid=spdf-fa81d04c-5e61-4c2b-8f9c-4d49a2bed7d7&sid=984b0854560f46497568f64-1e1b680a8b09gxrqb&type=client
        - the concept of additional children/edges, where a graph can be used through a proxy without manipulating it. Related to insertion points concept - adding nodes in insertion points in the graph.
- Relationship Graph: conveying of relational information. Directed graph. _Terminolog: ReusableNestedUnit_ 
- Trees: herarchies - nested treemaps = is a connected unweighted acyclic graph
- Node - _similar terminology: nestedUnit_
   
    e.g. Data: { Type: ‘reference’ || ‘value’, key: ‘XYZ’ }
- DataItem/Unit/Record: Resource implementation
    
    e.g. { Type: ‘reference’, importModuleName: ‘’, processData: ‘’ }
- Resource/File: Resource record
    
    e.g. { type: 'file', path: '' }
https://medium.freecodecamp.org/all-you-need-to-know-about-tree-data-structures-bceacb85490c
- port: _similar terminology = junction, synapse, group, insetionPoint, inlet/outlet, channel, junctionPoint, portal, relationship, relation_
- source/destination nodes - are nodes that make up the edges of a connection. _Or start/end nodes_
- path: a sequence of edges/connections that connect a sequence of nodes.
- connectionKey - _similar terminology: pathPointerKey_
- node inheritance - node that extends another node, in a way that any changes of the parent node is retained by the child node. _terminology: subnode, supernode, node extension/inheritance_ 
This is a better implementaiton for tree templates (extending an existing node tree without changing it) that used pathPointer or connectionPathSequence to reach the desired position for adding nodes inthe nested subtree/subnodes.
- override connection - node that extends/inherit from another node and overrides a specific connection of the supernode, if the supernode connectionKey is removed then the overriding connection of the subclass will be ignored.
- Directed Graph - Graph that can have opposite pointers between same 2 nodes.
- Oriented graph is a directed graph that has only one directrion between each 2 nodes (i.e. one arrow pointing to one direction from node to node)

## Traversal of Graph: 
- Data Items are the main subject and a Graph is used to decide on the way to deal with multiple data items processing - i.e. combination of processing results.
- Nodes / Vertex / Unit: 
    - Node reference a single data item that should be used or consumed in specific way.
    - Nodes have connections which determine the traversal propagation implementation. I.e. the concept of weighted graph. 
- Edges / Connections: represent relationship between nodes.
- Behaviors that should be configurable: 
    - Data processing algorithm of each node. e.g. create template.
    - Data colelctions algorithm during multiple nodes execution e.g. insert templates into each other or aggregate middleware functions to create a chain/pipeline.
    - Graph propagation - conditional traversal, parallel, changing data processing config/implementation. 
    - General traversal control parameters. e.g. depth, stop on met condition, on-demand node registration in the Graph controller / memory storage, etc.
____
• JS AST can be saved in a flat structure implemented in relationship graph, allowing reusability of nodes/units.
___
## Meta-API 
• Regarding Api of Api - Data about data is called metadata, and therefore api about an apit is metaApi. Used to create visual programming app, that reads the language api to choose AST options.
___
## Design Patterns
- Modular Application Architecture / Plugin-based architecture / plugin-based application / Plugin System Structure / Extending modules using a plugin architecture
https://stackoverflow.com/questions/10763006/plugin-architecture-in-web-apps-examples-or-code-snippets
- A concept of prototype chain where constructors could be instantiated separately, creating a prototype chain with objects that are not strictly attached by a first contructor call. 
e.g. 
    ```
    let pluginContext = new PluginContext()
    let cacheContext = new CacheContext()
    // will create a chain with parameter objects involved.
    let controller = new Controller({ cacheContext, pluginContext })
    // will create a chain with parameter objects involved where one of them is dynamically changed, and the rest are shared accross "controler" instances.
    let controller = new Controller({ new CacheContext(), pluginContext })
    ```
    What the current behaviour of Javascript prototypal inheritance is that constructor creates a single object that delagates to constructor prototypes. What is missing is a way to allow delegation to upper dynamically created objects that relate to superconstructors (upper level classes) when needed. This allows to share context between specific instances and divide them into groups that do not affect each other and are soft linked (i.e. the shared context can be garbage collected like the instances that are part of it).
- Class generators - wrapping classes with functions allows generating classes on demand that extend a variable superclass.
        
___
## Concept/Abstraction visual programming - programming using abstractions in a visual interface.
Naming proposal - just like `abstract syntax tree`, call it `abstract node graph`, `abstract visual programming`

others: 
- load-time (program startup time where afterwards its ready to take requests)
___
[Development TODO list](/documentation/TODO.md)

___

### 🔑 License: [MIT](/.github/LICENSE)
