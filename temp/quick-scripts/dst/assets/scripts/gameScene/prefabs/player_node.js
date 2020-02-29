
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
    robIconSp: cc.Sprite,
    robIcon_Sp: cc.Node,
    robnoIcon_Sp: cc.Node,
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

    this.readyimage.active = ddzData.gameState < ddzConstants.gameState.GAMESTART;
    this.masterIcon.active = false; //  准备开始

    this.node.on("player_ready_notify", function () {
      _this.readyimage.active = true;
    }); // 开始游戏(客户端发给客户端)

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc2NyaXB0c1xcZ2FtZVNjZW5lXFxwcmVmYWJzLy4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc2NyaXB0c1xcZ2FtZVNjZW5lXFxwcmVmYWJzL2Fzc2V0c1xcc2NyaXB0c1xcZ2FtZVNjZW5lXFxwcmVmYWJzXFxwbGF5ZXJfbm9kZS5qcyJdLCJuYW1lcyI6WyJkZHpDb25zdGFudHMiLCJyZXF1aXJlIiwiZGR6RGF0YSIsImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiaGVhZEltYWdlIiwiU3ByaXRlIiwibmlja25hbWVfbGFiZWwiLCJMYWJlbCIsImdsb2JhbGNvdW50X2xhYmVsIiwicmVhZHlpbWFnZSIsIk5vZGUiLCJjYXJkX25vZGUiLCJjYXJkX3ByZWZhYiIsIlByZWZhYiIsImNsb2NraW1hZ2UiLCJxaWFuZ2RpZHpodV9ub2RlIiwidGltZV9sYWJlbCIsInJvYmltYWdlX3NwIiwiU3ByaXRlRnJhbWUiLCJyb2Jub2ltYWdlX3NwIiwicm9iSWNvblNwIiwicm9iSWNvbl9TcCIsInJvYm5vSWNvbl9TcCIsIm1hc3Rlckljb24iLCJqaWFvZGl6aHUiLCJ0eXBlIiwiQXVkaW9DbGlwIiwiYnVxaWFuZyIsImdldEdhbWVTY2VuZSIsImZpbmQiLCJnZXRDb21wb25lbnQiLCJvbkxvYWQiLCJhY3RpdmUiLCJnYW1lU3RhdGUiLCJHQU1FU1RBUlQiLCJub2RlIiwib24iLCJldmVudCIsInNlYXRfaW5kZXgiLCJwdXNoQ2FyZCIsImJpbmQiLCJ1c2VySWQiLCJteWdsb2JhbCIsInBsYXllckRhdGEiLCJjYXJkIiwiY2FyZGxpc3Rfbm9kZSIsImdldENoaWxkQnlOYW1lIiwic3RyaW5nIiwic3RhcnQiLCJDQ19FRElUT1IiLCJnYW1lU3RhdGVOb3RpZnkiLCJhZGRMaXN0ZW5lciIsImdhbWVTdGF0ZUhhbmRsZXIiLCJ3aW5kb3ciLCIkc29ja2V0IiwiY2Fucm9iTm90aWZ5IiwiZ2FtZUVuZE5vdGlmeSIsIm9uRGVzdHJveSIsInJlbW92ZUxpc3RlbmVyIiwicmVtb3ZlIiwiaW5pdF9kYXRhIiwiZGF0YSIsImluZGV4IiwidXNlck5hbWUiLCJnb2xkY291bnQiLCJoZWFkX2ltYWdlX3BhdGgiLCJhdmF0YXJVcmwiLCJsb2FkZXIiLCJsb2FkUmVzIiwiZXJyIiwic3ByaXRlRnJhbWUiLCJjb25zb2xlIiwibG9nIiwibWVzc2FnZSIsIngiLCJzdGF0ZSIsInJlbW92ZUFsbENoaWxkcmVuIiwiY2xlYXJPdXRab25lIiwibGFuZGxvcmRJZCIsImlzUWR6IiwiY29tbW9uIiwicmFuZG9tIiwic2NoZWR1bGVyT25jZSIsImVtaXQiLCJxaWFuX3N0YXRlIiwicWlhbmciLCJhdWRpbyIsIlBsYXlFZmZlY3QiLCJmbiIsInNlY29uZHMiLCJjb3VudCIsImNhbGxiYWNrIiwidW5zY2hlZHVsZSIsInNjaGVkdWxlIiwiaW5zdGFudGlhdGUiLCJzY2FsZSIsInBhcmVudCIsInB1c2giLCJzdWJ0cmFjdENhcmRzIiwibGVuIiwibGVuZ3RoIiwiY291bnRMYWJlbCIsIk51bWJlciIsIm90aGVyUGxheWVyQ2FyZHMiLCJjYXJkTGlzdCIsImNhcmRzIiwic29ydCIsImEiLCJiIiwidmFsIiwiaSIsInNob3dDYXJkcyIsImdhbWVTY2VuZV9zY3JpcHQiLCJvdXRDYXJkX25vZGUiLCJnZXRVc2VyT3V0Q2FyZFBvc0J5QWNjb3VudCIsImNoaWxkcmVuIiwiZGVzdHJveSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBLElBQU1BLFlBQVksR0FBR0MsT0FBTyxDQUFDLGNBQUQsQ0FBNUI7O0FBQ0EsSUFBTUMsT0FBTyxHQUFHRCxPQUFPLENBQUMsU0FBRCxDQUF2Qjs7QUFDQUUsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDUCxhQUFTRCxFQUFFLENBQUNFLFNBREw7QUFHUEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLElBQUFBLFNBQVMsRUFBRUosRUFBRSxDQUFDSyxNQURK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SUFBWDtBQUNEOztBQUNEQSxNQUFBQSxJQUFJLENBQUNkLFlBQUwsQ0FBa0IsTUFBbEIsRUFBMEJpRixTQUExQixDQUFvQ1AsUUFBUSxDQUFDTSxDQUFELENBQTVDLEVBQWlELEtBQUtyRSxNQUF0RDtBQUNEO0FBQ0YsR0FwUE07QUFxUFA7QUFDQW9DLEVBQUFBLFlBdFBPLDBCQXNQUTtBQUNiLFFBQUltQyxnQkFBZ0IsR0FBRyxLQUFLcEYsWUFBTCxFQUF2QjtBQUNBLFFBQUlxRixZQUFZLEdBQUdELGdCQUFnQixDQUFDRSwwQkFBakIsQ0FBNEMsS0FBS3pFLE1BQWpELENBQW5CO0FBQ0EsUUFBSTBFLFFBQVEsR0FBR0YsWUFBWSxDQUFDRSxRQUE1Qjs7QUFDQSxTQUFLLElBQUlMLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdLLFFBQVEsQ0FBQ2YsTUFBN0IsRUFBcUNVLENBQUMsRUFBdEMsRUFBMEM7QUFDeEMsVUFBSWxFLElBQUksR0FBR3VFLFFBQVEsQ0FBQ0wsQ0FBRCxDQUFuQjtBQUNBbEUsTUFBQUEsSUFBSSxDQUFDd0UsT0FBTDtBQUNEOztBQUNESCxJQUFBQSxZQUFZLENBQUNyQyxpQkFBYixDQUErQixJQUEvQjtBQUNEO0FBL1BNLENBQVQiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxnYW1lU2NlbmVcXHByZWZhYnMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbXlnbG9iYWwgZnJvbSBcIi4uLy4uL215Z29sYmFsLmpzXCJcclxuY29uc3QgZGR6Q29uc3RhbnRzID0gcmVxdWlyZSgnZGR6Q29uc3RhbnRzJylcclxuY29uc3QgZGR6RGF0YSA9IHJlcXVpcmUoJ2RkekRhdGEnKVxyXG5jYy5DbGFzcyh7XHJcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICBwcm9wZXJ0aWVzOiB7XHJcbiAgICBoZWFkSW1hZ2U6IGNjLlNwcml0ZSxcclxuICAgIC8vIGFjY291bnRfbGFiZWw6IGNjLkxhYmVsLFxyXG4gICAgbmlja25hbWVfbGFiZWw6IGNjLkxhYmVsLFxyXG4gICAgLy8gcm9vbV90b3V4aWFuZzogY2MuU3ByaXRlLFxyXG4gICAgZ2xvYmFsY291bnRfbGFiZWw6IGNjLkxhYmVsLFxyXG4gICAgLy8gaGVhZGltYWdlOiBjYy5TcHJpdGUsXHJcbiAgICByZWFkeWltYWdlOiBjYy5Ob2RlLFxyXG4gICAgY2FyZF9ub2RlOiBjYy5Ob2RlLCAvLyDmiZHlhYvniYzoioLngrlcclxuICAgIGNhcmRfcHJlZmFiOiBjYy5QcmVmYWIsXHJcbiAgICAvL3RpcHNfbGFiZWw6Y2MuTGFiZWwsXHJcbiAgICBjbG9ja2ltYWdlOiBjYy5Ob2RlLFxyXG4gICAgcWlhbmdkaWR6aHVfbm9kZTogY2MuTm9kZSwgLy/miqLlnLDkuLvnmoTniLboioLngrlcclxuICAgIHRpbWVfbGFiZWw6IGNjLkxhYmVsLFxyXG4gICAgcm9iaW1hZ2Vfc3A6IGNjLlNwcml0ZUZyYW1lLFxyXG4gICAgcm9ibm9pbWFnZV9zcDogY2MuU3ByaXRlRnJhbWUsXHJcbiAgICByb2JJY29uU3A6IGNjLlNwcml0ZSxcclxuICAgIHJvYkljb25fU3A6IGNjLk5vZGUsXHJcbiAgICByb2Jub0ljb25fU3A6IGNjLk5vZGUsXHJcbiAgICBtYXN0ZXJJY29uOiBjYy5Ob2RlLCAvLyDlnLDkuLvmoIfor4boioLngrlcclxuICAgIGppYW9kaXpodToge1xyXG4gICAgICB0eXBlOiBjYy5BdWRpb0NsaXAsXHJcbiAgICAgIGRlZmF1bHQ6IG51bGxcclxuICAgIH0sXHJcbiAgICBidXFpYW5nOiB7XHJcbiAgICAgIHR5cGU6IGNjLkF1ZGlvQ2xpcCxcclxuICAgICAgZGVmYXVsdDogbnVsbFxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8vIExJRkUtQ1lDTEUgQ0FMTEJBQ0tTOlxyXG4gIGdldEdhbWVTY2VuZSgpIHtcclxuICAgIHJldHVybiBjYy5maW5kKCdDYW52YXMnKS5nZXRDb21wb25lbnQoJ2dhbWVTY2VuZScpXHJcbiAgfSxcclxuICBvbkxvYWQoKSB7XHJcbiAgICB0aGlzLnJlYWR5aW1hZ2UuYWN0aXZlID0gZGR6RGF0YS5nYW1lU3RhdGUgPCBkZHpDb25zdGFudHMuZ2FtZVN0YXRlLkdBTUVTVEFSVFxyXG4gICAgdGhpcy5tYXN0ZXJJY29uLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAvLyAg5YeG5aSH5byA5aeLXHJcbiAgICB0aGlzLm5vZGUub24oXCJwbGF5ZXJfcmVhZHlfbm90aWZ5XCIsICgpID0+IHtcclxuICAgICAgdGhpcy5yZWFkeWltYWdlLmFjdGl2ZSA9IHRydWVcclxuICAgIH0pXHJcbiAgICAvLyDlvIDlp4vmuLjmiI8o5a6i5oi356uv5Y+R57uZ5a6i5oi356uvKVxyXG4gICAgdGhpcy5ub2RlLm9uKFwiZ2FtZXN0YXJ0X2V2ZW50XCIsICgpID0+IHtcclxuICAgICAgdGhpcy5yZWFkeWltYWdlLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICB9KVxyXG5cclxuICAgIC8v57uZ5YW25LuW546p5a625Y+R54mM5LqL5Lu2XHJcbiAgICB0aGlzLm5vZGUub24oXCJwdXNoX2NhcmRfZXZlbnRcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgIGlmICh0aGlzLnNlYXRfaW5kZXggPT09IDApIHJldHVybiAvLyDoh6rlt7HkuI3lho3lj5HniYxcclxuICAgICAgdGhpcy5wdXNoQ2FyZCgpXHJcbiAgICB9LmJpbmQodGhpcykpXHJcbiAgICAvLyB0aGlzLm5vZGUub24oXCJwbGF5ZXJub2RlX3JvYl9zdGF0ZV9ldmVudFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIC8vICAgLy8gdGhpcy5ub2RlLm9uKFwicGxheWVybm9kZV9yb2Jfc3RhdGVfZXZlbnRcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAvLyAgIC8ve1widXNlcklkXCI6XCIyMTYyODY2XCIsXCJzdGF0ZVwiOjF9XHJcbiAgICAvLyAgIHZhciBkZXRhaWwgPSBldmVudFxyXG5cclxuICAgIC8vICAgLy/lpoLmnpzmmK/oh6rlt7HlnKjmiqLvvIzpnIDopoHpmpDol49xaWFuZ2RpZHpodV9ub2Rl6IqC54K5XHJcbiAgICAvLyAgIC8vdGhpcy51c2VySWTooajnpLrov5nkuKroioLngrnmjILmjqXnmoR1c2VySWRcclxuICAgIC8vICAgaWYgKGRldGFpbC51c2VySWQgPT0gdGhpcy51c2VySWQpIHtcclxuICAgIC8vICAgICB0aGlzLnFpYW5nZGlkemh1X25vZGUuYWN0aXZlID0gZmFsc2VcclxuICAgIC8vICAgfVxyXG4gICAgLy8gICBpZiAodGhpcy51c2VySWQgPT0gZGV0YWlsLnVzZXJJZCkge1xyXG4gICAgLy8gICAgIGlmIChkZXRhaWwuc3RhdGUgPT0gcWlhbl9zdGF0ZS5xaWFuZykge1xyXG4gICAgLy8gICAgICAgY29uc29sZS5sb2coXCJ0aGlzLnJvYkljb25fU3AuYWN0aXZlID0gdHJ1ZVwiKVxyXG4gICAgLy8gICAgICAgdGhpcy5yb2JJY29uX1NwLmFjdGl2ZSA9IHRydWVcclxuXHJcbiAgICAvLyAgICAgfSBlbHNlIGlmIChkZXRhaWwuc3RhdGUgPT0gcWlhbl9zdGF0ZS5idXFpYW5nKSB7XHJcbiAgICAvLyAgICAgICB0aGlzLnJvYm5vSWNvbl9TcC5hY3RpdmUgPSB0cnVlXHJcblxyXG4gICAgLy8gICAgIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgICBjb25zb2xlLmxvZyhcImdldCByb2IgdmFsdWUgOlwiICsgZGV0YWlsLnN0YXRlKVxyXG4gICAgLy8gICAgIH1cclxuICAgIC8vICAgfVxyXG5cclxuICAgIC8vIH0uYmluZCh0aGlzKSlcclxuXHJcbiAgICB0aGlzLm5vZGUub24oXCJwbGF5ZXJub2RlX2NoYW5nZW1hc3Rlcl9ldmVudFwiLCBmdW5jdGlvbiAodXNlcklkKSB7XHJcbiAgICAgIHRoaXMucm9iSWNvbl9TcC5hY3RpdmUgPSBmYWxzZVxyXG4gICAgICB0aGlzLnJvYm5vSWNvbl9TcC5hY3RpdmUgPSBmYWxzZVxyXG4gICAgICBpZiAodXNlcklkICE9PSB0aGlzLnVzZXJJZCkgcmV0dXJuXHJcbiAgICAgIHRoaXMubWFzdGVySWNvbi5hY3RpdmUgPSB0cnVlXHJcbiAgICAgIGlmICh1c2VySWQgPT09IG15Z2xvYmFsLnBsYXllckRhdGEudXNlcklkKSByZXR1cm5cclxuICAgICAgY29uc3QgY2FyZCA9IHRoaXMuY2FyZGxpc3Rfbm9kZVswXVxyXG4gICAgICBjYXJkICYmIChjYXJkLmdldENoaWxkQnlOYW1lKCdjb3VudCcpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gMjApXHJcbiAgICB9LmJpbmQodGhpcykpXHJcblxyXG4gICAgLy8gdGhpcy5ub2RlLm9uKFwicGxheWVybm9kZV9hZGRfdGhyZWVfY2FyZFwiLGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgIC8vICAgdmFyIGRldGFpbCA9IGV2ZW50IC8v5Zyw5Li755qEYWNjb3VudGlkXHJcbiAgICAvLyAgIGlmKGRldGFpbD09dGhpcy51c2VySWQpe1xyXG4gICAgLy8gICAgIC8v57uZ5Zyw5Li75Y+R5LiJ5byg5o6SXHJcblxyXG4gICAgLy8gICB9XHJcbiAgICAvLyB9LmJpbmQodGhpcykpXHJcbiAgfSxcclxuXHJcbiAgc3RhcnQoKSB7XHJcbiAgICAvLyDnm5HlkKzmuLjmiI/nirbmgIFcclxuICAgIGlmICghQ0NfRURJVE9SKSB7XHJcbiAgICAgIGRkekRhdGEuZ2FtZVN0YXRlTm90aWZ5LmFkZExpc3RlbmVyKHRoaXMuZ2FtZVN0YXRlSGFuZGxlciwgdGhpcylcclxuICAgIH1cclxuICAgIHdpbmRvdy4kc29ja2V0Lm9uKCdjYW5yb2Jfbm90aWZ5JywgdGhpcy5jYW5yb2JOb3RpZnksIHRoaXMpIC8vIOaKouWcsOS4u1xyXG4gICAgd2luZG93LiRzb2NrZXQub24oJ2dhbWVFbmROb3RpZnknLCB0aGlzLmdhbWVFbmROb3RpZnksIHRoaXMpIC8vIOa4uOaIj+e7k+adn1xyXG4gIH0sXHJcbiAgb25EZXN0cm95KCkge1xyXG4gICAgaWYgKCFDQ19FRElUT1IpIHtcclxuICAgICAgZGR6RGF0YS5nYW1lU3RhdGVOb3RpZnkucmVtb3ZlTGlzdGVuZXIodGhpcy5nYW1lU3RhdGVIYW5kbGVyLCB0aGlzKVxyXG4gICAgfVxyXG4gICAgd2luZG93LiRzb2NrZXQucmVtb3ZlKCdjYW5yb2Jfbm90aWZ5JywgdGhpcylcclxuICAgIHdpbmRvdy4kc29ja2V0LnJlbW92ZSgnZ2FtZUVuZE5vdGlmeScsIHRoaXMpXHJcbiAgfSxcclxuICAvL+i/memHjOWIneWni+WMluaIv+mXtOWGheS9jee9ruiKgueCueS/oeaBryjoh6rlt7Hlkozlhbbku5bnjqnlrrYpXHJcbiAgLy9kYXRh546p5a626IqC54K55pWw5o2uXHJcbiAgLy9pbmRleOeOqeWutuWcqOaIv+mXtOeahOS9jee9rue0ouW8lVxyXG4gIGluaXRfZGF0YShkYXRhLCBpbmRleCkge1xyXG4gICAgLy9kYXRhOntcInVzZXJJZFwiOlwiMjExNzgzNlwiLFwidXNlck5hbWVcIjpcInRpbnk1NDNcIixcImF2YXRhclVybFwiOlwiaHR0cDovL3h4eFwiLFwiZ29sZGNvdW50XCI6MTAwMH1cclxuICAgIHRoaXMudXNlcklkID0gZGF0YS51c2VySWRcclxuICAgIC8vIHRoaXMuYWNjb3VudF9sYWJlbC5zdHJpbmcgPSBkYXRhLmFjY291bnRpZFxyXG4gICAgdGhpcy5uaWNrbmFtZV9sYWJlbC5zdHJpbmcgPSBkYXRhLnVzZXJOYW1lXHJcbiAgICB0aGlzLmdsb2JhbGNvdW50X2xhYmVsLnN0cmluZyA9IGRhdGEuZ29sZGNvdW50XHJcbiAgICB0aGlzLmNhcmRsaXN0X25vZGUgPSBbXVxyXG4gICAgdGhpcy5zZWF0X2luZGV4ID0gaW5kZXhcclxuICAgIC8v6L+Z6YeM5qC55o2u5Lyg5YWl55qEYXZhcnRlcuadpeiOt+WPluacrOWcsOWbvuWDj1xyXG4gICAgdmFyIGhlYWRfaW1hZ2VfcGF0aCA9IFwiVUkvaGVhZGltYWdlL1wiICsgZGF0YS5hdmF0YXJVcmxcclxuICAgIGNjLmxvYWRlci5sb2FkUmVzKGhlYWRfaW1hZ2VfcGF0aCwgY2MuU3ByaXRlRnJhbWUsIGZ1bmN0aW9uIChlcnIsIHNwcml0ZUZyYW1lKSB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSB8fCBlcnIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmhlYWRJbWFnZS5zcHJpdGVGcmFtZSA9IHNwcml0ZUZyYW1lO1xyXG4gICAgfS5iaW5kKHRoaXMpKTtcclxuICAgIGlmICghaW5kZXgpIHtcclxuICAgICAgdGhpcy5yZWFkeWltYWdlLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgLy8g5pu05pS55Y+z6L655py65Zmo5Lq655qE5omR5YWL54mM5L2N572uXHJcbiAgICBpZiAoaW5kZXggPT09IDEpIHtcclxuICAgICAgdGhpcy5jYXJkX25vZGUueCA9IC10aGlzLmNhcmRfbm9kZS54XHJcbiAgICB9XHJcbiAgfSxcclxuICBnYW1lU3RhdGVIYW5kbGVyKHN0YXRlKSB7XHJcbiAgICAvLyDlvIDlp4vmuLjmiI8gLSDlt7Llh4blpIdcclxuICAgIGlmIChzdGF0ZSA9PT0gZGR6Q29uc3RhbnRzLmdhbWVTdGF0ZS5HQU1FU1RBUlQpIHtcclxuICAgICAgLy8gY29uc3QgY2FyZHMgPSB0aGlzLmNhcmRsaXN0X25vZGVcclxuICAgICAgLy8gZm9yIChsZXQgaSA9IDA7IGkgPCBjYXJkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAvLyAgIGlmICghY2FyZHNbaV0pIGJyZWFrXHJcbiAgICAgIC8vICAgY2FyZHNbaV0uZGVzdHJveSgpXHJcbiAgICAgIC8vICAgY2FyZHMuc3BsaWNlKGksIDEpXHJcbiAgICAgIC8vIH1cclxuICAgICAgdGhpcy5jYXJkbGlzdF9ub2RlID0gW11cclxuICAgICAgdGhpcy5jYXJkX25vZGUucmVtb3ZlQWxsQ2hpbGRyZW4oKVxyXG4gICAgICB0aGlzLmNsZWFyT3V0Wm9uZSgpXHJcbiAgICAgIHRoaXMubWFzdGVySWNvbi5hY3RpdmUgPSBmYWxzZSAvLyDpmpDol4/lnLDkuLvmoIfor4YgXHJcbiAgICB9XHJcbiAgfSxcclxuICAvLyDmiqLlnLDkuLvpgJrnn6VcclxuICBjYW5yb2JOb3RpZnkobGFuZGxvcmRJZCkge1xyXG4gICAgaWYgKGxhbmRsb3JkSWQgPT09IHRoaXMudXNlcklkICYmIGxhbmRsb3JkSWQgIT09IG15Z2xvYmFsLnBsYXllckRhdGEudXNlcklkKSB7XHJcbiAgICAgIHRoaXMucm9iSWNvbl9TcC5hY3RpdmUgPSBmYWxzZVxyXG4gICAgICB0aGlzLnJvYm5vSWNvbl9TcC5hY3RpdmUgPSBmYWxzZVxyXG4gICAgICBjb25zdCBpc1FkeiA9IGNvbW1vbi5yYW5kb20oMCwgMTApID4gNSAvLyDmmK/lkKbmiqLlnLDkuLtcclxuICAgICAgdGhpcy5zY2hlZHVsZXJPbmNlKCgpID0+IHtcclxuICAgICAgICBpc1FkeiAmJiAodGhpcy5yb2JJY29uX1NwLmFjdGl2ZSA9IHRydWUpIC8vIOaKolxyXG4gICAgICAgICFpc1FkeiAmJiAodGhpcy5yb2Jub0ljb25fU3AuYWN0aXZlID0gdHJ1ZSkgLy8g5LiN5oqiXHJcbiAgICAgICAgd2luZG93LiRzb2NrZXQuZW1pdCgnY2Fucm9iX3N0YXRlX25vdGlmeScsIHtcclxuICAgICAgICAgIHVzZXJJZDogdGhpcy51c2VySWQsXHJcbiAgICAgICAgICBzdGF0ZTogaXNRZHogPyBxaWFuX3N0YXRlLnFpYW5nIDogcWlhbl9zdGF0ZS5idXFpYW5nXHJcbiAgICAgICAgfSlcclxuICAgICAgICBjb21tb24uYXVkaW8uUGxheUVmZmVjdChpc1FkeiA/IHRoaXMuamlhb2Rpemh1IDogdGhpcy5idXFpYW5nKVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQGRlc2NyaXB0aW9uIOW8gOWQr+S4gOS4quWNgeenkueahOmXuemSn+WumuaXtuWZqFxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuIOWFs+mXreWQjueahOWbnuiwg+WHveaVsFxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzZWNvbmRzIOWHoOenkuWQjuWFs+mXrVxyXG4gICAqL1xyXG4gIHNjaGVkdWxlck9uY2UoZm4sIHNlY29uZHMgPSBjb21tb24ucmFuZG9tKDAsIDEwKSkge1xyXG4gICAgdGhpcy5jb3VudCA9IDEwO1xyXG4gICAgdGhpcy50aW1lX2xhYmVsLnN0cmluZyA9IHRoaXMuY291bnRcclxuICAgIHRoaXMucWlhbmdkaWR6aHVfbm9kZS5hY3RpdmUgPSB0cnVlXHJcbiAgICBjb25zdCBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKCF0aGlzLmNvdW50IHx8ICgxMCAtIHNlY29uZHMpID09PSB0aGlzLmNvdW50KSB7XHJcbiAgICAgICAgLy8g5Zyo56ys5YWt5qyh5omn6KGM5Zue6LCD5pe25Y+W5raI6L+Z5Liq6K6h5pe25ZmoXHJcbiAgICAgICAgdGhpcy5xaWFuZ2RpZHpodV9ub2RlLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy51bnNjaGVkdWxlKGNhbGxiYWNrKVxyXG4gICAgICAgIGZuICYmIGZuKClcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnRpbWVfbGFiZWwuc3RyaW5nID0gLS10aGlzLmNvdW50XHJcbiAgICB9XHJcbiAgICB0aGlzLnNjaGVkdWxlKGNhbGxiYWNrLCAxLCBzZWNvbmRzKVxyXG4gIH0sXHJcbiAgLy8g57uZ5py65Zmo5Y+R54mMXHJcbiAgcHVzaENhcmQoKSB7XHJcbiAgICB0aGlzLmNhcmRfbm9kZS5hY3RpdmUgPSB0cnVlXHJcbiAgICAvLyBmb3IgKHZhciBpID0gMDsgaSA8IDE3OyBpKyspIHtcclxuICAgICAgdmFyIGNhcmQgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmNhcmRfcHJlZmFiKVxyXG4gICAgICBjYXJkLnNjYWxlID0gMC42XHJcbiAgICAgIGNhcmQucGFyZW50ID0gdGhpcy5jYXJkX25vZGVcclxuICAgICAgLy8gdmFyIGhlaWdodCA9IGNhcmQuaGVpZ2h0XHJcbiAgICAgIC8vIGNhcmQueSA9ICgxNyAtIDEpICogMC41ICogaGVpZ2h0ICogMC40ICogMC4zIC0gaGVpZ2h0ICogMC40ICogMC4zICogaTtcclxuICAgICAgLy8gY2FyZC54ID0gMFxyXG4gICAgICB0aGlzLmNhcmRsaXN0X25vZGUucHVzaChjYXJkKVxyXG4gICAgLy8gfVxyXG4gICAgbGV0IGNvdW50ID0gMDtcclxuICAgIGNhcmQuZ2V0Q2hpbGRCeU5hbWUoJ2NvdW50JykuYWN0aXZlID0gdHJ1ZVxyXG4gICAgY29uc3QgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGNvdW50ID09PSAxNyAmJiB0aGlzLnVuc2NoZWR1bGUoY2FsbGJhY2spXHJcbiAgICAgIGNhcmQuZ2V0Q2hpbGRCeU5hbWUoJ2NvdW50JykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBjb3VudFxyXG4gICAgICBjb3VudCsrO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zY2hlZHVsZShjYWxsYmFjaywgMC4xLCAxNyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBAZGVzY3JpcHRpb24g5Ye654mM5ZCO5YeP5bCR5omL54mM6IqC54K5XHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGxlbiDpnIDopoHlh4/lsJHnmoToioLngrnmlbDph49cclxuICAgKi9cclxuICBzdWJ0cmFjdENhcmRzKGxlbiA9IDApIHtcclxuICAgIGlmICghdGhpcy5jYXJkbGlzdF9ub2RlLmxlbmd0aCkgcmV0dXJuXHJcbiAgICBjb25zdCBjb3VudExhYmVsID0gdGhpcy5jYXJkbGlzdF9ub2RlWzBdLmdldENoaWxkQnlOYW1lKCdjb3VudCcpLmdldENvbXBvbmVudChjYy5MYWJlbClcclxuICAgIGNvdW50TGFiZWwuc3RyaW5nIC09IGxlblxyXG4gICAgIU51bWJlcihjb3VudExhYmVsLnN0cmluZykgJiYgdGhpcy5jYXJkX25vZGUucmVtb3ZlQWxsQ2hpbGRyZW4oKVxyXG4gIH0sXHJcbiAgLy8g5ri45oiP57uT5p2f5pi+56S65Ymp5L2Z54mM5Z6LXHJcbiAgZ2FtZUVuZE5vdGlmeSh7b3RoZXJQbGF5ZXJDYXJkc30pIHtcclxuICAgIGNvbnN0IGNhcmRMaXN0ID0gb3RoZXJQbGF5ZXJDYXJkc1t0aGlzLnVzZXJJZF1cclxuICAgIGNvbnN0IGNhcmRzID0gdGhpcy5jYXJkbGlzdF9ub2RlXHJcbiAgICBpZiAoIWNhcmRMaXN0IHx8IHRoaXMudXNlcklkID09PSBteWdsb2JhbC5wbGF5ZXJEYXRhLnVzZXJJZCkgcmV0dXJuXHJcbiAgICBjYXJkTGlzdC5zb3J0KChhLCBiKSA9PiBiLnZhbCAtIGEudmFsKVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjYXJkTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgY2FyZCA9IGNhcmRzW2ldXHJcbiAgICAgIC8vIGNhcmQueSA9ICgxNyAtIDEpICogMC41ICogY2FyZC5oZWlnaHQgKiAwLjQgKiAwLjMgLSBjYXJkLmhlaWdodCAqIDAuNCAqIDAuMyAqIGk7XHJcbiAgICAgIGlmIChjYXJkKSB7XHJcbiAgICAgICAgY2FyZC5nZXRDaGlsZEJ5TmFtZSgnY291bnQnKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9ICcnXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FyZCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuY2FyZF9wcmVmYWIpXHJcbiAgICAgICAgY2FyZC5zY2FsZSA9IDAuNlxyXG4gICAgICAgIGNhcmQucGFyZW50ID0gdGhpcy5jYXJkX25vZGVcclxuICAgICAgICBjYXJkcy5wdXNoKGNhcmQpXHJcbiAgICAgIH1cclxuICAgICAgY2FyZC5nZXRDb21wb25lbnQoXCJjYXJkXCIpLnNob3dDYXJkcyhjYXJkTGlzdFtpXSwgdGhpcy51c2VySWQpXHJcbiAgICB9XHJcbiAgfSxcclxuICAvL+a4hemZpOaYvuekuuWHuueJjOiKgueCueWFqOmDqOWtkOiKgueCuSjlsLHmmK/miorlh7rniYznmoTmuIXnqbopXHJcbiAgY2xlYXJPdXRab25lKCkge1xyXG4gICAgdmFyIGdhbWVTY2VuZV9zY3JpcHQgPSB0aGlzLmdldEdhbWVTY2VuZSgpXHJcbiAgICB2YXIgb3V0Q2FyZF9ub2RlID0gZ2FtZVNjZW5lX3NjcmlwdC5nZXRVc2VyT3V0Q2FyZFBvc0J5QWNjb3VudCh0aGlzLnVzZXJJZClcclxuICAgIHZhciBjaGlsZHJlbiA9IG91dENhcmRfbm9kZS5jaGlsZHJlbjtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGNhcmQgPSBjaGlsZHJlbltpXTtcclxuICAgICAgY2FyZC5kZXN0cm95KClcclxuICAgIH1cclxuICAgIG91dENhcmRfbm9kZS5yZW1vdmVBbGxDaGlsZHJlbih0cnVlKTtcclxuICB9LFxyXG59KTtcclxuIl19