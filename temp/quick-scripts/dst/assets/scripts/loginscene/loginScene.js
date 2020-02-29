
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/loginscene/loginScene.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'b05a68gSOpBWr8ddvT03Jpj', 'loginScene');
// scripts/loginscene/loginScene.js

"use strict";

var _mygolbal = _interopRequireDefault(require("../mygolbal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

cc.Class({
  "extends": cc.Component,
  properties: {
    wait_node: cc.Node
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    cc.director.preloadScene("hallScene");
  },
  start: function start() {},
  onButtonCilck: function onButtonCilck(event, customData) {
    switch (customData) {
      case "wx_login":
        console.log("wx_login request"); //this.wait_node.active = true

        _mygolbal["default"].socket.request_wxLogin({
          uniqueID: _mygolbal["default"].playerData.uniqueID,
          // userId: myglobal.playerData.userId,
          userName: _mygolbal["default"].playerData.userName,
          avatarUrl: _mygolbal["default"].playerData.avatarUrl
        }, function (err, result) {
          //请求返回
          //先隐藏等待UI
          //this.wait_node.active = false
          if (err != 0) {
            console.log("err:" + err);
            return;
          }

          console.log("login sucess" + JSON.stringify(result));
          _mygolbal["default"].playerData.gobal_count = result.goldcount;
          cc.director.loadScene("hallScene");
        }.bind(this));

        break;

      case 'guest_login':
        this.wait_node.active = true;
        var count = Math.floor(Math.random() * 100000);
        var userName = "guest_".concat(count);
        _mygolbal["default"].playerData.userId = "".concat(count);
        _mygolbal["default"].playerData.userName = userName;
        cc.sys.localStorage.setItem('userData', JSON.stringify(_mygolbal["default"].playerData));
        cc.director.loadScene("hallScene");

      default:
        break;
    }
  } // update (dt) {},

});

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxsb2dpbnNjZW5lLy4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxsb2dpbnNjZW5lL2Fzc2V0c1xcc2NyaXB0c1xcbG9naW5zY2VuZVxcbG9naW5TY2VuZS5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsIndhaXRfbm9kZSIsIk5vZGUiLCJvbkxvYWQiLCJkaXJlY3RvciIsInByZWxvYWRTY2VuZSIsInN0YXJ0Iiwib25CdXR0b25DaWxjayIsImV2ZW50IiwiY3VzdG9tRGF0YSIsImNvbnNvbGUiLCJsb2ciLCJteWdsb2JhbCIsInNvY2tldCIsInJlcXVlc3Rfd3hMb2dpbiIsInVuaXF1ZUlEIiwicGxheWVyRGF0YSIsInVzZXJOYW1lIiwiYXZhdGFyVXJsIiwiZXJyIiwicmVzdWx0IiwiSlNPTiIsInN0cmluZ2lmeSIsImdvYmFsX2NvdW50IiwiZ29sZGNvdW50IiwibG9hZFNjZW5lIiwiYmluZCIsImFjdGl2ZSIsImNvdW50IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwidXNlcklkIiwic3lzIiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNQLGFBQVNELEVBQUUsQ0FBQ0UsU0FETDtBQUdQQyxFQUFBQSxVQUFVLEVBQUU7QUFDVkMsSUFBQUEsU0FBUyxFQUFFSixFQUFFLENBQUNLO0FBREosR0FITDtBQU9QO0FBRUFDLEVBQUFBLE1BVE8sb0JBU0U7QUFDUE4sSUFBQUEsRUFBRSxDQUFDTyxRQUFILENBQVlDLFlBQVosQ0FBeUIsV0FBekI7QUFDRCxHQVhNO0FBYVBDLEVBQUFBLEtBYk8sbUJBYUMsQ0FBRSxDQWJIO0FBY1BDLEVBQUFBLGFBZE8seUJBY09DLEtBZFAsRUFjY0MsVUFkZCxFQWMwQjtBQUMvQixZQUFRQSxVQUFSO0FBQ0UsV0FBSyxVQUFMO0FBQ0VDLFFBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGtCQUFaLEVBREYsQ0FHRTs7QUFFQUMsNkJBQVNDLE1BQVQsQ0FBZ0JDLGVBQWhCLENBQWdDO0FBQzlCQyxVQUFBQSxRQUFRLEVBQUVILHFCQUFTSSxVQUFULENBQW9CRCxRQURBO0FBRTlCO0FBQ0FFLFVBQUFBLFFBQVEsRUFBRUwscUJBQVNJLFVBQVQsQ0FBb0JDLFFBSEE7QUFJOUJDLFVBQUFBLFNBQVMsRUFBRU4scUJBQVNJLFVBQVQsQ0FBb0JFO0FBSkQsU0FBaEMsRUFLRyxVQUFVQyxHQUFWLEVBQWVDLE1BQWYsRUFBdUI7QUFDeEI7QUFDQTtBQUNBO0FBQ0EsY0FBSUQsR0FBRyxJQUFJLENBQVgsRUFBYztBQUNaVCxZQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxTQUFTUSxHQUFyQjtBQUNBO0FBQ0Q7O0FBRURULFVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGlCQUFpQlUsSUFBSSxDQUFDQyxTQUFMLENBQWVGLE1BQWYsQ0FBN0I7QUFDQVIsK0JBQVNJLFVBQVQsQ0FBb0JPLFdBQXBCLEdBQWtDSCxNQUFNLENBQUNJLFNBQXpDO0FBQ0EzQixVQUFBQSxFQUFFLENBQUNPLFFBQUgsQ0FBWXFCLFNBQVosQ0FBc0IsV0FBdEI7QUFDRCxTQVpFLENBWURDLElBWkMsQ0FZSSxJQVpKLENBTEg7O0FBa0JBOztBQUNGLFdBQUssYUFBTDtBQUNFLGFBQUt6QixTQUFMLENBQWUwQixNQUFmLEdBQXdCLElBQXhCO0FBQ0EsWUFBTUMsS0FBSyxHQUFHQyxJQUFJLENBQUNDLEtBQUwsQ0FBV0QsSUFBSSxDQUFDRSxNQUFMLEtBQWdCLE1BQTNCLENBQWQ7QUFDQSxZQUFNZCxRQUFRLG1CQUFZVyxLQUFaLENBQWQ7QUFDQWhCLDZCQUFTSSxVQUFULENBQW9CZ0IsTUFBcEIsYUFBZ0NKLEtBQWhDO0FBQ0FoQiw2QkFBU0ksVUFBVCxDQUFvQkMsUUFBcEIsR0FBK0JBLFFBQS9CO0FBQ0FwQixRQUFBQSxFQUFFLENBQUNvQyxHQUFILENBQU9DLFlBQVAsQ0FBb0JDLE9BQXBCLENBQTRCLFVBQTVCLEVBQXdDZCxJQUFJLENBQUNDLFNBQUwsQ0FBZVYscUJBQVNJLFVBQXhCLENBQXhDO0FBQ0FuQixRQUFBQSxFQUFFLENBQUNPLFFBQUgsQ0FBWXFCLFNBQVosQ0FBc0IsV0FBdEI7O0FBQ0Y7QUFDRTtBQWxDSjtBQW9DRCxHQW5ETSxDQW9EUDs7QUFwRE8sQ0FBVCIsInNvdXJjZVJvb3QiOiIuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc2NyaXB0c1xcbG9naW5zY2VuZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBteWdsb2JhbCBmcm9tIFwiLi4vbXlnb2xiYWwuanNcIlxyXG5jYy5DbGFzcyh7XHJcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICBwcm9wZXJ0aWVzOiB7XHJcbiAgICB3YWl0X25vZGU6IGNjLk5vZGVcclxuICB9LFxyXG5cclxuICAvLyBMSUZFLUNZQ0xFIENBTExCQUNLUzpcclxuXHJcbiAgb25Mb2FkKCkge1xyXG4gICAgY2MuZGlyZWN0b3IucHJlbG9hZFNjZW5lKFwiaGFsbFNjZW5lXCIpXHJcbiAgfSxcclxuXHJcbiAgc3RhcnQoKSB7fSxcclxuICBvbkJ1dHRvbkNpbGNrKGV2ZW50LCBjdXN0b21EYXRhKSB7XHJcbiAgICBzd2l0Y2ggKGN1c3RvbURhdGEpIHtcclxuICAgICAgY2FzZSBcInd4X2xvZ2luXCI6XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJ3eF9sb2dpbiByZXF1ZXN0XCIpXHJcblxyXG4gICAgICAgIC8vdGhpcy53YWl0X25vZGUuYWN0aXZlID0gdHJ1ZVxyXG5cclxuICAgICAgICBteWdsb2JhbC5zb2NrZXQucmVxdWVzdF93eExvZ2luKHtcclxuICAgICAgICAgIHVuaXF1ZUlEOiBteWdsb2JhbC5wbGF5ZXJEYXRhLnVuaXF1ZUlELFxyXG4gICAgICAgICAgLy8gdXNlcklkOiBteWdsb2JhbC5wbGF5ZXJEYXRhLnVzZXJJZCxcclxuICAgICAgICAgIHVzZXJOYW1lOiBteWdsb2JhbC5wbGF5ZXJEYXRhLnVzZXJOYW1lLFxyXG4gICAgICAgICAgYXZhdGFyVXJsOiBteWdsb2JhbC5wbGF5ZXJEYXRhLmF2YXRhclVybCxcclxuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcclxuICAgICAgICAgIC8v6K+35rGC6L+U5ZueXHJcbiAgICAgICAgICAvL+WFiOmakOiXj+etieW+hVVJXHJcbiAgICAgICAgICAvL3RoaXMud2FpdF9ub2RlLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgICAgICBpZiAoZXJyICE9IDApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnI6XCIgKyBlcnIpXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9naW4gc3VjZXNzXCIgKyBKU09OLnN0cmluZ2lmeShyZXN1bHQpKVxyXG4gICAgICAgICAgbXlnbG9iYWwucGxheWVyRGF0YS5nb2JhbF9jb3VudCA9IHJlc3VsdC5nb2xkY291bnRcclxuICAgICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcImhhbGxTY2VuZVwiKVxyXG4gICAgICAgIH0uYmluZCh0aGlzKSlcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdndWVzdF9sb2dpbic6XHJcbiAgICAgICAgdGhpcy53YWl0X25vZGUuYWN0aXZlID0gdHJ1ZVxyXG4gICAgICAgIGNvbnN0IGNvdW50ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDAwKVxyXG4gICAgICAgIGNvbnN0IHVzZXJOYW1lID0gYGd1ZXN0XyR7Y291bnR9YFxyXG4gICAgICAgIG15Z2xvYmFsLnBsYXllckRhdGEudXNlcklkID0gYCR7Y291bnR9YFxyXG4gICAgICAgIG15Z2xvYmFsLnBsYXllckRhdGEudXNlck5hbWUgPSB1c2VyTmFtZVxyXG4gICAgICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlckRhdGEnLCBKU09OLnN0cmluZ2lmeShteWdsb2JhbC5wbGF5ZXJEYXRhKSlcclxuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJoYWxsU2NlbmVcIilcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG4gIH1cclxuICAvLyB1cGRhdGUgKGR0KSB7fSxcclxuXHJcblxyXG59KTtcclxuIl19