
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
  var that = userData || {
    userId: '',
    // 用户id
    userName: '',
    // 用户名称，guest_ 开头
    roomId: '',
    // 游戏房间id
    rootList: [{
      seatindex: 1,
      "accountid": "2117836",
      userName: "guest_".concat(getRandomStr(5)),
      "avatarUrl": "avatar_2",
      "goldcount": getRandomStr(4)
    }, {
      seatindex: 2,
      "accountid": "2117837",
      userName: "guest_".concat(getRandomStr(5)),
      "avatarUrl": "avatar_3",
      "goldcount": getRandomStr(4)
    }]
  }; // that.uniqueID = 1 + getRandomStr(6)

  that.gobal_count = cc.sys.localStorage.getItem('user_count');
  that.master_accountid = 0;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxkYXRhLy4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxkYXRhL2Fzc2V0c1xcc2NyaXB0c1xcZGF0YVxccGxheWVyLmpzIl0sIm5hbWVzIjpbImdldFJhbmRvbVN0ciIsImNvdW50Iiwic3RyIiwiaSIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsInBsYXllckRhdGEiLCJ1c2VyRGF0YSIsIkpTT04iLCJwYXJzZSIsImNjIiwic3lzIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInRoYXQiLCJ1c2VySWQiLCJ1c2VyTmFtZSIsInJvb21JZCIsInJvb3RMaXN0Iiwic2VhdGluZGV4IiwiZ29iYWxfY291bnQiLCJtYXN0ZXJfYWNjb3VudGlkIiwiY29uc29sZSIsImxvZyIsInNldEl0ZW0iLCJzdHJpbmdpZnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFNQSxZQUFZLEdBQUcsU0FBZkEsWUFBZSxDQUFVQyxLQUFWLEVBQWlCO0FBQ3BDLE1BQUlDLEdBQUcsR0FBRyxFQUFWOztBQUNBLE9BQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0YsS0FBcEIsRUFBMkJFLENBQUMsRUFBNUIsRUFBZ0M7QUFDOUJELElBQUFBLEdBQUcsSUFBSUUsSUFBSSxDQUFDQyxLQUFMLENBQVdELElBQUksQ0FBQ0UsTUFBTCxLQUFnQixFQUEzQixDQUFQO0FBQ0Q7O0FBQ0QsU0FBT0osR0FBUDtBQUNELENBTkQ7O0FBUUEsSUFBTUssVUFBVSxHQUFHLFNBQWJBLFVBQWEsR0FBWTtBQUM3QixNQUFNQyxRQUFRLEdBQUdDLElBQUksQ0FBQ0MsS0FBTCxDQUFXQyxFQUFFLENBQUNDLEdBQUgsQ0FBT0MsWUFBUCxDQUFvQkMsT0FBcEIsQ0FBNEIsVUFBNUIsQ0FBWCxDQUFqQjtBQUVBLE1BQUlDLElBQUksR0FBR1AsUUFBUSxJQUFJO0FBQ3JCUSxJQUFBQSxNQUFNLEVBQUUsRUFEYTtBQUNUO0FBQ1pDLElBQUFBLFFBQVEsRUFBRSxFQUZXO0FBRVA7QUFDZEMsSUFBQUEsTUFBTSxFQUFFLEVBSGE7QUFHVjtBQUNYQyxJQUFBQSxRQUFRLEVBQUUsQ0FDUjtBQUFFQyxNQUFBQSxTQUFTLEVBQUUsQ0FBYjtBQUFnQixtQkFBYSxTQUE3QjtBQUF3Q0gsTUFBQUEsUUFBUSxrQkFBV2pCLFlBQVksQ0FBQyxDQUFELENBQXZCLENBQWhEO0FBQThFLG1CQUFhLFVBQTNGO0FBQXVHLG1CQUFhQSxZQUFZLENBQUMsQ0FBRDtBQUFoSSxLQURRLEVBRVI7QUFBRW9CLE1BQUFBLFNBQVMsRUFBRSxDQUFiO0FBQWdCLG1CQUFhLFNBQTdCO0FBQXdDSCxNQUFBQSxRQUFRLGtCQUFXakIsWUFBWSxDQUFDLENBQUQsQ0FBdkIsQ0FBaEQ7QUFBOEUsbUJBQWEsVUFBM0Y7QUFBdUcsbUJBQWFBLFlBQVksQ0FBQyxDQUFEO0FBQWhJLEtBRlE7QUFKVyxHQUF2QixDQUg2QixDQVk3Qjs7QUFDQWUsRUFBQUEsSUFBSSxDQUFDTSxXQUFMLEdBQW1CVixFQUFFLENBQUNDLEdBQUgsQ0FBT0MsWUFBUCxDQUFvQkMsT0FBcEIsQ0FBNEIsWUFBNUIsQ0FBbkI7QUFDQUMsRUFBQUEsSUFBSSxDQUFDTyxnQkFBTCxHQUF3QixDQUF4Qjs7QUFDQSxNQUFJLENBQUNkLFFBQUwsRUFBZTtBQUNiZSxJQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWWhCLFFBQVo7QUFDQUcsSUFBQUEsRUFBRSxDQUFDQyxHQUFILENBQU9DLFlBQVAsQ0FBb0JZLE9BQXBCLENBQTRCLFVBQTVCLEVBQXdDaEIsSUFBSSxDQUFDaUIsU0FBTCxDQUFlWCxJQUFmLENBQXhDO0FBQ0Q7O0FBQ0QsU0FBT0EsSUFBUDtBQUNELENBcEJEOztlQXFCZVIiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHNjcmlwdHNcXGRhdGEiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBnZXRSYW5kb21TdHIgPSBmdW5jdGlvbiAoY291bnQpIHtcclxuICB2YXIgc3RyID0gJyc7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XHJcbiAgICBzdHIgKz0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xyXG4gIH1cclxuICByZXR1cm4gc3RyO1xyXG59O1xyXG5cclxuY29uc3QgcGxheWVyRGF0YSA9IGZ1bmN0aW9uICgpIHtcclxuICBjb25zdCB1c2VyRGF0YSA9IEpTT04ucGFyc2UoY2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyRGF0YScpKVxyXG5cclxuICB2YXIgdGhhdCA9IHVzZXJEYXRhIHx8IHtcclxuICAgIHVzZXJJZDogJycsIC8vIOeUqOaIt2lkXHJcbiAgICB1c2VyTmFtZTogJycsIC8vIOeUqOaIt+WQjeensO+8jGd1ZXN0XyDlvIDlpLRcclxuICAgIHJvb21JZDogJycsLy8g5ri45oiP5oi/6Ze0aWRcclxuICAgIHJvb3RMaXN0OiBbXHJcbiAgICAgIHsgc2VhdGluZGV4OiAxLCBcImFjY291bnRpZFwiOiBcIjIxMTc4MzZcIiwgdXNlck5hbWU6IGBndWVzdF8ke2dldFJhbmRvbVN0cig1KX1gLCBcImF2YXRhclVybFwiOiBcImF2YXRhcl8yXCIsIFwiZ29sZGNvdW50XCI6IGdldFJhbmRvbVN0cig0KSB9LFxyXG4gICAgICB7IHNlYXRpbmRleDogMiwgXCJhY2NvdW50aWRcIjogXCIyMTE3ODM3XCIsIHVzZXJOYW1lOiBgZ3Vlc3RfJHtnZXRSYW5kb21TdHIoNSl9YCwgXCJhdmF0YXJVcmxcIjogXCJhdmF0YXJfM1wiLCBcImdvbGRjb3VudFwiOiBnZXRSYW5kb21TdHIoNCkgfVxyXG4gICAgXVxyXG4gIH1cclxuICAvLyB0aGF0LnVuaXF1ZUlEID0gMSArIGdldFJhbmRvbVN0cig2KVxyXG4gIHRoYXQuZ29iYWxfY291bnQgPSBjYy5zeXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXJfY291bnQnKVxyXG4gIHRoYXQubWFzdGVyX2FjY291bnRpZCA9IDBcclxuICBpZiAoIXVzZXJEYXRhKSB7XHJcbiAgICBjb25zb2xlLmxvZyh1c2VyRGF0YSlcclxuICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlckRhdGEnLCBKU09OLnN0cmluZ2lmeSh0aGF0KSlcclxuICB9XHJcbiAgcmV0dXJuIHRoYXQ7XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgcGxheWVyRGF0YVxyXG4iXX0=