
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/data/player.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'ec2a0fYPv1ASr8YTOKp3Np/', 'player');
// scripts/data/player.js

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var getRandomStr = function getRandomStr(count) {
  var str = '';

  for (var i = 0; i < count; i++) {
    str += Math.floor(Math.random() * 10);
  }

  return str;
};

var playerData = function playerData() {
  var that = {}; //that.uniqueID = "200000";
  //that.uniqueID = "1328014"

  that.uniqueID = 1 + getRandomStr(6);
  that.accountID = "2" + getRandomStr(6);
  that.nickName = "tiny" + getRandomStr(3);
  var str = "avatar_" + (Math.floor(Math.random() * 3) + 1);
  that.avatarUrl = str; //随机一个头像

  that.gobal_count = 0;
  that.master_accountid = 0;
  return that;
};

var _default = playerData;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxkYXRhLy4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxkYXRhL2Fzc2V0c1xcc2NyaXB0c1xcZGF0YVxccGxheWVyLmpzIl0sIm5hbWVzIjpbImdldFJhbmRvbVN0ciIsImNvdW50Iiwic3RyIiwiaSIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsInBsYXllckRhdGEiLCJ0aGF0IiwidW5pcXVlSUQiLCJhY2NvdW50SUQiLCJuaWNrTmFtZSIsImF2YXRhclVybCIsImdvYmFsX2NvdW50IiwibWFzdGVyX2FjY291bnRpZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQU1BLFlBQVksR0FBRyxTQUFmQSxZQUFlLENBQVVDLEtBQVYsRUFBaUI7QUFDbEMsTUFBSUMsR0FBRyxHQUFHLEVBQVY7O0FBQ0EsT0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFpQkEsQ0FBQyxHQUFHRixLQUFyQixFQUE2QkUsQ0FBQyxFQUE5QixFQUFrQztBQUM5QkQsSUFBQUEsR0FBRyxJQUFJRSxJQUFJLENBQUNDLEtBQUwsQ0FBV0QsSUFBSSxDQUFDRSxNQUFMLEtBQWdCLEVBQTNCLENBQVA7QUFDSDs7QUFDRCxTQUFPSixHQUFQO0FBQ0gsQ0FORDs7QUFRQSxJQUFNSyxVQUFVLEdBQUcsU0FBYkEsVUFBYSxHQUFVO0FBQ3pCLE1BQUlDLElBQUksR0FBRyxFQUFYLENBRHlCLENBR3pCO0FBQ0E7O0FBQ0FBLEVBQUFBLElBQUksQ0FBQ0MsUUFBTCxHQUFnQixJQUFJVCxZQUFZLENBQUMsQ0FBRCxDQUFoQztBQUNBUSxFQUFBQSxJQUFJLENBQUNFLFNBQUwsR0FBaUIsTUFBTVYsWUFBWSxDQUFDLENBQUQsQ0FBbkM7QUFDQVEsRUFBQUEsSUFBSSxDQUFDRyxRQUFMLEdBQWdCLFNBQVNYLFlBQVksQ0FBQyxDQUFELENBQXJDO0FBQ0EsTUFBSUUsR0FBRyxHQUFHLGFBQWFFLElBQUksQ0FBQ0MsS0FBTCxDQUFXRCxJQUFJLENBQUNFLE1BQUwsS0FBZ0IsQ0FBM0IsSUFBZ0MsQ0FBN0MsQ0FBVjtBQUNBRSxFQUFBQSxJQUFJLENBQUNJLFNBQUwsR0FBaUJWLEdBQWpCLENBVHlCLENBU0Y7O0FBQ3ZCTSxFQUFBQSxJQUFJLENBQUNLLFdBQUwsR0FBbUIsQ0FBbkI7QUFDQUwsRUFBQUEsSUFBSSxDQUFDTSxnQkFBTCxHQUFzQixDQUF0QjtBQUNBLFNBQU9OLElBQVA7QUFDSCxDQWJEOztlQWVlRCIsInNvdXJjZVJvb3QiOiIuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc2NyaXB0c1xcZGF0YSIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGdldFJhbmRvbVN0ciA9IGZ1bmN0aW9uIChjb3VudCkge1xyXG4gICAgdmFyIHN0ciA9ICcnO1xyXG4gICAgZm9yICh2YXIgaSA9IDAgOyBpIDwgY291bnQgOyBpICsrKXtcclxuICAgICAgICBzdHIgKz0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN0cjtcclxufTtcclxuXHJcbmNvbnN0IHBsYXllckRhdGEgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIHRoYXQgPSB7fVxyXG5cclxuICAgIC8vdGhhdC51bmlxdWVJRCA9IFwiMjAwMDAwXCI7XHJcbiAgICAvL3RoYXQudW5pcXVlSUQgPSBcIjEzMjgwMTRcIlxyXG4gICAgdGhhdC51bmlxdWVJRCA9IDEgKyBnZXRSYW5kb21TdHIoNilcclxuICAgIHRoYXQuYWNjb3VudElEID0gXCIyXCIgKyBnZXRSYW5kb21TdHIoNilcclxuICAgIHRoYXQubmlja05hbWUgPSBcInRpbnlcIiArIGdldFJhbmRvbVN0cigzKVxyXG4gICAgdmFyIHN0ciA9IFwiYXZhdGFyX1wiICsgKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDMpICsgMSlcclxuICAgIHRoYXQuYXZhdGFyVXJsID0gc3RyICAgLy/pmo/mnLrkuIDkuKrlpLTlg49cclxuICAgIHRoYXQuZ29iYWxfY291bnQgPSAwXHJcbiAgICB0aGF0Lm1hc3Rlcl9hY2NvdW50aWQ9MFxyXG4gICAgcmV0dXJuIHRoYXQ7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHBsYXllckRhdGFcclxuIl19