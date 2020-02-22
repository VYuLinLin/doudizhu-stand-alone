
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
    btn_ready: cc.Node // 准备
    // btn_gamestart: cc.Node, // 开始

  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {// this.btn_gamestart.active = false
    //监听本地的发送的消息
    // this.node.on("init", function () {
    //   console.log("game beforeui init")
    //   console.log("myglobal.playerData.housemanageid" + myglobal.playerData.housemanageid)
    //   console.log("myglobal.playerData.userId" + myglobal.playerData.userId)
    //   if (myglobal.playerData.housemanageid == myglobal.playerData.userId) {
    //     //自己就是房主
    //     this.btn_gamestart.active = true
    //     this.btn_ready.active = false
    //   } else {
    //     this.btn_gamestart.active = false
    //     this.btn_ready.active = true
    //   }
    // }.bind(this))
    //监听服务器发送来的消息
    // myglobal.socket.onGameStart(function(){
    //     console.log("gamebrforeUI onGameStart revice")
    //     this.node.active = false
    // }.bind(this))
    // myglobal.socket.onChangeHouseManage(function (data) {
    //   console.log("gamebrforeUI onChangeHouseManage revice" + JSON.stringify(data))
    //   myglobal.playerData.housemanageid = data
    //   if (myglobal.playerData.housemanageid == myglobal.playerData.userId) {
    //     //自己就是房主
    //     this.btn_gamestart.active = true
    //     this.btn_ready.active = false
    //   } else {
    //     this.btn_gamestart.active = false
    //     this.btn_ready.active = true
    //   }
    // }.bind(this))
  },
  start: function start() {},
  // update (dt) {},
  onButtonClick: function onButtonClick(event, customData) {
    switch (customData) {
      case "btn_ready":
        console.log("btn_ready"); // myglobal.socket.requestReady()

        this.btn_ready.active = false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxnYW1lU2NlbmUvLi5cXC4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHNjcmlwdHNcXGdhbWVTY2VuZS9hc3NldHNcXHNjcmlwdHNcXGdhbWVTY2VuZVxcZ2FtZWJlZm9yZVVJLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiYnRuX3JlYWR5IiwiTm9kZSIsIm9uTG9hZCIsInN0YXJ0Iiwib25CdXR0b25DbGljayIsImV2ZW50IiwiY3VzdG9tRGF0YSIsImNvbnNvbGUiLCJsb2ciLCJhY3RpdmUiLCJteWdsb2JhbCIsInNvY2tldCIsInJlcXVlc3RTdGFydCIsImVyciIsImRhdGEiLCJKU09OIiwic3RyaW5naWZ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0FBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ1AsYUFBU0QsRUFBRSxDQUFDRSxTQURMO0FBR1BDLEVBQUFBLFVBQVUsRUFBRTtBQUNWQyxJQUFBQSxTQUFTLEVBQUVKLEVBQUUsQ0FBQ0ssSUFESixDQUNVO0FBQ3BCOztBQUZVLEdBSEw7QUFRUDtBQUVBQyxFQUFBQSxNQVZPLG9CQVVFLENBRVA7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNELEdBaERNO0FBa0RQQyxFQUFBQSxLQWxETyxtQkFrREMsQ0FFUCxDQXBETTtBQXNEUDtBQUVBQyxFQUFBQSxhQXhETyx5QkF3RE9DLEtBeERQLEVBd0RjQyxVQXhEZCxFQXdEMEI7QUFDL0IsWUFBUUEsVUFBUjtBQUNFLFdBQUssV0FBTDtBQUNFQyxRQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxXQUFaLEVBREYsQ0FFRTs7QUFDQSxhQUFLUixTQUFMLENBQWVTLE1BQWYsR0FBd0IsS0FBeEI7QUFDQTs7QUFDRixXQUFLLFdBQUw7QUFDRTtBQUNBO0FBQ0E7QUFDQUYsUUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksV0FBWjs7QUFDQUUsNkJBQVNDLE1BQVQsQ0FBZ0JDLFlBQWhCLENBQTZCLFVBQVVDLEdBQVYsRUFBZUMsSUFBZixFQUFxQjtBQUNoRCxjQUFJRCxHQUFHLElBQUksQ0FBWCxFQUFjO0FBQ1pOLFlBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLHFCQUFxQkssR0FBakM7QUFDRCxXQUZELE1BRU87QUFDTE4sWUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksc0JBQXNCTyxJQUFJLENBQUNDLFNBQUwsQ0FBZUYsSUFBZixDQUFsQztBQUVEO0FBQ0YsU0FQRDs7QUFRQTs7QUFDRjtBQUNFO0FBckJKO0FBdUJEO0FBaEZNLENBQVQiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHNjcmlwdHNcXGdhbWVTY2VuZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBteWdsb2JhbCBmcm9tIFwiLi4vbXlnb2xiYWwuanNcIlxyXG5jYy5DbGFzcyh7XHJcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICBwcm9wZXJ0aWVzOiB7XHJcbiAgICBidG5fcmVhZHk6IGNjLk5vZGUsIC8vIOWHhuWkh1xyXG4gICAgLy8gYnRuX2dhbWVzdGFydDogY2MuTm9kZSwgLy8g5byA5aeLXHJcbiAgfSxcclxuXHJcbiAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XHJcblxyXG4gIG9uTG9hZCgpIHtcclxuXHJcbiAgICAvLyB0aGlzLmJ0bl9nYW1lc3RhcnQuYWN0aXZlID0gZmFsc2VcclxuXHJcbiAgICAvL+ebkeWQrOacrOWcsOeahOWPkemAgeeahOa2iOaBr1xyXG4gICAgLy8gdGhpcy5ub2RlLm9uKFwiaW5pdFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyAgIGNvbnNvbGUubG9nKFwiZ2FtZSBiZWZvcmV1aSBpbml0XCIpXHJcbiAgICAvLyAgIGNvbnNvbGUubG9nKFwibXlnbG9iYWwucGxheWVyRGF0YS5ob3VzZW1hbmFnZWlkXCIgKyBteWdsb2JhbC5wbGF5ZXJEYXRhLmhvdXNlbWFuYWdlaWQpXHJcbiAgICAvLyAgIGNvbnNvbGUubG9nKFwibXlnbG9iYWwucGxheWVyRGF0YS51c2VySWRcIiArIG15Z2xvYmFsLnBsYXllckRhdGEudXNlcklkKVxyXG4gICAgLy8gICBpZiAobXlnbG9iYWwucGxheWVyRGF0YS5ob3VzZW1hbmFnZWlkID09IG15Z2xvYmFsLnBsYXllckRhdGEudXNlcklkKSB7XHJcbiAgICAvLyAgICAgLy/oh6rlt7HlsLHmmK/miL/kuLtcclxuICAgIC8vICAgICB0aGlzLmJ0bl9nYW1lc3RhcnQuYWN0aXZlID0gdHJ1ZVxyXG4gICAgLy8gICAgIHRoaXMuYnRuX3JlYWR5LmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAvLyAgIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgdGhpcy5idG5fZ2FtZXN0YXJ0LmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAvLyAgICAgdGhpcy5idG5fcmVhZHkuYWN0aXZlID0gdHJ1ZVxyXG4gICAgLy8gICB9XHJcbiAgICAvLyB9LmJpbmQodGhpcykpXHJcblxyXG4gICAgLy/nm5HlkKzmnI3liqHlmajlj5HpgIHmnaXnmoTmtojmga9cclxuICAgIC8vIG15Z2xvYmFsLnNvY2tldC5vbkdhbWVTdGFydChmdW5jdGlvbigpe1xyXG4gICAgLy8gICAgIGNvbnNvbGUubG9nKFwiZ2FtZWJyZm9yZVVJIG9uR2FtZVN0YXJ0IHJldmljZVwiKVxyXG4gICAgLy8gICAgIHRoaXMubm9kZS5hY3RpdmUgPSBmYWxzZVxyXG4gICAgLy8gfS5iaW5kKHRoaXMpKVxyXG5cclxuICAgIC8vIG15Z2xvYmFsLnNvY2tldC5vbkNoYW5nZUhvdXNlTWFuYWdlKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAvLyAgIGNvbnNvbGUubG9nKFwiZ2FtZWJyZm9yZVVJIG9uQ2hhbmdlSG91c2VNYW5hZ2UgcmV2aWNlXCIgKyBKU09OLnN0cmluZ2lmeShkYXRhKSlcclxuICAgIC8vICAgbXlnbG9iYWwucGxheWVyRGF0YS5ob3VzZW1hbmFnZWlkID0gZGF0YVxyXG4gICAgLy8gICBpZiAobXlnbG9iYWwucGxheWVyRGF0YS5ob3VzZW1hbmFnZWlkID09IG15Z2xvYmFsLnBsYXllckRhdGEudXNlcklkKSB7XHJcbiAgICAvLyAgICAgLy/oh6rlt7HlsLHmmK/miL/kuLtcclxuICAgIC8vICAgICB0aGlzLmJ0bl9nYW1lc3RhcnQuYWN0aXZlID0gdHJ1ZVxyXG4gICAgLy8gICAgIHRoaXMuYnRuX3JlYWR5LmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAvLyAgIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgdGhpcy5idG5fZ2FtZXN0YXJ0LmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAvLyAgICAgdGhpcy5idG5fcmVhZHkuYWN0aXZlID0gdHJ1ZVxyXG4gICAgLy8gICB9XHJcblxyXG4gICAgLy8gfS5iaW5kKHRoaXMpKVxyXG4gIH0sXHJcblxyXG4gIHN0YXJ0KCkge1xyXG5cclxuICB9LFxyXG5cclxuICAvLyB1cGRhdGUgKGR0KSB7fSxcclxuXHJcbiAgb25CdXR0b25DbGljayhldmVudCwgY3VzdG9tRGF0YSkge1xyXG4gICAgc3dpdGNoIChjdXN0b21EYXRhKSB7XHJcbiAgICAgIGNhc2UgXCJidG5fcmVhZHlcIjpcclxuICAgICAgICBjb25zb2xlLmxvZyhcImJ0bl9yZWFkeVwiKVxyXG4gICAgICAgIC8vIG15Z2xvYmFsLnNvY2tldC5yZXF1ZXN0UmVhZHkoKVxyXG4gICAgICAgIHRoaXMuYnRuX3JlYWR5LmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSBcImJ0bl9zdGFydFwiOlxyXG4gICAgICAgIC8vIGlmKGlzb3Blbl9zb3VuZCl7XHJcbiAgICAgICAgLy8gICAgY2MuYXVkaW9FbmdpbmUucGxheShjYy51cmwucmF3KFwicmVzb3VyY2VzL3NvdW5kL3N0YXJ0X2Eub2dnXCIpKSBcclxuICAgICAgICAvLyAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiYnRuX3N0YXJ0XCIpXHJcbiAgICAgICAgbXlnbG9iYWwuc29ja2V0LnJlcXVlc3RTdGFydChmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XHJcbiAgICAgICAgICBpZiAoZXJyICE9IDApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZXF1ZXN0U3RhcnQgZXJyXCIgKyBlcnIpXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInJlcXVlc3RTdGFydCBkYXRhXCIgKyBKU09OLnN0cmluZ2lmeShkYXRhKSlcclxuXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICBicmVha1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgfVxyXG59KTtcclxuIl19