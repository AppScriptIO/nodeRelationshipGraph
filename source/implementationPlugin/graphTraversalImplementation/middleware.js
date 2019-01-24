/**
 * Creates middleware array from graph
 * The graph traversal @return {Array of Objects} where each object contains instruction settings to be used through an implementing module to add to a chain of middlewares.
 */
export function middleware({thisArg}) { // function wrapper to set thisArg on implementaion object functions.

    let self = {}
    
    Object.keys(self).forEach(function(key) {
        self[key] = self[key].bind(thisArg)
    }, {})
    return self
}