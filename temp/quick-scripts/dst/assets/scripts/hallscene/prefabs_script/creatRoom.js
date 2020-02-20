
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/hallscene/prefabs_script/creatRoom.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'e85c8xPVuxKX5zdxLJ1e12h', 'creatRoom');
// scripts/hallscene/prefabs_script/creatRoom.js

"use strict";

var _mygolbal = _interopRequireDefault(require("../../mygolbal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

cc.Class({
  "extends": cc.Component,
  properties: {},
  // LIFE-CYCLE CALLBACKS:
  // onLoad () {},
  start: function start() {},
  _createroom: function _createroom(rate) {
    if (rate < 0 || rate > 4) {
      console.log("create room rate error" + rate);
      return;
    }

    var global = 0;

    if (rate == 1) {
      global = 10;
    } else if (rate == 2) {
      global = 20;
    } else if (rate == 3) {
      global = 30;
    } else if (rate == 4) {
      global = 40;
    }

    var room_para = {
      global: global,
      rate: rate
    }; //播放一个等待动画

    _mygolbal["default"].socket.request_creatroom(room_para, function (err, result) {
      if (err != 0) {
        console.log("create_room err:" + err);
      } else {
        console.log("create_room" + JSON.stringify(result)); //网络数据包

        _mygolbal["default"].playerData.bottom = result.bottom;
        _mygolbal["default"].playerData.rate = result.rate;
        cc.director.loadScene("gameScene");
      }
    });
  },
  // update (dt) {},
  onButtonClick: function onButtonClick(event, customData) {
    switch (customData) {
      case "create_room_1":
        this._createroom(1);

        break;

      case "create_room_2":
        this._createroom(2);

        break;

      case "create_room_3":
        this._createroom(3);

        break;

      case "create_room_4":
        this._createroom(4);

        break;

      case "create_room_close":
        this.node.destroy();
        break;

      default:
        break;
    }

    this.node.destroy();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc2NyaXB0c1xcaGFsbHNjZW5lXFxwcmVmYWJzX3NjcmlwdC8uLlxcLi5cXC4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHNjcmlwdHNcXGhhbGxzY2VuZVxccHJlZmFic19zY3JpcHQvYXNzZXRzXFxzY3JpcHRzXFxoYWxsc2NlbmVcXHByZWZhYnNfc2NyaXB0XFxjcmVhdFJvb20uanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJzdGFydCIsIl9jcmVhdGVyb29tIiwicmF0ZSIsImNvbnNvbGUiLCJsb2ciLCJnbG9iYWwiLCJyb29tX3BhcmEiLCJteWdsb2JhbCIsInNvY2tldCIsInJlcXVlc3RfY3JlYXRyb29tIiwiZXJyIiwicmVzdWx0IiwiSlNPTiIsInN0cmluZ2lmeSIsInBsYXllckRhdGEiLCJib3R0b20iLCJkaXJlY3RvciIsImxvYWRTY2VuZSIsIm9uQnV0dG9uQ2xpY2siLCJldmVudCIsImN1c3RvbURhdGEiLCJub2RlIiwiZGVzdHJveSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNQLGFBQVNELEVBQUUsQ0FBQ0UsU0FETDtBQUdQQyxFQUFBQSxVQUFVLEVBQUUsRUFITDtBQU9QO0FBRUE7QUFFQUMsRUFBQUEsS0FYTyxtQkFXQyxDQUVQLENBYk07QUFlUEMsRUFBQUEsV0FmTyx1QkFlS0MsSUFmTCxFQWVXO0FBQ2hCLFFBQUlBLElBQUksR0FBRyxDQUFQLElBQVlBLElBQUksR0FBRyxDQUF2QixFQUEwQjtBQUN4QkMsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksMkJBQTJCRixJQUF2QztBQUNBO0FBQ0Q7O0FBRUQsUUFBSUcsTUFBTSxHQUFHLENBQWI7O0FBQ0EsUUFBSUgsSUFBSSxJQUFJLENBQVosRUFBZTtBQUNiRyxNQUFBQSxNQUFNLEdBQUcsRUFBVDtBQUNELEtBRkQsTUFFTyxJQUFJSCxJQUFJLElBQUksQ0FBWixFQUFlO0FBQ3BCRyxNQUFBQSxNQUFNLEdBQUcsRUFBVDtBQUNELEtBRk0sTUFFQSxJQUFJSCxJQUFJLElBQUksQ0FBWixFQUFlO0FBQ3BCRyxNQUFBQSxNQUFNLEdBQUcsRUFBVDtBQUNELEtBRk0sTUFFQSxJQUFJSCxJQUFJLElBQUksQ0FBWixFQUFlO0FBQ3BCRyxNQUFBQSxNQUFNLEdBQUcsRUFBVDtBQUNEOztBQUVELFFBQUlDLFNBQVMsR0FBRztBQUNkRCxNQUFBQSxNQUFNLEVBQUVBLE1BRE07QUFFZEgsTUFBQUEsSUFBSSxFQUFFQTtBQUZRLEtBQWhCLENBakJnQixDQXFCaEI7O0FBQ0FLLHlCQUFTQyxNQUFULENBQWdCQyxpQkFBaEIsQ0FBa0NILFNBQWxDLEVBQTZDLFVBQVVJLEdBQVYsRUFBZUMsTUFBZixFQUF1QjtBQUNsRSxVQUFJRCxHQUFHLElBQUksQ0FBWCxFQUFjO0FBQ1pQLFFBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLHFCQUFxQk0sR0FBakM7QUFDRCxPQUZELE1BRU87QUFDTFAsUUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksZ0JBQWdCUSxJQUFJLENBQUNDLFNBQUwsQ0FBZUYsTUFBZixDQUE1QixFQURLLENBRUw7O0FBQ0FKLDZCQUFTTyxVQUFULENBQW9CQyxNQUFwQixHQUE2QkosTUFBTSxDQUFDSSxNQUFwQztBQUNBUiw2QkFBU08sVUFBVCxDQUFvQlosSUFBcEIsR0FBMkJTLE1BQU0sQ0FBQ1QsSUFBbEM7QUFDQU4sUUFBQUEsRUFBRSxDQUFDb0IsUUFBSCxDQUFZQyxTQUFaLENBQXNCLFdBQXRCO0FBQ0Q7QUFFRixLQVhEO0FBWUQsR0FqRE07QUFtRFA7QUFDQUMsRUFBQUEsYUFwRE8seUJBb0RPQyxLQXBEUCxFQW9EY0MsVUFwRGQsRUFvRDBCO0FBQy9CLFlBQVFBLFVBQVI7QUFDRSxXQUFLLGVBQUw7QUFDRSxhQUFLbkIsV0FBTCxDQUFpQixDQUFqQjs7QUFDQTs7QUFDRixXQUFLLGVBQUw7QUFDRSxhQUFLQSxXQUFMLENBQWlCLENBQWpCOztBQUNBOztBQUNGLFdBQUssZUFBTDtBQUNFLGFBQUtBLFdBQUwsQ0FBaUIsQ0FBakI7O0FBQ0E7O0FBQ0YsV0FBSyxlQUFMO0FBQ0UsYUFBS0EsV0FBTCxDQUFpQixDQUFqQjs7QUFDQTs7QUFDRixXQUFLLG1CQUFMO0FBQ0UsYUFBS29CLElBQUwsQ0FBVUMsT0FBVjtBQUNBOztBQUNGO0FBQ0U7QUFqQko7O0FBbUJBLFNBQUtELElBQUwsQ0FBVUMsT0FBVjtBQUVEO0FBMUVNLENBQVQiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxoYWxsc2NlbmVcXHByZWZhYnNfc2NyaXB0Iiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG15Z2xvYmFsIGZyb20gXCIuLi8uLi9teWdvbGJhbC5qc1wiXHJcbmNjLkNsYXNzKHtcclxuICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gIHByb3BlcnRpZXM6IHtcclxuXHJcbiAgfSxcclxuXHJcbiAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XHJcblxyXG4gIC8vIG9uTG9hZCAoKSB7fSxcclxuXHJcbiAgc3RhcnQoKSB7XHJcblxyXG4gIH0sXHJcblxyXG4gIF9jcmVhdGVyb29tKHJhdGUpIHtcclxuICAgIGlmIChyYXRlIDwgMCB8fCByYXRlID4gNCkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcImNyZWF0ZSByb29tIHJhdGUgZXJyb3JcIiArIHJhdGUpXHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIHZhciBnbG9iYWwgPSAwXHJcbiAgICBpZiAocmF0ZSA9PSAxKSB7XHJcbiAgICAgIGdsb2JhbCA9IDEwXHJcbiAgICB9IGVsc2UgaWYgKHJhdGUgPT0gMikge1xyXG4gICAgICBnbG9iYWwgPSAyMFxyXG4gICAgfSBlbHNlIGlmIChyYXRlID09IDMpIHtcclxuICAgICAgZ2xvYmFsID0gMzBcclxuICAgIH0gZWxzZSBpZiAocmF0ZSA9PSA0KSB7XHJcbiAgICAgIGdsb2JhbCA9IDQwXHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHJvb21fcGFyYSA9IHtcclxuICAgICAgZ2xvYmFsOiBnbG9iYWwsXHJcbiAgICAgIHJhdGU6IHJhdGVcclxuICAgIH1cclxuICAgIC8v5pKt5pS+5LiA5Liq562J5b6F5Yqo55S7XHJcbiAgICBteWdsb2JhbC5zb2NrZXQucmVxdWVzdF9jcmVhdHJvb20ocm9vbV9wYXJhLCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcclxuICAgICAgaWYgKGVyciAhPSAwKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJjcmVhdGVfcm9vbSBlcnI6XCIgKyBlcnIpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJjcmVhdGVfcm9vbVwiICsgSlNPTi5zdHJpbmdpZnkocmVzdWx0KSlcclxuICAgICAgICAvL+e9kee7nOaVsOaNruWMhVxyXG4gICAgICAgIG15Z2xvYmFsLnBsYXllckRhdGEuYm90dG9tID0gcmVzdWx0LmJvdHRvbVxyXG4gICAgICAgIG15Z2xvYmFsLnBsYXllckRhdGEucmF0ZSA9IHJlc3VsdC5yYXRlXHJcbiAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwiZ2FtZVNjZW5lXCIpXHJcbiAgICAgIH1cclxuXHJcbiAgICB9KVxyXG4gIH0sXHJcblxyXG4gIC8vIHVwZGF0ZSAoZHQpIHt9LFxyXG4gIG9uQnV0dG9uQ2xpY2soZXZlbnQsIGN1c3RvbURhdGEpIHtcclxuICAgIHN3aXRjaCAoY3VzdG9tRGF0YSkge1xyXG4gICAgICBjYXNlIFwiY3JlYXRlX3Jvb21fMVwiOlxyXG4gICAgICAgIHRoaXMuX2NyZWF0ZXJvb20oMSlcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIFwiY3JlYXRlX3Jvb21fMlwiOlxyXG4gICAgICAgIHRoaXMuX2NyZWF0ZXJvb20oMilcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIFwiY3JlYXRlX3Jvb21fM1wiOlxyXG4gICAgICAgIHRoaXMuX2NyZWF0ZXJvb20oMylcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIFwiY3JlYXRlX3Jvb21fNFwiOlxyXG4gICAgICAgIHRoaXMuX2NyZWF0ZXJvb20oNClcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIFwiY3JlYXRlX3Jvb21fY2xvc2VcIjpcclxuICAgICAgICB0aGlzLm5vZGUuZGVzdHJveSgpXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG4gICAgdGhpcy5ub2RlLmRlc3Ryb3koKVxyXG5cclxuICB9XHJcblxyXG59KTtcclxuIl19