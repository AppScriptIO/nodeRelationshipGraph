• TODO:
Make nested unit implemenations pluggable. i.e. added as needed to the main nested unit classes. Maybe create a separate module for each implementation.
Things to consider:
    - Should look at integration between nested unit implementations, what to return when they are mixed together, etc.

e.g.
    let ShellscriptController = await createStaticInstanceClasses({
        <!-- implementationType: 'Shellscript', --> 
        cacheName: true, 
        rethinkdbConnection: connection
    })
    ShellscriptController.initializeNestedUnit('X') // each unit will call the implementation it needs.


• TODO:
 1. create static instance of class with no specific node initialization implemenation (shellscript, template, condition, etc.).
 2. start transversing the node graph. 
 3. During transversing each node will have instructions for the type of implementation to use.



