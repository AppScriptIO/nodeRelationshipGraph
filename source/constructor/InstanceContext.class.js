import assert from 'assert'

/**
 * 
*/
const self = class InstanceContext {

    // instance properties
    sharedContext = {}

    constructor(object) { 
        this.sharedContext = Object.assign(this.sharedContext, object)
    }
    
}

export { self as InstanceContext }
