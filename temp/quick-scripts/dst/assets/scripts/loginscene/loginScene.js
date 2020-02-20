
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
    //console.log("qian_state.qian:"+ qian_state.qian)
    if (isopen_sound) {
      cc.audioEngine.play(cc.url.raw("resources/sound/login_bg.ogg"), true);
    }

    _mygolbal["default"].socket.initSocket();
  },
  start: function start() {},
  onButtonCilck: function onButtonCilck(event, customData) {
    switch (customData) {
      case "wx_login":
        console.log("wx_login request"); //this.wait_node.active = true

        _mygolbal["default"].socket.request_wxLogin({
          uniqueID: _mygolbal["default"].playerData.uniqueID,
          accountID: _mygolbal["default"].playerData.accountID,
          nickName: _mygolbal["default"].playerData.nickName,
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
        _mygolbal["default"].playerData.gobal_count = Math.floor(Math.random() * 100000);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxsb2dpbnNjZW5lLy4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxsb2dpbnNjZW5lL2Fzc2V0c1xcc2NyaXB0c1xcbG9naW5zY2VuZVxcbG9naW5TY2VuZS5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsIndhaXRfbm9kZSIsIk5vZGUiLCJvbkxvYWQiLCJpc29wZW5fc291bmQiLCJhdWRpb0VuZ2luZSIsInBsYXkiLCJ1cmwiLCJyYXciLCJteWdsb2JhbCIsInNvY2tldCIsImluaXRTb2NrZXQiLCJzdGFydCIsIm9uQnV0dG9uQ2lsY2siLCJldmVudCIsImN1c3RvbURhdGEiLCJjb25zb2xlIiwibG9nIiwicmVxdWVzdF93eExvZ2luIiwidW5pcXVlSUQiLCJwbGF5ZXJEYXRhIiwiYWNjb3VudElEIiwibmlja05hbWUiLCJhdmF0YXJVcmwiLCJlcnIiLCJyZXN1bHQiLCJKU09OIiwic3RyaW5naWZ5IiwiZ29iYWxfY291bnQiLCJnb2xkY291bnQiLCJkaXJlY3RvciIsImxvYWRTY2VuZSIsImJpbmQiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDTCxhQUFTRCxFQUFFLENBQUNFLFNBRFA7QUFHTEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1RDLElBQUFBLFNBQVMsRUFBQ0osRUFBRSxDQUFDSztBQURKLEdBSFA7QUFPTDtBQUVBQyxFQUFBQSxNQVRLLG9CQVNLO0FBQ047QUFDQSxRQUFHQyxZQUFILEVBQWdCO0FBQ1pQLE1BQUFBLEVBQUUsQ0FBQ1EsV0FBSCxDQUFlQyxJQUFmLENBQW9CVCxFQUFFLENBQUNVLEdBQUgsQ0FBT0MsR0FBUCxDQUFXLDhCQUFYLENBQXBCLEVBQStELElBQS9EO0FBQ0Y7O0FBRURDLHlCQUFTQyxNQUFULENBQWdCQyxVQUFoQjtBQUNKLEdBaEJJO0FBa0JMQyxFQUFBQSxLQWxCSyxtQkFrQkksQ0FDUixDQW5CSTtBQXFCTEMsRUFBQUEsYUFyQksseUJBcUJTQyxLQXJCVCxFQXFCZUMsVUFyQmYsRUFxQjBCO0FBQzNCLFlBQU9BLFVBQVA7QUFDSSxXQUFLLFVBQUw7QUFDSUMsUUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksa0JBQVosRUFESixDQUdJOztBQUVBUiw2QkFBU0MsTUFBVCxDQUFnQlEsZUFBaEIsQ0FBZ0M7QUFDNUJDLFVBQUFBLFFBQVEsRUFBQ1YscUJBQVNXLFVBQVQsQ0FBb0JELFFBREQ7QUFFNUJFLFVBQUFBLFNBQVMsRUFBQ1oscUJBQVNXLFVBQVQsQ0FBb0JDLFNBRkY7QUFHNUJDLFVBQUFBLFFBQVEsRUFBQ2IscUJBQVNXLFVBQVQsQ0FBb0JFLFFBSEQ7QUFJNUJDLFVBQUFBLFNBQVMsRUFBQ2QscUJBQVNXLFVBQVQsQ0FBb0JHO0FBSkYsU0FBaEMsRUFLRSxVQUFTQyxHQUFULEVBQWFDLE1BQWIsRUFBb0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0EsY0FBR0QsR0FBRyxJQUFFLENBQVIsRUFBVTtBQUNQUixZQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxTQUFPTyxHQUFuQjtBQUNBO0FBQ0Y7O0FBRURSLFVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGlCQUFpQlMsSUFBSSxDQUFDQyxTQUFMLENBQWVGLE1BQWYsQ0FBN0I7QUFDQWhCLCtCQUFTVyxVQUFULENBQW9CUSxXQUFwQixHQUFrQ0gsTUFBTSxDQUFDSSxTQUF6QztBQUNBaEMsVUFBQUEsRUFBRSxDQUFDaUMsUUFBSCxDQUFZQyxTQUFaLENBQXNCLFdBQXRCO0FBQ0gsU0FaQyxDQVlBQyxJQVpBLENBWUssSUFaTCxDQUxGOztBQWtCQTs7QUFDRixXQUFLLGFBQUw7QUFDTXZCLDZCQUFTVyxVQUFULENBQW9CUSxXQUFwQixHQUFrQ0ssSUFBSSxDQUFDQyxLQUFMLENBQVdELElBQUksQ0FBQ0UsTUFBTCxLQUFnQixNQUEzQixDQUFsQztBQUNBdEMsUUFBQUEsRUFBRSxDQUFDaUMsUUFBSCxDQUFZQyxTQUFaLENBQXNCLFdBQXRCOztBQUNSO0FBQ0k7QUE3QlI7QUErQkgsR0FyREksQ0FzREw7O0FBdERLLENBQVQiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHNjcmlwdHNcXGxvZ2luc2NlbmUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbXlnbG9iYWwgZnJvbSBcIi4uL215Z29sYmFsLmpzXCJcclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgIHdhaXRfbm9kZTpjYy5Ob2RlLFxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBMSUZFLUNZQ0xFIENBTExCQUNLUzpcclxuXHJcbiAgICBvbkxvYWQgKCkge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJxaWFuX3N0YXRlLnFpYW46XCIrIHFpYW5fc3RhdGUucWlhbilcclxuICAgICAgICBpZihpc29wZW5fc291bmQpe1xyXG4gICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5KGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvc291bmQvbG9naW5fYmcub2dnXCIpLHRydWUpIFxyXG4gICAgICAgICB9XHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgIG15Z2xvYmFsLnNvY2tldC5pbml0U29ja2V0KClcclxuICAgIH0sXHJcbiAgICBcclxuICAgIHN0YXJ0ICgpIHtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIG9uQnV0dG9uQ2lsY2soZXZlbnQsY3VzdG9tRGF0YSl7XHJcbiAgICAgICAgc3dpdGNoKGN1c3RvbURhdGEpe1xyXG4gICAgICAgICAgICBjYXNlIFwid3hfbG9naW5cIjpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwid3hfbG9naW4gcmVxdWVzdFwiKVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvL3RoaXMud2FpdF9ub2RlLmFjdGl2ZSA9IHRydWVcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgbXlnbG9iYWwuc29ja2V0LnJlcXVlc3Rfd3hMb2dpbih7XHJcbiAgICAgICAgICAgICAgICAgICAgdW5pcXVlSUQ6bXlnbG9iYWwucGxheWVyRGF0YS51bmlxdWVJRCxcclxuICAgICAgICAgICAgICAgICAgICBhY2NvdW50SUQ6bXlnbG9iYWwucGxheWVyRGF0YS5hY2NvdW50SUQsXHJcbiAgICAgICAgICAgICAgICAgICAgbmlja05hbWU6bXlnbG9iYWwucGxheWVyRGF0YS5uaWNrTmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBhdmF0YXJVcmw6bXlnbG9iYWwucGxheWVyRGF0YS5hdmF0YXJVcmwsXHJcbiAgICAgICAgICAgICAgICB9LGZ1bmN0aW9uKGVycixyZXN1bHQpe1xyXG4gICAgICAgICAgICAgICAgICAgIC8v6K+35rGC6L+U5ZueXHJcbiAgICAgICAgICAgICAgICAgICAgLy/lhYjpmpDol4/nrYnlvoVVSVxyXG4gICAgICAgICAgICAgICAgICAgIC8vdGhpcy53YWl0X25vZGUuYWN0aXZlID0gZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICBpZihlcnIhPTApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyOlwiK2VycilcclxuICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2dpbiBzdWNlc3NcIiArIEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpXHJcbiAgICAgICAgICAgICAgICAgICAgbXlnbG9iYWwucGxheWVyRGF0YS5nb2JhbF9jb3VudCA9IHJlc3VsdC5nb2xkY291bnRcclxuICAgICAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJoYWxsU2NlbmVcIilcclxuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSlcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgY2FzZSAnZ3Vlc3RfbG9naW4nOlxyXG4gICAgICAgICAgICAgICAgICAgIG15Z2xvYmFsLnBsYXllckRhdGEuZ29iYWxfY291bnQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMDApXHJcbiAgICAgICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwiaGFsbFNjZW5lXCIpXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIHVwZGF0ZSAoZHQpIHt9LFxyXG5cclxuXHJcbn0pO1xyXG4iXX0=