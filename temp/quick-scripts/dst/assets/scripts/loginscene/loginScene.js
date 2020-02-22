
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
  onLoad: function onLoad() {},
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
        _mygolbal["default"].playerData.userId = count;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxsb2dpbnNjZW5lLy4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxsb2dpbnNjZW5lL2Fzc2V0c1xcc2NyaXB0c1xcbG9naW5zY2VuZVxcbG9naW5TY2VuZS5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsIndhaXRfbm9kZSIsIk5vZGUiLCJvbkxvYWQiLCJzdGFydCIsIm9uQnV0dG9uQ2lsY2siLCJldmVudCIsImN1c3RvbURhdGEiLCJjb25zb2xlIiwibG9nIiwibXlnbG9iYWwiLCJzb2NrZXQiLCJyZXF1ZXN0X3d4TG9naW4iLCJ1bmlxdWVJRCIsInBsYXllckRhdGEiLCJ1c2VyTmFtZSIsImF2YXRhclVybCIsImVyciIsInJlc3VsdCIsIkpTT04iLCJzdHJpbmdpZnkiLCJnb2JhbF9jb3VudCIsImdvbGRjb3VudCIsImRpcmVjdG9yIiwibG9hZFNjZW5lIiwiYmluZCIsImFjdGl2ZSIsImNvdW50IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwidXNlcklkIiwic3lzIiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNQLGFBQVNELEVBQUUsQ0FBQ0UsU0FETDtBQUdQQyxFQUFBQSxVQUFVLEVBQUU7QUFDVkMsSUFBQUEsU0FBUyxFQUFFSixFQUFFLENBQUNLO0FBREosR0FITDtBQU9QO0FBRUFDLEVBQUFBLE1BVE8sb0JBU0UsQ0FBRSxDQVRKO0FBV1BDLEVBQUFBLEtBWE8sbUJBV0MsQ0FBRSxDQVhIO0FBWVBDLEVBQUFBLGFBWk8seUJBWU9DLEtBWlAsRUFZY0MsVUFaZCxFQVkwQjtBQUMvQixZQUFRQSxVQUFSO0FBQ0UsV0FBSyxVQUFMO0FBQ0VDLFFBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGtCQUFaLEVBREYsQ0FHRTs7QUFFQUMsNkJBQVNDLE1BQVQsQ0FBZ0JDLGVBQWhCLENBQWdDO0FBQzlCQyxVQUFBQSxRQUFRLEVBQUVILHFCQUFTSSxVQUFULENBQW9CRCxRQURBO0FBRTlCO0FBQ0FFLFVBQUFBLFFBQVEsRUFBRUwscUJBQVNJLFVBQVQsQ0FBb0JDLFFBSEE7QUFJOUJDLFVBQUFBLFNBQVMsRUFBRU4scUJBQVNJLFVBQVQsQ0FBb0JFO0FBSkQsU0FBaEMsRUFLRyxVQUFVQyxHQUFWLEVBQWVDLE1BQWYsRUFBdUI7QUFDeEI7QUFDQTtBQUNBO0FBQ0EsY0FBSUQsR0FBRyxJQUFJLENBQVgsRUFBYztBQUNaVCxZQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxTQUFTUSxHQUFyQjtBQUNBO0FBQ0Q7O0FBRURULFVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGlCQUFpQlUsSUFBSSxDQUFDQyxTQUFMLENBQWVGLE1BQWYsQ0FBN0I7QUFDQVIsK0JBQVNJLFVBQVQsQ0FBb0JPLFdBQXBCLEdBQWtDSCxNQUFNLENBQUNJLFNBQXpDO0FBQ0F6QixVQUFBQSxFQUFFLENBQUMwQixRQUFILENBQVlDLFNBQVosQ0FBc0IsV0FBdEI7QUFDRCxTQVpFLENBWURDLElBWkMsQ0FZSSxJQVpKLENBTEg7O0FBa0JBOztBQUNGLFdBQUssYUFBTDtBQUNFLGFBQUt4QixTQUFMLENBQWV5QixNQUFmLEdBQXdCLElBQXhCO0FBQ0EsWUFBTUMsS0FBSyxHQUFHQyxJQUFJLENBQUNDLEtBQUwsQ0FBV0QsSUFBSSxDQUFDRSxNQUFMLEtBQWdCLE1BQTNCLENBQWQ7QUFDQSxZQUFNZixRQUFRLG1CQUFZWSxLQUFaLENBQWQ7QUFDQWpCLDZCQUFTSSxVQUFULENBQW9CaUIsTUFBcEIsR0FBNkJKLEtBQTdCO0FBQ0FqQiw2QkFBU0ksVUFBVCxDQUFvQkMsUUFBcEIsR0FBK0JBLFFBQS9CO0FBQ0FsQixRQUFBQSxFQUFFLENBQUNtQyxHQUFILENBQU9DLFlBQVAsQ0FBb0JDLE9BQXBCLENBQTRCLFVBQTVCLEVBQXdDZixJQUFJLENBQUNDLFNBQUwsQ0FBZVYscUJBQVNJLFVBQXhCLENBQXhDO0FBQ0FqQixRQUFBQSxFQUFFLENBQUMwQixRQUFILENBQVlDLFNBQVosQ0FBc0IsV0FBdEI7O0FBQ0Y7QUFDRTtBQWxDSjtBQW9DRCxHQWpETSxDQWtEUDs7QUFsRE8sQ0FBVCIsInNvdXJjZVJvb3QiOiIuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc2NyaXB0c1xcbG9naW5zY2VuZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBteWdsb2JhbCBmcm9tIFwiLi4vbXlnb2xiYWwuanNcIlxyXG5jYy5DbGFzcyh7XHJcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICBwcm9wZXJ0aWVzOiB7XHJcbiAgICB3YWl0X25vZGU6IGNjLk5vZGVcclxuICB9LFxyXG5cclxuICAvLyBMSUZFLUNZQ0xFIENBTExCQUNLUzpcclxuXHJcbiAgb25Mb2FkKCkge30sXHJcblxyXG4gIHN0YXJ0KCkge30sXHJcbiAgb25CdXR0b25DaWxjayhldmVudCwgY3VzdG9tRGF0YSkge1xyXG4gICAgc3dpdGNoIChjdXN0b21EYXRhKSB7XHJcbiAgICAgIGNhc2UgXCJ3eF9sb2dpblwiOlxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwid3hfbG9naW4gcmVxdWVzdFwiKVxyXG5cclxuICAgICAgICAvL3RoaXMud2FpdF9ub2RlLmFjdGl2ZSA9IHRydWVcclxuXHJcbiAgICAgICAgbXlnbG9iYWwuc29ja2V0LnJlcXVlc3Rfd3hMb2dpbih7XHJcbiAgICAgICAgICB1bmlxdWVJRDogbXlnbG9iYWwucGxheWVyRGF0YS51bmlxdWVJRCxcclxuICAgICAgICAgIC8vIHVzZXJJZDogbXlnbG9iYWwucGxheWVyRGF0YS51c2VySWQsXHJcbiAgICAgICAgICB1c2VyTmFtZTogbXlnbG9iYWwucGxheWVyRGF0YS51c2VyTmFtZSxcclxuICAgICAgICAgIGF2YXRhclVybDogbXlnbG9iYWwucGxheWVyRGF0YS5hdmF0YXJVcmwsXHJcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XHJcbiAgICAgICAgICAvL+ivt+axgui/lOWbnlxyXG4gICAgICAgICAgLy/lhYjpmpDol4/nrYnlvoVVSVxyXG4gICAgICAgICAgLy90aGlzLndhaXRfbm9kZS5hY3RpdmUgPSBmYWxzZVxyXG4gICAgICAgICAgaWYgKGVyciAhPSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyOlwiICsgZXJyKVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcImxvZ2luIHN1Y2Vzc1wiICsgSlNPTi5zdHJpbmdpZnkocmVzdWx0KSlcclxuICAgICAgICAgIG15Z2xvYmFsLnBsYXllckRhdGEuZ29iYWxfY291bnQgPSByZXN1bHQuZ29sZGNvdW50XHJcbiAgICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJoYWxsU2NlbmVcIilcclxuICAgICAgICB9LmJpbmQodGhpcykpXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnZ3Vlc3RfbG9naW4nOlxyXG4gICAgICAgIHRoaXMud2FpdF9ub2RlLmFjdGl2ZSA9IHRydWVcclxuICAgICAgICBjb25zdCBjb3VudCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwMClcclxuICAgICAgICBjb25zdCB1c2VyTmFtZSA9IGBndWVzdF8ke2NvdW50fWBcclxuICAgICAgICBteWdsb2JhbC5wbGF5ZXJEYXRhLnVzZXJJZCA9IGNvdW50XHJcbiAgICAgICAgbXlnbG9iYWwucGxheWVyRGF0YS51c2VyTmFtZSA9IHVzZXJOYW1lXHJcbiAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VyRGF0YScsIEpTT04uc3RyaW5naWZ5KG15Z2xvYmFsLnBsYXllckRhdGEpKVxyXG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcImhhbGxTY2VuZVwiKVxyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vIHVwZGF0ZSAoZHQpIHt9LFxyXG5cclxuXHJcbn0pO1xyXG4iXX0=