"use strict";

r.db("webapp").table("setting").get("unitKey").update({
  unitKey: r.row('unitKey').map(function (condition) {
    return r.branch(condition('expectedReturn').eq('true'), condition.merge({
      this: true
    }), condition);
  })
});