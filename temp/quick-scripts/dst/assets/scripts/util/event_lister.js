
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/util/event_lister.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFx1dGlsLy4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFx1dGlsL2Fzc2V0c1xcc2NyaXB0c1xcdXRpbFxcZXZlbnRfbGlzdGVyLmpzIl0sIm5hbWVzIjpbImV2ZW50TGlzdGVyIiwib2JqIiwicmVnaXN0ZXIiLCJvbiIsInR5cGUiLCJjYWxsYmFjayIsInRhcmdldCIsImxpc3RlbmVyIiwiaGFzT3duUHJvcGVydHkiLCJjYyIsImFzc2VydCIsInB1c2giLCJlbWl0IiwibWV0aG9kTGlzdCIsImkiLCJsZW5ndGgiLCJhcmdzIiwiYXJndW1lbnRzIiwiYXBwbHkiLCJyZW1vdmUiLCJmaWx0ZXIiLCJlIiwicmVtb3ZlTGlzdGVyIiwicmVtb3ZlQWxsTGlzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBTUEsV0FBVyxHQUFHLFNBQWRBLFdBQWMsQ0FBVUMsR0FBVixFQUFlO0FBQ2pDLE1BQUlDLFFBQVEsR0FBRyxFQUFmOztBQUVBRCxFQUFBQSxHQUFHLENBQUNFLEVBQUosR0FBUyxVQUFVQyxJQUFWLEVBQWdCQyxRQUFoQixFQUEwQkMsTUFBMUIsRUFBa0M7QUFDekMsUUFBTUMsUUFBUSxHQUFHO0FBQ2ZGLE1BQUFBLFFBQVEsRUFBUkEsUUFEZTtBQUVmQyxNQUFBQSxNQUFNLEVBQU5BO0FBRmUsS0FBakI7O0FBSUEsUUFBSUosUUFBUSxDQUFDTSxjQUFULENBQXdCSixJQUF4QixDQUFKLEVBQW1DO0FBQ2pDSyxNQUFBQSxFQUFFLENBQUNDLE1BQUgsQ0FBVUwsUUFBVjtBQURpQztBQUFBO0FBQUE7O0FBQUE7QUFFakMsNkJBQXVCSCxRQUFRLENBQUNFLElBQUQsQ0FBL0IsOEhBQXVDO0FBQUEsY0FBNUJHLFNBQTRCOztBQUNyQyxjQUFJRCxNQUFNLEtBQUtDLFNBQVEsQ0FBQ0QsTUFBeEIsRUFBZ0M7QUFDOUI7QUFDRDtBQUNGO0FBTmdDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBT2pDSixNQUFBQSxRQUFRLENBQUNFLElBQUQsQ0FBUixDQUFlTyxJQUFmLENBQW9CSixRQUFwQjtBQUNELEtBUkQsTUFRTztBQUNMTCxNQUFBQSxRQUFRLENBQUNFLElBQUQsQ0FBUixHQUFpQixDQUFDRyxRQUFELENBQWpCO0FBQ0Q7QUFDRixHQWhCRDs7QUFpQkFOLEVBQUFBLEdBQUcsQ0FBQ1csSUFBSixHQUFXLFVBQVNSLElBQVQsRUFBZTtBQUN4QixRQUFJRixRQUFRLENBQUNNLGNBQVQsQ0FBd0JKLElBQXhCLENBQUosRUFBbUM7QUFDakMsVUFBTVMsVUFBVSxHQUFHWCxRQUFRLENBQUNFLElBQUQsQ0FBM0I7O0FBQ0EsV0FBSyxJQUFJVSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRCxVQUFVLENBQUNFLE1BQS9CLEVBQXVDLEVBQUVELENBQXpDLEVBQTRDO0FBQUEsNEJBQ2ZELFVBQVUsQ0FBQ0MsQ0FBRCxDQURLO0FBQUEsWUFDbkNULFFBRG1DLGlCQUNuQ0EsUUFEbUM7QUFBQSxZQUN6QkMsTUFEeUIsaUJBQ3pCQSxNQUR5QjtBQUUxQyxZQUFNVSxJQUFJLEdBQUcsRUFBYjs7QUFDQSxhQUFLLElBQUlGLEVBQUMsR0FBRyxDQUFiLEVBQWdCQSxFQUFDLEdBQUdHLFNBQVMsQ0FBQ0YsTUFBOUIsRUFBc0MsRUFBRUQsRUFBeEMsRUFBMkM7QUFDekNFLFVBQUFBLElBQUksQ0FBQ0wsSUFBTCxDQUFVTSxTQUFTLENBQUNILEVBQUQsQ0FBbkI7QUFDRDs7QUFDRFQsUUFBQUEsUUFBUSxDQUFDYSxLQUFULENBQWVaLE1BQWYsRUFBdUJVLElBQXZCO0FBQ0Q7QUFDRjtBQUVGLEdBYkQ7O0FBY0FmLEVBQUFBLEdBQUcsQ0FBQ2tCLE1BQUosR0FBYSxVQUFVZixJQUFWLEVBQWdCRSxNQUFoQixFQUF3QjtBQUNuQ0osSUFBQUEsUUFBUSxDQUFDRSxJQUFELENBQVIsR0FBaUJGLFFBQVEsQ0FBQ0UsSUFBRCxDQUFSLENBQWVnQixNQUFmLENBQXNCLFVBQUFDLENBQUM7QUFBQSxhQUFJQSxDQUFDLENBQUNmLE1BQUYsS0FBYUEsTUFBakI7QUFBQSxLQUF2QixDQUFqQjtBQUNELEdBRkQ7O0FBR0FMLEVBQUFBLEdBQUcsQ0FBQ3FCLFlBQUosR0FBbUIsVUFBVWxCLElBQVYsRUFBZ0I7QUFDakNGLElBQUFBLFFBQVEsQ0FBQ0UsSUFBRCxDQUFSLEdBQWlCLEVBQWpCO0FBQ0QsR0FGRDs7QUFJQUgsRUFBQUEsR0FBRyxDQUFDc0IsZUFBSixHQUFzQixZQUFZO0FBQ2hDckIsSUFBQUEsUUFBUSxHQUFHLEVBQVg7QUFDRCxHQUZEOztBQUlBLFNBQU9ELEdBQVA7QUFDRCxDQTlDRDs7ZUFnRGVEIiwic291cmNlUm9vdCI6Ii4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFx1dGlsIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZXZlbnRMaXN0ZXIgPSBmdW5jdGlvbiAob2JqKSB7XHJcbiAgdmFyIHJlZ2lzdGVyID0ge31cclxuXHJcbiAgb2JqLm9uID0gZnVuY3Rpb24gKHR5cGUsIGNhbGxiYWNrLCB0YXJnZXQpIHtcclxuICAgIGNvbnN0IGxpc3RlbmVyID0ge1xyXG4gICAgICBjYWxsYmFjayxcclxuICAgICAgdGFyZ2V0XHJcbiAgICB9XHJcbiAgICBpZiAocmVnaXN0ZXIuaGFzT3duUHJvcGVydHkodHlwZSkpIHtcclxuICAgICAgY2MuYXNzZXJ0KGNhbGxiYWNrKVxyXG4gICAgICBmb3IgKGNvbnN0IGxpc3RlbmVyIG9mIHJlZ2lzdGVyW3R5cGVdKSB7XHJcbiAgICAgICAgaWYgKHRhcmdldCA9PT0gbGlzdGVuZXIudGFyZ2V0KSB7XHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmVnaXN0ZXJbdHlwZV0ucHVzaChsaXN0ZW5lcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZWdpc3Rlclt0eXBlXSA9IFtsaXN0ZW5lcl1cclxuICAgIH1cclxuICB9XHJcbiAgb2JqLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XHJcbiAgICBpZiAocmVnaXN0ZXIuaGFzT3duUHJvcGVydHkodHlwZSkpIHtcclxuICAgICAgY29uc3QgbWV0aG9kTGlzdCA9IHJlZ2lzdGVyW3R5cGVdXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWV0aG9kTGlzdC5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgIGNvbnN0IHtjYWxsYmFjaywgdGFyZ2V0fSA9IG1ldGhvZExpc3RbaV1cclxuICAgICAgICBjb25zdCBhcmdzID0gW11cclxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSlcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FsbGJhY2suYXBwbHkodGFyZ2V0LCBhcmdzKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICB9XHJcbiAgb2JqLnJlbW92ZSA9IGZ1bmN0aW9uICh0eXBlLCB0YXJnZXQpIHtcclxuICAgIHJlZ2lzdGVyW3R5cGVdID0gcmVnaXN0ZXJbdHlwZV0uZmlsdGVyKGUgPT4gZS50YXJnZXQgIT09IHRhcmdldClcclxuICB9XHJcbiAgb2JqLnJlbW92ZUxpc3RlciA9IGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICByZWdpc3Rlclt0eXBlXSA9IFtdXHJcbiAgfVxyXG5cclxuICBvYmoucmVtb3ZlQWxsTGlzdGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmVnaXN0ZXIgPSB7fVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG9ialxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBldmVudExpc3RlciJdfQ==