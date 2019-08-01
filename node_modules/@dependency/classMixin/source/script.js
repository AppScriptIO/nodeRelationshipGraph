"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  decorator: true
};
exports.decorator = decorator;

var _mixwith = require("mixwith");

Object.keys(_mixwith).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _mixwith[key];
    }
  });
});

function decorator({
  /** mixin complies with `Mixin` function of the 'mixwith' module.
   * e.g. Mixin({ Superclass: class{} } => class Y extends Superclass {})
   */
  mixin = null
}) {
  return Class => {
    // add controller methods for the specific module that uses them.
    if (mixin) {
      Class = mixin({
        Superclass: Class
      });
      /* return Specific implementation Controller */
    } // else return Reusable nested unit


    return Class;
  };
}