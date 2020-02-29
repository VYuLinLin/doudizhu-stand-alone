
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/gameScene/prefabs/card.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '2afe8rz92BOl7CbQfKSCoLh', 'card');
// scripts/gameScene/prefabs/card.js

"use strict";

var _mygolbal = _interopRequireDefault(require("../../mygolbal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ddzData = require('ddzData');

var ddzConstants = require('ddzConstants');

cc.Class({
  "extends": cc.Component,
  properties: {
    cards_sprite_atlas: cc.SpriteAtlas
  },
  onLoad: function onLoad() {
    this.flag = false;
    this.offset_y = 20;
    this.node.on("reset_card_flag", function (event) {
      if (this.flag) {
        this.flag = false;
        this.node.y -= this.offset_y;
      }
    }.bind(this)); // this.node.on("chu_card_succ",function(event){
    //    var chu_card_list = event
    //    for(var i=0;i<chu_card_list.length;i++){
    //     if(chu_card_list[i].caardIndex==this.caardIndex){
    //         //this.runToCenter(chu_card_list[i])
    //         //this.node.destory()
    //     }
    //    }
    // }.bind(this))
  },
  runToCenter: function runToCenter() {//移动到屏幕中间，并带一个牌缩小的效果
  },
  start: function start() {},
  init_data: function init_data(data) {},
  setTouchEvent: function setTouchEvent() {
    if (this.userId == _mygolbal["default"].playerData.userId) {
      this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
        // var gameScene_node = this.node.parent
        // var room_state = gameScene_node.getComponent("gameScene").roomstate
        if (ddzData.gameState === ddzConstants.gameState.PLAYING) {
          console.log("TOUCH_START id:" + this.caardIndex);

          if (!this.flag) {
            this.flag = true;
            this.node.y += this.offset_y; //通知gameui层选定的牌
            // var carddata = {
            //   "index": this.caardIndex,
            //   "card_data": this.card_data,
            // }
            // gameScene_node.emit("choose_card_event", this.card_data)

            $socket.emit('_chooseCard', this.card_data);
          } else {
            this.flag = false;
            this.node.y -= this.offset_y; //通知gameUI取消了那张牌

            $socket.emit('_unchooseCard', this.caardIndex); // gameScene_node.emit("unchoose_card_event", this.caardIndex)
          }
        }
      }.bind(this));
    }
  },
  showCards: function showCards(card, userId) {
    //card.index是服务器生成card给对象设置的一副牌里唯一id
    this.caardIndex = card.index; //传入参数 card={"value":5,"shape":1,"index":20}

    this.card_data = card;

    if (userId) {
      this.userId = userId; //标识card属于的玩家
    } //服务器返回的是key(A-K),value对应的是资源的编号


    var cardValue = {
      "12": 1,
      "13": 2,
      "1": 3,
      "2": 4,
      "3": 5,
      "4": 6,
      "5": 7,
      "6": 8,
      "7": 9,
      "8": 10,
      "9": 11,
      "10": 12,
      "11": 13
    }; // 黑桃： spade
    // 红桃： heart
    // 梅花： club
    // 方片： diamond
    // const CardShape = {
    //     "S": 1,
    //     "H": 2,
    //     "C": 3,
    //     "D": 4,
    // };

    var cardShape = {
      "1": 3,
      "2": 2,
      "3": 1,
      "4": 0
    };
    var kings = {
      "14": 54,
      "15": 53
    };
    var spriteKey = '';

    if (card.shape) {
      spriteKey = 'card_' + (cardShape[card.shape] * 13 + cardValue[card.value]);
    } else {
      spriteKey = 'card_' + kings[card.king];
    }

    this.node.getComponent(cc.Sprite).spriteFrame = this.cards_sprite_atlas.getSpriteFrame(spriteKey);
    this.setTouchEvent();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc2NyaXB0c1xcZ2FtZVNjZW5lXFxwcmVmYWJzLy4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc2NyaXB0c1xcZ2FtZVNjZW5lXFxwcmVmYWJzL2Fzc2V0c1xcc2NyaXB0c1xcZ2FtZVNjZW5lXFxwcmVmYWJzXFxjYXJkLmpzIl0sIm5hbWVzIjpbImRkekRhdGEiLCJyZXF1aXJlIiwiZGR6Q29uc3RhbnRzIiwiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJjYXJkc19zcHJpdGVfYXRsYXMiLCJTcHJpdGVBdGxhcyIsIm9uTG9hZCIsImZsYWciLCJvZmZzZXRfeSIsIm5vZGUiLCJvbiIsImV2ZW50IiwieSIsImJpbmQiLCJydW5Ub0NlbnRlciIsInN0YXJ0IiwiaW5pdF9kYXRhIiwiZGF0YSIsInNldFRvdWNoRXZlbnQiLCJ1c2VySWQiLCJteWdsb2JhbCIsInBsYXllckRhdGEiLCJOb2RlIiwiRXZlbnRUeXBlIiwiVE9VQ0hfU1RBUlQiLCJnYW1lU3RhdGUiLCJQTEFZSU5HIiwiY29uc29sZSIsImxvZyIsImNhYXJkSW5kZXgiLCIkc29ja2V0IiwiZW1pdCIsImNhcmRfZGF0YSIsInNob3dDYXJkcyIsImNhcmQiLCJpbmRleCIsImNhcmRWYWx1ZSIsImNhcmRTaGFwZSIsImtpbmdzIiwic3ByaXRlS2V5Iiwic2hhcGUiLCJ2YWx1ZSIsImtpbmciLCJnZXRDb21wb25lbnQiLCJTcHJpdGUiLCJzcHJpdGVGcmFtZSIsImdldFNwcml0ZUZyYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0EsSUFBTUEsT0FBTyxHQUFHQyxPQUFPLENBQUMsU0FBRCxDQUF2Qjs7QUFDQSxJQUFNQyxZQUFZLEdBQUdELE9BQU8sQ0FBQyxjQUFELENBQTVCOztBQUVBRSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNQLGFBQVNELEVBQUUsQ0FBQ0UsU0FETDtBQUdQQyxFQUFBQSxVQUFVLEVBQUU7QUFDVkMsSUFBQUEsa0JBQWtCLEVBQUVKLEVBQUUsQ0FBQ0s7QUFEYixHQUhMO0FBUVBDLEVBQUFBLE1BUk8sb0JBUUU7QUFDUCxTQUFLQyxJQUFMLEdBQVksS0FBWjtBQUNBLFNBQUtDLFFBQUwsR0FBZ0IsRUFBaEI7QUFFQSxTQUFLQyxJQUFMLENBQVVDLEVBQVYsQ0FBYSxpQkFBYixFQUFnQyxVQUFVQyxLQUFWLEVBQWlCO0FBQy9DLFVBQUksS0FBS0osSUFBVCxFQUFlO0FBQ2IsYUFBS0EsSUFBTCxHQUFZLEtBQVo7QUFDQSxhQUFLRSxJQUFMLENBQVVHLENBQVYsSUFBZSxLQUFLSixRQUFwQjtBQUNEO0FBQ0YsS0FMK0IsQ0FLOUJLLElBTDhCLENBS3pCLElBTHlCLENBQWhDLEVBSk8sQ0FXUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRCxHQTVCTTtBQThCUEMsRUFBQUEsV0E5Qk8seUJBOEJPLENBQ1o7QUFDRCxHQWhDTTtBQWlDUEMsRUFBQUEsS0FqQ08sbUJBaUNDLENBRVAsQ0FuQ007QUFxQ1BDLEVBQUFBLFNBckNPLHFCQXFDR0MsSUFyQ0gsRUFxQ1MsQ0FFZixDQXZDTTtBQXdDUEMsRUFBQUEsYUF4Q08sMkJBd0NTO0FBQ2QsUUFBSSxLQUFLQyxNQUFMLElBQWVDLHFCQUFTQyxVQUFULENBQW9CRixNQUF2QyxFQUErQztBQUM3QyxXQUFLVixJQUFMLENBQVVDLEVBQVYsQ0FBYVYsRUFBRSxDQUFDc0IsSUFBSCxDQUFRQyxTQUFSLENBQWtCQyxXQUEvQixFQUE0QyxVQUFVYixLQUFWLEVBQWlCO0FBQzNEO0FBQ0E7QUFDQSxZQUFJZCxPQUFPLENBQUM0QixTQUFSLEtBQXNCMUIsWUFBWSxDQUFDMEIsU0FBYixDQUF1QkMsT0FBakQsRUFBMEQ7QUFDeERDLFVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLG9CQUFvQixLQUFLQyxVQUFyQzs7QUFDQSxjQUFJLENBQUMsS0FBS3RCLElBQVYsRUFBZ0I7QUFDZCxpQkFBS0EsSUFBTCxHQUFZLElBQVo7QUFDQSxpQkFBS0UsSUFBTCxDQUFVRyxDQUFWLElBQWUsS0FBS0osUUFBcEIsQ0FGYyxDQUdkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQXNCLFlBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLGFBQWIsRUFBNEIsS0FBS0MsU0FBakM7QUFDRCxXQVZELE1BVU87QUFDTCxpQkFBS3pCLElBQUwsR0FBWSxLQUFaO0FBQ0EsaUJBQUtFLElBQUwsQ0FBVUcsQ0FBVixJQUFlLEtBQUtKLFFBQXBCLENBRkssQ0FHTDs7QUFDQXNCLFlBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLGVBQWIsRUFBOEIsS0FBS0YsVUFBbkMsRUFKSyxDQUtMO0FBQ0Q7QUFDRjtBQUNGLE9BdkIyQyxDQXVCMUNoQixJQXZCMEMsQ0F1QnJDLElBdkJxQyxDQUE1QztBQXdCRDtBQUNGLEdBbkVNO0FBb0VQb0IsRUFBQUEsU0FwRU8scUJBb0VHQyxJQXBFSCxFQW9FU2YsTUFwRVQsRUFvRWlCO0FBQ3RCO0FBQ0EsU0FBS1UsVUFBTCxHQUFrQkssSUFBSSxDQUFDQyxLQUF2QixDQUZzQixDQUd0Qjs7QUFDQSxTQUFLSCxTQUFMLEdBQWlCRSxJQUFqQjs7QUFDQSxRQUFJZixNQUFKLEVBQVk7QUFDVixXQUFLQSxNQUFMLEdBQWNBLE1BQWQsQ0FEVSxDQUNXO0FBQ3RCLEtBUHFCLENBUXRCOzs7QUFDQSxRQUFNaUIsU0FBUyxHQUFHO0FBQ2hCLFlBQU0sQ0FEVTtBQUVoQixZQUFNLENBRlU7QUFHaEIsV0FBSyxDQUhXO0FBSWhCLFdBQUssQ0FKVztBQUtoQixXQUFLLENBTFc7QUFNaEIsV0FBSyxDQU5XO0FBT2hCLFdBQUssQ0FQVztBQVFoQixXQUFLLENBUlc7QUFTaEIsV0FBSyxDQVRXO0FBVWhCLFdBQUssRUFWVztBQVdoQixXQUFLLEVBWFc7QUFZaEIsWUFBTSxFQVpVO0FBYWhCLFlBQU07QUFiVSxLQUFsQixDQVRzQixDQXlCdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsUUFBTUMsU0FBUyxHQUFHO0FBQ2hCLFdBQUssQ0FEVztBQUVoQixXQUFLLENBRlc7QUFHaEIsV0FBSyxDQUhXO0FBSWhCLFdBQUs7QUFKVyxLQUFsQjtBQU1BLFFBQU1DLEtBQUssR0FBRztBQUNaLFlBQU0sRUFETTtBQUVaLFlBQU07QUFGTSxLQUFkO0FBS0EsUUFBSUMsU0FBUyxHQUFHLEVBQWhCOztBQUNBLFFBQUlMLElBQUksQ0FBQ00sS0FBVCxFQUFnQjtBQUNkRCxNQUFBQSxTQUFTLEdBQUcsV0FBV0YsU0FBUyxDQUFDSCxJQUFJLENBQUNNLEtBQU4sQ0FBVCxHQUF3QixFQUF4QixHQUE2QkosU0FBUyxDQUFDRixJQUFJLENBQUNPLEtBQU4sQ0FBakQsQ0FBWjtBQUNELEtBRkQsTUFFTztBQUNMRixNQUFBQSxTQUFTLEdBQUcsVUFBVUQsS0FBSyxDQUFDSixJQUFJLENBQUNRLElBQU4sQ0FBM0I7QUFDRDs7QUFFRCxTQUFLakMsSUFBTCxDQUFVa0MsWUFBVixDQUF1QjNDLEVBQUUsQ0FBQzRDLE1BQTFCLEVBQWtDQyxXQUFsQyxHQUFnRCxLQUFLekMsa0JBQUwsQ0FBd0IwQyxjQUF4QixDQUF1Q1AsU0FBdkMsQ0FBaEQ7QUFDQSxTQUFLckIsYUFBTDtBQUNEO0FBM0hNLENBQVQiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxnYW1lU2NlbmVcXHByZWZhYnMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbXlnbG9iYWwgZnJvbSBcIi4uLy4uL215Z29sYmFsLmpzXCJcclxuY29uc3QgZGR6RGF0YSA9IHJlcXVpcmUoJ2RkekRhdGEnKVxyXG5jb25zdCBkZHpDb25zdGFudHMgPSByZXF1aXJlKCdkZHpDb25zdGFudHMnKVxyXG5cclxuY2MuQ2xhc3Moe1xyXG4gIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgcHJvcGVydGllczoge1xyXG4gICAgY2FyZHNfc3ByaXRlX2F0bGFzOiBjYy5TcHJpdGVBdGxhcyxcclxuXHJcbiAgfSxcclxuXHJcbiAgb25Mb2FkKCkge1xyXG4gICAgdGhpcy5mbGFnID0gZmFsc2VcclxuICAgIHRoaXMub2Zmc2V0X3kgPSAyMFxyXG5cclxuICAgIHRoaXMubm9kZS5vbihcInJlc2V0X2NhcmRfZmxhZ1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgaWYgKHRoaXMuZmxhZykge1xyXG4gICAgICAgIHRoaXMuZmxhZyA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5ub2RlLnkgLT0gdGhpcy5vZmZzZXRfeVxyXG4gICAgICB9XHJcbiAgICB9LmJpbmQodGhpcykpXHJcblxyXG4gICAgLy8gdGhpcy5ub2RlLm9uKFwiY2h1X2NhcmRfc3VjY1wiLGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgIC8vICAgIHZhciBjaHVfY2FyZF9saXN0ID0gZXZlbnRcclxuICAgIC8vICAgIGZvcih2YXIgaT0wO2k8Y2h1X2NhcmRfbGlzdC5sZW5ndGg7aSsrKXtcclxuICAgIC8vICAgICBpZihjaHVfY2FyZF9saXN0W2ldLmNhYXJkSW5kZXg9PXRoaXMuY2FhcmRJbmRleCl7XHJcbiAgICAvLyAgICAgICAgIC8vdGhpcy5ydW5Ub0NlbnRlcihjaHVfY2FyZF9saXN0W2ldKVxyXG4gICAgLy8gICAgICAgICAvL3RoaXMubm9kZS5kZXN0b3J5KClcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyAgICB9XHJcbiAgICAvLyB9LmJpbmQodGhpcykpXHJcbiAgfSxcclxuXHJcbiAgcnVuVG9DZW50ZXIoKSB7XHJcbiAgICAvL+enu+WKqOWIsOWxj+W5leS4remXtO+8jOW5tuW4puS4gOS4queJjOe8qeWwj+eahOaViOaenFxyXG4gIH0sXHJcbiAgc3RhcnQoKSB7XHJcblxyXG4gIH0sXHJcblxyXG4gIGluaXRfZGF0YShkYXRhKSB7XHJcblxyXG4gIH0sXHJcbiAgc2V0VG91Y2hFdmVudCgpIHtcclxuICAgIGlmICh0aGlzLnVzZXJJZCA9PSBteWdsb2JhbC5wbGF5ZXJEYXRhLnVzZXJJZCkge1xyXG4gICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIC8vIHZhciBnYW1lU2NlbmVfbm9kZSA9IHRoaXMubm9kZS5wYXJlbnRcclxuICAgICAgICAvLyB2YXIgcm9vbV9zdGF0ZSA9IGdhbWVTY2VuZV9ub2RlLmdldENvbXBvbmVudChcImdhbWVTY2VuZVwiKS5yb29tc3RhdGVcclxuICAgICAgICBpZiAoZGR6RGF0YS5nYW1lU3RhdGUgPT09IGRkekNvbnN0YW50cy5nYW1lU3RhdGUuUExBWUlORykge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJUT1VDSF9TVEFSVCBpZDpcIiArIHRoaXMuY2FhcmRJbmRleClcclxuICAgICAgICAgIGlmICghdGhpcy5mbGFnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmxhZyA9IHRydWVcclxuICAgICAgICAgICAgdGhpcy5ub2RlLnkgKz0gdGhpcy5vZmZzZXRfeVxyXG4gICAgICAgICAgICAvL+mAmuefpWdhbWV1aeWxgumAieWumueahOeJjFxyXG4gICAgICAgICAgICAvLyB2YXIgY2FyZGRhdGEgPSB7XHJcbiAgICAgICAgICAgIC8vICAgXCJpbmRleFwiOiB0aGlzLmNhYXJkSW5kZXgsXHJcbiAgICAgICAgICAgIC8vICAgXCJjYXJkX2RhdGFcIjogdGhpcy5jYXJkX2RhdGEsXHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgLy8gZ2FtZVNjZW5lX25vZGUuZW1pdChcImNob29zZV9jYXJkX2V2ZW50XCIsIHRoaXMuY2FyZF9kYXRhKVxyXG4gICAgICAgICAgICAkc29ja2V0LmVtaXQoJ19jaG9vc2VDYXJkJywgdGhpcy5jYXJkX2RhdGEpXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmZsYWcgPSBmYWxzZVxyXG4gICAgICAgICAgICB0aGlzLm5vZGUueSAtPSB0aGlzLm9mZnNldF95XHJcbiAgICAgICAgICAgIC8v6YCa55+lZ2FtZVVJ5Y+W5raI5LqG6YKj5byg54mMXHJcbiAgICAgICAgICAgICRzb2NrZXQuZW1pdCgnX3VuY2hvb3NlQ2FyZCcsIHRoaXMuY2FhcmRJbmRleClcclxuICAgICAgICAgICAgLy8gZ2FtZVNjZW5lX25vZGUuZW1pdChcInVuY2hvb3NlX2NhcmRfZXZlbnRcIiwgdGhpcy5jYWFyZEluZGV4KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfS5iaW5kKHRoaXMpKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgc2hvd0NhcmRzKGNhcmQsIHVzZXJJZCkge1xyXG4gICAgLy9jYXJkLmluZGV45piv5pyN5Yqh5Zmo55Sf5oiQY2FyZOe7meWvueixoeiuvue9rueahOS4gOWJr+eJjOmHjOWUr+S4gGlkXHJcbiAgICB0aGlzLmNhYXJkSW5kZXggPSBjYXJkLmluZGV4XHJcbiAgICAvL+S8oOWFpeWPguaVsCBjYXJkPXtcInZhbHVlXCI6NSxcInNoYXBlXCI6MSxcImluZGV4XCI6MjB9XHJcbiAgICB0aGlzLmNhcmRfZGF0YSA9IGNhcmRcclxuICAgIGlmICh1c2VySWQpIHtcclxuICAgICAgdGhpcy51c2VySWQgPSB1c2VySWQgLy/moIfor4ZjYXJk5bGe5LqO55qE546p5a62XHJcbiAgICB9XHJcbiAgICAvL+acjeWKoeWZqOi/lOWbnueahOaYr2tleShBLUspLHZhbHVl5a+55bqU55qE5piv6LWE5rqQ55qE57yW5Y+3XHJcbiAgICBjb25zdCBjYXJkVmFsdWUgPSB7XHJcbiAgICAgIFwiMTJcIjogMSxcclxuICAgICAgXCIxM1wiOiAyLFxyXG4gICAgICBcIjFcIjogMyxcclxuICAgICAgXCIyXCI6IDQsXHJcbiAgICAgIFwiM1wiOiA1LFxyXG4gICAgICBcIjRcIjogNixcclxuICAgICAgXCI1XCI6IDcsXHJcbiAgICAgIFwiNlwiOiA4LFxyXG4gICAgICBcIjdcIjogOSxcclxuICAgICAgXCI4XCI6IDEwLFxyXG4gICAgICBcIjlcIjogMTEsXHJcbiAgICAgIFwiMTBcIjogMTIsXHJcbiAgICAgIFwiMTFcIjogMTNcclxuICAgIH07XHJcblxyXG4gICAgLy8g6buR5qGD77yaIHNwYWRlXHJcbiAgICAvLyDnuqLmoYPvvJogaGVhcnRcclxuICAgIC8vIOaiheiKse+8miBjbHViXHJcbiAgICAvLyDmlrnniYfvvJogZGlhbW9uZFxyXG4gICAgLy8gY29uc3QgQ2FyZFNoYXBlID0ge1xyXG4gICAgLy8gICAgIFwiU1wiOiAxLFxyXG4gICAgLy8gICAgIFwiSFwiOiAyLFxyXG4gICAgLy8gICAgIFwiQ1wiOiAzLFxyXG4gICAgLy8gICAgIFwiRFwiOiA0LFxyXG4gICAgLy8gfTtcclxuICAgIGNvbnN0IGNhcmRTaGFwZSA9IHtcclxuICAgICAgXCIxXCI6IDMsXHJcbiAgICAgIFwiMlwiOiAyLFxyXG4gICAgICBcIjNcIjogMSxcclxuICAgICAgXCI0XCI6IDBcclxuICAgIH07XHJcbiAgICBjb25zdCBraW5ncyA9IHtcclxuICAgICAgXCIxNFwiOiA1NCxcclxuICAgICAgXCIxNVwiOiA1M1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgc3ByaXRlS2V5ID0gJyc7XHJcbiAgICBpZiAoY2FyZC5zaGFwZSkge1xyXG4gICAgICBzcHJpdGVLZXkgPSAnY2FyZF8nICsgKGNhcmRTaGFwZVtjYXJkLnNoYXBlXSAqIDEzICsgY2FyZFZhbHVlW2NhcmQudmFsdWVdKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHNwcml0ZUtleSA9ICdjYXJkXycgKyBraW5nc1tjYXJkLmtpbmddO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubm9kZS5nZXRDb21wb25lbnQoY2MuU3ByaXRlKS5zcHJpdGVGcmFtZSA9IHRoaXMuY2FyZHNfc3ByaXRlX2F0bGFzLmdldFNwcml0ZUZyYW1lKHNwcml0ZUtleSlcclxuICAgIHRoaXMuc2V0VG91Y2hFdmVudCgpXHJcbiAgfVxyXG59KTtcclxuIl19