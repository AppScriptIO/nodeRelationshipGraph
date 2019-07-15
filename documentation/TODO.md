### TODO:
- Consider merging Database class & GraphTraversal class into a Plugin class that can distinguish between the plugin groups. Because these classes do that same job and don't currently have unique methods.
- Make nested unit implemenations pluggable. i.e. added as needed to the main nested unit classes. Maybe create a separate module for each implementation.
- Use RedisGraph or Memgraph for in-memory graph database.
- 

Things to consider:
- Should look at integration between nested unit implementations, what to return when they are mixed together, etc.

e.g.
```
    let ShellscriptController = await createStaticInstanceClasses({
        <!-- implementationType: 'Shellscript', --> 
        cacheName: true, 
        rethinkdbConnection: connection
    })
    ShellscriptController.initializeNestedUnit('X') // each unit will call the implementation it needs.
```
___
### TODO:
- Dynamic implementation - add explanation + create a dynamic implementation where each node decides what implementation to use.
 1. create static instance of class with no specific node initialization implemenation (shellscript, template, condition, etc.).
 2. start transversing the node graph. 
 3. During transversing each node will have instructions for the type of implementation to use.
___
###
- Make adapter just like plugin when registered, with support for multiple adapters and choosing a default one to use.
- Add ability to pass previous middleware nested unit option arguments to the next. Not through middleware context, rather using option/setting argument (just like the nested unit properties contain). This allows chaining of middleware. (May require implementing middleware pattern that's executed immediately in the nested unit, rather than composing an array for koa to execute.)
- Change names of nested unit following list in microsoft visio file (scheme where concepts are written). (Relationship graph, unit, resource) with the related new data structure.
- Node relationship graph - add feature to skip current node in case no unit key is specified (will remove the need to create container node using empty unit data) e.g. middleware container uses passthrough middleware.
- Allow changes of node relationship graph to propagate on a running server (without having to restart the server each time to pick up the changes of the database data).
- Rename nested unit "file" into "resource".
- TODO: Generally for nestedUnit parent-child passed arguments - create a context for each instance where values could be stored and used by a child from its parent, rather than saving the arguments to the 'nestedUnitInstance' or sometimes to the 'unit' variable.
- Independent implementation from Rethinkdb database. i.e. allow usage of different databases as pluggable adapter option.
- GPU accelarated node graph propagation. i.e. use GPU to read the node graph in async & sync mode.
- Use gRPC for traversing graphs in a subprocess, this will allow plugin implementations for traversing graphs to be executed in their own process (any error will be neatly handled by the host process).
- Use multiple prototypal inheritance for creation of context for the for each graph instance. 
i.e. 
_Current behavior_
    ```
    let graph = new graph()
    let Controller = graph.createStaticInstanceClasses()
    // `createContext` creates an object that inherites from Controller
    let controller = await Controller.createContext({})
    // `traverseGraph` is non static, so it can be called using using `node` instance objects. 
    await controller.traverseGraph({ nodeKey: 'node-key-1' })
    // The instances created by `traverseGraph` will be cached in the `controller` object. 
    ```
    _Proposed_
    instead of relying on the same controller for inheriting `node` objects, and `controller` context object, use multiple inheritance to group & cache related `node` objects. e.g. use `graph` class as a `controller` object creation that stores cache and common shared values, and that will be inheriting `node` objects together with the `Controller` class (multiple parents).
- Pattern for implementation hooks for functions -  idea for function hooks that can execute implementations. e.g. `iterateConnection` function that has many different implemenations like 'chronological', 'allPromise', 'raceFirstPromise'
```
    @console(function() {
    // [1] define different implemenations of the `iterateConnection` function.
    // [2] add them to the function object together twith helper function to retrieve them and get the matching one using the implementation name/key.
    // [3] when executed an inner hook (inside the `iterateConnection` scope) will invoke the implementation required using added helper function through `arguments.callee` property.
     })
```
- Study Neo4j traversal API in depth 
    - Examples - https://github.com/neo4j/neo4j-documentation/blob/3.5/embedded-examples/src/main/java/org/neo4j/examples/TraversalExample.java 
    - code - https://github.com/neo4j/neo4j/tree/ba4e188d51e027a7e7870d511044ea940cf0455e/community/graphdb-api/src/main/java/org/neo4j/graphdb/traversal