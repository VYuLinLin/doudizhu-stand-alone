
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/gameScene/gamebeforeUI.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '34b69bK3SJBFbE0zzOU1X9M', 'gamebeforeUI');
// scripts/gameScene/gamebeforeUI.js

"use strict";

var _mygolbal = _interopRequireDefault(require("../mygolbal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_ready: cc.Node,
    btn_gamestart: cc.Node
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    this.btn_gamestart.active = false;
    this.btn_ready.active = false; //监听本地的发送的消息

    this.node.on("init", function () {
      console.log("game beforeui init");
      console.log("myglobal.playerData.housemanageid" + _mygolbal["default"].playerData.housemanageid);
      console.log("myglobal.playerData.accountID" + _mygolbal["default"].playerData.accountID);

      if (_mygolbal["default"].playerData.housemanageid == _mygolbal["default"].playerData.accountID) {
        //自己就是房主
        this.btn_gamestart.active = true;
        this.btn_ready.active = false;
      } else {
        this.btn_gamestart.active = false;
        this.btn_ready.active = true;
      }
    }.bind(this)); //监听服务器发送来的消息
    // myglobal.socket.onGameStart(function(){
    //     console.log("gamebrforeUI onGameStart revice")
    //     this.node.active = false
    // }.bind(this))

    _mygolbal["default"].socket.onChangeHouseManage(function (data) {
      console.log("gamebrforeUI onChangeHouseManage revice" + JSON.stringify(data));
      _mygolbal["default"].playerData.housemanageid = data;

      if (_mygolbal["default"].playerData.housemanageid == _mygolbal["default"].playerData.accountID) {
        //自己就是房主
        this.btn_gamestart.active = true;
        this.btn_ready.active = false;
      } else {
        this.btn_gamestart.active = false;
        this.btn_ready.active = true;
      }
    }.bind(this));
  },
  start: function start() {},
  // update (dt) {},
  onButtonClick: function onButtonClick(event, customData) {
    switch (customData) {
      case "btn_ready":
        console.log("btn_ready");

        _mygolbal["default"].socket.requestReady();

        break;

      case "btn_start":
        // if(isopen_sound){
        //    cc.audioEngine.play(cc.url.raw("resources/sound/start_a.ogg")) 
        //  }
        console.log("btn_start");

        _mygolbal["default"].socket.requestStart(function (err, data) {
          if (err != 0) {
            console.log("requestStart err" + err);
          } else {
            console.log("requestStart data" + JSON.stringify(data));
          }
        });

        break;

      default:
        break;
    }
  }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxnYW1lU2NlbmUvLi5cXC4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHNjcmlwdHNcXGdhbWVTY2VuZS9hc3NldHNcXHNjcmlwdHNcXGdhbWVTY2VuZVxcZ2FtZWJlZm9yZVVJLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiYnRuX3JlYWR5IiwiTm9kZSIsImJ0bl9nYW1lc3RhcnQiLCJvbkxvYWQiLCJhY3RpdmUiLCJub2RlIiwib24iLCJjb25zb2xlIiwibG9nIiwibXlnbG9iYWwiLCJwbGF5ZXJEYXRhIiwiaG91c2VtYW5hZ2VpZCIsImFjY291bnRJRCIsImJpbmQiLCJzb2NrZXQiLCJvbkNoYW5nZUhvdXNlTWFuYWdlIiwiZGF0YSIsIkpTT04iLCJzdHJpbmdpZnkiLCJzdGFydCIsIm9uQnV0dG9uQ2xpY2siLCJldmVudCIsImN1c3RvbURhdGEiLCJyZXF1ZXN0UmVhZHkiLCJyZXF1ZXN0U3RhcnQiLCJlcnIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFFQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDTCxhQUFTRCxFQUFFLENBQUNFLFNBRFA7QUFHTEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1JDLElBQUFBLFNBQVMsRUFBQ0osRUFBRSxDQUFDSyxJQURMO0FBRVJDLElBQUFBLGFBQWEsRUFBQ04sRUFBRSxDQUFDSztBQUZULEdBSFA7QUFRTDtBQUVBRSxFQUFBQSxNQVZLLG9CQVVLO0FBRU4sU0FBS0QsYUFBTCxDQUFtQkUsTUFBbkIsR0FBNEIsS0FBNUI7QUFDQSxTQUFLSixTQUFMLENBQWVJLE1BQWYsR0FBd0IsS0FBeEIsQ0FITSxDQUtOOztBQUNBLFNBQUtDLElBQUwsQ0FBVUMsRUFBVixDQUFhLE1BQWIsRUFBb0IsWUFBVTtBQUMxQkMsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksb0JBQVo7QUFDQUQsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksc0NBQW9DQyxxQkFBU0MsVUFBVCxDQUFvQkMsYUFBcEU7QUFDQUosTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksa0NBQWdDQyxxQkFBU0MsVUFBVCxDQUFvQkUsU0FBaEU7O0FBQ0EsVUFBR0gscUJBQVNDLFVBQVQsQ0FBb0JDLGFBQXBCLElBQW1DRixxQkFBU0MsVUFBVCxDQUFvQkUsU0FBMUQsRUFBb0U7QUFDaEU7QUFDQSxhQUFLVixhQUFMLENBQW1CRSxNQUFuQixHQUE0QixJQUE1QjtBQUNBLGFBQUtKLFNBQUwsQ0FBZUksTUFBZixHQUF3QixLQUF4QjtBQUNILE9BSkQsTUFJSztBQUNELGFBQUtGLGFBQUwsQ0FBbUJFLE1BQW5CLEdBQTRCLEtBQTVCO0FBQ0EsYUFBS0osU0FBTCxDQUFlSSxNQUFmLEdBQXdCLElBQXhCO0FBQ0g7QUFDSixLQVptQixDQVlsQlMsSUFaa0IsQ0FZYixJQVphLENBQXBCLEVBTk0sQ0FvQk47QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQUoseUJBQVNLLE1BQVQsQ0FBZ0JDLG1CQUFoQixDQUFvQyxVQUFTQyxJQUFULEVBQWM7QUFDOUNULE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLDRDQUEwQ1MsSUFBSSxDQUFDQyxTQUFMLENBQWVGLElBQWYsQ0FBdEQ7QUFDQVAsMkJBQVNDLFVBQVQsQ0FBb0JDLGFBQXBCLEdBQW9DSyxJQUFwQzs7QUFDQSxVQUFHUCxxQkFBU0MsVUFBVCxDQUFvQkMsYUFBcEIsSUFBbUNGLHFCQUFTQyxVQUFULENBQW9CRSxTQUExRCxFQUFvRTtBQUNoRTtBQUNBLGFBQUtWLGFBQUwsQ0FBbUJFLE1BQW5CLEdBQTRCLElBQTVCO0FBQ0EsYUFBS0osU0FBTCxDQUFlSSxNQUFmLEdBQXdCLEtBQXhCO0FBQ0gsT0FKRCxNQUlLO0FBQ0QsYUFBS0YsYUFBTCxDQUFtQkUsTUFBbkIsR0FBNEIsS0FBNUI7QUFDQSxhQUFLSixTQUFMLENBQWVJLE1BQWYsR0FBd0IsSUFBeEI7QUFDSDtBQUVKLEtBWm1DLENBWWxDUyxJQVprQyxDQVk3QixJQVo2QixDQUFwQztBQWFILEdBakRJO0FBbURMTSxFQUFBQSxLQW5ESyxtQkFtREksQ0FFUixDQXJESTtBQXVETDtBQUVBQyxFQUFBQSxhQXpESyx5QkF5RFNDLEtBekRULEVBeURlQyxVQXpEZixFQXlEMEI7QUFDM0IsWUFBT0EsVUFBUDtBQUNJLFdBQUssV0FBTDtBQUNJZixRQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxXQUFaOztBQUNBQyw2QkFBU0ssTUFBVCxDQUFnQlMsWUFBaEI7O0FBQ0E7O0FBQ0osV0FBSyxXQUFMO0FBQ0k7QUFDQTtBQUNBO0FBQ0NoQixRQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxXQUFaOztBQUNBQyw2QkFBU0ssTUFBVCxDQUFnQlUsWUFBaEIsQ0FBNkIsVUFBU0MsR0FBVCxFQUFhVCxJQUFiLEVBQWtCO0FBQzVDLGNBQUdTLEdBQUcsSUFBRSxDQUFSLEVBQVU7QUFDTmxCLFlBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLHFCQUFtQmlCLEdBQS9CO0FBQ0gsV0FGRCxNQUVLO0FBQ0RsQixZQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxzQkFBcUJTLElBQUksQ0FBQ0MsU0FBTCxDQUFlRixJQUFmLENBQWpDO0FBRUg7QUFDSCxTQVBEOztBQVFBOztBQUNMO0FBQ0k7QUFwQlI7QUFzQkg7QUFoRkksQ0FBVCIsInNvdXJjZVJvb3QiOiIuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc2NyaXB0c1xcZ2FtZVNjZW5lIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG15Z2xvYmFsIGZyb20gXCIuLi9teWdvbGJhbC5qc1wiXHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIGJ0bl9yZWFkeTpjYy5Ob2RlLFxyXG4gICAgICAgIGJ0bl9nYW1lc3RhcnQ6Y2MuTm9kZSxcclxuICAgIH0sXHJcblxyXG4gICAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XHJcblxyXG4gICAgb25Mb2FkICgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5idG5fZ2FtZXN0YXJ0LmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5idG5fcmVhZHkuYWN0aXZlID0gZmFsc2VcclxuXHJcbiAgICAgICAgLy/nm5HlkKzmnKzlnLDnmoTlj5HpgIHnmoTmtojmga9cclxuICAgICAgICB0aGlzLm5vZGUub24oXCJpbml0XCIsZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJnYW1lIGJlZm9yZXVpIGluaXRcIilcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJteWdsb2JhbC5wbGF5ZXJEYXRhLmhvdXNlbWFuYWdlaWRcIitteWdsb2JhbC5wbGF5ZXJEYXRhLmhvdXNlbWFuYWdlaWQpXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibXlnbG9iYWwucGxheWVyRGF0YS5hY2NvdW50SURcIitteWdsb2JhbC5wbGF5ZXJEYXRhLmFjY291bnRJRClcclxuICAgICAgICAgICAgaWYobXlnbG9iYWwucGxheWVyRGF0YS5ob3VzZW1hbmFnZWlkPT1teWdsb2JhbC5wbGF5ZXJEYXRhLmFjY291bnRJRCl7XHJcbiAgICAgICAgICAgICAgICAvL+iHquW3seWwseaYr+aIv+S4u1xyXG4gICAgICAgICAgICAgICAgdGhpcy5idG5fZ2FtZXN0YXJ0LmFjdGl2ZSA9IHRydWVcclxuICAgICAgICAgICAgICAgIHRoaXMuYnRuX3JlYWR5LmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgdGhpcy5idG5fZ2FtZXN0YXJ0LmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLmJ0bl9yZWFkeS5hY3RpdmUgPSB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LmJpbmQodGhpcykpXHJcblxyXG4gICAgICAgIC8v55uR5ZCs5pyN5Yqh5Zmo5Y+R6YCB5p2l55qE5raI5oGvXHJcbiAgICAgICAgLy8gbXlnbG9iYWwuc29ja2V0Lm9uR2FtZVN0YXJ0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwiZ2FtZWJyZm9yZVVJIG9uR2FtZVN0YXJ0IHJldmljZVwiKVxyXG4gICAgICAgIC8vICAgICB0aGlzLm5vZGUuYWN0aXZlID0gZmFsc2VcclxuICAgICAgICAvLyB9LmJpbmQodGhpcykpXHJcblxyXG4gICAgICAgIG15Z2xvYmFsLnNvY2tldC5vbkNoYW5nZUhvdXNlTWFuYWdlKGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImdhbWVicmZvcmVVSSBvbkNoYW5nZUhvdXNlTWFuYWdlIHJldmljZVwiK0pTT04uc3RyaW5naWZ5KGRhdGEpKVxyXG4gICAgICAgICAgICBteWdsb2JhbC5wbGF5ZXJEYXRhLmhvdXNlbWFuYWdlaWQgPSBkYXRhXHJcbiAgICAgICAgICAgIGlmKG15Z2xvYmFsLnBsYXllckRhdGEuaG91c2VtYW5hZ2VpZD09bXlnbG9iYWwucGxheWVyRGF0YS5hY2NvdW50SUQpe1xyXG4gICAgICAgICAgICAgICAgLy/oh6rlt7HlsLHmmK/miL/kuLtcclxuICAgICAgICAgICAgICAgIHRoaXMuYnRuX2dhbWVzdGFydC5hY3RpdmUgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICB0aGlzLmJ0bl9yZWFkeS5hY3RpdmUgPSBmYWxzZVxyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHRoaXMuYnRuX2dhbWVzdGFydC5hY3RpdmUgPSBmYWxzZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5idG5fcmVhZHkuYWN0aXZlID0gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0uYmluZCh0aGlzKSlcclxuICAgIH0sXHJcblxyXG4gICAgc3RhcnQgKCkge1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXBkYXRlIChkdCkge30sXHJcbiAgICBcclxuICAgIG9uQnV0dG9uQ2xpY2soZXZlbnQsY3VzdG9tRGF0YSl7XHJcbiAgICAgICAgc3dpdGNoKGN1c3RvbURhdGEpe1xyXG4gICAgICAgICAgICBjYXNlIFwiYnRuX3JlYWR5XCI6XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImJ0bl9yZWFkeVwiKVxyXG4gICAgICAgICAgICAgICAgbXlnbG9iYWwuc29ja2V0LnJlcXVlc3RSZWFkeSgpXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlIFwiYnRuX3N0YXJ0XCI6XHJcbiAgICAgICAgICAgICAgICAvLyBpZihpc29wZW5fc291bmQpe1xyXG4gICAgICAgICAgICAgICAgLy8gICAgY2MuYXVkaW9FbmdpbmUucGxheShjYy51cmwucmF3KFwicmVzb3VyY2VzL3NvdW5kL3N0YXJ0X2Eub2dnXCIpKSBcclxuICAgICAgICAgICAgICAgIC8vICB9XHJcbiAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJidG5fc3RhcnRcIilcclxuICAgICAgICAgICAgICAgICBteWdsb2JhbC5zb2NrZXQucmVxdWVzdFN0YXJ0KGZ1bmN0aW9uKGVycixkYXRhKXtcclxuICAgICAgICAgICAgICAgICAgICBpZihlcnIhPTApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInJlcXVlc3RTdGFydCBlcnJcIitlcnIpXHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVxdWVzdFN0YXJ0IGRhdGFcIisgSlNPTi5zdHJpbmdpZnkoZGF0YSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgIGJyZWFrICAgIFxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pO1xyXG4iXX0=