
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/hallscene/hallScene.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '9eee7bdCqVB/LXv3XqKAza9', 'hallScene');
// scripts/hallscene/hallScene.js

"use strict";

var _mygolbal = _interopRequireDefault(require("../mygolbal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

cc.Class({
  "extends": cc.Component,
  properties: {
    nickname_label: cc.Label,
    headimage: cc.Sprite,
    gobal_count: cc.Label,
    creatroom_prefabs: cc.Prefab,
    joinroom_prefabs: cc.Prefab
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    this.nickname_label.string = _mygolbal["default"].playerData.userName;
    cc.director.preloadScene("gameScene");
  },
  start: function start() {},
  // update (dt) {},
  onButtonClick: function onButtonClick(event, customData) {
    switch (customData) {
      case "create_room":
        var creator_Room = cc.instantiate(this.creatroom_prefabs);
        creator_Room.parent = this.node;
        creator_Room.zIndex = 100;
        break;

      case "join_room":
        var join_Room = cc.instantiate(this.joinroom_prefabs);
        join_Room.parent = this.node;
        join_Room.zIndex = 100;
        break;

      default:
        break;
    }
  },
  onBtnJingdian: function onBtnJingdian() {
    var creator_Room = cc.instantiate(this.creatroom_prefabs);
    creator_Room.parent = this.node;
    creator_Room.zIndex = 100;
  },
  onBtnLaizi: function onBtnLaizi() {
    alert('暂未开放');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxoYWxsc2NlbmUvLi5cXC4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHNjcmlwdHNcXGhhbGxzY2VuZS9hc3NldHNcXHNjcmlwdHNcXGhhbGxzY2VuZVxcaGFsbFNjZW5lLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwibmlja25hbWVfbGFiZWwiLCJMYWJlbCIsImhlYWRpbWFnZSIsIlNwcml0ZSIsImdvYmFsX2NvdW50IiwiY3JlYXRyb29tX3ByZWZhYnMiLCJQcmVmYWIiLCJqb2lucm9vbV9wcmVmYWJzIiwib25Mb2FkIiwic3RyaW5nIiwibXlnbG9iYWwiLCJwbGF5ZXJEYXRhIiwidXNlck5hbWUiLCJkaXJlY3RvciIsInByZWxvYWRTY2VuZSIsInN0YXJ0Iiwib25CdXR0b25DbGljayIsImV2ZW50IiwiY3VzdG9tRGF0YSIsImNyZWF0b3JfUm9vbSIsImluc3RhbnRpYXRlIiwicGFyZW50Iiwibm9kZSIsInpJbmRleCIsImpvaW5fUm9vbSIsIm9uQnRuSmluZ2RpYW4iLCJvbkJ0bkxhaXppIiwiYWxlcnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFFQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDUCxhQUFTRCxFQUFFLENBQUNFLFNBREw7QUFHUEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLElBQUFBLGNBQWMsRUFBRUosRUFBRSxDQUFDSyxLQURUO0FBRVZDLElBQUFBLFNBQVMsRUFBRU4sRUFBRSxDQUFDTyxNQUZKO0FBR1ZDLElBQUFBLFdBQVcsRUFBRVIsRUFBRSxDQUFDSyxLQUhOO0FBSVZJLElBQUFBLGlCQUFpQixFQUFFVCxFQUFFLENBQUNVLE1BSlo7QUFLVkMsSUFBQUEsZ0JBQWdCLEVBQUVYLEVBQUUsQ0FBQ1U7QUFMWCxHQUhMO0FBV1A7QUFFQUUsRUFBQUEsTUFiTyxvQkFhRTtBQUNQLFNBQUtSLGNBQUwsQ0FBb0JTLE1BQXBCLEdBQTZCQyxxQkFBU0MsVUFBVCxDQUFvQkMsUUFBakQ7QUFDQWhCLElBQUFBLEVBQUUsQ0FBQ2lCLFFBQUgsQ0FBWUMsWUFBWixDQUF5QixXQUF6QjtBQUNELEdBaEJNO0FBa0JQQyxFQUFBQSxLQWxCTyxtQkFrQkMsQ0FFUCxDQXBCTTtBQXNCUDtBQUVBQyxFQUFBQSxhQXhCTyx5QkF3Qk9DLEtBeEJQLEVBd0JjQyxVQXhCZCxFQXdCMEI7QUFDL0IsWUFBUUEsVUFBUjtBQUNFLFdBQUssYUFBTDtBQUNFLFlBQUlDLFlBQVksR0FBR3ZCLEVBQUUsQ0FBQ3dCLFdBQUgsQ0FBZSxLQUFLZixpQkFBcEIsQ0FBbkI7QUFDQWMsUUFBQUEsWUFBWSxDQUFDRSxNQUFiLEdBQXNCLEtBQUtDLElBQTNCO0FBQ0FILFFBQUFBLFlBQVksQ0FBQ0ksTUFBYixHQUFzQixHQUF0QjtBQUNBOztBQUNGLFdBQUssV0FBTDtBQUNFLFlBQUlDLFNBQVMsR0FBRzVCLEVBQUUsQ0FBQ3dCLFdBQUgsQ0FBZSxLQUFLYixnQkFBcEIsQ0FBaEI7QUFDQWlCLFFBQUFBLFNBQVMsQ0FBQ0gsTUFBVixHQUFtQixLQUFLQyxJQUF4QjtBQUNBRSxRQUFBQSxTQUFTLENBQUNELE1BQVYsR0FBbUIsR0FBbkI7QUFDQTs7QUFDRjtBQUNFO0FBWko7QUFjRCxHQXZDTTtBQXdDUEUsRUFBQUEsYUF4Q08sMkJBd0NTO0FBQ2QsUUFBTU4sWUFBWSxHQUFHdkIsRUFBRSxDQUFDd0IsV0FBSCxDQUFlLEtBQUtmLGlCQUFwQixDQUFyQjtBQUNBYyxJQUFBQSxZQUFZLENBQUNFLE1BQWIsR0FBc0IsS0FBS0MsSUFBM0I7QUFDQUgsSUFBQUEsWUFBWSxDQUFDSSxNQUFiLEdBQXNCLEdBQXRCO0FBQ0QsR0E1Q007QUE2Q1BHLEVBQUFBLFVBN0NPLHdCQTZDTTtBQUNYQyxJQUFBQSxLQUFLLENBQUMsTUFBRCxDQUFMO0FBQ0Q7QUEvQ00sQ0FBVCIsInNvdXJjZVJvb3QiOiIuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc2NyaXB0c1xcaGFsbHNjZW5lIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG15Z2xvYmFsIGZyb20gXCIuLi9teWdvbGJhbC5qc1wiXHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICBwcm9wZXJ0aWVzOiB7XHJcbiAgICBuaWNrbmFtZV9sYWJlbDogY2MuTGFiZWwsXHJcbiAgICBoZWFkaW1hZ2U6IGNjLlNwcml0ZSxcclxuICAgIGdvYmFsX2NvdW50OiBjYy5MYWJlbCxcclxuICAgIGNyZWF0cm9vbV9wcmVmYWJzOiBjYy5QcmVmYWIsXHJcbiAgICBqb2lucm9vbV9wcmVmYWJzOiBjYy5QcmVmYWIsXHJcbiAgfSxcclxuXHJcbiAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XHJcblxyXG4gIG9uTG9hZCgpIHtcclxuICAgIHRoaXMubmlja25hbWVfbGFiZWwuc3RyaW5nID0gbXlnbG9iYWwucGxheWVyRGF0YS51c2VyTmFtZVxyXG4gICAgY2MuZGlyZWN0b3IucHJlbG9hZFNjZW5lKFwiZ2FtZVNjZW5lXCIpXHJcbiAgfSxcclxuXHJcbiAgc3RhcnQoKSB7XHJcblxyXG4gIH0sXHJcblxyXG4gIC8vIHVwZGF0ZSAoZHQpIHt9LFxyXG5cclxuICBvbkJ1dHRvbkNsaWNrKGV2ZW50LCBjdXN0b21EYXRhKSB7XHJcbiAgICBzd2l0Y2ggKGN1c3RvbURhdGEpIHtcclxuICAgICAgY2FzZSBcImNyZWF0ZV9yb29tXCI6XHJcbiAgICAgICAgdmFyIGNyZWF0b3JfUm9vbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuY3JlYXRyb29tX3ByZWZhYnMpXHJcbiAgICAgICAgY3JlYXRvcl9Sb29tLnBhcmVudCA9IHRoaXMubm9kZVxyXG4gICAgICAgIGNyZWF0b3JfUm9vbS56SW5kZXggPSAxMDBcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIFwiam9pbl9yb29tXCI6XHJcbiAgICAgICAgdmFyIGpvaW5fUm9vbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuam9pbnJvb21fcHJlZmFicylcclxuICAgICAgICBqb2luX1Jvb20ucGFyZW50ID0gdGhpcy5ub2RlXHJcbiAgICAgICAgam9pbl9Sb29tLnpJbmRleCA9IDEwMFxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICB9LFxyXG4gIG9uQnRuSmluZ2RpYW4oKSB7XHJcbiAgICBjb25zdCBjcmVhdG9yX1Jvb20gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmNyZWF0cm9vbV9wcmVmYWJzKVxyXG4gICAgY3JlYXRvcl9Sb29tLnBhcmVudCA9IHRoaXMubm9kZVxyXG4gICAgY3JlYXRvcl9Sb29tLnpJbmRleCA9IDEwMFxyXG4gIH0sXHJcbiAgb25CdG5MYWl6aSgpIHtcclxuICAgIGFsZXJ0KCfmmoLmnKrlvIDmlL4nKVxyXG4gIH1cclxufSk7XHJcbiJdfQ==