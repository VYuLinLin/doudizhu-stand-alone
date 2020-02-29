
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
      "default": null
    },
    chupaiAudio: {
      type: cc.AudioClip,
      "default": null
    }
  },
  onLoad: function onLoad() {
    //自己牌列表 
    this.cards_nods = [];
    this.card_width = 0; //当前可以抢地主的accountid
    // this.rob_player_accountid = 0
    //发牌动画是否结束
    // this.fapai_end = false
    //底牌数组

    this.bottom_card = []; //底牌的json对象数据

    this.bottom_card_data = [];
    this.choose_card_data = [];
    this.outcar_zone = [];
    this.push_card_tmp = []; //监听服务器可以出牌消息
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

      console.log(_mygolbal["default"].playerData.userId, _mygolbal["default"].playerData.masterUserId);

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

      this.cards_nods = [];
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
    // var move_node = this.cards_nods[this.cur_index_card]
    // move_node.active = true
    // var newx = move_node.x + (this.card_width * 0.4*this.cur_index_card) - (this.card_width * 0.4)
    // var action = cc.moveTo(0.1, cc.v2(newx, -250));
    // move_node.runAction(action)
    // this.cur_index_card--
    // this.scheduleOnce(this._runactive_pushcard.bind(this),0.3)


    var move_node = this.cards_nods[this.cards_nods.length - this.cur_index_card - 1];
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
  selfPlayAHandNotify: function selfPlayAHandNotify() {
    // 先清理出牌区域
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
    playerNode = gameScene_script.getUserNodeByAccount(userId);
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
    this.cards_nods.sort(function (x, y) {
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
    }); //这里使用固定坐标，因为取this.cards_nods[0].xk可能排序为完成，导致x错误
    //所以做1000毫秒的延时

    var x = this.cards_nods[0].x;
    var timeout = 1000;
    setTimeout(function () {
      //var x = -417.6 
      console.log("sort x:" + x);

      for (var i = 0; i < this.cards_nods.length; i++) {
        var card = this.cards_nods[i];
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


    this.cards_nods = [];

    for (var i = 0; i < 17; i++) {
      var card = cc.instantiate(this.card_prefab);
      card.scale = 0.8; // card.parent = this.node.parent

      card.parent = this.cardsNode;
      card.x = card.width * 0.4 * -0.5 * -16 + card.width * 0.4 * 0; //这里实现为，每发一张牌，放在已经发的牌最后，然后整体移动

      card.y = -250;
      card.active = false;
      card.getComponent("card").showCards(data[i], _mygolbal["default"].playerData.userId); //存储牌的信息,用于后面发牌效果

      this.cards_nods.push(card);
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
    for (var i = 0; i < this.cards_nods.length; i++) {
      var card = this.cards_nods[i];

      if (card.y == -230) {
        card.y = -250;
      }
    }

    this.updateCards();
  },
  //给地主发三张排，并显示在原有牌的后面
  pushThreeCard: function pushThreeCard() {
    //每张牌的其实位置 
    var last_card_x = this.cards_nods[this.cards_nods.length - 1].x;

    for (var i = 0; i < this.bottom_card_data.length; i++) {
      var card = cc.instantiate(this.card_prefab);
      card.scale = 0.8; // card.parent = this.node.parent

      card.parent = this.cardsNode;
      card.x = last_card_x + (i + 1) * this.card_width * 0.4;
      card.y = -230; //先把底盘放在-230，在设置个定时器下移到-250的位置
      //console.log("pushThreeCard x:"+card.x)

      card.getComponent("card").showCards(this.bottom_card_data[i], _mygolbal["default"].playerData.userId);
      card.active = true;
      this.cards_nods.push(card);
    }

    this.sortCard(); //设置一个定时器，在2s后，修改y坐标为-250

    this.scheduleOnce(this.schedulePushThreeCard.bind(this), 2);
  },
  destoryCard: function destoryCard(userId, choose_card) {
    if (!choose_card.length) return;
    /*出牌逻辑
      1. 将选中的牌 从父节点中移除
      2. 从this.cards_nods 数组中，删除 选中的牌 
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
      for (var j = 0; j < this.cards_nods.length; j++) {
        var caardIndex = this.cards_nods[j].getComponent("card").caardIndex;

        if (caardIndex == choose_card[i].index) {
          //this.cards_nods[j].destroy()
          this.cards_nods[j].removeFromParent(true);
          destroy_card.push(this.cards_nods[j]);
          this.cards_nods.splice(j, 1);
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
      common.audio.PlayEffect(this.buyaoAudio);
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
    var zeroPoint = this.cards_nods.length / 2; //var last_card_x = this.cards_nods[this.cards_nods.length-1].x

    for (var i = 0; i < this.cards_nods.length; i++) {
      var cardNode = this.cards_nods[i];
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
        console.log("btn_qiandz"); // myglobal.socket.requestRobState(qian_state.qiang)

        window.$socket.emit('canrob_state_notify', {
          userId: _mygolbal["default"].playerData.userId,
          state: qian_state.qiang
        });
        this.robUI.active = false;
        common.audio.PlayEffect(this.jiaodizhuAudio);
        break;

      case "btn_buqiandz":
        console.log("btn_buqiandz"); // myglobal.socket.requestRobState(qian_state.buqiang)

        window.$socket.emit('canrob_state_notify', {
          userId: _mygolbal["default"].playerData.userId,
          state: qian_state.buqiang
        });
        this.robUI.active = false;
        common.audio.PlayEffect(this.buqiangAudio);
        break;

      case "nopushcard":
        //不出牌
        // myglobal.socket.request_buchu_card([], null)
        window.$socket.emit('nextPlayerNotify', _mygolbal["default"].playerData.userId);
        common.audio.PlayEffect(this.buyaoAudio);
        this.choose_card_data = [];
        this.cards_nods.map(function (node) {
          return node.emit("reset_card_flag");
        });
        this.playingUI_node.active = false;
        break;

      case "pushcard":
        //出牌
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
            _this2.cards_nods.map(function (node) {
              return node.emit("reset_card_flag");
            }); // for (let i = 0; i < this.cards_nods.length; i++) {
            //   this.cards_nods[i].emit("reset_card_flag")
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
        //     for (var i = 0; i < this.cards_nods.length; i++) {
        //       var card = this.cards_nods[i]
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxnYW1lU2NlbmUvLi5cXC4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHNjcmlwdHNcXGdhbWVTY2VuZS9hc3NldHNcXHNjcmlwdHNcXGdhbWVTY2VuZVxcZ2FtZWluZ1VJLmpzIl0sIm5hbWVzIjpbImRkekNvbnN0YW50cyIsInJlcXVpcmUiLCJkZHpEYXRhIiwiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJnYW1laW5nVUkiLCJOb2RlIiwiY2FyZF9wcmVmYWIiLCJQcmVmYWIiLCJyb2JVSSIsInRpbWVMYWJlbCIsIkxhYmVsIiwiY2FyZHNOb2RlIiwiYm90dG9tX2NhcmRfcG9zX25vZGUiLCJwbGF5aW5nVUlfbm9kZSIsInRpcHNMYWJlbCIsImxvc2VOb2RlIiwid2luTm9kZSIsImZhcGFpQXVkaW8iLCJ0eXBlIiwiQXVkaW9DbGlwIiwiamlhb2Rpemh1QXVkaW8iLCJidXFpYW5nQXVkaW8iLCJjYXJkc0F1ZGlvIiwiYnV5YW9BdWRpbyIsImNodXBhaUF1ZGlvIiwib25Mb2FkIiwiY2FyZHNfbm9kcyIsImNhcmRfd2lkdGgiLCJib3R0b21fY2FyZCIsImJvdHRvbV9jYXJkX2RhdGEiLCJjaG9vc2VfY2FyZF9kYXRhIiwib3V0Y2FyX3pvbmUiLCJwdXNoX2NhcmRfdG1wIiwibm9kZSIsIm9uIiwiZGF0YSIsImNvbnNvbGUiLCJsb2ciLCJpIiwibGVuZ3RoIiwiY2FyZCIsInNob3dfZGF0YSIsImNhbGxfZGF0YSIsInJ1biIsImNhbGxGdW5jIiwidGFyZ2V0IiwiYWN0aXZlZGF0YSIsInNob3dfY2FyZCIsIm9iaiIsImdldENvbXBvbmVudCIsInNob3dDYXJkcyIsInJ1bkFjdGlvbiIsInNlcXVlbmNlIiwicm90YXRlQnkiLCJzY2FsZUJ5IiwiY29tbW9uIiwiYXVkaW8iLCJQbGF5RWZmZWN0IiwibXlnbG9iYWwiLCJwbGF5ZXJEYXRhIiwidXNlcklkIiwibWFzdGVyVXNlcklkIiwic2NoZWR1bGVPbmNlIiwicHVzaFRocmVlQ2FyZCIsImJpbmQiLCJzdGFydCIsIkNDX0VESVRPUiIsImdhbWVTdGF0ZU5vdGlmeSIsImFkZExpc3RlbmVyIiwiZ2FtZVN0YXRlSGFuZGxlciIsIndpbmRvdyIsIiRzb2NrZXQiLCJfY2hvb3NlQ2FyZE5vdGlmeSIsIl91bmNob29zZUNhcmROb3RpZnkiLCJwdXNoQ2FyZE5vdGlmeSIsImNhbnJvYk5vdGlmeSIsInNlbGZQbGF5QUhhbmROb3RpZnkiLCJyb290UGxheUFIYW5kTm90aWZ5IiwiZ2FtZUVuZE5vdGlmeSIsIm9uRGVzdHJveSIsInJlbW92ZUxpc3RlbmVyIiwicmVtb3ZlIiwiY2FyZERhdGEiLCJwdXNoIiwiY2FyZElkIiwiaW5kZXgiLCJzcGxpY2UiLCJzdGF0ZSIsImdhbWVTdGF0ZSIsIkdBTUVTVEFSVCIsImFjdGl2ZSIsInJlbW92ZUFsbENoaWxkcmVuIiwiY2FyZF9kYXRhIiwiY3VyX2luZGV4X2NhcmQiLCJwdXNoQ2FyZCIsIl9ydW5hY3RpdmVfcHVzaGNhcmQiLCJwYXJlbnQiLCJlbWl0IiwiaXNvcGVuX3NvdW5kIiwiYXVkaW9FbmdpbmUiLCJzdG9wIiwiZmFwYWlfYXVkaW9JRCIsIm1vdmVfbm9kZSIsIm5ld3giLCJ4IiwiYWN0aW9uIiwibW92ZVRvIiwidjIiLCJjdXN0b21TY2hlZHVsZXJPbmNlIiwiY291bnQiLCJjYWxsYmFjayIsInVuc2NoZWR1bGUiLCJxaWFuX3N0YXRlIiwiYnVxaWFuZyIsInN0cmluZyIsInNjaGVkdWxlIiwiY2xlYXJPdXRab25lIiwiY2FyZHMiLCJnYW1lU2NlbmVfc2NyaXB0Iiwib3V0Q2FyZF9ub2RlIiwiZ2V0VXNlck91dENhcmRQb3NCeUFjY291bnQiLCJub2RlX2NhcmRzIiwiaW5zdGFudGlhdGUiLCJkZWxheSIsInJhbmRvbSIsInBsYXllck5vZGUiLCJnZXRVc2VyTm9kZUJ5QWNjb3VudCIsInNjaGVkdWxlck9uY2UiLCJhcHBlbmRPdGhlckNhcmRzVG9PdXRab25lIiwic3VidHJhY3RDYXJkcyIsImlzV2luIiwib3RoZXJQbGF5ZXJDYXJkcyIsIldBSVRSRUFEWSIsInNvcnRDYXJkIiwic29ydCIsInkiLCJhIiwiYiIsImhhc093blByb3BlcnR5IiwidmFsdWUiLCJraW5nIiwidGltZW91dCIsInNldFRpbWVvdXQiLCJ6SW5kZXgiLCJ3aWR0aCIsInNjYWxlIiwiZGlfY2FyZCIsInNjaGVkdWxlUHVzaFRocmVlQ2FyZCIsInVwZGF0ZUNhcmRzIiwibGFzdF9jYXJkX3giLCJkZXN0b3J5Q2FyZCIsImNob29zZV9jYXJkIiwiZGVzdHJveV9jYXJkIiwiaiIsImNhYXJkSW5kZXgiLCJyZW1vdmVGcm9tUGFyZW50IiwiYXBwZW5kQ2FyZHNUb091dFpvbmUiLCJjaGlsZHJlbiIsImRlc3Ryb3kiLCJwdXNoQ2FyZFNvcnQiLCJ5b2Zmc2V0IiwiYWRkQ2hpbGQiLCJ6UG9pbnQiLCJjYXJkTm9kZSIsImdldENoaWxkcmVuIiwic2V0U2NhbGUiLCJzZXRQb3NpdGlvbiIsInplcm9Qb2ludCIsInBsYXlQdXNoQ2FyZFNvdW5kIiwiY2FyZF9uYW1lIiwiQ2FyZHNWYWx1ZSIsIm9uZSIsIm5hbWUiLCJwbGF5IiwidXJsIiwicmF3Iiwib25CdXR0b25DbGljayIsImV2ZW50IiwiY3VzdG9tRGF0YSIsInFpYW5nIiwibWFwIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0EsSUFBTUEsWUFBWSxHQUFHQyxPQUFPLENBQUMsY0FBRCxDQUE1Qjs7QUFDQSxJQUFNQyxPQUFPLEdBQUdELE9BQU8sQ0FBQyxTQUFELENBQXZCOztBQUVBRSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNQLGFBQVNELEVBQUUsQ0FBQ0UsU0FETDtBQUdQQyxFQUFBQSxVQUFVLEVBQUU7QUFDVkMsSUFBQUEsU0FBUyxFQUFFSixFQUFFLENBQUNLLElBREo7QUFFVkMsSUFBQUEsV0FBVyxFQUFFTixFQUFFLENBQUNPLE1BRk47QUFHVkMsSUFBQUEsS0FBSyxFQUFFUixFQUFFLENBQUNLLElBSEE7QUFH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UyxDQUVKLElBRkksQ0FBRCxFQUVJLElBRkosQ0FBVjtBQUdEOztBQUNETSxRQUFBQSxNQUFNLENBQUNDLE9BQVAsQ0FBZTBCLElBQWYsQ0FBb0IsaUJBQXBCLEVBQXVDO0FBQ3JDckMsVUFBQUEsTUFBTSxFQUFFRixxQkFBU0MsVUFBVCxDQUFvQkMsTUFEUztBQUVyQ3lELFVBQUFBLEtBQUssRUFBRSxLQUFLdkY7QUFGeUIsU0FBdkMsRUFHRyxpQkFBYTtBQUFBLGNBQVh5RCxLQUFXLFNBQVhBLEtBQVc7O0FBQ2QsY0FBSUEsS0FBSyxLQUFLLENBQWQsRUFBaUI7QUFDZixZQUFBLE1BQUksQ0FBQytELFdBQUwsQ0FBaUI1RixxQkFBU0MsVUFBVCxDQUFvQkMsTUFBckMsRUFBNkMsTUFBSSxDQUFDOUIsZ0JBQWxEOztBQUNBLFlBQUEsTUFBSSxDQUFDakIsY0FBTCxDQUFvQjZFLE1BQXBCLEdBQTZCLEtBQTdCO0FBQ0QsV0FIRCxNQUdPO0FBQ0w7QUFDQSxZQUFBLE1BQUksQ0FBQ2hFLFVBQUwsQ0FBZ0IwSixHQUFoQixDQUFvQixVQUFBbkosSUFBSTtBQUFBLHFCQUFJQSxJQUFJLENBQUNnRSxJQUFMLENBQVUsaUJBQVYsQ0FBSjtBQUFBLGFBQXhCLEVBRkssQ0FHTDtBQUNBO0FBQ0E7O0FBQ0Q7O0FBQ0QsVUFBQSxNQUFJLENBQUNuRSxnQkFBTCxHQUF3QixFQUF4QjtBQUNELFNBZkQsRUFSRixDQXdCRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTs7QUFDRixXQUFLLFNBQUw7QUFDRTs7QUFDRjtBQUNFO0FBckZKO0FBdUZEO0FBM29CTSxDQUFUIiwic291cmNlUm9vdCI6Ii4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxnYW1lU2NlbmUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbXlnbG9iYWwgZnJvbSBcIi4uL215Z29sYmFsLmpzXCJcclxuY29uc3QgZGR6Q29uc3RhbnRzID0gcmVxdWlyZSgnZGR6Q29uc3RhbnRzJylcclxuY29uc3QgZGR6RGF0YSA9IHJlcXVpcmUoJ2RkekRhdGEnKVxyXG5cclxuY2MuQ2xhc3Moe1xyXG4gIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgcHJvcGVydGllczoge1xyXG4gICAgZ2FtZWluZ1VJOiBjYy5Ob2RlLFxyXG4gICAgY2FyZF9wcmVmYWI6IGNjLlByZWZhYixcclxuICAgIHJvYlVJOiBjYy5Ob2RlLCAvLyDmiqLlnLDkuLvmjInpkq7oioLngrlcclxuICAgIHRpbWVMYWJlbDogY2MuTGFiZWwsIC8vIOiuoeaXtuWZqOiKgueCuVxyXG4gICAgY2FyZHNOb2RlOiBjYy5Ob2RlLCAvLyDmiZHlhYvoioLngrlcclxuICAgIGJvdHRvbV9jYXJkX3Bvc19ub2RlOiBjYy5Ob2RlLCAvLyDlupXniYzoioLngrlcclxuICAgIHBsYXlpbmdVSV9ub2RlOiBjYy5Ob2RlLCAvLyDlh7rniYzmj5DnpLroioLngrlcclxuICAgIHRpcHNMYWJlbDogY2MuTGFiZWwsIC8v546p5a625Ye654mM5LiN5ZCI5rOV55qEdGlwc1xyXG4gICAgbG9zZU5vZGU6IGNjLk5vZGUsIC8vIOWksei0peeJueaViOiKgueCuVxyXG4gICAgd2luTm9kZTogY2MuTm9kZSwgLy8g6IOc5Yip54m55pWI6IqC54K5XHJcbiAgICBmYXBhaUF1ZGlvOiB7XHJcbiAgICAgIHR5cGU6IGNjLkF1ZGlvQ2xpcCxcclxuICAgICAgZGVmYXVsdDogbnVsbFxyXG4gICAgfSxcclxuICAgIGppYW9kaXpodUF1ZGlvOiB7XHJcbiAgICAgIHR5cGU6IGNjLkF1ZGlvQ2xpcCxcclxuICAgICAgZGVmYXVsdDogbnVsbFxyXG4gICAgfSxcclxuICAgIGJ1cWlhbmdBdWRpbzoge1xyXG4gICAgICB0eXBlOiBjYy5BdWRpb0NsaXAsXHJcbiAgICAgIGRlZmF1bHQ6IG51bGxcclxuICAgIH0sXHJcbiAgICBjYXJkc0F1ZGlvOiB7XHJcbiAgICAgIHR5cGU6IGNjLkF1ZGlvQ2xpcCxcclxuICAgICAgZGVmYXVsdDogbnVsbFxyXG4gICAgfSxcclxuICAgIGJ1eWFvQXVkaW86IHtcclxuICAgICAgdHlwZTogY2MuQXVkaW9DbGlwLFxyXG4gICAgICBkZWZhdWx0OiBudWxsXHJcbiAgICB9LFxyXG4gICAgY2h1cGFpQXVkaW86IHtcclxuICAgICAgdHlwZTogY2MuQXVkaW9DbGlwLFxyXG4gICAgICBkZWZhdWx0OiBudWxsXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgb25Mb2FkKCkge1xyXG4gICAgLy/oh6rlt7HniYzliJfooaggXHJcbiAgICB0aGlzLmNhcmRzX25vZHMgPSBbXVxyXG4gICAgdGhpcy5jYXJkX3dpZHRoID0gMFxyXG4gICAgLy/lvZPliY3lj6/ku6XmiqLlnLDkuLvnmoRhY2NvdW50aWRcclxuICAgIC8vIHRoaXMucm9iX3BsYXllcl9hY2NvdW50aWQgPSAwXHJcbiAgICAvL+WPkeeJjOWKqOeUu+aYr+WQpue7k+adn1xyXG4gICAgLy8gdGhpcy5mYXBhaV9lbmQgPSBmYWxzZVxyXG4gICAgLy/lupXniYzmlbDnu4RcclxuICAgIHRoaXMuYm90dG9tX2NhcmQgPSBbXVxyXG4gICAgLy/lupXniYznmoRqc29u5a+56LGh5pWw5o2uXHJcbiAgICB0aGlzLmJvdHRvbV9jYXJkX2RhdGEgPSBbXVxyXG4gICAgdGhpcy5jaG9vc2VfY2FyZF9kYXRhID0gW11cclxuICAgIHRoaXMub3V0Y2FyX3pvbmUgPSBbXVxyXG5cclxuICAgIHRoaXMucHVzaF9jYXJkX3RtcCA9IFtdXHJcbiAgICAvL+ebkeWQrOacjeWKoeWZqOWPr+S7peWHuueJjOa2iOaBr1xyXG4gICAgLy8gbXlnbG9iYWwuc29ja2V0Lm9uQ2FuQ2h1Q2FyZChmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgLy8gICBjb25zb2xlLmxvZyhcIm9uQ2FuQ2h1Q2FyZFwiICsgSlNPTi5zdHJpbmdpZnkoZGF0YSkpXHJcbiAgICAvLyAgIC8v5Yik5pat5piv5LiN5piv6Ieq5bex6IO95Ye654mMXHJcbiAgICAvLyAgIGlmIChkYXRhID09IG15Z2xvYmFsLnBsYXllckRhdGEudXNlcklkKSB7XHJcbiAgICAvLyAgICAgLy/lhYjmuIXnkIblh7rniYzljLrln59cclxuICAgIC8vICAgICB0aGlzLmNsZWFyT3V0Wm9uZShteWdsb2JhbC5wbGF5ZXJEYXRhLnVzZXJJZClcclxuICAgIC8vICAgICAvL+WFiOaKiuiHquW3seWHuueJjOWIl+ihqOe9ruepulxyXG4gICAgLy8gICAgIC8vdGhpcy5jaG9vc2VfY2FyZF9kYXRhPVtdXHJcbiAgICAvLyAgICAgLy/mmL7npLrlj6/ku6Xlh7rniYznmoRVSVxyXG4gICAgLy8gICAgIHRoaXMucGxheWluZ1VJX25vZGUuYWN0aXZlID0gdHJ1ZVxyXG5cclxuICAgIC8vICAgfVxyXG4gICAgLy8gfS5iaW5kKHRoaXMpKVxyXG5cclxuICAgIC8v55uR5ZCs5pyN5Yqh5Zmo77ya5YW25LuW546p5a625Ye654mM5raI5oGvXHJcbiAgICAvLyBteWdsb2JhbC5zb2NrZXQub25PdGhlclBsYXllckNodUNhcmQoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgIC8vICAgLy97XCJ1c2VySWRcIjpcIjIzNTc1NDBcIixcImNhcmRzXCI6W3tcImluZGV4XCI6NCxcImNhcmRfZGF0YVwiOntcImluZGV4XCI6NCxcInZhbHVlXCI6MSxcInNoYXBlXCI6MX19XX1cclxuICAgIC8vICAgY29uc29sZS5sb2coXCJvbk90aGVyUGxheWVyQ2h1Q2FyZFwiICsgSlNPTi5zdHJpbmdpZnkoZGF0YSkpXHJcblxyXG4gICAgLy8gICB2YXIgdXNlcklkID0gZGF0YS51c2VySWRcclxuICAgIC8vICAgdmFyIGdhbWVTY2VuZV9zY3JpcHQgPSB0aGlzLm5vZGUucGFyZW50LmdldENvbXBvbmVudChcImdhbWVTY2VuZVwiKVxyXG4gICAgLy8gICAvL+iOt+WPluWHuueJjOWMuuWfn+iKgueCuVxyXG4gICAgLy8gICB2YXIgb3V0Q2FyZF9ub2RlID0gZ2FtZVNjZW5lX3NjcmlwdC5nZXRVc2VyT3V0Q2FyZFBvc0J5QWNjb3VudCh1c2VySWQpXHJcbiAgICAvLyAgIGlmIChvdXRDYXJkX25vZGUgPT0gbnVsbCkge1xyXG4gICAgLy8gICAgIHJldHVyblxyXG4gICAgLy8gICB9XHJcblxyXG4gICAgLy8gICB2YXIgbm9kZV9jYXJkcyA9IFtdXHJcbiAgICAvLyAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5jYXJkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgLy8gICAgIHZhciBjYXJkID0gY2MuaW5zdGFudGlhdGUodGhpcy5jYXJkX3ByZWZhYilcclxuICAgIC8vICAgICBjYXJkLmdldENvbXBvbmVudChcImNhcmRcIikuc2hvd0NhcmRzKGRhdGEuY2FyZHNbaV0uY2FyZF9kYXRhLCBteWdsb2JhbC5wbGF5ZXJEYXRhLnVzZXJJZClcclxuICAgIC8vICAgICBub2RlX2NhcmRzLnB1c2goY2FyZClcclxuICAgIC8vICAgfVxyXG4gICAgLy8gICB0aGlzLmFwcGVuZE90aGVyQ2FyZHNUb091dFpvbmUob3V0Q2FyZF9ub2RlLCBub2RlX2NhcmRzLCAwKVxyXG4gICAgLy8gfS5iaW5kKHRoaXMpKVxyXG5cclxuICAgIC8v5YaF6YOo5LqL5Lu2OuaYvuekuuW6leeJjOS6i+S7tixkYXRh5piv5LiJ5byg5bqV54mM5pWw5o2uXHJcbiAgICB0aGlzLm5vZGUub24oXCJzaG93X2JvdHRvbV9jYXJkX2V2ZW50XCIsIGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiLS0tLXNob3dfYm90dG9tX2NhcmRfZXZlbnRcIiwgZGF0YSlcclxuICAgICAgdGhpcy5ib3R0b21fY2FyZF9kYXRhID0gZGF0YVxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgY2FyZCA9IHRoaXMuYm90dG9tX2NhcmRbaV1cclxuICAgICAgICB2YXIgc2hvd19kYXRhID0gZGF0YVtpXVxyXG4gICAgICAgIHZhciBjYWxsX2RhdGEgPSB7XHJcbiAgICAgICAgICBcIm9ialwiOiBjYXJkLFxyXG4gICAgICAgICAgXCJkYXRhXCI6IHNob3dfZGF0YSxcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJ1biA9IGNjLmNhbGxGdW5jKGZ1bmN0aW9uICh0YXJnZXQsIGFjdGl2ZWRhdGEpIHtcclxuICAgICAgICAgIHZhciBzaG93X2NhcmQgPSBhY3RpdmVkYXRhLm9ialxyXG4gICAgICAgICAgdmFyIHNob3dfZGF0YSA9IGFjdGl2ZWRhdGEuZGF0YVxyXG4gICAgICAgICAgc2hvd19jYXJkLmdldENvbXBvbmVudChcImNhcmRcIikuc2hvd0NhcmRzKHNob3dfZGF0YSlcclxuICAgICAgICB9LCB0aGlzLCBjYWxsX2RhdGEpXHJcblxyXG4gICAgICAgIGNhcmQucnVuQWN0aW9uKFxyXG4gICAgICAgICAgY2Muc2VxdWVuY2UoY2Mucm90YXRlQnkoMCwgMCwgMTgwKSxcclxuICAgICAgICAgICAgY2Mucm90YXRlQnkoMC4yLCAwLCAtOTApLFxyXG4gICAgICAgICAgICBydW4sXHJcbiAgICAgICAgICAgIGNjLnJvdGF0ZUJ5KDAuMiwgMCwgLTkwKSxcclxuICAgICAgICAgICAgY2Muc2NhbGVCeSgxLCAxLjIpKVxyXG4gICAgICAgIClcclxuICAgICAgfVxyXG4gICAgICBjb21tb24uYXVkaW8uUGxheUVmZmVjdCh0aGlzLmNhcmRzQXVkaW8pXHJcbiAgICAgIC8vdGhpcy5ub2RlLnBhcmVudC5lbWl0KFwiY2hhbmdlX3Jvb21fc3RhdGVfZXZlbnRcIixkZWZpbmVzLmdhbWVTdGF0ZS5ST09NX1BMQVlJTkcpXHJcbiAgICAgIC8v5aaC5p6c6Ieq5bex5Zyw5Li777yM57uZ5Yqg5LiK5LiJ5byg5bqV54mMXHJcbiAgICAgIGNvbnNvbGUubG9nKG15Z2xvYmFsLnBsYXllckRhdGEudXNlcklkLCBteWdsb2JhbC5wbGF5ZXJEYXRhLm1hc3RlclVzZXJJZClcclxuICAgICAgaWYgKG15Z2xvYmFsLnBsYXllckRhdGEudXNlcklkID09PSBteWdsb2JhbC5wbGF5ZXJEYXRhLm1hc3RlclVzZXJJZCkge1xyXG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKHRoaXMucHVzaFRocmVlQ2FyZC5iaW5kKHRoaXMpLCAwLjIpXHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgfS5iaW5kKHRoaXMpKVxyXG5cclxuICAgIC8v5rOo5YaM55uR5ZCs5LiA5Liq6YCJ5oup54mM5raI5oGvIFxyXG4gICAgLy8gdGhpcy5ub2RlLm9uKFwiY2hvb3NlX2NhcmRfZXZlbnRcIiwgZnVuY3Rpb24gKGNhcmREYXRhKSB7XHJcbiAgICAvLyAgIHRoaXMuY2hvb3NlX2NhcmRfZGF0YS5wdXNoKGNhcmREYXRhKVxyXG4gICAgLy8gfS5iaW5kKHRoaXMpKVxyXG5cclxuICAgIC8vIHRoaXMubm9kZS5vbihcInVuY2hvb3NlX2NhcmRfZXZlbnRcIiwgZnVuY3Rpb24gKGNhcmRJZCkge1xyXG4gICAgLy8gICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hvb3NlX2NhcmRfZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgLy8gICAgIGlmICh0aGlzLmNob29zZV9jYXJkX2RhdGFbaV0uaW5kZXggPT09IGNhcmRJZCkge1xyXG4gICAgLy8gICAgICAgdGhpcy5jaG9vc2VfY2FyZF9kYXRhLnNwbGljZShpLCAxKVxyXG4gICAgLy8gICAgIH1cclxuICAgIC8vICAgfVxyXG4gICAgLy8gfS5iaW5kKHRoaXMpKVxyXG4gIH0sXHJcbiAgc3RhcnQoKSB7XHJcbiAgICAvLyDnm5HlkKzmuLjmiI/nirbmgIFcclxuICAgIGlmICghQ0NfRURJVE9SKSB7XHJcbiAgICAgIGRkekRhdGEuZ2FtZVN0YXRlTm90aWZ5LmFkZExpc3RlbmVyKHRoaXMuZ2FtZVN0YXRlSGFuZGxlciwgdGhpcylcclxuICAgIH1cclxuICAgIHdpbmRvdy4kc29ja2V0Lm9uKCdfY2hvb3NlQ2FyZCcsIHRoaXMuX2Nob29zZUNhcmROb3RpZnksIHRoaXMpIC8vIOmAieeJjFxyXG4gICAgd2luZG93LiRzb2NrZXQub24oJ191bmNob29zZUNhcmQnLCB0aGlzLl91bmNob29zZUNhcmROb3RpZnksIHRoaXMpIC8vIOWPlua2iOmAieeJjFxyXG4gICAgd2luZG93LiRzb2NrZXQub24oJ3B1c2hjYXJkX25vdGlmeScsIHRoaXMucHVzaENhcmROb3RpZnksIHRoaXMpIC8vIOWPkeeJjFxyXG4gICAgd2luZG93LiRzb2NrZXQub24oJ2NhbnJvYl9ub3RpZnknLCB0aGlzLmNhbnJvYk5vdGlmeSwgdGhpcykgLy8g5oqi5Zyw5Li7XHJcbiAgICB3aW5kb3cuJHNvY2tldC5vbignc2VsZlBsYXlBSGFuZE5vdGlmeScsIHRoaXMuc2VsZlBsYXlBSGFuZE5vdGlmeSwgdGhpcykgLy8g5Ye654mMXHJcbiAgICB3aW5kb3cuJHNvY2tldC5vbigncm9vdFBsYXlBSGFuZE5vdGlmeScsIHRoaXMucm9vdFBsYXlBSGFuZE5vdGlmeSwgdGhpcykgLy8g5py65Zmo5Ye654mMXHJcbiAgICB3aW5kb3cuJHNvY2tldC5vbignZ2FtZUVuZE5vdGlmeScsIHRoaXMuZ2FtZUVuZE5vdGlmeSwgdGhpcykgLy8g5ri45oiP57uT5p2fXHJcbiAgfSxcclxuICBvbkRlc3Ryb3koKSB7XHJcbiAgICBpZiAoIUNDX0VESVRPUikge1xyXG4gICAgICBkZHpEYXRhLmdhbWVTdGF0ZU5vdGlmeS5yZW1vdmVMaXN0ZW5lcih0aGlzLmdhbWVTdGF0ZUhhbmRsZXIsIHRoaXMpXHJcbiAgICB9XHJcbiAgICB3aW5kb3cuJHNvY2tldC5yZW1vdmUoJ19jaG9vc2VDYXJkJywgdGhpcylcclxuICAgIHdpbmRvdy4kc29ja2V0LnJlbW92ZSgnX3VuY2hvb3NlQ2FyZCcsIHRoaXMpXHJcbiAgICB3aW5kb3cuJHNvY2tldC5yZW1vdmUoJ3B1c2hjYXJkX25vdGlmeScsIHRoaXMpXHJcbiAgICB3aW5kb3cuJHNvY2tldC5yZW1vdmUoJ2NhbnJvYl9ub3RpZnknLCB0aGlzKVxyXG4gICAgd2luZG93LiRzb2NrZXQucmVtb3ZlKCdzZWxmUGxheUFIYW5kTm90aWZ5JywgdGhpcylcclxuICAgIHdpbmRvdy4kc29ja2V0LnJlbW92ZSgncm9vdFBsYXlBSGFuZE5vdGlmeScsIHRoaXMpXHJcbiAgICB3aW5kb3cuJHNvY2tldC5yZW1vdmUoJ2dhbWVFbmROb3RpZnknLCB0aGlzKVxyXG4gIH0sXHJcbiAgX2Nob29zZUNhcmROb3RpZnkoY2FyZERhdGEpIHtcclxuICAgIHRoaXMuY2hvb3NlX2NhcmRfZGF0YS5wdXNoKGNhcmREYXRhKVxyXG4gIH0sXHJcbiAgX3VuY2hvb3NlQ2FyZE5vdGlmeShjYXJkSWQpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaG9vc2VfY2FyZF9kYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmICh0aGlzLmNob29zZV9jYXJkX2RhdGFbaV0uaW5kZXggPT09IGNhcmRJZCkge1xyXG4gICAgICAgIHRoaXMuY2hvb3NlX2NhcmRfZGF0YS5zcGxpY2UoaSwgMSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgZ2FtZVN0YXRlSGFuZGxlcihzdGF0ZSkge1xyXG4gICAgLy8g5byA5aeL5ri45oiPIC0g5bey5YeG5aSHXHJcbiAgICBpZiAoc3RhdGUgPT09IGRkekNvbnN0YW50cy5nYW1lU3RhdGUuR0FNRVNUQVJUKSB7XHJcbiAgICAgIC8vIOWFs+mXreiDnOWIqeaIluWksei0peaViOaenFxyXG4gICAgICB0aGlzLndpbk5vZGUuYWN0aXZlID0gZmFsc2VcclxuICAgICAgdGhpcy5sb3NlTm9kZS5hY3RpdmUgPSBmYWxzZVxyXG4gICAgICAvLyDmuIXmpZrmoYzpnaLkuIrmiYDmnInnmoTniYxcclxuICAgICAgdGhpcy5jYXJkc19ub2RzID0gW11cclxuICAgICAgdGhpcy5ib3R0b21fY2FyZCA9IFtdXHJcbiAgICAgIHRoaXMucHVzaF9jYXJkX3RtcCA9IFtdXHJcbiAgICAgIHRoaXMuY2FyZHNOb2RlLnJlbW92ZUFsbENoaWxkcmVuKClcclxuICAgICAgdGhpcy5ib3R0b21fY2FyZF9wb3Nfbm9kZS5yZW1vdmVBbGxDaGlsZHJlbigpXHJcbiAgICB9XHJcbiAgfSxcclxuICBwdXNoQ2FyZE5vdGlmeShkYXRhKSB7XHJcbiAgICB0aGlzLmNhcmRfZGF0YSA9IGRhdGFcclxuICAgIHRoaXMuY3VyX2luZGV4X2NhcmQgPSBkYXRhLmxlbmd0aCAtIDFcclxuICAgIHRoaXMucHVzaENhcmQoZGF0YSlcclxuICAgIC8v5bem6L6556e75Yqo5a6a5pe25ZmoXHJcbiAgICB0aGlzLnNjaGVkdWxlT25jZSh0aGlzLl9ydW5hY3RpdmVfcHVzaGNhcmQuYmluZCh0aGlzKSwgMC4zKVxyXG4gICAgdGhpcy5ub2RlLnBhcmVudC5lbWl0KFwicHVzaGNhcmRfb3RoZXJfZXZlbnRcIilcclxuICB9LFxyXG4gIC8v5aSE55CG5Y+R54mM55qE5pWI5p6cXHJcbiAgX3J1bmFjdGl2ZV9wdXNoY2FyZCgpIHtcclxuICAgIGlmICh0aGlzLmN1cl9pbmRleF9jYXJkIDwgMCkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcInB1c2hjYXJkIGVuZFwiKVxyXG4gICAgICAvL+WPkeeJjOWKqOeUu+WujOaIkO+8jOaYvuekuuaKouWcsOS4u+aMiemSrlxyXG4gICAgICAvLyB0aGlzLmZhcGFpX2VuZCA9IHRydWVcclxuICAgICAgLy8gaWYgKHRoaXMucm9iX3BsYXllcl9hY2NvdW50aWQgPT09IG15Z2xvYmFsLnBsYXllckRhdGEudXNlcklkKSB7XHJcbiAgICAgIC8vICAgdGhpcy5yb2JVSS5hY3RpdmUgPSB0cnVlXHJcbiAgICAgIC8vICAgdGhpcy5jdXN0b21TY2hlZHVsZXJPbmNlKClcclxuICAgICAgLy8gfVxyXG4gICAgICBpZiAoaXNvcGVuX3NvdW5kKSB7XHJcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUuc3RvcCh0aGlzLmZhcGFpX2F1ZGlvSUQpXHJcbiAgICAgIH1cclxuICAgICAgLy/pgJrnn6VnYW1lc2NlbmXoioLngrnvvIzlgJLorqHml7ZcclxuICAgICAgLy8gdmFyIHNlbmRldmVudCA9IHRoaXMucm9iX3BsYXllcl9hY2NvdW50aWRcclxuICAgICAgLy8gdGhpcy5ub2RlLnBhcmVudC5lbWl0KFwiY2Fucm9iX2V2ZW50XCIsIHNlbmRldmVudClcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICAvL+WOn+aciemAu+i+kSAgXHJcbiAgICAvLyB2YXIgbW92ZV9ub2RlID0gdGhpcy5jYXJkc19ub2RzW3RoaXMuY3VyX2luZGV4X2NhcmRdXHJcbiAgICAvLyBtb3ZlX25vZGUuYWN0aXZlID0gdHJ1ZVxyXG4gICAgLy8gdmFyIG5ld3ggPSBtb3ZlX25vZGUueCArICh0aGlzLmNhcmRfd2lkdGggKiAwLjQqdGhpcy5jdXJfaW5kZXhfY2FyZCkgLSAodGhpcy5jYXJkX3dpZHRoICogMC40KVxyXG4gICAgLy8gdmFyIGFjdGlvbiA9IGNjLm1vdmVUbygwLjEsIGNjLnYyKG5ld3gsIC0yNTApKTtcclxuICAgIC8vIG1vdmVfbm9kZS5ydW5BY3Rpb24oYWN0aW9uKVxyXG4gICAgLy8gdGhpcy5jdXJfaW5kZXhfY2FyZC0tXHJcbiAgICAvLyB0aGlzLnNjaGVkdWxlT25jZSh0aGlzLl9ydW5hY3RpdmVfcHVzaGNhcmQuYmluZCh0aGlzKSwwLjMpXHJcblxyXG4gICAgdmFyIG1vdmVfbm9kZSA9IHRoaXMuY2FyZHNfbm9kc1t0aGlzLmNhcmRzX25vZHMubGVuZ3RoIC0gdGhpcy5jdXJfaW5kZXhfY2FyZCAtIDFdXHJcbiAgICBtb3ZlX25vZGUuYWN0aXZlID0gdHJ1ZVxyXG4gICAgdGhpcy5wdXNoX2NhcmRfdG1wLnB1c2gobW92ZV9ub2RlKVxyXG4gICAgdGhpcy5mYXBhaV9hdWRpb0lEID0gY29tbW9uLmF1ZGlvLlBsYXlFZmZlY3QodGhpcy5mYXBhaUF1ZGlvKVxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnB1c2hfY2FyZF90bXAubGVuZ3RoIC0gMTsgaSsrKSB7XHJcbiAgICAgIHZhciBtb3ZlX25vZGUgPSB0aGlzLnB1c2hfY2FyZF90bXBbaV1cclxuICAgICAgdmFyIG5ld3ggPSBtb3ZlX25vZGUueCAtICh0aGlzLmNhcmRfd2lkdGggKiAwLjQpXHJcbiAgICAgIHZhciBhY3Rpb24gPSBjYy5tb3ZlVG8oMC4xLCBjYy52MihuZXd4LCAtMjUwKSk7XHJcbiAgICAgIG1vdmVfbm9kZS5ydW5BY3Rpb24oYWN0aW9uKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY3VyX2luZGV4X2NhcmQtLVxyXG4gICAgdGhpcy5zY2hlZHVsZU9uY2UodGhpcy5fcnVuYWN0aXZlX3B1c2hjYXJkLmJpbmQodGhpcyksIDAuMylcclxuICB9LFxyXG4gIC8vIOmAmuefpeaKouWcsOS4u+a2iOaBryzmmL7npLrnm7jlupTnmoRVSVxyXG4gIGNhbnJvYk5vdGlmeShkYXRhKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIm9uQ2FuUm9iU3RhdGVcIiwgZGF0YSlcclxuICAgIC8v6L+Z6YeM6ZyA6KaBMuS4quWPmOmHj+adoeS7tu+8muiHquW3seaYr+S4i+S4gOS4quaKouWcsOS4u++8jDLlj5HniYzliqjnlLvnu5PmnZ9cclxuICAgIC8vIHRoaXMucm9iX3BsYXllcl9hY2NvdW50aWQgPSBkYXRhXHJcbiAgICBpZiAoZGF0YSA9PT0gbXlnbG9iYWwucGxheWVyRGF0YS51c2VySWQpIHtcclxuICAgICAgdGhpcy5yb2JVSS5hY3RpdmUgPSB0cnVlXHJcbiAgICAgIHRoaXMuY3VzdG9tU2NoZWR1bGVyT25jZSgpXHJcbiAgICB9XHJcbiAgfSxcclxuICAvL+W8gOWQr+S4gOS4quWumuaXtuWZqFxyXG4gIGN1c3RvbVNjaGVkdWxlck9uY2UoKSB7XHJcbiAgICB0aGlzLmNvdW50ID0gMTA7XHJcbiAgICBjb25zdCBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKCF0aGlzLnJvYlVJLmFjdGl2ZSkgcmV0dXJuXHJcbiAgICAgIGlmICghdGhpcy5jb3VudCkge1xyXG4gICAgICAgIC8vIOWcqOesrOWFreasoeaJp+ihjOWbnuiwg+aXtuWPlua2iOi/meS4quiuoeaXtuWZqFxyXG4gICAgICAgIHRoaXMucm9iVUkuYWN0aXZlID0gZmFsc2VcclxuICAgICAgICB0aGlzLnVuc2NoZWR1bGUoY2FsbGJhY2spXHJcbiAgICAgICAgd2luZG93LiRzb2NrZXQuZW1pdCgnY2Fucm9iX3N0YXRlX25vdGlmeScsIHtcclxuICAgICAgICAgIHVzZXJJZDogbXlnbG9iYWwucGxheWVyRGF0YS51c2VySWQsXHJcbiAgICAgICAgICBzdGF0ZTogcWlhbl9zdGF0ZS5idXFpYW5nLFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgY29tbW9uLmF1ZGlvLlBsYXlFZmZlY3QodGhpcy5idXFpYW5nQXVkaW8pXHJcbiAgICAgIH1cclxuICAgICAgdGhpcy50aW1lTGFiZWwuc3RyaW5nID0gLS10aGlzLmNvdW50XHJcbiAgICB9XHJcbiAgICB0aGlzLnNjaGVkdWxlKGNhbGxiYWNrLCAxLCAxMClcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEBkZXNjcmlwdGlvbiDlh7rniYxcclxuICAgKi9cclxuICBzZWxmUGxheUFIYW5kTm90aWZ5KCkge1xyXG4gICAgLy8g5YWI5riF55CG5Ye654mM5Yy65Z+fXHJcbiAgICB0aGlzLmNsZWFyT3V0Wm9uZShteWdsb2JhbC5wbGF5ZXJEYXRhLnVzZXJJZClcclxuICAgIC8vIOaYvuekuuWPr+S7peWHuueJjOeahFVJXHJcbiAgICB0aGlzLnBsYXlpbmdVSV9ub2RlLmFjdGl2ZSA9IHRydWVcclxuICB9LFxyXG4gIC8vIOacuuWZqOWHuueJjFxyXG4gIHJvb3RQbGF5QUhhbmROb3RpZnkoeyB1c2VySWQsIGNhcmRzIH0pIHtcclxuICAgIHZhciBnYW1lU2NlbmVfc2NyaXB0ID0gdGhpcy5ub2RlLnBhcmVudC5nZXRDb21wb25lbnQoXCJnYW1lU2NlbmVcIilcclxuICAgIC8v6I635Y+W5Ye654mM5Yy65Z+f6IqC54K5XHJcbiAgICB2YXIgb3V0Q2FyZF9ub2RlID0gZ2FtZVNjZW5lX3NjcmlwdC5nZXRVc2VyT3V0Q2FyZFBvc0J5QWNjb3VudCh1c2VySWQpXHJcbiAgICBpZiAoIW91dENhcmRfbm9kZSkgcmV0dXJuXHJcbiAgICBvdXRDYXJkX25vZGUucmVtb3ZlQWxsQ2hpbGRyZW4odHJ1ZSk7XHJcblxyXG4gICAgdmFyIG5vZGVfY2FyZHMgPSBbXVxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYXJkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgY2FyZCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuY2FyZF9wcmVmYWIpXHJcbiAgICAgIGNhcmQuZ2V0Q29tcG9uZW50KFwiY2FyZFwiKS5zaG93Q2FyZHMoY2FyZHNbaV0sIHVzZXJJZClcclxuICAgICAgbm9kZV9jYXJkcy5wdXNoKGNhcmQpXHJcbiAgICB9XHJcbiAgICBjb25zdCBkZWxheSA9IGNvbW1vbi5yYW5kb20oMCwgMTApXHJcbiAgICBwbGF5ZXJOb2RlID0gZ2FtZVNjZW5lX3NjcmlwdC5nZXRVc2VyTm9kZUJ5QWNjb3VudCh1c2VySWQpXHJcbiAgICBpZiAoIXBsYXllck5vZGUpIHJldHVyblxyXG4gICAgcGxheWVyTm9kZS5zY2hlZHVsZXJPbmNlKCgpID0+IHtcclxuICAgICAgdGhpcy5hcHBlbmRPdGhlckNhcmRzVG9PdXRab25lKG91dENhcmRfbm9kZSwgbm9kZV9jYXJkcywgMClcclxuICAgICAgcGxheWVyTm9kZS5zdWJ0cmFjdENhcmRzKGNhcmRzLmxlbmd0aClcclxuICAgICAgLy8g6YCa55+l5pyN5Yqh77yM5LiL5LiA5a625Ye654mMXHJcbiAgICAgIHdpbmRvdy4kc29ja2V0LmVtaXQoJ25leHRQbGF5ZXJOb3RpZnknLCB1c2VySWQpXHJcbiAgICB9LCBkZWxheSlcclxuICB9LFxyXG4gIC8vIOa4uOaIj+e7k+adn1xyXG4gIGdhbWVFbmROb3RpZnkoeyBpc1dpbiwgb3RoZXJQbGF5ZXJDYXJkcyB9KSB7XHJcbiAgICBjb25zb2xlLmxvZygn5ri45oiP57uT5p2fJywgeyBpc1dpbiwgb3RoZXJQbGF5ZXJDYXJkcyB9KVxyXG4gICAgaWYgKGlzV2luKSB7XHJcbiAgICAgIHRoaXMud2luTm9kZS5hY3RpdmUgPSB0cnVlXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmxvc2VOb2RlLmFjdGl2ZSA9IHRydWVcclxuICAgIH1cclxuICAgIGRkekRhdGEuZ2FtZVN0YXRlID0gZGR6Q29uc3RhbnRzLmdhbWVTdGF0ZS5XQUlUUkVBRFlcclxuICB9LFxyXG4gIC8v5a+554mM5o6S5bqPXHJcbiAgc29ydENhcmQoKSB7XHJcbiAgICB0aGlzLmNhcmRzX25vZHMuc29ydChmdW5jdGlvbiAoeCwgeSkge1xyXG4gICAgICB2YXIgYSA9IHguZ2V0Q29tcG9uZW50KFwiY2FyZFwiKS5jYXJkX2RhdGE7XHJcbiAgICAgIHZhciBiID0geS5nZXRDb21wb25lbnQoXCJjYXJkXCIpLmNhcmRfZGF0YTtcclxuXHJcbiAgICAgIGlmIChhLmhhc093blByb3BlcnR5KCd2YWx1ZScpICYmIGIuaGFzT3duUHJvcGVydHkoJ3ZhbHVlJykpIHtcclxuICAgICAgICByZXR1cm4gYi52YWx1ZSAtIGEudmFsdWU7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGEuaGFzT3duUHJvcGVydHkoJ2tpbmcnKSAmJiAhYi5oYXNPd25Qcm9wZXJ0eSgna2luZycpKSB7XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICghYS5oYXNPd25Qcm9wZXJ0eSgna2luZycpICYmIGIuaGFzT3duUHJvcGVydHkoJ2tpbmcnKSkge1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChhLmhhc093blByb3BlcnR5KCdraW5nJykgJiYgYi5oYXNPd25Qcm9wZXJ0eSgna2luZycpKSB7XHJcbiAgICAgICAgcmV0dXJuIGIua2luZyAtIGEua2luZztcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIC8v6L+Z6YeM5L2/55So5Zu65a6a5Z2Q5qCH77yM5Zug5Li65Y+WdGhpcy5jYXJkc19ub2RzWzBdLnhr5Y+v6IO95o6S5bqP5Li65a6M5oiQ77yM5a+86Ie0eOmUmeivr1xyXG4gICAgLy/miYDku6XlgZoxMDAw5q+r56eS55qE5bu25pe2XHJcbiAgICB2YXIgeCA9IHRoaXMuY2FyZHNfbm9kc1swXS54O1xyXG4gICAgdmFyIHRpbWVvdXQgPSAxMDAwXHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgLy92YXIgeCA9IC00MTcuNiBcclxuICAgICAgY29uc29sZS5sb2coXCJzb3J0IHg6XCIgKyB4KVxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FyZHNfbm9kcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBjYXJkID0gdGhpcy5jYXJkc19ub2RzW2ldO1xyXG4gICAgICAgIGNhcmQuekluZGV4ID0gaTsgLy/orr7nva7niYznmoTlj6DliqDmrKHluo8semluZGV46LaK5aSn5pi+56S65Zyo5LiK6Z2iXHJcbiAgICAgICAgY2FyZC54ID0geCArIGNhcmQud2lkdGggKiAwLjQgKiBpO1xyXG4gICAgICB9XHJcbiAgICB9LmJpbmQodGhpcyksIHRpbWVvdXQpO1xyXG4gIH0sXHJcbiAgcHVzaENhcmQoZGF0YSkge1xyXG4gICAgaWYgKGRhdGEpIHtcclxuICAgICAgZGF0YS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgaWYgKGEuaGFzT3duUHJvcGVydHkoJ3ZhbHVlJykgJiYgYi5oYXNPd25Qcm9wZXJ0eSgndmFsdWUnKSkge1xyXG4gICAgICAgICAgcmV0dXJuIGIudmFsdWUgLSBhLnZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYS5oYXNPd25Qcm9wZXJ0eSgna2luZycpICYmICFiLmhhc093blByb3BlcnR5KCdraW5nJykpIHtcclxuICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFhLmhhc093blByb3BlcnR5KCdraW5nJykgJiYgYi5oYXNPd25Qcm9wZXJ0eSgna2luZycpKSB7XHJcbiAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGEuaGFzT3duUHJvcGVydHkoJ2tpbmcnKSAmJiBiLmhhc093blByb3BlcnR5KCdraW5nJykpIHtcclxuICAgICAgICAgIHJldHVybiBiLmtpbmcgLSBhLmtpbmc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIC8v5Yib5bu6Y2FyZOmihOWItuS9k1xyXG4gICAgdGhpcy5jYXJkc19ub2RzID0gW11cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTc7IGkrKykge1xyXG5cclxuICAgICAgdmFyIGNhcmQgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmNhcmRfcHJlZmFiKVxyXG4gICAgICBjYXJkLnNjYWxlID0gMC44XHJcbiAgICAgIC8vIGNhcmQucGFyZW50ID0gdGhpcy5ub2RlLnBhcmVudFxyXG4gICAgICBjYXJkLnBhcmVudCA9IHRoaXMuY2FyZHNOb2RlXHJcbiAgICAgIGNhcmQueCA9IGNhcmQud2lkdGggKiAwLjQgKiAoLTAuNSkgKiAoLTE2KSArIGNhcmQud2lkdGggKiAwLjQgKiAwO1xyXG4gICAgICAvL+i/memHjOWunueOsOS4uu+8jOavj+WPkeS4gOW8oOeJjO+8jOaUvuWcqOW3sue7j+WPkeeahOeJjOacgOWQju+8jOeEtuWQjuaVtOS9k+enu+WKqFxyXG4gICAgICBjYXJkLnkgPSAtMjUwXHJcbiAgICAgIGNhcmQuYWN0aXZlID0gZmFsc2VcclxuXHJcbiAgICAgIGNhcmQuZ2V0Q29tcG9uZW50KFwiY2FyZFwiKS5zaG93Q2FyZHMoZGF0YVtpXSwgbXlnbG9iYWwucGxheWVyRGF0YS51c2VySWQpXHJcbiAgICAgIC8v5a2Y5YKo54mM55qE5L+h5oGvLOeUqOS6juWQjumdouWPkeeJjOaViOaenFxyXG4gICAgICB0aGlzLmNhcmRzX25vZHMucHVzaChjYXJkKVxyXG4gICAgICB0aGlzLmNhcmRfd2lkdGggPSBjYXJkLndpZHRoXHJcbiAgICB9XHJcbiAgICAvL+WIm+W7ujPlvKDlupXniYxcclxuICAgIHRoaXMuYm90dG9tX2NhcmQgPSBbXVxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcclxuICAgICAgdmFyIGRpX2NhcmQgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmNhcmRfcHJlZmFiKVxyXG4gICAgICBkaV9jYXJkLnNjYWxlID0gMC40XHJcbiAgICAgIC8vIGRpX2NhcmQucG9zaXRpb24gPSB0aGlzLmJvdHRvbV9jYXJkX3Bvc19ub2RlLnBvc2l0aW9uXHJcbiAgICAgIC8v5LiJ5byg54mM77yM5Lit6Ze05Z2Q5qCH5bCx5pivYm90dG9tX2NhcmRfcG9zX25vZGXoioLngrnlnZDmoIfvvIxcclxuICAgICAgLy8wLOWSjDLkuKTlvKDniYzlt6blj7Pnp7vliqh3aW5kdGgqMC40XHJcbiAgICAgIGlmIChpID09IDApIHtcclxuICAgICAgICBkaV9jYXJkLnggPSBkaV9jYXJkLnggLSBkaV9jYXJkLndpZHRoICogMC41XHJcbiAgICAgIH0gZWxzZSBpZiAoaSA9PSAyKSB7XHJcbiAgICAgICAgZGlfY2FyZC54ID0gZGlfY2FyZC54ICsgZGlfY2FyZC53aWR0aCAqIDAuNVxyXG4gICAgICB9XHJcbiAgICAgIC8vZGlfY2FyZC54ID0gZGlfY2FyZC53aWR0aC1pKmRpX2NhcmQud2lkdGgtMjBcclxuICAgICAgLy9kaV9jYXJkLnk9NjBcclxuICAgICAgLy8gZGlfY2FyZC5wYXJlbnQgPSB0aGlzLm5vZGUucGFyZW50XHJcbiAgICAgIGRpX2NhcmQucGFyZW50ID0gdGhpcy5ib3R0b21fY2FyZF9wb3Nfbm9kZVxyXG4gICAgICAvL+WtmOWCqOWcqOWuueWZqOmHjFxyXG4gICAgICB0aGlzLmJvdHRvbV9jYXJkLnB1c2goZGlfY2FyZClcclxuICAgIH1cclxuICB9LFxyXG4gIC8v57uZ546p5a625Y+R6YCB5LiJ5byg5bqV54mM5ZCO77yM6L+HMXMs5oqK54mM6K6+572u5YiweT0tMjUw5L2N572u5pWI5p6cXHJcbiAgc2NoZWR1bGVQdXNoVGhyZWVDYXJkKCkge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNhcmRzX25vZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGNhcmQgPSB0aGlzLmNhcmRzX25vZHNbaV1cclxuICAgICAgaWYgKGNhcmQueSA9PSAtMjMwKSB7XHJcbiAgICAgICAgY2FyZC55ID0gLTI1MFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLnVwZGF0ZUNhcmRzKClcclxuICB9LFxyXG4gIC8v57uZ5Zyw5Li75Y+R5LiJ5byg5o6S77yM5bm25pi+56S65Zyo5Y6f5pyJ54mM55qE5ZCO6Z2iXHJcbiAgcHVzaFRocmVlQ2FyZCgpIHtcclxuICAgIC8v5q+P5byg54mM55qE5YW25a6e5L2N572uIFxyXG4gICAgdmFyIGxhc3RfY2FyZF94ID0gdGhpcy5jYXJkc19ub2RzW3RoaXMuY2FyZHNfbm9kcy5sZW5ndGggLSAxXS54XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYm90dG9tX2NhcmRfZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgY2FyZCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuY2FyZF9wcmVmYWIpXHJcbiAgICAgIGNhcmQuc2NhbGUgPSAwLjhcclxuICAgICAgLy8gY2FyZC5wYXJlbnQgPSB0aGlzLm5vZGUucGFyZW50XHJcbiAgICAgIGNhcmQucGFyZW50ID0gdGhpcy5jYXJkc05vZGVcclxuXHJcbiAgICAgIGNhcmQueCA9IGxhc3RfY2FyZF94ICsgKChpICsgMSkgKiB0aGlzLmNhcmRfd2lkdGggKiAwLjQpXHJcbiAgICAgIGNhcmQueSA9IC0yMzAgIC8v5YWI5oqK5bqV55uY5pS+5ZyoLTIzMO+8jOWcqOiuvue9ruS4quWumuaXtuWZqOS4i+enu+WIsC0yNTDnmoTkvY3nva5cclxuXHJcbiAgICAgIC8vY29uc29sZS5sb2coXCJwdXNoVGhyZWVDYXJkIHg6XCIrY2FyZC54KVxyXG4gICAgICBjYXJkLmdldENvbXBvbmVudChcImNhcmRcIikuc2hvd0NhcmRzKHRoaXMuYm90dG9tX2NhcmRfZGF0YVtpXSwgbXlnbG9iYWwucGxheWVyRGF0YS51c2VySWQpXHJcbiAgICAgIGNhcmQuYWN0aXZlID0gdHJ1ZVxyXG4gICAgICB0aGlzLmNhcmRzX25vZHMucHVzaChjYXJkKVxyXG4gICAgfVxyXG4gICAgdGhpcy5zb3J0Q2FyZCgpXHJcbiAgICAvL+iuvue9ruS4gOS4quWumuaXtuWZqO+8jOWcqDJz5ZCO77yM5L+u5pS5eeWdkOagh+S4ui0yNTBcclxuICAgIHRoaXMuc2NoZWR1bGVPbmNlKHRoaXMuc2NoZWR1bGVQdXNoVGhyZWVDYXJkLmJpbmQodGhpcyksIDIpXHJcbiAgfSxcclxuXHJcbiAgZGVzdG9yeUNhcmQodXNlcklkLCBjaG9vc2VfY2FyZCkge1xyXG4gICAgaWYgKCFjaG9vc2VfY2FyZC5sZW5ndGgpIHJldHVyblxyXG4gICAgLyrlh7rniYzpgLvovpFcclxuICAgICAgMS4g5bCG6YCJ5Lit55qE54mMIOS7jueItuiKgueCueS4reenu+mZpFxyXG4gICAgICAyLiDku450aGlzLmNhcmRzX25vZHMg5pWw57uE5Lit77yM5Yig6ZmkIOmAieS4reeahOeJjCBcclxuICAgICAgMy4g5bCGIOKAnOmAieS4reeahOeJjOKAnSDmt7vliqDliLDlh7rniYzljLrln59cclxuICAgICAgICAgIDMuMSDmuIXnqbrlh7rniYzljLrln59cclxuICAgICAgICAgIDMuMiDmt7vliqDlrZDoioLngrlcclxuICAgICAgICAgIDMuMyDorr7nva5zY2FsZVxyXG4gICAgICAgICAgMy40IOiuvue9rnBvc2l0aW9uXHJcbiAgICAgIDQuICDph43mlrDorr7nva7miYvkuK3nmoTniYznmoTkvY3nva4gIHRoaXMudXBkYXRlQ2FyZHMoKTtcclxuICAgICovXHJcbiAgICAvLzEvMuatpemqpOWIoOmZpOiHquW3seaJi+S4iueahGNhcmToioLngrkgXHJcbiAgICB2YXIgZGVzdHJveV9jYXJkID0gW11cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hvb3NlX2NhcmQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLmNhcmRzX25vZHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICB2YXIgY2FhcmRJbmRleCA9IHRoaXMuY2FyZHNfbm9kc1tqXS5nZXRDb21wb25lbnQoXCJjYXJkXCIpLmNhYXJkSW5kZXhcclxuICAgICAgICBpZiAoY2FhcmRJbmRleCA9PSBjaG9vc2VfY2FyZFtpXS5pbmRleCkge1xyXG4gICAgICAgICAgLy90aGlzLmNhcmRzX25vZHNbal0uZGVzdHJveSgpXHJcbiAgICAgICAgICB0aGlzLmNhcmRzX25vZHNbal0ucmVtb3ZlRnJvbVBhcmVudCh0cnVlKTtcclxuICAgICAgICAgIGRlc3Ryb3lfY2FyZC5wdXNoKHRoaXMuY2FyZHNfbm9kc1tqXSlcclxuICAgICAgICAgIHRoaXMuY2FyZHNfbm9kcy5zcGxpY2UoaiwgMSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMuYXBwZW5kQ2FyZHNUb091dFpvbmUodXNlcklkLCBkZXN0cm95X2NhcmQpXHJcbiAgICB0aGlzLnVwZGF0ZUNhcmRzKClcclxuICB9LFxyXG5cclxuICAvL+a4hemZpOaYvuekuuWHuueJjOiKgueCueWFqOmDqOWtkOiKgueCuSjlsLHmmK/miorlh7rniYznmoTmuIXnqbopXHJcbiAgY2xlYXJPdXRab25lKHVzZXJJZCkge1xyXG4gICAgdmFyIGdhbWVTY2VuZV9zY3JpcHQgPSB0aGlzLm5vZGUucGFyZW50LmdldENvbXBvbmVudChcImdhbWVTY2VuZVwiKVxyXG4gICAgdmFyIG91dENhcmRfbm9kZSA9IGdhbWVTY2VuZV9zY3JpcHQuZ2V0VXNlck91dENhcmRQb3NCeUFjY291bnQodXNlcklkKVxyXG4gICAgdmFyIGNoaWxkcmVuID0gb3V0Q2FyZF9ub2RlLmNoaWxkcmVuO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgY2FyZCA9IGNoaWxkcmVuW2ldO1xyXG4gICAgICBjYXJkLmRlc3Ryb3koKVxyXG4gICAgfVxyXG4gICAgb3V0Q2FyZF9ub2RlLnJlbW92ZUFsbENoaWxkcmVuKHRydWUpO1xyXG4gIH0sXHJcbiAgLy/lr7nlh7rnmoTniYzlgZrmjpLluo9cclxuICBwdXNoQ2FyZFNvcnQoY2FyZHMpIHtcclxuICAgIGlmIChjYXJkcy5sZW5ndGggPT0gMSkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIGNhcmRzLnNvcnQoZnVuY3Rpb24gKHgsIHkpIHtcclxuICAgICAgdmFyIGEgPSB4LmdldENvbXBvbmVudChcImNhcmRcIikuY2FyZF9kYXRhO1xyXG4gICAgICB2YXIgYiA9IHkuZ2V0Q29tcG9uZW50KFwiY2FyZFwiKS5jYXJkX2RhdGE7XHJcblxyXG4gICAgICBpZiAoYS5oYXNPd25Qcm9wZXJ0eSgndmFsdWUnKSAmJiBiLmhhc093blByb3BlcnR5KCd2YWx1ZScpKSB7XHJcbiAgICAgICAgcmV0dXJuIGIudmFsdWUgLSBhLnZhbHVlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChhLmhhc093blByb3BlcnR5KCdraW5nJykgJiYgIWIuaGFzT3duUHJvcGVydHkoJ2tpbmcnKSkge1xyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoIWEuaGFzT3duUHJvcGVydHkoJ2tpbmcnKSAmJiBiLmhhc093blByb3BlcnR5KCdraW5nJykpIHtcclxuICAgICAgICByZXR1cm4gMTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoYS5oYXNPd25Qcm9wZXJ0eSgna2luZycpICYmIGIuaGFzT3duUHJvcGVydHkoJ2tpbmcnKSkge1xyXG4gICAgICAgIHJldHVybiBiLmtpbmcgLSBhLmtpbmc7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfSxcclxuICAvKipcclxuICAgKiBAZGVzY3JpcHRpb24g5qGM6Z2i5re75Yqg5paw54mMXHJcbiAgICogQHBhcmFtIHtjYy5Ob2RlfSBvdXRDYXJkX25vZGUg546p5a625Ye654mM5Yy65Z+f6IqC54K5XHJcbiAgICogQHBhcmFtIHtMaXN0fSBjYXJkcyDniYzlnovoioLngrnpm4blkIhcclxuICAgKiBAcGFyYW0ge051bWJlcn0geW9mZnNldCDnp7vliqjot53nprtcclxuICAgKi9cclxuICBhcHBlbmRPdGhlckNhcmRzVG9PdXRab25lKG91dENhcmRfbm9kZSwgY2FyZHMsIHlvZmZzZXQpIHtcclxuICAgIGlmICghY2FyZHMubGVuZ3RoKSB7XHJcbiAgICAgIGNvbW1vbi5hdWRpby5QbGF5RWZmZWN0KHRoaXMuYnV5YW9BdWRpbylcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICBjb21tb24uYXVkaW8uUGxheUVmZmVjdCh0aGlzLmNodXBhaUF1ZGlvKVxyXG4gICAgLy/mt7vliqDmlrDnmoTlrZDoioLngrlcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FyZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGNhcmQgPSBjYXJkc1tpXTtcclxuICAgICAgb3V0Q2FyZF9ub2RlLmFkZENoaWxkKGNhcmQsIDEwMCArIGkpIC8v56ys5LqM5Liq5Y+C5pWw5pivIHpvcmRlcizkv53or4HniYzkuI3og73ooqvpga7kvY9cclxuICAgIH1cclxuICAgIC8v5a+55Ye654mM6L+b6KGM5o6S5bqPXHJcbiAgICAvL+iuvue9ruWHuueJjOiKgueCueeahOWdkOagh1xyXG4gICAgdmFyIHpQb2ludCA9IGNhcmRzLmxlbmd0aCAvIDI7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcmRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBjYXJkTm9kZSA9IG91dENhcmRfbm9kZS5nZXRDaGlsZHJlbigpW2ldXHJcbiAgICAgIHZhciB4ID0gKGkgLSB6UG9pbnQpICogMzA7XHJcbiAgICAgIHZhciB5ID0gY2FyZE5vZGUueSArIHlvZmZzZXQ7IC8v5Zug5Li65q+P5Liq6IqC54K56ZyA6KaB55qEWeS4jeS4gOagt++8jOWBmuWPguaVsOS8oOWFpVxyXG4gICAgICBjYXJkTm9kZS5zZXRTY2FsZSgwLjUsIDAuNSk7XHJcbiAgICAgIGNhcmROb2RlLnNldFBvc2l0aW9uKHgsIHkpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLy/lsIYg4oCc6YCJ5Lit55qE54mM4oCdIOa3u+WKoOWIsOWHuueJjOWMuuWfn1xyXG4gIC8vZGVzdHJveV9jYXJk5piv546p5a625pys5qyh5Ye655qE54mMXHJcbiAgYXBwZW5kQ2FyZHNUb091dFpvbmUodXNlcklkLCBkZXN0cm95X2NhcmQpIHtcclxuICAgIGlmICghZGVzdHJveV9jYXJkLmxlbmd0aCkgcmV0dXJuXHJcbiAgICAvL+WFiOe7meacrOasoeWHuueahOeJjOWBmuS4gOS4quaOkuW6j1xyXG4gICAgdGhpcy5wdXNoQ2FyZFNvcnQoZGVzdHJveV9jYXJkKVxyXG4gICAgdmFyIGdhbWVTY2VuZV9zY3JpcHQgPSB0aGlzLm5vZGUucGFyZW50LmdldENvbXBvbmVudChcImdhbWVTY2VuZVwiKVxyXG4gICAgLy/ojrflj5blh7rniYzljLrln5/oioLngrlcclxuICAgIHZhciBvdXRDYXJkX25vZGUgPSBnYW1lU2NlbmVfc2NyaXB0LmdldFVzZXJPdXRDYXJkUG9zQnlBY2NvdW50KHVzZXJJZClcclxuICAgIHRoaXMuYXBwZW5kT3RoZXJDYXJkc1RvT3V0Wm9uZShvdXRDYXJkX25vZGUsIGRlc3Ryb3lfY2FyZCwgMzYwKVxyXG4gICAgLy9zY29uc29sZS5sb2coXCJPdXRab25lOlwiK291dENhcmRfbm9kZS5uYW1lKVxyXG4gIH0sXHJcblxyXG4gIC8v6YeN5paw5o6S5bqP5omL5LiK55qE54mMLOW5tuenu+WKqFxyXG4gIHVwZGF0ZUNhcmRzKCkge1xyXG4gICAgdmFyIHplcm9Qb2ludCA9IHRoaXMuY2FyZHNfbm9kcy5sZW5ndGggLyAyO1xyXG4gICAgLy92YXIgbGFzdF9jYXJkX3ggPSB0aGlzLmNhcmRzX25vZHNbdGhpcy5jYXJkc19ub2RzLmxlbmd0aC0xXS54XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2FyZHNfbm9kcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgY2FyZE5vZGUgPSB0aGlzLmNhcmRzX25vZHNbaV1cclxuICAgICAgdmFyIHggPSAoaSAtIHplcm9Qb2ludCkgKiAodGhpcy5jYXJkX3dpZHRoICogMC40KSArIDUwO1xyXG4gICAgICBjYXJkTm9kZS5zZXRQb3NpdGlvbih4LCAtMjUwKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBwbGF5UHVzaENhcmRTb3VuZChjYXJkX25hbWUpIHtcclxuICAgIGNvbnNvbGUubG9nKFwicGxheVB1c2hDYXJkU291bmQ6XCIgKyBjYXJkX25hbWUpXHJcbiAgICBpZiAoY2FyZF9uYW1lID09IFwiXCIpIHJldHVyblxyXG4gICAgc3dpdGNoIChjYXJkX25hbWUpIHtcclxuICAgICAgY2FzZSBDYXJkc1ZhbHVlLm9uZS5uYW1lOlxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgQ2FyZHNWYWx1ZS5kb3VibGUubmFtZTpcclxuICAgICAgICBpZiAoaXNvcGVuX3NvdW5kKSB7XHJcbiAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5KGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvc291bmQvZHVpemkubXAzXCIpKVxyXG4gICAgICAgIH1cclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLy8gdXBkYXRlIChkdCkge30sXHJcbiAgb25CdXR0b25DbGljayhldmVudCwgY3VzdG9tRGF0YSkge1xyXG4gICAgc3dpdGNoIChjdXN0b21EYXRhKSB7XHJcbiAgICAgIGNhc2UgXCJidG5fcWlhbmR6XCI6XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJidG5fcWlhbmR6XCIpXHJcbiAgICAgICAgLy8gbXlnbG9iYWwuc29ja2V0LnJlcXVlc3RSb2JTdGF0ZShxaWFuX3N0YXRlLnFpYW5nKVxyXG4gICAgICAgIHdpbmRvdy4kc29ja2V0LmVtaXQoJ2NhbnJvYl9zdGF0ZV9ub3RpZnknLCB7XHJcbiAgICAgICAgICB1c2VySWQ6IG15Z2xvYmFsLnBsYXllckRhdGEudXNlcklkLFxyXG4gICAgICAgICAgc3RhdGU6IHFpYW5fc3RhdGUucWlhbmcsXHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLnJvYlVJLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgICAgY29tbW9uLmF1ZGlvLlBsYXlFZmZlY3QodGhpcy5qaWFvZGl6aHVBdWRpbylcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIFwiYnRuX2J1cWlhbmR6XCI6XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJidG5fYnVxaWFuZHpcIilcclxuICAgICAgICAvLyBteWdsb2JhbC5zb2NrZXQucmVxdWVzdFJvYlN0YXRlKHFpYW5fc3RhdGUuYnVxaWFuZylcclxuICAgICAgICB3aW5kb3cuJHNvY2tldC5lbWl0KCdjYW5yb2Jfc3RhdGVfbm90aWZ5Jywge1xyXG4gICAgICAgICAgdXNlcklkOiBteWdsb2JhbC5wbGF5ZXJEYXRhLnVzZXJJZCxcclxuICAgICAgICAgIHN0YXRlOiBxaWFuX3N0YXRlLmJ1cWlhbmcsXHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLnJvYlVJLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgICAgY29tbW9uLmF1ZGlvLlBsYXlFZmZlY3QodGhpcy5idXFpYW5nQXVkaW8pXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSBcIm5vcHVzaGNhcmRcIjogIC8v5LiN5Ye654mMXHJcbiAgICAgICAgLy8gbXlnbG9iYWwuc29ja2V0LnJlcXVlc3RfYnVjaHVfY2FyZChbXSwgbnVsbClcclxuICAgICAgICB3aW5kb3cuJHNvY2tldC5lbWl0KCduZXh0UGxheWVyTm90aWZ5JywgbXlnbG9iYWwucGxheWVyRGF0YS51c2VySWQpXHJcbiAgICAgICAgY29tbW9uLmF1ZGlvLlBsYXlFZmZlY3QodGhpcy5idXlhb0F1ZGlvKVxyXG4gICAgICAgIHRoaXMuY2hvb3NlX2NhcmRfZGF0YSA9IFtdXHJcbiAgICAgICAgdGhpcy5jYXJkc19ub2RzLm1hcChub2RlID0+IG5vZGUuZW1pdChcInJlc2V0X2NhcmRfZmxhZ1wiKSlcclxuICAgICAgICB0aGlzLnBsYXlpbmdVSV9ub2RlLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSBcInB1c2hjYXJkXCI6ICAgLy/lh7rniYxcclxuICAgICAgICAvL+WFiOiOt+WPluacrOasoeWHuueJjOaVsOaNrlxyXG4gICAgICAgIGlmICh0aGlzLmNob29zZV9jYXJkX2RhdGEubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgIHRoaXMudGlwc0xhYmVsLnN0cmluZyA9IFwi6K+36YCJ5oup54mMIVwiXHJcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy50aXBzTGFiZWwuc3RyaW5nID0gXCJcIlxyXG4gICAgICAgICAgfS5iaW5kKHRoaXMpLCAyMDAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2luZG93LiRzb2NrZXQuZW1pdCgncGxheUFIYW5kTm90aWZ5Jywge1xyXG4gICAgICAgICAgdXNlcklkOiBteWdsb2JhbC5wbGF5ZXJEYXRhLnVzZXJJZCxcclxuICAgICAgICAgIGNhcmRzOiB0aGlzLmNob29zZV9jYXJkX2RhdGEsXHJcbiAgICAgICAgfSwgKHtzdGF0ZX0pID0+IHtcclxuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gMSkge1xyXG4gICAgICAgICAgICB0aGlzLmRlc3RvcnlDYXJkKG15Z2xvYmFsLnBsYXllckRhdGEudXNlcklkLCB0aGlzLmNob29zZV9jYXJkX2RhdGEpXHJcbiAgICAgICAgICAgIHRoaXMucGxheWluZ1VJX25vZGUuYWN0aXZlID0gZmFsc2VcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8v5Ye654mM5aSx6LSl77yM5oqK6YCJ5oup55qE54mM5b2S5L2NXHJcbiAgICAgICAgICAgIHRoaXMuY2FyZHNfbm9kcy5tYXAobm9kZSA9PiBub2RlLmVtaXQoXCJyZXNldF9jYXJkX2ZsYWdcIikpXHJcbiAgICAgICAgICAgIC8vIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYXJkc19ub2RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIC8vICAgdGhpcy5jYXJkc19ub2RzW2ldLmVtaXQoXCJyZXNldF9jYXJkX2ZsYWdcIilcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5jaG9vc2VfY2FyZF9kYXRhID0gW11cclxuICAgICAgICB9KVxyXG4gICAgICAgIC8vIG15Z2xvYmFsLnNvY2tldC5yZXF1ZXN0X2NodV9jYXJkKHRoaXMuY2hvb3NlX2NhcmRfZGF0YSwgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xyXG4gICAgICAgIC8vICAgaWYgKGVycikge1xyXG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcInJlcXVlc3RfY2h1X2NhcmQ6XCIgKyBlcnIpXHJcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwicmVxdWVzdF9jaHVfY2FyZFwiICsgSlNPTi5zdHJpbmdpZnkoZGF0YSkpXHJcbiAgICAgICAgLy8gICAgIGlmICh0aGlzLnRpcHNMYWJlbC5zdHJpbmcgPT0gXCJcIikge1xyXG4gICAgICAgIC8vICAgICAgIHRoaXMudGlwc0xhYmVsLnN0cmluZyA9IGRhdGEubXNnXHJcbiAgICAgICAgLy8gICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8gICAgICAgICB0aGlzLnRpcHNMYWJlbC5zdHJpbmcgPSBcIlwiXHJcbiAgICAgICAgLy8gICAgICAgfS5iaW5kKHRoaXMpLCAyMDAwKTtcclxuICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgIC8vICAgICAvL+WHuueJjOWksei0pe+8jOaKiumAieaLqeeahOeJjOW9kuS9jVxyXG4gICAgICAgIC8vICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2FyZHNfbm9kcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIC8vICAgICAgIHZhciBjYXJkID0gdGhpcy5jYXJkc19ub2RzW2ldXHJcbiAgICAgICAgLy8gICAgICAgY2FyZC5lbWl0KFwicmVzZXRfY2FyZF9mbGFnXCIpXHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyAgICAgdGhpcy5jaG9vc2VfY2FyZF9kYXRhID0gW11cclxuICAgICAgICAvLyAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gICAgIC8v5Ye654mM5oiQ5YqfXHJcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwicmVzcF9jaHVfY2FyZCBkYXRhOlwiICsgSlNPTi5zdHJpbmdpZnkoZGF0YSkpXHJcbiAgICAgICAgLy8gICAgIHRoaXMucGxheWluZ1VJX25vZGUuYWN0aXZlID0gZmFsc2VcclxuICAgICAgICAvLyAgICAgLy/mkq3mlL7lh7rniYznmoTlo7Dpn7NcclxuICAgICAgICAvLyAgICAgLy9yZXNwX2NodV9jYXJkIGRhdGE6e1wiYWNjb3VudFwiOlwiMjUxOTkwMVwiLFwibXNnXCI6XCJzdWNlc3NcIixcImNhcmR2YWx1ZVwiOntcIm5hbWVcIjpcIkRvdWJsZVwiLFwidmFsdWVcIjoxfX1cclxuICAgICAgICAvLyAgICAgLy97XCJ0eXBlXCI6XCJvdGhlcl9jaHVjYXJkX25vdGlmeVwiLFwicmVzdWx0XCI6MCxcImRhdGFcIjp7XCJ1c2VySWRcIjpcIjI1MTk5MDFcIixcImNhcmRzXCI6W3tcImluZGV4XCI6MjQsXCJjYXJkX2RhdGFcIjp7XCJpbmRleFwiOjI0LFwidmFsdWVcIjo2LFwic2hhcGVcIjoxfX0se1wiaW5kZXhcIjoyNixcImNhcmRfZGF0YVwiOntcImluZGV4XCI6MjYsXCJ2YWx1ZVwiOjYsXCJzaGFwZVwiOjN9fV19LFwiY2FsbEJhY2tJbmRleFwiOjB9XHJcbiAgICAgICAgLy8gICAgIHRoaXMucGxheVB1c2hDYXJkU291bmQoZGF0YS5jYXJkdmFsdWUubmFtZSlcclxuICAgICAgICAvLyAgICAgdGhpcy5kZXN0b3J5Q2FyZChkYXRhLmFjY291bnQsIHRoaXMuY2hvb3NlX2NhcmRfZGF0YSlcclxuICAgICAgICAvLyAgICAgdGhpcy5jaG9vc2VfY2FyZF9kYXRhID0gW11cclxuICAgICAgICAvLyAgIH1cclxuICAgICAgICAvLyB9LmJpbmQodGhpcykpXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSBcInRpcGNhcmRcIjpcclxuICAgICAgICBicmVha1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgfVxyXG59KTtcclxuIl19