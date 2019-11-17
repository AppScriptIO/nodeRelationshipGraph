# Graph Traversal
An immediately executed graph traversal, where nodes instruct on performing actions in customizable implementations. It hands back control to the client allowing to manipulate the traversal propagation and node data processing logic.
- On each traversal a node data can be processed/executed, taking into account precedence constraints.
- The graph traversal module is callback & Proxy based, which hands overcontrol to concrete functions and returns an iterator of results that the proxy implementation can decide what to do with. Permitting highly configurable traversal behavior.
- Created for graph where the node's data is the main subject, & traversal rules/configs of a relational graph, are used to decide on the way to deal with multiple processings of the nodes's data - i.e. processing logic & combination of results.
- The core code of the module is separate from the plugin implementations and largely involved in the integration between the plugin implementations.

### Configerability of traverser:
_Behaviors that should be configurable:_
- Data processing algorithm of each node. e.g. create template.
    - In order to allow execution of programs or tasks in the JS programs, the graph nodes should have references to a specific context with more dynamic data stored. As the graph database is limited to primitive types, a solution could be in the pattern of using the following: 
        - *Reference*: A string property that references a target entity in a specific context. e.g. a function name in the context of the program, or a filename or path in the context of the filesystem. 
        - *Context*: A context is an existing and accessible environment through the application logic. e.g. A passed shared object to the traverser with key-value references to a target elements, filesystem environment where the path of the file and name of the exported elements can be referenced, a module reference in the scope of the function where the traverser is executed. 
        An implementation of application context could be using hash map where the keys are referenced in the database and the values are the scopped callback with application parameters used.
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
- Programming concepts implemented in the graph: 
    - Command execution in sequence and in parallel.
    - Conditionals - logical operations: 
        - Switch multiple cases
        - Switch boolean cases
        (Both of the above could be represented as a special type of Stage node) 
        - AND logical operator
        - OR logical operator 
        (Both of the above can be represented as a propagation implementation in a port with several next stages traversed.)
    - Nodes types concept: 
        - Each node type has plugable implementations.
        - Each node gives instructions to traverser and returns a specific return type that is used in the integration layer (core layer) of the graph traversal module.
