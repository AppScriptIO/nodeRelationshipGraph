# Graph Traversal
A graph traversal & node processing module with customizable implementations. It hands back control to the client allowing to manipulate the control flow of traversals and data processing logic.
- On each traversal a node data can be processed/executed, taking into account precedence constraints.
- The graph traversal module is callback & Proxy based, which hands overcontrol to concrete functions and returns an iterator of results that the proxy implementation can decide what to do with. Permitting highly configurable traversal behavior.
- Created for graph where the node's data is the main subject, & traversal rules/configs of a relational graph, are used to decide on the way to deal with multiple processings of the nodes's data - i.e. processing logic & combination of results.

### Configerability of traverser:
_Behaviors that should be configurable:_
- Data processing algorithm of each node. e.g. create template.
- Data colelctions algorithm during multiple nodes execution e.g. insert templates into each other or aggregate middleware functions to create a chain/pipeline.
    - Changing data processing config/implementation mid-traversal. 
    - Nodes a selectively included or excluded from the results.
- Graph propagation - conditional traversal, or parallel traversals.
    - Each node can halt (e.g. stop on met condition) the traverser or let it continue through the graph.
- General traversal control parameters. e.g. depth. 
- on-demand node registration in the Graph controller / memory storage, etc. In case the graph isn't loaded into memory by it's entirety.

### Applications: 
Different applications may use this module:
- Build systems with package dependencies - make a topological sort to know which library should be built first.
- Creating pipelines to manipulate data. e.g.  [CI/CD pipelines](https://docs.gitlab.com/ee/ci/pipelines.html). 
    - Execution pipelines for code building.
    - Task/command runner with ability for synchronous or async execution.
- Task schedualing - which task should procede which one. 
- AST representation in NoSQL database.
- Template system for creating complex templates. 
- Server request handling with on the fly middleware chain compisition.
- etc.

# Graph Concepts: 
- **Graph** _(Node Relationship Graph / Nested Unit Tree)_ - can represent any collection of objects having some kind of pairwise relationship (conveying of relational information). Many realworld systems and problems can be modeled using a graph.

- **Graph type & features** - Usually the Graph that is used is Directed, Acyclic or cyclic, Weighed, Sparsed _(few edges in comparison to complexity analysis)_, & immediately-processed graph (created to be processed during traversal).  e.g. Trees/Herarchies/Nested Treemaps.
    - **Multiedge/Parallel edges** - Multiple connections between 2 verticies/nodes.
    - **Self edges** - Loop allowed graph.
    - **ports**: group of connections that relate to each other or have specific configuration. (Related resources - [Stackoverflow - Terminology for a graph with ports on its nodes](https://cs.stackexchange.com/questions/41320/terminology-for-a-graph-with-ports-on-its-nodes?newreg=33ff713616b04cdcbdd3df94b1ed841c), [Multigraphs with Ports publication 1](https://hal.inria.fr/inria-00139363/en/), [Multigraphs with Ports publication 1](https://www.sciencedirect.com/science/article/pii/S1571066108004295).
    - **Path** - is a chain of edges that specifies a path from & to a pair of nodes. A sequence of edges/connections that connect a sequence of nodes.
    - **Lazy execution during traversal** - on each node reached the traversal could be halted or continued and a processing implementation could be executed before continuing traversing or have a side effect during execution.
    - **Node & edge filter** - some implementations can filter specific nodes through conditions.
    - **node inheritance** _(subnode-supernode / node extension/inheritance)_ - node that extends another node, in a way that any changes of the parent node is retained by the child node. 
    This is a better implementaiton for tree templates (extending an existing node tree without changing it) that used pathPointer or connectionPathSequence to reach the desired position for adding nodes inthe nested subtree/subnodes.
        - override connection - node that extends/inherit from another node and overrides a specific connection of the supernode, if the supernode connectionKey is removed then the overriding connection of the subclass will be ignored.
    - **Reusable Subgraph Template** (will be refered shortly as “subgraph”) – A part of a directed graph with a root node, representing the entrypoint to the subgraph. The subgraph could be referenced by nodes in the graph, and could be extended by other “subgraph templates”. Extending a subgraph allows to insert additional nodes to the subgraph in desired positions or paths (traversal chain or sequence of edges). Much in the sense of externally mapping the same target graph into other different graphs, without changing the original target graph. 
    (a function which takes a graph* (your 'subgraph') *as an input and maps to another graph dependent on that input.)
        - _subgraph template_ node - marks an entrypoint to a graph, and allows for adding external nodes to it. It may also create a new interface to the target graph, where it specifies possible connection positions or ports to map it to the external graph. `extends` - will allow to create instances of another subgraph with different manipulation parameters.
        - **Additional children/edges** conecpt - where a graph can be used (traversed) through a proxy without manipulating it directly. Related to insertion points concept - adding nodes in insertion points in the graph. Each edge has a position/arrangement property that defines the order and a placement (in case it is an additional connection to be traversed). e.g. `pathPointerKey`/`connectionKey` could be an additional conenction that is added to the existing conenctions for traversal purposes.


- **Graph Elements**:
    - **Edge** _(Relationship / Connection)_ - Edges could be directed with 'ingoing'/'outgoing' direction.
        - Source/destination nodes - are nodes that make up the edges of a connection. _Or start/end nodes_
        - connectionKey / pathPointerKey
    - **Node** _(Vertex / ReusableNestedUnit / Unit)_ - e.g. a node references a single data item that should be used or consumed in specific way. Nodes have connections which determine the traversal propagation implementation. I.e. the concept of weighted graph.
        - DataItem/Record - a node as a resource of data to be executed by a processing implementation. e.g. { Type: ‘reference’, importModuleName: ‘’, processData: ‘’ }
        - Resource/File: Resource record e.g. { type: 'file', path: '' }
    - **Port** _(insetionPoint)_ (_related terminology = junction, synapse, group, inlet/outlet, channel, junctionPoint, portal, relationship, relation_).

___
# Usage:

### General steps
- Supply with grpah.load graph into memory: 
    - application's logic variables. 
    - In memory graph database.
- set traversal / rules
    - parameters flags & switch keys/options.
    - parameter implementations passed
- Start traversal from entrypoint (starting point) node.
    - nodes can change traversal rules to next traversals.
    - nodes (e.g. Stages) can halt traversal or continue (can control traversal propagation).
- Traverser will execute the nodes according to parameters, and decide which results of which nodes to include.

### API: 
- iterator of node's connections 
- In-memory database: Build a pluggable in memory handling of graph entities. Handling in memory api: 
    - get connections
    - get ports 
    - get connections of a port. 

### In-memory storage structure & requirements:
- Example of algorithms / data structures for graph storage: 
    - Adjancency Matrix representation - using matrix array to store edeges for nodes. 
    - Adjacency list
- Data items to be processed are stored as part of the graph. Each data item can be referenced/connected by multiple nodes (isn' strictly boudn to a single node).
- Handling multiple graphs in memory which are separated and traversals or caching are not shared. e.g. a graph for Middleware, another for Condition, Template, etc.

### Integration between different node types in mixed or separate subgraphs, according to the nodes' intended usage:
- Middleware: execute
- Condition: evaluate and control propagation. Conditionally skip the task execution
    a graph that checks conditions while traversing and returns an answer to complex conditional relations with prerequisite conditions. e.g. could be used for routing to a desired value/callback/action.
- Template: aggregation
- Data query schema: execute

### How to deal with extending an existing graph / templating a subgraph, where additional connections can be added to the graph in specific places. (node inheritance concept mentioned above)

___
# Resources 
_resources about graphs and different implementations:_
- Related to extending graphs - https://en.wikipedia.org/wiki/Graph_minor#Example
- Neo4j example traversal APi - https://neo4j.com/docs/java-reference/current/tutorial-traversal/
- Topological sort of graph based on the interconnected edges, not any numeric value (non-numeric sort). a set of tasks to be completed in precedence constraints (precedence schedualing) - DepthFirstOrder using DFS algorithm - https://fr.coursera.org/lecture/algorithms-part2/topological-sort-RAMNS
- https://www.youtube.com/watch?v=gXgEDyodOJU&list=PL2_aWCzGMAwI3W_JlcBbtYTwiQSsOTa6P&index=38
- Graph workshop publications about different graph concepts including new researches http://www.termgraph.org.uk 
- verbal explanation of execution order concept - https://stackoverflow.com/questions/6477269/how-to-use-graph-theory-for-scheduling-execution-order
- https://en.wikipedia.org/wiki/Topological_sorting
- https://stackoverflow.com/questions/6749255/directed-graph-processing-in-java
- https://github.com/idooley/DAGExecutor
- https://jgrapht.org/ - check out summary of the graph framework.
- https://youtu.be/Q9PIxaNGnig?t=151
- https://github.com/trekhleb/javascript-algorithms/tree/master/src/algorithms/graph/topological-sorting
- https://davidurbina.blog/on-partial-order-total-order-and-the-topological-sort/
- Graph API - https://www.coursera.org/lecture/algorithms-part2/digraph-api-Jeyta
- https://davidurbina.blog/on-partial-order-total-order-and-the-topological-sort/
- [Tree structures article](https://medium.freecodecamp.org/all-you-need-to-know-about-tree-data-structures-bceacb85490c)
- Study Neo4j traversal API in depth 
    - Examples - https://github.com/neo4j/neo4j-documentation/blob/3.5/embedded-examples/src/main/java/org/neo4j/examples/TraversalExample.java 
    - code - https://github.com/neo4j/neo4j/tree/ba4e188d51e027a7e7870d511044ea940cf0455e/community/graphdb-api/src/main/java/org/neo4j/graphdb/traversal
- yWorks diagramming tools - products like the html graph editor, and Neo4j graph presentation. 
    - Documentation contains lots of useful definitions, and so the evaluation version.
# Notes: 
- Generally speaking, there isn't really a concept of mutable state in abstract algebra (of which Graph Theory is a part). Only existence/non-existence. Graphs have a static state, and cannot be mutable in common Graph Theory concepts. Any 'change' indicated would be another distinct graph.
___
[Development TODO list](/documentation/TODO.md)

___

### 🔑 License: [MIT](/.github/LICENSE)
