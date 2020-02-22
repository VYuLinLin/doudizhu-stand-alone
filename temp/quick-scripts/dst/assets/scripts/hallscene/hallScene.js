
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxoYWxsc2NlbmUvLi5cXC4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHNjcmlwdHNcXGhhbGxzY2VuZS9hc3NldHNcXHNjcmlwdHNcXGhhbGxzY2VuZVxcaGFsbFNjZW5lLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwibmlja25hbWVfbGFiZWwiLCJMYWJlbCIsImhlYWRpbWFnZSIsIlNwcml0ZSIsImdvYmFsX2NvdW50IiwiY3JlYXRyb29tX3ByZWZhYnMiLCJQcmVmYWIiLCJqb2lucm9vbV9wcmVmYWJzIiwib25Mb2FkIiwic3RyaW5nIiwibXlnbG9iYWwiLCJwbGF5ZXJEYXRhIiwidXNlck5hbWUiLCJzdGFydCIsIm9uQnV0dG9uQ2xpY2siLCJldmVudCIsImN1c3RvbURhdGEiLCJjcmVhdG9yX1Jvb20iLCJpbnN0YW50aWF0ZSIsInBhcmVudCIsIm5vZGUiLCJ6SW5kZXgiLCJqb2luX1Jvb20iLCJvbkJ0bkppbmdkaWFuIiwib25CdG5MYWl6aSIsImFsZXJ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBRUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ1AsYUFBU0QsRUFBRSxDQUFDRSxTQURMO0FBR1BDLEVBQUFBLFVBQVUsRUFBRTtBQUNWQyxJQUFBQSxjQUFjLEVBQUVKLEVBQUUsQ0FBQ0ssS0FEVDtBQUVWQyxJQUFBQSxTQUFTLEVBQUVOLEVBQUUsQ0FBQ08sTUFGSjtBQUdWQyxJQUFBQSxXQUFXLEVBQUVSLEVBQUUsQ0FBQ0ssS0FITjtBQUlWSSxJQUFBQSxpQkFBaUIsRUFBRVQsRUFBRSxDQUFDVSxNQUpaO0FBS1ZDLElBQUFBLGdCQUFnQixFQUFFWCxFQUFFLENBQUNVO0FBTFgsR0FITDtBQVdQO0FBRUFFLEVBQUFBLE1BYk8sb0JBYUU7QUFDUCxTQUFLUixjQUFMLENBQW9CUyxNQUFwQixHQUE2QkMscUJBQVNDLFVBQVQsQ0FBb0JDLFFBQWpEO0FBQ0QsR0FmTTtBQWlCUEMsRUFBQUEsS0FqQk8sbUJBaUJDLENBRVAsQ0FuQk07QUFxQlA7QUFFQUMsRUFBQUEsYUF2Qk8seUJBdUJPQyxLQXZCUCxFQXVCY0MsVUF2QmQsRUF1QjBCO0FBQy9CLFlBQVFBLFVBQVI7QUFDRSxXQUFLLGFBQUw7QUFDRSxZQUFJQyxZQUFZLEdBQUdyQixFQUFFLENBQUNzQixXQUFILENBQWUsS0FBS2IsaUJBQXBCLENBQW5CO0FBQ0FZLFFBQUFBLFlBQVksQ0FBQ0UsTUFBYixHQUFzQixLQUFLQyxJQUEzQjtBQUNBSCxRQUFBQSxZQUFZLENBQUNJLE1BQWIsR0FBc0IsR0FBdEI7QUFDQTs7QUFDRixXQUFLLFdBQUw7QUFDRSxZQUFJQyxTQUFTLEdBQUcxQixFQUFFLENBQUNzQixXQUFILENBQWUsS0FBS1gsZ0JBQXBCLENBQWhCO0FBQ0FlLFFBQUFBLFNBQVMsQ0FBQ0gsTUFBVixHQUFtQixLQUFLQyxJQUF4QjtBQUNBRSxRQUFBQSxTQUFTLENBQUNELE1BQVYsR0FBbUIsR0FBbkI7QUFDQTs7QUFDRjtBQUNFO0FBWko7QUFjRCxHQXRDTTtBQXVDUEUsRUFBQUEsYUF2Q08sMkJBdUNTO0FBQ2QsUUFBTU4sWUFBWSxHQUFHckIsRUFBRSxDQUFDc0IsV0FBSCxDQUFlLEtBQUtiLGlCQUFwQixDQUFyQjtBQUNBWSxJQUFBQSxZQUFZLENBQUNFLE1BQWIsR0FBc0IsS0FBS0MsSUFBM0I7QUFDQUgsSUFBQUEsWUFBWSxDQUFDSSxNQUFiLEdBQXNCLEdBQXRCO0FBQ0QsR0EzQ007QUE0Q1BHLEVBQUFBLFVBNUNPLHdCQTRDTTtBQUNYQyxJQUFBQSxLQUFLLENBQUMsTUFBRCxDQUFMO0FBQ0Q7QUE5Q00sQ0FBVCIsInNvdXJjZVJvb3QiOiIuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc2NyaXB0c1xcaGFsbHNjZW5lIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG15Z2xvYmFsIGZyb20gXCIuLi9teWdvbGJhbC5qc1wiXHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICBwcm9wZXJ0aWVzOiB7XHJcbiAgICBuaWNrbmFtZV9sYWJlbDogY2MuTGFiZWwsXHJcbiAgICBoZWFkaW1hZ2U6IGNjLlNwcml0ZSxcclxuICAgIGdvYmFsX2NvdW50OiBjYy5MYWJlbCxcclxuICAgIGNyZWF0cm9vbV9wcmVmYWJzOiBjYy5QcmVmYWIsXHJcbiAgICBqb2lucm9vbV9wcmVmYWJzOiBjYy5QcmVmYWIsXHJcbiAgfSxcclxuXHJcbiAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XHJcblxyXG4gIG9uTG9hZCgpIHtcclxuICAgIHRoaXMubmlja25hbWVfbGFiZWwuc3RyaW5nID0gbXlnbG9iYWwucGxheWVyRGF0YS51c2VyTmFtZVxyXG4gIH0sXHJcblxyXG4gIHN0YXJ0KCkge1xyXG5cclxuICB9LFxyXG5cclxuICAvLyB1cGRhdGUgKGR0KSB7fSxcclxuXHJcbiAgb25CdXR0b25DbGljayhldmVudCwgY3VzdG9tRGF0YSkge1xyXG4gICAgc3dpdGNoIChjdXN0b21EYXRhKSB7XHJcbiAgICAgIGNhc2UgXCJjcmVhdGVfcm9vbVwiOlxyXG4gICAgICAgIHZhciBjcmVhdG9yX1Jvb20gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmNyZWF0cm9vbV9wcmVmYWJzKVxyXG4gICAgICAgIGNyZWF0b3JfUm9vbS5wYXJlbnQgPSB0aGlzLm5vZGVcclxuICAgICAgICBjcmVhdG9yX1Jvb20uekluZGV4ID0gMTAwXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSBcImpvaW5fcm9vbVwiOlxyXG4gICAgICAgIHZhciBqb2luX1Jvb20gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmpvaW5yb29tX3ByZWZhYnMpXHJcbiAgICAgICAgam9pbl9Sb29tLnBhcmVudCA9IHRoaXMubm9kZVxyXG4gICAgICAgIGpvaW5fUm9vbS56SW5kZXggPSAxMDBcclxuICAgICAgICBicmVha1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgfSxcclxuICBvbkJ0bkppbmdkaWFuKCkge1xyXG4gICAgY29uc3QgY3JlYXRvcl9Sb29tID0gY2MuaW5zdGFudGlhdGUodGhpcy5jcmVhdHJvb21fcHJlZmFicylcclxuICAgIGNyZWF0b3JfUm9vbS5wYXJlbnQgPSB0aGlzLm5vZGVcclxuICAgIGNyZWF0b3JfUm9vbS56SW5kZXggPSAxMDBcclxuICB9LFxyXG4gIG9uQnRuTGFpemkoKSB7XHJcbiAgICBhbGVydCgn5pqC5pyq5byA5pS+JylcclxuICB9XHJcbn0pO1xyXG4iXX0=