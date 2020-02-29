
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
  var userData = JSON.parse(cc.sys.localStorage.getItem('userData'));
  var _ref = [getRandomStr(5), getRandomStr(5)],
      rootId1 = _ref[0],
      rootId2 = _ref[1];
  var that = userData || {
    userId: '',
    // 用户id
    userName: '',
    // 用户名称，guest_ 开头
    roomId: '',
    // 游戏房间id
    seatindex: 0,
    // 作为id
    avatarUrl: 'avatar_1',
    // 头像
    goldcount: 10000,
    // 金额
    rootList: [{
      seatindex: 1,
      userId: rootId1,
      userName: "guest_".concat(rootId1),
      "avatarUrl": "avatar_2",
      "goldcount": getRandomStr(4)
    }, {
      seatindex: 2,
      userId: rootId2,
      userName: "guest_".concat(rootId2),
      "avatarUrl": "avatar_3",
      "goldcount": getRandomStr(4)
    }],
    masterUserId: '' // 地主id

  }; // that.uniqueID = 1 + getRandomStr(6)

  that.gobal_count = cc.sys.localStorage.getItem('user_count'); // that.master_accountid = 0

  if (!userData) {
    console.log(userData);
    cc.sys.localStorage.setItem('userData', JSON.stringify(that));
  }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxkYXRhLy4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxkYXRhL2Fzc2V0c1xcc2NyaXB0c1xcZGF0YVxccGxheWVyLmpzIl0sIm5hbWVzIjpbImdldFJhbmRvbVN0ciIsImNvdW50Iiwic3RyIiwiaSIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsInBsYXllckRhdGEiLCJ1c2VyRGF0YSIsIkpTT04iLCJwYXJzZSIsImNjIiwic3lzIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInJvb3RJZDEiLCJyb290SWQyIiwidGhhdCIsInVzZXJJZCIsInVzZXJOYW1lIiwicm9vbUlkIiwic2VhdGluZGV4IiwiYXZhdGFyVXJsIiwiZ29sZGNvdW50Iiwicm9vdExpc3QiLCJtYXN0ZXJVc2VySWQiLCJnb2JhbF9jb3VudCIsImNvbnNvbGUiLCJsb2ciLCJzZXRJdGVtIiwic3RyaW5naWZ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBTUEsWUFBWSxHQUFHLFNBQWZBLFlBQWUsQ0FBVUMsS0FBVixFQUFpQjtBQUNwQyxNQUFJQyxHQUFHLEdBQUcsRUFBVjs7QUFDQSxPQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdGLEtBQXBCLEVBQTJCRSxDQUFDLEVBQTVCLEVBQWdDO0FBQzlCRCxJQUFBQSxHQUFHLElBQUlFLElBQUksQ0FBQ0MsS0FBTCxDQUFXRCxJQUFJLENBQUNFLE1BQUwsS0FBZ0IsRUFBM0IsQ0FBUDtBQUNEOztBQUNELFNBQU9KLEdBQVA7QUFDRCxDQU5EOztBQVFBLElBQU1LLFVBQVUsR0FBRyxTQUFiQSxVQUFhLEdBQVk7QUFDN0IsTUFBTUMsUUFBUSxHQUFHQyxJQUFJLENBQUNDLEtBQUwsQ0FBV0MsRUFBRSxDQUFDQyxHQUFILENBQU9DLFlBQVAsQ0FBb0JDLE9BQXBCLENBQTRCLFVBQTVCLENBQVgsQ0FBakI7QUFENkIsYUFFRixDQUFDZCxZQUFZLENBQUMsQ0FBRCxDQUFiLEVBQWtCQSxZQUFZLENBQUMsQ0FBRCxDQUE5QixDQUZFO0FBQUEsTUFFdEJlLE9BRnNCO0FBQUEsTUFFYkMsT0FGYTtBQUc3QixNQUFJQyxJQUFJLEdBQUdULFFBQVEsSUFBSTtBQUNyQlUsSUFBQUEsTUFBTSxFQUFFLEVBRGE7QUFDVDtBQUNaQyxJQUFBQSxRQUFRLEVBQUUsRUFGVztBQUVQO0FBQ2RDLElBQUFBLE1BQU0sRUFBRSxFQUhhO0FBR1Y7QUFDWEMsSUFBQUEsU0FBUyxFQUFFLENBSlU7QUFJUDtBQUNkQyxJQUFBQSxTQUFTLEVBQUUsVUFMVTtBQUtFO0FBQ3ZCQyxJQUFBQSxTQUFTLEVBQUUsS0FOVTtBQU1IO0FBQ2xCQyxJQUFBQSxRQUFRLEVBQUUsQ0FDUjtBQUFFSCxNQUFBQSxTQUFTLEVBQUUsQ0FBYjtBQUFnQkgsTUFBQUEsTUFBTSxFQUFFSCxPQUF4QjtBQUFpQ0ksTUFBQUEsUUFBUSxrQkFBV0osT0FBWCxDQUF6QztBQUErRCxtQkFBYSxVQUE1RTtBQUF3RixtQkFBYWYsWUFBWSxDQUFDLENBQUQ7QUFBakgsS0FEUSxFQUVSO0FBQUVxQixNQUFBQSxTQUFTLEVBQUUsQ0FBYjtBQUFnQkgsTUFBQUEsTUFBTSxFQUFFRixPQUF4QjtBQUFpQ0csTUFBQUEsUUFBUSxrQkFBV0gsT0FBWCxDQUF6QztBQUErRCxtQkFBYSxVQUE1RTtBQUF3RixtQkFBYWhCLFlBQVksQ0FBQyxDQUFEO0FBQWpILEtBRlEsQ0FQVztBQVdyQnlCLElBQUFBLFlBQVksRUFBRSxFQVhPLENBV0g7O0FBWEcsR0FBdkIsQ0FINkIsQ0FnQjdCOztBQUNBUixFQUFBQSxJQUFJLENBQUNTLFdBQUwsR0FBbUJmLEVBQUUsQ0FBQ0MsR0FBSCxDQUFPQyxZQUFQLENBQW9CQyxPQUFwQixDQUE0QixZQUE1QixDQUFuQixDQWpCNkIsQ0FrQjdCOztBQUNBLE1BQUksQ0FBQ04sUUFBTCxFQUFlO0FBQ2JtQixJQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWXBCLFFBQVo7QUFDQUcsSUFBQUEsRUFBRSxDQUFDQyxHQUFILENBQU9DLFlBQVAsQ0FBb0JnQixPQUFwQixDQUE0QixVQUE1QixFQUF3Q3BCLElBQUksQ0FBQ3FCLFNBQUwsQ0FBZWIsSUFBZixDQUF4QztBQUNEOztBQUNELFNBQU9BLElBQVA7QUFDRCxDQXhCRDs7ZUF5QmVWIiwic291cmNlUm9vdCI6Ii4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxkYXRhIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZ2V0UmFuZG9tU3RyID0gZnVuY3Rpb24gKGNvdW50KSB7XHJcbiAgdmFyIHN0ciA9ICcnO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xyXG4gICAgc3RyICs9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcclxuICB9XHJcbiAgcmV0dXJuIHN0cjtcclxufTtcclxuXHJcbmNvbnN0IHBsYXllckRhdGEgPSBmdW5jdGlvbiAoKSB7XHJcbiAgY29uc3QgdXNlckRhdGEgPSBKU09OLnBhcnNlKGNjLnN5cy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlckRhdGEnKSlcclxuICBjb25zdCBbcm9vdElkMSwgcm9vdElkMl0gPSBbZ2V0UmFuZG9tU3RyKDUpLCBnZXRSYW5kb21TdHIoNSldXHJcbiAgdmFyIHRoYXQgPSB1c2VyRGF0YSB8fCB7XHJcbiAgICB1c2VySWQ6ICcnLCAvLyDnlKjmiLdpZFxyXG4gICAgdXNlck5hbWU6ICcnLCAvLyDnlKjmiLflkI3np7DvvIxndWVzdF8g5byA5aS0XHJcbiAgICByb29tSWQ6ICcnLC8vIOa4uOaIj+aIv+mXtGlkXHJcbiAgICBzZWF0aW5kZXg6IDAsIC8vIOS9nOS4umlkXHJcbiAgICBhdmF0YXJVcmw6ICdhdmF0YXJfMScsIC8vIOWktOWDj1xyXG4gICAgZ29sZGNvdW50OiAxMDAwMCwgLy8g6YeR6aKdXHJcbiAgICByb290TGlzdDogW1xyXG4gICAgICB7IHNlYXRpbmRleDogMSwgdXNlcklkOiByb290SWQxLCB1c2VyTmFtZTogYGd1ZXN0XyR7cm9vdElkMX1gLCBcImF2YXRhclVybFwiOiBcImF2YXRhcl8yXCIsIFwiZ29sZGNvdW50XCI6IGdldFJhbmRvbVN0cig0KSB9LFxyXG4gICAgICB7IHNlYXRpbmRleDogMiwgdXNlcklkOiByb290SWQyLCB1c2VyTmFtZTogYGd1ZXN0XyR7cm9vdElkMn1gLCBcImF2YXRhclVybFwiOiBcImF2YXRhcl8zXCIsIFwiZ29sZGNvdW50XCI6IGdldFJhbmRvbVN0cig0KSB9XHJcbiAgICBdLFxyXG4gICAgbWFzdGVyVXNlcklkOiAnJywgLy8g5Zyw5Li7aWRcclxuICB9XHJcbiAgLy8gdGhhdC51bmlxdWVJRCA9IDEgKyBnZXRSYW5kb21TdHIoNilcclxuICB0aGF0LmdvYmFsX2NvdW50ID0gY2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyX2NvdW50JylcclxuICAvLyB0aGF0Lm1hc3Rlcl9hY2NvdW50aWQgPSAwXHJcbiAgaWYgKCF1c2VyRGF0YSkge1xyXG4gICAgY29uc29sZS5sb2codXNlckRhdGEpXHJcbiAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXJEYXRhJywgSlNPTi5zdHJpbmdpZnkodGhhdCkpXHJcbiAgfVxyXG4gIHJldHVybiB0aGF0O1xyXG59XHJcbmV4cG9ydCBkZWZhdWx0IHBsYXllckRhdGFcclxuIl19