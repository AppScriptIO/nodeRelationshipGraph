# Graph Elements
- **Edge** _(Relationship / Connection)_ - Edges could be directed with 'ingoing'/'outgoing' direction.
    - Source/destination nodes - are nodes that make up the edges of a connection. _Or start/end nodes_
    - connectionKey / pathPointerKey
- **Node** _(Vertex / ReusableNestedUnit / Unit)_ - e.g. a node references a single data item that should be used or consumed in specific way. Nodes have connections which determine the traversal propagation implementation. I.e. the concept of weighted graph.
    - DataItem/Record - a node as a resource of data to be executed by a processing implementation. e.g. { Type: ‘reference’, importModuleName: ‘’, processNode: ‘’ }
    - Resource: Resource record. The RESOURCE relationship holds the context type `filsystemReference` or `applicationReference`, and the resource node could be of different types following a convention used by the app.
        e.g. A File node that has { type: 'file', path: '' } with a resource relation context of `filesystemContext`, as the File node holds references to a specific path & module in the filesystem context. Other RESOURCE nodes could be references to the variables in the application logic context.
- **Port** _(insetionPoint)_ (_related terminology = junction, synapse, group, inlet/outlet, channel, junctionPoint, portal, relationship, relation_).

