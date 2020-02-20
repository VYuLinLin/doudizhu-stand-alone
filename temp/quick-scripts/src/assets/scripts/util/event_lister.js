"use strict";
cc._RF.push(module, 'd485eyCsiBLBqweDM7SjVQh', 'event_lister');
// scripts/util/event_lister.js

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var eventLister = function eventLister(obj) {
  var register = {};

  obj.on = function (type, method) {
    if (register.hasOwnProperty(type)) {
      register[type].push(method);
    } else {
      register[type] = [method];
    }
  };

  obj.fire = function (type) {
    if (register.hasOwnProperty(type)) {
      var methodList = register[type];

      for (var i = 0; i < methodList.length; ++i) {
        var handle = methodList[i];
        var args = [];

        for (var i = 1; i < arguments.length; ++i) {
          args.push(arguments[i]);
        } //handle.call(this,args)


        console.log("handle.call(this,args) type:" + type);
        handle.apply(this, args);
      }
    }
  };

  obj.removeLister = function (type) {
    register[type] = [];
  };

  obj.removeAllLister = function () {
    register = {};
  };

  return obj;
};

var _default = eventLister;
exports["default"] = _default;
module.exports = exports["default"];

cc._RF.pop();