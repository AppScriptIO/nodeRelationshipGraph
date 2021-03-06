### TODO:
- Document how to use multiple conditions in a single switch case node. i.e. condition & condition2 || condition3 => case true ... case false.
- Add option in next function of traversal implmentation: `await next({ skipNested: true })` in which nested nodes will be skipped, but any other sibling next nodes will be executed and upstream can continue to function.
- Use Traverser sequence "iteratorObjectList" in all interception implementation, tracking the iterators during traversal. & integrate the downstream&upstream implementation "handleMiddlewareNextCall_branchedGraph" into the other implementations traversal logic.
- Traverse edge for instructing the traverser to initiate a new traversion, instead of hard coding and creating a specific node scheme where a new traversal is needed (e.g. VALUE edge resolution with conditionGraph implementation).
- Consider renaming module to "immediatelyExecutedGraph" & "immediatelyExecutedGraph-implementation"
- Support `if..else..` reroute (reference connection) algorithm, similar to `switch case` reroute. The difference is that if else can execute a condition graph unrelated to the other if statements, and defaults to `else` connection.
- Support traversal of multiple node types like - same node of type Reroute, Stage, Process, Function. Which has self connections of REFERENCE, VALUE, EXECUTE, RESOURCE.
- Use node types as only an abstraction over the actual node implementations, in which this abstraction provides easy userinterface for the client to conceptualize with. All implementations are `node implementation`, any node type in the graph is a specific abstraction over the an implementation or a group of implementations.
    Or combine multiple concepts in the user interface visually (UI), while still using the desperse integrated implementations underneath in the core code. i.e. the UI will provide an abstraction layer to the actual way of storing the concepts in the graph. Where concepts like switch shouldn't be explicitely shown in detail in the visual ui.
Kind of making all nodes implementations separate from the node types, then relating them to the specific types - combining & mixing implementations in a node type.
- Define the expected output of each node/edge implementation functions and of the core/integration methods. Which will allow better design & refactoring of the code.
- Relay / Reroute nodes (_A conecpt that could be implemeneted_) - in most graph databases the concept of creating a relationships to other relationships doesn't exist. A Relay node type could be used to be able to reference a connection. A node is created with a relationship outgoing from it, and incoming relationships are used to reference that connection. In the application level the connections are treated as connections of another target node (relaying them to another node).
- Plugins registration must be done through passing a object of arrays - where the object keys are the nodes types and implementations array are the value.
- Concept of a specific context for each processNode implemeantation or other implemenations, in addition to a general graph wide context. This will allow implementations to use an area of the context in large graphs, which makes them more organized and isolated.
- Makr tests more concrete: testing specific concepts in depth and separately.
- Change node name `File` and resource type context.
- Consider merging Database class & Traversal class into a Plugin class that can distinguish between the plugin groups. Because these classes do that same job and don't currently have unique methods.
- Make nested unit implemenations pluggable. i.e. added as needed to the main nested unit classes. Maybe create a separate module for each implementation.
- Use RedisGraph or Memgraph for in-memory graph database.
- Things to consider: Should look at integration between nested unit implementations, what to return when they are mixed together, etc.
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
