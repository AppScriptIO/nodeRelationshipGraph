*Executable implementation of the [Abstract Program Graph specification](https://github.com/AbstractProgram/programGraphSpecification)*

# Execution model: 
Specifies the behavior of processing steps in abstract program graphs.

## Configerability of traverser:
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

## Multiple initiated traversals in connected graphs: 
The same graph could be composed of multiple traversals. Where each traversal sequence/set uses a set of configs and aggregates separately.
Initiating the traversal set/sequence could be from the core code of graph traversal module (e.g. VALUE edge), or externally in referenced code (e.g. in middleware functions). 
Some Types of traversal configs: Condition, Middleware, Template. Which mark the different implemenetaion sets used for graph initiated traversal.
Options to support a common way to initiate a traversal sequence and represent it in the graph.
    - Initiate graph sequence using a relationship (e.g. "initiate"). How to deal with the relational value. 
        VALUE {type: edge:traverse} -> Stage <-- TRAVERSE {traversalConfig: Condition}

## Integration between different node types in mixed or separate subgraphs, according to the nodes' intended usage.
- Middleware: execution of middleware with upstream and downstream support.
- Condition: evaluate and control propagation. Conditionally skip the task execution
    a graph that checks conditions while traversing and returns an answer to complex conditional relations with prerequisite conditions. 
    - Routing: could be used for routing to a desired value/callback/action.
- Template: aggregation
- Data query schema: verification of data schema.

## General algorithm steps:
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

___

[Development TODO list](/documentation/TODO.md)

#### Modules/Packages that depend on the graphTraversal module: 
- buildTool
- deploymentScript (graph data loading)
- services repositories.
___

### 🔑 License: [MIT](/.github/LICENSE)
