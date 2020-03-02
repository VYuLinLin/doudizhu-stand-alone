
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/gameScene/prefabs/player_node.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'aa64aMZgnFIfLx2Lmi+lbwV', 'player_node');
// scripts/gameScene/prefabs/player_node.js

"use strict";

var _mygolbal = _interopRequireDefault(require("../../mygolbal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ddzConstants = require('ddzConstants');

var ddzData = require('ddzData');

cc.Class({
  "extends": cc.Component,
  properties: {
    headImage: cc.Sprite,
    // account_label: cc.Label,
    nickname_label: cc.Label,
    // room_touxiang: cc.Sprite,
    globalcount_label: cc.Label,
    // headimage: cc.Sprite,
    readyimage: cc.Node,
    card_node: cc.Node,
    // 扑克牌节点
    card_prefab: cc.Prefab,
    //tips_label:cc.Label,
    clockimage: cc.Node,
    qiangdidzhu_node: cc.Node,
    //抢地主的父节点
    time_label: cc.Label,
    robimage_sp: cc.SpriteFrame,
    robnoimage_sp: cc.SpriteFrame,
    robIcon_Sp: cc.Node,
    // 抢地主
    robnoIcon_Sp: cc.Node,
    // 不抢
    masterIcon: cc.Node,
    // 地主标识节点
    jiaodizhu: {
      type: cc.AudioClip,
      "default": null
    },
    buqiang: {
      type: cc.AudioClip,
      "default": null
    }
  },
  // LIFE-CYCLE CALLBACKS:
  getGameScene: function getGameScene() {
    return cc.find('Canvas').getComponent('gameScene');
  },
  onLoad: function onLoad() {
    var _this = this;

    this.masterIcon.active = false; //  准备开始
    // this.node.on("player_ready_notify", () => {
    //   this.readyimage.active = true
    // })
    // 开始游戏(客户端发给客户端)

    this.node.on("gamestart_event", function () {
      _this.readyimage.active = false;
    }); //给其他玩家发牌事件

    this.node.on("push_card_event", function (event) {
      if (this.seat_index === 0) return; // 自己不再发牌

      this.pushCard();
    }.bind(this)); // this.node.on("playernode_rob_state_event", function (event) {
    //   // this.node.on("playernode_rob_state_event", function (event) {
    //   //{"userId":"2162866","state":1}
    //   var detail = event
    //   //如果是自己在抢，需要隐藏qiangdidzhu_node节点
    //   //this.userId表示这个节点挂接的userId
    //   if (detail.userId == this.userId) {
    //     this.qiangdidzhu_node.active = false
    //   }
    //   if (this.userId == detail.userId) {
    //     if (detail.state == qian_state.qiang) {
    //       console.log("this.robIcon_Sp.active = true")
    //       this.robIcon_Sp.active = true
    //     } else if (detail.state == qian_state.buqiang) {
    //       this.robnoIcon_Sp.active = true
    //     } else {
    //       console.log("get rob value :" + detail.state)
    //     }
    //   }
    // }.bind(this))

    this.node.on("playernode_changemaster_event", function (userId) {
      this.robIcon_Sp.active = false;
      this.robnoIcon_Sp.active = false;
      if (userId !== this.userId) return;
      this.masterIcon.active = true;
      if (userId === _mygolbal["default"].playerData.userId) return;
      var card = this.cardlist_node[0];
      card && (card.getChildByName('count').getComponent(cc.Label).string = 20);
    }.bind(this)); // this.node.on("playernode_add_three_card",function(event){
    //   var detail = event //地主的accountid
    //   if(detail==this.userId){
    //     //给地主发三张排
    //   }
    // }.bind(this))
  },
  start: function start() {
    // 监听游戏状态
    if (!CC_EDITOR) {
      ddzData.gameStateNotify.addListener(this.gameStateHandler, this);
    }

    window.$socket.on('canrob_notify', this.canrobNotify, this); // 抢地主

    window.$socket.on('gameEndNotify', this.gameEndNotify, this); // 游戏结束
  },
  onDestroy: function onDestroy() {
    if (!CC_EDITOR) {
      ddzData.gameStateNotify.removeListener(this.gameStateHandler, this);
    }

    window.$socket.remove('canrob_notify', this);
    window.$socket.remove('gameEndNotify', this);
  },
  //这里初始化房间内位置节点信息(自己和其他玩家)
  //data玩家节点数据
  //index玩家在房间的位置索引
  init_data: function init_data(data, index) {
    //data:{"userId":"2117836","userName":"tiny543","avatarUrl":"http://xxx","goldcount":1000}
    this.userId = data.userId; // this.account_label.string = data.accountid

    this.nickname_label.string = data.userName;
    this.globalcount_label.string = data.goldcount;
    this.cardlist_node = [];
    this.seat_index = index; //这里根据传入的avarter来获取本地图像

    var head_image_path = "UI/headimage/" + data.avatarUrl;
    cc.loader.loadRes(head_image_path, cc.SpriteFrame, function (err, spriteFrame) {
      if (err) {
        console.log(err.message || err);
        return;
      }

      this.headImage.spriteFrame = spriteFrame;
    }.bind(this));

    if (!index) {
      this.readyimage.active = false;
      return;
    } // 更改右边机器人的扑克牌位置


    if (index === 1) {
      this.card_node.x = -this.card_node.x;
    }
  },
  gameStateHandler: function gameStateHandler(state) {
    // 开始游戏 - 已准备
    if (state === ddzConstants.gameState.GAMESTART) {
      // const cards = this.cardlist_node
      // for (let i = 0; i < cards.length; i++) {
      //   if (!cards[i]) break
      //   cards[i].destroy()
      //   cards.splice(i, 1)
      // }
      this.cardlist_node = [];
      this.card_node.removeAllChildren();
      this.clearOutZone();
      this.masterIcon.active = false; // 隐藏地主标识

      this.readyimage.active = false;
      this.robIcon_Sp.active = false;
      this.robnoIcon_Sp.active = false;
    }
  },
  // 抢地主通知
  canrobNotify: function canrobNotify(landlordId) {
    var _this2 = this;

    if (landlordId === this.userId && landlordId !== _mygolbal["default"].playerData.userId) {
      this.robIcon_Sp.active = false;
      this.robnoIcon_Sp.active = false;
      var isQdz = common.random(0, 10) > 5; // 是否抢地主

      this.schedulerOnce(function () {
        isQdz && (_this2.robIcon_Sp.active = true); // 抢

        !isQdz && (_this2.robnoIcon_Sp.active = true); // 不抢

        window.$socket.emit('canrob_state_notify', {
          userId: _this2.userId,
          state: isQdz ? qian_state.qiang : qian_state.buqiang
        });
        common.audio.PlayEffect(isQdz ? _this2.jiaodizhu : _this2.buqiang);
      });
    }
  },

  /**
   * @description 开启一个十秒的闹钟定时器
   * @param {function} fn 关闭后的回调函数
   * @param {Number} seconds 几秒后关闭
   */
  schedulerOnce: function schedulerOnce(fn) {
    var seconds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : common.random(0, 10);
    this.count = 10;
    this.time_label.string = this.count;
    this.qiangdidzhu_node.active = true;

    var callback = function callback() {
      if (!this.count || 10 - seconds === this.count) {
        // 在第六次执行回调时取消这个计时器
        this.qiangdidzhu_node.active = false;
        this.unschedule(callback);
        fn && fn();
      }

      this.time_label.string = --this.count;
    };

    this.schedule(callback, 1, seconds);
  },
  // 给机器发牌
  pushCard: function pushCard() {
    this.card_node.active = true; // for (var i = 0; i < 17; i++) {

    var card = cc.instantiate(this.card_prefab);
    card.scale = 0.6;
    card.parent = this.card_node; // var height = card.height
    // card.y = (17 - 1) * 0.5 * height * 0.4 * 0.3 - height * 0.4 * 0.3 * i;
    // card.x = 0

    this.cardlist_node.push(card); // }

    var count = 0;
    card.getChildByName('count').active = true;

    var callback = function callback() {
      count === 17 && this.unschedule(callback);
      card.getChildByName('count').getComponent(cc.Label).string = count;
      count++;
    };

    this.schedule(callback, 0.1, 17);
  },

  /**
   * @description 出牌后减少手牌节点
   * @param {Number} len 需要减少的节点数量
   */
  subtractCards: function subtractCards() {
    var len = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    if (!this.cardlist_node.length) return;
    var countLabel = this.cardlist_node[0].getChildByName('count').getComponent(cc.Label);
    countLabel.string -= len;
    !Number(countLabel.string) && this.card_node.removeAllChildren();
  },
  // 游戏结束显示剩余牌型
  gameEndNotify: function gameEndNotify(_ref) {
    var otherPlayerCards = _ref.otherPlayerCards;
    var cardList = otherPlayerCards[this.userId];
    var cards = this.cardlist_node;
    if (!cardList || this.userId === _mygolbal["default"].playerData.userId) return;
    cardList.sort(function (a, b) {
      return b.val - a.val;
    });

    for (var i = 0; i < cardList.length; i++) {
      var card = cards[i]; // card.y = (17 - 1) * 0.5 * card.height * 0.4 * 0.3 - card.height * 0.4 * 0.3 * i;

      if (card) {
        card.getChildByName('count').getComponent(cc.Label).string = '';
      } else {
        card = cc.instantiate(this.card_prefab);
        card.scale = 0.6;
        card.parent = this.card_node;
        cards.push(card);
      }

      card.getComponent("card").showCards(cardList[i], this.userId);
    }
  },
  //清除显示出牌节点全部子节点(就是把出牌的清空)
  clearOutZone: function clearOutZone() {
    var gameScene_script = this.getGameScene();
    var outCard_node = gameScene_script.getUserOutCardPosByAccount(this.userId);
    var children = outCard_node.children;

    for (var i = 0; i < children.length; i++) {
      var card = children[i];
      card.destroy();
    }

    outCard_node.removeAllChildren(true);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc2NyaXB0c1xcZ2FtZVNjZW5lXFxwcmVmYWJzLy4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc2NyaXB0c1xcZ2FtZVNjZW5lXFxwcmVmYWJzL2Fzc2V0c1xcc2NyaXB0c1xcZ2FtZVNjZW5lXFxwcmVmYWJzXFxwbGF5ZXJfbm9kZS5qcyJdLCJuYW1lcyI6WyJkZHpDb25zdGFudHMiLCJyZXF1aXJlIiwiZGR6RGF0YSIsImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiaGVhZEltYWdlIiwiU3ByaXRlIiwibmlja25hbWVfbGFiZWwiLCJMYWJlbCIsImdsb2JhbGNvdW50X2xhYmVsIiwicmVhZHlpbWFnZSIsIk5vZGUiLCJjYXJkX25vZGUiLCJjYXJkX3ByZWZhYiIsIlByZWZhYiIsImNsb2NraW1hZ2UiLCJxaWFuZ2RpZHpodV9ub2RlIiwidGltZV9sYWJlbCIsInJvYmltYWdlX3NwIiwiU3ByaXRlRnJhbWUiLCJyb2Jub2ltYWdlX3NwIiwicm9iSWNvbl9TcCIsInJvYm5vSWNvbl9TcCIsIm1hc3Rlckljb24iLCJqaWFvZGl6aHUiLCJ0eXBlIiwiQXVkaW9DbGlwIiwiYnVxaWFuZyIsImdldEdhbWVTY2VuZSIsImZpbmQiLCJnZXRDb21wb25lbnQiLCJvbkxvYWQiLCJhY3RpdmUiLCJub2RlIiwib24iLCJldmVudCIsInNlYXRfaW5kZXgiLCJwdXNoQ2FyZCIsImJpbmQiLCJ1c2VySWQiLCJteWdsb2JhbCIsInBsYXllckRhdGEiLCJjYXJkIiwiY2FyZGxpc3Rfbm9kZSIsImdldENoaWxkQnlOYW1lIiwic3RyaW5nIiwic3RhcnQiLCJDQ19FRElUT1IiLCJnYW1lU3RhdGVOb3RpZnkiLCJhZGRMaXN0ZW5lciIsImdhbWVTdGF0ZUhhbmRsZXIiLCJ3aW5kb3ciLCIkc29ja2V0IiwiY2Fucm9iTm90aWZ5IiwiZ2FtZUVuZE5vdGlmeSIsIm9uRGVzdHJveSIsInJlbW92ZUxpc3RlbmVyIiwicmVtb3ZlIiwiaW5pdF9kYXRhIiwiZGF0YSIsImluZGV4IiwidXNlck5hbWUiLCJnb2xkY291bnQiLCJoZWFkX2ltYWdlX3BhdGgiLCJhdmF0YXJVcmwiLCJsb2FkZXIiLCJsb2FkUmVzIiwiZXJyIiwic3ByaXRlRnJhbWUiLCJjb25zb2xlIiwibG9nIiwibWVzc2FnZSIsIngiLCJzdGF0ZSIsImdhbWVTdGF0ZSIsIkdBTUVTVEFSVCIsInJlbW92ZUFsbENoaWxkcmVuIiwiY2xlYXJPdXRab25lIiwibGFuZGxvcmRJZCIsImlzUWR6IiwiY29tbW9uIiwicmFuZG9tIiwic2NoZWR1bGVyT25jZSIsImVtaXQiLCJxaWFuX3N0YXRlIiwicWlhbmciLCJhdWRpbyIsIlBsYXlFZmZlY3QiLCJmbiIsInNlY29uZHMiLCJjb3VudCIsImNhbGxiYWNrIiwidW5zY2hlZHVsZSIsInNjaGVkdWxlIiwiaW5zdGFudGlhdGUiLCJzY2FsZSIsInBhcmVudCIsInB1c2giLCJzdWJ0cmFjdENhcmRzIiwibGVuIiwibGVuZ3RoIiwiY291bnRMYWJlbCIsIk51bWJlciIsIm90aGVyUGxheWVyQ2FyZHMiLCJjYXJkTGlzdCIsImNhcmRzIiwic29ydCIsImEiLCJiIiwidmFsIiwiaSIsInNob3dDYXJkcyIsImdhbWVTY2VuZV9zY3JpcHQiLCJvdXRDYXJkX25vZGUiLCJnZXRVc2VyT3V0Q2FyZFBvc0J5QWNjb3VudCIsImNoaWxkcmVuIiwiZGVzdHJveSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBLElBQU1BLFlBQVksR0FBR0MsT0FBTyxDQUFDLGNBQUQsQ0FBNUI7O0FBQ0EsSUFBTUMsT0FBTyxHQUFHRCxPQUFPLENBQUMsU0FBRCxDQUF2Qjs7QUFDQUUsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDUCxhQUFTRCxFQUFFLENBQUNFLFNBREw7QUFHUEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLElBQUFBLFNBQVMsRUFBRUosRUFBRSxDQUFDSyxNQURKO0FBRVY7QUFDQUMs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QUFDRixHQXJQTTtBQXNQUDtBQUNBc0MsRUFBQUEsWUF2UE8sMEJBdVBRO0FBQ2IsUUFBSW1DLGdCQUFnQixHQUFHLEtBQUtwRixZQUFMLEVBQXZCO0FBQ0EsUUFBSXFGLFlBQVksR0FBR0QsZ0JBQWdCLENBQUNFLDBCQUFqQixDQUE0QyxLQUFLM0UsTUFBakQsQ0FBbkI7QUFDQSxRQUFJNEUsUUFBUSxHQUFHRixZQUFZLENBQUNFLFFBQTVCOztBQUNBLFNBQUssSUFBSUwsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0ssUUFBUSxDQUFDZixNQUE3QixFQUFxQ1UsQ0FBQyxFQUF0QyxFQUEwQztBQUN4QyxVQUFJcEUsSUFBSSxHQUFHeUUsUUFBUSxDQUFDTCxDQUFELENBQW5CO0FBQ0FwRSxNQUFBQSxJQUFJLENBQUMwRSxPQUFMO0FBQ0Q7O0FBQ0RILElBQUFBLFlBQVksQ0FBQ3JDLGlCQUFiLENBQStCLElBQS9CO0FBQ0Q7QUFoUU0sQ0FBVCIsInNvdXJjZVJvb3QiOiIuLlxcLi5cXC4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHNjcmlwdHNcXGdhbWVTY2VuZVxccHJlZmFicyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBteWdsb2JhbCBmcm9tIFwiLi4vLi4vbXlnb2xiYWwuanNcIlxyXG5jb25zdCBkZHpDb25zdGFudHMgPSByZXF1aXJlKCdkZHpDb25zdGFudHMnKVxyXG5jb25zdCBkZHpEYXRhID0gcmVxdWlyZSgnZGR6RGF0YScpXHJcbmNjLkNsYXNzKHtcclxuICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gIHByb3BlcnRpZXM6IHtcclxuICAgIGhlYWRJbWFnZTogY2MuU3ByaXRlLFxyXG4gICAgLy8gYWNjb3VudF9sYWJlbDogY2MuTGFiZWwsXHJcbiAgICBuaWNrbmFtZV9sYWJlbDogY2MuTGFiZWwsXHJcbiAgICAvLyByb29tX3RvdXhpYW5nOiBjYy5TcHJpdGUsXHJcbiAgICBnbG9iYWxjb3VudF9sYWJlbDogY2MuTGFiZWwsXHJcbiAgICAvLyBoZWFkaW1hZ2U6IGNjLlNwcml0ZSxcclxuICAgIHJlYWR5aW1hZ2U6IGNjLk5vZGUsXHJcbiAgICBjYXJkX25vZGU6IGNjLk5vZGUsIC8vIOaJkeWFi+eJjOiKgueCuVxyXG4gICAgY2FyZF9wcmVmYWI6IGNjLlByZWZhYixcclxuICAgIC8vdGlwc19sYWJlbDpjYy5MYWJlbCxcclxuICAgIGNsb2NraW1hZ2U6IGNjLk5vZGUsXHJcbiAgICBxaWFuZ2RpZHpodV9ub2RlOiBjYy5Ob2RlLCAvL+aKouWcsOS4u+eahOeItuiKgueCuVxyXG4gICAgdGltZV9sYWJlbDogY2MuTGFiZWwsXHJcbiAgICByb2JpbWFnZV9zcDogY2MuU3ByaXRlRnJhbWUsXHJcbiAgICByb2Jub2ltYWdlX3NwOiBjYy5TcHJpdGVGcmFtZSxcclxuICAgIHJvYkljb25fU3A6IGNjLk5vZGUsIC8vIOaKouWcsOS4u1xyXG4gICAgcm9ibm9JY29uX1NwOiBjYy5Ob2RlLCAvLyDkuI3miqJcclxuICAgIG1hc3Rlckljb246IGNjLk5vZGUsIC8vIOWcsOS4u+agh+ivhuiKgueCuVxyXG4gICAgamlhb2Rpemh1OiB7XHJcbiAgICAgIHR5cGU6IGNjLkF1ZGlvQ2xpcCxcclxuICAgICAgZGVmYXVsdDogbnVsbFxyXG4gICAgfSxcclxuICAgIGJ1cWlhbmc6IHtcclxuICAgICAgdHlwZTogY2MuQXVkaW9DbGlwLFxyXG4gICAgICBkZWZhdWx0OiBudWxsXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XHJcbiAgZ2V0R2FtZVNjZW5lKCkge1xyXG4gICAgcmV0dXJuIGNjLmZpbmQoJ0NhbnZhcycpLmdldENvbXBvbmVudCgnZ2FtZVNjZW5lJylcclxuICB9LFxyXG4gIG9uTG9hZCgpIHtcclxuICAgIHRoaXMubWFzdGVySWNvbi5hY3RpdmUgPSBmYWxzZVxyXG4gICAgLy8gIOWHhuWkh+W8gOWni1xyXG4gICAgLy8gdGhpcy5ub2RlLm9uKFwicGxheWVyX3JlYWR5X25vdGlmeVwiLCAoKSA9PiB7XHJcbiAgICAvLyAgIHRoaXMucmVhZHlpbWFnZS5hY3RpdmUgPSB0cnVlXHJcbiAgICAvLyB9KVxyXG4gICAgLy8g5byA5aeL5ri45oiPKOWuouaIt+err+WPkee7meWuouaIt+errylcclxuICAgIHRoaXMubm9kZS5vbihcImdhbWVzdGFydF9ldmVudFwiLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMucmVhZHlpbWFnZS5hY3RpdmUgPSBmYWxzZVxyXG4gICAgfSlcclxuXHJcbiAgICAvL+e7meWFtuS7lueOqeWutuWPkeeJjOS6i+S7tlxyXG4gICAgdGhpcy5ub2RlLm9uKFwicHVzaF9jYXJkX2V2ZW50XCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICBpZiAodGhpcy5zZWF0X2luZGV4ID09PSAwKSByZXR1cm4gLy8g6Ieq5bex5LiN5YaN5Y+R54mMXHJcbiAgICAgIHRoaXMucHVzaENhcmQoKVxyXG4gICAgfS5iaW5kKHRoaXMpKVxyXG4gICAgLy8gdGhpcy5ub2RlLm9uKFwicGxheWVybm9kZV9yb2Jfc3RhdGVfZXZlbnRcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAvLyAgIC8vIHRoaXMubm9kZS5vbihcInBsYXllcm5vZGVfcm9iX3N0YXRlX2V2ZW50XCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgLy8gICAvL3tcInVzZXJJZFwiOlwiMjE2Mjg2NlwiLFwic3RhdGVcIjoxfVxyXG4gICAgLy8gICB2YXIgZGV0YWlsID0gZXZlbnRcclxuXHJcbiAgICAvLyAgIC8v5aaC5p6c5piv6Ieq5bex5Zyo5oqi77yM6ZyA6KaB6ZqQ6JePcWlhbmdkaWR6aHVfbm9kZeiKgueCuVxyXG4gICAgLy8gICAvL3RoaXMudXNlcklk6KGo56S66L+Z5Liq6IqC54K55oyC5o6l55qEdXNlcklkXHJcbiAgICAvLyAgIGlmIChkZXRhaWwudXNlcklkID09IHRoaXMudXNlcklkKSB7XHJcbiAgICAvLyAgICAgdGhpcy5xaWFuZ2RpZHpodV9ub2RlLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAvLyAgIH1cclxuICAgIC8vICAgaWYgKHRoaXMudXNlcklkID09IGRldGFpbC51c2VySWQpIHtcclxuICAgIC8vICAgICBpZiAoZGV0YWlsLnN0YXRlID09IHFpYW5fc3RhdGUucWlhbmcpIHtcclxuICAgIC8vICAgICAgIGNvbnNvbGUubG9nKFwidGhpcy5yb2JJY29uX1NwLmFjdGl2ZSA9IHRydWVcIilcclxuICAgIC8vICAgICAgIHRoaXMucm9iSWNvbl9TcC5hY3RpdmUgPSB0cnVlXHJcblxyXG4gICAgLy8gICAgIH0gZWxzZSBpZiAoZGV0YWlsLnN0YXRlID09IHFpYW5fc3RhdGUuYnVxaWFuZykge1xyXG4gICAgLy8gICAgICAgdGhpcy5yb2Jub0ljb25fU3AuYWN0aXZlID0gdHJ1ZVxyXG5cclxuICAgIC8vICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgY29uc29sZS5sb2coXCJnZXQgcm9iIHZhbHVlIDpcIiArIGRldGFpbC5zdGF0ZSlcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyAgIH1cclxuXHJcbiAgICAvLyB9LmJpbmQodGhpcykpXHJcblxyXG4gICAgdGhpcy5ub2RlLm9uKFwicGxheWVybm9kZV9jaGFuZ2VtYXN0ZXJfZXZlbnRcIiwgZnVuY3Rpb24gKHVzZXJJZCkge1xyXG4gICAgICB0aGlzLnJvYkljb25fU3AuYWN0aXZlID0gZmFsc2VcclxuICAgICAgdGhpcy5yb2Jub0ljb25fU3AuYWN0aXZlID0gZmFsc2VcclxuICAgICAgaWYgKHVzZXJJZCAhPT0gdGhpcy51c2VySWQpIHJldHVyblxyXG4gICAgICB0aGlzLm1hc3Rlckljb24uYWN0aXZlID0gdHJ1ZVxyXG4gICAgICBpZiAodXNlcklkID09PSBteWdsb2JhbC5wbGF5ZXJEYXRhLnVzZXJJZCkgcmV0dXJuXHJcbiAgICAgIGNvbnN0IGNhcmQgPSB0aGlzLmNhcmRsaXN0X25vZGVbMF1cclxuICAgICAgY2FyZCAmJiAoY2FyZC5nZXRDaGlsZEJ5TmFtZSgnY291bnQnKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IDIwKVxyXG4gICAgfS5iaW5kKHRoaXMpKVxyXG5cclxuICAgIC8vIHRoaXMubm9kZS5vbihcInBsYXllcm5vZGVfYWRkX3RocmVlX2NhcmRcIixmdW5jdGlvbihldmVudCl7XHJcbiAgICAvLyAgIHZhciBkZXRhaWwgPSBldmVudCAvL+WcsOS4u+eahGFjY291bnRpZFxyXG4gICAgLy8gICBpZihkZXRhaWw9PXRoaXMudXNlcklkKXtcclxuICAgIC8vICAgICAvL+e7meWcsOS4u+WPkeS4ieW8oOaOklxyXG5cclxuICAgIC8vICAgfVxyXG4gICAgLy8gfS5iaW5kKHRoaXMpKVxyXG4gIH0sXHJcblxyXG4gIHN0YXJ0KCkge1xyXG4gICAgLy8g55uR5ZCs5ri45oiP54q25oCBXHJcbiAgICBpZiAoIUNDX0VESVRPUikge1xyXG4gICAgICBkZHpEYXRhLmdhbWVTdGF0ZU5vdGlmeS5hZGRMaXN0ZW5lcih0aGlzLmdhbWVTdGF0ZUhhbmRsZXIsIHRoaXMpXHJcbiAgICB9XHJcbiAgICB3aW5kb3cuJHNvY2tldC5vbignY2Fucm9iX25vdGlmeScsIHRoaXMuY2Fucm9iTm90aWZ5LCB0aGlzKSAvLyDmiqLlnLDkuLtcclxuICAgIHdpbmRvdy4kc29ja2V0Lm9uKCdnYW1lRW5kTm90aWZ5JywgdGhpcy5nYW1lRW5kTm90aWZ5LCB0aGlzKSAvLyDmuLjmiI/nu5PmnZ9cclxuICB9LFxyXG4gIG9uRGVzdHJveSgpIHtcclxuICAgIGlmICghQ0NfRURJVE9SKSB7XHJcbiAgICAgIGRkekRhdGEuZ2FtZVN0YXRlTm90aWZ5LnJlbW92ZUxpc3RlbmVyKHRoaXMuZ2FtZVN0YXRlSGFuZGxlciwgdGhpcylcclxuICAgIH1cclxuICAgIHdpbmRvdy4kc29ja2V0LnJlbW92ZSgnY2Fucm9iX25vdGlmeScsIHRoaXMpXHJcbiAgICB3aW5kb3cuJHNvY2tldC5yZW1vdmUoJ2dhbWVFbmROb3RpZnknLCB0aGlzKVxyXG4gIH0sXHJcbiAgLy/ov5nph4zliJ3lp4vljJbmiL/pl7TlhoXkvY3nva7oioLngrnkv6Hmga8o6Ieq5bex5ZKM5YW25LuW546p5a62KVxyXG4gIC8vZGF0YeeOqeWutuiKgueCueaVsOaNrlxyXG4gIC8vaW5kZXjnjqnlrrblnKjmiL/pl7TnmoTkvY3nva7ntKLlvJVcclxuICBpbml0X2RhdGEoZGF0YSwgaW5kZXgpIHtcclxuICAgIC8vZGF0YTp7XCJ1c2VySWRcIjpcIjIxMTc4MzZcIixcInVzZXJOYW1lXCI6XCJ0aW55NTQzXCIsXCJhdmF0YXJVcmxcIjpcImh0dHA6Ly94eHhcIixcImdvbGRjb3VudFwiOjEwMDB9XHJcbiAgICB0aGlzLnVzZXJJZCA9IGRhdGEudXNlcklkXHJcbiAgICAvLyB0aGlzLmFjY291bnRfbGFiZWwuc3RyaW5nID0gZGF0YS5hY2NvdW50aWRcclxuICAgIHRoaXMubmlja25hbWVfbGFiZWwuc3RyaW5nID0gZGF0YS51c2VyTmFtZVxyXG4gICAgdGhpcy5nbG9iYWxjb3VudF9sYWJlbC5zdHJpbmcgPSBkYXRhLmdvbGRjb3VudFxyXG4gICAgdGhpcy5jYXJkbGlzdF9ub2RlID0gW11cclxuICAgIHRoaXMuc2VhdF9pbmRleCA9IGluZGV4XHJcbiAgICAvL+i/memHjOagueaNruS8oOWFpeeahGF2YXJ0ZXLmnaXojrflj5bmnKzlnLDlm77lg49cclxuICAgIHZhciBoZWFkX2ltYWdlX3BhdGggPSBcIlVJL2hlYWRpbWFnZS9cIiArIGRhdGEuYXZhdGFyVXJsXHJcbiAgICBjYy5sb2FkZXIubG9hZFJlcyhoZWFkX2ltYWdlX3BhdGgsIGNjLlNwcml0ZUZyYW1lLCBmdW5jdGlvbiAoZXJyLCBzcHJpdGVGcmFtZSkge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UgfHwgZXJyKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5oZWFkSW1hZ2Uuc3ByaXRlRnJhbWUgPSBzcHJpdGVGcmFtZTtcclxuICAgIH0uYmluZCh0aGlzKSk7XHJcbiAgICBpZiAoIWluZGV4KSB7XHJcbiAgICAgIHRoaXMucmVhZHlpbWFnZS5hY3RpdmUgPSBmYWxzZVxyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIC8vIOabtOaUueWPs+i+ueacuuWZqOS6uueahOaJkeWFi+eJjOS9jee9rlxyXG4gICAgaWYgKGluZGV4ID09PSAxKSB7XHJcbiAgICAgIHRoaXMuY2FyZF9ub2RlLnggPSAtdGhpcy5jYXJkX25vZGUueFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgZ2FtZVN0YXRlSGFuZGxlcihzdGF0ZSkge1xyXG4gICAgLy8g5byA5aeL5ri45oiPIC0g5bey5YeG5aSHXHJcbiAgICBpZiAoc3RhdGUgPT09IGRkekNvbnN0YW50cy5nYW1lU3RhdGUuR0FNRVNUQVJUKSB7XHJcbiAgICAgIC8vIGNvbnN0IGNhcmRzID0gdGhpcy5jYXJkbGlzdF9ub2RlXHJcbiAgICAgIC8vIGZvciAobGV0IGkgPSAwOyBpIDwgY2FyZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgLy8gICBpZiAoIWNhcmRzW2ldKSBicmVha1xyXG4gICAgICAvLyAgIGNhcmRzW2ldLmRlc3Ryb3koKVxyXG4gICAgICAvLyAgIGNhcmRzLnNwbGljZShpLCAxKVxyXG4gICAgICAvLyB9XHJcbiAgICAgIHRoaXMuY2FyZGxpc3Rfbm9kZSA9IFtdXHJcbiAgICAgIHRoaXMuY2FyZF9ub2RlLnJlbW92ZUFsbENoaWxkcmVuKClcclxuICAgICAgdGhpcy5jbGVhck91dFpvbmUoKVxyXG4gICAgICB0aGlzLm1hc3Rlckljb24uYWN0aXZlID0gZmFsc2UgLy8g6ZqQ6JeP5Zyw5Li75qCH6K+GXHJcbiAgICAgIHRoaXMucmVhZHlpbWFnZS5hY3RpdmUgPSBmYWxzZVxyXG4gICAgICB0aGlzLnJvYkljb25fU3AuYWN0aXZlID0gZmFsc2VcclxuICAgICAgdGhpcy5yb2Jub0ljb25fU3AuYWN0aXZlID0gZmFsc2VcclxuICAgIH1cclxuICB9LFxyXG4gIC8vIOaKouWcsOS4u+mAmuefpVxyXG4gIGNhbnJvYk5vdGlmeShsYW5kbG9yZElkKSB7XHJcbiAgICBpZiAobGFuZGxvcmRJZCA9PT0gdGhpcy51c2VySWQgJiYgbGFuZGxvcmRJZCAhPT0gbXlnbG9iYWwucGxheWVyRGF0YS51c2VySWQpIHtcclxuICAgICAgdGhpcy5yb2JJY29uX1NwLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgIHRoaXMucm9ibm9JY29uX1NwLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgIGNvbnN0IGlzUWR6ID0gY29tbW9uLnJhbmRvbSgwLCAxMCkgPiA1IC8vIOaYr+WQpuaKouWcsOS4u1xyXG4gICAgICB0aGlzLnNjaGVkdWxlck9uY2UoKCkgPT4ge1xyXG4gICAgICAgIGlzUWR6ICYmICh0aGlzLnJvYkljb25fU3AuYWN0aXZlID0gdHJ1ZSkgLy8g5oqiXHJcbiAgICAgICAgIWlzUWR6ICYmICh0aGlzLnJvYm5vSWNvbl9TcC5hY3RpdmUgPSB0cnVlKSAvLyDkuI3miqJcclxuICAgICAgICB3aW5kb3cuJHNvY2tldC5lbWl0KCdjYW5yb2Jfc3RhdGVfbm90aWZ5Jywge1xyXG4gICAgICAgICAgdXNlcklkOiB0aGlzLnVzZXJJZCxcclxuICAgICAgICAgIHN0YXRlOiBpc1FkeiA/IHFpYW5fc3RhdGUucWlhbmcgOiBxaWFuX3N0YXRlLmJ1cWlhbmdcclxuICAgICAgICB9KVxyXG4gICAgICAgIGNvbW1vbi5hdWRpby5QbGF5RWZmZWN0KGlzUWR6ID8gdGhpcy5qaWFvZGl6aHUgOiB0aGlzLmJ1cWlhbmcpXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBAZGVzY3JpcHRpb24g5byA5ZCv5LiA5Liq5Y2B56eS55qE6Ze56ZKf5a6a5pe25ZmoXHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gZm4g5YWz6Zet5ZCO55qE5Zue6LCD5Ye95pWwXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHNlY29uZHMg5Yeg56eS5ZCO5YWz6ZetXHJcbiAgICovXHJcbiAgc2NoZWR1bGVyT25jZShmbiwgc2Vjb25kcyA9IGNvbW1vbi5yYW5kb20oMCwgMTApKSB7XHJcbiAgICB0aGlzLmNvdW50ID0gMTA7XHJcbiAgICB0aGlzLnRpbWVfbGFiZWwuc3RyaW5nID0gdGhpcy5jb3VudFxyXG4gICAgdGhpcy5xaWFuZ2RpZHpodV9ub2RlLmFjdGl2ZSA9IHRydWVcclxuICAgIGNvbnN0IGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoIXRoaXMuY291bnQgfHwgKDEwIC0gc2Vjb25kcykgPT09IHRoaXMuY291bnQpIHtcclxuICAgICAgICAvLyDlnKjnrKzlha3mrKHmiafooYzlm57osIPml7blj5bmtojov5nkuKrorqHml7blmahcclxuICAgICAgICB0aGlzLnFpYW5nZGlkemh1X25vZGUuYWN0aXZlID0gZmFsc2VcclxuICAgICAgICB0aGlzLnVuc2NoZWR1bGUoY2FsbGJhY2spXHJcbiAgICAgICAgZm4gJiYgZm4oKVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMudGltZV9sYWJlbC5zdHJpbmcgPSAtLXRoaXMuY291bnRcclxuICAgIH1cclxuICAgIHRoaXMuc2NoZWR1bGUoY2FsbGJhY2ssIDEsIHNlY29uZHMpXHJcbiAgfSxcclxuICAvLyDnu5nmnLrlmajlj5HniYxcclxuICBwdXNoQ2FyZCgpIHtcclxuICAgIHRoaXMuY2FyZF9ub2RlLmFjdGl2ZSA9IHRydWVcclxuICAgIC8vIGZvciAodmFyIGkgPSAwOyBpIDwgMTc7IGkrKykge1xyXG4gICAgICB2YXIgY2FyZCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuY2FyZF9wcmVmYWIpXHJcbiAgICAgIGNhcmQuc2NhbGUgPSAwLjZcclxuICAgICAgY2FyZC5wYXJlbnQgPSB0aGlzLmNhcmRfbm9kZVxyXG4gICAgICAvLyB2YXIgaGVpZ2h0ID0gY2FyZC5oZWlnaHRcclxuICAgICAgLy8gY2FyZC55ID0gKDE3IC0gMSkgKiAwLjUgKiBoZWlnaHQgKiAwLjQgKiAwLjMgLSBoZWlnaHQgKiAwLjQgKiAwLjMgKiBpO1xyXG4gICAgICAvLyBjYXJkLnggPSAwXHJcbiAgICAgIHRoaXMuY2FyZGxpc3Rfbm9kZS5wdXNoKGNhcmQpXHJcbiAgICAvLyB9XHJcbiAgICBsZXQgY291bnQgPSAwO1xyXG4gICAgY2FyZC5nZXRDaGlsZEJ5TmFtZSgnY291bnQnKS5hY3RpdmUgPSB0cnVlXHJcbiAgICBjb25zdCBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgY291bnQgPT09IDE3ICYmIHRoaXMudW5zY2hlZHVsZShjYWxsYmFjaylcclxuICAgICAgY2FyZC5nZXRDaGlsZEJ5TmFtZSgnY291bnQnKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IGNvdW50XHJcbiAgICAgIGNvdW50Kys7XHJcbiAgICB9XHJcbiAgICB0aGlzLnNjaGVkdWxlKGNhbGxiYWNrLCAwLjEsIDE3KTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEBkZXNjcmlwdGlvbiDlh7rniYzlkI7lh4/lsJHmiYvniYzoioLngrlcclxuICAgKiBAcGFyYW0ge051bWJlcn0gbGVuIOmcgOimgeWHj+WwkeeahOiKgueCueaVsOmHj1xyXG4gICAqL1xyXG4gIHN1YnRyYWN0Q2FyZHMobGVuID0gMCkge1xyXG4gICAgaWYgKCF0aGlzLmNhcmRsaXN0X25vZGUubGVuZ3RoKSByZXR1cm5cclxuICAgIGNvbnN0IGNvdW50TGFiZWwgPSB0aGlzLmNhcmRsaXN0X25vZGVbMF0uZ2V0Q2hpbGRCeU5hbWUoJ2NvdW50JykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKVxyXG4gICAgY291bnRMYWJlbC5zdHJpbmcgLT0gbGVuXHJcbiAgICAhTnVtYmVyKGNvdW50TGFiZWwuc3RyaW5nKSAmJiB0aGlzLmNhcmRfbm9kZS5yZW1vdmVBbGxDaGlsZHJlbigpXHJcbiAgfSxcclxuICAvLyDmuLjmiI/nu5PmnZ/mmL7npLrliankvZnniYzlnotcclxuICBnYW1lRW5kTm90aWZ5KHtvdGhlclBsYXllckNhcmRzfSkge1xyXG4gICAgY29uc3QgY2FyZExpc3QgPSBvdGhlclBsYXllckNhcmRzW3RoaXMudXNlcklkXVxyXG4gICAgY29uc3QgY2FyZHMgPSB0aGlzLmNhcmRsaXN0X25vZGVcclxuICAgIGlmICghY2FyZExpc3QgfHwgdGhpcy51c2VySWQgPT09IG15Z2xvYmFsLnBsYXllckRhdGEudXNlcklkKSByZXR1cm5cclxuICAgIGNhcmRMaXN0LnNvcnQoKGEsIGIpID0+IGIudmFsIC0gYS52YWwpXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNhcmRMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGxldCBjYXJkID0gY2FyZHNbaV1cclxuICAgICAgLy8gY2FyZC55ID0gKDE3IC0gMSkgKiAwLjUgKiBjYXJkLmhlaWdodCAqIDAuNCAqIDAuMyAtIGNhcmQuaGVpZ2h0ICogMC40ICogMC4zICogaTtcclxuICAgICAgaWYgKGNhcmQpIHtcclxuICAgICAgICBjYXJkLmdldENoaWxkQnlOYW1lKCdjb3VudCcpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gJydcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYXJkID0gY2MuaW5zdGFudGlhdGUodGhpcy5jYXJkX3ByZWZhYilcclxuICAgICAgICBjYXJkLnNjYWxlID0gMC42XHJcbiAgICAgICAgY2FyZC5wYXJlbnQgPSB0aGlzLmNhcmRfbm9kZVxyXG4gICAgICAgIGNhcmRzLnB1c2goY2FyZClcclxuICAgICAgfVxyXG4gICAgICBjYXJkLmdldENvbXBvbmVudChcImNhcmRcIikuc2hvd0NhcmRzKGNhcmRMaXN0W2ldLCB0aGlzLnVzZXJJZClcclxuICAgIH1cclxuICB9LFxyXG4gIC8v5riF6Zmk5pi+56S65Ye654mM6IqC54K55YWo6YOo5a2Q6IqC54K5KOWwseaYr+aKiuWHuueJjOeahOa4heepuilcclxuICBjbGVhck91dFpvbmUoKSB7XHJcbiAgICB2YXIgZ2FtZVNjZW5lX3NjcmlwdCA9IHRoaXMuZ2V0R2FtZVNjZW5lKClcclxuICAgIHZhciBvdXRDYXJkX25vZGUgPSBnYW1lU2NlbmVfc2NyaXB0LmdldFVzZXJPdXRDYXJkUG9zQnlBY2NvdW50KHRoaXMudXNlcklkKVxyXG4gICAgdmFyIGNoaWxkcmVuID0gb3V0Q2FyZF9ub2RlLmNoaWxkcmVuO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgY2FyZCA9IGNoaWxkcmVuW2ldO1xyXG4gICAgICBjYXJkLmRlc3Ryb3koKVxyXG4gICAgfVxyXG4gICAgb3V0Q2FyZF9ub2RlLnJlbW92ZUFsbENoaWxkcmVuKHRydWUpO1xyXG4gIH0sXHJcbn0pO1xyXG4iXX0=