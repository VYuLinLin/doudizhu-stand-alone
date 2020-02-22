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

  obj.on = function (type, callback, target) {
    var listener = {
      callback: callback,
      target: target
    };

    if (register.hasOwnProperty(type)) {
      cc.assert(callback);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = register[type][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _listener = _step.value;

          if (target === _listener.target) {
            return;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      register[type].push(listener);
    } else {
      register[type] = [listener];
    }
  };

  obj.emit = function (type) {
    if (register.hasOwnProperty(type)) {
      var methodList = register[type];

      for (var i = 0; i < methodList.length; ++i) {
        var _methodList$i = methodList[i],
            callback = _methodList$i.callback,
            target = _methodList$i.target;
        var args = [];

        for (var _i = 1; _i < arguments.length; ++_i) {
          args.push(arguments[_i]);
        }

        callback.apply(target, args);
      }
    }
  };

  obj.remove = function (type, target) {
    register[type] = register[type].filter(function (e) {
      return e.target !== target;
    });
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