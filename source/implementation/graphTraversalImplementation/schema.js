export function schema({thisArg}) { // function wrapper to set thisArg on implementaion object functions.

    let self = {
        
        traversePort: async function aggregateIntoContentArray() {
            let array = []
            if(this.insertionPoint) {
                for (let insertionPoint of this.insertionPoint) {
                    let children = await this.filterAndOrderChildren({ insertionPointKey: insertionPoint.key })                                        
                    let subsequentArray = await this.initializeInsertionPoint({ insertionPoint, children, argument })
                    await Array.prototype.push.apply(array, subsequentArray)
                }
            }
            return array;                                
        }
    
    }
    
    Object.keys(self).forEach(function(key) {
        self[key] = self[key].bind(thisArg)
    }, {})
    return self
}