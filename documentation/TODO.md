### TODO:
Make nested unit implemenations pluggable. i.e. added as needed to the main nested unit classes. Maybe create a separate module for each implementation.

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
 1. create static instance of class with no specific node initialization implemenation (shellscript, template, condition, etc.).
 2. start transversing the node graph. 
 3. During transversing each node will have instructions for the type of implementation to use.
___
###
- Add ability to pass previous middleware nested unit option arguments to the next. Not through middleware context, rather using option/setting argument (just like the nested unit properties contain). This allows chaining of middleware. (May require implementing middleware pattern that's executed immediately in the nested unit, rather than composing an array for koa to execute.)
- Change names of nested unit following list in microsoft visio file (scheme where concepts are written). (Relationship graph, unit, resource) with the related new data structure.
- Node relationship graph - add feature to skip current node in case no unit key is specified (will remove the need to create container node using empty unit data) e.g. middleware container uses passthrough middleware.
- Allow changes of node relationship graph to propagate on a running server (without having to restart the server each time to pick up the changes of the database data).
- Rename nested unit "file" into "resource".
- TODO: Generally for nestedUnit parent-child passed arguments - create a context for each instance where values could be stored and used by a child from its parent, rather than saving the arguments to the 'nestedUnitInstance' or sometimes to the 'unit' variable.
- Independent implementation from Rethinkdb database. i.e. allow usage of different databases as pluggable adapter option.
- GPU accelarated node graph propagation. i.e. use GPU to read the node graph in async & sync mode.
