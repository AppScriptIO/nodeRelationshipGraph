# Contents: 
- [Graph concepts](/documentation/graphConcept/concept.md)

# Graph Traversal مُـخَطَط
- similar concept to abstract semantic graph only intended for execution.
- Abstract Program Graph: The program is "abstract" in the sense that it deals with abstractions of a lower level program.
- Executable Graph
An immediately executed graph traversal, where nodes instruct on performing actions in customizable implementations. It hands back control to the client allowing to manipulate the traversal propagation and node data processing logic.
- Eagerly executed, promise and iterators based.
- On each traversal a node data can be processed/executed, taking into account precedence constraints.
- The graph traversal module is callback & Proxy based, which hands overcontrol to concrete functions and returns an iterator of results that the proxy implementation can decide what to do with. Permitting highly configurable traversal behavior.
- Created for graph where the node's data is the main subject, & traversal rules/configs of a relational graph, are used to decide on the way to deal with multiple processings of the nodes's data - i.e. processing logic & combination of results.
- The core code of the module is separate from the plugin implementations and largely involved in the integration between the plugin implementations.
- Immediately Graph Traversal: allows to move the control flow logic of the program to an in-memory graph. In addition to defining the flow of program, it controls the integration logic/algorithm between the procedure/actions of the program - which could be used for different use cases. Describing the algorithm used to handle processes/steps/procedures of the program.
- Graphs allow to create a visual layer for the program control flow, and allow realtime changes to a running program, in which different presentation elements could be defined to display the program in a sumerized compact manner. The visual representation doesn't necessarily represent the exact graph database structure, rather it adds a level of abstraction.
- There is one node for each abstract procedure in the program. 
- highly abstract software language

# execution model: 
Specifies the behavior of processing steps in the graph.

# The role of Immediately Executed Graphs in program design:
Separates the program units or logic or functions from the control flow of program execution. Allowing to focus on developing needed functionality in separate modules, and then placing them in a graph to architect the interactions between them. Immediately Executed Graphs are like an integration layer and control flow for applications, where the program functions are considered abstract units that are referenced in the graph. Therefore it could be called Abstact Visual Programming, because it allows for coding the program with all language features, and integrating it in a visual manner.
A program requires 2 structures: (https://www.youtube.com/watch?v=yC9SQJnTvo4 https://www.kullabs.com/classes/subjects/units/lessons/notes/note-detail/4207 https://teachcomputerscience.com/selection/ https://cis.temple.edu/~pwang/1057-PC/Lecture/Ch04.htm)
    - Actions/procedures - performing calculations, etc.
    - Sequence - combines the actions to be executed on runtime. These are control structures, this is what the graph is intended to take the role of - sequences the actions of the program.
        subdevided into the following fundumental control structures: 
            - compound/sequence & parallelism: executed unconditionally. (a body of a function is considered a compound structure)
            - conditional/selection: if condition, if else, if else if, nested if else, switch case (multi-way selection).
            - loop/iteration: while, do while, for loop.
_The loop and conditional structures could be represented in the graph, and the statements/steps/actions are represented in modules/functions/procedures/subroutine (https://en.wikipedia.org/wiki/Subroutine)._

# Alternative name for Immediately executed graph: 
    - Control Flow Graph - A graph representing the control flow of the program. (term in use https://en.wikipedia.org/wiki/Control-flow_graph https://www.geeksforgeeks.org/software-engineering-control-flow-graph-cfg/)
    - Graph-assisted program.
    - Call Graph.
# points: 
    - this is different to "a system could be modeled visually, the program code would be generated from the models, and any changes to the code could be pushed back to the model."

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

### Multiple initiated traversals in connected graphs: 
The same graph could be composed of multiple traversals. Where each traversal sequence/set uses a set of configs and aggregates separately.
Initiating the traversal set/sequence could be from the core code of graph traversal module (e.g. VALUE edge), or externally in referenced code (e.g. in middleware functions). 
Options to support a common way to initiate a traversal sequence and represent it in the graph.
    - Initiate graph sequence using a relationship (e.g. "initiate"). How to deal with the relational value. 
        VALUE {type: edge:traverse} -> Stage <-- TRAVERSE {traversalConfig: Condition}

Some Types of traversal configs: Condition, Middleware, Template. Which mark the different implemenetaion sets used for graph initiated traversal.

### Applications: 
Different applications may use this module:
- Build systems with package dependencies - make a topological sort to know which library should be built first.
- Creating pipelines to manipulate data. e.g.  [CI/CD pipelines](https://docs.gitlab.com/ee/ci/pipelines.html). 
    - Execution pipelines for code building.
    - Task/command runner with ability for synchronous or async execution.
- Task schedualing - which task should procede which one. 
- AST representation in NoSQL database.
- Template system for creating complex templates:
    _A better terminology whould be "document", as it may represent a collection of template & configs/parameters._
    Web documents (or documents) are composed of templates, represented as graphs. 
    Templates require a rendering algorithm/engine to deal with marked points in them, and produce rendered content. Templates can be nested and each nested template should be redered as well.
    Redering algorithm could involve:
        - Only replacement of marked points in the template.
        - Executionng of code logic and replacement of points with content produced by that code.
- Server request handling with on the fly middleware chain compisition.
- etc.

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


# Modules that depend on the graphTraversal module: 
- buildTool
- deploymentScript (graph data loading)
- services repositories.

___
[Development TODO list](/documentation/TODO.md)

___

### 🔑 License: [MIT](/.github/LICENSE)
