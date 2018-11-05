
export function logNode({thisArg}) { // function wrapper to set thisArg on implementaion object functions.

    let self = {
        traverseGraph: async function({ nodeInstance }) {
            // [2] Load data - should be pluggable and able to load referenced data i.e. 'data item'
            // TODO: specific to node type should load the data as reference or the data as property on node object.
            // let { unitKey: unitKey } = nodeInstance
            // let unitInstance = await this.getDataItem({ unitKey })
            // await unitInstance.pupolateUnitWithFile() // TODO: move specific data item processing inside data item itself. i.e. load 'resource file' in 'getDataItem' function.
            // do something
            console.log(nodeInstance.dataItemKey)
            
            // [3] loop children
            // [4] process returned result - should be pluggable option
            // loop through insetionPoint
            // [3] Iterate over insertion points
            // await nodeInstance.loopInsertionPoint({ type: 'aggregateIntoArray' })
            await self.iterateConnection({ nodeConnectionArray: nodeInstance.connection })
        },
        iterateConnection: async function ({
            nodeConnectionArray = [], 
            executeConnection = this.executeConnection,
            implementationType
        } = {}) {
            // iteration implementation
            for (let nodeConnection of nodeConnectionArray) {
                return await executeConnection.apply(this, [{ nodeConnection }])
            }
        },
        traversePort: async function() {

        }
    
    }
    
    Object.keys(self).forEach(function(key) {
        self[key] = self[key].bind(thisArg)
    }, {})
    return self
}
