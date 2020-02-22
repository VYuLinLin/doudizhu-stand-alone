
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
  // update (dt) {},
  onBtnClose: function onBtnClose() {
    this.node.destroy();
  },
  // 进入游戏房间
  onButtonClick: function onButtonClick(event, value) {
    var _defines$jdRoomConfig = defines.jdRoomConfig['rate_' + value],
        bottom = _defines$jdRoomConfig.bottom,
        rate = _defines$jdRoomConfig.rate;
    var roomId = "".concat(rate, "_").concat(bottom, "_").concat(Math.floor(Math.random() * 1000));
    _mygolbal["default"].playerData.bottom = bottom;
    _mygolbal["default"].playerData.rate = rate;
    _mygolbal["default"].playerData.roomId = roomId;
    cc.sys.localStorage.setItem('userData', JSON.stringify(_mygolbal["default"].playerData));
    cc.director.loadScene("gameScene");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc2NyaXB0c1xcaGFsbHNjZW5lXFxwcmVmYWJzX3NjcmlwdC8uLlxcLi5cXC4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHNjcmlwdHNcXGhhbGxzY2VuZVxccHJlZmFic19zY3JpcHQvYXNzZXRzXFxzY3JpcHRzXFxoYWxsc2NlbmVcXHByZWZhYnNfc2NyaXB0XFxjcmVhdFJvb20uanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJzdGFydCIsIm9uQnRuQ2xvc2UiLCJub2RlIiwiZGVzdHJveSIsIm9uQnV0dG9uQ2xpY2siLCJldmVudCIsInZhbHVlIiwiZGVmaW5lcyIsImpkUm9vbUNvbmZpZyIsImJvdHRvbSIsInJhdGUiLCJyb29tSWQiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJteWdsb2JhbCIsInBsYXllckRhdGEiLCJzeXMiLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiSlNPTiIsInN0cmluZ2lmeSIsImRpcmVjdG9yIiwibG9hZFNjZW5lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0FBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ1AsYUFBU0QsRUFBRSxDQUFDRSxTQURMO0FBR1BDLEVBQUFBLFVBQVUsRUFBRSxFQUhMO0FBT1A7QUFFQTtBQUVBQyxFQUFBQSxLQVhPLG1CQVdDLENBQ1AsQ0FaTTtBQWNQO0FBQ0FDLEVBQUFBLFVBZk8sd0JBZU07QUFDWCxTQUFLQyxJQUFMLENBQVVDLE9BQVY7QUFDRCxHQWpCTTtBQWtCUDtBQUNBQyxFQUFBQSxhQW5CTyx5QkFtQk9DLEtBbkJQLEVBbUJjQyxLQW5CZCxFQW1CcUI7QUFBQSxnQ0FDREMsT0FBTyxDQUFDQyxZQUFSLENBQXFCLFVBQVVGLEtBQS9CLENBREM7QUFBQSxRQUNsQkcsTUFEa0IseUJBQ2xCQSxNQURrQjtBQUFBLFFBQ1ZDLElBRFUseUJBQ1ZBLElBRFU7QUFFMUIsUUFBTUMsTUFBTSxhQUFNRCxJQUFOLGNBQWNELE1BQWQsY0FBd0JHLElBQUksQ0FBQ0MsS0FBTCxDQUFXRCxJQUFJLENBQUNFLE1BQUwsS0FBZ0IsSUFBM0IsQ0FBeEIsQ0FBWjtBQUNBQyx5QkFBU0MsVUFBVCxDQUFvQlAsTUFBcEIsR0FBNkJBLE1BQTdCO0FBQ0FNLHlCQUFTQyxVQUFULENBQW9CTixJQUFwQixHQUEyQkEsSUFBM0I7QUFDQUsseUJBQVNDLFVBQVQsQ0FBb0JMLE1BQXBCLEdBQTZCQSxNQUE3QjtBQUNBZixJQUFBQSxFQUFFLENBQUNxQixHQUFILENBQU9DLFlBQVAsQ0FBb0JDLE9BQXBCLENBQTRCLFVBQTVCLEVBQXdDQyxJQUFJLENBQUNDLFNBQUwsQ0FBZU4scUJBQVNDLFVBQXhCLENBQXhDO0FBQ0FwQixJQUFBQSxFQUFFLENBQUMwQixRQUFILENBQVlDLFNBQVosQ0FBc0IsV0FBdEI7QUFDQSxTQUFLckIsSUFBTCxDQUFVQyxPQUFWO0FBQ0Q7QUE1Qk0sQ0FBVCIsInNvdXJjZVJvb3QiOiIuLlxcLi5cXC4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHNjcmlwdHNcXGhhbGxzY2VuZVxccHJlZmFic19zY3JpcHQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbXlnbG9iYWwgZnJvbSBcIi4uLy4uL215Z29sYmFsLmpzXCJcclxuY2MuQ2xhc3Moe1xyXG4gIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgcHJvcGVydGllczoge1xyXG5cclxuICB9LFxyXG5cclxuICAvLyBMSUZFLUNZQ0xFIENBTExCQUNLUzpcclxuXHJcbiAgLy8gb25Mb2FkICgpIHt9LFxyXG5cclxuICBzdGFydCgpIHtcclxuICB9LFxyXG5cclxuICAvLyB1cGRhdGUgKGR0KSB7fSxcclxuICBvbkJ0bkNsb3NlKCkge1xyXG4gICAgdGhpcy5ub2RlLmRlc3Ryb3koKVxyXG4gIH0sXHJcbiAgLy8g6L+b5YWl5ri45oiP5oi/6Ze0XHJcbiAgb25CdXR0b25DbGljayhldmVudCwgdmFsdWUpIHtcclxuICAgIGNvbnN0IHsgYm90dG9tLCByYXRlIH0gPSBkZWZpbmVzLmpkUm9vbUNvbmZpZ1sncmF0ZV8nICsgdmFsdWVdXHJcbiAgICBjb25zdCByb29tSWQgPSBgJHtyYXRlfV8ke2JvdHRvbX1fJHtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwKX1gXHJcbiAgICBteWdsb2JhbC5wbGF5ZXJEYXRhLmJvdHRvbSA9IGJvdHRvbVxyXG4gICAgbXlnbG9iYWwucGxheWVyRGF0YS5yYXRlID0gcmF0ZVxyXG4gICAgbXlnbG9iYWwucGxheWVyRGF0YS5yb29tSWQgPSByb29tSWRcclxuICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlckRhdGEnLCBKU09OLnN0cmluZ2lmeShteWdsb2JhbC5wbGF5ZXJEYXRhKSlcclxuICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcImdhbWVTY2VuZVwiKVxyXG4gICAgdGhpcy5ub2RlLmRlc3Ryb3koKVxyXG4gIH1cclxuXHJcbn0pO1xyXG4iXX0=