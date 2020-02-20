
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
    this.nickname_label = _mygolbal["default"].playerData.nickName;
    this.gobal_count.string = ":" + _mygolbal["default"].playerData.gobal_count;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxoYWxsc2NlbmUvLi5cXC4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHNjcmlwdHNcXGhhbGxzY2VuZS9hc3NldHNcXHNjcmlwdHNcXGhhbGxzY2VuZVxcaGFsbFNjZW5lLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwibmlja25hbWVfbGFiZWwiLCJMYWJlbCIsImhlYWRpbWFnZSIsIlNwcml0ZSIsImdvYmFsX2NvdW50IiwiY3JlYXRyb29tX3ByZWZhYnMiLCJQcmVmYWIiLCJqb2lucm9vbV9wcmVmYWJzIiwib25Mb2FkIiwibXlnbG9iYWwiLCJwbGF5ZXJEYXRhIiwibmlja05hbWUiLCJzdHJpbmciLCJzdGFydCIsIm9uQnV0dG9uQ2xpY2siLCJldmVudCIsImN1c3RvbURhdGEiLCJjcmVhdG9yX1Jvb20iLCJpbnN0YW50aWF0ZSIsInBhcmVudCIsIm5vZGUiLCJ6SW5kZXgiLCJqb2luX1Jvb20iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFFQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDTCxhQUFTRCxFQUFFLENBQUNFLFNBRFA7QUFHTEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1JDLElBQUFBLGNBQWMsRUFBQ0osRUFBRSxDQUFDSyxLQURWO0FBRVJDLElBQUFBLFNBQVMsRUFBQ04sRUFBRSxDQUFDTyxNQUZMO0FBR1JDLElBQUFBLFdBQVcsRUFBQ1IsRUFBRSxDQUFDSyxLQUhQO0FBSVJJLElBQUFBLGlCQUFpQixFQUFDVCxFQUFFLENBQUNVLE1BSmI7QUFLUkMsSUFBQUEsZ0JBQWdCLEVBQUNYLEVBQUUsQ0FBQ1U7QUFMWixHQUhQO0FBV0w7QUFFQUUsRUFBQUEsTUFiSyxvQkFhSztBQUNQLFNBQUtSLGNBQUwsR0FBc0JTLHFCQUFTQyxVQUFULENBQW9CQyxRQUExQztBQUNBLFNBQUtQLFdBQUwsQ0FBaUJRLE1BQWpCLEdBQTBCLE1BQU1ILHFCQUFTQyxVQUFULENBQW9CTixXQUFwRDtBQUNELEdBaEJHO0FBa0JMUyxFQUFBQSxLQWxCSyxtQkFrQkksQ0FFUixDQXBCSTtBQXNCTDtBQUVBQyxFQUFBQSxhQXhCSyx5QkF3QlNDLEtBeEJULEVBd0JlQyxVQXhCZixFQXdCMEI7QUFDM0IsWUFBT0EsVUFBUDtBQUNJLFdBQUssYUFBTDtBQUNJLFlBQUlDLFlBQVksR0FBR3JCLEVBQUUsQ0FBQ3NCLFdBQUgsQ0FBZSxLQUFLYixpQkFBcEIsQ0FBbkI7QUFDQVksUUFBQUEsWUFBWSxDQUFDRSxNQUFiLEdBQXNCLEtBQUtDLElBQTNCO0FBQ0FILFFBQUFBLFlBQVksQ0FBQ0ksTUFBYixHQUFzQixHQUF0QjtBQUNBOztBQUNKLFdBQUssV0FBTDtBQUNJLFlBQUlDLFNBQVMsR0FBRzFCLEVBQUUsQ0FBQ3NCLFdBQUgsQ0FBZSxLQUFLWCxnQkFBcEIsQ0FBaEI7QUFDQWUsUUFBQUEsU0FBUyxDQUFDSCxNQUFWLEdBQW1CLEtBQUtDLElBQXhCO0FBQ0FFLFFBQUFBLFNBQVMsQ0FBQ0QsTUFBVixHQUFtQixHQUFuQjtBQUNBOztBQUNKO0FBQ0k7QUFaUjtBQWNIO0FBdkNJLENBQVQiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHNjcmlwdHNcXGhhbGxzY2VuZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBteWdsb2JhbCBmcm9tIFwiLi4vbXlnb2xiYWwuanNcIlxyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LCBcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgbmlja25hbWVfbGFiZWw6Y2MuTGFiZWwsXHJcbiAgICAgICAgaGVhZGltYWdlOmNjLlNwcml0ZSxcclxuICAgICAgICBnb2JhbF9jb3VudDpjYy5MYWJlbCxcclxuICAgICAgICBjcmVhdHJvb21fcHJlZmFiczpjYy5QcmVmYWIsXHJcbiAgICAgICAgam9pbnJvb21fcHJlZmFiczpjYy5QcmVmYWIsXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIExJRkUtQ1lDTEUgQ0FMTEJBQ0tTOlxyXG5cclxuICAgIG9uTG9hZCAoKSB7XHJcbiAgICAgICB0aGlzLm5pY2tuYW1lX2xhYmVsID0gbXlnbG9iYWwucGxheWVyRGF0YS5uaWNrTmFtZVxyXG4gICAgICAgdGhpcy5nb2JhbF9jb3VudC5zdHJpbmcgPSBcIjpcIiArIG15Z2xvYmFsLnBsYXllckRhdGEuZ29iYWxfY291bnRcclxuICAgICB9LFxyXG5cclxuICAgIHN0YXJ0ICgpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVwZGF0ZSAoZHQpIHt9LFxyXG5cclxuICAgIG9uQnV0dG9uQ2xpY2soZXZlbnQsY3VzdG9tRGF0YSl7XHJcbiAgICAgICAgc3dpdGNoKGN1c3RvbURhdGEpe1xyXG4gICAgICAgICAgICBjYXNlIFwiY3JlYXRlX3Jvb21cIjpcclxuICAgICAgICAgICAgICAgIHZhciBjcmVhdG9yX1Jvb20gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmNyZWF0cm9vbV9wcmVmYWJzKVxyXG4gICAgICAgICAgICAgICAgY3JlYXRvcl9Sb29tLnBhcmVudCA9IHRoaXMubm9kZSBcclxuICAgICAgICAgICAgICAgIGNyZWF0b3JfUm9vbS56SW5kZXggPSAxMDBcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgXCJqb2luX3Jvb21cIjpcclxuICAgICAgICAgICAgICAgIHZhciBqb2luX1Jvb20gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmpvaW5yb29tX3ByZWZhYnMpXHJcbiAgICAgICAgICAgICAgICBqb2luX1Jvb20ucGFyZW50ID0gdGhpcy5ub2RlIFxyXG4gICAgICAgICAgICAgICAgam9pbl9Sb29tLnpJbmRleCA9IDEwMFxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuIl19