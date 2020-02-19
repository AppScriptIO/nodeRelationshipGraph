# Abstract Program representation in graphs
An abstract program (or control graph or flowchart schema) depicts the control structure of the program, leaving much of the detail to be specified in an interpretation. To put it differently, it helps to distinguish between the sequence of processing steps and the algorithms applied at each step. This allows one to change the control module, for instance by reprogramming it or by treating the abstract program as the input of a supervisor program which does not change. The supervisor executes processing steps in the sequence  specified by the abstract program whose statements are read in as the data of the supervisor.

# Graph Concepts: 
- Graph representation of the program's control flow, as instructions directed to the traverser.

- - Generally speaking, there isn't really a concept of mutable state in abstract algebra (of which Graph Theory is a part). Only existence/non-existence. Graphs have a static state, and cannot be mutable in common Graph Theory concepts. Any 'change' indicated would be another distinct graph.
- **Graph** _(Node Relationship Graph / Nested Unit Tree)_ - can represent any collection of objects having some kind of pairwise relationship (conveying of relational information). Many realworld systems and problems can be modeled using a graph.
- Programming concepts implemented in the graph: 
    The graph traversal chain (a single recursive traversal call) could traverse nodes in an independent way, where each node traversal awaits only it's own nested and siblings traversals, or it could be executed in a manner where each node can control the entire chain iterator and await any other node, even if it is not nested or part of the same port group of nodes.
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
    - Reference/Reroute nodes: Nodes that are treated as a placement for other nodes (referencing other nodes). Reroute node also allows to divide a graph into subgraphs by pointing to a root node  and storing information about the subgraph.
        Reference nodes could be used as: (Maybe check https://www.worldscientific.com/doi/abs/10.1142/9789812384720_0001)
            - Node replacement positions: Where the position node is ment to be replaced with the target node (referenced node).
            - Node placement in subgraph: Where the reference nodes are ment to be placed into a target subgraph (e.g. added into the next relatioship of a stage).
        - e.g. Reroute, Switch nodes, and maybe Reroute/SubgraphTemplate could be considered a reference node.

- **Graph type & features** - Usually the Graph that is used is Directed, Acyclic or cyclic, Weighed, Sparsed _(few edges in comparison to complexity analysis)_, & immediately-processed graph (created to be processed during traversal).  e.g. Trees/Herarchies/Nested Treemaps.
    - **Stage nodes**: are node traverser positions that guide the traverser to perform actions involding adverse effects or returning results.
    - **Procss nodes**: are responsible for data process, performing actions and optionally returning a result. Each Process node uses it's own properties and traversal information to result in an action/effect, depending on the implementation being used.
    Execute will process the node taking into consideration graph data and parameters, and Pipe will allow for further processing of the result of the main process.
    - **Multiedge/Parallel edges** - Multiple connections between 2 verticies/nodes.
    - **Self edges** - Loop allowed graph.
    - **ports**: group of connections that relate to each other or have specific configuration. (Related resources - [Stackoverflow - Terminology for a graph with ports on its nodes](https://cs.stackexchange.com/questions/41320/terminology-for-a-graph-with-ports-on-its-nodes?newreg=33ff713616b04cdcbdd3df94b1ed841c), [Multigraphs with Ports publication 1](https://hal.inria.fr/inria-00139363/en/), [Multigraphs with Ports publication 1](https://www.sciencedirect.com/science/article/pii/S1571066108004295).
    Ports control the traverser propagation order to the next Stage nodes (propagation control), in addition to grouping the Stages into meaningful groups that could be used in the aggregator implementations.
        - Selective/restricted port/Channel concepts: a port/Channel that propages according to a set of rules or conditions. Ports can be chained to further filter the Stages in the returned iterator.
            - Iteration limit: Each port/Channel returns an iteration of nodes. A property on the node called 'iterationLimit' could be used to limit the number of returned nodes during iteration next calls. `∞` (Infinity in javascript) value could be representing an unlimited number of iterations, while a number is used to specify the amount of iterations returning a node before finishing the iterator with marking it as done.
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


