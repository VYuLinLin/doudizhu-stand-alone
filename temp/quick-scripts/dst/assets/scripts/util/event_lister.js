
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFx1dGlsLy4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFx1dGlsL2Fzc2V0c1xcc2NyaXB0c1xcdXRpbFxcZXZlbnRfbGlzdGVyLmpzIl0sIm5hbWVzIjpbImV2ZW50TGlzdGVyIiwib2JqIiwicmVnaXN0ZXIiLCJvbiIsInR5cGUiLCJtZXRob2QiLCJoYXNPd25Qcm9wZXJ0eSIsInB1c2giLCJmaXJlIiwibWV0aG9kTGlzdCIsImkiLCJsZW5ndGgiLCJoYW5kbGUiLCJhcmdzIiwiYXJndW1lbnRzIiwiY29uc29sZSIsImxvZyIsImFwcGx5IiwicmVtb3ZlTGlzdGVyIiwicmVtb3ZlQWxsTGlzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBTUEsV0FBVyxHQUFHLFNBQWRBLFdBQWMsQ0FBU0MsR0FBVCxFQUFhO0FBQzdCLE1BQUlDLFFBQVEsR0FBRyxFQUFmOztBQUVBRCxFQUFBQSxHQUFHLENBQUNFLEVBQUosR0FBUyxVQUFTQyxJQUFULEVBQWNDLE1BQWQsRUFBcUI7QUFDMUIsUUFBR0gsUUFBUSxDQUFDSSxjQUFULENBQXdCRixJQUF4QixDQUFILEVBQWlDO0FBQzdCRixNQUFBQSxRQUFRLENBQUNFLElBQUQsQ0FBUixDQUFlRyxJQUFmLENBQW9CRixNQUFwQjtBQUNILEtBRkQsTUFFSztBQUNESCxNQUFBQSxRQUFRLENBQUNFLElBQUQsQ0FBUixHQUFpQixDQUFDQyxNQUFELENBQWpCO0FBQ0g7QUFDSixHQU5EOztBQVFBSixFQUFBQSxHQUFHLENBQUNPLElBQUosR0FBVyxVQUFTSixJQUFULEVBQWM7QUFDckIsUUFBR0YsUUFBUSxDQUFDSSxjQUFULENBQXdCRixJQUF4QixDQUFILEVBQWtDO0FBQzlCLFVBQUlLLFVBQVUsR0FBR1AsUUFBUSxDQUFDRSxJQUFELENBQXpCOztBQUNBLFdBQUksSUFBSU0sQ0FBQyxHQUFDLENBQVYsRUFBWUEsQ0FBQyxHQUFDRCxVQUFVLENBQUNFLE1BQXpCLEVBQWdDLEVBQUVELENBQWxDLEVBQW9DO0FBQ2hDLFlBQUlFLE1BQU0sR0FBR0gsVUFBVSxDQUFDQyxDQUFELENBQXZCO0FBQ0EsWUFBSUcsSUFBSSxHQUFHLEVBQVg7O0FBQ0EsYUFBSSxJQUFJSCxDQUFDLEdBQUcsQ0FBWixFQUFjQSxDQUFDLEdBQUNJLFNBQVMsQ0FBQ0gsTUFBMUIsRUFBaUMsRUFBRUQsQ0FBbkMsRUFBcUM7QUFDakNHLFVBQUFBLElBQUksQ0FBQ04sSUFBTCxDQUFVTyxTQUFTLENBQUNKLENBQUQsQ0FBbkI7QUFDSCxTQUwrQixDQU9oQzs7O0FBQ0FLLFFBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGlDQUErQlosSUFBM0M7QUFDQVEsUUFBQUEsTUFBTSxDQUFDSyxLQUFQLENBQWEsSUFBYixFQUFrQkosSUFBbEI7QUFDSDtBQUNKO0FBQ0osR0FmRDs7QUFpQkFaLEVBQUFBLEdBQUcsQ0FBQ2lCLFlBQUosR0FBbUIsVUFBU2QsSUFBVCxFQUFjO0FBQzdCRixJQUFBQSxRQUFRLENBQUNFLElBQUQsQ0FBUixHQUFpQixFQUFqQjtBQUNILEdBRkQ7O0FBSUFILEVBQUFBLEdBQUcsQ0FBQ2tCLGVBQUosR0FBc0IsWUFBVTtBQUM1QmpCLElBQUFBLFFBQVEsR0FBRyxFQUFYO0FBQ0gsR0FGRDs7QUFJQSxTQUFPRCxHQUFQO0FBQ0gsQ0FyQ0Q7O2VBdUNlRCIsInNvdXJjZVJvb3QiOiIuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc2NyaXB0c1xcdXRpbCIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGV2ZW50TGlzdGVyID0gZnVuY3Rpb24ob2JqKXtcclxuICAgIHZhciByZWdpc3RlciA9IHt9XHJcblxyXG4gICAgb2JqLm9uID0gZnVuY3Rpb24odHlwZSxtZXRob2Qpe1xyXG4gICAgICAgIGlmKHJlZ2lzdGVyLmhhc093blByb3BlcnR5KHR5cGUpKXtcclxuICAgICAgICAgICAgcmVnaXN0ZXJbdHlwZV0ucHVzaChtZXRob2QpXHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHJlZ2lzdGVyW3R5cGVdID0gW21ldGhvZF1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb2JqLmZpcmUgPSBmdW5jdGlvbih0eXBlKXtcclxuICAgICAgICBpZihyZWdpc3Rlci5oYXNPd25Qcm9wZXJ0eSh0eXBlKSkge1xyXG4gICAgICAgICAgICB2YXIgbWV0aG9kTGlzdCA9IHJlZ2lzdGVyW3R5cGVdXHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8bWV0aG9kTGlzdC5sZW5ndGg7KytpKXtcclxuICAgICAgICAgICAgICAgIHZhciBoYW5kbGUgPSBtZXRob2RMaXN0W2ldXHJcbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IFtdXHJcbiAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAxO2k8YXJndW1lbnRzLmxlbmd0aDsrK2kpe1xyXG4gICAgICAgICAgICAgICAgICAgIGFyZ3MucHVzaChhcmd1bWVudHNbaV0pXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy9oYW5kbGUuY2FsbCh0aGlzLGFyZ3MpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImhhbmRsZS5jYWxsKHRoaXMsYXJncykgdHlwZTpcIit0eXBlKVxyXG4gICAgICAgICAgICAgICAgaGFuZGxlLmFwcGx5KHRoaXMsYXJncylcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb2JqLnJlbW92ZUxpc3RlciA9IGZ1bmN0aW9uKHR5cGUpe1xyXG4gICAgICAgIHJlZ2lzdGVyW3R5cGVdID0gW11cclxuICAgIH1cclxuXHJcbiAgICBvYmoucmVtb3ZlQWxsTGlzdGVyID0gZnVuY3Rpb24oKXtcclxuICAgICAgICByZWdpc3RlciA9IHt9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG9ialxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBldmVudExpc3RlciJdfQ==