
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

cc.Class({
  "extends": cc.Component,
  properties: {
    gameingUI: cc.Node,
    card_prefab: cc.Prefab,
    robUI: cc.Node,
    bottom_card_pos_node: cc.Node,
    // 底牌节点
    playingUI_node: cc.Node,
    tipsLabel: cc.Label,
    //玩家出牌不合法的tips
    fapai: {
      type: cc.AudioClip,
      "default": null
    }
  },
  onLoad: function onLoad() {
    //自己牌列表 
    this.cards_nods = [];
    this.card_width = 0; //当前可以抢地主的accountid

    this.rob_player_accountid = 0; //发牌动画是否结束

    this.fapai_end = false; //底牌数组

    this.bottom_card = []; //底牌的json对象数据

    this.bottom_card_data = [];
    this.choose_card_data = [];
    this.outcar_zone = [];
    this.push_card_tmp = []; //监听服务器:通知抢地主消息,显示相应的UI

    _mygolbal["default"].socket.onCanRobState(function (data) {
      console.log("onCanRobState" + JSON.stringify(data)); //这里需要2个变量条件：自己是下一个抢地主，2发牌动画结束

      this.rob_player_accountid = data;

      if (data == _mygolbal["default"].playerData.userId && this.fapai_end == true) {
        this.robUI.active = true;
      }
    }.bind(this)); //监听服务器可以出牌消息


    _mygolbal["default"].socket.onCanChuCard(function (data) {
      console.log("onCanChuCard" + JSON.stringify(data)); //判断是不是自己能出牌

      if (data == _mygolbal["default"].playerData.userId) {
        //先清理出牌区域
        this.clearOutZone(_mygolbal["default"].playerData.userId); //先把自己出牌列表置空
        //this.choose_card_data=[]
        //显示可以出牌的UI

        this.playingUI_node.active = true;
      }
    }.bind(this)); //监听服务器：其他玩家出牌消息


    _mygolbal["default"].socket.onOtherPlayerChuCard(function (data) {
      //{"accountid":"2357540","cards":[{"cardid":4,"card_data":{"index":4,"value":1,"shape":1}}]}
      console.log("onOtherPlayerChuCard" + JSON.stringify(data));
      var accountid = data.accountid;
      var gameScene_script = this.node.parent.getComponent("gameScene"); //获取出牌区域节点

      var outCard_node = gameScene_script.getUserOutCardPosByAccount(accountid);

      if (outCard_node == null) {
        return;
      }

      var node_cards = [];

      for (var i = 0; i < data.cards.length; i++) {
        var card = cc.instantiate(this.card_prefab);
        card.getComponent("card").showCards(data.cards[i].card_data, _mygolbal["default"].playerData.userId);
        node_cards.push(card);
      }

      this.appendOtherCardsToOutZone(outCard_node, node_cards, 0);
    }.bind(this)); //内部事件:显示底牌事件,data是三张底牌数据


    this.node.on("show_bottom_card_event", function (data) {
      console.log("----show_bottom_card_event", +data);
      this.bottom_card_data = data;

      for (var i = 0; i < data.length; i++) {
        var card = this.bottom_card[i];
        var show_data = data[i];
        var call_data = {
          "obj": card,
          "data": show_data
        };
        console.log("bottom show_data:" + JSON.stringify(show_data));
        var run = cc.callFunc(function (target, activedata) {
          var show_card = activedata.obj;
          var show_data = activedata.data; //console.log("cc.callFunc:"+JSON.stringify(show_data))

          show_card.getComponent("card").showCards(show_data);
        }, this, call_data);
        card.runAction(cc.sequence(cc.rotateBy(0, 0, 180), cc.rotateBy(0.2, 0, -90), run, cc.rotateBy(0.2, 0, -90), cc.scaleBy(1, 1.2)));

        if (isopen_sound) {
          cc.audioEngine.play(cc.url.raw("resources/sound/start.mp3"));
        }
      } //this.node.parent.emit("change_room_state_event",defines.gameState.ROOM_PLAYING)
      //如果自己地主，给加上三张底牌


      if (_mygolbal["default"].playerData.userId == _mygolbal["default"].playerData.master_accountid) {
        this.scheduleOnce(this.pushThreeCard.bind(this), 0.2);
      }
    }.bind(this)); //注册监听一个选择牌消息 

    this.node.on("choose_card_event", function (event) {
      console.log("choose_card_event:" + JSON.stringify(event));
      var detail = event;
      this.choose_card_data.push(detail);
    }.bind(this));
    this.node.on("unchoose_card_event", function (event) {
      console.log("unchoose_card_event:" + event);
      var detail = event;

      for (var i = 0; i < this.choose_card_data.length; i++) {
        if (this.choose_card_data[i].cardid == detail) {
          this.choose_card_data.splice(i, 1);
        }
      }
    }.bind(this));
  },
  start: function start() {
    //监听服务器:下发牌消息
    window.$socket.on('pushcard_notify', this.pushCardNotify, this);
  },
  onDestroy: function onDestroy() {
    window.$socket.remove('pushcard_notify', this);
  },
  pushCardNotify: function pushCardNotify(data) {
    console.log("onPushCards" + JSON.stringify(data));
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
      //this.robUI.active = true

      this.fapai_end = true;

      if (this.rob_player_accountid == _mygolbal["default"].playerData.userId) {
        this.robUI.active = true;
      }

      if (isopen_sound) {
        //console.log("start fapai_audioID"+this.fapai_audioID) 
        cc.audioEngine.stop(this.fapai_audioID);
      } //通知gamescene节点，倒计时


      var sendevent = this.rob_player_accountid;
      this.node.parent.emit("canrob_event", sendevent);
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
    this.fapai_audioID = common.audio.PlayEffect(this.fapai);

    for (var i = 0; i < this.push_card_tmp.length - 1; i++) {
      var move_node = this.push_card_tmp[i];
      var newx = move_node.x - this.card_width * 0.4;
      var action = cc.moveTo(0.1, cc.v2(newx, -250));
      move_node.runAction(action);
    }

    this.cur_index_card--;
    this.scheduleOnce(this._runactive_pushcard.bind(this), 0.3);
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
    }); //var x = this.cards_nods[0].x;
    //这里使用固定坐标，因为取this.cards_nods[0].xk可能排序为完成，导致x错误
    //所以做1000毫秒的延时

    var timeout = 1000;
    setTimeout(function () {
      //var x = -417.6 
      var x = this.cards_nods[0].x;
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
      card.scale = 0.8;
      card.parent = this.node.parent;
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
      di_card.scale = 0.4;
      di_card.position = this.bottom_card_pos_node.position; //三张牌，中间坐标就是bottom_card_pos_node节点坐标，
      //0,和2两张牌左右移动windth*0.4

      if (i == 0) {
        di_card.x = di_card.x - di_card.width * 0.5;
      } else if (i == 2) {
        di_card.x = di_card.x + di_card.width * 0.5;
      } //di_card.x = di_card.width-i*di_card.width-20
      //di_card.y=60


      di_card.parent = this.node.parent; //存储在容器里

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
  },
  //给地主发三张排，并显示在原有牌的后面
  pushThreeCard: function pushThreeCard() {
    //每张牌的其实位置 
    var last_card_x = this.cards_nods[this.cards_nods.length - 1].x;

    for (var i = 0; i < this.bottom_card_data.length; i++) {
      var card = cc.instantiate(this.card_prefab);
      card.scale = 0.8;
      card.parent = this.node.parent;
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
  destoryCard: function destoryCard(accountid, choose_card) {
    if (choose_card.length == 0) {
      return;
    }
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
        var card_id = this.cards_nods[j].getComponent("card").card_id;

        if (card_id == choose_card[i].cardid) {
          console.log("destroy card id:" + card_id); //this.cards_nods[j].destroy()

          this.cards_nods[j].removeFromParent(true);
          destroy_card.push(this.cards_nods[j]);
          this.cards_nods.splice(j, 1);
        }
      }
    }

    this.appendCardsToOutZone(accountid, destroy_card);
    this.updateCards();
  },
  //清除显示出牌节点全部子节点(就是把出牌的清空)
  clearOutZone: function clearOutZone(accountid) {
    var gameScene_script = this.node.parent.getComponent("gameScene");
    var outCard_node = gameScene_script.getUserOutCardPosByAccount(accountid);
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
  appendOtherCardsToOutZone: function appendOtherCardsToOutZone(outCard_node, cards, yoffset) {
    outCard_node.removeAllChildren(true); //console.log("appendOtherCardsToOutZone length"+cards.length)
    //添加新的子节点

    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      outCard_node.addChild(card, 100 + i); //第二个参数是zorder,保证牌不能被遮住
    } //对出牌进行排序
    //设置出牌节点的坐标


    var zPoint = cards.length / 2; //console.log("appendOtherCardsToOutZone zeroPoint:"+zPoint)

    for (var i = 0; i < cards.length; i++) {
      var cardNode = outCard_node.getChildren()[i];
      var x = (i - zPoint) * 30;
      var y = cardNode.y + yoffset; //因为每个节点需要的Y不一样，做参数传入
      //console.log("-----cardNode: x:"+x+" y:"+y)

      cardNode.setScale(0.5, 0.5);
      cardNode.setPosition(x, y);
    }
  },
  //将 “选中的牌” 添加到出牌区域
  //destroy_card是玩家本次出的牌
  appendCardsToOutZone: function appendCardsToOutZone(accountid, destroy_card) {
    if (destroy_card.length == 0) {
      return;
    } //先给本次出的牌做一个排序


    this.pushCardSort(destroy_card); //console.log("appendCardsToOutZone")

    var gameScene_script = this.node.parent.getComponent("gameScene"); //获取出牌区域节点

    var outCard_node = gameScene_script.getUserOutCardPosByAccount(accountid);
    this.appendOtherCardsToOutZone(outCard_node, destroy_card, 360); //sconsole.log("OutZone:"+outCard_node.name)
  },
  //重新排序手上的牌,并移动
  updateCards: function updateCards() {
    var zeroPoint = this.cards_nods.length / 2; //var last_card_x = this.cards_nods[this.cards_nods.length-1].x

    for (var i = 0; i < this.cards_nods.length; i++) {
      var cardNode = this.cards_nods[i];
      var x = (i - zeroPoint) * (this.card_width * 0.4);
      cardNode.setPosition(x, -250);
    }
  },
  playPushCardSound: function playPushCardSound(card_name) {
    console.log("playPushCardSound:" + card_name);

    if (card_name == "") {
      return;
    }

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
    switch (customData) {
      case "btn_qiandz":
        console.log("btn_qiandz");

        _mygolbal["default"].socket.requestRobState(qian_state.qian);

        this.robUI.active = false;

        if (isopen_sound) {
          cc.audioEngine.play(cc.url.raw("resources/sound/woman_jiao_di_zhu.ogg"));
        }

        break;

      case "btn_buqiandz":
        console.log("btn_buqiandz");

        _mygolbal["default"].socket.requestRobState(qian_state.buqiang);

        this.robUI.active = false;

        if (isopen_sound) {
          cc.audioEngine.play(cc.url.raw("resources/sound/woman_bu_jiao.ogg"));
        }

        break;

      case "nopushcard":
        //不出牌
        _mygolbal["default"].socket.request_buchu_card([], null);

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

        _mygolbal["default"].socket.request_chu_card(this.choose_card_data, function (err, data) {
          if (err) {
            console.log("request_chu_card:" + err);
            console.log("request_chu_card" + JSON.stringify(data));

            if (this.tipsLabel.string == "") {
              this.tipsLabel.string = data.msg;
              setTimeout(function () {
                this.tipsLabel.string = "";
              }.bind(this), 2000);
            } //出牌失败，把选择的牌归位


            for (var i = 0; i < this.cards_nods.length; i++) {
              var card = this.cards_nods[i];
              card.emit("reset_card_flag");
            }

            this.choose_card_data = [];
          } else {
            //出牌成功
            console.log("resp_chu_card data:" + JSON.stringify(data));
            this.playingUI_node.active = false; //播放出牌的声音
            //resp_chu_card data:{"account":"2519901","msg":"sucess","cardvalue":{"name":"Double","value":1}}
            //{"type":"other_chucard_notify","result":0,"data":{"accountid":"2519901","cards":[{"cardid":24,"card_data":{"index":24,"value":6,"shape":1}},{"cardid":26,"card_data":{"index":26,"value":6,"shape":3}}]},"callBackIndex":0}

            this.playPushCardSound(data.cardvalue.name);
            this.destoryCard(data.account, this.choose_card_data);
            this.choose_card_data = [];
          }
        }.bind(this)); //this.playingUI_node.active = false


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxnYW1lU2NlbmUvLi5cXC4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHNjcmlwdHNcXGdhbWVTY2VuZS9hc3NldHNcXHNjcmlwdHNcXGdhbWVTY2VuZVxcZ2FtZWluZ1VJLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiZ2FtZWluZ1VJIiwiTm9kZSIsImNhcmRfcHJlZmFiIiwiUHJlZmFiIiwicm9iVUkiLCJib3R0b21fY2FyZF9wb3Nfbm9kZSIsInBsYXlpbmdVSV9ub2RlIiwidGlwc0xhYmVsIiwiTGFiZWwiLCJmYXBhaSIsInR5cGUiLCJBdWRpb0NsaXAiLCJvbkxvYWQiLCJjYXJkc19ub2RzIiwiY2FyZF93aWR0aCIsInJvYl9wbGF5ZXJfYWNjb3VudGlkIiwiZmFwYWlfZW5kIiwiYm90dG9tX2NhcmQiLCJib3R0b21fY2FyZF9kYXRhIiwiY2hvb3NlX2NhcmRfZGF0YSIsIm91dGNhcl96b25lIiwicHVzaF9jYXJkX3RtcCIsIm15Z2xvYmFsIiwic29ja2V0Iiwib25DYW5Sb2JTdGF0ZSIsImRhdGEiLCJjb25zb2xlIiwibG9nIiwiSlNPTiIsInN0cmluZ2lmeSIsInBsYXllckRhdGEiLCJ1c2VySWQiLCJhY3RpdmUiLCJiaW5kIiwib25DYW5DaHVDYXJkIiwiY2xlYXJPdXRab25lIiwib25PdGhlclBsYXllckNodUNhcmQiLCJhY2NvdW50aWQiLCJnYW1lU2NlbmVfc2NyaXB0Iiwibm9kZSIsInBhcmVudCIsImdldENvbXBvbmVudCIsIm91dENhcmRfbm9kZSIsImdldFVzZXJPdXRDYXJkUG9zQnlBY2NvdW50Iiwibm9kZV9jYXJkcyIsImkiLCJjYXJkcyIsImxlbmd0aCIsImNhcmQiLCJpbnN0YW50aWF0ZSIsInNob3dDYXJkcyIsImNhcmRfZGF0YSIsInB1c2giLCJhcHBlbmRPdGhlckNhcmRzVG9PdXRab25lIiwib24iLCJzaG93X2RhdGEiLCJjYWxsX2RhdGEiLCJydW4iLCJjYWxsRnVuYyIsInRhcmdldCIsImFjdGl2ZWRhdGEiLCJzaG93X2NhcmQiLCJvYmoiLCJydW5BY3Rpb24iLCJzZXF1ZW5jZSIsInJvdGF0ZUJ5Iiwic2NhbGVCeSIsImlzb3Blbl9zb3VuZCIsImF1ZGlvRW5naW5lIiwicGxheSIsInVybCIsInJhdyIsIm1hc3Rlcl9hY2NvdW50aWQiLCJzY2hlZHVsZU9uY2UiLCJwdXNoVGhyZWVDYXJkIiwiZXZlbnQiLCJkZXRhaWwiLCJjYXJkaWQiLCJzcGxpY2UiLCJzdGFydCIsIndpbmRvdyIsIiRzb2NrZXQiLCJwdXNoQ2FyZE5vdGlmeSIsIm9uRGVzdHJveSIsInJlbW92ZSIsImN1cl9pbmRleF9jYXJkIiwicHVzaENhcmQiLCJfcnVuYWN0aXZlX3B1c2hjYXJkIiwiZW1pdCIsInN0b3AiLCJmYXBhaV9hdWRpb0lEIiwic2VuZGV2ZW50IiwibW92ZV9ub2RlIiwiY29tbW9uIiwiYXVkaW8iLCJQbGF5RWZmZWN0IiwibmV3eCIsIngiLCJhY3Rpb24iLCJtb3ZlVG8iLCJ2MiIsInNvcnRDYXJkIiwic29ydCIsInkiLCJhIiwiYiIsImhhc093blByb3BlcnR5IiwidmFsdWUiLCJraW5nIiwidGltZW91dCIsInNldFRpbWVvdXQiLCJ6SW5kZXgiLCJ3aWR0aCIsInNjYWxlIiwiZGlfY2FyZCIsInBvc2l0aW9uIiwic2NoZWR1bGVQdXNoVGhyZWVDYXJkIiwibGFzdF9jYXJkX3giLCJkZXN0b3J5Q2FyZCIsImNob29zZV9jYXJkIiwiZGVzdHJveV9jYXJkIiwiaiIsImNhcmRfaWQiLCJyZW1vdmVGcm9tUGFyZW50IiwiYXBwZW5kQ2FyZHNUb091dFpvbmUiLCJ1cGRhdGVDYXJkcyIsImNoaWxkcmVuIiwiZGVzdHJveSIsInJlbW92ZUFsbENoaWxkcmVuIiwicHVzaENhcmRTb3J0IiwieW9mZnNldCIsImFkZENoaWxkIiwielBvaW50IiwiY2FyZE5vZGUiLCJnZXRDaGlsZHJlbiIsInNldFNjYWxlIiwic2V0UG9zaXRpb24iLCJ6ZXJvUG9pbnQiLCJwbGF5UHVzaENhcmRTb3VuZCIsImNhcmRfbmFtZSIsIkNhcmRzVmFsdWUiLCJvbmUiLCJuYW1lIiwib25CdXR0b25DbGljayIsImN1c3RvbURhdGEiLCJyZXF1ZXN0Um9iU3RhdGUiLCJxaWFuX3N0YXRlIiwicWlhbiIsImJ1cWlhbmciLCJyZXF1ZXN0X2J1Y2h1X2NhcmQiLCJzdHJpbmciLCJyZXF1ZXN0X2NodV9jYXJkIiwiZXJyIiwibXNnIiwiY2FyZHZhbHVlIiwiYWNjb3VudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUVBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNQLGFBQVNELEVBQUUsQ0FBQ0UsU0FETDtBQUdQQyxFQUFBQSxVQUFVLEVBQUU7QUFDVkMsSUFBQUEsU0FBUyxFQUFFSixFQUFFLENBQUNLLElBREo7QUFFVkMsSUFBQUEsV0FBVyxFQUFFTixFQUFFLENBQUNPLE1BRk47QUFHVkMsSUFBQUEsS0FBSyxFQUFFUixFQUFFLENBQUNLLElBSEE7QUFJVkksSUFBQUEsb0JBQW9CLEVBQUVULEVBQUUsQ0FBQ0ssSUFKZjtBQUlxQjtBQUMvQkssSUFBQUEsY0FBYyxFQUFFVixFQUFFLENBQUNLLElBTFQ7QUFNVk0sSUFBQUEsU0FBUyxFQUFFWCxFQUFFLENBQUNZLEtBTko7QUFNVztBQUNyQkMsSUFBQUEsS0FBSyxFQUFFO0FBQ0xDLE1BQUFBLElBQUksRUFBRWQsRUFBRSxDQUFDZSxTQURKO0FBRUwsaUJBQVM7QUFGSjtBQVBHLEdBSEw7QUFpQlBDLEVBQUFBLE1BakJPLG9CQWlCRTtBQUNQO0FBQ0EsU0FBS0MsVUFBTCxHQUFrQixFQUFsQjtBQUNBLFNBQUtDLFVBQUwsR0FBa0IsQ0FBbEIsQ0FITyxDQUlQOztBQUNBLFNBQUtDLG9CQUFMLEdBQTRCLENBQTVCLENBTE8sQ0FNUDs7QUFDQSxTQUFLQyxTQUFMLEdBQWlCLEtBQWpCLENBUE8sQ0FRUDs7QUFDQSxTQUFLQyxXQUFMLEdBQW1CLEVBQW5CLENBVE8sQ0FVUDs7QUFD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QUcsS0FBS25DLFVBQUwsQ0FBZ0JnQyxDQUFoQixDQUFYO0FBQ0FHLGNBQUFBLElBQUksQ0FBQ3dDLElBQUwsQ0FBVSxpQkFBVjtBQUNEOztBQUNELGlCQUFLckUsZ0JBQUwsR0FBd0IsRUFBeEI7QUFDRCxXQWhCRCxNQWdCTztBQUNMO0FBQ0FPLFlBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLHdCQUF3QkMsSUFBSSxDQUFDQyxTQUFMLENBQWVKLElBQWYsQ0FBcEM7QUFDQSxpQkFBS25CLGNBQUwsQ0FBb0IwQixNQUFwQixHQUE2QixLQUE3QixDQUhLLENBSUw7QUFDQTtBQUNBOztBQUNBLGlCQUFLMEcsaUJBQUwsQ0FBdUJqSCxJQUFJLENBQUNpSSxTQUFMLENBQWVaLElBQXRDO0FBQ0EsaUJBQUt4QixXQUFMLENBQWlCN0YsSUFBSSxDQUFDa0ksT0FBdEIsRUFBK0IsS0FBS3hJLGdCQUFwQztBQUNBLGlCQUFLQSxnQkFBTCxHQUF3QixFQUF4QjtBQUVEO0FBRUYsU0EvQnVELENBK0J0RGMsSUEvQnNELENBK0JqRCxJQS9CaUQsQ0FBeEQsRUFSRixDQXdDRTs7O0FBQ0E7O0FBQ0YsV0FBSyxTQUFMO0FBQ0U7O0FBQ0Y7QUFDRTtBQWxFSjtBQW9FRDtBQXRpQk0sQ0FBVCIsInNvdXJjZVJvb3QiOiIuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc2NyaXB0c1xcZ2FtZVNjZW5lIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG15Z2xvYmFsIGZyb20gXCIuLi9teWdvbGJhbC5qc1wiXHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICBwcm9wZXJ0aWVzOiB7XHJcbiAgICBnYW1laW5nVUk6IGNjLk5vZGUsXHJcbiAgICBjYXJkX3ByZWZhYjogY2MuUHJlZmFiLFxyXG4gICAgcm9iVUk6IGNjLk5vZGUsXHJcbiAgICBib3R0b21fY2FyZF9wb3Nfbm9kZTogY2MuTm9kZSwgLy8g5bqV54mM6IqC54K5XHJcbiAgICBwbGF5aW5nVUlfbm9kZTogY2MuTm9kZSxcclxuICAgIHRpcHNMYWJlbDogY2MuTGFiZWwsIC8v546p5a625Ye654mM5LiN5ZCI5rOV55qEdGlwc1xyXG4gICAgZmFwYWk6IHtcclxuICAgICAgdHlwZTogY2MuQXVkaW9DbGlwLFxyXG4gICAgICBkZWZhdWx0OiBudWxsXHJcbiAgICB9XHJcbiAgICBcclxuICB9LFxyXG5cclxuICBvbkxvYWQoKSB7XHJcbiAgICAvL+iHquW3seeJjOWIl+ihqCBcclxuICAgIHRoaXMuY2FyZHNfbm9kcyA9IFtdXHJcbiAgICB0aGlzLmNhcmRfd2lkdGggPSAwXHJcbiAgICAvL+W9k+WJjeWPr+S7peaKouWcsOS4u+eahGFjY291bnRpZFxyXG4gICAgdGhpcy5yb2JfcGxheWVyX2FjY291bnRpZCA9IDBcclxuICAgIC8v5Y+R54mM5Yqo55S75piv5ZCm57uT5p2fXHJcbiAgICB0aGlzLmZhcGFpX2VuZCA9IGZhbHNlXHJcbiAgICAvL+W6leeJjOaVsOe7hFxyXG4gICAgdGhpcy5ib3R0b21fY2FyZCA9IFtdXHJcbiAgICAvL+W6leeJjOeahGpzb27lr7nosaHmlbDmja5cclxuICAgIHRoaXMuYm90dG9tX2NhcmRfZGF0YSA9IFtdXHJcbiAgICB0aGlzLmNob29zZV9jYXJkX2RhdGEgPSBbXVxyXG4gICAgdGhpcy5vdXRjYXJfem9uZSA9IFtdXHJcblxyXG4gICAgdGhpcy5wdXNoX2NhcmRfdG1wID0gW11cclxuXHJcbiAgICAvL+ebkeWQrOacjeWKoeWZqDrpgJrnn6XmiqLlnLDkuLvmtojmga8s5pi+56S655u45bqU55qEVUlcclxuICAgIG15Z2xvYmFsLnNvY2tldC5vbkNhblJvYlN0YXRlKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwib25DYW5Sb2JTdGF0ZVwiICsgSlNPTi5zdHJpbmdpZnkoZGF0YSkpXHJcbiAgICAgIC8v6L+Z6YeM6ZyA6KaBMuS4quWPmOmHj+adoeS7tu+8muiHquW3seaYr+S4i+S4gOS4quaKouWcsOS4u++8jDLlj5HniYzliqjnlLvnu5PmnZ9cclxuICAgICAgdGhpcy5yb2JfcGxheWVyX2FjY291bnRpZCA9IGRhdGFcclxuICAgICAgaWYgKGRhdGEgPT0gbXlnbG9iYWwucGxheWVyRGF0YS51c2VySWQgJiYgdGhpcy5mYXBhaV9lbmQgPT0gdHJ1ZSkge1xyXG4gICAgICAgIHRoaXMucm9iVUkuYWN0aXZlID0gdHJ1ZVxyXG4gICAgICB9XHJcblxyXG4gICAgfS5iaW5kKHRoaXMpKVxyXG5cclxuICAgIC8v55uR5ZCs5pyN5Yqh5Zmo5Y+v5Lul5Ye654mM5raI5oGvXHJcbiAgICBteWdsb2JhbC5zb2NrZXQub25DYW5DaHVDYXJkKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwib25DYW5DaHVDYXJkXCIgKyBKU09OLnN0cmluZ2lmeShkYXRhKSlcclxuICAgICAgLy/liKTmlq3mmK/kuI3mmK/oh6rlt7Hog73lh7rniYxcclxuICAgICAgaWYgKGRhdGEgPT0gbXlnbG9iYWwucGxheWVyRGF0YS51c2VySWQpIHtcclxuICAgICAgICAvL+WFiOa4heeQhuWHuueJjOWMuuWfn1xyXG4gICAgICAgIHRoaXMuY2xlYXJPdXRab25lKG15Z2xvYmFsLnBsYXllckRhdGEudXNlcklkKVxyXG4gICAgICAgIC8v5YWI5oqK6Ieq5bex5Ye654mM5YiX6KGo572u56m6XHJcbiAgICAgICAgLy90aGlzLmNob29zZV9jYXJkX2RhdGE9W11cclxuICAgICAgICAvL+aYvuekuuWPr+S7peWHuueJjOeahFVJXHJcbiAgICAgICAgdGhpcy5wbGF5aW5nVUlfbm9kZS5hY3RpdmUgPSB0cnVlXHJcblxyXG4gICAgICB9XHJcbiAgICB9LmJpbmQodGhpcykpXHJcblxyXG4gICAgLy/nm5HlkKzmnI3liqHlmajvvJrlhbbku5bnjqnlrrblh7rniYzmtojmga9cclxuICAgIG15Z2xvYmFsLnNvY2tldC5vbk90aGVyUGxheWVyQ2h1Q2FyZChmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAvL3tcImFjY291bnRpZFwiOlwiMjM1NzU0MFwiLFwiY2FyZHNcIjpbe1wiY2FyZGlkXCI6NCxcImNhcmRfZGF0YVwiOntcImluZGV4XCI6NCxcInZhbHVlXCI6MSxcInNoYXBlXCI6MX19XX1cclxuICAgICAgY29uc29sZS5sb2coXCJvbk90aGVyUGxheWVyQ2h1Q2FyZFwiICsgSlNPTi5zdHJpbmdpZnkoZGF0YSkpXHJcblxyXG4gICAgICB2YXIgYWNjb3VudGlkID0gZGF0YS5hY2NvdW50aWRcclxuICAgICAgdmFyIGdhbWVTY2VuZV9zY3JpcHQgPSB0aGlzLm5vZGUucGFyZW50LmdldENvbXBvbmVudChcImdhbWVTY2VuZVwiKVxyXG4gICAgICAvL+iOt+WPluWHuueJjOWMuuWfn+iKgueCuVxyXG4gICAgICB2YXIgb3V0Q2FyZF9ub2RlID0gZ2FtZVNjZW5lX3NjcmlwdC5nZXRVc2VyT3V0Q2FyZFBvc0J5QWNjb3VudChhY2NvdW50aWQpXHJcbiAgICAgIGlmIChvdXRDYXJkX25vZGUgPT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgbm9kZV9jYXJkcyA9IFtdXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5jYXJkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBjYXJkID0gY2MuaW5zdGFudGlhdGUodGhpcy5jYXJkX3ByZWZhYilcclxuICAgICAgICBjYXJkLmdldENvbXBvbmVudChcImNhcmRcIikuc2hvd0NhcmRzKGRhdGEuY2FyZHNbaV0uY2FyZF9kYXRhLCBteWdsb2JhbC5wbGF5ZXJEYXRhLnVzZXJJZClcclxuICAgICAgICBub2RlX2NhcmRzLnB1c2goY2FyZClcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmFwcGVuZE90aGVyQ2FyZHNUb091dFpvbmUob3V0Q2FyZF9ub2RlLCBub2RlX2NhcmRzLCAwKVxyXG5cclxuXHJcbiAgICB9LmJpbmQodGhpcykpXHJcblxyXG4gICAgLy/lhoXpg6jkuovku7Y65pi+56S65bqV54mM5LqL5Lu2LGRhdGHmmK/kuInlvKDlupXniYzmlbDmja5cclxuICAgIHRoaXMubm9kZS5vbihcInNob3dfYm90dG9tX2NhcmRfZXZlbnRcIiwgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgY29uc29sZS5sb2coXCItLS0tc2hvd19ib3R0b21fY2FyZF9ldmVudFwiLCArZGF0YSlcclxuXHJcbiAgICAgIHRoaXMuYm90dG9tX2NhcmRfZGF0YSA9IGRhdGFcclxuXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBjYXJkID0gdGhpcy5ib3R0b21fY2FyZFtpXVxyXG4gICAgICAgIHZhciBzaG93X2RhdGEgPSBkYXRhW2ldXHJcbiAgICAgICAgdmFyIGNhbGxfZGF0YSA9IHtcclxuICAgICAgICAgIFwib2JqXCI6IGNhcmQsXHJcbiAgICAgICAgICBcImRhdGFcIjogc2hvd19kYXRhLFxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyhcImJvdHRvbSBzaG93X2RhdGE6XCIgKyBKU09OLnN0cmluZ2lmeShzaG93X2RhdGEpKVxyXG4gICAgICAgIHZhciBydW4gPSBjYy5jYWxsRnVuYyhmdW5jdGlvbiAodGFyZ2V0LCBhY3RpdmVkYXRhKSB7XHJcblxyXG4gICAgICAgICAgdmFyIHNob3dfY2FyZCA9IGFjdGl2ZWRhdGEub2JqXHJcbiAgICAgICAgICB2YXIgc2hvd19kYXRhID0gYWN0aXZlZGF0YS5kYXRhXHJcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiY2MuY2FsbEZ1bmM6XCIrSlNPTi5zdHJpbmdpZnkoc2hvd19kYXRhKSlcclxuICAgICAgICAgIHNob3dfY2FyZC5nZXRDb21wb25lbnQoXCJjYXJkXCIpLnNob3dDYXJkcyhzaG93X2RhdGEpXHJcblxyXG4gICAgICAgIH0sIHRoaXMsIGNhbGxfZGF0YSlcclxuXHJcbiAgICAgICAgY2FyZC5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoY2Mucm90YXRlQnkoMCwgMCwgMTgwKSwgY2Mucm90YXRlQnkoMC4yLCAwLCAtOTApLCBydW4sXHJcbiAgICAgICAgICBjYy5yb3RhdGVCeSgwLjIsIDAsIC05MCksIGNjLnNjYWxlQnkoMSwgMS4yKSkpO1xyXG5cclxuICAgICAgICBpZiAoaXNvcGVuX3NvdW5kKSB7XHJcbiAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5KGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvc291bmQvc3RhcnQubXAzXCIpKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy90aGlzLm5vZGUucGFyZW50LmVtaXQoXCJjaGFuZ2Vfcm9vbV9zdGF0ZV9ldmVudFwiLGRlZmluZXMuZ2FtZVN0YXRlLlJPT01fUExBWUlORylcclxuICAgICAgLy/lpoLmnpzoh6rlt7HlnLDkuLvvvIznu5nliqDkuIrkuInlvKDlupXniYxcclxuICAgICAgaWYgKG15Z2xvYmFsLnBsYXllckRhdGEudXNlcklkID09IG15Z2xvYmFsLnBsYXllckRhdGEubWFzdGVyX2FjY291bnRpZCkge1xyXG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKHRoaXMucHVzaFRocmVlQ2FyZC5iaW5kKHRoaXMpLCAwLjIpXHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgfS5iaW5kKHRoaXMpKVxyXG5cclxuICAgIC8v5rOo5YaM55uR5ZCs5LiA5Liq6YCJ5oup54mM5raI5oGvIFxyXG4gICAgdGhpcy5ub2RlLm9uKFwiY2hvb3NlX2NhcmRfZXZlbnRcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiY2hvb3NlX2NhcmRfZXZlbnQ6XCIgKyBKU09OLnN0cmluZ2lmeShldmVudCkpXHJcbiAgICAgIHZhciBkZXRhaWwgPSBldmVudFxyXG4gICAgICB0aGlzLmNob29zZV9jYXJkX2RhdGEucHVzaChkZXRhaWwpXHJcbiAgICB9LmJpbmQodGhpcykpXHJcblxyXG4gICAgdGhpcy5ub2RlLm9uKFwidW5jaG9vc2VfY2FyZF9ldmVudFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJ1bmNob29zZV9jYXJkX2V2ZW50OlwiICsgZXZlbnQpXHJcbiAgICAgIHZhciBkZXRhaWwgPSBldmVudFxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hvb3NlX2NhcmRfZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmICh0aGlzLmNob29zZV9jYXJkX2RhdGFbaV0uY2FyZGlkID09IGRldGFpbCkge1xyXG4gICAgICAgICAgdGhpcy5jaG9vc2VfY2FyZF9kYXRhLnNwbGljZShpLCAxKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfS5iaW5kKHRoaXMpKVxyXG5cclxuICB9LFxyXG5cclxuICBzdGFydCgpIHtcclxuICAgIC8v55uR5ZCs5pyN5Yqh5ZmoOuS4i+WPkeeJjOa2iOaBr1xyXG4gICAgd2luZG93LiRzb2NrZXQub24oJ3B1c2hjYXJkX25vdGlmeScsIHRoaXMucHVzaENhcmROb3RpZnksIHRoaXMpXHJcbiAgfSxcclxuICBvbkRlc3Ryb3koKSB7XHJcbiAgICB3aW5kb3cuJHNvY2tldC5yZW1vdmUoJ3B1c2hjYXJkX25vdGlmeScsIHRoaXMpXHJcbiAgfSxcclxuICBwdXNoQ2FyZE5vdGlmeShkYXRhKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIm9uUHVzaENhcmRzXCIgKyBKU09OLnN0cmluZ2lmeShkYXRhKSlcclxuICAgIHRoaXMuY2FyZF9kYXRhID0gZGF0YVxyXG4gICAgdGhpcy5jdXJfaW5kZXhfY2FyZCA9IGRhdGEubGVuZ3RoIC0gMVxyXG4gICAgdGhpcy5wdXNoQ2FyZChkYXRhKVxyXG4gICAgLy/lt6bovrnnp7vliqjlrprml7blmahcclxuICAgIHRoaXMuc2NoZWR1bGVPbmNlKHRoaXMuX3J1bmFjdGl2ZV9wdXNoY2FyZC5iaW5kKHRoaXMpLCAwLjMpXHJcbiAgICB0aGlzLm5vZGUucGFyZW50LmVtaXQoXCJwdXNoY2FyZF9vdGhlcl9ldmVudFwiKVxyXG5cclxuICB9LFxyXG4gIC8v5aSE55CG5Y+R54mM55qE5pWI5p6cXHJcbiAgX3J1bmFjdGl2ZV9wdXNoY2FyZCgpIHtcclxuICAgIGlmICh0aGlzLmN1cl9pbmRleF9jYXJkIDwgMCkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcInB1c2hjYXJkIGVuZFwiKVxyXG4gICAgICAvL+WPkeeJjOWKqOeUu+WujOaIkO+8jOaYvuekuuaKouWcsOS4u+aMiemSrlxyXG4gICAgICAvL3RoaXMucm9iVUkuYWN0aXZlID0gdHJ1ZVxyXG4gICAgICB0aGlzLmZhcGFpX2VuZCA9IHRydWVcclxuICAgICAgaWYgKHRoaXMucm9iX3BsYXllcl9hY2NvdW50aWQgPT0gbXlnbG9iYWwucGxheWVyRGF0YS51c2VySWQpIHtcclxuICAgICAgICB0aGlzLnJvYlVJLmFjdGl2ZSA9IHRydWVcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGlzb3Blbl9zb3VuZCkge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJzdGFydCBmYXBhaV9hdWRpb0lEXCIrdGhpcy5mYXBhaV9hdWRpb0lEKSBcclxuICAgICAgICBjYy5hdWRpb0VuZ2luZS5zdG9wKHRoaXMuZmFwYWlfYXVkaW9JRClcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICAgIC8v6YCa55+lZ2FtZXNjZW5l6IqC54K577yM5YCS6K6h5pe2XHJcbiAgICAgIHZhciBzZW5kZXZlbnQgPSB0aGlzLnJvYl9wbGF5ZXJfYWNjb3VudGlkXHJcbiAgICAgIHRoaXMubm9kZS5wYXJlbnQuZW1pdChcImNhbnJvYl9ldmVudFwiLCBzZW5kZXZlbnQpXHJcblxyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICAvL+WOn+aciemAu+i+kSAgXHJcbiAgICAvLyB2YXIgbW92ZV9ub2RlID0gdGhpcy5jYXJkc19ub2RzW3RoaXMuY3VyX2luZGV4X2NhcmRdXHJcbiAgICAvLyBtb3ZlX25vZGUuYWN0aXZlID0gdHJ1ZVxyXG4gICAgLy8gdmFyIG5ld3ggPSBtb3ZlX25vZGUueCArICh0aGlzLmNhcmRfd2lkdGggKiAwLjQqdGhpcy5jdXJfaW5kZXhfY2FyZCkgLSAodGhpcy5jYXJkX3dpZHRoICogMC40KVxyXG4gICAgLy8gdmFyIGFjdGlvbiA9IGNjLm1vdmVUbygwLjEsIGNjLnYyKG5ld3gsIC0yNTApKTtcclxuICAgIC8vIG1vdmVfbm9kZS5ydW5BY3Rpb24oYWN0aW9uKVxyXG4gICAgLy8gdGhpcy5jdXJfaW5kZXhfY2FyZC0tXHJcbiAgICAvLyB0aGlzLnNjaGVkdWxlT25jZSh0aGlzLl9ydW5hY3RpdmVfcHVzaGNhcmQuYmluZCh0aGlzKSwwLjMpXHJcblxyXG5cclxuICAgIHZhciBtb3ZlX25vZGUgPSB0aGlzLmNhcmRzX25vZHNbdGhpcy5jYXJkc19ub2RzLmxlbmd0aCAtIHRoaXMuY3VyX2luZGV4X2NhcmQgLSAxXVxyXG4gICAgbW92ZV9ub2RlLmFjdGl2ZSA9IHRydWVcclxuICAgIHRoaXMucHVzaF9jYXJkX3RtcC5wdXNoKG1vdmVfbm9kZSlcclxuICAgIHRoaXMuZmFwYWlfYXVkaW9JRCA9IGNvbW1vbi5hdWRpby5QbGF5RWZmZWN0KHRoaXMuZmFwYWkpXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucHVzaF9jYXJkX3RtcC5sZW5ndGggLSAxOyBpKyspIHtcclxuICAgICAgdmFyIG1vdmVfbm9kZSA9IHRoaXMucHVzaF9jYXJkX3RtcFtpXVxyXG4gICAgICB2YXIgbmV3eCA9IG1vdmVfbm9kZS54IC0gKHRoaXMuY2FyZF93aWR0aCAqIDAuNClcclxuICAgICAgdmFyIGFjdGlvbiA9IGNjLm1vdmVUbygwLjEsIGNjLnYyKG5ld3gsIC0yNTApKTtcclxuICAgICAgbW92ZV9ub2RlLnJ1bkFjdGlvbihhY3Rpb24pXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jdXJfaW5kZXhfY2FyZC0tXHJcbiAgICB0aGlzLnNjaGVkdWxlT25jZSh0aGlzLl9ydW5hY3RpdmVfcHVzaGNhcmQuYmluZCh0aGlzKSwgMC4zKVxyXG4gIH0sXHJcblxyXG4gIC8v5a+554mM5o6S5bqPXHJcbiAgc29ydENhcmQoKSB7XHJcbiAgICB0aGlzLmNhcmRzX25vZHMuc29ydChmdW5jdGlvbiAoeCwgeSkge1xyXG4gICAgICB2YXIgYSA9IHguZ2V0Q29tcG9uZW50KFwiY2FyZFwiKS5jYXJkX2RhdGE7XHJcbiAgICAgIHZhciBiID0geS5nZXRDb21wb25lbnQoXCJjYXJkXCIpLmNhcmRfZGF0YTtcclxuXHJcbiAgICAgIGlmIChhLmhhc093blByb3BlcnR5KCd2YWx1ZScpICYmIGIuaGFzT3duUHJvcGVydHkoJ3ZhbHVlJykpIHtcclxuICAgICAgICByZXR1cm4gYi52YWx1ZSAtIGEudmFsdWU7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGEuaGFzT3duUHJvcGVydHkoJ2tpbmcnKSAmJiAhYi5oYXNPd25Qcm9wZXJ0eSgna2luZycpKSB7XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICghYS5oYXNPd25Qcm9wZXJ0eSgna2luZycpICYmIGIuaGFzT3duUHJvcGVydHkoJ2tpbmcnKSkge1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChhLmhhc093blByb3BlcnR5KCdraW5nJykgJiYgYi5oYXNPd25Qcm9wZXJ0eSgna2luZycpKSB7XHJcbiAgICAgICAgcmV0dXJuIGIua2luZyAtIGEua2luZztcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIC8vdmFyIHggPSB0aGlzLmNhcmRzX25vZHNbMF0ueDtcclxuICAgIC8v6L+Z6YeM5L2/55So5Zu65a6a5Z2Q5qCH77yM5Zug5Li65Y+WdGhpcy5jYXJkc19ub2RzWzBdLnhr5Y+v6IO95o6S5bqP5Li65a6M5oiQ77yM5a+86Ie0eOmUmeivr1xyXG4gICAgLy/miYDku6XlgZoxMDAw5q+r56eS55qE5bu25pe2XHJcbiAgICB2YXIgdGltZW91dCA9IDEwMDBcclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAvL3ZhciB4ID0gLTQxNy42IFxyXG4gICAgICB2YXIgeCA9IHRoaXMuY2FyZHNfbm9kc1swXS54O1xyXG4gICAgICBjb25zb2xlLmxvZyhcInNvcnQgeDpcIiArIHgpXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYXJkc19ub2RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGNhcmQgPSB0aGlzLmNhcmRzX25vZHNbaV07XHJcbiAgICAgICAgY2FyZC56SW5kZXggPSBpOyAvL+iuvue9rueJjOeahOWPoOWKoOasoeW6jyx6aW5kZXjotorlpKfmmL7npLrlnKjkuIrpnaJcclxuICAgICAgICBjYXJkLnggPSB4ICsgY2FyZC53aWR0aCAqIDAuNCAqIGk7XHJcbiAgICAgIH1cclxuICAgIH0uYmluZCh0aGlzKSwgdGltZW91dCk7XHJcblxyXG5cclxuICB9LFxyXG5cclxuXHJcbiAgcHVzaENhcmQoZGF0YSkge1xyXG4gICAgaWYgKGRhdGEpIHtcclxuICAgICAgZGF0YS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgaWYgKGEuaGFzT3duUHJvcGVydHkoJ3ZhbHVlJykgJiYgYi5oYXNPd25Qcm9wZXJ0eSgndmFsdWUnKSkge1xyXG4gICAgICAgICAgcmV0dXJuIGIudmFsdWUgLSBhLnZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYS5oYXNPd25Qcm9wZXJ0eSgna2luZycpICYmICFiLmhhc093blByb3BlcnR5KCdraW5nJykpIHtcclxuICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFhLmhhc093blByb3BlcnR5KCdraW5nJykgJiYgYi5oYXNPd25Qcm9wZXJ0eSgna2luZycpKSB7XHJcbiAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGEuaGFzT3duUHJvcGVydHkoJ2tpbmcnKSAmJiBiLmhhc093blByb3BlcnR5KCdraW5nJykpIHtcclxuICAgICAgICAgIHJldHVybiBiLmtpbmcgLSBhLmtpbmc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIC8v5Yib5bu6Y2FyZOmihOWItuS9k1xyXG4gICAgdGhpcy5jYXJkc19ub2RzID0gW11cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTc7IGkrKykge1xyXG5cclxuICAgICAgdmFyIGNhcmQgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmNhcmRfcHJlZmFiKVxyXG4gICAgICBjYXJkLnNjYWxlID0gMC44XHJcbiAgICAgIGNhcmQucGFyZW50ID0gdGhpcy5ub2RlLnBhcmVudFxyXG4gICAgICBjYXJkLnggPSBjYXJkLndpZHRoICogMC40ICogKC0wLjUpICogKC0xNikgKyBjYXJkLndpZHRoICogMC40ICogMDtcclxuICAgICAgLy/ov5nph4zlrp7njrDkuLrvvIzmr4/lj5HkuIDlvKDniYzvvIzmlL7lnKjlt7Lnu4/lj5HnmoTniYzmnIDlkI7vvIznhLblkI7mlbTkvZPnp7vliqhcclxuICAgICAgY2FyZC55ID0gLTI1MFxyXG4gICAgICBjYXJkLmFjdGl2ZSA9IGZhbHNlXHJcblxyXG4gICAgICBjYXJkLmdldENvbXBvbmVudChcImNhcmRcIikuc2hvd0NhcmRzKGRhdGFbaV0sIG15Z2xvYmFsLnBsYXllckRhdGEudXNlcklkKVxyXG4gICAgICAvL+WtmOWCqOeJjOeahOS/oeaBryznlKjkuo7lkI7pnaLlj5HniYzmlYjmnpxcclxuICAgICAgdGhpcy5jYXJkc19ub2RzLnB1c2goY2FyZClcclxuICAgICAgdGhpcy5jYXJkX3dpZHRoID0gY2FyZC53aWR0aFxyXG4gICAgfVxyXG5cclxuICAgIC8v5Yib5bu6M+W8oOW6leeJjFxyXG4gICAgdGhpcy5ib3R0b21fY2FyZCA9IFtdXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDM7IGkrKykge1xyXG4gICAgICB2YXIgZGlfY2FyZCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuY2FyZF9wcmVmYWIpXHJcbiAgICAgIGRpX2NhcmQuc2NhbGUgPSAwLjRcclxuICAgICAgZGlfY2FyZC5wb3NpdGlvbiA9IHRoaXMuYm90dG9tX2NhcmRfcG9zX25vZGUucG9zaXRpb25cclxuICAgICAgLy/kuInlvKDniYzvvIzkuK3pl7TlnZDmoIflsLHmmK9ib3R0b21fY2FyZF9wb3Nfbm9kZeiKgueCueWdkOagh++8jFxyXG4gICAgICAvLzAs5ZKMMuS4pOW8oOeJjOW3puWPs+enu+WKqHdpbmR0aCowLjRcclxuICAgICAgaWYgKGkgPT0gMCkge1xyXG4gICAgICAgIGRpX2NhcmQueCA9IGRpX2NhcmQueCAtIGRpX2NhcmQud2lkdGggKiAwLjVcclxuICAgICAgfSBlbHNlIGlmIChpID09IDIpIHtcclxuICAgICAgICBkaV9jYXJkLnggPSBkaV9jYXJkLnggKyBkaV9jYXJkLndpZHRoICogMC41XHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICAvL2RpX2NhcmQueCA9IGRpX2NhcmQud2lkdGgtaSpkaV9jYXJkLndpZHRoLTIwXHJcbiAgICAgIC8vZGlfY2FyZC55PTYwXHJcbiAgICAgIGRpX2NhcmQucGFyZW50ID0gdGhpcy5ub2RlLnBhcmVudFxyXG4gICAgICAvL+WtmOWCqOWcqOWuueWZqOmHjFxyXG4gICAgICB0aGlzLmJvdHRvbV9jYXJkLnB1c2goZGlfY2FyZClcclxuICAgIH1cclxuXHJcbiAgfSxcclxuXHJcbiAgLy/nu5nnjqnlrrblj5HpgIHkuInlvKDlupXniYzlkI7vvIzov4cxcyzmiorniYzorr7nva7liLB5PS0yNTDkvY3nva7mlYjmnpxcclxuICBzY2hlZHVsZVB1c2hUaHJlZUNhcmQoKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2FyZHNfbm9kcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgY2FyZCA9IHRoaXMuY2FyZHNfbm9kc1tpXVxyXG4gICAgICBpZiAoY2FyZC55ID09IC0yMzApIHtcclxuICAgICAgICBjYXJkLnkgPSAtMjUwXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIC8v57uZ5Zyw5Li75Y+R5LiJ5byg5o6S77yM5bm25pi+56S65Zyo5Y6f5pyJ54mM55qE5ZCO6Z2iXHJcbiAgcHVzaFRocmVlQ2FyZCgpIHtcclxuICAgIC8v5q+P5byg54mM55qE5YW25a6e5L2N572uIFxyXG4gICAgdmFyIGxhc3RfY2FyZF94ID0gdGhpcy5jYXJkc19ub2RzW3RoaXMuY2FyZHNfbm9kcy5sZW5ndGggLSAxXS54XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYm90dG9tX2NhcmRfZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgY2FyZCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuY2FyZF9wcmVmYWIpXHJcbiAgICAgIGNhcmQuc2NhbGUgPSAwLjhcclxuICAgICAgY2FyZC5wYXJlbnQgPSB0aGlzLm5vZGUucGFyZW50XHJcblxyXG4gICAgICBjYXJkLnggPSBsYXN0X2NhcmRfeCArICgoaSArIDEpICogdGhpcy5jYXJkX3dpZHRoICogMC40KVxyXG4gICAgICBjYXJkLnkgPSAtMjMwICAvL+WFiOaKiuW6leebmOaUvuWcqC0yMzDvvIzlnKjorr7nva7kuKrlrprml7blmajkuIvnp7vliLAtMjUw55qE5L2N572uXHJcblxyXG4gICAgICAvL2NvbnNvbGUubG9nKFwicHVzaFRocmVlQ2FyZCB4OlwiK2NhcmQueClcclxuICAgICAgY2FyZC5nZXRDb21wb25lbnQoXCJjYXJkXCIpLnNob3dDYXJkcyh0aGlzLmJvdHRvbV9jYXJkX2RhdGFbaV0sIG15Z2xvYmFsLnBsYXllckRhdGEudXNlcklkKVxyXG4gICAgICBjYXJkLmFjdGl2ZSA9IHRydWVcclxuICAgICAgdGhpcy5jYXJkc19ub2RzLnB1c2goY2FyZClcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNvcnRDYXJkKClcclxuICAgIC8v6K6+572u5LiA5Liq5a6a5pe25Zmo77yM5ZyoMnPlkI7vvIzkv67mlLl55Z2Q5qCH5Li6LTI1MFxyXG4gICAgdGhpcy5zY2hlZHVsZU9uY2UodGhpcy5zY2hlZHVsZVB1c2hUaHJlZUNhcmQuYmluZCh0aGlzKSwgMilcclxuXHJcbiAgfSxcclxuXHJcbiAgZGVzdG9yeUNhcmQoYWNjb3VudGlkLCBjaG9vc2VfY2FyZCkge1xyXG4gICAgaWYgKGNob29zZV9jYXJkLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIC8q5Ye654mM6YC76L6RXHJcbiAgICAgIDEuIOWwhumAieS4reeahOeJjCDku47niLboioLngrnkuK3np7vpmaRcclxuICAgICAgMi4g5LuOdGhpcy5jYXJkc19ub2RzIOaVsOe7hOS4re+8jOWIoOmZpCDpgInkuK3nmoTniYwgXHJcbiAgICAgIDMuIOWwhiDigJzpgInkuK3nmoTniYzigJ0g5re75Yqg5Yiw5Ye654mM5Yy65Z+fXHJcbiAgICAgICAgICAzLjEg5riF56m65Ye654mM5Yy65Z+fXHJcbiAgICAgICAgICAzLjIg5re75Yqg5a2Q6IqC54K5XHJcbiAgICAgICAgICAzLjMg6K6+572uc2NhbGVcclxuICAgICAgICAgIDMuNCDorr7nva5wb3NpdGlvblxyXG4gICAgICA0LiAg6YeN5paw6K6+572u5omL5Lit55qE54mM55qE5L2N572uICB0aGlzLnVwZGF0ZUNhcmRzKCk7XHJcbiAgICAqL1xyXG4gICAgLy8xLzLmraXpqqTliKDpmaToh6rlt7HmiYvkuIrnmoRjYXJk6IqC54K5IFxyXG4gICAgdmFyIGRlc3Ryb3lfY2FyZCA9IFtdXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNob29zZV9jYXJkLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5jYXJkc19ub2RzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgdmFyIGNhcmRfaWQgPSB0aGlzLmNhcmRzX25vZHNbal0uZ2V0Q29tcG9uZW50KFwiY2FyZFwiKS5jYXJkX2lkXHJcbiAgICAgICAgaWYgKGNhcmRfaWQgPT0gY2hvb3NlX2NhcmRbaV0uY2FyZGlkKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcImRlc3Ryb3kgY2FyZCBpZDpcIiArIGNhcmRfaWQpXHJcbiAgICAgICAgICAvL3RoaXMuY2FyZHNfbm9kc1tqXS5kZXN0cm95KClcclxuICAgICAgICAgIHRoaXMuY2FyZHNfbm9kc1tqXS5yZW1vdmVGcm9tUGFyZW50KHRydWUpO1xyXG4gICAgICAgICAgZGVzdHJveV9jYXJkLnB1c2godGhpcy5jYXJkc19ub2RzW2pdKVxyXG4gICAgICAgICAgdGhpcy5jYXJkc19ub2RzLnNwbGljZShqLCAxKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYXBwZW5kQ2FyZHNUb091dFpvbmUoYWNjb3VudGlkLCBkZXN0cm95X2NhcmQpXHJcbiAgICB0aGlzLnVwZGF0ZUNhcmRzKClcclxuXHJcbiAgfSxcclxuXHJcbiAgLy/muIXpmaTmmL7npLrlh7rniYzoioLngrnlhajpg6jlrZDoioLngrko5bCx5piv5oqK5Ye654mM55qE5riF56m6KVxyXG4gIGNsZWFyT3V0Wm9uZShhY2NvdW50aWQpIHtcclxuICAgIHZhciBnYW1lU2NlbmVfc2NyaXB0ID0gdGhpcy5ub2RlLnBhcmVudC5nZXRDb21wb25lbnQoXCJnYW1lU2NlbmVcIilcclxuICAgIHZhciBvdXRDYXJkX25vZGUgPSBnYW1lU2NlbmVfc2NyaXB0LmdldFVzZXJPdXRDYXJkUG9zQnlBY2NvdW50KGFjY291bnRpZClcclxuICAgIHZhciBjaGlsZHJlbiA9IG91dENhcmRfbm9kZS5jaGlsZHJlbjtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGNhcmQgPSBjaGlsZHJlbltpXTtcclxuICAgICAgY2FyZC5kZXN0cm95KClcclxuICAgIH1cclxuICAgIG91dENhcmRfbm9kZS5yZW1vdmVBbGxDaGlsZHJlbih0cnVlKTtcclxuICB9LFxyXG4gIC8v5a+55Ye655qE54mM5YGa5o6S5bqPXHJcbiAgcHVzaENhcmRTb3J0KGNhcmRzKSB7XHJcbiAgICBpZiAoY2FyZHMubGVuZ3RoID09IDEpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICBjYXJkcy5zb3J0KGZ1bmN0aW9uICh4LCB5KSB7XHJcbiAgICAgIHZhciBhID0geC5nZXRDb21wb25lbnQoXCJjYXJkXCIpLmNhcmRfZGF0YTtcclxuICAgICAgdmFyIGIgPSB5LmdldENvbXBvbmVudChcImNhcmRcIikuY2FyZF9kYXRhO1xyXG5cclxuICAgICAgaWYgKGEuaGFzT3duUHJvcGVydHkoJ3ZhbHVlJykgJiYgYi5oYXNPd25Qcm9wZXJ0eSgndmFsdWUnKSkge1xyXG4gICAgICAgIHJldHVybiBiLnZhbHVlIC0gYS52YWx1ZTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoYS5oYXNPd25Qcm9wZXJ0eSgna2luZycpICYmICFiLmhhc093blByb3BlcnR5KCdraW5nJykpIHtcclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFhLmhhc093blByb3BlcnR5KCdraW5nJykgJiYgYi5oYXNPd25Qcm9wZXJ0eSgna2luZycpKSB7XHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGEuaGFzT3duUHJvcGVydHkoJ2tpbmcnKSAmJiBiLmhhc093blByb3BlcnR5KCdraW5nJykpIHtcclxuICAgICAgICByZXR1cm4gYi5raW5nIC0gYS5raW5nO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH0sXHJcblxyXG4gIGFwcGVuZE90aGVyQ2FyZHNUb091dFpvbmUob3V0Q2FyZF9ub2RlLCBjYXJkcywgeW9mZnNldCkge1xyXG4gICAgb3V0Q2FyZF9ub2RlLnJlbW92ZUFsbENoaWxkcmVuKHRydWUpO1xyXG5cclxuICAgIC8vY29uc29sZS5sb2coXCJhcHBlbmRPdGhlckNhcmRzVG9PdXRab25lIGxlbmd0aFwiK2NhcmRzLmxlbmd0aClcclxuICAgIC8v5re75Yqg5paw55qE5a2Q6IqC54K5XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcmRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBjYXJkID0gY2FyZHNbaV07XHJcbiAgICAgIG91dENhcmRfbm9kZS5hZGRDaGlsZChjYXJkLCAxMDAgKyBpKSAvL+esrOS6jOS4quWPguaVsOaYr3pvcmRlcizkv53or4HniYzkuI3og73ooqvpga7kvY9cclxuICAgIH1cclxuXHJcbiAgICAvL+WvueWHuueJjOi/m+ihjOaOkuW6j1xyXG4gICAgLy/orr7nva7lh7rniYzoioLngrnnmoTlnZDmoIdcclxuICAgIHZhciB6UG9pbnQgPSBjYXJkcy5sZW5ndGggLyAyO1xyXG4gICAgLy9jb25zb2xlLmxvZyhcImFwcGVuZE90aGVyQ2FyZHNUb091dFpvbmUgemVyb1BvaW50OlwiK3pQb2ludClcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FyZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGNhcmROb2RlID0gb3V0Q2FyZF9ub2RlLmdldENoaWxkcmVuKClbaV1cclxuICAgICAgdmFyIHggPSAoaSAtIHpQb2ludCkgKiAzMDtcclxuICAgICAgdmFyIHkgPSBjYXJkTm9kZS55ICsgeW9mZnNldDsgLy/lm6DkuLrmr4/kuKroioLngrnpnIDopoHnmoRZ5LiN5LiA5qC377yM5YGa5Y+C5pWw5Lyg5YWlXHJcbiAgICAgIC8vY29uc29sZS5sb2coXCItLS0tLWNhcmROb2RlOiB4OlwiK3grXCIgeTpcIit5KVxyXG4gICAgICBjYXJkTm9kZS5zZXRTY2FsZSgwLjUsIDAuNSk7XHJcbiAgICAgIGNhcmROb2RlLnNldFBvc2l0aW9uKHgsIHkpO1xyXG5cclxuICAgIH1cclxuICB9LFxyXG4gIC8v5bCGIOKAnOmAieS4reeahOeJjOKAnSDmt7vliqDliLDlh7rniYzljLrln59cclxuICAvL2Rlc3Ryb3lfY2FyZOaYr+eOqeWutuacrOasoeWHuueahOeJjFxyXG4gIGFwcGVuZENhcmRzVG9PdXRab25lKGFjY291bnRpZCwgZGVzdHJveV9jYXJkKSB7XHJcbiAgICBpZiAoZGVzdHJveV9jYXJkLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgLy/lhYjnu5nmnKzmrKHlh7rnmoTniYzlgZrkuIDkuKrmjpLluo9cclxuICAgIHRoaXMucHVzaENhcmRTb3J0KGRlc3Ryb3lfY2FyZClcclxuICAgIC8vY29uc29sZS5sb2coXCJhcHBlbmRDYXJkc1RvT3V0Wm9uZVwiKVxyXG4gICAgdmFyIGdhbWVTY2VuZV9zY3JpcHQgPSB0aGlzLm5vZGUucGFyZW50LmdldENvbXBvbmVudChcImdhbWVTY2VuZVwiKVxyXG4gICAgLy/ojrflj5blh7rniYzljLrln5/oioLngrlcclxuICAgIHZhciBvdXRDYXJkX25vZGUgPSBnYW1lU2NlbmVfc2NyaXB0LmdldFVzZXJPdXRDYXJkUG9zQnlBY2NvdW50KGFjY291bnRpZClcclxuICAgIHRoaXMuYXBwZW5kT3RoZXJDYXJkc1RvT3V0Wm9uZShvdXRDYXJkX25vZGUsIGRlc3Ryb3lfY2FyZCwgMzYwKVxyXG4gICAgLy9zY29uc29sZS5sb2coXCJPdXRab25lOlwiK291dENhcmRfbm9kZS5uYW1lKVxyXG5cclxuICB9LFxyXG5cclxuICAvL+mHjeaWsOaOkuW6j+aJi+S4iueahOeJjCzlubbnp7vliqhcclxuICB1cGRhdGVDYXJkcygpIHtcclxuXHJcbiAgICB2YXIgemVyb1BvaW50ID0gdGhpcy5jYXJkc19ub2RzLmxlbmd0aCAvIDI7XHJcbiAgICAvL3ZhciBsYXN0X2NhcmRfeCA9IHRoaXMuY2FyZHNfbm9kc1t0aGlzLmNhcmRzX25vZHMubGVuZ3RoLTFdLnhcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jYXJkc19ub2RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBjYXJkTm9kZSA9IHRoaXMuY2FyZHNfbm9kc1tpXVxyXG4gICAgICB2YXIgeCA9IChpIC0gemVyb1BvaW50KSAqICh0aGlzLmNhcmRfd2lkdGggKiAwLjQpO1xyXG4gICAgICBjYXJkTm9kZS5zZXRQb3NpdGlvbih4LCAtMjUwKTtcclxuICAgIH1cclxuXHJcbiAgfSxcclxuXHJcbiAgcGxheVB1c2hDYXJkU291bmQoY2FyZF9uYW1lKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcInBsYXlQdXNoQ2FyZFNvdW5kOlwiICsgY2FyZF9uYW1lKVxyXG5cclxuICAgIGlmIChjYXJkX25hbWUgPT0gXCJcIikge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBzd2l0Y2ggKGNhcmRfbmFtZSkge1xyXG4gICAgICBjYXNlIENhcmRzVmFsdWUub25lLm5hbWU6XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSBDYXJkc1ZhbHVlLmRvdWJsZS5uYW1lOlxyXG4gICAgICAgIGlmIChpc29wZW5fc291bmQpIHtcclxuICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXkoY2MudXJsLnJhdyhcInJlc291cmNlcy9zb3VuZC9kdWl6aS5tcDNcIikpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgfSxcclxuICAvLyB1cGRhdGUgKGR0KSB7fSxcclxuICBvbkJ1dHRvbkNsaWNrKGV2ZW50LCBjdXN0b21EYXRhKSB7XHJcbiAgICBzd2l0Y2ggKGN1c3RvbURhdGEpIHtcclxuICAgICAgY2FzZSBcImJ0bl9xaWFuZHpcIjpcclxuICAgICAgICBjb25zb2xlLmxvZyhcImJ0bl9xaWFuZHpcIilcclxuICAgICAgICBteWdsb2JhbC5zb2NrZXQucmVxdWVzdFJvYlN0YXRlKHFpYW5fc3RhdGUucWlhbilcclxuICAgICAgICB0aGlzLnJvYlVJLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgICAgaWYgKGlzb3Blbl9zb3VuZCkge1xyXG4gICAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheShjYy51cmwucmF3KFwicmVzb3VyY2VzL3NvdW5kL3dvbWFuX2ppYW9fZGlfemh1Lm9nZ1wiKSlcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSBcImJ0bl9idXFpYW5kelwiOlxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiYnRuX2J1cWlhbmR6XCIpXHJcbiAgICAgICAgbXlnbG9iYWwuc29ja2V0LnJlcXVlc3RSb2JTdGF0ZShxaWFuX3N0YXRlLmJ1cWlhbmcpXHJcbiAgICAgICAgdGhpcy5yb2JVSS5hY3RpdmUgPSBmYWxzZVxyXG4gICAgICAgIGlmIChpc29wZW5fc291bmQpIHtcclxuICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXkoY2MudXJsLnJhdyhcInJlc291cmNlcy9zb3VuZC93b21hbl9idV9qaWFvLm9nZ1wiKSlcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSBcIm5vcHVzaGNhcmRcIjogIC8v5LiN5Ye654mMXHJcbiAgICAgICAgbXlnbG9iYWwuc29ja2V0LnJlcXVlc3RfYnVjaHVfY2FyZChbXSwgbnVsbClcclxuICAgICAgICB0aGlzLnBsYXlpbmdVSV9ub2RlLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSBcInB1c2hjYXJkXCI6ICAgLy/lh7rniYxcclxuICAgICAgICAvL+WFiOiOt+WPluacrOasoeWHuueJjOaVsOaNrlxyXG4gICAgICAgIGlmICh0aGlzLmNob29zZV9jYXJkX2RhdGEubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgIHRoaXMudGlwc0xhYmVsLnN0cmluZyA9IFwi6K+36YCJ5oup54mMIVwiXHJcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy50aXBzTGFiZWwuc3RyaW5nID0gXCJcIlxyXG4gICAgICAgICAgfS5iaW5kKHRoaXMpLCAyMDAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbXlnbG9iYWwuc29ja2V0LnJlcXVlc3RfY2h1X2NhcmQodGhpcy5jaG9vc2VfY2FyZF9kYXRhLCBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XHJcblxyXG4gICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInJlcXVlc3RfY2h1X2NhcmQ6XCIgKyBlcnIpXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVxdWVzdF9jaHVfY2FyZFwiICsgSlNPTi5zdHJpbmdpZnkoZGF0YSkpXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRpcHNMYWJlbC5zdHJpbmcgPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgIHRoaXMudGlwc0xhYmVsLnN0cmluZyA9IGRhdGEubXNnXHJcbiAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpcHNMYWJlbC5zdHJpbmcgPSBcIlwiXHJcbiAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCAyMDAwKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy/lh7rniYzlpLHotKXvvIzmiorpgInmi6nnmoTniYzlvZLkvY1cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNhcmRzX25vZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICB2YXIgY2FyZCA9IHRoaXMuY2FyZHNfbm9kc1tpXVxyXG4gICAgICAgICAgICAgIGNhcmQuZW1pdChcInJlc2V0X2NhcmRfZmxhZ1wiKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY2hvb3NlX2NhcmRfZGF0YSA9IFtdXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvL+WHuueJjOaIkOWKn1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInJlc3BfY2h1X2NhcmQgZGF0YTpcIiArIEpTT04uc3RyaW5naWZ5KGRhdGEpKVxyXG4gICAgICAgICAgICB0aGlzLnBsYXlpbmdVSV9ub2RlLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgICAgICAgIC8v5pKt5pS+5Ye654mM55qE5aOw6Z+zXHJcbiAgICAgICAgICAgIC8vcmVzcF9jaHVfY2FyZCBkYXRhOntcImFjY291bnRcIjpcIjI1MTk5MDFcIixcIm1zZ1wiOlwic3VjZXNzXCIsXCJjYXJkdmFsdWVcIjp7XCJuYW1lXCI6XCJEb3VibGVcIixcInZhbHVlXCI6MX19XHJcbiAgICAgICAgICAgIC8ve1widHlwZVwiOlwib3RoZXJfY2h1Y2FyZF9ub3RpZnlcIixcInJlc3VsdFwiOjAsXCJkYXRhXCI6e1wiYWNjb3VudGlkXCI6XCIyNTE5OTAxXCIsXCJjYXJkc1wiOlt7XCJjYXJkaWRcIjoyNCxcImNhcmRfZGF0YVwiOntcImluZGV4XCI6MjQsXCJ2YWx1ZVwiOjYsXCJzaGFwZVwiOjF9fSx7XCJjYXJkaWRcIjoyNixcImNhcmRfZGF0YVwiOntcImluZGV4XCI6MjYsXCJ2YWx1ZVwiOjYsXCJzaGFwZVwiOjN9fV19LFwiY2FsbEJhY2tJbmRleFwiOjB9XHJcbiAgICAgICAgICAgIHRoaXMucGxheVB1c2hDYXJkU291bmQoZGF0YS5jYXJkdmFsdWUubmFtZSlcclxuICAgICAgICAgICAgdGhpcy5kZXN0b3J5Q2FyZChkYXRhLmFjY291bnQsIHRoaXMuY2hvb3NlX2NhcmRfZGF0YSlcclxuICAgICAgICAgICAgdGhpcy5jaG9vc2VfY2FyZF9kYXRhID0gW11cclxuXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0uYmluZCh0aGlzKSlcclxuICAgICAgICAvL3RoaXMucGxheWluZ1VJX25vZGUuYWN0aXZlID0gZmFsc2VcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIFwidGlwY2FyZFwiOlxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxufSk7XHJcbiJdfQ==