- Classification of node types/labels: 
    - Entrypoint/Root nodes: are nodes that can be traversed, and provided as an entrypoint to the graph.
        - e.g. Stage, Reroute/SubgraphTemplate.
    - Nested/Supplement nodes: are nodes which are nested to other nodes and provide features for the traversal. The traversion could not start from these nodes.
        - e.g. Port, Configuration, Process.
    - Reference/Reroute nodes: Nodes that are treated as a placement for other nodes (referencing other nodes). Reroute node also allows to divide a graph into subgraphs by pointing to a root node as reference and storing information about the subgraph.
        Reference nodes could be used as: (Maybe check https://www.worldscientific.com/doi/abs/10.1142/9789812384720_0001)
            - Node replacement positions: Where the position node is ment to be replaced with the target node (referenced node).
            - Node placement in subgraph: Where the reference nodes are ment to be placed into a target subgraph (e.g. added into the next relatioship of a stage).
        - e.g. Reroute, Switch nodes, and maybe Reroute/SubgraphTemplate could be considered a reference node.

- **Graph type & features** - Usually the Graph that is used is Directed, Acyclic or cyclic, Weighed, Sparsed _(few edges in comparison to complexity analysis)_, & immediately-processed graph (created to be processed during traversal).  e.g. Trees/Herarchies/Nested Treemaps.
    - **Stage nodes**: are node traverser positions that guide the traverser to perform actions involding adverse effects or returning results.
    - **Procss nodes**: are responsible for data process, performing actions and optionally returning a result. Each Process node uses it's own properties and traversal information to result in an action/effect, depending on the implementation being used.
    - **Multiedge/Parallel edges** - Multiple connections between 2 verticies/nodes.
    - **Self edges** - Loop allowed graph.
    - **ports**: group of connections that relate to each other or have specific configuration. (Related resources - [Stackoverflow - Terminology for a graph with ports on its nodes](https://cs.stackexchange.com/questions/41320/terminology-for-a-graph-with-ports-on-its-nodes?newreg=33ff713616b04cdcbdd3df94b1ed841c), [Multigraphs with Ports publication 1](https://hal.inria.fr/inria-00139363/en/), [Multigraphs with Ports publication 1](https://www.sciencedirect.com/science/article/pii/S1571066108004295).
    Ports control the traverser propagation order to the next Stage nodes (propagation control), in addition to grouping the Stages into meaningful groups that could be used in the aggregator implementations.
        - Selective/restricted port concepts: a port that propages according to a set of rules or conditions. Ports can be chained to further filter the Stages in the returned iterator.
            - Iteration limit: Each port returns an iteration of nodes. A property on the node called 'iterationLimit' could be used to limit the number of returned nodes during iteration next calls. `∞` (Infinity in javascript) value could be representing an unlimited number of iterations, while a number is used to specify the amount of iterations returning a node before finishing the iterator with marking it as done.
            - Conditional progation / Switch case concept - Allows traversing the grpah selectively, picking the nodes required for the next traversal using conditions or logical decision making algorithms. e.g. Switch Case port where it checks if a condition is met, then picks a single matching node and returns it in the iterator.
    - **Path** - is a chain of edges that specifies a path from & to a pair of nodes. A sequence of edges/connections that connect a sequence of nodes.
    - **Lazy execution during traversal** - on each node reached the traversal could be halted or continued and a processing implementation could be executed before continuing traversing or have a side effect during execution.
    - **Node & edge filter** - some implementations can filter specific nodes through conditions.
    - Node Reference:
        - External reference: holding reference information to a node that exist in another location, when imported to an existing graph database, a connection will be created to the referenced graph.
        - Placement references: a way to insert nodes into a subgraph.
        - Replacement reference: replaces the current position with another node.
    - **node inheritance** _(subnode-supernode / node extension/inheritance)_ - node that extends another node, in a way that any changes of the parent node is retained by the child node. (Newer nore: this seems to be a similar concept to the reroute node `extends` relationship).
    This is a better implementaiton for tree templates (extending an existing node tree without changing it) that used pathPointer or connectionPathSequence to reach the desired position for adding nodes inthe nested subtree/subnodes.
        - override connection - node that extends/inherit from another node and overrides a specific connection of the supernode, if the supernode connectionKey is removed then the overriding connection of the subclass will be ignored.
    - **Reusable Subgraph Template** (will be refered shortly as “subgraph”) – A part of a directed graph with a root node, representing the entrypoint to the subgraph. The subgraph could be referenced by nodes in the graph, and could be extended by other “subgraph templates”. Extending a subgraph allows to insert additional nodes to the subgraph in desired positions or paths (traversal chain or sequence of edges). Much in the sense of externally mapping the same target graph into other different graphs, without changing the original target graph. 
    (a function which takes a graph* (your 'subgraph') *as an input and maps to another graph dependent on that input.)
        - _subgraph template_ node - marks an entrypoint to a graph, and allows for adding external nodes to it. It may also create a new interface to the target graph, where it specifies possible connection positions or ports to map it to the external graph. `extends` - will allow to create instances of another subgraph with different manipulation parameters.
        - **Additional children/edges** conecpt - where a graph can be used (traversed) through a proxy without manipulating it directly. Related to insertion points concept - adding nodes in insertion points in the graph. Each edge has a position/arrangement property that defines the order and a placement (in case it is an additional connection to be traversed). e.g. `pathPointerKey`/`connectionKey` could be an additional conenction that is added to the existing conenctions for traversal purposes.
    - Dynamic traverser configuration - The traverser in each current position can change behavior according to the evaluation of the node. i.e. the traverser may change modes controlled by each stage node. Stage nodes could be also thought as `traverser controller` nodes that give the traverser in the current position, instrcutions to follow and changes it's behavior. 


- **Graph Elements**:
    - **Edge** _(Relationship / Connection)_ - Edges could be directed with 'ingoing'/'outgoing' direction.
        - Source/destination nodes - are nodes that make up the edges of a connection. _Or start/end nodes_
        - connectionKey / pathPointerKey
    - **Node** _(Vertex / ReusableNestedUnit / Unit)_ - e.g. a node references a single data item that should be used or consumed in specific way. Nodes have connections which determine the traversal propagation implementation. I.e. the concept of weighted graph.
        - DataItem/Record - a node as a resource of data to be executed by a processing implementation. e.g. { Type: ‘reference’, importModuleName: ‘’, processNode: ‘’ }
        - Resource: Resource record. The RESOURCE relationship holds the context type `filsystemReference` or `applicationReference`, and the resource node could be of different types following a convention used by the app.
            e.g. A File node that has { type: 'file', path: '' } with a resource relation context of `filesystemContext`, as the File node holds references to a specific path & module in the filesystem context. Other RESOURCE nodes could be references to the variables in the application logic context.
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
- Evaluate position: 
    Decide which node results to include in the results and which to traverse their nested nodes.
    - **Configuration node** - a set of key values that reference implementations and behavior options for the traverser to follow in a current position and possibly nested positions too. Possible options:
        - _propagation:_ 'continue' | 'break' | 'hult' (hult in the sense of stopping the entire traversal from entrypoint node).
        - _aggregation:_ 'process&include' | 'process&exclude' | 'skipProcess' (don't process)
    - **Evaluator node**  - usually checks for a condition and picks a configuration deciding the behavior of the traverser and actions that should be taken in the current position. 
- Start traversal from entrypoint (starting point) node.
    - nodes can change traversal rules to next traversals.
    - nodes (e.g. Stages) can halt traversal or continue (can control traversal propagation).
- Traverser will execute the nodes according to parameters.
- run nesteed stages
- aggregate results of executions.

### API: 
- iterator of node's connections 
- In-memory database: Build a pluggable in memory handling of graph entities. Handling in memory api: 
    - get connections
    - get ports 
    - get connections of a port. 
- 


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

### Some terms that can be used: 
- Fork, Port, Channel

___
[Development TODO list](/documentation/TODO.md)

___

### 🔑 License: [MIT](/.github/LICENSE)
