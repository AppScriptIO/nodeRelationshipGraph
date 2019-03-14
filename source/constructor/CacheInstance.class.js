import assert from 'assert'

/**
 * 
*/
const self = class CacheInstance {

}

export { self as CacheInstance }


class Cache {
    get(key, defaultValue) {
      const value = this._doGet(key);
      if (value === undefined || value === null) {
        return defaultValue;
      }
  
      return value;
    }
  
    set(key, value) {
      if (key === undefined || key === null) {
        throw new Error('Invalid argument');
      }
  
      this._doSet(key, value);
    }
  
    // Must be overridden
    // _doGet()
    // _doSet()
  }