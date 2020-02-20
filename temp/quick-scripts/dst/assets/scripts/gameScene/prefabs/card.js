
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

cc.Class({
  "extends": cc.Component,
  properties: {
    cards_sprite_atlas: cc.SpriteAtlas
  },
  onLoad: function onLoad() {
    this.flag = false;
    this.offset_y = 20;
    this.node.on("reset_card_flag", function (event) {
      if (this, flag == true) {
        this, flag = false;
        this.node.y -= this.offset_y;
      }
    }.bind(this)); // this.node.on("chu_card_succ",function(event){
    //    var chu_card_list = event
    //    for(var i=0;i<chu_card_list.length;i++){
    //     if(chu_card_list[i].card_id==this.card_id){
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
  // update (dt) {},
  setTouchEvent: function setTouchEvent() {
    if (this.accountid == _mygolbal["default"].playerData.accountID) {
      this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
        var gameScene_node = this.node.parent;
        var room_state = gameScene_node.getComponent("gameScene").roomstate;

        if (room_state == RoomState.ROOM_PLAYING) {
          console.log("TOUCH_START id:" + this.card_id);

          if (this.flag == false) {
            this.flag = true;
            this.node.y += this.offset_y; //通知gameui层选定的牌

            var carddata = {
              "cardid": this.card_id,
              "card_data": this.card_data
            };
            gameScene_node.emit("choose_card_event", carddata);
          } else {
            this.flag = false;
            this.node.y -= this.offset_y; //通知gameUI取消了那张牌

            gameScene_node.emit("unchoose_card_event", this.card_id);
          }
        }
      }.bind(this));
    }
  },
  showCards: function showCards(card, accountid) {
    //card.index是服务器生成card给对象设置的一副牌里唯一id
    this.card_id = card.index; //传入参数 card={"value":5,"shape":1,"index":20}

    this.card_data = card;

    if (accountid) {
      this.accountid = accountid; //标识card属于的玩家
    } //this.node.getComponent(cc.Sprite).spriteFrame = 
    //服务器定义牌的表示
    // const cardvalue = {
    //     "A": 12,
    //     "2": 13,
    //     "3": 1,
    //     "4": 2,
    //     "5": 3,
    //     "6": 4,
    //     "7": 5,
    //     "8": 6,
    //     "9": 7,
    //     "10": 8,
    //     "J": 9,
    //     "Q": 10,
    //     "K": 11,
    // }
    //服务器返回的是key,value对应的是资源的编号


    var CardValue = {
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
    }; // 黑桃：spade
    // 红桃：heart
    // 梅花：club
    // 方片：diamond
    // const CardShape = {
    //     "S": 1,
    //     "H": 2,
    //     "C": 3,
    //     "D": 4,
    // };

    var cardShpae = {
      "1": 3,
      "2": 2,
      "3": 1,
      "4": 0
    };
    var Kings = {
      "14": 54,
      "15": 53
    };
    var spriteKey = '';

    if (card.shape) {
      spriteKey = 'card_' + (cardShpae[card.shape] * 13 + CardValue[card.value]);
    } else {
      spriteKey = 'card_' + Kings[card.king];
    } // console.log("spriteKey"+spriteKey)


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc2NyaXB0c1xcZ2FtZVNjZW5lXFxwcmVmYWJzLy4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc2NyaXB0c1xcZ2FtZVNjZW5lXFxwcmVmYWJzL2Fzc2V0c1xcc2NyaXB0c1xcZ2FtZVNjZW5lXFxwcmVmYWJzXFxjYXJkLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiY2FyZHNfc3ByaXRlX2F0bGFzIiwiU3ByaXRlQXRsYXMiLCJvbkxvYWQiLCJmbGFnIiwib2Zmc2V0X3kiLCJub2RlIiwib24iLCJldmVudCIsInkiLCJiaW5kIiwicnVuVG9DZW50ZXIiLCJzdGFydCIsImluaXRfZGF0YSIsImRhdGEiLCJzZXRUb3VjaEV2ZW50IiwiYWNjb3VudGlkIiwibXlnbG9iYWwiLCJwbGF5ZXJEYXRhIiwiYWNjb3VudElEIiwiTm9kZSIsIkV2ZW50VHlwZSIsIlRPVUNIX1NUQVJUIiwiZ2FtZVNjZW5lX25vZGUiLCJwYXJlbnQiLCJyb29tX3N0YXRlIiwiZ2V0Q29tcG9uZW50Iiwicm9vbXN0YXRlIiwiUm9vbVN0YXRlIiwiUk9PTV9QTEFZSU5HIiwiY29uc29sZSIsImxvZyIsImNhcmRfaWQiLCJjYXJkZGF0YSIsImNhcmRfZGF0YSIsImVtaXQiLCJzaG93Q2FyZHMiLCJjYXJkIiwiaW5kZXgiLCJDYXJkVmFsdWUiLCJjYXJkU2hwYWUiLCJLaW5ncyIsInNwcml0ZUtleSIsInNoYXBlIiwidmFsdWUiLCJraW5nIiwiU3ByaXRlIiwic3ByaXRlRnJhbWUiLCJnZXRTcHJpdGVGcmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUVBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFDWEMsSUFBQUEsa0JBQWtCLEVBQUVKLEVBQUUsQ0FB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QU9kLFdBQUssQ0FQUztBQVFkLFdBQUssQ0FSUztBQVNkLFdBQUssQ0FUUztBQVVkLFdBQUssRUFWUztBQVdkLFdBQUssRUFYUztBQVlkLFlBQU0sRUFaUTtBQWFkLFlBQU07QUFiUSxLQUFsQixDQTdCcUIsQ0E2Q3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLFFBQU1DLFNBQVMsR0FBRztBQUNkLFdBQUssQ0FEUztBQUVkLFdBQUssQ0FGUztBQUdkLFdBQUssQ0FIUztBQUlkLFdBQUs7QUFKUyxLQUFsQjtBQU1BLFFBQU1DLEtBQUssR0FBRztBQUNWLFlBQU0sRUFESTtBQUVWLFlBQU07QUFGSSxLQUFkO0FBS0EsUUFBSUMsU0FBUyxHQUFHLEVBQWhCOztBQUNBLFFBQUlMLElBQUksQ0FBQ00sS0FBVCxFQUFlO0FBQ1hELE1BQUFBLFNBQVMsR0FBRyxXQUFXRixTQUFTLENBQUNILElBQUksQ0FBQ00sS0FBTixDQUFULEdBQXdCLEVBQXhCLEdBQTZCSixTQUFTLENBQUNGLElBQUksQ0FBQ08sS0FBTixDQUFqRCxDQUFaO0FBRUgsS0FIRCxNQUdNO0FBQ0ZGLE1BQUFBLFNBQVMsR0FBRyxVQUFVRCxLQUFLLENBQUNKLElBQUksQ0FBQ1EsSUFBTixDQUEzQjtBQUNILEtBeEVvQixDQTBFdEI7OztBQUNDLFNBQUt2QyxJQUFMLENBQVVvQixZQUFWLENBQXVCN0IsRUFBRSxDQUFDaUQsTUFBMUIsRUFBa0NDLFdBQWxDLEdBQWdELEtBQUs5QyxrQkFBTCxDQUF3QitDLGNBQXhCLENBQXVDTixTQUF2QyxDQUFoRDtBQUNBLFNBQUszQixhQUFMO0FBQ0g7QUFsSkksQ0FBVCIsInNvdXJjZVJvb3QiOiIuLlxcLi5cXC4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHNjcmlwdHNcXGdhbWVTY2VuZVxccHJlZmFicyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBteWdsb2JhbCBmcm9tIFwiLi4vLi4vbXlnb2xiYWwuanNcIlxyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICBjYXJkc19zcHJpdGVfYXRsYXM6IGNjLlNwcml0ZUF0bGFzLFxyXG4gICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICBvbkxvYWQgKCkge1xyXG4gICAgICAgIHRoaXMuZmxhZyA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5vZmZzZXRfeSA9IDIwXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKFwicmVzZXRfY2FyZF9mbGFnXCIsZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICAgICAgICBpZih0aGlzLGZsYWc9PXRydWUpe1xyXG4gICAgICAgICAgICAgICAgdGhpcyxmbGFnID0gZmFsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMubm9kZS55IC09IHRoaXMub2Zmc2V0X3lcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0uYmluZCh0aGlzKSlcclxuXHJcbiAgICAgICAgLy8gdGhpcy5ub2RlLm9uKFwiY2h1X2NhcmRfc3VjY1wiLGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgICAgICAvLyAgICB2YXIgY2h1X2NhcmRfbGlzdCA9IGV2ZW50XHJcbiAgICAgICAgLy8gICAgZm9yKHZhciBpPTA7aTxjaHVfY2FyZF9saXN0Lmxlbmd0aDtpKyspe1xyXG4gICAgICAgIC8vICAgICBpZihjaHVfY2FyZF9saXN0W2ldLmNhcmRfaWQ9PXRoaXMuY2FyZF9pZCl7XHJcbiAgICAgICAgLy8gICAgICAgICAvL3RoaXMucnVuVG9DZW50ZXIoY2h1X2NhcmRfbGlzdFtpXSlcclxuICAgICAgICAvLyAgICAgICAgIC8vdGhpcy5ub2RlLmRlc3RvcnkoKVxyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gICAgfVxyXG4gICAgICAgIC8vIH0uYmluZCh0aGlzKSlcclxuICAgIH0sXHJcblxyXG4gICAgcnVuVG9DZW50ZXIoKXtcclxuICAgICAgICAvL+enu+WKqOWIsOWxj+W5leS4remXtO+8jOW5tuW4puS4gOS4queJjOe8qeWwj+eahOaViOaenFxyXG4gICAgfSxcclxuICAgIHN0YXJ0ICgpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRfZGF0YShkYXRhKXtcclxuXHJcbiAgICB9LFxyXG4gICAgLy8gdXBkYXRlIChkdCkge30sXHJcbiAgICBzZXRUb3VjaEV2ZW50KCl7XHJcbiAgICAgICAgaWYodGhpcy5hY2NvdW50aWQ9PW15Z2xvYmFsLnBsYXllckRhdGEuYWNjb3VudElEKXtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgICAgICAgICAgICAgIHZhciBnYW1lU2NlbmVfbm9kZSA9IHRoaXMubm9kZS5wYXJlbnQgIFxyXG4gICAgICAgICAgICAgICAgdmFyIHJvb21fc3RhdGUgPSBnYW1lU2NlbmVfbm9kZS5nZXRDb21wb25lbnQoXCJnYW1lU2NlbmVcIikucm9vbXN0YXRlXHJcbiAgICAgICAgICAgICAgICBpZihyb29tX3N0YXRlPT1Sb29tU3RhdGUuUk9PTV9QTEFZSU5HKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRPVUNIX1NUQVJUIGlkOlwiK3RoaXMuY2FyZF9pZClcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmZsYWc9PWZhbHNlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mbGFnID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUueSArPSB0aGlzLm9mZnNldF95XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v6YCa55+lZ2FtZXVp5bGC6YCJ5a6a55qE54mMXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjYXJkZGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2FyZGlkXCI6dGhpcy5jYXJkX2lkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjYXJkX2RhdGFcIjp0aGlzLmNhcmRfZGF0YSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnYW1lU2NlbmVfbm9kZS5lbWl0KFwiY2hvb3NlX2NhcmRfZXZlbnRcIixjYXJkZGF0YSlcclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mbGFnPWZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS55IC09IHRoaXMub2Zmc2V0X3lcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy/pgJrnn6VnYW1lVUnlj5bmtojkuobpgqPlvKDniYxcclxuICAgICAgICAgICAgICAgICAgICAgICBnYW1lU2NlbmVfbm9kZS5lbWl0KFwidW5jaG9vc2VfY2FyZF9ldmVudFwiLHRoaXMuY2FyZF9pZClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSlcclxuICAgICAgICB9XHJcbiAgICAgICBcclxuICAgIH0sXHJcbiAgICBzaG93Q2FyZHMoY2FyZCxhY2NvdW50aWQpe1xyXG4gICAgICAgIC8vY2FyZC5pbmRleOaYr+acjeWKoeWZqOeUn+aIkGNhcmTnu5nlr7nosaHorr7nva7nmoTkuIDlia/niYzph4zllK/kuIBpZFxyXG4gICAgICAgIHRoaXMuY2FyZF9pZCA9IGNhcmQuaW5kZXhcclxuICAgICAgICAvL+S8oOWFpeWPguaVsCBjYXJkPXtcInZhbHVlXCI6NSxcInNoYXBlXCI6MSxcImluZGV4XCI6MjB9XHJcbiAgICAgICAgdGhpcy5jYXJkX2RhdGEgPSBjYXJkXHJcbiAgICAgICAgaWYoYWNjb3VudGlkKXtcclxuICAgICAgICAgICAgdGhpcy5hY2NvdW50aWQgPSBhY2NvdW50aWQgLy/moIfor4ZjYXJk5bGe5LqO55qE546p5a62XHJcbiAgICAgICAgfVxyXG4gICAgICAgXHJcbiAgICAgICAgLy90aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSkuc3ByaXRlRnJhbWUgPSBcclxuICAgICAgICAvL+acjeWKoeWZqOWumuS5ieeJjOeahOihqOekulxyXG4gICAgICAgIC8vIGNvbnN0IGNhcmR2YWx1ZSA9IHtcclxuICAgICAgICAvLyAgICAgXCJBXCI6IDEyLFxyXG4gICAgICAgIC8vICAgICBcIjJcIjogMTMsXHJcbiAgICAgICAgLy8gICAgIFwiM1wiOiAxLFxyXG4gICAgICAgIC8vICAgICBcIjRcIjogMixcclxuICAgICAgICAvLyAgICAgXCI1XCI6IDMsXHJcbiAgICAgICAgLy8gICAgIFwiNlwiOiA0LFxyXG4gICAgICAgIC8vICAgICBcIjdcIjogNSxcclxuICAgICAgICAvLyAgICAgXCI4XCI6IDYsXHJcbiAgICAgICAgLy8gICAgIFwiOVwiOiA3LFxyXG4gICAgICAgIC8vICAgICBcIjEwXCI6IDgsXHJcbiAgICAgICAgLy8gICAgIFwiSlwiOiA5LFxyXG4gICAgICAgIC8vICAgICBcIlFcIjogMTAsXHJcbiAgICAgICAgLy8gICAgIFwiS1wiOiAxMSxcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgXHJcbiAgICAgICBcclxuICAgICAgICAvL+acjeWKoeWZqOi/lOWbnueahOaYr2tleSx2YWx1ZeWvueW6lOeahOaYr+i1hOa6kOeahOe8luWPt1xyXG4gICAgICAgIGNvbnN0IENhcmRWYWx1ZSA9IHtcclxuICAgICAgICAgICAgXCIxMlwiOiAxLFxyXG4gICAgICAgICAgICBcIjEzXCI6IDIsXHJcbiAgICAgICAgICAgIFwiMVwiOiAzLFxyXG4gICAgICAgICAgICBcIjJcIjogNCxcclxuICAgICAgICAgICAgXCIzXCI6IDUsXHJcbiAgICAgICAgICAgIFwiNFwiOiA2LFxyXG4gICAgICAgICAgICBcIjVcIjogNyxcclxuICAgICAgICAgICAgXCI2XCI6IDgsXHJcbiAgICAgICAgICAgIFwiN1wiOiA5LFxyXG4gICAgICAgICAgICBcIjhcIjogMTAsXHJcbiAgICAgICAgICAgIFwiOVwiOiAxMSxcclxuICAgICAgICAgICAgXCIxMFwiOiAxMixcclxuICAgICAgICAgICAgXCIxMVwiOiAxM1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIOm7keahg++8mnNwYWRlXHJcbiAgICAgICAgLy8g57qi5qGD77yaaGVhcnRcclxuICAgICAgICAvLyDmooXoirHvvJpjbHViXHJcbiAgICAgICAgLy8g5pa554mH77yaZGlhbW9uZFxyXG4gICAgICAgIC8vIGNvbnN0IENhcmRTaGFwZSA9IHtcclxuICAgICAgICAvLyAgICAgXCJTXCI6IDEsXHJcbiAgICAgICAgLy8gICAgIFwiSFwiOiAyLFxyXG4gICAgICAgIC8vICAgICBcIkNcIjogMyxcclxuICAgICAgICAvLyAgICAgXCJEXCI6IDQsXHJcbiAgICAgICAgLy8gfTtcclxuICAgICAgICBjb25zdCBjYXJkU2hwYWUgPSB7XHJcbiAgICAgICAgICAgIFwiMVwiOiAzLFxyXG4gICAgICAgICAgICBcIjJcIjogMixcclxuICAgICAgICAgICAgXCIzXCI6IDEsXHJcbiAgICAgICAgICAgIFwiNFwiOiAwXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCBLaW5ncyA9IHtcclxuICAgICAgICAgICAgXCIxNFwiOiA1NCxcclxuICAgICAgICAgICAgXCIxNVwiOiA1M1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBzcHJpdGVLZXkgPSAnJztcclxuICAgICAgICBpZiAoY2FyZC5zaGFwZSl7XHJcbiAgICAgICAgICAgIHNwcml0ZUtleSA9ICdjYXJkXycgKyAoY2FyZFNocGFlW2NhcmQuc2hhcGVdICogMTMgKyBDYXJkVmFsdWVbY2FyZC52YWx1ZV0pO1xyXG5cclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIHNwcml0ZUtleSA9ICdjYXJkXycgKyBLaW5nc1tjYXJkLmtpbmddO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAvLyBjb25zb2xlLmxvZyhcInNwcml0ZUtleVwiK3Nwcml0ZUtleSlcclxuICAgICAgICB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSkuc3ByaXRlRnJhbWUgPSB0aGlzLmNhcmRzX3Nwcml0ZV9hdGxhcy5nZXRTcHJpdGVGcmFtZShzcHJpdGVLZXkpXHJcbiAgICAgICAgdGhpcy5zZXRUb3VjaEV2ZW50KClcclxuICAgIH1cclxufSk7XHJcblxyXG5cclxuIl19