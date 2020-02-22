
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
  setTouchEvent: function setTouchEvent() {
    if (this.userId == _mygolbal["default"].playerData.userId) {
      this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
        var gameScene_node = this.node.parent;
        var room_state = gameScene_node.getComponent("gameScene").roomstate;

        if (room_state == defines.gameState.ROOM_PLAYING) {
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
  showCards: function showCards(card, userId) {
    //card.index是服务器生成card给对象设置的一副牌里唯一id
    this.card_id = card.index; //传入参数 card={"value":5,"shape":1,"index":20}

    this.card_data = card;

    if (userId) {
      this.userId = userId; //标识card属于的玩家
    } //服务器返回的是key(A-K),value对应的是资源的编号


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc2NyaXB0c1xcZ2FtZVNjZW5lXFxwcmVmYWJzLy4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc2NyaXB0c1xcZ2FtZVNjZW5lXFxwcmVmYWJzL2Fzc2V0c1xcc2NyaXB0c1xcZ2FtZVNjZW5lXFxwcmVmYWJzXFxjYXJkLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiY2FyZHNfc3ByaXRlX2F0bGFzIiwiU3ByaXRlQXRsYXMiLCJvbkxvYWQiLCJmbGFnIiwib2Zmc2V0X3kiLCJub2RlIiwib24iLCJldmVudCIsInkiLCJiaW5kIiwicnVuVG9DZW50ZXIiLCJzdGFydCIsImluaXRfZGF0YSIsImRhdGEiLCJzZXRUb3VjaEV2ZW50IiwidXNlcklkIiwibXlnbG9iYWwiLCJwbGF5ZXJEYXRhIiwiTm9kZSIsIkV2ZW50VHlwZSIsIlRPVUNIX1NUQVJUIiwiZ2FtZVNjZW5lX25vZGUiLCJwYXJlbnQiLCJyb29tX3N0YXRlIiwiZ2V0Q29tcG9uZW50Iiwicm9vbXN0YXRlIiwiZGVmaW5lcyIsImdhbWVTdGF0ZSIsIlJPT01fUExBWUlORyIsImNvbnNvbGUiLCJsb2ciLCJjYXJkX2lkIiwiY2FyZGRhdGEiLCJjYXJkX2RhdGEiLCJlbWl0Iiwic2hvd0NhcmRzIiwiY2FyZCIsImluZGV4IiwiQ2FyZFZhbHVlIiwiY2FyZFNocGFlIiwiS2luZ3MiLCJzcHJpdGVLZXkiLCJzaGFwZSIsInZhbHVlIiwia2luZyIsIlNwcml0ZSIsInNwcml0ZUZyYW1lIiwiZ2V0U3ByaXRlRnJhbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFFQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDUCxhQUFTRCxFQUFFLENBQUNFLFNBREw7QUFHUEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLElBQUFBLGtCQUFrQixFQUFFSixFQUFFLENBQUNLO0FB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WFc7QUFZaEIsWUFBTSxFQVpVO0FBYWhCLFlBQU07QUFiVSxLQUFsQixDQVRzQixDQXlCdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsUUFBTUMsU0FBUyxHQUFHO0FBQ2hCLFdBQUssQ0FEVztBQUVoQixXQUFLLENBRlc7QUFHaEIsV0FBSyxDQUhXO0FBSWhCLFdBQUs7QUFKVyxLQUFsQjtBQU1BLFFBQU1DLEtBQUssR0FBRztBQUNaLFlBQU0sRUFETTtBQUVaLFlBQU07QUFGTSxLQUFkO0FBS0EsUUFBSUMsU0FBUyxHQUFHLEVBQWhCOztBQUNBLFFBQUlMLElBQUksQ0FBQ00sS0FBVCxFQUFnQjtBQUNkRCxNQUFBQSxTQUFTLEdBQUcsV0FBV0YsU0FBUyxDQUFDSCxJQUFJLENBQUNNLEtBQU4sQ0FBVCxHQUF3QixFQUF4QixHQUE2QkosU0FBUyxDQUFDRixJQUFJLENBQUNPLEtBQU4sQ0FBakQsQ0FBWjtBQUNELEtBRkQsTUFFTztBQUNMRixNQUFBQSxTQUFTLEdBQUcsVUFBVUQsS0FBSyxDQUFDSixJQUFJLENBQUNRLElBQU4sQ0FBM0I7QUFDRDs7QUFFRCxTQUFLdkMsSUFBTCxDQUFVbUIsWUFBVixDQUF1QjVCLEVBQUUsQ0FBQ2lELE1BQTFCLEVBQWtDQyxXQUFsQyxHQUFnRCxLQUFLOUMsa0JBQUwsQ0FBd0IrQyxjQUF4QixDQUF1Q04sU0FBdkMsQ0FBaEQ7QUFDQSxTQUFLM0IsYUFBTDtBQUNEO0FBekhNLENBQVQiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxnYW1lU2NlbmVcXHByZWZhYnMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbXlnbG9iYWwgZnJvbSBcIi4uLy4uL215Z29sYmFsLmpzXCJcclxuXHJcbmNjLkNsYXNzKHtcclxuICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gIHByb3BlcnRpZXM6IHtcclxuICAgIGNhcmRzX3Nwcml0ZV9hdGxhczogY2MuU3ByaXRlQXRsYXMsXHJcblxyXG4gIH0sXHJcblxyXG4gIG9uTG9hZCgpIHtcclxuICAgIHRoaXMuZmxhZyA9IGZhbHNlXHJcbiAgICB0aGlzLm9mZnNldF95ID0gMjBcclxuXHJcbiAgICB0aGlzLm5vZGUub24oXCJyZXNldF9jYXJkX2ZsYWdcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgIGlmICh0aGlzLCBmbGFnID09IHRydWUpIHtcclxuICAgICAgICB0aGlzLCBmbGFnID0gZmFsc2VcclxuICAgICAgICB0aGlzLm5vZGUueSAtPSB0aGlzLm9mZnNldF95XHJcbiAgICAgIH1cclxuICAgIH0uYmluZCh0aGlzKSlcclxuXHJcbiAgICAvLyB0aGlzLm5vZGUub24oXCJjaHVfY2FyZF9zdWNjXCIsZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgLy8gICAgdmFyIGNodV9jYXJkX2xpc3QgPSBldmVudFxyXG4gICAgLy8gICAgZm9yKHZhciBpPTA7aTxjaHVfY2FyZF9saXN0Lmxlbmd0aDtpKyspe1xyXG4gICAgLy8gICAgIGlmKGNodV9jYXJkX2xpc3RbaV0uY2FyZF9pZD09dGhpcy5jYXJkX2lkKXtcclxuICAgIC8vICAgICAgICAgLy90aGlzLnJ1blRvQ2VudGVyKGNodV9jYXJkX2xpc3RbaV0pXHJcbiAgICAvLyAgICAgICAgIC8vdGhpcy5ub2RlLmRlc3RvcnkoKVxyXG4gICAgLy8gICAgIH1cclxuICAgIC8vICAgIH1cclxuICAgIC8vIH0uYmluZCh0aGlzKSlcclxuICB9LFxyXG5cclxuICBydW5Ub0NlbnRlcigpIHtcclxuICAgIC8v56e75Yqo5Yiw5bGP5bmV5Lit6Ze077yM5bm25bim5LiA5Liq54mM57yp5bCP55qE5pWI5p6cXHJcbiAgfSxcclxuICBzdGFydCgpIHtcclxuXHJcbiAgfSxcclxuXHJcbiAgaW5pdF9kYXRhKGRhdGEpIHtcclxuXHJcbiAgfSxcclxuICBzZXRUb3VjaEV2ZW50KCkge1xyXG4gICAgaWYgKHRoaXMudXNlcklkID09IG15Z2xvYmFsLnBsYXllckRhdGEudXNlcklkKSB7XHJcbiAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgdmFyIGdhbWVTY2VuZV9ub2RlID0gdGhpcy5ub2RlLnBhcmVudFxyXG4gICAgICAgIHZhciByb29tX3N0YXRlID0gZ2FtZVNjZW5lX25vZGUuZ2V0Q29tcG9uZW50KFwiZ2FtZVNjZW5lXCIpLnJvb21zdGF0ZVxyXG4gICAgICAgIGlmIChyb29tX3N0YXRlID09IGRlZmluZXMuZ2FtZVN0YXRlLlJPT01fUExBWUlORykge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJUT1VDSF9TVEFSVCBpZDpcIiArIHRoaXMuY2FyZF9pZClcclxuICAgICAgICAgIGlmICh0aGlzLmZsYWcgPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgdGhpcy5mbGFnID0gdHJ1ZVxyXG4gICAgICAgICAgICB0aGlzLm5vZGUueSArPSB0aGlzLm9mZnNldF95XHJcbiAgICAgICAgICAgIC8v6YCa55+lZ2FtZXVp5bGC6YCJ5a6a55qE54mMXHJcbiAgICAgICAgICAgIHZhciBjYXJkZGF0YSA9IHtcclxuICAgICAgICAgICAgICBcImNhcmRpZFwiOiB0aGlzLmNhcmRfaWQsXHJcbiAgICAgICAgICAgICAgXCJjYXJkX2RhdGFcIjogdGhpcy5jYXJkX2RhdGEsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2FtZVNjZW5lX25vZGUuZW1pdChcImNob29zZV9jYXJkX2V2ZW50XCIsIGNhcmRkYXRhKVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5mbGFnID0gZmFsc2VcclxuICAgICAgICAgICAgdGhpcy5ub2RlLnkgLT0gdGhpcy5vZmZzZXRfeVxyXG4gICAgICAgICAgICAvL+mAmuefpWdhbWVVSeWPlua2iOS6humCo+W8oOeJjFxyXG4gICAgICAgICAgICBnYW1lU2NlbmVfbm9kZS5lbWl0KFwidW5jaG9vc2VfY2FyZF9ldmVudFwiLCB0aGlzLmNhcmRfaWQpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LmJpbmQodGhpcykpXHJcbiAgICB9XHJcbiAgfSxcclxuICBzaG93Q2FyZHMoY2FyZCwgdXNlcklkKSB7XHJcbiAgICAvL2NhcmQuaW5kZXjmmK/mnI3liqHlmajnlJ/miJBjYXJk57uZ5a+56LGh6K6+572u55qE5LiA5Ymv54mM6YeM5ZSv5LiAaWRcclxuICAgIHRoaXMuY2FyZF9pZCA9IGNhcmQuaW5kZXhcclxuICAgIC8v5Lyg5YWl5Y+C5pWwIGNhcmQ9e1widmFsdWVcIjo1LFwic2hhcGVcIjoxLFwiaW5kZXhcIjoyMH1cclxuICAgIHRoaXMuY2FyZF9kYXRhID0gY2FyZFxyXG4gICAgaWYgKHVzZXJJZCkge1xyXG4gICAgICB0aGlzLnVzZXJJZCA9IHVzZXJJZCAvL+agh+ivhmNhcmTlsZ7kuo7nmoTnjqnlrrZcclxuICAgIH1cclxuICAgIC8v5pyN5Yqh5Zmo6L+U5Zue55qE5piva2V5KEEtSyksdmFsdWXlr7nlupTnmoTmmK/otYTmupDnmoTnvJblj7dcclxuICAgIGNvbnN0IENhcmRWYWx1ZSA9IHtcclxuICAgICAgXCIxMlwiOiAxLFxyXG4gICAgICBcIjEzXCI6IDIsXHJcbiAgICAgIFwiMVwiOiAzLFxyXG4gICAgICBcIjJcIjogNCxcclxuICAgICAgXCIzXCI6IDUsXHJcbiAgICAgIFwiNFwiOiA2LFxyXG4gICAgICBcIjVcIjogNyxcclxuICAgICAgXCI2XCI6IDgsXHJcbiAgICAgIFwiN1wiOiA5LFxyXG4gICAgICBcIjhcIjogMTAsXHJcbiAgICAgIFwiOVwiOiAxMSxcclxuICAgICAgXCIxMFwiOiAxMixcclxuICAgICAgXCIxMVwiOiAxM1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyDpu5HmoYPvvJpzcGFkZVxyXG4gICAgLy8g57qi5qGD77yaaGVhcnRcclxuICAgIC8vIOaiheiKse+8mmNsdWJcclxuICAgIC8vIOaWueeJh++8mmRpYW1vbmRcclxuICAgIC8vIGNvbnN0IENhcmRTaGFwZSA9IHtcclxuICAgIC8vICAgICBcIlNcIjogMSxcclxuICAgIC8vICAgICBcIkhcIjogMixcclxuICAgIC8vICAgICBcIkNcIjogMyxcclxuICAgIC8vICAgICBcIkRcIjogNCxcclxuICAgIC8vIH07XHJcbiAgICBjb25zdCBjYXJkU2hwYWUgPSB7XHJcbiAgICAgIFwiMVwiOiAzLFxyXG4gICAgICBcIjJcIjogMixcclxuICAgICAgXCIzXCI6IDEsXHJcbiAgICAgIFwiNFwiOiAwXHJcbiAgICB9O1xyXG4gICAgY29uc3QgS2luZ3MgPSB7XHJcbiAgICAgIFwiMTRcIjogNTQsXHJcbiAgICAgIFwiMTVcIjogNTNcclxuICAgIH07XHJcblxyXG4gICAgdmFyIHNwcml0ZUtleSA9ICcnO1xyXG4gICAgaWYgKGNhcmQuc2hhcGUpIHtcclxuICAgICAgc3ByaXRlS2V5ID0gJ2NhcmRfJyArIChjYXJkU2hwYWVbY2FyZC5zaGFwZV0gKiAxMyArIENhcmRWYWx1ZVtjYXJkLnZhbHVlXSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzcHJpdGVLZXkgPSAnY2FyZF8nICsgS2luZ3NbY2FyZC5raW5nXTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSkuc3ByaXRlRnJhbWUgPSB0aGlzLmNhcmRzX3Nwcml0ZV9hdGxhcy5nZXRTcHJpdGVGcmFtZShzcHJpdGVLZXkpXHJcbiAgICB0aGlzLnNldFRvdWNoRXZlbnQoKVxyXG4gIH1cclxufSk7XHJcbiJdfQ==