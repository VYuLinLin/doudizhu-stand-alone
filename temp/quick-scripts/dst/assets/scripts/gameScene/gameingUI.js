
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/gameScene/gameingUI.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'fc5fbLb+LFG+rCIt1gYkSVX', 'gameingUI');
// scripts/gameScene/gameingUI.js

"use strict";

var _mygolbal = _interopRequireDefault(require("../mygolbal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ddzConstants = require('ddzConstants');

var ddzData = require('ddzData');

cc.Class({
  "extends": cc.Component,
  properties: {
    gameingUI: cc.Node,
    card_prefab: cc.Prefab,
    robUI: cc.Node,
    // 抢地主按钮节点
    timeLabel: cc.Label,
    // 计时器节点
    cardsNode: cc.Node,
    // 扑克节点
    bottom_card_pos_node: cc.Node,
    // 底牌节点
    playingUI_node: cc.Node,
    // 出牌提示节点
    tipsLabel: cc.Label,
    //玩家出牌不合法的tips
    loseNode: cc.Node,
    // 失败特效节点
    winNode: cc.Node,
    // 胜利特效节点
    fapaiAudio: {
      type: cc.AudioClip,
      "default": null
    },
    jiaodizhuAudio: {
      type: cc.AudioClip,
      "default": null
    },
    buqiangAudio: {
      type: cc.AudioClip,
      "default": null
    },
    cardsAudio: {
      type: cc.AudioClip,
      "default": null
    },
    buyaoAudio: {
      type: cc.AudioClip,
      "default": []
    },
    chupaiAudio: {
      type: cc.AudioClip,
      "default": null
    }
  },
  onLoad: function onLoad() {
    //自己牌列表 
    this.cards_node = [];
    this.card_width = 0; //当前可以抢地主的accountid
    // this.rob_player_accountid = 0
    //发牌动画是否结束
    // this.fapai_end = false
    //底牌数组

    this.bottom_card = []; //底牌的json对象数据

    this.bottom_card_data = [];
    this.choose_card_data = [];
    this.outcar_zone = [];
    this.push_card_tmp = []; // 提示牌型

    this.promptCount = 0;
    this.promptList = []; //监听服务器可以出牌消息
    // myglobal.socket.onCanChuCard(function (data) {
    //   console.log("onCanChuCard" + JSON.stringify(data))
    //   //判断是不是自己能出牌
    //   if (data == myglobal.playerData.userId) {
    //     //先清理出牌区域
    //     this.clearOutZone(myglobal.playerData.userId)
    //     //先把自己出牌列表置空
    //     //this.choose_card_data=[]
    //     //显示可以出牌的UI
    //     this.playingUI_node.active = true
    //   }
    // }.bind(this))
    //监听服务器：其他玩家出牌消息
    // myglobal.socket.onOtherPlayerChuCard(function (data) {
    //   //{"userId":"2357540","cards":[{"index":4,"card_data":{"index":4,"value":1,"shape":1}}]}
    //   console.log("onOtherPlayerChuCard" + JSON.stringify(data))
    //   var userId = data.userId
    //   var gameScene_script = this.node.parent.getComponent("gameScene")
    //   //获取出牌区域节点
    //   var outCard_node = gameScene_script.getUserOutCardPosByAccount(userId)
    //   if (outCard_node == null) {
    //     return
    //   }
    //   var node_cards = []
    //   for (var i = 0; i < data.cards.length; i++) {
    //     var card = cc.instantiate(this.card_prefab)
    //     card.getComponent("card").showCards(data.cards[i].card_data, myglobal.playerData.userId)
    //     node_cards.push(card)
    //   }
    //   this.appendOtherCardsToOutZone(outCard_node, node_cards, 0)
    // }.bind(this))
    //内部事件:显示底牌事件,data是三张底牌数据

    this.node.on("show_bottom_card_event", function (data) {
      console.log("----show_bottom_card_event", data);
      this.bottom_card_data = data;

      for (var i = 0; i < data.length; i++) {
        var card = this.bottom_card[i];
        var show_data = data[i];
        var call_data = {
          "obj": card,
          "data": show_data
        };
        var run = cc.callFunc(function (target, activedata) {
          var show_card = activedata.obj;
          var show_data = activedata.data;
          show_card.getComponent("card").showCards(show_data);
        }, this, call_data);
        card.runAction(cc.sequence(cc.rotateBy(0, 0, 180), cc.rotateBy(0.2, 0, -90), run, cc.rotateBy(0.2, 0, -90), cc.scaleBy(1, 1.2)));
      }

      common.audio.PlayEffect(this.cardsAudio); //this.node.parent.emit("change_room_state_event",defines.gameState.ROOM_PLAYING)
      //如果自己地主，给加上三张底牌

      if (_mygolbal["default"].playerData.userId === _mygolbal["default"].playerData.masterUserId) {
        this.scheduleOnce(this.pushThreeCard.bind(this), 0.2);
      }
    }.bind(this)); //注册监听一个选择牌消息 
    // this.node.on("choose_card_event", function (cardData) {
    //   this.choose_card_data.push(cardData)
    // }.bind(this))
    // this.node.on("unchoose_card_event", function (cardId) {
    //   for (let i = 0; i < this.choose_card_data.length; i++) {
    //     if (this.choose_card_data[i].index === cardId) {
    //       this.choose_card_data.splice(i, 1)
    //     }
    //   }
    // }.bind(this))
  },
  start: function start() {
    // 监听游戏状态
    if (!CC_EDITOR) {
      ddzData.gameStateNotify.addListener(this.gameStateHandler, this);
    }

    window.$socket.on('_chooseCard', this._chooseCardNotify, this); // 选牌

    window.$socket.on('_unchooseCard', this._unchooseCardNotify, this); // 取消选牌

    window.$socket.on('pushcard_notify', this.pushCardNotify, this); // 发牌

    window.$socket.on('canrob_notify', this.canrobNotify, this); // 抢地主

    window.$socket.on('selfPlayAHandNotify', this.selfPlayAHandNotify, this); // 出牌

    window.$socket.on('rootPlayAHandNotify', this.rootPlayAHandNotify, this); // 机器出牌

    window.$socket.on('gameEndNotify', this.gameEndNotify, this); // 游戏结束
  },
  onDestroy: function onDestroy() {
    if (!CC_EDITOR) {
      ddzData.gameStateNotify.removeListener(this.gameStateHandler, this);
    }

    window.$socket.remove('_chooseCard', this);
    window.$socket.remove('_unchooseCard', this);
    window.$socket.remove('pushcard_notify', this);
    window.$socket.remove('canrob_notify', this);
    window.$socket.remove('selfPlayAHandNotify', this);
    window.$socket.remove('rootPlayAHandNotify', this);
    window.$socket.remove('gameEndNotify', this);
  },
  _chooseCardNotify: function _chooseCardNotify(cardData) {
    this.choose_card_data.push(cardData);
  },
  _unchooseCardNotify: function _unchooseCardNotify(cardId) {
    for (var i = 0; i < this.choose_card_data.length; i++) {
      if (this.choose_card_data[i].index === cardId) {
        this.choose_card_data.splice(i, 1);
      }
    }
  },
  gameStateHandler: function gameStateHandler(state) {
    // 开始游戏 - 已准备
    if (state === ddzConstants.gameState.GAMESTART) {
      // 关闭胜利或失败效果
      this.winNode.active = false;
      this.loseNode.active = false; // 清楚桌面上所有的牌

      this.cards_node = [];
      this.bottom_card = [];
      this.push_card_tmp = [];
      this.cardsNode.removeAllChildren();
      this.bottom_card_pos_node.removeAllChildren();
    }
  },
  pushCardNotify: function pushCardNotify(data) {
    this.card_data = data;
    this.cur_index_card = data.length - 1;
    this.pushCard(data); //左边移动定时器

    this.scheduleOnce(this._runactive_pushcard.bind(this), 0.3);
    this.node.parent.emit("pushcard_other_event");
  },
  //处理发牌的效果
  _runactive_pushcard: function _runactive_pushcard() {
    if (this.cur_index_card < 0) {
      console.log("pushcard end"); //发牌动画完成，显示抢地主按钮
      // this.fapai_end = true
      // if (this.rob_player_accountid === myglobal.playerData.userId) {
      //   this.robUI.active = true
      //   this.customSchedulerOnce()
      // }

      if (isopen_sound) {
        cc.audioEngine.stop(this.fapai_audioID);
      } //通知gamescene节点，倒计时
      // var sendevent = this.rob_player_accountid
      // this.node.parent.emit("canrob_event", sendevent)


      return;
    } //原有逻辑  
    // var move_node = this.cards_node[this.cur_index_card]
    // move_node.active = true
    // var newx = move_node.x + (this.card_width * 0.4*this.cur_index_card) - (this.card_width * 0.4)
    // var action = cc.moveTo(0.1, cc.v2(newx, -250));
    // move_node.runAction(action)
    // this.cur_index_card--
    // this.scheduleOnce(this._runactive_pushcard.bind(this),0.3)


    var move_node = this.cards_node[this.cards_node.length - this.cur_index_card - 1];
    move_node.active = true;
    this.push_card_tmp.push(move_node);
    this.fapai_audioID = common.audio.PlayEffect(this.fapaiAudio);

    for (var i = 0; i < this.push_card_tmp.length - 1; i++) {
      var move_node = this.push_card_tmp[i];
      var newx = move_node.x - this.card_width * 0.4;
      var action = cc.moveTo(0.1, cc.v2(newx, -250));
      move_node.runAction(action);
    }

    this.cur_index_card--;
    this.scheduleOnce(this._runactive_pushcard.bind(this), 0.3);
  },
  // 通知抢地主消息,显示相应的UI
  canrobNotify: function canrobNotify(data) {
    console.log("onCanRobState", data); //这里需要2个变量条件：自己是下一个抢地主，2发牌动画结束
    // this.rob_player_accountid = data

    if (data === _mygolbal["default"].playerData.userId) {
      this.robUI.active = true;
      this.customSchedulerOnce();
    }
  },
  //开启一个定时器
  customSchedulerOnce: function customSchedulerOnce() {
    this.count = 10;

    var callback = function callback() {
      if (!this.robUI.active) return;

      if (!this.count) {
        // 在第六次执行回调时取消这个计时器
        this.robUI.active = false;
        this.unschedule(callback);
        window.$socket.emit('canrob_state_notify', {
          userId: _mygolbal["default"].playerData.userId,
          state: qian_state.buqiang
        });
        common.audio.PlayEffect(this.buqiangAudio);
      }

      this.timeLabel.string = --this.count;
    };

    this.schedule(callback, 1, 10);
  },

  /**
   * @description 出牌
   */
  selfPlayAHandNotify: function selfPlayAHandNotify(promptList) {
    console.log('玩家出牌提示', promptList);
    this.promptCount = 0;
    this.promptList = promptList; // 先清理出牌区域

    this.clearOutZone(_mygolbal["default"].playerData.userId); // 显示可以出牌的UI

    this.playingUI_node.active = true;
  },
  // 机器出牌
  rootPlayAHandNotify: function rootPlayAHandNotify(_ref) {
    var _this = this;

    var userId = _ref.userId,
        cards = _ref.cards;
    var gameScene_script = this.node.parent.getComponent("gameScene"); //获取出牌区域节点

    var outCard_node = gameScene_script.getUserOutCardPosByAccount(userId);
    if (!outCard_node) return;
    outCard_node.removeAllChildren(true);
    var node_cards = [];

    for (var i = 0; i < cards.length; i++) {
      var card = cc.instantiate(this.card_prefab);
      card.getComponent("card").showCards(cards[i], userId);
      node_cards.push(card);
    }

    var delay = common.random(0, 10);
    var playerNode = gameScene_script.getUserNodeByAccount(userId);
    if (!playerNode) return;
    playerNode.schedulerOnce(function () {
      _this.appendOtherCardsToOutZone(outCard_node, node_cards, 0);

      playerNode.subtractCards(cards.length); // 通知服务，下一家出牌

      window.$socket.emit('nextPlayerNotify', userId);
    }, delay);
  },
  // 游戏结束
  gameEndNotify: function gameEndNotify(_ref2) {
    var isWin = _ref2.isWin,
        otherPlayerCards = _ref2.otherPlayerCards;
    console.log('游戏结束', {
      isWin: isWin,
      otherPlayerCards: otherPlayerCards
    });

    if (isWin) {
      this.winNode.active = true;
    } else {
      this.loseNode.active = true;
    }

    ddzData.gameState = ddzConstants.gameState.WAITREADY;
  },
  //对牌排序
  sortCard: function sortCard() {
    this.cards_node.sort(function (x, y) {
      var a = x.getComponent("card").card_data;
      var b = y.getComponent("card").card_data;

      if (a.hasOwnProperty('value') && b.hasOwnProperty('value')) {
        return b.value - a.value;
      }

      if (a.hasOwnProperty('king') && !b.hasOwnProperty('king')) {
        return -1;
      }

      if (!a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
        return 1;
      }

      if (a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
        return b.king - a.king;
      }
    }); //这里使用固定坐标，因为取this.cards_node[0].xk可能排序为完成，导致x错误
    //所以做1000毫秒的延时

    var x = this.cards_node[0].x;
    var timeout = 1000;
    setTimeout(function () {
      //var x = -417.6 
      console.log("sort x:" + x);

      for (var i = 0; i < this.cards_node.length; i++) {
        var card = this.cards_node[i];
        card.zIndex = i; //设置牌的叠加次序,zindex越大显示在上面

        card.x = x + card.width * 0.4 * i;
      }
    }.bind(this), timeout);
  },
  pushCard: function pushCard(data) {
    if (data) {
      data.sort(function (a, b) {
        if (a.hasOwnProperty('value') && b.hasOwnProperty('value')) {
          return b.value - a.value;
        }

        if (a.hasOwnProperty('king') && !b.hasOwnProperty('king')) {
          return -1;
        }

        if (!a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
          return 1;
        }

        if (a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
          return b.king - a.king;
        }
      });
    } //创建card预制体


    this.cards_node = [];

    for (var i = 0; i < 17; i++) {
      var card = cc.instantiate(this.card_prefab);
      card.scale = 0.8; // card.parent = this.node.parent

      card.parent = this.cardsNode;
      card.x = card.width * 0.4 * -0.5 * -16 + card.width * 0.4 * 0; //这里实现为，每发一张牌，放在已经发的牌最后，然后整体移动

      card.y = -250;
      card.active = false;
      card.getComponent("card").showCards(data[i], _mygolbal["default"].playerData.userId); //存储牌的信息,用于后面发牌效果

      this.cards_node.push(card);
      this.card_width = card.width;
    } //创建3张底牌


    this.bottom_card = [];

    for (var i = 0; i < 3; i++) {
      var di_card = cc.instantiate(this.card_prefab);
      di_card.scale = 0.4; // di_card.position = this.bottom_card_pos_node.position
      //三张牌，中间坐标就是bottom_card_pos_node节点坐标，
      //0,和2两张牌左右移动windth*0.4

      if (i == 0) {
        di_card.x = di_card.x - di_card.width * 0.5;
      } else if (i == 2) {
        di_card.x = di_card.x + di_card.width * 0.5;
      } //di_card.x = di_card.width-i*di_card.width-20
      //di_card.y=60
      // di_card.parent = this.node.parent


      di_card.parent = this.bottom_card_pos_node; //存储在容器里

      this.bottom_card.push(di_card);
    }
  },
  //给玩家发送三张底牌后，过1s,把牌设置到y=-250位置效果
  schedulePushThreeCard: function schedulePushThreeCard() {
    for (var i = 0; i < this.cards_node.length; i++) {
      var card = this.cards_node[i];

      if (card.y == -230) {
        card.y = -250;
      }
    }

    this.updateCards();
  },
  //给地主发三张排，并显示在原有牌的后面
  pushThreeCard: function pushThreeCard() {
    //每张牌的其实位置 
    var last_card_x = this.cards_node[this.cards_node.length - 1].x;

    for (var i = 0; i < this.bottom_card_data.length; i++) {
      var card = cc.instantiate(this.card_prefab);
      card.scale = 0.8; // card.parent = this.node.parent

      card.parent = this.cardsNode;
      card.x = last_card_x + (i + 1) * this.card_width * 0.4;
      card.y = -230; //先把底盘放在-230，在设置个定时器下移到-250的位置
      //console.log("pushThreeCard x:"+card.x)

      card.getComponent("card").showCards(this.bottom_card_data[i], _mygolbal["default"].playerData.userId);
      card.active = true;
      this.cards_node.push(card);
    }

    this.sortCard(); //设置一个定时器，在2s后，修改y坐标为-250

    this.scheduleOnce(this.schedulePushThreeCard.bind(this), 2);
  },
  destoryCard: function destoryCard(userId, choose_card) {
    if (!choose_card.length) return;
    /*出牌逻辑
      1. 将选中的牌 从父节点中移除
      2. 从this.cards_node 数组中，删除 选中的牌 
      3. 将 “选中的牌” 添加到出牌区域
          3.1 清空出牌区域
          3.2 添加子节点
          3.3 设置scale
          3.4 设置position
      4.  重新设置手中的牌的位置  this.updateCards();
    */
    //1/2步骤删除自己手上的card节点 

    var destroy_card = [];

    for (var i = 0; i < choose_card.length; i++) {
      for (var j = 0; j < this.cards_node.length; j++) {
        var caardIndex = this.cards_node[j].getComponent("card").caardIndex;

        if (caardIndex == choose_card[i].index) {
          //this.cards_node[j].destroy()
          this.cards_node[j].removeFromParent(true);
          destroy_card.push(this.cards_node[j]);
          this.cards_node.splice(j, 1);
        }
      }
    }

    this.appendCardsToOutZone(userId, destroy_card);
    this.updateCards();
  },
  //清除显示出牌节点全部子节点(就是把出牌的清空)
  clearOutZone: function clearOutZone(userId) {
    var gameScene_script = this.node.parent.getComponent("gameScene");
    var outCard_node = gameScene_script.getUserOutCardPosByAccount(userId);
    var children = outCard_node.children;

    for (var i = 0; i < children.length; i++) {
      var card = children[i];
      card.destroy();
    }

    outCard_node.removeAllChildren(true);
  },
  //对出的牌做排序
  pushCardSort: function pushCardSort(cards) {
    if (cards.length == 1) {
      return;
    }

    cards.sort(function (x, y) {
      var a = x.getComponent("card").card_data;
      var b = y.getComponent("card").card_data;

      if (a.hasOwnProperty('value') && b.hasOwnProperty('value')) {
        return b.value - a.value;
      }

      if (a.hasOwnProperty('king') && !b.hasOwnProperty('king')) {
        return -1;
      }

      if (!a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
        return 1;
      }

      if (a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
        return b.king - a.king;
      }
    });
  },

  /**
   * @description 桌面添加新牌
   * @param {cc.Node} outCard_node 玩家出牌区域节点
   * @param {List} cards 牌型节点集合
   * @param {Number} yoffset 移动距离
   */
  appendOtherCardsToOutZone: function appendOtherCardsToOutZone(outCard_node, cards, yoffset) {
    if (!cards.length) {
      var index = common.random(0, 2);
      common.audio.PlayEffect(this.buyaoAudio[index]);
      return;
    }

    common.audio.PlayEffect(this.chupaiAudio); //添加新的子节点

    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      outCard_node.addChild(card, 100 + i); //第二个参数是 zorder,保证牌不能被遮住
    } //对出牌进行排序
    //设置出牌节点的坐标


    var zPoint = cards.length / 2;

    for (var i = 0; i < cards.length; i++) {
      var cardNode = outCard_node.getChildren()[i];
      var x = (i - zPoint) * 30;
      var y = cardNode.y + yoffset; //因为每个节点需要的Y不一样，做参数传入

      cardNode.setScale(0.5, 0.5);
      cardNode.setPosition(x, y);
    }
  },
  //将 “选中的牌” 添加到出牌区域
  //destroy_card是玩家本次出的牌
  appendCardsToOutZone: function appendCardsToOutZone(userId, destroy_card) {
    if (!destroy_card.length) return; //先给本次出的牌做一个排序

    this.pushCardSort(destroy_card);
    var gameScene_script = this.node.parent.getComponent("gameScene"); //获取出牌区域节点

    var outCard_node = gameScene_script.getUserOutCardPosByAccount(userId);
    this.appendOtherCardsToOutZone(outCard_node, destroy_card, 360); //sconsole.log("OutZone:"+outCard_node.name)
  },
  //重新排序手上的牌,并移动
  updateCards: function updateCards() {
    var zeroPoint = this.cards_node.length / 2; //var last_card_x = this.cards_node[this.cards_node.length-1].x

    for (var i = 0; i < this.cards_node.length; i++) {
      var cardNode = this.cards_node[i];
      var x = (i - zeroPoint) * (this.card_width * 0.4) + 50;
      cardNode.setPosition(x, -250);
    }
  },
  playPushCardSound: function playPushCardSound(card_name) {
    console.log("playPushCardSound:" + card_name);
    if (card_name == "") return;

    switch (card_name) {
      case CardsValue.one.name:
        break;

      case CardsValue["double"].name:
        if (isopen_sound) {
          cc.audioEngine.play(cc.url.raw("resources/sound/duizi.mp3"));
        }

        break;
    }
  },
  // update (dt) {},
  onButtonClick: function onButtonClick(event, customData) {
    var _this2 = this;

    switch (customData) {
      case "btn_qiandz":
        // 不抢
        // myglobal.socket.requestRobState(qian_state.qiang)
        window.$socket.emit('canrob_state_notify', {
          userId: _mygolbal["default"].playerData.userId,
          state: qian_state.qiang
        });
        this.robUI.active = false;
        common.audio.PlayEffect(this.jiaodizhuAudio);
        break;

      case "btn_buqiandz":
        // 抢地主
        // myglobal.socket.requestRobState(qian_state.buqiang)
        window.$socket.emit('canrob_state_notify', {
          userId: _mygolbal["default"].playerData.userId,
          state: qian_state.buqiang
        });
        this.robUI.active = false;
        common.audio.PlayEffect(this.buqiangAudio);
        break;

      case "nopushcard":
        // 不出牌
        // myglobal.socket.request_buchu_card([], null)
        window.$socket.emit('nextPlayerNotify', _mygolbal["default"].playerData.userId);
        var index = this.promptList.length ? common.random(0, 2) : 3;
        common.audio.PlayEffect(this.buyaoAudio[index]);
        this.choose_card_data = [];
        this.cards_node.map(function (node) {
          return node.emit("reset_card_flag");
        });
        this.playingUI_node.active = false;
        break;

      case "pushcard":
        // 出牌
        //先获取本次出牌数据
        if (this.choose_card_data.length == 0) {
          this.tipsLabel.string = "请选择牌!";
          setTimeout(function () {
            this.tipsLabel.string = "";
          }.bind(this), 2000);
        }

        window.$socket.emit('playAHandNotify', {
          userId: _mygolbal["default"].playerData.userId,
          cards: this.choose_card_data
        }, function (_ref3) {
          var state = _ref3.state;

          if (state === 1) {
            _this2.destoryCard(_mygolbal["default"].playerData.userId, _this2.choose_card_data);

            _this2.playingUI_node.active = false;
          } else {
            //出牌失败，把选择的牌归位
            _this2.cards_node.map(function (node) {
              return node.emit("reset_card_flag");
            }); // for (let i = 0; i < this.cards_node.length; i++) {
            //   this.cards_node[i].emit("reset_card_flag")
            // }

          }

          _this2.choose_card_data = [];
        }); // myglobal.socket.request_chu_card(this.choose_card_data, function (err, data) {
        //   if (err) {
        //     console.log("request_chu_card:" + err)
        //     console.log("request_chu_card" + JSON.stringify(data))
        //     if (this.tipsLabel.string == "") {
        //       this.tipsLabel.string = data.msg
        //       setTimeout(function () {
        //         this.tipsLabel.string = ""
        //       }.bind(this), 2000);
        //     }
        //     //出牌失败，把选择的牌归位
        //     for (var i = 0; i < this.cards_node.length; i++) {
        //       var card = this.cards_node[i]
        //       card.emit("reset_card_flag")
        //     }
        //     this.choose_card_data = []
        //   } else {
        //     //出牌成功
        //     console.log("resp_chu_card data:" + JSON.stringify(data))
        //     this.playingUI_node.active = false
        //     //播放出牌的声音
        //     //resp_chu_card data:{"account":"2519901","msg":"sucess","cardvalue":{"name":"Double","value":1}}
        //     //{"type":"other_chucard_notify","result":0,"data":{"userId":"2519901","cards":[{"index":24,"card_data":{"index":24,"value":6,"shape":1}},{"index":26,"card_data":{"index":26,"value":6,"shape":3}}]},"callBackIndex":0}
        //     this.playPushCardSound(data.cardvalue.name)
        //     this.destoryCard(data.account, this.choose_card_data)
        //     this.choose_card_data = []
        //   }
        // }.bind(this))

        break;

      case "tipcard":
        // 提示
        // 已选牌归位
        this.choose_card_data = [];
        this.cards_node.map(function (node) {
          return node.emit("reset_card_flag");
        }); // 根据提示牌型显示

        if (this.promptList.length) {
          var _index = this.promptCount % this.promptList.length;

          var promptCards = this.promptList[_index];
          var cardsNode = this.cards_node;

          for (var i = 0; i < promptCards.length; i++) {
            var card = promptCards[i];

            for (var j = 0; j < cardsNode.length; j++) {
              var cardJs = cardsNode[j].getComponent("card");
              var cardData = cardJs.card_data;

              if (cardData.val === card.val && cardData.shape === card.shape) {
                cardJs.node.emit(cc.Node.EventType.TOUCH_START);
              }
            }
          }
        }

        this.promptCount++;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxnYW1lU2NlbmUvLi5cXC4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHNjcmlwdHNcXGdhbWVTY2VuZS9hc3NldHNcXHNjcmlwdHNcXGdhbWVTY2VuZVxcZ2FtZWluZ1VJLmpzIl0sIm5hbWVzIjpbImRkekNvbnN0YW50cyIsInJlcXVpcmUiLCJkZHpEYXRhIiwiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJnYW1laW5nVUkiLCJOb2RlIiwiY2FyZF9wcmVmYWIiLCJQcmVmYWIiLCJyb2JVSSIsInRpbWVMYWJlbCIsIkxhYmVsIiwiY2FyZHNOb2RlIiwiYm90dG9tX2NhcmRfcG9zX25vZGUiLCJwbGF5aW5nVUlfbm9kZSIsInRpcHNMYWJlbCIsImxvc2VOb2RlIiwid2luTm9kZSIsImZhcGFpQXVkaW8iLCJ0eXBlIiwiQXVkaW9DbGlwIiwiamlhb2Rpemh1QXVkaW8iLCJidXFpYW5nQXVkaW8iLCJjYXJkc0F1ZGlvIiwiYnV5YW9BdWRpbyIsImNodXBhaUF1ZGlvIiwib25Mb2FkIiwiY2FyZHNfbm9kZSIsImNhcmRfd2lkdGgiLCJib3R0b21fY2FyZCIsImJvdHRvbV9jYXJkX2RhdGEiLCJjaG9vc2VfY2FyZF9kYXRhIiwib3V0Y2FyX3pvbmUiLCJwdXNoX2NhcmRfdG1wIiwicHJvbXB0Q291bnQiLCJwcm9tcHRMaXN0Iiwibm9kZSIsIm9uIiwiZGF0YSIsImNvbnNvbGUiLCJsb2ciLCJpIiwibGVuZ3RoIiwiY2FyZCIsInNob3dfZGF0YSIsImNhbGxfZGF0YSIsInJ1biIsImNhbGxGdW5jIiwidGFyZ2V0IiwiYWN0aXZlZGF0YSIsInNob3dfY2FyZCIsIm9iaiIsImdldENvbXBvbmVudCIsInNob3dDYXJkcyIsInJ1bkFjdGlvbiIsInNlcXVlbmNlIiwicm90YXRlQnkiLCJzY2FsZUJ5IiwiY29tbW9uIiwiYXVkaW8iLCJQbGF5RWZmZWN0IiwibXlnbG9iYWwiLCJwbGF5ZXJEYXRhIiwidXNlcklkIiwibWFzdGVyVXNlcklkIiwic2NoZWR1bGVPbmNlIiwicHVzaFRocmVlQ2FyZCIsImJpbmQiLCJzdGFydCIsIkNDX0VESVRPUiIsImdhbWVTdGF0ZU5vdGlmeSIsImFkZExpc3RlbmVyIiwiZ2FtZVN0YXRlSGFuZGxlciIsIndpbmRvdyIsIiRzb2NrZXQiLCJfY2hvb3NlQ2FyZE5vdGlmeSIsIl91bmNob29zZUNhcmROb3RpZnkiLCJwdXNoQ2FyZE5vdGlmeSIsImNhbnJvYk5vdGlmeSIsInNlbGZQbGF5QUhhbmROb3RpZnkiLCJyb290UGxheUFIYW5kTm90aWZ5IiwiZ2FtZUVuZE5vdGlmeSIsIm9uRGVzdHJveSIsInJlbW92ZUxpc3RlbmVyIiwicmVtb3ZlIiwiY2FyZERhdGEiLCJwdXNoIiwiY2FyZElkIiwiaW5kZXgiLCJzcGxpY2UiLCJzdGF0ZSIsImdhbWVTdGF0ZSIsIkdBTUVTVEFSVCIsImFjdGl2ZSIsInJlbW92ZUFsbENoaWxkcmVuIiwiY2FyZF9kYXRhIiwiY3VyX2luZGV4X2NhcmQiLCJwdXNoQ2FyZCIsIl9ydW5hY3RpdmVfcHVzaGNhcmQiLCJwYXJlbnQiLCJlbWl0IiwiaXNvcGVuX3NvdW5kIiwiYXVkaW9FbmdpbmUiLCJzdG9wIiwiZmFwYWlfYXVkaW9JRCIsIm1vdmVfbm9kZSIsIm5ld3giLCJ4IiwiYWN0aW9uIiwibW92ZVRvIiwidjIiLCJjdXN0b21TY2hlZHVsZXJPbmNlIiwiY291bnQiLCJjYWxsYmFjayIsInVuc2NoZWR1bGUiLCJxaWFuX3N0YXRlIiwiYnVxaWFuZyIsInN0cmluZyIsInNjaGVkdWxlIiwiY2xlYXJPdXRab25lIiwiY2FyZHMiLCJnYW1lU2NlbmVfc2NyaXB0Iiwib3V0Q2FyZF9ub2RlIiwiZ2V0VXNlck91dENhcmRQb3NCeUFjY291bnQiLCJub2RlX2NhcmRzIiwiaW5zdGFudGlhdGUiLCJkZWxheSIsInJhbmRvbSIsInBsYXllck5vZGUiLCJnZXRVc2VyTm9kZUJ5QWNjb3VudCIsInNjaGVkdWxlck9uY2UiLCJhcHBlbmRPdGhlckNhcmRzVG9PdXRab25lIiwic3VidHJhY3RDYXJkcyIsImlzV2luIiwib3RoZXJQbGF5ZXJDYXJkcyIsIldBSVRSRUFEWSIsInNvcnRDYXJkIiwic29ydCIsInkiLCJhIiwiYiIsImhhc093blByb3BlcnR5IiwidmFsdWUiLCJraW5nIiwidGltZW91dCIsInNldFRpbWVvdXQiLCJ6SW5kZXgiLCJ3aWR0aCIsInNjYWxlIiwiZGlfY2FyZCIsInNjaGVkdWxlUHVzaFRocmVlQ2FyZCIsInVwZGF0ZUNhcmRzIiwibGFzdF9jYXJkX3giLCJkZXN0b3J5Q2FyZCIsImNob29zZV9jYXJkIiwiZGVzdHJveV9jYXJkIiwiaiIsImNhYXJkSW5kZXgiLCJyZW1vdmVGcm9tUGFyZW50IiwiYXBwZW5kQ2FyZHNUb091dFpvbmUiLCJjaGlsZHJlbiIsImRlc3Ryb3kiLCJwdXNoQ2FyZFNvcnQiLCJ5b2Zmc2V0IiwiYWRkQ2hpbGQiLCJ6UG9pbnQiLCJjYXJkTm9kZSIsImdldENoaWxkcmVuIiwic2V0U2NhbGUiLCJzZXRQb3NpdGlvbiIsInplcm9Qb2ludCIsInBsYXlQdXNoQ2FyZFNvdW5kIiwiY2FyZF9uYW1lIiwiQ2FyZHNWYWx1ZSIsIm9uZSIsIm5hbWUiLCJwbGF5IiwidXJsIiwicmF3Iiwib25CdXR0b25DbGljayIsImV2ZW50IiwiY3VzdG9tRGF0YSIsInFpYW5nIiwibWFwIiwicHJvbXB0Q2FyZHMiLCJjYXJkSnMiLCJ2YWwiLCJzaGFwZSIsIkV2ZW50VHlwZSIsIlRPVUNIX1NUQVJUIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0EsSUFBTUEsWUFBWSxHQUFHQyxPQUFPLENBQUMsY0FBRCxDQUE1Qjs7QUFDQSxJQUFNQyxPQUFPLEdBQUdELE9BQU8sQ0FBQyxTQUFELENBQXZCOztBQUVBRSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNQLGFBQVNELEVBQUUsQ0FBQ0UsU0FETDtBQUdQQyxFQUFBQSxVQUFVLEVBQUU7QUFDVkMsSUFBQUEsU0FBUyxFQUFFSixFQUFFLENBQUNLLElBREo7QUFFVkMsSUFBQUEsV0FBVyxFQUFFTixFQUFFLENBQUNPLE1BRk47QUFHVkMsSUFBQUEsS0FBSyxFQUFFUixFQUFFLENBQUNLLElBSEE7QUFHTTtBQUNoQkksSUFBQUEsU0FBUyxFQUFFVCxFQUFFLENBQUNVLEtBSko7QUFJVztBQUNyQkMsSUFBQUEsU0FBUyxFQUFFWCxFQUFFLENBQUNLLElBTEo7QUFLVTtBQUNwQk8sSUFBQUEsb0JBQW9CLEVBQUVaLEVBQUUsQ0FBQ0ssSUFOZjtBQU1xQjtBQUMvQlEsSUFBQUEsY0FBYyxFQUFFYixFQUFFLENBQUNLLElBUFQ7QUFPZTtBQUN6QlMsSUFBQUEsU0FBUyxFQUFFZCxFQUFFLENBQUNVLEtBUko7QUFRVztBQUNyQkssSUFBQUEsUUFBUSxFQUFFZixFQUFFLENBQUNLLElBVEg7QUFTUztBQUNuQlcsSUFBQUEsT0FBTyxFQUFFaEIsRUFBRSxDQUFDSyxJQVZGO0FBVVE7QUFDbEJZLElBQUFBLFVBQVUsRUFBRTtBQUNWQyxNQUFBQSxJQUFJLEVBQUVsQixFQUFFLENBQUNtQixTQURDO0FBRVYsaUJBQVM7QUFGQyxLQVhGO0FBZVZDLElBQUFBLGNBQWMsRUFBRTtBQUNkRixNQUFBQSxJQUFJLEVBQUVsQixFQUFFLENBQUNtQixTQURLO0FBRWQsaUJBQVM7QUFGSyxLQWZOO0FBbUJWRSxJQUFBQSxZQUFZLEVBQUU7QUFDWkgsTUFBQUEsSUFBSSxFQUFFbEIsRUFBRSxDQUFDbUIsU0FERztBQUVaLGlCQUFTO0FBRkcsS0FuQko7QUF1QlZHLElBQUFBLFVBQVUsRUFBRTtBQUNWSixNQUFBQSxJQUFJLEVBQUVsQixFQUFFLENBQUNtQixTQURDO0FBRVYsaUJBQVM7QUFGQyxLQXZCRjtBQTJCVkksSUFBQUEsVUFBVSxFQUFFO0FBQ1ZMLE1BQUFBLElBQUksRUFBRWxCLEVBQUUsQ0FBQ21CLFNBREM7QUFFVixpQkFBUztBQUZDLEtBM0JGO0FBK0JWSyxJQUFBQSxXQUFXLEVBQUU7QUFDWE4sTUFBQUEsSUFBSSxFQUFFbEIsRUFBRSxDQUFDbUIsU0FERTtBQUVYLGlCQUFTO0FBRkU7QUEvQkgsR0FITDtBQXdDUE0sRUFBQUEsTUF4Q08sb0JBd0NFO0FBQ1A7QUFDQSxTQUFLQyxVQUFMLEdBQWtCLEVBQWxCO0FBQ0EsU0FBS0MsVUFBTCxHQUFrQixDQUFsQixDQUhPLENBSVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxTQUFLQyxXQUFMLEdBQW1CLEVBQW5CLENBVE8sQ0FVUDs7QUFDQSxTQUFLQyxnQkFBTCxHQUF3QixFQUF4QjtBQUNBLFNBQUtDLGdCQUFMLEdBQXdCLEVBQXhCO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQixFQUFuQjtBQUVBLFNBQUtDLGFBQUwsR0FBcUIsRUFBckIsQ0FmTyxDQWdCUDs7QUFDQSxTQUFLQyxXQUFMLEdBQW1CLENBQW5CO0FBQ0EsU0FBS0MsVUFBTCxHQUFrQixFQUFsQixDQWxCTyxDQW1CUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBQ0EsU0FBS0MsSUFBTCxDQUFVQyxFQUFWLENBQWEsd0JBQWIsRUFBdUMsVUFBVUMsSUFBVixFQUFnQjtBQUNyREMsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksNEJBQVosRUFBMENGLElBQTFDO0FBQ0EsV0FBS1IsZ0JBQUwsR0FBd0JRLElBQXhCOztBQUNBLFdBQUssSUFBSUcsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0gsSUFBSSxDQUFDSSxNQUF6QixFQUFpQ0QsQ0FBQyxFQUFsQyxFQUFzQztBQUNwQyxZQUFJRSxJQUFJLEdBQUcsS0FBS2QsV0FBTCxDQUFpQlksQ0FBakIsQ0FBWDtBQUNBLFlBQUlHLFNBQVMsR0FBR04sSUFBSSxDQUFDRyxDQUFELENBQXBCO0FBQ0EsWUFBSUksU0FBUyxHQUFHO0FBQ2QsaUJBQU9GLElBRE87QUFFZCxrQkFBUUM7QUFGTSxTQUFoQjtBQUlBLFlBQUlFLEdBQUcsR0FBRzdDLEVBQUUsQ0FBQzhDLFFBQUgsQ0FBWSxVQUFVQyxNQUFWLEVBQWtCQyxVQUFsQixFQUE4QjtBQUNsRCxjQUFJQyxTQUFTLEdBQUdELFVBQVUsQ0FBQ0UsR0FBM0I7QUFDQSxjQUFJUCxTQUFTLEdBQUdLLFVBQVUsQ0FBQ1gsSUFBM0I7QUFDQVksVUFBQUEsU0FBUyxDQUFDRSxZQUFWLENBQXVCLE1BQXZCLEVBQStCQyxTQUEvQixDQUF5Q1QsU0FBekM7QUFDRCxTQUpTLEVBSVAsSUFKTyxFQUlEQyxTQUpDLENBQVY7QUFNQUYsUUFBQUEsSUFBSSxDQUFDVyxTQUFMLENBQ0VyRCxFQUFFLENBQUNzRCxRQUFILENBQVl0RCxFQUFFLENBQUN1RCxRQUFILENBQVksQ0FBWixFQUFlLENBQWYsRUFBa0IsR0FBbEIsQ0FBWixFQUNFdkQsRUFBRSxDQUFDdUQsUUFBSCxDQUFZLEdBQVosRUFBaUIsQ0FBakIsRUFBb0IsQ0FBQyxFQUFyQixDQURGLEVBRUVWLEdBRkYsRUFHRTdDLEVBQUUsQ0FBQ3VELFFBQUgsQ0FBWSxHQUFaLEVBQWlCLENBQWpCLEVBQW9CLENBQUMsRUFBckIsQ0FIRixFQUlFdkQsRUFBRSxDQUFDd0QsT0FBSCxDQUFXLENBQVgsRUFBYyxHQUFkLENBSkYsQ0FERjtBQU9EOztBQUNEQyxNQUFBQSxNQUFNLENBQUNDLEtBQVAsQ0FBYUMsVUFBYixDQUF3QixLQUFLckMsVUFBN0IsRUF4QnFELENBeUJyRDtBQUNBOztBQUNBLFVBQUlzQyxxQkFBU0MsVUFBVCxDQUFvQkMsTUFBcEIsS0FBK0JGLHFCQUFTQyxVQUFULENBQW9CRSxZQUF2RCxFQUFxRTtBQUNuRSxhQUFLQyxZQUFMLENBQWtCLEtBQUtDLGFBQUwsQ0FBbUJDLElBQW5CLENBQXdCLElBQXhCLENBQWxCLEVBQWlELEdBQWpEO0FBQ0Q7QUFHRixLQWhDc0MsQ0FnQ3JDQSxJQWhDcUMsQ0FnQ2hDLElBaENnQyxDQUF2QyxFQXpETyxDQTJGUDtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0QsR0EvSU07QUFnSlBDLEVBQUFBLEtBaEpPLG1CQWdKQztBQUNOO0FBQ0EsUUFBSSxDQUFDQyxTQUFMLEVBQWdCO0FBQ2RyRSxNQUFBQSxPQUFPLENBQUNzRSxlQUFSLENBQXdCQyxXQUF4QixDQUFvQyxLQUFLQyxnQkFBekMsRUFBMkQsSUFBM0Q7QUFDRDs7QUFDREMsSUFBQUEsTUFBTSxDQUFDQyxPQUFQLENBQWVyQyxFQUFmLENBQWtCLGFBQWxCLEVBQWlDLEtBQUtzQyxpQkFBdEMsRUFBeUQsSUFBekQsRUFMTSxDQUt5RDs7QUFDL0RGLElBQUFBLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlckMsRUFBZixDQUFrQixlQUFsQixFQUFtQyxLQUFLdUMsbUJBQXhDLEVBQTZELElBQTdELEVBTk0sQ0FNNkQ7O0FBQ25FSCxJQUFBQSxNQUFNLENBQUNDLE9BQVAsQ0FBZXJDLEVBQWYsQ0FBa0IsaUJBQWxCLEVBQXFDLEtBQUt3QyxjQUExQyxFQUEwRCxJQUExRCxFQVBNLENBTzBEOztBQUNoRUosSUFBQUEsTUFBTSxDQUFDQyxPQUFQLENBQWVyQyxFQUFmLENBQWtCLGVBQWxCLEVBQW1DLEtBQUt5QyxZQUF4QyxFQUFzRCxJQUF0RCxFQVJNLENBUXNEOztBQUM1REwsSUFBQUEsTUFBTSxDQUFDQyxPQUFQLENBQWVyQyxFQUFmLENBQWtCLHFCQUFsQixFQUF5QyxLQUFLMEMsbUJBQTlDLEVBQW1FLElBQW5FLEVBVE0sQ0FTbUU7O0FBQ3pFTixJQUFBQSxNQUFNLENBQUNDLE9BQVAsQ0FBZXJDLEVBQWYsQ0FBa0IscUJBQWxCLEVBQXlDLEtBQUsyQyxtQkFBOUMsRUFBbUUsSUFBbkUsRUFWTSxDQVVtRTs7QUFDekVQLElBQUFBLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlckMsRUFBZixDQUFrQixlQUFsQixFQUFtQyxLQUFLNEMsYUFBeEMsRUFBdUQsSUFBdkQsRUFYTSxDQVd1RDtBQUM5RCxHQTVKTTtBQTZKUEMsRUFBQUEsU0E3Sk8sdUJBNkpLO0FBQ1YsUUFBSSxDQUFDYixTQUFMLEVBQWdCO0FBQ2RyRSxNQUFBQSxPQUFPLENBQUNzRSxlQUFSLENBQXdCYSxjQUF4QixDQUF1QyxLQUFLWCxnQkFBNUMsRUFBOEQsSUFBOUQ7QUFDRDs7QUFDREMsSUFBQUEsTUFBTSxDQUFDQyxPQUFQLENBQWVVLE1BQWYsQ0FBc0IsYUFBdEIsRUFBcUMsSUFBckM7QUFDQVgsSUFBQUEsTUFBTSxDQUFDQyxPQUFQLENBQWVVLE1BQWYsQ0FBc0IsZUFBdEIsRUFBdUMsSUFBdkM7QUFDQVgsSUFBQUEsTUFBTSxDQUFDQyxPQUFQLENBQWVVLE1BQWYsQ0FBc0IsaUJBQXRCLEVBQXlDLElBQXpDO0FBQ0FYLElBQUFBLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlVSxNQUFmLENBQXNCLGVBQXRCLEVBQXVDLElBQXZDO0FBQ0FYLElBQUFBLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlVSxNQUFmLENBQXNCLHFCQUF0QixFQUE2QyxJQUE3QztBQUNBWCxJQUFBQSxNQUFNLENBQUNDLE9BQVAsQ0FBZVUsTUFBZixDQUFzQixxQkFBdEIsRUFBNkMsSUFBN0M7QUFDQVgsSUFBQUEsTUFBTSxDQUFDQyxPQUFQLENBQWVVLE1BQWYsQ0FBc0IsZUFBdEIsRUFBdUMsSUFBdkM7QUFDRCxHQXhLTTtBQXlLUFQsRUFBQUEsaUJBektPLDZCQXlLV1UsUUF6S1gsRUF5S3FCO0FBQzFCLFNBQUt0RCxnQkFBTCxDQUFzQnVELElBQXRCLENBQTJCRCxRQUEzQjtBQUNELEdBM0tNO0FBNEtQVCxFQUFBQSxtQkE1S08sK0JBNEthVyxNQTVLYixFQTRLcUI7QUFDMUIsU0FBSyxJQUFJOUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxLQUFLVixnQkFBTCxDQUFzQlcsTUFBMUMsRUFBa0RELENBQUMsRUFBbkQsRUFBdUQ7QUFDckQsVUFBSSxLQUFLVixnQkFBTCxDQUFzQlUsQ0FBdEIsRUFBeUIrQyxLQUF6QixLQUFtQ0QsTUFBdkMsRUFBK0M7QUFDN0MsYUFBS3hELGdCQUFMLENBQXNCMEQsTUFBdEIsQ0FBNkJoRCxDQUE3QixFQUFnQyxDQUFoQztBQUNEO0FBQ0Y7QUFDRixHQWxMTTtBQW1MUCtCLEVBQUFBLGdCQW5MTyw0QkFtTFVrQixLQW5MVixFQW1MaUI7QUFDdEI7QUFDQSxRQUFJQSxLQUFLLEtBQUs1RixZQUFZLENBQUM2RixTQUFiLENBQXVCQyxTQUFyQyxFQUFnRDtBQUM5QztBQUNBLFdBQUszRSxPQUFMLENBQWE0RSxNQUFiLEdBQXNCLEtBQXRCO0FBQ0EsV0FBSzdFLFFBQUwsQ0FBYzZFLE1BQWQsR0FBdUIsS0FBdkIsQ0FIOEMsQ0FJOUM7O0FBQ0EsV0FBS2xFLFVBQUwsR0FBa0IsRUFBbEI7QUFDQSxXQUFLRSxXQUFMLEdBQW1CLEVBQW5CO0FBQ0EsV0FBS0ksYUFBTCxHQUFxQixFQUFyQjtBQUNBLFdBQUtyQixTQUFMLENBQWVrRixpQkFBZjtBQUNBLFdBQUtqRixvQkFBTCxDQUEwQmlGLGlCQUExQjtBQUNEO0FBQ0YsR0FoTU07QUFpTVBqQixFQUFBQSxjQWpNTywwQkFpTVF2QyxJQWpNUixFQWlNYztBQUNuQixTQUFLeUQsU0FBTCxHQUFpQnpELElBQWpCO0FBQ0EsU0FBSzBELGNBQUwsR0FBc0IxRCxJQUFJLENBQUNJLE1BQUwsR0FBYyxDQUFwQztBQUNBLFNBQUt1RCxRQUFMLENBQWMzRCxJQUFkLEVBSG1CLENBSW5COztBQUNBLFNBQUsyQixZQUFMLENBQWtCLEtBQUtpQyxtQkFBTCxDQUF5Qi9CLElBQXpCLENBQThCLElBQTlCLENBQWxCLEVBQXVELEdBQXZEO0FBQ0EsU0FBSy9CLElBQUwsQ0FBVStELE1BQVYsQ0FBaUJDLElBQWpCLENBQXNCLHNCQUF0QjtBQUNELEdBeE1NO0FBeU1QO0FBQ0FGLEVBQUFBLG1CQTFNTyxpQ0EwTWU7QUFDcEIsUUFBSSxLQUFLRixjQUFMLEdBQXNCLENBQTFCLEVBQTZCO0FBQzNCekQsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksY0FBWixFQUQyQixDQUUzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsVUFBSTZELFlBQUosRUFBa0I7QUFDaEJwRyxRQUFBQSxFQUFFLENBQUNxRyxXQUFILENBQWVDLElBQWYsQ0FBb0IsS0FBS0MsYUFBekI7QUFDRCxPQVYwQixDQVczQjtBQUNBO0FBQ0E7OztBQUNBO0FBQ0QsS0FoQm1CLENBaUJwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQSxRQUFJQyxTQUFTLEdBQUcsS0FBSzlFLFVBQUwsQ0FBZ0IsS0FBS0EsVUFBTCxDQUFnQmUsTUFBaEIsR0FBeUIsS0FBS3NELGNBQTlCLEdBQStDLENBQS9ELENBQWhCO0FBQ0FTLElBQUFBLFNBQVMsQ0FBQ1osTUFBVixHQUFtQixJQUFuQjtBQUNBLFNBQUs1RCxhQUFMLENBQW1CcUQsSUFBbkIsQ0FBd0JtQixTQUF4QjtBQUNBLFNBQUtELGFBQUwsR0FBcUI5QyxNQUFNLENBQUNDLEtBQVAsQ0FBYUMsVUFBYixDQUF3QixLQUFLMUMsVUFBN0IsQ0FBckI7O0FBQ0EsU0FBSyxJQUFJdUIsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxLQUFLUixhQUFMLENBQW1CUyxNQUFuQixHQUE0QixDQUFoRCxFQUFtREQsQ0FBQyxFQUFwRCxFQUF3RDtBQUN0RCxVQUFJZ0UsU0FBUyxHQUFHLEtBQUt4RSxhQUFMLENBQW1CUSxDQUFuQixDQUFoQjtBQUNBLFVBQUlpRSxJQUFJLEdBQUdELFNBQVMsQ0FBQ0UsQ0FBVixHQUFlLEtBQUsvRSxVQUFMLEdBQWtCLEdBQTVDO0FBQ0EsVUFBSWdGLE1BQU0sR0FBRzNHLEVBQUUsQ0FBQzRHLE1BQUgsQ0FBVSxHQUFWLEVBQWU1RyxFQUFFLENBQUM2RyxFQUFILENBQU1KLElBQU4sRUFBWSxDQUFDLEdBQWIsQ0FBZixDQUFiO0FBQ0FELE1BQUFBLFNBQVMsQ0FBQ25ELFNBQVYsQ0FBb0JzRCxNQUFwQjtBQUNEOztBQUVELFNBQUtaLGNBQUw7QUFDQSxTQUFLL0IsWUFBTCxDQUFrQixLQUFLaUMsbUJBQUwsQ0FBeUIvQixJQUF6QixDQUE4QixJQUE5QixDQUFsQixFQUF1RCxHQUF2RDtBQUNELEdBalBNO0FBa1BQO0FBQ0FXLEVBQUFBLFlBblBPLHdCQW1QTXhDLElBblBOLEVBbVBZO0FBQ2pCQyxJQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxlQUFaLEVBQTZCRixJQUE3QixFQURpQixDQUVqQjtBQUNBOztBQUNBLFFBQUlBLElBQUksS0FBS3VCLHFCQUFTQyxVQUFULENBQW9CQyxNQUFqQyxFQUF5QztBQUN2QyxXQUFLdEQsS0FBTCxDQUFXb0YsTUFBWCxHQUFvQixJQUFwQjtBQUNBLFdBQUtrQixtQkFBTDtBQUNEO0FBQ0YsR0EzUE07QUE0UFA7QUFDQUEsRUFBQUEsbUJBN1BPLGlDQTZQZTtBQUNwQixTQUFLQyxLQUFMLEdBQWEsRUFBYjs7QUFDQSxRQUFNQyxRQUFRLEdBQUcsU0FBWEEsUUFBVyxHQUFZO0FBQzNCLFVBQUksQ0FBQyxLQUFLeEcsS0FBTCxDQUFXb0YsTUFBaEIsRUFBd0I7O0FBQ3hCLFVBQUksQ0FBQyxLQUFLbUIsS0FBVixFQUFpQjtBQUNmO0FBQ0EsYUFBS3ZHLEtBQUwsQ0FBV29GLE1BQVgsR0FBb0IsS0FBcEI7QUFDQSxhQUFLcUIsVUFBTCxDQUFnQkQsUUFBaEI7QUFDQXhDLFFBQUFBLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlMEIsSUFBZixDQUFvQixxQkFBcEIsRUFBMkM7QUFDekNyQyxVQUFBQSxNQUFNLEVBQUVGLHFCQUFTQyxVQUFULENBQW9CQyxNQURhO0FBRXpDMkIsVUFBQUEsS0FBSyxFQUFFeUIsVUFBVSxDQUFDQztBQUZ1QixTQUEzQztBQUlBMUQsUUFBQUEsTUFBTSxDQUFDQyxLQUFQLENBQWFDLFVBQWIsQ0FBd0IsS0FBS3RDLFlBQTdCO0FBQ0Q7O0FBQ0QsV0FBS1osU0FBTCxDQUFlMkcsTUFBZixHQUF3QixFQUFFLEtBQUtMLEtBQS9CO0FBQ0QsS0FiRDs7QUFjQSxTQUFLTSxRQUFMLENBQWNMLFFBQWQsRUFBd0IsQ0FBeEIsRUFBMkIsRUFBM0I7QUFDRCxHQTlRTTs7QUErUVA7OztBQUdBbEMsRUFBQUEsbUJBbFJPLCtCQWtSYTVDLFVBbFJiLEVBa1J5QjtBQUM5QkksSUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksUUFBWixFQUFzQkwsVUFBdEI7QUFDQSxTQUFLRCxXQUFMLEdBQW1CLENBQW5CO0FBQ0EsU0FBS0MsVUFBTCxHQUFrQkEsVUFBbEIsQ0FIOEIsQ0FJOUI7O0FBQ0EsU0FBS29GLFlBQUwsQ0FBa0IxRCxxQkFBU0MsVUFBVCxDQUFvQkMsTUFBdEMsRUFMOEIsQ0FNOUI7O0FBQ0EsU0FBS2pELGNBQUwsQ0FBb0IrRSxNQUFwQixHQUE2QixJQUE3QjtBQUNELEdBMVJNO0FBMlJQO0FBQ0FiLEVBQUFBLG1CQTVSTyxxQ0E0UmdDO0FBQUE7O0FBQUEsUUFBakJqQixNQUFpQixRQUFqQkEsTUFBaUI7QUFBQSxRQUFUeUQsS0FBUyxRQUFUQSxLQUFTO0FBQ3JDLFFBQUlDLGdCQUFnQixHQUFHLEtBQUtyRixJQUFMLENBQVUrRCxNQUFWLENBQWlCL0MsWUFBakIsQ0FBOEIsV0FBOUIsQ0FBdkIsQ0FEcUMsQ0FFckM7O0FBQ0EsUUFBSXNFLFlBQVksR0FBR0QsZ0JBQWdCLENBQUNFLDBCQUFqQixDQUE0QzVELE1BQTVDLENBQW5CO0FBQ0EsUUFBSSxDQUFDMkQsWUFBTCxFQUFtQjtBQUNuQkEsSUFBQUEsWUFBWSxDQUFDNUIsaUJBQWIsQ0FBK0IsSUFBL0I7QUFFQSxRQUFJOEIsVUFBVSxHQUFHLEVBQWpCOztBQUNBLFNBQUssSUFBSW5GLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcrRSxLQUFLLENBQUM5RSxNQUExQixFQUFrQ0QsQ0FBQyxFQUFuQyxFQUF1QztBQUNyQyxVQUFJRSxJQUFJLEdBQUcxQyxFQUFFLENBQUM0SCxXQUFILENBQWUsS0FBS3RILFdBQXBCLENBQVg7QUFDQW9DLE1BQUFBLElBQUksQ0FBQ1MsWUFBTCxDQUFrQixNQUFsQixFQUEwQkMsU0FBMUIsQ0FBb0NtRSxLQUFLLENBQUMvRSxDQUFELENBQXpDLEVBQThDc0IsTUFBOUM7QUFDQTZELE1BQUFBLFVBQVUsQ0FBQ3RDLElBQVgsQ0FBZ0IzQyxJQUFoQjtBQUNEOztBQUNELFFBQU1tRixLQUFLLEdBQUdwRSxNQUFNLENBQUNxRSxNQUFQLENBQWMsQ0FBZCxFQUFpQixFQUFqQixDQUFkO0FBQ0EsUUFBTUMsVUFBVSxHQUFHUCxnQkFBZ0IsQ0FBQ1Esb0JBQWpCLENBQXNDbEUsTUFBdEMsQ0FBbkI7QUFDQSxRQUFJLENBQUNpRSxVQUFMLEVBQWlCO0FBQ2pCQSxJQUFBQSxVQUFVLENBQUNFLGFBQVgsQ0FBeUIsWUFBTTtBQUM3QixNQUFBLEtBQUksQ0FBQ0MseUJBQUwsQ0FBK0JULFlBQS9CLEVBQTZDRSxVQUE3QyxFQUF5RCxDQUF6RDs7QUFDQUksTUFBQUEsVUFBVSxDQUFDSSxhQUFYLENBQXlCWixLQUFLLENBQUM5RSxNQUEvQixFQUY2QixDQUc3Qjs7QUFDQStCLE1BQUFBLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlMEIsSUFBZixDQUFvQixrQkFBcEIsRUFBd0NyQyxNQUF4QztBQUNELEtBTEQsRUFLRytELEtBTEg7QUFNRCxHQWxUTTtBQW1UUDtBQUNBN0MsRUFBQUEsYUFwVE8sZ0NBb1RvQztBQUFBLFFBQTNCb0QsS0FBMkIsU0FBM0JBLEtBQTJCO0FBQUEsUUFBcEJDLGdCQUFvQixTQUFwQkEsZ0JBQW9CO0FBQ3pDL0YsSUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksTUFBWixFQUFvQjtBQUFFNkYsTUFBQUEsS0FBSyxFQUFMQSxLQUFGO0FBQVNDLE1BQUFBLGdCQUFnQixFQUFoQkE7QUFBVCxLQUFwQjs7QUFDQSxRQUFJRCxLQUFKLEVBQVc7QUFDVCxXQUFLcEgsT0FBTCxDQUFhNEUsTUFBYixHQUFzQixJQUF0QjtBQUNELEtBRkQsTUFFTztBQUNMLFdBQUs3RSxRQUFMLENBQWM2RSxNQUFkLEdBQXVCLElBQXZCO0FBQ0Q7O0FBQ0Q3RixJQUFBQSxPQUFPLENBQUMyRixTQUFSLEdBQW9CN0YsWUFBWSxDQUFDNkYsU0FBYixDQUF1QjRDLFNBQTNDO0FBQ0QsR0E1VE07QUE2VFA7QUFDQUMsRUFBQUEsUUE5VE8sc0JBOFRJO0FBQ1QsU0FBSzdHLFVBQUwsQ0FBZ0I4RyxJQUFoQixDQUFxQixVQUFVOUIsQ0FBVixFQUFhK0IsQ0FBYixFQUFnQjtBQUNuQyxVQUFJQyxDQUFDLEdBQUdoQyxDQUFDLENBQUN2RCxZQUFGLENBQWUsTUFBZixFQUF1QjJDLFNBQS9CO0FBQ0EsVUFBSTZDLENBQUMsR0FBR0YsQ0FBQyxDQUFDdEYsWUFBRixDQUFlLE1BQWYsRUFBdUIyQyxTQUEvQjs7QUFFQSxVQUFJNEMsQ0FBQyxDQUFDRSxjQUFGLENBQWlCLE9BQWpCLEtBQTZCRCxDQUFDLENBQUNDLGNBQUYsQ0FBaUIsT0FBakIsQ0FBakMsRUFBNEQ7QUFDMUQsZUFBT0QsQ0FBQyxDQUFDRSxLQUFGLEdBQVVILENBQUMsQ0FBQ0csS0FBbkI7QUFDRDs7QUFDRCxVQUFJSCxDQUFDLENBQUNFLGNBQUYsQ0FBaUIsTUFBakIsS0FBNEIsQ0FBQ0QsQ0FBQyxDQUFDQyxjQUFGLENBQWlCLE1BQWpCLENBQWpDLEVBQTJEO0FBQ3pELGVBQU8sQ0FBQyxDQUFSO0FBQ0Q7O0FBQ0QsVUFBSSxDQUFDRixDQUFDLENBQUNFLGNBQUYsQ0FBaUIsTUFBakIsQ0FBRCxJQUE2QkQsQ0FBQyxDQUFDQyxjQUFGLENBQWlCLE1BQWpCLENBQWpDLEVBQTJEO0FBQ3pELGVBQU8sQ0FBUDtBQUNEOztBQUNELFVBQUlGLENBQUMsQ0FBQ0UsY0FBRixDQUFpQixNQUFqQixLQUE0QkQsQ0FBQyxDQUFDQyxjQUFGLENBQWlCLE1BQWpCLENBQWhDLEVBQTBEO0FBQ3hELGVBQU9ELENBQUMsQ0FBQ0csSUFBRixHQUFTSixDQUFDLENBQUNJLElBQWxCO0FBQ0Q7QUFDRixLQWhCRCxFQURTLENBa0JUO0FBQ0E7O0FBQ0EsUUFBSXBDLENBQUMsR0FBRyxLQUFLaEYsVUFBTCxDQUFnQixDQUFoQixFQUFtQmdGLENBQTNCO0FBQ0EsUUFBSXFDLE9BQU8sR0FBRyxJQUFkO0FBQ0FDLElBQUFBLFVBQVUsQ0FBQyxZQUFZO0FBQ3JCO0FBQ0ExRyxNQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxZQUFZbUUsQ0FBeEI7O0FBQ0EsV0FBSyxJQUFJbEUsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxLQUFLZCxVQUFMLENBQWdCZSxNQUFwQyxFQUE0Q0QsQ0FBQyxFQUE3QyxFQUFpRDtBQUMvQyxZQUFJRSxJQUFJLEdBQUcsS0FBS2hCLFVBQUwsQ0FBZ0JjLENBQWhCLENBQVg7QUFDQUUsUUFBQUEsSUFBSSxDQUFDdUcsTUFBTCxHQUFjekcsQ0FBZCxDQUYrQyxDQUU5Qjs7QUFDakJFLFFBQUFBLElBQUksQ0FBQ2dFLENBQUwsR0FBU0EsQ0FBQyxHQUFHaEUsSUFBSSxDQUFDd0csS0FBTCxHQUFhLEdBQWIsR0FBbUIxRyxDQUFoQztBQUNEO0FBQ0YsS0FSVSxDQVFUMEIsSUFSUyxDQVFKLElBUkksQ0FBRCxFQVFJNkUsT0FSSixDQUFWO0FBU0QsR0E3Vk07QUE4VlAvQyxFQUFBQSxRQTlWTyxvQkE4VkUzRCxJQTlWRixFQThWUTtBQUNiLFFBQUlBLElBQUosRUFBVTtBQUNSQSxNQUFBQSxJQUFJLENBQUNtRyxJQUFMLENBQVUsVUFBVUUsQ0FBVixFQUFhQyxDQUFiLEVBQWdCO0FBQ3hCLFlBQUlELENBQUMsQ0FBQ0UsY0FBRixDQUFpQixPQUFqQixLQUE2QkQsQ0FBQyxDQUFDQyxjQUFGLENBQWlCLE9BQWpCLENBQWpDLEVBQTREO0FBQzFELGlCQUFPRCxDQUFDLENBQUNFLEtBQUYsR0FBVUgsQ0FBQyxDQUFDRyxLQUFuQjtBQUNEOztBQUNELFlBQUlILENBQUMsQ0FBQ0UsY0FBRixDQUFpQixNQUFqQixLQUE0QixDQUFDRCxDQUFDLENBQUNDLGNBQUYsQ0FBaUIsTUFBakIsQ0FBakMsRUFBMkQ7QUFDekQsaUJBQU8sQ0FBQyxDQUFSO0FBQ0Q7O0FBQ0QsWUFBSSxDQUFDRixDQUFDLENBQUNFLGNBQUYsQ0FBaUIsTUFBakIsQ0FBRCxJQUE2QkQsQ0FBQyxDQUFDQyxjQUFGLENBQWlCLE1BQWpCLENBQWpDLEVBQTJEO0FBQ3pELGlCQUFPLENBQVA7QUFDRDs7QUFDRCxZQUFJRixDQUFDLENBQUNFLGNBQUYsQ0FBaUIsTUFBakIsS0FBNEJELENBQUMsQ0FBQ0MsY0FBRixDQUFpQixNQUFqQixDQUFoQyxFQUEwRDtBQUN4RCxpQkFBT0QsQ0FBQyxDQUFDRyxJQUFGLEdBQVNKLENBQUMsQ0FBQ0ksSUFBbEI7QUFDRDtBQUNGLE9BYkQ7QUFjRCxLQWhCWSxDQWlCYjs7O0FBQ0EsU0FBS3BILFVBQUwsR0FBa0IsRUFBbEI7O0FBQ0EsU0FBSyxJQUFJYyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHLEVBQXBCLEVBQXdCQSxDQUFDLEVBQXpCLEVBQTZCO0FBRTNCLFVBQUlFLElBQUksR0FBRzFDLEVBQUUsQ0FBQzRILFdBQUgsQ0FBZSxLQUFLdEgsV0FBcEIsQ0FBWDtBQUNBb0MsTUFBQUEsSUFBSSxDQUFDeUcsS0FBTCxHQUFhLEdBQWIsQ0FIMkIsQ0FJM0I7O0FBQ0F6RyxNQUFBQSxJQUFJLENBQUN3RCxNQUFMLEdBQWMsS0FBS3ZGLFNBQW5CO0FBQ0ErQixNQUFBQSxJQUFJLENBQUNnRSxDQUFMLEdBQVNoRSxJQUFJLENBQUN3RyxLQUFMLEdBQWEsR0FBYixHQUFvQixDQUFDLEdBQXJCLEdBQTZCLENBQUMsRUFBOUIsR0FBb0N4RyxJQUFJLENBQUN3RyxLQUFMLEdBQWEsR0FBYixHQUFtQixDQUFoRSxDQU4yQixDQU8zQjs7QUFDQXhHLE1BQUFBLElBQUksQ0FBQytGLENBQUwsR0FBUyxDQUFDLEdBQVY7QUFDQS9GLE1BQUFBLElBQUksQ0FBQ2tELE1BQUwsR0FBYyxLQUFkO0FBRUFsRCxNQUFBQSxJQUFJLENBQUNTLFlBQUwsQ0FBa0IsTUFBbEIsRUFBMEJDLFNBQTFCLENBQW9DZixJQUFJLENBQUNHLENBQUQsQ0FBeEMsRUFBNkNvQixxQkFBU0MsVUFBVCxDQUFvQkMsTUFBakUsRUFYMkIsQ0FZM0I7O0FBQ0EsV0FBS3BDLFVBQUwsQ0FBZ0IyRCxJQUFoQixDQUFxQjNDLElBQXJCO0FBQ0EsV0FBS2YsVUFBTCxHQUFrQmUsSUFBSSxDQUFDd0csS0FBdkI7QUFDRCxLQWxDWSxDQW1DYjs7O0FBQ0EsU0FBS3RILFdBQUwsR0FBbUIsRUFBbkI7O0FBQ0EsU0FBSyxJQUFJWSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHLENBQXBCLEVBQXVCQSxDQUFDLEVBQXhCLEVBQTRCO0FBQzFCLFVBQUk0RyxPQUFPLEdBQUdwSixFQUFFLENBQUM0SCxXQUFILENBQWUsS0FBS3RILFdBQXBCLENBQWQ7QUFDQThJLE1BQUFBLE9BQU8sQ0FBQ0QsS0FBUixHQUFnQixHQUFoQixDQUYwQixDQUcxQjtBQUNBO0FBQ0E7O0FBQ0EsVUFBSTNHLENBQUMsSUFBSSxDQUFULEVBQVk7QUFDVjRHLFFBQUFBLE9BQU8sQ0FBQzFDLENBQVIsR0FBWTBDLE9BQU8sQ0FBQzFDLENBQVIsR0FBWTBDLE9BQU8sQ0FBQ0YsS0FBUixHQUFnQixHQUF4QztBQUNELE9BRkQsTUFFTyxJQUFJMUcsQ0FBQyxJQUFJLENBQVQsRUFBWTtBQUNqQjRHLFFBQUFBLE9BQU8sQ0FBQzFDLENBQVIsR0FBWTBDLE9BQU8sQ0FBQzFDLENBQVIsR0FBWTBDLE9BQU8sQ0FBQ0YsS0FBUixHQUFnQixHQUF4QztBQUNELE9BVnlCLENBVzFCO0FBQ0E7QUFDQTs7O0FBQ0FFLE1BQUFBLE9BQU8sQ0FBQ2xELE1BQVIsR0FBaUIsS0FBS3RGLG9CQUF0QixDQWQwQixDQWUxQjs7QUFDQSxXQUFLZ0IsV0FBTCxDQUFpQnlELElBQWpCLENBQXNCK0QsT0FBdEI7QUFDRDtBQUNGLEdBclpNO0FBc1pQO0FBQ0FDLEVBQUFBLHFCQXZaTyxtQ0F1WmlCO0FBQ3RCLFNBQUssSUFBSTdHLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsS0FBS2QsVUFBTCxDQUFnQmUsTUFBcEMsRUFBNENELENBQUMsRUFBN0MsRUFBaUQ7QUFDL0MsVUFBSUUsSUFBSSxHQUFHLEtBQUtoQixVQUFMLENBQWdCYyxDQUFoQixDQUFYOztBQUNBLFVBQUlFLElBQUksQ0FBQytGLENBQUwsSUFBVSxDQUFDLEdBQWYsRUFBb0I7QUFDbEIvRixRQUFBQSxJQUFJLENBQUMrRixDQUFMLEdBQVMsQ0FBQyxHQUFWO0FBQ0Q7QUFDRjs7QUFDRCxTQUFLYSxXQUFMO0FBQ0QsR0EvWk07QUFnYVA7QUFDQXJGLEVBQUFBLGFBamFPLDJCQWlhUztBQUNkO0FBQ0EsUUFBSXNGLFdBQVcsR0FBRyxLQUFLN0gsVUFBTCxDQUFnQixLQUFLQSxVQUFMLENBQWdCZSxNQUFoQixHQUF5QixDQUF6QyxFQUE0Q2lFLENBQTlEOztBQUNBLFNBQUssSUFBSWxFLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsS0FBS1gsZ0JBQUwsQ0FBc0JZLE1BQTFDLEVBQWtERCxDQUFDLEVBQW5ELEVBQXVEO0FBQ3JELFVBQUlFLElBQUksR0FBRzFDLEVBQUUsQ0FBQzRILFdBQUgsQ0FBZSxLQUFLdEgsV0FBcEIsQ0FBWDtBQUNBb0MsTUFBQUEsSUFBSSxDQUFDeUcsS0FBTCxHQUFhLEdBQWIsQ0FGcUQsQ0FHckQ7O0FBQ0F6RyxNQUFBQSxJQUFJLENBQUN3RCxNQUFMLEdBQWMsS0FBS3ZGLFNBQW5CO0FBRUErQixNQUFBQSxJQUFJLENBQUNnRSxDQUFMLEdBQVM2QyxXQUFXLEdBQUksQ0FBQy9HLENBQUMsR0FBRyxDQUFMLElBQVUsS0FBS2IsVUFBZixHQUE0QixHQUFwRDtBQUNBZSxNQUFBQSxJQUFJLENBQUMrRixDQUFMLEdBQVMsQ0FBQyxHQUFWLENBUHFELENBT3RDO0FBRWY7O0FBQ0EvRixNQUFBQSxJQUFJLENBQUNTLFlBQUwsQ0FBa0IsTUFBbEIsRUFBMEJDLFNBQTFCLENBQW9DLEtBQUt2QixnQkFBTCxDQUFzQlcsQ0FBdEIsQ0FBcEMsRUFBOERvQixxQkFBU0MsVUFBVCxDQUFvQkMsTUFBbEY7QUFDQXBCLE1BQUFBLElBQUksQ0FBQ2tELE1BQUwsR0FBYyxJQUFkO0FBQ0EsV0FBS2xFLFVBQUwsQ0FBZ0IyRCxJQUFoQixDQUFxQjNDLElBQXJCO0FBQ0Q7O0FBQ0QsU0FBSzZGLFFBQUwsR0FqQmMsQ0FrQmQ7O0FBQ0EsU0FBS3ZFLFlBQUwsQ0FBa0IsS0FBS3FGLHFCQUFMLENBQTJCbkYsSUFBM0IsQ0FBZ0MsSUFBaEMsQ0FBbEIsRUFBeUQsQ0FBekQ7QUFDRCxHQXJiTTtBQXViUHNGLEVBQUFBLFdBdmJPLHVCQXViSzFGLE1BdmJMLEVBdWJhMkYsV0F2YmIsRUF1YjBCO0FBQy9CLFFBQUksQ0FBQ0EsV0FBVyxDQUFDaEgsTUFBakIsRUFBeUI7QUFDekI7Ozs7Ozs7Ozs7QUFVQTs7QUFDQSxRQUFJaUgsWUFBWSxHQUFHLEVBQW5COztBQUNBLFNBQUssSUFBSWxILENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdpSCxXQUFXLENBQUNoSCxNQUFoQyxFQUF3Q0QsQ0FBQyxFQUF6QyxFQUE2QztBQUMzQyxXQUFLLElBQUltSCxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHLEtBQUtqSSxVQUFMLENBQWdCZSxNQUFwQyxFQUE0Q2tILENBQUMsRUFBN0MsRUFBaUQ7QUFDL0MsWUFBSUMsVUFBVSxHQUFHLEtBQUtsSSxVQUFMLENBQWdCaUksQ0FBaEIsRUFBbUJ4RyxZQUFuQixDQUFnQyxNQUFoQyxFQUF3Q3lHLFVBQXpEOztBQUNBLFlBQUlBLFVBQVUsSUFBSUgsV0FBVyxDQUFDakgsQ0FBRCxDQUFYLENBQWUrQyxLQUFqQyxFQUF3QztBQUN0QztBQUNBLGVBQUs3RCxVQUFMLENBQWdCaUksQ0FBaEIsRUFBbUJFLGdCQUFuQixDQUFvQyxJQUFwQztBQUNBSCxVQUFBQSxZQUFZLENBQUNyRSxJQUFiLENBQWtCLEtBQUszRCxVQUFMLENBQWdCaUksQ0FBaEIsQ0FBbEI7QUFDQSxlQUFLakksVUFBTCxDQUFnQjhELE1BQWhCLENBQXVCbUUsQ0FBdkIsRUFBMEIsQ0FBMUI7QUFDRDtBQUNGO0FBQ0Y7O0FBQ0QsU0FBS0csb0JBQUwsQ0FBMEJoRyxNQUExQixFQUFrQzRGLFlBQWxDO0FBQ0EsU0FBS0osV0FBTDtBQUNELEdBbGRNO0FBb2RQO0FBQ0FoQyxFQUFBQSxZQXJkTyx3QkFxZE14RCxNQXJkTixFQXFkYztBQUNuQixRQUFJMEQsZ0JBQWdCLEdBQUcsS0FBS3JGLElBQUwsQ0FBVStELE1BQVYsQ0FBaUIvQyxZQUFqQixDQUE4QixXQUE5QixDQUF2QjtBQUNBLFFBQUlzRSxZQUFZLEdBQUdELGdCQUFnQixDQUFDRSwwQkFBakIsQ0FBNEM1RCxNQUE1QyxDQUFuQjtBQUNBLFFBQUlpRyxRQUFRLEdBQUd0QyxZQUFZLENBQUNzQyxRQUE1Qjs7QUFDQSxTQUFLLElBQUl2SCxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHdUgsUUFBUSxDQUFDdEgsTUFBN0IsRUFBcUNELENBQUMsRUFBdEMsRUFBMEM7QUFDeEMsVUFBSUUsSUFBSSxHQUFHcUgsUUFBUSxDQUFDdkgsQ0FBRCxDQUFuQjtBQUNBRSxNQUFBQSxJQUFJLENBQUNzSCxPQUFMO0FBQ0Q7O0FBQ0R2QyxJQUFBQSxZQUFZLENBQUM1QixpQkFBYixDQUErQixJQUEvQjtBQUNELEdBOWRNO0FBK2RQO0FBQ0FvRSxFQUFBQSxZQWhlTyx3QkFnZU0xQyxLQWhlTixFQWdlYTtBQUNsQixRQUFJQSxLQUFLLENBQUM5RSxNQUFOLElBQWdCLENBQXBCLEVBQXVCO0FBQ3JCO0FBQ0Q7O0FBQ0Q4RSxJQUFBQSxLQUFLLENBQUNpQixJQUFOLENBQVcsVUFBVTlCLENBQVYsRUFBYStCLENBQWIsRUFBZ0I7QUFDekIsVUFBSUMsQ0FBQyxHQUFHaEMsQ0FBQyxDQUFDdkQsWUFBRixDQUFlLE1BQWYsRUFBdUIyQyxTQUEvQjtBQUNBLFVBQUk2QyxDQUFDLEdBQUdGLENBQUMsQ0FBQ3RGLFlBQUYsQ0FBZSxNQUFmLEVBQXVCMkMsU0FBL0I7O0FBRUEsVUFBSTRDLENBQUMsQ0FBQ0UsY0FBRixDQUFpQixPQUFqQixLQUE2QkQsQ0FBQyxDQUFDQyxjQUFGLENBQWlCLE9BQWpCLENBQWpDLEVBQTREO0FBQzFELGVBQU9ELENBQUMsQ0FBQ0UsS0FBRixHQUFVSCxDQUFDLENBQUNHLEtBQW5CO0FBQ0Q7O0FBQ0QsVUFBSUgsQ0FBQyxDQUFDRSxjQUFGLENBQWlCLE1BQWpCLEtBQTRCLENBQUNELENBQUMsQ0FBQ0MsY0FBRixDQUFpQixNQUFqQixDQUFqQyxFQUEyRDtBQUN6RCxlQUFPLENBQUMsQ0FBUjtBQUNEOztBQUNELFVBQUksQ0FBQ0YsQ0FBQyxDQUFDRSxjQUFGLENBQWlCLE1BQWpCLENBQUQsSUFBNkJELENBQUMsQ0FBQ0MsY0FBRixDQUFpQixNQUFqQixDQUFqQyxFQUEyRDtBQUN6RCxlQUFPLENBQVA7QUFDRDs7QUFDRCxVQUFJRixDQUFDLENBQUNFLGNBQUYsQ0FBaUIsTUFBakIsS0FBNEJELENBQUMsQ0FBQ0MsY0FBRixDQUFpQixNQUFqQixDQUFoQyxFQUEwRDtBQUN4RCxlQUFPRCxDQUFDLENBQUNHLElBQUYsR0FBU0osQ0FBQyxDQUFDSSxJQUFsQjtBQUNEO0FBQ0YsS0FoQkQ7QUFpQkQsR0FyZk07O0FBc2ZQOzs7Ozs7QUFNQVosRUFBQUEseUJBNWZPLHFDQTRmbUJULFlBNWZuQixFQTRmaUNGLEtBNWZqQyxFQTRmd0MyQyxPQTVmeEMsRUE0ZmlEO0FBQ3RELFFBQUksQ0FBQzNDLEtBQUssQ0FBQzlFLE1BQVgsRUFBbUI7QUFDakIsVUFBTThDLEtBQUssR0FBRzlCLE1BQU0sQ0FBQ3FFLE1BQVAsQ0FBYyxDQUFkLEVBQWlCLENBQWpCLENBQWQ7QUFDQXJFLE1BQUFBLE1BQU0sQ0FBQ0MsS0FBUCxDQUFhQyxVQUFiLENBQXdCLEtBQUtwQyxVQUFMLENBQWdCZ0UsS0FBaEIsQ0FBeEI7QUFDQTtBQUNEOztBQUNEOUIsSUFBQUEsTUFBTSxDQUFDQyxLQUFQLENBQWFDLFVBQWIsQ0FBd0IsS0FBS25DLFdBQTdCLEVBTnNELENBT3REOztBQUNBLFNBQUssSUFBSWdCLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcrRSxLQUFLLENBQUM5RSxNQUExQixFQUFrQ0QsQ0FBQyxFQUFuQyxFQUF1QztBQUNyQyxVQUFJRSxJQUFJLEdBQUc2RSxLQUFLLENBQUMvRSxDQUFELENBQWhCO0FBQ0FpRixNQUFBQSxZQUFZLENBQUMwQyxRQUFiLENBQXNCekgsSUFBdEIsRUFBNEIsTUFBTUYsQ0FBbEMsRUFGcUMsQ0FFQTtBQUN0QyxLQVhxRCxDQVl0RDtBQUNBOzs7QUFDQSxRQUFJNEgsTUFBTSxHQUFHN0MsS0FBSyxDQUFDOUUsTUFBTixHQUFlLENBQTVCOztBQUNBLFNBQUssSUFBSUQsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRytFLEtBQUssQ0FBQzlFLE1BQTFCLEVBQWtDRCxDQUFDLEVBQW5DLEVBQXVDO0FBQ3JDLFVBQUk2SCxRQUFRLEdBQUc1QyxZQUFZLENBQUM2QyxXQUFiLEdBQTJCOUgsQ0FBM0IsQ0FBZjtBQUNBLFVBQUlrRSxDQUFDLEdBQUcsQ0FBQ2xFLENBQUMsR0FBRzRILE1BQUwsSUFBZSxFQUF2QjtBQUNBLFVBQUkzQixDQUFDLEdBQUc0QixRQUFRLENBQUM1QixDQUFULEdBQWF5QixPQUFyQixDQUhxQyxDQUdQOztBQUM5QkcsTUFBQUEsUUFBUSxDQUFDRSxRQUFULENBQWtCLEdBQWxCLEVBQXVCLEdBQXZCO0FBQ0FGLE1BQUFBLFFBQVEsQ0FBQ0csV0FBVCxDQUFxQjlELENBQXJCLEVBQXdCK0IsQ0FBeEI7QUFDRDtBQUNGLEdBbGhCTTtBQW1oQlA7QUFDQTtBQUNBcUIsRUFBQUEsb0JBcmhCTyxnQ0FxaEJjaEcsTUFyaEJkLEVBcWhCc0I0RixZQXJoQnRCLEVBcWhCb0M7QUFDekMsUUFBSSxDQUFDQSxZQUFZLENBQUNqSCxNQUFsQixFQUEwQixPQURlLENBRXpDOztBQUNBLFNBQUt3SCxZQUFMLENBQWtCUCxZQUFsQjtBQUNBLFFBQUlsQyxnQkFBZ0IsR0FBRyxLQUFLckYsSUFBTCxDQUFVK0QsTUFBVixDQUFpQi9DLFlBQWpCLENBQThCLFdBQTlCLENBQXZCLENBSnlDLENBS3pDOztBQUNBLFFBQUlzRSxZQUFZLEdBQUdELGdCQUFnQixDQUFDRSwwQkFBakIsQ0FBNEM1RCxNQUE1QyxDQUFuQjtBQUNBLFNBQUtvRSx5QkFBTCxDQUErQlQsWUFBL0IsRUFBNkNpQyxZQUE3QyxFQUEyRCxHQUEzRCxFQVB5QyxDQVF6QztBQUNELEdBOWhCTTtBQWdpQlA7QUFDQUosRUFBQUEsV0FqaUJPLHlCQWlpQk87QUFDWixRQUFJbUIsU0FBUyxHQUFHLEtBQUsvSSxVQUFMLENBQWdCZSxNQUFoQixHQUF5QixDQUF6QyxDQURZLENBRVo7O0FBQ0EsU0FBSyxJQUFJRCxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHLEtBQUtkLFVBQUwsQ0FBZ0JlLE1BQXBDLEVBQTRDRCxDQUFDLEVBQTdDLEVBQWlEO0FBQy9DLFVBQUk2SCxRQUFRLEdBQUcsS0FBSzNJLFVBQUwsQ0FBZ0JjLENBQWhCLENBQWY7QUFDQSxVQUFJa0UsQ0FBQyxHQUFHLENBQUNsRSxDQUFDLEdBQUdpSSxTQUFMLEtBQW1CLEtBQUs5SSxVQUFMLEdBQWtCLEdBQXJDLElBQTRDLEVBQXBEO0FBQ0EwSSxNQUFBQSxRQUFRLENBQUNHLFdBQVQsQ0FBcUI5RCxDQUFyQixFQUF3QixDQUFDLEdBQXpCO0FBQ0Q7QUFDRixHQXppQk07QUEyaUJQZ0UsRUFBQUEsaUJBM2lCTyw2QkEyaUJXQyxTQTNpQlgsRUEyaUJzQjtBQUMzQnJJLElBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLHVCQUF1Qm9JLFNBQW5DO0FBQ0EsUUFBSUEsU0FBUyxJQUFJLEVBQWpCLEVBQXFCOztBQUNyQixZQUFRQSxTQUFSO0FBQ0UsV0FBS0MsVUFBVSxDQUFDQyxHQUFYLENBQWVDLElBQXBCO0FBQ0U7O0FBQ0YsV0FBS0YsVUFBVSxVQUFWLENBQWtCRSxJQUF2QjtBQUNFLFlBQUkxRSxZQUFKLEVBQWtCO0FBQ2hCcEcsVUFBQUEsRUFBRSxDQUFDcUcsV0FBSCxDQUFlMEUsSUFBZixDQUFvQi9LLEVBQUUsQ0FBQ2dMLEdBQUgsQ0FBT0MsR0FBUCxDQUFXLDJCQUFYLENBQXBCO0FBQ0Q7O0FBQ0Q7QUFQSjtBQVNELEdBdmpCTTtBQXdqQlA7QUFDQUMsRUFBQUEsYUF6akJPLHlCQXlqQk9DLEtBempCUCxFQXlqQmNDLFVBempCZCxFQXlqQjBCO0FBQUE7O0FBQy9CLFlBQVFBLFVBQVI7QUFDRSxXQUFLLFlBQUw7QUFBbUI7QUFDakI7QUFDQTVHLFFBQUFBLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlMEIsSUFBZixDQUFvQixxQkFBcEIsRUFBMkM7QUFDekNyQyxVQUFBQSxNQUFNLEVBQUVGLHFCQUFTQyxVQUFULENBQW9CQyxNQURhO0FBRXpDMkIsVUFBQUEsS0FBSyxFQUFFeUIsVUFBVSxDQUFDbUU7QUFGdUIsU0FBM0M7QUFJQSxhQUFLN0ssS0FBTCxDQUFXb0YsTUFBWCxHQUFvQixLQUFwQjtBQUNBbkMsUUFBQUEsTUFBTSxDQUFDQyxLQUFQLENBQWFDLFVBQWIsQ0FBd0IsS0FBS3ZDLGNBQTdCO0FBQ0E7O0FBQ0YsV0FBSyxjQUFMO0FBQXFCO0FBQ25CO0FBQ0FvRCxRQUFBQSxNQUFNLENBQUNDLE9BQVAsQ0FBZTBCLElBQWYsQ0FBb0IscUJBQXBCLEVBQTJDO0FBQ3pDckMsVUFBQUEsTUFBTSxFQUFFRixxQkFBU0MsVUFBVCxDQUFvQkMsTUFEYTtBQUV6QzJCLFVBQUFBLEtBQUssRUFBRXlCLFVBQVUsQ0FBQ0M7QUFGdUIsU0FBM0M7QUFJQSxhQUFLM0csS0FBTCxDQUFXb0YsTUFBWCxHQUFvQixLQUFwQjtBQUNBbkMsUUFBQUEsTUFBTSxDQUFDQyxLQUFQLENBQWFDLFVBQWIsQ0FBd0IsS0FBS3RDLFlBQTdCO0FBQ0E7O0FBQ0YsV0FBSyxZQUFMO0FBQW9CO0FBQ2xCO0FBQ0FtRCxRQUFBQSxNQUFNLENBQUNDLE9BQVAsQ0FBZTBCLElBQWYsQ0FBb0Isa0JBQXBCLEVBQXdDdkMscUJBQVNDLFVBQVQsQ0FBb0JDLE1BQTVEO0FBQ0EsWUFBTXlCLEtBQUssR0FBRyxLQUFLckQsVUFBTCxDQUFnQk8sTUFBaEIsR0FBeUJnQixNQUFNLENBQUNxRSxNQUFQLENBQWMsQ0FBZCxFQUFpQixDQUFqQixDQUF6QixHQUErQyxDQUE3RDtBQUNBckUsUUFBQUEsTUFBTSxDQUFDQyxLQUFQLENBQWFDLFVBQWIsQ0FBd0IsS0FBS3BDLFVBQUwsQ0FBZ0JnRSxLQUFoQixDQUF4QjtBQUNBLGFBQUt6RCxnQkFBTCxHQUF3QixFQUF4QjtBQUNBLGFBQUtKLFVBQUwsQ0FBZ0I0SixHQUFoQixDQUFvQixVQUFBbkosSUFBSTtBQUFBLGlCQUFJQSxJQUFJLENBQUNnRSxJQUFMLENBQVUsaUJBQVYsQ0FBSjtBQUFBLFNBQXhCO0FBQ0EsYUFBS3RGLGNBQUwsQ0FBb0IrRSxNQUFwQixHQUE2QixLQUE3QjtBQUNBOztBQUNGLFdBQUssVUFBTDtBQUFtQjtBQUNqQjtBQUNBLFlBQUksS0FBSzlELGdCQUFMLENBQXNCVyxNQUF0QixJQUFnQyxDQUFwQyxFQUF1QztBQUNyQyxlQUFLM0IsU0FBTCxDQUFlc0csTUFBZixHQUF3QixPQUF4QjtBQUNBNEIsVUFBQUEsVUFBVSxDQUFDLFlBQVk7QUFDckIsaUJBQUtsSSxTQUFMLENBQWVzRyxNQUFmLEdBQXdCLEVBQXhCO0FBQ0QsV0FGVSxDQUVUbEQsSUFGUyxDQUVKLElBRkksQ0FBRCxFQUVJLElBRkosQ0FBVjtBQUdEOztBQUNETSxRQUFBQSxNQUFNLENBQUNDLE9BQVAsQ0FBZTBCLElBQWYsQ0FBb0IsaUJBQXBCLEVBQXVDO0FBQ3JDckMsVUFBQUEsTUFBTSxFQUFFRixxQkFBU0MsVUFBVCxDQUFvQkMsTUFEUztBQUVyQ3lELFVBQUFBLEtBQUssRUFBRSxLQUFLekY7QUFGeUIsU0FBdkMsRUFHRyxpQkFBYTtBQUFBLGNBQVgyRCxLQUFXLFNBQVhBLEtBQVc7O0FBQ2QsY0FBSUEsS0FBSyxLQUFLLENBQWQsRUFBaUI7QUFDZixZQUFBLE1BQUksQ0FBQytELFdBQUwsQ0FBaUI1RixxQkFBU0MsVUFBVCxDQUFvQkMsTUFBckMsRUFBNkMsTUFBSSxDQUFDaEMsZ0JBQWxEOztBQUNBLFlBQUEsTUFBSSxDQUFDakIsY0FBTCxDQUFvQitFLE1BQXBCLEdBQTZCLEtBQTdCO0FBQ0QsV0FIRCxNQUdPO0FBQ0w7QUFDQSxZQUFBLE1BQUksQ0FBQ2xFLFVBQUwsQ0FBZ0I0SixHQUFoQixDQUFvQixVQUFBbkosSUFBSTtBQUFBLHFCQUFJQSxJQUFJLENBQUNnRSxJQUFMLENBQVUsaUJBQVYsQ0FBSjtBQUFBLGFBQXhCLEVBRkssQ0FHTDtBQUNBO0FBQ0E7O0FBQ0Q7O0FBQ0QsVUFBQSxNQUFJLENBQUNyRSxnQkFBTCxHQUF3QixFQUF4QjtBQUNELFNBZkQsRUFSRixDQXdCRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTs7QUFDRixXQUFLLFNBQUw7QUFBZ0I7QUFDZDtBQUNBLGFBQUtBLGdCQUFMLEdBQXdCLEVBQXhCO0FBQ0EsYUFBS0osVUFBTCxDQUFnQjRKLEdBQWhCLENBQW9CLFVBQUFuSixJQUFJO0FBQUEsaUJBQUlBLElBQUksQ0FBQ2dFLElBQUwsQ0FBVSxpQkFBVixDQUFKO0FBQUEsU0FBeEIsRUFIRixDQUlFOztBQUNBLFlBQUksS0FBS2pFLFVBQUwsQ0FBZ0JPLE1BQXBCLEVBQTRCO0FBQzFCLGNBQU04QyxNQUFLLEdBQUcsS0FBS3RELFdBQUwsR0FBbUIsS0FBS0MsVUFBTCxDQUFnQk8sTUFBakQ7O0FBQ0EsY0FBTThJLFdBQVcsR0FBRyxLQUFLckosVUFBTCxDQUFnQnFELE1BQWhCLENBQXBCO0FBQ0EsY0FBTTVFLFNBQVMsR0FBRyxLQUFLZSxVQUF2Qjs7QUFDQSxlQUFLLElBQUljLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcrSSxXQUFXLENBQUM5SSxNQUFoQyxFQUF3Q0QsQ0FBQyxFQUF6QyxFQUE2QztBQUMzQyxnQkFBTUUsSUFBSSxHQUFHNkksV0FBVyxDQUFDL0ksQ0FBRCxDQUF4Qjs7QUFDQSxpQkFBSyxJQUFJbUgsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR2hKLFNBQVMsQ0FBQzhCLE1BQTlCLEVBQXNDa0gsQ0FBQyxFQUF2QyxFQUEyQztBQUN6QyxrQkFBTTZCLE1BQU0sR0FBRzdLLFNBQVMsQ0FBQ2dKLENBQUQsQ0FBVCxDQUFheEcsWUFBYixDQUEwQixNQUExQixDQUFmO0FBQ0Esa0JBQU1pQyxRQUFRLEdBQUdvRyxNQUFNLENBQUMxRixTQUF4Qjs7QUFDQSxrQkFBSVYsUUFBUSxDQUFDcUcsR0FBVCxLQUFpQi9JLElBQUksQ0FBQytJLEdBQXRCLElBQTZCckcsUUFBUSxDQUFDc0csS0FBVCxLQUFtQmhKLElBQUksQ0FBQ2dKLEtBQXpELEVBQWdFO0FBQzlERixnQkFBQUEsTUFBTSxDQUFDckosSUFBUCxDQUFZZ0UsSUFBWixDQUFpQm5HLEVBQUUsQ0FBQ0ssSUFBSCxDQUFRc0wsU0FBUixDQUFrQkMsV0FBbkM7QUFDRDtBQUNGO0FBQ0Y7QUFDRjs7QUFDRCxhQUFLM0osV0FBTDtBQUNBOztBQUNGO0FBQ0U7QUF4R0o7QUEwR0Q7QUFwcUJNLENBQVQiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHNjcmlwdHNcXGdhbWVTY2VuZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBteWdsb2JhbCBmcm9tIFwiLi4vbXlnb2xiYWwuanNcIlxyXG5jb25zdCBkZHpDb25zdGFudHMgPSByZXF1aXJlKCdkZHpDb25zdGFudHMnKVxyXG5jb25zdCBkZHpEYXRhID0gcmVxdWlyZSgnZGR6RGF0YScpXHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICBwcm9wZXJ0aWVzOiB7XHJcbiAgICBnYW1laW5nVUk6IGNjLk5vZGUsXHJcbiAgICBjYXJkX3ByZWZhYjogY2MuUHJlZmFiLFxyXG4gICAgcm9iVUk6IGNjLk5vZGUsIC8vIOaKouWcsOS4u+aMiemSruiKgueCuVxyXG4gICAgdGltZUxhYmVsOiBjYy5MYWJlbCwgLy8g6K6h5pe25Zmo6IqC54K5XHJcbiAgICBjYXJkc05vZGU6IGNjLk5vZGUsIC8vIOaJkeWFi+iKgueCuVxyXG4gICAgYm90dG9tX2NhcmRfcG9zX25vZGU6IGNjLk5vZGUsIC8vIOW6leeJjOiKgueCuVxyXG4gICAgcGxheWluZ1VJX25vZGU6IGNjLk5vZGUsIC8vIOWHuueJjOaPkOekuuiKgueCuVxyXG4gICAgdGlwc0xhYmVsOiBjYy5MYWJlbCwgLy/njqnlrrblh7rniYzkuI3lkIjms5XnmoR0aXBzXHJcbiAgICBsb3NlTm9kZTogY2MuTm9kZSwgLy8g5aSx6LSl54m55pWI6IqC54K5XHJcbiAgICB3aW5Ob2RlOiBjYy5Ob2RlLCAvLyDog5zliKnnibnmlYjoioLngrlcclxuICAgIGZhcGFpQXVkaW86IHtcclxuICAgICAgdHlwZTogY2MuQXVkaW9DbGlwLFxyXG4gICAgICBkZWZhdWx0OiBudWxsXHJcbiAgICB9LFxyXG4gICAgamlhb2Rpemh1QXVkaW86IHtcclxuICAgICAgdHlwZTogY2MuQXVkaW9DbGlwLFxyXG4gICAgICBkZWZhdWx0OiBudWxsXHJcbiAgICB9LFxyXG4gICAgYnVxaWFuZ0F1ZGlvOiB7XHJcbiAgICAgIHR5cGU6IGNjLkF1ZGlvQ2xpcCxcclxuICAgICAgZGVmYXVsdDogbnVsbFxyXG4gICAgfSxcclxuICAgIGNhcmRzQXVkaW86IHtcclxuICAgICAgdHlwZTogY2MuQXVkaW9DbGlwLFxyXG4gICAgICBkZWZhdWx0OiBudWxsXHJcbiAgICB9LFxyXG4gICAgYnV5YW9BdWRpbzoge1xyXG4gICAgICB0eXBlOiBjYy5BdWRpb0NsaXAsXHJcbiAgICAgIGRlZmF1bHQ6IFtdXHJcbiAgICB9LFxyXG4gICAgY2h1cGFpQXVkaW86IHtcclxuICAgICAgdHlwZTogY2MuQXVkaW9DbGlwLFxyXG4gICAgICBkZWZhdWx0OiBudWxsXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgb25Mb2FkKCkge1xyXG4gICAgLy/oh6rlt7HniYzliJfooaggXHJcbiAgICB0aGlzLmNhcmRzX25vZGUgPSBbXVxyXG4gICAgdGhpcy5jYXJkX3dpZHRoID0gMFxyXG4gICAgLy/lvZPliY3lj6/ku6XmiqLlnLDkuLvnmoRhY2NvdW50aWRcclxuICAgIC8vIHRoaXMucm9iX3BsYXllcl9hY2NvdW50aWQgPSAwXHJcbiAgICAvL+WPkeeJjOWKqOeUu+aYr+WQpue7k+adn1xyXG4gICAgLy8gdGhpcy5mYXBhaV9lbmQgPSBmYWxzZVxyXG4gICAgLy/lupXniYzmlbDnu4RcclxuICAgIHRoaXMuYm90dG9tX2NhcmQgPSBbXVxyXG4gICAgLy/lupXniYznmoRqc29u5a+56LGh5pWw5o2uXHJcbiAgICB0aGlzLmJvdHRvbV9jYXJkX2RhdGEgPSBbXVxyXG4gICAgdGhpcy5jaG9vc2VfY2FyZF9kYXRhID0gW11cclxuICAgIHRoaXMub3V0Y2FyX3pvbmUgPSBbXVxyXG5cclxuICAgIHRoaXMucHVzaF9jYXJkX3RtcCA9IFtdXHJcbiAgICAvLyDmj5DnpLrniYzlnotcclxuICAgIHRoaXMucHJvbXB0Q291bnQgPSAwXHJcbiAgICB0aGlzLnByb21wdExpc3QgPSBbXVxyXG4gICAgLy/nm5HlkKzmnI3liqHlmajlj6/ku6Xlh7rniYzmtojmga9cclxuICAgIC8vIG15Z2xvYmFsLnNvY2tldC5vbkNhbkNodUNhcmQoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgIC8vICAgY29uc29sZS5sb2coXCJvbkNhbkNodUNhcmRcIiArIEpTT04uc3RyaW5naWZ5KGRhdGEpKVxyXG4gICAgLy8gICAvL+WIpOaWreaYr+S4jeaYr+iHquW3seiDveWHuueJjFxyXG4gICAgLy8gICBpZiAoZGF0YSA9PSBteWdsb2JhbC5wbGF5ZXJEYXRhLnVzZXJJZCkge1xyXG4gICAgLy8gICAgIC8v5YWI5riF55CG5Ye654mM5Yy65Z+fXHJcbiAgICAvLyAgICAgdGhpcy5jbGVhck91dFpvbmUobXlnbG9iYWwucGxheWVyRGF0YS51c2VySWQpXHJcbiAgICAvLyAgICAgLy/lhYjmioroh6rlt7Hlh7rniYzliJfooajnva7nqbpcclxuICAgIC8vICAgICAvL3RoaXMuY2hvb3NlX2NhcmRfZGF0YT1bXVxyXG4gICAgLy8gICAgIC8v5pi+56S65Y+v5Lul5Ye654mM55qEVUlcclxuICAgIC8vICAgICB0aGlzLnBsYXlpbmdVSV9ub2RlLmFjdGl2ZSA9IHRydWVcclxuXHJcbiAgICAvLyAgIH1cclxuICAgIC8vIH0uYmluZCh0aGlzKSlcclxuXHJcbiAgICAvL+ebkeWQrOacjeWKoeWZqO+8muWFtuS7lueOqeWutuWHuueJjOa2iOaBr1xyXG4gICAgLy8gbXlnbG9iYWwuc29ja2V0Lm9uT3RoZXJQbGF5ZXJDaHVDYXJkKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAvLyAgIC8ve1widXNlcklkXCI6XCIyMzU3NTQwXCIsXCJjYXJkc1wiOlt7XCJpbmRleFwiOjQsXCJjYXJkX2RhdGFcIjp7XCJpbmRleFwiOjQsXCJ2YWx1ZVwiOjEsXCJzaGFwZVwiOjF9fV19XHJcbiAgICAvLyAgIGNvbnNvbGUubG9nKFwib25PdGhlclBsYXllckNodUNhcmRcIiArIEpTT04uc3RyaW5naWZ5KGRhdGEpKVxyXG5cclxuICAgIC8vICAgdmFyIHVzZXJJZCA9IGRhdGEudXNlcklkXHJcbiAgICAvLyAgIHZhciBnYW1lU2NlbmVfc2NyaXB0ID0gdGhpcy5ub2RlLnBhcmVudC5nZXRDb21wb25lbnQoXCJnYW1lU2NlbmVcIilcclxuICAgIC8vICAgLy/ojrflj5blh7rniYzljLrln5/oioLngrlcclxuICAgIC8vICAgdmFyIG91dENhcmRfbm9kZSA9IGdhbWVTY2VuZV9zY3JpcHQuZ2V0VXNlck91dENhcmRQb3NCeUFjY291bnQodXNlcklkKVxyXG4gICAgLy8gICBpZiAob3V0Q2FyZF9ub2RlID09IG51bGwpIHtcclxuICAgIC8vICAgICByZXR1cm5cclxuICAgIC8vICAgfVxyXG5cclxuICAgIC8vICAgdmFyIG5vZGVfY2FyZHMgPSBbXVxyXG4gICAgLy8gICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEuY2FyZHMubGVuZ3RoOyBpKyspIHtcclxuICAgIC8vICAgICB2YXIgY2FyZCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuY2FyZF9wcmVmYWIpXHJcbiAgICAvLyAgICAgY2FyZC5nZXRDb21wb25lbnQoXCJjYXJkXCIpLnNob3dDYXJkcyhkYXRhLmNhcmRzW2ldLmNhcmRfZGF0YSwgbXlnbG9iYWwucGxheWVyRGF0YS51c2VySWQpXHJcbiAgICAvLyAgICAgbm9kZV9jYXJkcy5wdXNoKGNhcmQpXHJcbiAgICAvLyAgIH1cclxuICAgIC8vICAgdGhpcy5hcHBlbmRPdGhlckNhcmRzVG9PdXRab25lKG91dENhcmRfbm9kZSwgbm9kZV9jYXJkcywgMClcclxuICAgIC8vIH0uYmluZCh0aGlzKSlcclxuXHJcbiAgICAvL+WGhemDqOS6i+S7tjrmmL7npLrlupXniYzkuovku7YsZGF0YeaYr+S4ieW8oOW6leeJjOaVsOaNrlxyXG4gICAgdGhpcy5ub2RlLm9uKFwic2hvd19ib3R0b21fY2FyZF9ldmVudFwiLCBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIi0tLS1zaG93X2JvdHRvbV9jYXJkX2V2ZW50XCIsIGRhdGEpXHJcbiAgICAgIHRoaXMuYm90dG9tX2NhcmRfZGF0YSA9IGRhdGFcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGNhcmQgPSB0aGlzLmJvdHRvbV9jYXJkW2ldXHJcbiAgICAgICAgdmFyIHNob3dfZGF0YSA9IGRhdGFbaV1cclxuICAgICAgICB2YXIgY2FsbF9kYXRhID0ge1xyXG4gICAgICAgICAgXCJvYmpcIjogY2FyZCxcclxuICAgICAgICAgIFwiZGF0YVwiOiBzaG93X2RhdGEsXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBydW4gPSBjYy5jYWxsRnVuYyhmdW5jdGlvbiAodGFyZ2V0LCBhY3RpdmVkYXRhKSB7XHJcbiAgICAgICAgICB2YXIgc2hvd19jYXJkID0gYWN0aXZlZGF0YS5vYmpcclxuICAgICAgICAgIHZhciBzaG93X2RhdGEgPSBhY3RpdmVkYXRhLmRhdGFcclxuICAgICAgICAgIHNob3dfY2FyZC5nZXRDb21wb25lbnQoXCJjYXJkXCIpLnNob3dDYXJkcyhzaG93X2RhdGEpXHJcbiAgICAgICAgfSwgdGhpcywgY2FsbF9kYXRhKVxyXG5cclxuICAgICAgICBjYXJkLnJ1bkFjdGlvbihcclxuICAgICAgICAgIGNjLnNlcXVlbmNlKGNjLnJvdGF0ZUJ5KDAsIDAsIDE4MCksXHJcbiAgICAgICAgICAgIGNjLnJvdGF0ZUJ5KDAuMiwgMCwgLTkwKSxcclxuICAgICAgICAgICAgcnVuLFxyXG4gICAgICAgICAgICBjYy5yb3RhdGVCeSgwLjIsIDAsIC05MCksXHJcbiAgICAgICAgICAgIGNjLnNjYWxlQnkoMSwgMS4yKSlcclxuICAgICAgICApXHJcbiAgICAgIH1cclxuICAgICAgY29tbW9uLmF1ZGlvLlBsYXlFZmZlY3QodGhpcy5jYXJkc0F1ZGlvKVxyXG4gICAgICAvL3RoaXMubm9kZS5wYXJlbnQuZW1pdChcImNoYW5nZV9yb29tX3N0YXRlX2V2ZW50XCIsZGVmaW5lcy5nYW1lU3RhdGUuUk9PTV9QTEFZSU5HKVxyXG4gICAgICAvL+WmguaenOiHquW3seWcsOS4u++8jOe7meWKoOS4iuS4ieW8oOW6leeJjFxyXG4gICAgICBpZiAobXlnbG9iYWwucGxheWVyRGF0YS51c2VySWQgPT09IG15Z2xvYmFsLnBsYXllckRhdGEubWFzdGVyVXNlcklkKSB7XHJcbiAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UodGhpcy5wdXNoVGhyZWVDYXJkLmJpbmQodGhpcyksIDAuMilcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICB9LmJpbmQodGhpcykpXHJcblxyXG4gICAgLy/ms6jlhoznm5HlkKzkuIDkuKrpgInmi6nniYzmtojmga8gXHJcbiAgICAvLyB0aGlzLm5vZGUub24oXCJjaG9vc2VfY2FyZF9ldmVudFwiLCBmdW5jdGlvbiAoY2FyZERhdGEpIHtcclxuICAgIC8vICAgdGhpcy5jaG9vc2VfY2FyZF9kYXRhLnB1c2goY2FyZERhdGEpXHJcbiAgICAvLyB9LmJpbmQodGhpcykpXHJcblxyXG4gICAgLy8gdGhpcy5ub2RlLm9uKFwidW5jaG9vc2VfY2FyZF9ldmVudFwiLCBmdW5jdGlvbiAoY2FyZElkKSB7XHJcbiAgICAvLyAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaG9vc2VfY2FyZF9kYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAvLyAgICAgaWYgKHRoaXMuY2hvb3NlX2NhcmRfZGF0YVtpXS5pbmRleCA9PT0gY2FyZElkKSB7XHJcbiAgICAvLyAgICAgICB0aGlzLmNob29zZV9jYXJkX2RhdGEuc3BsaWNlKGksIDEpXHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gICB9XHJcbiAgICAvLyB9LmJpbmQodGhpcykpXHJcbiAgfSxcclxuICBzdGFydCgpIHtcclxuICAgIC8vIOebkeWQrOa4uOaIj+eKtuaAgVxyXG4gICAgaWYgKCFDQ19FRElUT1IpIHtcclxuICAgICAgZGR6RGF0YS5nYW1lU3RhdGVOb3RpZnkuYWRkTGlzdGVuZXIodGhpcy5nYW1lU3RhdGVIYW5kbGVyLCB0aGlzKVxyXG4gICAgfVxyXG4gICAgd2luZG93LiRzb2NrZXQub24oJ19jaG9vc2VDYXJkJywgdGhpcy5fY2hvb3NlQ2FyZE5vdGlmeSwgdGhpcykgLy8g6YCJ54mMXHJcbiAgICB3aW5kb3cuJHNvY2tldC5vbignX3VuY2hvb3NlQ2FyZCcsIHRoaXMuX3VuY2hvb3NlQ2FyZE5vdGlmeSwgdGhpcykgLy8g5Y+W5raI6YCJ54mMXHJcbiAgICB3aW5kb3cuJHNvY2tldC5vbigncHVzaGNhcmRfbm90aWZ5JywgdGhpcy5wdXNoQ2FyZE5vdGlmeSwgdGhpcykgLy8g5Y+R54mMXHJcbiAgICB3aW5kb3cuJHNvY2tldC5vbignY2Fucm9iX25vdGlmeScsIHRoaXMuY2Fucm9iTm90aWZ5LCB0aGlzKSAvLyDmiqLlnLDkuLtcclxuICAgIHdpbmRvdy4kc29ja2V0Lm9uKCdzZWxmUGxheUFIYW5kTm90aWZ5JywgdGhpcy5zZWxmUGxheUFIYW5kTm90aWZ5LCB0aGlzKSAvLyDlh7rniYxcclxuICAgIHdpbmRvdy4kc29ja2V0Lm9uKCdyb290UGxheUFIYW5kTm90aWZ5JywgdGhpcy5yb290UGxheUFIYW5kTm90aWZ5LCB0aGlzKSAvLyDmnLrlmajlh7rniYxcclxuICAgIHdpbmRvdy4kc29ja2V0Lm9uKCdnYW1lRW5kTm90aWZ5JywgdGhpcy5nYW1lRW5kTm90aWZ5LCB0aGlzKSAvLyDmuLjmiI/nu5PmnZ9cclxuICB9LFxyXG4gIG9uRGVzdHJveSgpIHtcclxuICAgIGlmICghQ0NfRURJVE9SKSB7XHJcbiAgICAgIGRkekRhdGEuZ2FtZVN0YXRlTm90aWZ5LnJlbW92ZUxpc3RlbmVyKHRoaXMuZ2FtZVN0YXRlSGFuZGxlciwgdGhpcylcclxuICAgIH1cclxuICAgIHdpbmRvdy4kc29ja2V0LnJlbW92ZSgnX2Nob29zZUNhcmQnLCB0aGlzKVxyXG4gICAgd2luZG93LiRzb2NrZXQucmVtb3ZlKCdfdW5jaG9vc2VDYXJkJywgdGhpcylcclxuICAgIHdpbmRvdy4kc29ja2V0LnJlbW92ZSgncHVzaGNhcmRfbm90aWZ5JywgdGhpcylcclxuICAgIHdpbmRvdy4kc29ja2V0LnJlbW92ZSgnY2Fucm9iX25vdGlmeScsIHRoaXMpXHJcbiAgICB3aW5kb3cuJHNvY2tldC5yZW1vdmUoJ3NlbGZQbGF5QUhhbmROb3RpZnknLCB0aGlzKVxyXG4gICAgd2luZG93LiRzb2NrZXQucmVtb3ZlKCdyb290UGxheUFIYW5kTm90aWZ5JywgdGhpcylcclxuICAgIHdpbmRvdy4kc29ja2V0LnJlbW92ZSgnZ2FtZUVuZE5vdGlmeScsIHRoaXMpXHJcbiAgfSxcclxuICBfY2hvb3NlQ2FyZE5vdGlmeShjYXJkRGF0YSkge1xyXG4gICAgdGhpcy5jaG9vc2VfY2FyZF9kYXRhLnB1c2goY2FyZERhdGEpXHJcbiAgfSxcclxuICBfdW5jaG9vc2VDYXJkTm90aWZ5KGNhcmRJZCkge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNob29zZV9jYXJkX2RhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYgKHRoaXMuY2hvb3NlX2NhcmRfZGF0YVtpXS5pbmRleCA9PT0gY2FyZElkKSB7XHJcbiAgICAgICAgdGhpcy5jaG9vc2VfY2FyZF9kYXRhLnNwbGljZShpLCAxKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBnYW1lU3RhdGVIYW5kbGVyKHN0YXRlKSB7XHJcbiAgICAvLyDlvIDlp4vmuLjmiI8gLSDlt7Llh4blpIdcclxuICAgIGlmIChzdGF0ZSA9PT0gZGR6Q29uc3RhbnRzLmdhbWVTdGF0ZS5HQU1FU1RBUlQpIHtcclxuICAgICAgLy8g5YWz6Zet6IOc5Yip5oiW5aSx6LSl5pWI5p6cXHJcbiAgICAgIHRoaXMud2luTm9kZS5hY3RpdmUgPSBmYWxzZVxyXG4gICAgICB0aGlzLmxvc2VOb2RlLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgIC8vIOa4healmuahjOmdouS4iuaJgOacieeahOeJjFxyXG4gICAgICB0aGlzLmNhcmRzX25vZGUgPSBbXVxyXG4gICAgICB0aGlzLmJvdHRvbV9jYXJkID0gW11cclxuICAgICAgdGhpcy5wdXNoX2NhcmRfdG1wID0gW11cclxuICAgICAgdGhpcy5jYXJkc05vZGUucmVtb3ZlQWxsQ2hpbGRyZW4oKVxyXG4gICAgICB0aGlzLmJvdHRvbV9jYXJkX3Bvc19ub2RlLnJlbW92ZUFsbENoaWxkcmVuKClcclxuICAgIH1cclxuICB9LFxyXG4gIHB1c2hDYXJkTm90aWZ5KGRhdGEpIHtcclxuICAgIHRoaXMuY2FyZF9kYXRhID0gZGF0YVxyXG4gICAgdGhpcy5jdXJfaW5kZXhfY2FyZCA9IGRhdGEubGVuZ3RoIC0gMVxyXG4gICAgdGhpcy5wdXNoQ2FyZChkYXRhKVxyXG4gICAgLy/lt6bovrnnp7vliqjlrprml7blmahcclxuICAgIHRoaXMuc2NoZWR1bGVPbmNlKHRoaXMuX3J1bmFjdGl2ZV9wdXNoY2FyZC5iaW5kKHRoaXMpLCAwLjMpXHJcbiAgICB0aGlzLm5vZGUucGFyZW50LmVtaXQoXCJwdXNoY2FyZF9vdGhlcl9ldmVudFwiKVxyXG4gIH0sXHJcbiAgLy/lpITnkIblj5HniYznmoTmlYjmnpxcclxuICBfcnVuYWN0aXZlX3B1c2hjYXJkKCkge1xyXG4gICAgaWYgKHRoaXMuY3VyX2luZGV4X2NhcmQgPCAwKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwicHVzaGNhcmQgZW5kXCIpXHJcbiAgICAgIC8v5Y+R54mM5Yqo55S75a6M5oiQ77yM5pi+56S65oqi5Zyw5Li75oyJ6ZKuXHJcbiAgICAgIC8vIHRoaXMuZmFwYWlfZW5kID0gdHJ1ZVxyXG4gICAgICAvLyBpZiAodGhpcy5yb2JfcGxheWVyX2FjY291bnRpZCA9PT0gbXlnbG9iYWwucGxheWVyRGF0YS51c2VySWQpIHtcclxuICAgICAgLy8gICB0aGlzLnJvYlVJLmFjdGl2ZSA9IHRydWVcclxuICAgICAgLy8gICB0aGlzLmN1c3RvbVNjaGVkdWxlck9uY2UoKVxyXG4gICAgICAvLyB9XHJcbiAgICAgIGlmIChpc29wZW5fc291bmQpIHtcclxuICAgICAgICBjYy5hdWRpb0VuZ2luZS5zdG9wKHRoaXMuZmFwYWlfYXVkaW9JRClcclxuICAgICAgfVxyXG4gICAgICAvL+mAmuefpWdhbWVzY2VuZeiKgueCue+8jOWAkuiuoeaXtlxyXG4gICAgICAvLyB2YXIgc2VuZGV2ZW50ID0gdGhpcy5yb2JfcGxheWVyX2FjY291bnRpZFxyXG4gICAgICAvLyB0aGlzLm5vZGUucGFyZW50LmVtaXQoXCJjYW5yb2JfZXZlbnRcIiwgc2VuZGV2ZW50KVxyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIC8v5Y6f5pyJ6YC76L6RICBcclxuICAgIC8vIHZhciBtb3ZlX25vZGUgPSB0aGlzLmNhcmRzX25vZGVbdGhpcy5jdXJfaW5kZXhfY2FyZF1cclxuICAgIC8vIG1vdmVfbm9kZS5hY3RpdmUgPSB0cnVlXHJcbiAgICAvLyB2YXIgbmV3eCA9IG1vdmVfbm9kZS54ICsgKHRoaXMuY2FyZF93aWR0aCAqIDAuNCp0aGlzLmN1cl9pbmRleF9jYXJkKSAtICh0aGlzLmNhcmRfd2lkdGggKiAwLjQpXHJcbiAgICAvLyB2YXIgYWN0aW9uID0gY2MubW92ZVRvKDAuMSwgY2MudjIobmV3eCwgLTI1MCkpO1xyXG4gICAgLy8gbW92ZV9ub2RlLnJ1bkFjdGlvbihhY3Rpb24pXHJcbiAgICAvLyB0aGlzLmN1cl9pbmRleF9jYXJkLS1cclxuICAgIC8vIHRoaXMuc2NoZWR1bGVPbmNlKHRoaXMuX3J1bmFjdGl2ZV9wdXNoY2FyZC5iaW5kKHRoaXMpLDAuMylcclxuXHJcbiAgICB2YXIgbW92ZV9ub2RlID0gdGhpcy5jYXJkc19ub2RlW3RoaXMuY2FyZHNfbm9kZS5sZW5ndGggLSB0aGlzLmN1cl9pbmRleF9jYXJkIC0gMV1cclxuICAgIG1vdmVfbm9kZS5hY3RpdmUgPSB0cnVlXHJcbiAgICB0aGlzLnB1c2hfY2FyZF90bXAucHVzaChtb3ZlX25vZGUpXHJcbiAgICB0aGlzLmZhcGFpX2F1ZGlvSUQgPSBjb21tb24uYXVkaW8uUGxheUVmZmVjdCh0aGlzLmZhcGFpQXVkaW8pXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucHVzaF9jYXJkX3RtcC5sZW5ndGggLSAxOyBpKyspIHtcclxuICAgICAgdmFyIG1vdmVfbm9kZSA9IHRoaXMucHVzaF9jYXJkX3RtcFtpXVxyXG4gICAgICB2YXIgbmV3eCA9IG1vdmVfbm9kZS54IC0gKHRoaXMuY2FyZF93aWR0aCAqIDAuNClcclxuICAgICAgdmFyIGFjdGlvbiA9IGNjLm1vdmVUbygwLjEsIGNjLnYyKG5ld3gsIC0yNTApKTtcclxuICAgICAgbW92ZV9ub2RlLnJ1bkFjdGlvbihhY3Rpb24pXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jdXJfaW5kZXhfY2FyZC0tXHJcbiAgICB0aGlzLnNjaGVkdWxlT25jZSh0aGlzLl9ydW5hY3RpdmVfcHVzaGNhcmQuYmluZCh0aGlzKSwgMC4zKVxyXG4gIH0sXHJcbiAgLy8g6YCa55+l5oqi5Zyw5Li75raI5oGvLOaYvuekuuebuOW6lOeahFVJXHJcbiAgY2Fucm9iTm90aWZ5KGRhdGEpIHtcclxuICAgIGNvbnNvbGUubG9nKFwib25DYW5Sb2JTdGF0ZVwiLCBkYXRhKVxyXG4gICAgLy/ov5nph4zpnIDopoEy5Liq5Y+Y6YeP5p2h5Lu277ya6Ieq5bex5piv5LiL5LiA5Liq5oqi5Zyw5Li777yMMuWPkeeJjOWKqOeUu+e7k+adn1xyXG4gICAgLy8gdGhpcy5yb2JfcGxheWVyX2FjY291bnRpZCA9IGRhdGFcclxuICAgIGlmIChkYXRhID09PSBteWdsb2JhbC5wbGF5ZXJEYXRhLnVzZXJJZCkge1xyXG4gICAgICB0aGlzLnJvYlVJLmFjdGl2ZSA9IHRydWVcclxuICAgICAgdGhpcy5jdXN0b21TY2hlZHVsZXJPbmNlKClcclxuICAgIH1cclxuICB9LFxyXG4gIC8v5byA5ZCv5LiA5Liq5a6a5pe25ZmoXHJcbiAgY3VzdG9tU2NoZWR1bGVyT25jZSgpIHtcclxuICAgIHRoaXMuY291bnQgPSAxMDtcclxuICAgIGNvbnN0IGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoIXRoaXMucm9iVUkuYWN0aXZlKSByZXR1cm5cclxuICAgICAgaWYgKCF0aGlzLmNvdW50KSB7XHJcbiAgICAgICAgLy8g5Zyo56ys5YWt5qyh5omn6KGM5Zue6LCD5pe25Y+W5raI6L+Z5Liq6K6h5pe25ZmoXHJcbiAgICAgICAgdGhpcy5yb2JVSS5hY3RpdmUgPSBmYWxzZVxyXG4gICAgICAgIHRoaXMudW5zY2hlZHVsZShjYWxsYmFjaylcclxuICAgICAgICB3aW5kb3cuJHNvY2tldC5lbWl0KCdjYW5yb2Jfc3RhdGVfbm90aWZ5Jywge1xyXG4gICAgICAgICAgdXNlcklkOiBteWdsb2JhbC5wbGF5ZXJEYXRhLnVzZXJJZCxcclxuICAgICAgICAgIHN0YXRlOiBxaWFuX3N0YXRlLmJ1cWlhbmcsXHJcbiAgICAgICAgfSlcclxuICAgICAgICBjb21tb24uYXVkaW8uUGxheUVmZmVjdCh0aGlzLmJ1cWlhbmdBdWRpbylcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnRpbWVMYWJlbC5zdHJpbmcgPSAtLXRoaXMuY291bnRcclxuICAgIH1cclxuICAgIHRoaXMuc2NoZWR1bGUoY2FsbGJhY2ssIDEsIDEwKVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQGRlc2NyaXB0aW9uIOWHuueJjFxyXG4gICAqL1xyXG4gIHNlbGZQbGF5QUhhbmROb3RpZnkocHJvbXB0TGlzdCkge1xyXG4gICAgY29uc29sZS5sb2coJ+eOqeWutuWHuueJjOaPkOekuicsIHByb21wdExpc3QpXHJcbiAgICB0aGlzLnByb21wdENvdW50ID0gMFxyXG4gICAgdGhpcy5wcm9tcHRMaXN0ID0gcHJvbXB0TGlzdFxyXG4gICAgLy8g5YWI5riF55CG5Ye654mM5Yy65Z+fXHJcbiAgICB0aGlzLmNsZWFyT3V0Wm9uZShteWdsb2JhbC5wbGF5ZXJEYXRhLnVzZXJJZClcclxuICAgIC8vIOaYvuekuuWPr+S7peWHuueJjOeahFVJXHJcbiAgICB0aGlzLnBsYXlpbmdVSV9ub2RlLmFjdGl2ZSA9IHRydWVcclxuICB9LFxyXG4gIC8vIOacuuWZqOWHuueJjFxyXG4gIHJvb3RQbGF5QUhhbmROb3RpZnkoeyB1c2VySWQsIGNhcmRzIH0pIHtcclxuICAgIHZhciBnYW1lU2NlbmVfc2NyaXB0ID0gdGhpcy5ub2RlLnBhcmVudC5nZXRDb21wb25lbnQoXCJnYW1lU2NlbmVcIilcclxuICAgIC8v6I635Y+W5Ye654mM5Yy65Z+f6IqC54K5XHJcbiAgICB2YXIgb3V0Q2FyZF9ub2RlID0gZ2FtZVNjZW5lX3NjcmlwdC5nZXRVc2VyT3V0Q2FyZFBvc0J5QWNjb3VudCh1c2VySWQpXHJcbiAgICBpZiAoIW91dENhcmRfbm9kZSkgcmV0dXJuXHJcbiAgICBvdXRDYXJkX25vZGUucmVtb3ZlQWxsQ2hpbGRyZW4odHJ1ZSk7XHJcblxyXG4gICAgdmFyIG5vZGVfY2FyZHMgPSBbXVxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYXJkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgY2FyZCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuY2FyZF9wcmVmYWIpXHJcbiAgICAgIGNhcmQuZ2V0Q29tcG9uZW50KFwiY2FyZFwiKS5zaG93Q2FyZHMoY2FyZHNbaV0sIHVzZXJJZClcclxuICAgICAgbm9kZV9jYXJkcy5wdXNoKGNhcmQpXHJcbiAgICB9XHJcbiAgICBjb25zdCBkZWxheSA9IGNvbW1vbi5yYW5kb20oMCwgMTApXHJcbiAgICBjb25zdCBwbGF5ZXJOb2RlID0gZ2FtZVNjZW5lX3NjcmlwdC5nZXRVc2VyTm9kZUJ5QWNjb3VudCh1c2VySWQpXHJcbiAgICBpZiAoIXBsYXllck5vZGUpIHJldHVyblxyXG4gICAgcGxheWVyTm9kZS5zY2hlZHVsZXJPbmNlKCgpID0+IHtcclxuICAgICAgdGhpcy5hcHBlbmRPdGhlckNhcmRzVG9PdXRab25lKG91dENhcmRfbm9kZSwgbm9kZV9jYXJkcywgMClcclxuICAgICAgcGxheWVyTm9kZS5zdWJ0cmFjdENhcmRzKGNhcmRzLmxlbmd0aClcclxuICAgICAgLy8g6YCa55+l5pyN5Yqh77yM5LiL5LiA5a625Ye654mMXHJcbiAgICAgIHdpbmRvdy4kc29ja2V0LmVtaXQoJ25leHRQbGF5ZXJOb3RpZnknLCB1c2VySWQpXHJcbiAgICB9LCBkZWxheSlcclxuICB9LFxyXG4gIC8vIOa4uOaIj+e7k+adn1xyXG4gIGdhbWVFbmROb3RpZnkoeyBpc1dpbiwgb3RoZXJQbGF5ZXJDYXJkcyB9KSB7XHJcbiAgICBjb25zb2xlLmxvZygn5ri45oiP57uT5p2fJywgeyBpc1dpbiwgb3RoZXJQbGF5ZXJDYXJkcyB9KVxyXG4gICAgaWYgKGlzV2luKSB7XHJcbiAgICAgIHRoaXMud2luTm9kZS5hY3RpdmUgPSB0cnVlXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmxvc2VOb2RlLmFjdGl2ZSA9IHRydWVcclxuICAgIH1cclxuICAgIGRkekRhdGEuZ2FtZVN0YXRlID0gZGR6Q29uc3RhbnRzLmdhbWVTdGF0ZS5XQUlUUkVBRFlcclxuICB9LFxyXG4gIC8v5a+554mM5o6S5bqPXHJcbiAgc29ydENhcmQoKSB7XHJcbiAgICB0aGlzLmNhcmRzX25vZGUuc29ydChmdW5jdGlvbiAoeCwgeSkge1xyXG4gICAgICB2YXIgYSA9IHguZ2V0Q29tcG9uZW50KFwiY2FyZFwiKS5jYXJkX2RhdGE7XHJcbiAgICAgIHZhciBiID0geS5nZXRDb21wb25lbnQoXCJjYXJkXCIpLmNhcmRfZGF0YTtcclxuXHJcbiAgICAgIGlmIChhLmhhc093blByb3BlcnR5KCd2YWx1ZScpICYmIGIuaGFzT3duUHJvcGVydHkoJ3ZhbHVlJykpIHtcclxuICAgICAgICByZXR1cm4gYi52YWx1ZSAtIGEudmFsdWU7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGEuaGFzT3duUHJvcGVydHkoJ2tpbmcnKSAmJiAhYi5oYXNPd25Qcm9wZXJ0eSgna2luZycpKSB7XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICghYS5oYXNPd25Qcm9wZXJ0eSgna2luZycpICYmIGIuaGFzT3duUHJvcGVydHkoJ2tpbmcnKSkge1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChhLmhhc093blByb3BlcnR5KCdraW5nJykgJiYgYi5oYXNPd25Qcm9wZXJ0eSgna2luZycpKSB7XHJcbiAgICAgICAgcmV0dXJuIGIua2luZyAtIGEua2luZztcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIC8v6L+Z6YeM5L2/55So5Zu65a6a5Z2Q5qCH77yM5Zug5Li65Y+WdGhpcy5jYXJkc19ub2RlWzBdLnhr5Y+v6IO95o6S5bqP5Li65a6M5oiQ77yM5a+86Ie0eOmUmeivr1xyXG4gICAgLy/miYDku6XlgZoxMDAw5q+r56eS55qE5bu25pe2XHJcbiAgICB2YXIgeCA9IHRoaXMuY2FyZHNfbm9kZVswXS54O1xyXG4gICAgdmFyIHRpbWVvdXQgPSAxMDAwXHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgLy92YXIgeCA9IC00MTcuNiBcclxuICAgICAgY29uc29sZS5sb2coXCJzb3J0IHg6XCIgKyB4KVxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FyZHNfbm9kZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBjYXJkID0gdGhpcy5jYXJkc19ub2RlW2ldO1xyXG4gICAgICAgIGNhcmQuekluZGV4ID0gaTsgLy/orr7nva7niYznmoTlj6DliqDmrKHluo8semluZGV46LaK5aSn5pi+56S65Zyo5LiK6Z2iXHJcbiAgICAgICAgY2FyZC54ID0geCArIGNhcmQud2lkdGggKiAwLjQgKiBpO1xyXG4gICAgICB9XHJcbiAgICB9LmJpbmQodGhpcyksIHRpbWVvdXQpO1xyXG4gIH0sXHJcbiAgcHVzaENhcmQoZGF0YSkge1xyXG4gICAgaWYgKGRhdGEpIHtcclxuICAgICAgZGF0YS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgaWYgKGEuaGFzT3duUHJvcGVydHkoJ3ZhbHVlJykgJiYgYi5oYXNPd25Qcm9wZXJ0eSgndmFsdWUnKSkge1xyXG4gICAgICAgICAgcmV0dXJuIGIudmFsdWUgLSBhLnZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYS5oYXNPd25Qcm9wZXJ0eSgna2luZycpICYmICFiLmhhc093blByb3BlcnR5KCdraW5nJykpIHtcclxuICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFhLmhhc093blByb3BlcnR5KCdraW5nJykgJiYgYi5oYXNPd25Qcm9wZXJ0eSgna2luZycpKSB7XHJcbiAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGEuaGFzT3duUHJvcGVydHkoJ2tpbmcnKSAmJiBiLmhhc093blByb3BlcnR5KCdraW5nJykpIHtcclxuICAgICAgICAgIHJldHVybiBiLmtpbmcgLSBhLmtpbmc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIC8v5Yib5bu6Y2FyZOmihOWItuS9k1xyXG4gICAgdGhpcy5jYXJkc19ub2RlID0gW11cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTc7IGkrKykge1xyXG5cclxuICAgICAgdmFyIGNhcmQgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmNhcmRfcHJlZmFiKVxyXG4gICAgICBjYXJkLnNjYWxlID0gMC44XHJcbiAgICAgIC8vIGNhcmQucGFyZW50ID0gdGhpcy5ub2RlLnBhcmVudFxyXG4gICAgICBjYXJkLnBhcmVudCA9IHRoaXMuY2FyZHNOb2RlXHJcbiAgICAgIGNhcmQueCA9IGNhcmQud2lkdGggKiAwLjQgKiAoLTAuNSkgKiAoLTE2KSArIGNhcmQud2lkdGggKiAwLjQgKiAwO1xyXG4gICAgICAvL+i/memHjOWunueOsOS4uu+8jOavj+WPkeS4gOW8oOeJjO+8jOaUvuWcqOW3sue7j+WPkeeahOeJjOacgOWQju+8jOeEtuWQjuaVtOS9k+enu+WKqFxyXG4gICAgICBjYXJkLnkgPSAtMjUwXHJcbiAgICAgIGNhcmQuYWN0aXZlID0gZmFsc2VcclxuXHJcbiAgICAgIGNhcmQuZ2V0Q29tcG9uZW50KFwiY2FyZFwiKS5zaG93Q2FyZHMoZGF0YVtpXSwgbXlnbG9iYWwucGxheWVyRGF0YS51c2VySWQpXHJcbiAgICAgIC8v5a2Y5YKo54mM55qE5L+h5oGvLOeUqOS6juWQjumdouWPkeeJjOaViOaenFxyXG4gICAgICB0aGlzLmNhcmRzX25vZGUucHVzaChjYXJkKVxyXG4gICAgICB0aGlzLmNhcmRfd2lkdGggPSBjYXJkLndpZHRoXHJcbiAgICB9XHJcbiAgICAvL+WIm+W7ujPlvKDlupXniYxcclxuICAgIHRoaXMuYm90dG9tX2NhcmQgPSBbXVxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcclxuICAgICAgdmFyIGRpX2NhcmQgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmNhcmRfcHJlZmFiKVxyXG4gICAgICBkaV9jYXJkLnNjYWxlID0gMC40XHJcbiAgICAgIC8vIGRpX2NhcmQucG9zaXRpb24gPSB0aGlzLmJvdHRvbV9jYXJkX3Bvc19ub2RlLnBvc2l0aW9uXHJcbiAgICAgIC8v5LiJ5byg54mM77yM5Lit6Ze05Z2Q5qCH5bCx5pivYm90dG9tX2NhcmRfcG9zX25vZGXoioLngrnlnZDmoIfvvIxcclxuICAgICAgLy8wLOWSjDLkuKTlvKDniYzlt6blj7Pnp7vliqh3aW5kdGgqMC40XHJcbiAgICAgIGlmIChpID09IDApIHtcclxuICAgICAgICBkaV9jYXJkLnggPSBkaV9jYXJkLnggLSBkaV9jYXJkLndpZHRoICogMC41XHJcbiAgICAgIH0gZWxzZSBpZiAoaSA9PSAyKSB7XHJcbiAgICAgICAgZGlfY2FyZC54ID0gZGlfY2FyZC54ICsgZGlfY2FyZC53aWR0aCAqIDAuNVxyXG4gICAgICB9XHJcbiAgICAgIC8vZGlfY2FyZC54ID0gZGlfY2FyZC53aWR0aC1pKmRpX2NhcmQud2lkdGgtMjBcclxuICAgICAgLy9kaV9jYXJkLnk9NjBcclxuICAgICAgLy8gZGlfY2FyZC5wYXJlbnQgPSB0aGlzLm5vZGUucGFyZW50XHJcbiAgICAgIGRpX2NhcmQucGFyZW50ID0gdGhpcy5ib3R0b21fY2FyZF9wb3Nfbm9kZVxyXG4gICAgICAvL+WtmOWCqOWcqOWuueWZqOmHjFxyXG4gICAgICB0aGlzLmJvdHRvbV9jYXJkLnB1c2goZGlfY2FyZClcclxuICAgIH1cclxuICB9LFxyXG4gIC8v57uZ546p5a625Y+R6YCB5LiJ5byg5bqV54mM5ZCO77yM6L+HMXMs5oqK54mM6K6+572u5YiweT0tMjUw5L2N572u5pWI5p6cXHJcbiAgc2NoZWR1bGVQdXNoVGhyZWVDYXJkKCkge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNhcmRzX25vZGUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGNhcmQgPSB0aGlzLmNhcmRzX25vZGVbaV1cclxuICAgICAgaWYgKGNhcmQueSA9PSAtMjMwKSB7XHJcbiAgICAgICAgY2FyZC55ID0gLTI1MFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLnVwZGF0ZUNhcmRzKClcclxuICB9LFxyXG4gIC8v57uZ5Zyw5Li75Y+R5LiJ5byg5o6S77yM5bm25pi+56S65Zyo5Y6f5pyJ54mM55qE5ZCO6Z2iXHJcbiAgcHVzaFRocmVlQ2FyZCgpIHtcclxuICAgIC8v5q+P5byg54mM55qE5YW25a6e5L2N572uIFxyXG4gICAgdmFyIGxhc3RfY2FyZF94ID0gdGhpcy5jYXJkc19ub2RlW3RoaXMuY2FyZHNfbm9kZS5sZW5ndGggLSAxXS54XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYm90dG9tX2NhcmRfZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgY2FyZCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuY2FyZF9wcmVmYWIpXHJcbiAgICAgIGNhcmQuc2NhbGUgPSAwLjhcclxuICAgICAgLy8gY2FyZC5wYXJlbnQgPSB0aGlzLm5vZGUucGFyZW50XHJcbiAgICAgIGNhcmQucGFyZW50ID0gdGhpcy5jYXJkc05vZGVcclxuXHJcbiAgICAgIGNhcmQueCA9IGxhc3RfY2FyZF94ICsgKChpICsgMSkgKiB0aGlzLmNhcmRfd2lkdGggKiAwLjQpXHJcbiAgICAgIGNhcmQueSA9IC0yMzAgIC8v5YWI5oqK5bqV55uY5pS+5ZyoLTIzMO+8jOWcqOiuvue9ruS4quWumuaXtuWZqOS4i+enu+WIsC0yNTDnmoTkvY3nva5cclxuXHJcbiAgICAgIC8vY29uc29sZS5sb2coXCJwdXNoVGhyZWVDYXJkIHg6XCIrY2FyZC54KVxyXG4gICAgICBjYXJkLmdldENvbXBvbmVudChcImNhcmRcIikuc2hvd0NhcmRzKHRoaXMuYm90dG9tX2NhcmRfZGF0YVtpXSwgbXlnbG9iYWwucGxheWVyRGF0YS51c2VySWQpXHJcbiAgICAgIGNhcmQuYWN0aXZlID0gdHJ1ZVxyXG4gICAgICB0aGlzLmNhcmRzX25vZGUucHVzaChjYXJkKVxyXG4gICAgfVxyXG4gICAgdGhpcy5zb3J0Q2FyZCgpXHJcbiAgICAvL+iuvue9ruS4gOS4quWumuaXtuWZqO+8jOWcqDJz5ZCO77yM5L+u5pS5eeWdkOagh+S4ui0yNTBcclxuICAgIHRoaXMuc2NoZWR1bGVPbmNlKHRoaXMuc2NoZWR1bGVQdXNoVGhyZWVDYXJkLmJpbmQodGhpcyksIDIpXHJcbiAgfSxcclxuXHJcbiAgZGVzdG9yeUNhcmQodXNlcklkLCBjaG9vc2VfY2FyZCkge1xyXG4gICAgaWYgKCFjaG9vc2VfY2FyZC5sZW5ndGgpIHJldHVyblxyXG4gICAgLyrlh7rniYzpgLvovpFcclxuICAgICAgMS4g5bCG6YCJ5Lit55qE54mMIOS7jueItuiKgueCueS4reenu+mZpFxyXG4gICAgICAyLiDku450aGlzLmNhcmRzX25vZGUg5pWw57uE5Lit77yM5Yig6ZmkIOmAieS4reeahOeJjCBcclxuICAgICAgMy4g5bCGIOKAnOmAieS4reeahOeJjOKAnSDmt7vliqDliLDlh7rniYzljLrln59cclxuICAgICAgICAgIDMuMSDmuIXnqbrlh7rniYzljLrln59cclxuICAgICAgICAgIDMuMiDmt7vliqDlrZDoioLngrlcclxuICAgICAgICAgIDMuMyDorr7nva5zY2FsZVxyXG4gICAgICAgICAgMy40IOiuvue9rnBvc2l0aW9uXHJcbiAgICAgIDQuICDph43mlrDorr7nva7miYvkuK3nmoTniYznmoTkvY3nva4gIHRoaXMudXBkYXRlQ2FyZHMoKTtcclxuICAgICovXHJcbiAgICAvLzEvMuatpemqpOWIoOmZpOiHquW3seaJi+S4iueahGNhcmToioLngrkgXHJcbiAgICB2YXIgZGVzdHJveV9jYXJkID0gW11cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hvb3NlX2NhcmQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLmNhcmRzX25vZGUubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICB2YXIgY2FhcmRJbmRleCA9IHRoaXMuY2FyZHNfbm9kZVtqXS5nZXRDb21wb25lbnQoXCJjYXJkXCIpLmNhYXJkSW5kZXhcclxuICAgICAgICBpZiAoY2FhcmRJbmRleCA9PSBjaG9vc2VfY2FyZFtpXS5pbmRleCkge1xyXG4gICAgICAgICAgLy90aGlzLmNhcmRzX25vZGVbal0uZGVzdHJveSgpXHJcbiAgICAgICAgICB0aGlzLmNhcmRzX25vZGVbal0ucmVtb3ZlRnJvbVBhcmVudCh0cnVlKTtcclxuICAgICAgICAgIGRlc3Ryb3lfY2FyZC5wdXNoKHRoaXMuY2FyZHNfbm9kZVtqXSlcclxuICAgICAgICAgIHRoaXMuY2FyZHNfbm9kZS5zcGxpY2UoaiwgMSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMuYXBwZW5kQ2FyZHNUb091dFpvbmUodXNlcklkLCBkZXN0cm95X2NhcmQpXHJcbiAgICB0aGlzLnVwZGF0ZUNhcmRzKClcclxuICB9LFxyXG5cclxuICAvL+a4hemZpOaYvuekuuWHuueJjOiKgueCueWFqOmDqOWtkOiKgueCuSjlsLHmmK/miorlh7rniYznmoTmuIXnqbopXHJcbiAgY2xlYXJPdXRab25lKHVzZXJJZCkge1xyXG4gICAgdmFyIGdhbWVTY2VuZV9zY3JpcHQgPSB0aGlzLm5vZGUucGFyZW50LmdldENvbXBvbmVudChcImdhbWVTY2VuZVwiKVxyXG4gICAgdmFyIG91dENhcmRfbm9kZSA9IGdhbWVTY2VuZV9zY3JpcHQuZ2V0VXNlck91dENhcmRQb3NCeUFjY291bnQodXNlcklkKVxyXG4gICAgdmFyIGNoaWxkcmVuID0gb3V0Q2FyZF9ub2RlLmNoaWxkcmVuO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgY2FyZCA9IGNoaWxkcmVuW2ldO1xyXG4gICAgICBjYXJkLmRlc3Ryb3koKVxyXG4gICAgfVxyXG4gICAgb3V0Q2FyZF9ub2RlLnJlbW92ZUFsbENoaWxkcmVuKHRydWUpO1xyXG4gIH0sXHJcbiAgLy/lr7nlh7rnmoTniYzlgZrmjpLluo9cclxuICBwdXNoQ2FyZFNvcnQoY2FyZHMpIHtcclxuICAgIGlmIChjYXJkcy5sZW5ndGggPT0gMSkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIGNhcmRzLnNvcnQoZnVuY3Rpb24gKHgsIHkpIHtcclxuICAgICAgdmFyIGEgPSB4LmdldENvbXBvbmVudChcImNhcmRcIikuY2FyZF9kYXRhO1xyXG4gICAgICB2YXIgYiA9IHkuZ2V0Q29tcG9uZW50KFwiY2FyZFwiKS5jYXJkX2RhdGE7XHJcblxyXG4gICAgICBpZiAoYS5oYXNPd25Qcm9wZXJ0eSgndmFsdWUnKSAmJiBiLmhhc093blByb3BlcnR5KCd2YWx1ZScpKSB7XHJcbiAgICAgICAgcmV0dXJuIGIudmFsdWUgLSBhLnZhbHVlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChhLmhhc093blByb3BlcnR5KCdraW5nJykgJiYgIWIuaGFzT3duUHJvcGVydHkoJ2tpbmcnKSkge1xyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoIWEuaGFzT3duUHJvcGVydHkoJ2tpbmcnKSAmJiBiLmhhc093blByb3BlcnR5KCdraW5nJykpIHtcclxuICAgICAgICByZXR1cm4gMTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoYS5oYXNPd25Qcm9wZXJ0eSgna2luZycpICYmIGIuaGFzT3duUHJvcGVydHkoJ2tpbmcnKSkge1xyXG4gICAgICAgIHJldHVybiBiLmtpbmcgLSBhLmtpbmc7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfSxcclxuICAvKipcclxuICAgKiBAZGVzY3JpcHRpb24g5qGM6Z2i5re75Yqg5paw54mMXHJcbiAgICogQHBhcmFtIHtjYy5Ob2RlfSBvdXRDYXJkX25vZGUg546p5a625Ye654mM5Yy65Z+f6IqC54K5XHJcbiAgICogQHBhcmFtIHtMaXN0fSBjYXJkcyDniYzlnovoioLngrnpm4blkIhcclxuICAgKiBAcGFyYW0ge051bWJlcn0geW9mZnNldCDnp7vliqjot53nprtcclxuICAgKi9cclxuICBhcHBlbmRPdGhlckNhcmRzVG9PdXRab25lKG91dENhcmRfbm9kZSwgY2FyZHMsIHlvZmZzZXQpIHtcclxuICAgIGlmICghY2FyZHMubGVuZ3RoKSB7XHJcbiAgICAgIGNvbnN0IGluZGV4ID0gY29tbW9uLnJhbmRvbSgwLCAyKVxyXG4gICAgICBjb21tb24uYXVkaW8uUGxheUVmZmVjdCh0aGlzLmJ1eWFvQXVkaW9baW5kZXhdKVxyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIGNvbW1vbi5hdWRpby5QbGF5RWZmZWN0KHRoaXMuY2h1cGFpQXVkaW8pXHJcbiAgICAvL+a3u+WKoOaWsOeahOWtkOiKgueCuVxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYXJkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgY2FyZCA9IGNhcmRzW2ldO1xyXG4gICAgICBvdXRDYXJkX25vZGUuYWRkQ2hpbGQoY2FyZCwgMTAwICsgaSkgLy/nrKzkuozkuKrlj4LmlbDmmK8gem9yZGVyLOS/neivgeeJjOS4jeiDveiiq+mBruS9j1xyXG4gICAgfVxyXG4gICAgLy/lr7nlh7rniYzov5vooYzmjpLluo9cclxuICAgIC8v6K6+572u5Ye654mM6IqC54K555qE5Z2Q5qCHXHJcbiAgICB2YXIgelBvaW50ID0gY2FyZHMubGVuZ3RoIC8gMjtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FyZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGNhcmROb2RlID0gb3V0Q2FyZF9ub2RlLmdldENoaWxkcmVuKClbaV1cclxuICAgICAgdmFyIHggPSAoaSAtIHpQb2ludCkgKiAzMDtcclxuICAgICAgdmFyIHkgPSBjYXJkTm9kZS55ICsgeW9mZnNldDsgLy/lm6DkuLrmr4/kuKroioLngrnpnIDopoHnmoRZ5LiN5LiA5qC377yM5YGa5Y+C5pWw5Lyg5YWlXHJcbiAgICAgIGNhcmROb2RlLnNldFNjYWxlKDAuNSwgMC41KTtcclxuICAgICAgY2FyZE5vZGUuc2V0UG9zaXRpb24oeCwgeSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvL+WwhiDigJzpgInkuK3nmoTniYzigJ0g5re75Yqg5Yiw5Ye654mM5Yy65Z+fXHJcbiAgLy9kZXN0cm95X2NhcmTmmK/njqnlrrbmnKzmrKHlh7rnmoTniYxcclxuICBhcHBlbmRDYXJkc1RvT3V0Wm9uZSh1c2VySWQsIGRlc3Ryb3lfY2FyZCkge1xyXG4gICAgaWYgKCFkZXN0cm95X2NhcmQubGVuZ3RoKSByZXR1cm5cclxuICAgIC8v5YWI57uZ5pys5qyh5Ye655qE54mM5YGa5LiA5Liq5o6S5bqPXHJcbiAgICB0aGlzLnB1c2hDYXJkU29ydChkZXN0cm95X2NhcmQpXHJcbiAgICB2YXIgZ2FtZVNjZW5lX3NjcmlwdCA9IHRoaXMubm9kZS5wYXJlbnQuZ2V0Q29tcG9uZW50KFwiZ2FtZVNjZW5lXCIpXHJcbiAgICAvL+iOt+WPluWHuueJjOWMuuWfn+iKgueCuVxyXG4gICAgdmFyIG91dENhcmRfbm9kZSA9IGdhbWVTY2VuZV9zY3JpcHQuZ2V0VXNlck91dENhcmRQb3NCeUFjY291bnQodXNlcklkKVxyXG4gICAgdGhpcy5hcHBlbmRPdGhlckNhcmRzVG9PdXRab25lKG91dENhcmRfbm9kZSwgZGVzdHJveV9jYXJkLCAzNjApXHJcbiAgICAvL3Njb25zb2xlLmxvZyhcIk91dFpvbmU6XCIrb3V0Q2FyZF9ub2RlLm5hbWUpXHJcbiAgfSxcclxuXHJcbiAgLy/ph43mlrDmjpLluo/miYvkuIrnmoTniYws5bm256e75YqoXHJcbiAgdXBkYXRlQ2FyZHMoKSB7XHJcbiAgICB2YXIgemVyb1BvaW50ID0gdGhpcy5jYXJkc19ub2RlLmxlbmd0aCAvIDI7XHJcbiAgICAvL3ZhciBsYXN0X2NhcmRfeCA9IHRoaXMuY2FyZHNfbm9kZVt0aGlzLmNhcmRzX25vZGUubGVuZ3RoLTFdLnhcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jYXJkc19ub2RlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBjYXJkTm9kZSA9IHRoaXMuY2FyZHNfbm9kZVtpXVxyXG4gICAgICB2YXIgeCA9IChpIC0gemVyb1BvaW50KSAqICh0aGlzLmNhcmRfd2lkdGggKiAwLjQpICsgNTA7XHJcbiAgICAgIGNhcmROb2RlLnNldFBvc2l0aW9uKHgsIC0yNTApO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHBsYXlQdXNoQ2FyZFNvdW5kKGNhcmRfbmFtZSkge1xyXG4gICAgY29uc29sZS5sb2coXCJwbGF5UHVzaENhcmRTb3VuZDpcIiArIGNhcmRfbmFtZSlcclxuICAgIGlmIChjYXJkX25hbWUgPT0gXCJcIikgcmV0dXJuXHJcbiAgICBzd2l0Y2ggKGNhcmRfbmFtZSkge1xyXG4gICAgICBjYXNlIENhcmRzVmFsdWUub25lLm5hbWU6XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSBDYXJkc1ZhbHVlLmRvdWJsZS5uYW1lOlxyXG4gICAgICAgIGlmIChpc29wZW5fc291bmQpIHtcclxuICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXkoY2MudXJsLnJhdyhcInJlc291cmNlcy9zb3VuZC9kdWl6aS5tcDNcIikpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgfSxcclxuICAvLyB1cGRhdGUgKGR0KSB7fSxcclxuICBvbkJ1dHRvbkNsaWNrKGV2ZW50LCBjdXN0b21EYXRhKSB7XHJcbiAgICBzd2l0Y2ggKGN1c3RvbURhdGEpIHtcclxuICAgICAgY2FzZSBcImJ0bl9xaWFuZHpcIjogLy8g5LiN5oqiXHJcbiAgICAgICAgLy8gbXlnbG9iYWwuc29ja2V0LnJlcXVlc3RSb2JTdGF0ZShxaWFuX3N0YXRlLnFpYW5nKVxyXG4gICAgICAgIHdpbmRvdy4kc29ja2V0LmVtaXQoJ2NhbnJvYl9zdGF0ZV9ub3RpZnknLCB7XHJcbiAgICAgICAgICB1c2VySWQ6IG15Z2xvYmFsLnBsYXllckRhdGEudXNlcklkLFxyXG4gICAgICAgICAgc3RhdGU6IHFpYW5fc3RhdGUucWlhbmcsXHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLnJvYlVJLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgICAgY29tbW9uLmF1ZGlvLlBsYXlFZmZlY3QodGhpcy5qaWFvZGl6aHVBdWRpbylcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIFwiYnRuX2J1cWlhbmR6XCI6IC8vIOaKouWcsOS4u1xyXG4gICAgICAgIC8vIG15Z2xvYmFsLnNvY2tldC5yZXF1ZXN0Um9iU3RhdGUocWlhbl9zdGF0ZS5idXFpYW5nKVxyXG4gICAgICAgIHdpbmRvdy4kc29ja2V0LmVtaXQoJ2NhbnJvYl9zdGF0ZV9ub3RpZnknLCB7XHJcbiAgICAgICAgICB1c2VySWQ6IG15Z2xvYmFsLnBsYXllckRhdGEudXNlcklkLFxyXG4gICAgICAgICAgc3RhdGU6IHFpYW5fc3RhdGUuYnVxaWFuZyxcclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMucm9iVUkuYWN0aXZlID0gZmFsc2VcclxuICAgICAgICBjb21tb24uYXVkaW8uUGxheUVmZmVjdCh0aGlzLmJ1cWlhbmdBdWRpbylcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIFwibm9wdXNoY2FyZFwiOiAgLy8g5LiN5Ye654mMXHJcbiAgICAgICAgLy8gbXlnbG9iYWwuc29ja2V0LnJlcXVlc3RfYnVjaHVfY2FyZChbXSwgbnVsbClcclxuICAgICAgICB3aW5kb3cuJHNvY2tldC5lbWl0KCduZXh0UGxheWVyTm90aWZ5JywgbXlnbG9iYWwucGxheWVyRGF0YS51c2VySWQpXHJcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLnByb21wdExpc3QubGVuZ3RoID8gY29tbW9uLnJhbmRvbSgwLCAyKSA6IDNcclxuICAgICAgICBjb21tb24uYXVkaW8uUGxheUVmZmVjdCh0aGlzLmJ1eWFvQXVkaW9baW5kZXhdKVxyXG4gICAgICAgIHRoaXMuY2hvb3NlX2NhcmRfZGF0YSA9IFtdXHJcbiAgICAgICAgdGhpcy5jYXJkc19ub2RlLm1hcChub2RlID0+IG5vZGUuZW1pdChcInJlc2V0X2NhcmRfZmxhZ1wiKSlcclxuICAgICAgICB0aGlzLnBsYXlpbmdVSV9ub2RlLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSBcInB1c2hjYXJkXCI6ICAgLy8g5Ye654mMXHJcbiAgICAgICAgLy/lhYjojrflj5bmnKzmrKHlh7rniYzmlbDmja5cclxuICAgICAgICBpZiAodGhpcy5jaG9vc2VfY2FyZF9kYXRhLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICB0aGlzLnRpcHNMYWJlbC5zdHJpbmcgPSBcIuivt+mAieaLqeeJjCFcIlxyXG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGlwc0xhYmVsLnN0cmluZyA9IFwiXCJcclxuICAgICAgICAgIH0uYmluZCh0aGlzKSwgMjAwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdpbmRvdy4kc29ja2V0LmVtaXQoJ3BsYXlBSGFuZE5vdGlmeScsIHtcclxuICAgICAgICAgIHVzZXJJZDogbXlnbG9iYWwucGxheWVyRGF0YS51c2VySWQsXHJcbiAgICAgICAgICBjYXJkczogdGhpcy5jaG9vc2VfY2FyZF9kYXRhLFxyXG4gICAgICAgIH0sICh7c3RhdGV9KSA9PiB7XHJcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5kZXN0b3J5Q2FyZChteWdsb2JhbC5wbGF5ZXJEYXRhLnVzZXJJZCwgdGhpcy5jaG9vc2VfY2FyZF9kYXRhKVxyXG4gICAgICAgICAgICB0aGlzLnBsYXlpbmdVSV9ub2RlLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvL+WHuueJjOWksei0pe+8jOaKiumAieaLqeeahOeJjOW9kuS9jVxyXG4gICAgICAgICAgICB0aGlzLmNhcmRzX25vZGUubWFwKG5vZGUgPT4gbm9kZS5lbWl0KFwicmVzZXRfY2FyZF9mbGFnXCIpKVxyXG4gICAgICAgICAgICAvLyBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FyZHNfbm9kZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAvLyAgIHRoaXMuY2FyZHNfbm9kZVtpXS5lbWl0KFwicmVzZXRfY2FyZF9mbGFnXCIpXHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuY2hvb3NlX2NhcmRfZGF0YSA9IFtdXHJcbiAgICAgICAgfSlcclxuICAgICAgICAvLyBteWdsb2JhbC5zb2NrZXQucmVxdWVzdF9jaHVfY2FyZCh0aGlzLmNob29zZV9jYXJkX2RhdGEsIGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcclxuICAgICAgICAvLyAgIGlmIChlcnIpIHtcclxuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCJyZXF1ZXN0X2NodV9jYXJkOlwiICsgZXJyKVxyXG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcInJlcXVlc3RfY2h1X2NhcmRcIiArIEpTT04uc3RyaW5naWZ5KGRhdGEpKVxyXG4gICAgICAgIC8vICAgICBpZiAodGhpcy50aXBzTGFiZWwuc3RyaW5nID09IFwiXCIpIHtcclxuICAgICAgICAvLyAgICAgICB0aGlzLnRpcHNMYWJlbC5zdHJpbmcgPSBkYXRhLm1zZ1xyXG4gICAgICAgIC8vICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vICAgICAgICAgdGhpcy50aXBzTGFiZWwuc3RyaW5nID0gXCJcIlxyXG4gICAgICAgIC8vICAgICAgIH0uYmluZCh0aGlzKSwgMjAwMCk7XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyAgICAgLy/lh7rniYzlpLHotKXvvIzmiorpgInmi6nnmoTniYzlvZLkvY1cclxuICAgICAgICAvLyAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNhcmRzX25vZGUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAvLyAgICAgICB2YXIgY2FyZCA9IHRoaXMuY2FyZHNfbm9kZVtpXVxyXG4gICAgICAgIC8vICAgICAgIGNhcmQuZW1pdChcInJlc2V0X2NhcmRfZmxhZ1wiKVxyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gICAgIHRoaXMuY2hvb3NlX2NhcmRfZGF0YSA9IFtdXHJcbiAgICAgICAgLy8gICB9IGVsc2Uge1xyXG4gICAgICAgIC8vICAgICAvL+WHuueJjOaIkOWKn1xyXG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcInJlc3BfY2h1X2NhcmQgZGF0YTpcIiArIEpTT04uc3RyaW5naWZ5KGRhdGEpKVxyXG4gICAgICAgIC8vICAgICB0aGlzLnBsYXlpbmdVSV9ub2RlLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgICAgLy8gICAgIC8v5pKt5pS+5Ye654mM55qE5aOw6Z+zXHJcbiAgICAgICAgLy8gICAgIC8vcmVzcF9jaHVfY2FyZCBkYXRhOntcImFjY291bnRcIjpcIjI1MTk5MDFcIixcIm1zZ1wiOlwic3VjZXNzXCIsXCJjYXJkdmFsdWVcIjp7XCJuYW1lXCI6XCJEb3VibGVcIixcInZhbHVlXCI6MX19XHJcbiAgICAgICAgLy8gICAgIC8ve1widHlwZVwiOlwib3RoZXJfY2h1Y2FyZF9ub3RpZnlcIixcInJlc3VsdFwiOjAsXCJkYXRhXCI6e1widXNlcklkXCI6XCIyNTE5OTAxXCIsXCJjYXJkc1wiOlt7XCJpbmRleFwiOjI0LFwiY2FyZF9kYXRhXCI6e1wiaW5kZXhcIjoyNCxcInZhbHVlXCI6NixcInNoYXBlXCI6MX19LHtcImluZGV4XCI6MjYsXCJjYXJkX2RhdGFcIjp7XCJpbmRleFwiOjI2LFwidmFsdWVcIjo2LFwic2hhcGVcIjozfX1dfSxcImNhbGxCYWNrSW5kZXhcIjowfVxyXG4gICAgICAgIC8vICAgICB0aGlzLnBsYXlQdXNoQ2FyZFNvdW5kKGRhdGEuY2FyZHZhbHVlLm5hbWUpXHJcbiAgICAgICAgLy8gICAgIHRoaXMuZGVzdG9yeUNhcmQoZGF0YS5hY2NvdW50LCB0aGlzLmNob29zZV9jYXJkX2RhdGEpXHJcbiAgICAgICAgLy8gICAgIHRoaXMuY2hvb3NlX2NhcmRfZGF0YSA9IFtdXHJcbiAgICAgICAgLy8gICB9XHJcbiAgICAgICAgLy8gfS5iaW5kKHRoaXMpKVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgXCJ0aXBjYXJkXCI6IC8vIOaPkOekulxyXG4gICAgICAgIC8vIOW3sumAieeJjOW9kuS9jVxyXG4gICAgICAgIHRoaXMuY2hvb3NlX2NhcmRfZGF0YSA9IFtdXHJcbiAgICAgICAgdGhpcy5jYXJkc19ub2RlLm1hcChub2RlID0+IG5vZGUuZW1pdChcInJlc2V0X2NhcmRfZmxhZ1wiKSlcclxuICAgICAgICAvLyDmoLnmja7mj5DnpLrniYzlnovmmL7npLpcclxuICAgICAgICBpZiAodGhpcy5wcm9tcHRMaXN0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLnByb21wdENvdW50ICUgdGhpcy5wcm9tcHRMaXN0Lmxlbmd0aFxyXG4gICAgICAgICAgY29uc3QgcHJvbXB0Q2FyZHMgPSB0aGlzLnByb21wdExpc3RbaW5kZXhdXHJcbiAgICAgICAgICBjb25zdCBjYXJkc05vZGUgPSB0aGlzLmNhcmRzX25vZGVcclxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvbXB0Q2FyZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgY2FyZCA9IHByb21wdENhcmRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNhcmRzTm9kZS5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgIGNvbnN0IGNhcmRKcyA9IGNhcmRzTm9kZVtqXS5nZXRDb21wb25lbnQoXCJjYXJkXCIpO1xyXG4gICAgICAgICAgICAgIGNvbnN0IGNhcmREYXRhID0gY2FyZEpzLmNhcmRfZGF0YVxyXG4gICAgICAgICAgICAgIGlmIChjYXJkRGF0YS52YWwgPT09IGNhcmQudmFsICYmIGNhcmREYXRhLnNoYXBlID09PSBjYXJkLnNoYXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXJkSnMubm9kZS5lbWl0KGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJUKVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnByb21wdENvdW50KytcclxuICAgICAgICBicmVha1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgfVxyXG59KTtcclxuIl19