
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
    playingUI_node: cc.Node,
    tipsLabel: cc.Label //玩家出牌不合法的tips

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
    this.push_card_tmp = []; //监听服务器:下发牌消息

    _mygolbal["default"].socket.onPushCards(function (data) {
      console.log("onPushCards" + JSON.stringify(data));
      this.card_data = data;
      this.cur_index_card = data.length - 1;
      this.pushCard(data);

      if (isopen_sound) {
        //循环播放发牌音效
        // this.fapai_audioID = cc.audioEngine.play(cc.url.raw("resources/sound/fapai1.mp3"),true)
        console.log("start fapai_audioID" + this.fapai_audioID);
      } //左边移动定时器


      this.scheduleOnce(this._runactive_pushcard.bind(this), 0.3);
      this.node.parent.emit("pushcard_other_event");
    }.bind(this)); //监听服务器:通知抢地主消息,显示相应的UI


    _mygolbal["default"].socket.onCanRobState(function (data) {
      console.log("onCanRobState" + JSON.stringify(data)); //这里需要2个变量条件：自己是下一个抢地主，2发牌动画结束

      this.rob_player_accountid = data;

      if (data == _mygolbal["default"].playerData.accountID && this.fapai_end == true) {
        this.robUI.active = true;
      }
    }.bind(this)); //监听服务器可以出牌消息


    _mygolbal["default"].socket.onCanChuCard(function (data) {
      console.log("onCanRobState" + JSON.stringify(data)); //判断是不是自己能出牌

      if (data == _mygolbal["default"].playerData.accountID) {
        //先清理出牌区域
        this.clearOutZone(_mygolbal["default"].playerData.accountID); //先把自己出牌列表置空
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
        card.getComponent("card").showCards(data.cards[i].card_data, _mygolbal["default"].playerData.accountID);
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
      } //this.node.parent.emit("change_room_state_event",RoomState.ROOM_PLAYING)
      //如果自己地主，给加上三张底牌


      if (_mygolbal["default"].playerData.accountID == _mygolbal["default"].playerData.master_accountid) {
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
  start: function start() {},
  //处理发牌的效果
  _runactive_pushcard: function _runactive_pushcard() {
    //console.log("_runactive_pushcard:"+this.cur_index_card)
    if (this.cur_index_card < 0) {
      console.log("pushcard end"); //发牌动画完成，显示抢地主按钮
      //this.robUI.active = true

      this.fapai_end = true;

      if (this.rob_player_accountid == _mygolbal["default"].playerData.accountID) {
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
    this.fapai_audioID = cc.audioEngine.play(cc.url.raw("resources/sound/fapai1.mp3"));

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
      card.parent = this.node.parent; //card.x = card.width * 0.4 * (17 - 1) * (-0.5) + card.width * 0.4 * 0;

      card.x = card.width * 0.4 * -0.5 * -16 + card.width * 0.4 * 0; //这里实现为，每发一张牌，放在已经发的牌最后，然后整体移动

      card.y = -250;
      card.active = false;
      card.getComponent("card").showCards(data[i], _mygolbal["default"].playerData.accountID); //存储牌的信息,用于后面发牌效果

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
        di_card.x = di_card.x - di_card.width * 0.4;
      } else if (i == 2) {
        di_card.x = di_card.x + di_card.width * 0.4;
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

      card.getComponent("card").showCards(this.bottom_card_data[i], _mygolbal["default"].playerData.accountID);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxnYW1lU2NlbmUvLi5cXC4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHNjcmlwdHNcXGdhbWVTY2VuZS9hc3NldHNcXHNjcmlwdHNcXGdhbWVTY2VuZVxcZ2FtZWluZ1VJLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiZ2FtZWluZ1VJIiwiTm9kZSIsImNhcmRfcHJlZmFiIiwiUHJlZmFiIiwicm9iVUkiLCJib3R0b21fY2FyZF9wb3Nfbm9kZSIsInBsYXlpbmdVSV9ub2RlIiwidGlwc0xhYmVsIiwiTGFiZWwiLCJvbkxvYWQiLCJjYXJkc19ub2RzIiwiY2FyZF93aWR0aCIsInJvYl9wbGF5ZXJfYWNjb3VudGlkIiwiZmFwYWlfZW5kIiwiYm90dG9tX2NhcmQiLCJib3R0b21fY2FyZF9kYXRhIiwiY2hvb3NlX2NhcmRfZGF0YSIsIm91dGNhcl96b25lIiwicHVzaF9jYXJkX3RtcCIsIm15Z2xvYmFsIiwic29ja2V0Iiwib25QdXNoQ2FyZHMiLCJkYXRhIiwiY29uc29sZSIsImxvZyIsIkpTT04iLCJzdHJpbmdpZnkiLCJjYXJkX2RhdGEiLCJjdXJfaW5kZXhfY2FyZCIsImxlbmd0aCIsInB1c2hDYXJkIiwiaXNvcGVuX3NvdW5kIiwiZmFwYWlfYXVkaW9JRCIsInNjaGVkdWxlT25jZSIsIl9ydW5hY3RpdmVfcHVzaGNhcmQiLCJiaW5kIiwibm9kZSIsInBhcmVudCIsImVtaXQiLCJvbkNhblJvYlN0YXRlIiwicGxheWVyRGF0YSIsImFjY291bnRJRCIsImFjdGl2ZSIsIm9uQ2FuQ2h1Q2FyZCIsImNsZWFyT3V0Wm9uZSIsIm9uT3RoZXJQbGF5ZXJDaHVDYXJkIiwiYWNjb3VudGlkIiwiZ2FtZVNjZW5lX3NjcmlwdCIsImdldENvbXBvbmVudCIsIm91dENhcmRfbm9kZSIsImdldFVzZXJPdXRDYXJkUG9zQnlBY2NvdW50Iiwibm9kZV9jYXJkcyIsImkiLCJjYXJkcyIsImNhcmQiLCJpbnN0YW50aWF0ZSIsInNob3dDYXJkcyIsInB1c2giLCJhcHBlbmRPdGhlckNhcmRzVG9PdXRab25lIiwib24iLCJzaG93X2RhdGEiLCJjYWxsX2RhdGEiLCJydW4iLCJjYWxsRnVuYyIsInRhcmdldCIsImFjdGl2ZWRhdGEiLCJzaG93X2NhcmQiLCJvYmoiLCJydW5BY3Rpb24iLCJzZXF1ZW5jZSIsInJvdGF0ZUJ5Iiwic2NhbGVCeSIsImF1ZGlvRW5naW5lIiwicGxheSIsInVybCIsInJhdyIsIm1hc3Rlcl9hY2NvdW50aWQiLCJwdXNoVGhyZWVDYXJkIiwiZXZlbnQiLCJkZXRhaWwiLCJjYXJkaWQiLCJzcGxpY2UiLCJzdGFydCIsInN0b3AiLCJzZW5kZXZlbnQiLCJtb3ZlX25vZGUiLCJuZXd4IiwieCIsImFjdGlvbiIsIm1vdmVUbyIsInYyIiwic29ydENhcmQiLCJzb3J0IiwieSIsImEiLCJiIiwiaGFzT3duUHJvcGVydHkiLCJ2YWx1ZSIsImtpbmciLCJ0aW1lb3V0Iiwic2V0VGltZW91dCIsInpJbmRleCIsIndpZHRoIiwic2NhbGUiLCJkaV9jYXJkIiwicG9zaXRpb24iLCJzY2hlZHVsZVB1c2hUaHJlZUNhcmQiLCJsYXN0X2NhcmRfeCIsImRlc3RvcnlDYXJkIiwiY2hvb3NlX2NhcmQiLCJkZXN0cm95X2NhcmQiLCJqIiwiY2FyZF9pZCIsInJlbW92ZUZyb21QYXJlbnQiLCJhcHBlbmRDYXJkc1RvT3V0Wm9uZSIsInVwZGF0ZUNhcmRzIiwiY2hpbGRyZW4iLCJkZXN0cm95IiwicmVtb3ZlQWxsQ2hpbGRyZW4iLCJwdXNoQ2FyZFNvcnQiLCJ5b2Zmc2V0IiwiYWRkQ2hpbGQiLCJ6UG9pbnQiLCJjYXJkTm9kZSIsImdldENoaWxkcmVuIiwic2V0U2NhbGUiLCJzZXRQb3NpdGlvbiIsInplcm9Qb2ludCIsInBsYXlQdXNoQ2FyZFNvdW5kIiwiY2FyZF9uYW1lIiwiQ2FyZHNWYWx1ZSIsIm9uZSIsIm5hbWUiLCJvbkJ1dHRvbkNsaWNrIiwiY3VzdG9tRGF0YSIsInJlcXVlc3RSb2JTdGF0ZSIsInFpYW5fc3RhdGUiLCJxaWFuIiwiYnVxaWFuZyIsInJlcXVlc3RfYnVjaHVfY2FyZCIsInN0cmluZyIsInJlcXVlc3RfY2h1X2NhcmQiLCJlcnIiLCJtc2ciLCJjYXJkdmFsdWUiLCJhY2NvdW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBRUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0xDLEVBQUFBLFVBQVUsRUFBRTtBQUNSQyxJQUFBQSxTQUFTLEVBQUVKLEVBQUUsQ0FBQ0ssSUFETjtBQUVSQyxJQUFBQSxXQUFXLEVBQUNOLEVBQUUsQ0FBQ08sTUFGUDtBQUdSQyxJQUFBQSxLQUFLLEVBQUNSLEVBQUUsQ0FBQ0ssSUFIRDtBQUlSSSxJQUFBQSxvQkFBb0IsRUFBQ1QsRUFBRSxDQUFDSyxJQUpoQjtBQUtSSyxJQUFBQSxjQUFjLEVBQUNWLEVBQUUsQ0FBQ0ssSUFMVjtBQU1STSxJQUFBQSxTQUFTLEVBQUNYLEVBQUUsQ0FBQ1ksS0FOTCxDQU1ZOztBQU5aLEdBSFA7QUFhTEMsRUFBQUEsTUFiSyxvQkFhSztBQUNOO0FBQ0EsU0FBS0MsVUFBTCxHQUFrQixFQUFsQjtBQUNBLFNBQUtDLFVBQUwsR0FBa0IsQ0FBbEIsQ0FITSxDQUlOOztBQUNBLFNBQUtDLG9CQUFMLEdBQTRCLENBQTVCLENBTE0sQ0FNTjs7QUFDQSxTQUFLQyxTQUFMLEdBQWlCLEtBQWpCLENBUE0sQ0FRTjs7QUFDQSxTQUFLQyxXQUFMLEdBQW1CLEVBQW5CLENBVE0sQ0FVTjs7QUFDQSxTQUFLQyxnQkFBTCxHQUFzQixFQUF0QjtBQUNBLFNBQUtDLGdCQUFMLEdBQXNCLEVBQXRCO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQixFQUFuQjtBQUVBLFNBQUtDLGFBQUwsR0FBcUIsRUFBckIsQ0FmTSxDQWdCTjs7QUFDQUMseUJBQVNDLE1BQVQsQ0FBZ0JDLFdBQWhCLENBQTRCLFVBQVNDLElBQVQsRUFBYztBQUN0Q0Ms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d0JBQXNCQyxJQUFJLENBQUNDLFNBQUwsQ0FBZUosSUFBZixDQUFsQztBQUNBLGlCQUFLaEIsY0FBTCxDQUFvQm9DLE1BQXBCLEdBQTZCLEtBQTdCLENBSEMsQ0FJRDtBQUNBO0FBQ0E7O0FBQ0EsaUJBQUtzRixpQkFBTCxDQUF1QjFHLElBQUksQ0FBQzBILFNBQUwsQ0FBZVosSUFBdEM7QUFDQSxpQkFBS3hCLFdBQUwsQ0FBaUJ0RixJQUFJLENBQUMySCxPQUF0QixFQUE4QixLQUFLakksZ0JBQW5DO0FBQ0EsaUJBQUtBLGdCQUFMLEdBQXdCLEVBQXhCO0FBRUg7QUFFSixTQS9Cc0QsQ0ErQnJEbUIsSUEvQnFELENBK0JoRCxJQS9CZ0QsQ0FBdkQsRUFSSixDQXdDSTs7O0FBQ0E7O0FBQ0osV0FBSyxTQUFMO0FBQ0k7O0FBQ0w7QUFDSTtBQWxFUjtBQW9FSDtBQXhpQkksQ0FBVCIsInNvdXJjZVJvb3QiOiIuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc2NyaXB0c1xcZ2FtZVNjZW5lIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG15Z2xvYmFsIGZyb20gXCIuLi9teWdvbGJhbC5qc1wiXHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIGdhbWVpbmdVSTogY2MuTm9kZSxcclxuICAgICAgICBjYXJkX3ByZWZhYjpjYy5QcmVmYWIsXHJcbiAgICAgICAgcm9iVUk6Y2MuTm9kZSxcclxuICAgICAgICBib3R0b21fY2FyZF9wb3Nfbm9kZTpjYy5Ob2RlLFxyXG4gICAgICAgIHBsYXlpbmdVSV9ub2RlOmNjLk5vZGUsXHJcbiAgICAgICAgdGlwc0xhYmVsOmNjLkxhYmVsLCAvL+eOqeWutuWHuueJjOS4jeWQiOazleeahHRpcHNcclxuICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICBvbkxvYWQgKCkge1xyXG4gICAgICAgIC8v6Ieq5bex54mM5YiX6KGoIFxyXG4gICAgICAgIHRoaXMuY2FyZHNfbm9kcyA9IFtdXHJcbiAgICAgICAgdGhpcy5jYXJkX3dpZHRoID0gMFxyXG4gICAgICAgIC8v5b2T5YmN5Y+v5Lul5oqi5Zyw5Li755qEYWNjb3VudGlkXHJcbiAgICAgICAgdGhpcy5yb2JfcGxheWVyX2FjY291bnRpZCA9IDBcclxuICAgICAgICAvL+WPkeeJjOWKqOeUu+aYr+WQpue7k+adn1xyXG4gICAgICAgIHRoaXMuZmFwYWlfZW5kID0gZmFsc2VcclxuICAgICAgICAvL+W6leeJjOaVsOe7hFxyXG4gICAgICAgIHRoaXMuYm90dG9tX2NhcmQgPSBbXVxyXG4gICAgICAgIC8v5bqV54mM55qEanNvbuWvueixoeaVsOaNrlxyXG4gICAgICAgIHRoaXMuYm90dG9tX2NhcmRfZGF0YT1bXVxyXG4gICAgICAgIHRoaXMuY2hvb3NlX2NhcmRfZGF0YT1bXVxyXG4gICAgICAgIHRoaXMub3V0Y2FyX3pvbmUgPSBbXVxyXG5cclxuICAgICAgICB0aGlzLnB1c2hfY2FyZF90bXAgPSBbXVxyXG4gICAgICAgIC8v55uR5ZCs5pyN5Yqh5ZmoOuS4i+WPkeeJjOa2iOaBr1xyXG4gICAgICAgIG15Z2xvYmFsLnNvY2tldC5vblB1c2hDYXJkcyhmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvblB1c2hDYXJkc1wiK0pTT04uc3RyaW5naWZ5KGRhdGEpKVxyXG4gICAgICAgICAgICB0aGlzLmNhcmRfZGF0YSA9IGRhdGFcclxuICAgICAgICAgICAgdGhpcy5jdXJfaW5kZXhfY2FyZCA9IGRhdGEubGVuZ3RoIC0gMVxyXG4gICAgICAgICAgICB0aGlzLnB1c2hDYXJkKGRhdGEpXHJcbiAgICAgICAgICAgIGlmKGlzb3Blbl9zb3VuZCl7XHJcbiAgICAgICAgICAgICAgICAvL+W+queOr+aSreaUvuWPkeeJjOmfs+aViFxyXG4gICAgICAgICAgICAgICAvLyB0aGlzLmZhcGFpX2F1ZGlvSUQgPSBjYy5hdWRpb0VuZ2luZS5wbGF5KGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvc291bmQvZmFwYWkxLm1wM1wiKSx0cnVlKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdGFydCBmYXBhaV9hdWRpb0lEXCIrdGhpcy5mYXBhaV9hdWRpb0lEKSBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgLy/lt6bovrnnp7vliqjlrprml7blmahcclxuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UodGhpcy5fcnVuYWN0aXZlX3B1c2hjYXJkLmJpbmQodGhpcyksMC4zKVxyXG4gICAgICAgICAgICB0aGlzLm5vZGUucGFyZW50LmVtaXQoXCJwdXNoY2FyZF9vdGhlcl9ldmVudFwiKVxyXG4gICAgICAgICAgIFxyXG4gICAgICAgIH0uYmluZCh0aGlzKSlcclxuXHJcbiAgICAgICAgLy/nm5HlkKzmnI3liqHlmag66YCa55+l5oqi5Zyw5Li75raI5oGvLOaYvuekuuebuOW6lOeahFVJXHJcbiAgICAgICAgbXlnbG9iYWwuc29ja2V0Lm9uQ2FuUm9iU3RhdGUoZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib25DYW5Sb2JTdGF0ZVwiK0pTT04uc3RyaW5naWZ5KGRhdGEpKVxyXG4gICAgICAgICAgICAvL+i/memHjOmcgOimgTLkuKrlj5jph4/mnaHku7bvvJroh6rlt7HmmK/kuIvkuIDkuKrmiqLlnLDkuLvvvIwy5Y+R54mM5Yqo55S757uT5p2fXHJcbiAgICAgICAgICAgIHRoaXMucm9iX3BsYXllcl9hY2NvdW50aWQgPSBkYXRhXHJcbiAgICAgICAgICAgIGlmKGRhdGE9PW15Z2xvYmFsLnBsYXllckRhdGEuYWNjb3VudElEICYmIHRoaXMuZmFwYWlfZW5kPT10cnVlKXtcclxuICAgICAgICAgICAgICAgIHRoaXMucm9iVUkuYWN0aXZlID0gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICB9LmJpbmQodGhpcykpXHJcbiAgICAgICAgXHJcbiAgICAgICAgLy/nm5HlkKzmnI3liqHlmajlj6/ku6Xlh7rniYzmtojmga9cclxuICAgICAgICBteWdsb2JhbC5zb2NrZXQub25DYW5DaHVDYXJkKGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9uQ2FuUm9iU3RhdGVcIitKU09OLnN0cmluZ2lmeShkYXRhKSlcclxuICAgICAgICAgICAgLy/liKTmlq3mmK/kuI3mmK/oh6rlt7Hog73lh7rniYxcclxuICAgICAgICAgICAgaWYoZGF0YT09bXlnbG9iYWwucGxheWVyRGF0YS5hY2NvdW50SUQpe1xyXG4gICAgICAgICAgICAgICAgLy/lhYjmuIXnkIblh7rniYzljLrln59cclxuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJPdXRab25lKG15Z2xvYmFsLnBsYXllckRhdGEuYWNjb3VudElEKVxyXG4gICAgICAgICAgICAgICAgLy/lhYjmioroh6rlt7Hlh7rniYzliJfooajnva7nqbpcclxuICAgICAgICAgICAgICAgIC8vdGhpcy5jaG9vc2VfY2FyZF9kYXRhPVtdXHJcbiAgICAgICAgICAgICAgICAvL+aYvuekuuWPr+S7peWHuueJjOeahFVJXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlpbmdVSV9ub2RlLmFjdGl2ZSA9IHRydWVcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LmJpbmQodGhpcykpXHJcblxyXG4gICAgICAgIC8v55uR5ZCs5pyN5Yqh5Zmo77ya5YW25LuW546p5a625Ye654mM5raI5oGvXHJcbiAgICAgICAgbXlnbG9iYWwuc29ja2V0Lm9uT3RoZXJQbGF5ZXJDaHVDYXJkKGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAvL3tcImFjY291bnRpZFwiOlwiMjM1NzU0MFwiLFwiY2FyZHNcIjpbe1wiY2FyZGlkXCI6NCxcImNhcmRfZGF0YVwiOntcImluZGV4XCI6NCxcInZhbHVlXCI6MSxcInNoYXBlXCI6MX19XX1cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvbk90aGVyUGxheWVyQ2h1Q2FyZFwiK0pTT04uc3RyaW5naWZ5KGRhdGEpKVxyXG5cclxuICAgICAgICAgICAgdmFyIGFjY291bnRpZCA9IGRhdGEuYWNjb3VudGlkXHJcbiAgICAgICAgICAgIHZhciBnYW1lU2NlbmVfc2NyaXB0ID0gdGhpcy5ub2RlLnBhcmVudC5nZXRDb21wb25lbnQoXCJnYW1lU2NlbmVcIilcclxuICAgICAgICAgICAgLy/ojrflj5blh7rniYzljLrln5/oioLngrlcclxuICAgICAgICAgICAgdmFyIG91dENhcmRfbm9kZSA9IGdhbWVTY2VuZV9zY3JpcHQuZ2V0VXNlck91dENhcmRQb3NCeUFjY291bnQoYWNjb3VudGlkKVxyXG4gICAgICAgICAgICBpZihvdXRDYXJkX25vZGU9PW51bGwpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBub2RlX2NhcmRzID0gW11cclxuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxkYXRhLmNhcmRzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIGNhcmQgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmNhcmRfcHJlZmFiKVxyXG4gICAgICAgICAgICAgICAgY2FyZC5nZXRDb21wb25lbnQoXCJjYXJkXCIpLnNob3dDYXJkcyhkYXRhLmNhcmRzW2ldLmNhcmRfZGF0YSxteWdsb2JhbC5wbGF5ZXJEYXRhLmFjY291bnRJRClcclxuICAgICAgICAgICAgICAgIG5vZGVfY2FyZHMucHVzaChjYXJkKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kT3RoZXJDYXJkc1RvT3V0Wm9uZShvdXRDYXJkX25vZGUsbm9kZV9jYXJkcywwKVxyXG5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKVxyXG5cclxuICAgICAgICAvL+WGhemDqOS6i+S7tjrmmL7npLrlupXniYzkuovku7YsZGF0YeaYr+S4ieW8oOW6leeJjOaVsOaNrlxyXG4gICAgICAgIHRoaXMubm9kZS5vbihcInNob3dfYm90dG9tX2NhcmRfZXZlbnRcIixmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCItLS0tc2hvd19ib3R0b21fY2FyZF9ldmVudFwiLCtkYXRhKVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuYm90dG9tX2NhcmRfZGF0YSA9IGRhdGFcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8ZGF0YS5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciBjYXJkID0gdGhpcy5ib3R0b21fY2FyZFtpXVxyXG4gICAgICAgICAgICAgICAgdmFyIHNob3dfZGF0YSA9IGRhdGFbaV1cclxuICAgICAgICAgICAgICAgIHZhciBjYWxsX2RhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJvYmpcIjpjYXJkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGF0YVwiOnNob3dfZGF0YSxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYm90dG9tIHNob3dfZGF0YTpcIitKU09OLnN0cmluZ2lmeShzaG93X2RhdGEpKVxyXG4gICAgICAgICAgICAgICAgdmFyIHJ1biA9ICBjYy5jYWxsRnVuYyhmdW5jdGlvbih0YXJnZXQsYWN0aXZlZGF0YSl7XHJcbiAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2hvd19jYXJkID0gYWN0aXZlZGF0YS5vYmpcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2hvd19kYXRhID0gYWN0aXZlZGF0YS5kYXRhXHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImNjLmNhbGxGdW5jOlwiK0pTT04uc3RyaW5naWZ5KHNob3dfZGF0YSkpXHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd19jYXJkLmdldENvbXBvbmVudChcImNhcmRcIikuc2hvd0NhcmRzKHNob3dfZGF0YSlcclxuICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSx0aGlzLGNhbGxfZGF0YSlcclxuXHJcbiAgICAgICAgICAgICAgICBjYXJkLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShjYy5yb3RhdGVCeSgwLDAsMTgwKSxjYy5yb3RhdGVCeSgwLjIsMCwtOTApLCBydW4sXHJcbiAgICAgICAgICAgICAgICBjYy5yb3RhdGVCeSgwLjIsMCwtOTApLGNjLnNjYWxlQnkoMSwgMS4yKSkpO1xyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmKGlzb3Blbl9zb3VuZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheShjYy51cmwucmF3KFwicmVzb3VyY2VzL3NvdW5kL3N0YXJ0Lm1wM1wiKSkgXHJcbiAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL3RoaXMubm9kZS5wYXJlbnQuZW1pdChcImNoYW5nZV9yb29tX3N0YXRlX2V2ZW50XCIsUm9vbVN0YXRlLlJPT01fUExBWUlORylcclxuICAgICAgICAgICAgLy/lpoLmnpzoh6rlt7HlnLDkuLvvvIznu5nliqDkuIrkuInlvKDlupXniYxcclxuICAgICAgICAgICAgaWYobXlnbG9iYWwucGxheWVyRGF0YS5hY2NvdW50SUQ9PW15Z2xvYmFsLnBsYXllckRhdGEubWFzdGVyX2FjY291bnRpZCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlT25jZSh0aGlzLnB1c2hUaHJlZUNhcmQuYmluZCh0aGlzKSwwLjIpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKVxyXG5cclxuICAgICAgICAvL+azqOWGjOebkeWQrOS4gOS4qumAieaLqeeJjOa2iOaBryBcclxuICAgICAgICB0aGlzLm5vZGUub24oXCJjaG9vc2VfY2FyZF9ldmVudFwiLGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjaG9vc2VfY2FyZF9ldmVudDpcIitKU09OLnN0cmluZ2lmeShldmVudCkpXHJcbiAgICAgICAgICAgIHZhciBkZXRhaWwgPSBldmVudFxyXG4gICAgICAgICAgICB0aGlzLmNob29zZV9jYXJkX2RhdGEucHVzaChkZXRhaWwpXHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKVxyXG5cclxuICAgICAgICB0aGlzLm5vZGUub24oXCJ1bmNob29zZV9jYXJkX2V2ZW50XCIsZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInVuY2hvb3NlX2NhcmRfZXZlbnQ6XCIrIGV2ZW50KVxyXG4gICAgICAgICAgICB2YXIgZGV0YWlsID0gZXZlbnRcclxuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTx0aGlzLmNob29zZV9jYXJkX2RhdGEubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmNob29zZV9jYXJkX2RhdGFbaV0uY2FyZGlkPT1kZXRhaWwpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hvb3NlX2NhcmRfZGF0YS5zcGxpY2UoaSwxKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKVxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgc3RhcnQgKCkge1xyXG4gICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICAvL+WkhOeQhuWPkeeJjOeahOaViOaenFxyXG4gICAgX3J1bmFjdGl2ZV9wdXNoY2FyZCgpe1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJfcnVuYWN0aXZlX3B1c2hjYXJkOlwiK3RoaXMuY3VyX2luZGV4X2NhcmQpXHJcbiAgICAgICAgaWYodGhpcy5jdXJfaW5kZXhfY2FyZCA8IDApe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInB1c2hjYXJkIGVuZFwiKVxyXG4gICAgICAgICAgICAvL+WPkeeJjOWKqOeUu+WujOaIkO+8jOaYvuekuuaKouWcsOS4u+aMiemSrlxyXG4gICAgICAgICAgICAvL3RoaXMucm9iVUkuYWN0aXZlID0gdHJ1ZVxyXG4gICAgICAgICAgICB0aGlzLmZhcGFpX2VuZCA9IHRydWVcclxuICAgICAgICAgICAgaWYodGhpcy5yb2JfcGxheWVyX2FjY291bnRpZD09bXlnbG9iYWwucGxheWVyRGF0YS5hY2NvdW50SUQpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb2JVSS5hY3RpdmUgPSB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKGlzb3Blbl9zb3VuZCl7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwic3RhcnQgZmFwYWlfYXVkaW9JRFwiK3RoaXMuZmFwYWlfYXVkaW9JRCkgXHJcbiAgICAgICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5zdG9wKHRoaXMuZmFwYWlfYXVkaW9JRClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgICAvL+mAmuefpWdhbWVzY2VuZeiKgueCue+8jOWAkuiuoeaXtlxyXG4gICAgICAgICAgICB2YXIgc2VuZGV2ZW50ID0gdGhpcy5yb2JfcGxheWVyX2FjY291bnRpZFxyXG4gICAgICAgICAgICB0aGlzLm5vZGUucGFyZW50LmVtaXQoXCJjYW5yb2JfZXZlbnRcIixzZW5kZXZlbnQpXHJcblxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8v5Y6f5pyJ6YC76L6RICBcclxuICAgICAgICAvLyB2YXIgbW92ZV9ub2RlID0gdGhpcy5jYXJkc19ub2RzW3RoaXMuY3VyX2luZGV4X2NhcmRdXHJcbiAgICAgICAgLy8gbW92ZV9ub2RlLmFjdGl2ZSA9IHRydWVcclxuICAgICAgICAvLyB2YXIgbmV3eCA9IG1vdmVfbm9kZS54ICsgKHRoaXMuY2FyZF93aWR0aCAqIDAuNCp0aGlzLmN1cl9pbmRleF9jYXJkKSAtICh0aGlzLmNhcmRfd2lkdGggKiAwLjQpXHJcbiAgICAgICAgLy8gdmFyIGFjdGlvbiA9IGNjLm1vdmVUbygwLjEsIGNjLnYyKG5ld3gsIC0yNTApKTtcclxuICAgICAgICAvLyBtb3ZlX25vZGUucnVuQWN0aW9uKGFjdGlvbilcclxuICAgICAgICAvLyB0aGlzLmN1cl9pbmRleF9jYXJkLS1cclxuICAgICAgICAvLyB0aGlzLnNjaGVkdWxlT25jZSh0aGlzLl9ydW5hY3RpdmVfcHVzaGNhcmQuYmluZCh0aGlzKSwwLjMpXHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBtb3ZlX25vZGUgPSB0aGlzLmNhcmRzX25vZHNbdGhpcy5jYXJkc19ub2RzLmxlbmd0aC10aGlzLmN1cl9pbmRleF9jYXJkLTFdXHJcbiAgICAgICAgbW92ZV9ub2RlLmFjdGl2ZSA9IHRydWVcclxuICAgICAgICB0aGlzLnB1c2hfY2FyZF90bXAucHVzaChtb3ZlX25vZGUpXHJcbiAgICAgICAgdGhpcy5mYXBhaV9hdWRpb0lEID0gY2MuYXVkaW9FbmdpbmUucGxheShjYy51cmwucmF3KFwicmVzb3VyY2VzL3NvdW5kL2ZhcGFpMS5tcDNcIikpXHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTx0aGlzLnB1c2hfY2FyZF90bXAubGVuZ3RoLTE7aSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciBtb3ZlX25vZGUgPSB0aGlzLnB1c2hfY2FyZF90bXBbaV1cclxuICAgICAgICAgICAgICAgIHZhciBuZXd4ID0gbW92ZV9ub2RlLnggLSAodGhpcy5jYXJkX3dpZHRoICogMC40KVxyXG4gICAgICAgICAgICAgICAgdmFyIGFjdGlvbiA9IGNjLm1vdmVUbygwLjEsIGNjLnYyKG5ld3gsIC0yNTApKTtcclxuICAgICAgICAgICAgICAgIG1vdmVfbm9kZS5ydW5BY3Rpb24oYWN0aW9uKVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmN1cl9pbmRleF9jYXJkLS1cclxuICAgICAgICB0aGlzLnNjaGVkdWxlT25jZSh0aGlzLl9ydW5hY3RpdmVfcHVzaGNhcmQuYmluZCh0aGlzKSwwLjMpXHJcbiAgICB9LFxyXG4gXHJcbiAgICAvL+WvueeJjOaOkuW6j1xyXG4gICAgc29ydENhcmQoKXtcclxuICAgICAgICB0aGlzLmNhcmRzX25vZHMuc29ydChmdW5jdGlvbih4LHkpe1xyXG4gICAgICAgICAgICB2YXIgYSA9IHguZ2V0Q29tcG9uZW50KFwiY2FyZFwiKS5jYXJkX2RhdGE7XHJcbiAgICAgICAgICAgIHZhciBiID0geS5nZXRDb21wb25lbnQoXCJjYXJkXCIpLmNhcmRfZGF0YTtcclxuXHJcbiAgICAgICAgICAgIGlmIChhLmhhc093blByb3BlcnR5KCd2YWx1ZScpICYmIGIuaGFzT3duUHJvcGVydHkoJ3ZhbHVlJykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAgYi52YWx1ZS1hLnZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChhLmhhc093blByb3BlcnR5KCdraW5nJykgJiYgIWIuaGFzT3duUHJvcGVydHkoJ2tpbmcnKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghYS5oYXNPd25Qcm9wZXJ0eSgna2luZycpICYmIGIuaGFzT3duUHJvcGVydHkoJ2tpbmcnKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGEuaGFzT3duUHJvcGVydHkoJ2tpbmcnKSAmJiBiLmhhc093blByb3BlcnR5KCdraW5nJykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAgYi5raW5nLWEua2luZztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLy92YXIgeCA9IHRoaXMuY2FyZHNfbm9kc1swXS54O1xyXG4gICAgICAgIC8v6L+Z6YeM5L2/55So5Zu65a6a5Z2Q5qCH77yM5Zug5Li65Y+WdGhpcy5jYXJkc19ub2RzWzBdLnhr5Y+v6IO95o6S5bqP5Li65a6M5oiQ77yM5a+86Ie0eOmUmeivr1xyXG4gICAgICAgIC8v5omA5Lul5YGaMTAwMOavq+enkueahOW7tuaXtlxyXG4gICAgICAgIHZhciB0aW1lb3V0ID0gMTAwMFxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgLy92YXIgeCA9IC00MTcuNiBcclxuICAgICAgICAgICAgdmFyIHggPSB0aGlzLmNhcmRzX25vZHNbMF0ueDtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzb3J0IHg6XCIrIHgpXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYXJkc19ub2RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2FyZCA9IHRoaXMuY2FyZHNfbm9kc1tpXTtcclxuICAgICAgICAgICAgICAgIGNhcmQuekluZGV4ID0gaTsgLy/orr7nva7niYznmoTlj6DliqDmrKHluo8semluZGV46LaK5aSn5pi+56S65Zyo5LiK6Z2iXHJcbiAgICAgICAgICAgICAgICBjYXJkLnggPSB4ICsgY2FyZC53aWR0aCAqIDAuNCAqIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LmJpbmQodGhpcyksIHRpbWVvdXQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgXHJcbiAgICB9LFxyXG5cclxuICBcclxuICAgIHB1c2hDYXJkKGRhdGEpe1xyXG4gICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZGF0YS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYS5oYXNPd25Qcm9wZXJ0eSgndmFsdWUnKSAmJiBiLmhhc093blByb3BlcnR5KCd2YWx1ZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGIudmFsdWUgLSBhLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGEuaGFzT3duUHJvcGVydHkoJ2tpbmcnKSAmJiAhYi5oYXNPd25Qcm9wZXJ0eSgna2luZycpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCFhLmhhc093blByb3BlcnR5KCdraW5nJykgJiYgYi5oYXNPd25Qcm9wZXJ0eSgna2luZycpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoYS5oYXNPd25Qcm9wZXJ0eSgna2luZycpICYmIGIuaGFzT3duUHJvcGVydHkoJ2tpbmcnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiLmtpbmcgLSBhLmtpbmc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgLy/liJvlu7pjYXJk6aKE5Yi25L2TXHJcbiAgICAgIHRoaXMuY2FyZHNfbm9kcyA9IFtdXHJcbiAgICAgIGZvcih2YXIgaT0wO2k8MTc7aSsrKXtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgY2FyZCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuY2FyZF9wcmVmYWIpXHJcbiAgICAgICAgY2FyZC5zY2FsZT0wLjhcclxuICAgICAgICBjYXJkLnBhcmVudCA9IHRoaXMubm9kZS5wYXJlbnRcclxuICAgICAgICAvL2NhcmQueCA9IGNhcmQud2lkdGggKiAwLjQgKiAoMTcgLSAxKSAqICgtMC41KSArIGNhcmQud2lkdGggKiAwLjQgKiAwO1xyXG4gICAgICAgIGNhcmQueCA9IGNhcmQud2lkdGggKiAwLjQgKiAoLTAuNSkgKiAoLTE2KSArIGNhcmQud2lkdGggKiAwLjQgKiAwO1xyXG4gICAgICAgIC8v6L+Z6YeM5a6e546w5Li677yM5q+P5Y+R5LiA5byg54mM77yM5pS+5Zyo5bey57uP5Y+R55qE54mM5pyA5ZCO77yM54S25ZCO5pW05L2T56e75YqoXHJcbiAgICAgICAgY2FyZC55ID0gLTI1MFxyXG4gICAgICAgIGNhcmQuYWN0aXZlID0gZmFsc2VcclxuXHJcbiAgICAgICAgY2FyZC5nZXRDb21wb25lbnQoXCJjYXJkXCIpLnNob3dDYXJkcyhkYXRhW2ldLG15Z2xvYmFsLnBsYXllckRhdGEuYWNjb3VudElEKVxyXG4gICAgICAgIC8v5a2Y5YKo54mM55qE5L+h5oGvLOeUqOS6juWQjumdouWPkeeJjOaViOaenFxyXG4gICAgICAgIHRoaXMuY2FyZHNfbm9kcy5wdXNoKGNhcmQpXHJcbiAgICAgICAgdGhpcy5jYXJkX3dpZHRoID0gY2FyZC53aWR0aFxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAvL+WIm+W7ujPlvKDlupXniYxcclxuICAgICAgdGhpcy5ib3R0b21fY2FyZCA9IFtdXHJcbiAgICAgIGZvcih2YXIgaT0wO2k8MztpKyspe1xyXG4gICAgICAgIHZhciBkaV9jYXJkID0gY2MuaW5zdGFudGlhdGUodGhpcy5jYXJkX3ByZWZhYilcclxuICAgICAgICBkaV9jYXJkLnNjYWxlPTAuNFxyXG4gICAgICAgIGRpX2NhcmQucG9zaXRpb24gPSB0aGlzLmJvdHRvbV9jYXJkX3Bvc19ub2RlLnBvc2l0aW9uIFxyXG4gICAgICAgIC8v5LiJ5byg54mM77yM5Lit6Ze05Z2Q5qCH5bCx5pivYm90dG9tX2NhcmRfcG9zX25vZGXoioLngrnlnZDmoIfvvIxcclxuICAgICAgICAvLzAs5ZKMMuS4pOW8oOeJjOW3puWPs+enu+WKqHdpbmR0aCowLjRcclxuICAgICAgICBpZihpPT0wKXtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGRpX2NhcmQueCA9IGRpX2NhcmQueCAtIGRpX2NhcmQud2lkdGgqMC40XHJcbiAgICAgICAgfWVsc2UgaWYoaT09Mil7XHJcbiAgICAgICAgICAgIGRpX2NhcmQueCA9IGRpX2NhcmQueCArIGRpX2NhcmQud2lkdGgqMC40XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICAvL2RpX2NhcmQueCA9IGRpX2NhcmQud2lkdGgtaSpkaV9jYXJkLndpZHRoLTIwXHJcbiAgICAgICAgLy9kaV9jYXJkLnk9NjBcclxuICAgICAgICBkaV9jYXJkLnBhcmVudCA9IHRoaXMubm9kZS5wYXJlbnRcclxuICAgICAgICAvL+WtmOWCqOWcqOWuueWZqOmHjFxyXG4gICAgICAgIHRoaXMuYm90dG9tX2NhcmQucHVzaChkaV9jYXJkKVxyXG4gICAgICB9XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvL+e7meeOqeWutuWPkemAgeS4ieW8oOW6leeJjOWQju+8jOi/hzFzLOaKiueJjOiuvue9ruWIsHk9LTI1MOS9jee9ruaViOaenFxyXG4gICAgc2NoZWR1bGVQdXNoVGhyZWVDYXJkKCl7XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTx0aGlzLmNhcmRzX25vZHMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHZhciBjYXJkID0gdGhpcy5jYXJkc19ub2RzW2ldXHJcbiAgICAgICAgICAgIGlmKGNhcmQueT09LTIzMCl7XHJcbiAgICAgICAgICAgICAgICBjYXJkLnkgPSAtMjUwXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy/nu5nlnLDkuLvlj5HkuInlvKDmjpLvvIzlubbmmL7npLrlnKjljp/mnInniYznmoTlkI7pnaJcclxuICAgIHB1c2hUaHJlZUNhcmQoKXtcclxuICAgICAgICAvL+avj+W8oOeJjOeahOWFtuWunuS9jee9riBcclxuICAgICAgICB2YXIgbGFzdF9jYXJkX3ggPSAgdGhpcy5jYXJkc19ub2RzW3RoaXMuY2FyZHNfbm9kcy5sZW5ndGgtMV0ueFxyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8dGhpcy5ib3R0b21fY2FyZF9kYXRhLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB2YXIgY2FyZCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuY2FyZF9wcmVmYWIpXHJcbiAgICAgICAgICAgIGNhcmQuc2NhbGU9MC44XHJcbiAgICAgICAgICAgIGNhcmQucGFyZW50ID0gdGhpcy5ub2RlLnBhcmVudFxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAgIGNhcmQueCA9IGxhc3RfY2FyZF94ICsgKChpKzEpKnRoaXMuY2FyZF93aWR0aCAqIDAuNClcclxuICAgICAgICAgICAgY2FyZC55ID0gLTIzMCAgLy/lhYjmiorlupXnm5jmlL7lnKgtMjMw77yM5Zyo6K6+572u5Liq5a6a5pe25Zmo5LiL56e75YiwLTI1MOeahOS9jee9rlxyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwicHVzaFRocmVlQ2FyZCB4OlwiK2NhcmQueClcclxuICAgICAgICAgICAgY2FyZC5nZXRDb21wb25lbnQoXCJjYXJkXCIpLnNob3dDYXJkcyh0aGlzLmJvdHRvbV9jYXJkX2RhdGFbaV0sbXlnbG9iYWwucGxheWVyRGF0YS5hY2NvdW50SUQpXHJcbiAgICAgICAgICAgIGNhcmQuYWN0aXZlID0gdHJ1ZVxyXG4gICAgICAgICAgICB0aGlzLmNhcmRzX25vZHMucHVzaChjYXJkKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zb3J0Q2FyZCgpXHJcbiAgICAgICAgLy/orr7nva7kuIDkuKrlrprml7blmajvvIzlnKgyc+WQju+8jOS/ruaUuXnlnZDmoIfkuLotMjUwXHJcbiAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UodGhpcy5zY2hlZHVsZVB1c2hUaHJlZUNhcmQuYmluZCh0aGlzKSwyKVxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgZGVzdG9yeUNhcmQoYWNjb3VudGlkLGNob29zZV9jYXJkKXtcclxuICAgICAgICBpZihjaG9vc2VfY2FyZC5sZW5ndGg9PTApe1xyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8q5Ye654mM6YC76L6RXHJcbiAgICAgICAgICAxLiDlsIbpgInkuK3nmoTniYwg5LuO54i26IqC54K55Lit56e76ZmkXHJcbiAgICAgICAgICAyLiDku450aGlzLmNhcmRzX25vZHMg5pWw57uE5Lit77yM5Yig6ZmkIOmAieS4reeahOeJjCBcclxuICAgICAgICAgIDMuIOWwhiDigJzpgInkuK3nmoTniYzigJ0g5re75Yqg5Yiw5Ye654mM5Yy65Z+fXHJcbiAgICAgICAgICAgICAgMy4xIOa4heepuuWHuueJjOWMuuWfn1xyXG4gICAgICAgICAgICAgIDMuMiDmt7vliqDlrZDoioLngrlcclxuICAgICAgICAgICAgICAzLjMg6K6+572uc2NhbGVcclxuICAgICAgICAgICAgICAzLjQg6K6+572ucG9zaXRpb25cclxuICAgICAgICAgIDQuICDph43mlrDorr7nva7miYvkuK3nmoTniYznmoTkvY3nva4gIHRoaXMudXBkYXRlQ2FyZHMoKTtcclxuICAgICAgICAqL1xyXG4gICAgICAgIC8vMS8y5q2l6aqk5Yig6Zmk6Ieq5bex5omL5LiK55qEY2FyZOiKgueCuSBcclxuICAgICAgICB2YXIgZGVzdHJveV9jYXJkID0gW11cclxuICAgICAgICBmb3IodmFyIGk9MDtpPGNob29zZV9jYXJkLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICBmb3IodmFyIGo9MDtqPHRoaXMuY2FyZHNfbm9kcy5sZW5ndGg7aisrKXtcclxuICAgICAgICAgICAgICAgIHZhciBjYXJkX2lkID0gdGhpcy5jYXJkc19ub2RzW2pdLmdldENvbXBvbmVudChcImNhcmRcIikuY2FyZF9pZFxyXG4gICAgICAgICAgICAgICAgaWYoY2FyZF9pZD09Y2hvb3NlX2NhcmRbaV0uY2FyZGlkKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRlc3Ryb3kgY2FyZCBpZDpcIitjYXJkX2lkKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vdGhpcy5jYXJkc19ub2RzW2pdLmRlc3Ryb3koKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FyZHNfbm9kc1tqXS5yZW1vdmVGcm9tUGFyZW50KHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlc3Ryb3lfY2FyZC5wdXNoKHRoaXMuY2FyZHNfbm9kc1tqXSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhcmRzX25vZHMuc3BsaWNlKGosMSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5hcHBlbmRDYXJkc1RvT3V0Wm9uZShhY2NvdW50aWQsZGVzdHJveV9jYXJkKVxyXG4gICAgICAgIHRoaXMudXBkYXRlQ2FyZHMoKVxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy/muIXpmaTmmL7npLrlh7rniYzoioLngrnlhajpg6jlrZDoioLngrko5bCx5piv5oqK5Ye654mM55qE5riF56m6KVxyXG4gICAgY2xlYXJPdXRab25lKGFjY291bnRpZCl7XHJcbiAgICAgICAgdmFyIGdhbWVTY2VuZV9zY3JpcHQgPSB0aGlzLm5vZGUucGFyZW50LmdldENvbXBvbmVudChcImdhbWVTY2VuZVwiKVxyXG4gICAgICAgIHZhciBvdXRDYXJkX25vZGUgPSBnYW1lU2NlbmVfc2NyaXB0LmdldFVzZXJPdXRDYXJkUG9zQnlBY2NvdW50KGFjY291bnRpZClcclxuICAgICAgICB2YXIgY2hpbGRyZW4gPSBvdXRDYXJkX25vZGUuY2hpbGRyZW47XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxjaGlsZHJlbi5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdmFyIGNhcmQgPSBjaGlsZHJlbltpXTsgXHJcbiAgICAgICAgICAgIGNhcmQuZGVzdHJveSgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIG91dENhcmRfbm9kZS5yZW1vdmVBbGxDaGlsZHJlbih0cnVlKTtcclxuICAgIH0sXHJcbiAgICAvL+WvueWHuueahOeJjOWBmuaOkuW6j1xyXG4gICAgcHVzaENhcmRTb3J0KGNhcmRzKXtcclxuICAgICAgICBpZihjYXJkcy5sZW5ndGg9PTEpe1xyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgY2FyZHMuc29ydChmdW5jdGlvbih4LHkpe1xyXG4gICAgICAgICAgICB2YXIgYSA9IHguZ2V0Q29tcG9uZW50KFwiY2FyZFwiKS5jYXJkX2RhdGE7XHJcbiAgICAgICAgICAgIHZhciBiID0geS5nZXRDb21wb25lbnQoXCJjYXJkXCIpLmNhcmRfZGF0YTtcclxuXHJcbiAgICAgICAgICAgIGlmIChhLmhhc093blByb3BlcnR5KCd2YWx1ZScpICYmIGIuaGFzT3duUHJvcGVydHkoJ3ZhbHVlJykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBiLnZhbHVlIC0gYS52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoYS5oYXNPd25Qcm9wZXJ0eSgna2luZycpICYmICFiLmhhc093blByb3BlcnR5KCdraW5nJykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIWEuaGFzT3duUHJvcGVydHkoJ2tpbmcnKSAmJiBiLmhhc093blByb3BlcnR5KCdraW5nJykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChhLmhhc093blByb3BlcnR5KCdraW5nJykgJiYgYi5oYXNPd25Qcm9wZXJ0eSgna2luZycpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYi5raW5nIC0gYS5raW5nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH0sXHJcblxyXG4gICAgYXBwZW5kT3RoZXJDYXJkc1RvT3V0Wm9uZShvdXRDYXJkX25vZGUsY2FyZHMseW9mZnNldCl7XHJcbiAgICAgICBvdXRDYXJkX25vZGUucmVtb3ZlQWxsQ2hpbGRyZW4odHJ1ZSk7XHJcblxyXG4gICAgICAgLy9jb25zb2xlLmxvZyhcImFwcGVuZE90aGVyQ2FyZHNUb091dFpvbmUgbGVuZ3RoXCIrY2FyZHMubGVuZ3RoKVxyXG4gICAgICAgLy/mt7vliqDmlrDnmoTlrZDoioLngrlcclxuICAgICAgIGZvcih2YXIgaT0wO2k8Y2FyZHMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgdmFyIGNhcmQgPSBjYXJkc1tpXTsgXHJcbiAgICAgICAgICAgb3V0Q2FyZF9ub2RlLmFkZENoaWxkKGNhcmQsMTAwK2kpIC8v56ys5LqM5Liq5Y+C5pWw5pivem9yZGVyLOS/neivgeeJjOS4jeiDveiiq+mBruS9j1xyXG4gICAgICAgfVxyXG5cclxuICAgICAgIC8v5a+55Ye654mM6L+b6KGM5o6S5bqPXHJcbiAgICAgICAvL+iuvue9ruWHuueJjOiKgueCueeahOWdkOagh1xyXG4gICAgICAgdmFyIHpQb2ludCA9IGNhcmRzLmxlbmd0aCAvIDI7XHJcbiAgICAgICAvL2NvbnNvbGUubG9nKFwiYXBwZW5kT3RoZXJDYXJkc1RvT3V0Wm9uZSB6ZXJvUG9pbnQ6XCIrelBvaW50KVxyXG4gICAgICAgZm9yKHZhciBpPTA7aTxjYXJkcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICB2YXIgY2FyZE5vZGUgPSBvdXRDYXJkX25vZGUuZ2V0Q2hpbGRyZW4oKVtpXVxyXG4gICAgICAgIHZhciB4ID0gKGkgLSB6UG9pbnQpICogMzA7XHJcbiAgICAgICAgdmFyIHkgPSBjYXJkTm9kZS55K3lvZmZzZXQ7IC8v5Zug5Li65q+P5Liq6IqC54K56ZyA6KaB55qEWeS4jeS4gOagt++8jOWBmuWPguaVsOS8oOWFpVxyXG4gICAgICAgIC8vY29uc29sZS5sb2coXCItLS0tLWNhcmROb2RlOiB4OlwiK3grXCIgeTpcIit5KVxyXG4gICAgICAgIGNhcmROb2RlLnNldFNjYWxlKDAuNSwgMC41KTsgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgY2FyZE5vZGUuc2V0UG9zaXRpb24oeCx5KTsgICAgICAgICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy/lsIYg4oCc6YCJ5Lit55qE54mM4oCdIOa3u+WKoOWIsOWHuueJjOWMuuWfn1xyXG4gICAgLy9kZXN0cm95X2NhcmTmmK/njqnlrrbmnKzmrKHlh7rnmoTniYxcclxuICAgIGFwcGVuZENhcmRzVG9PdXRab25lKGFjY291bnRpZCxkZXN0cm95X2NhcmQpe1xyXG4gICAgICAgIGlmKGRlc3Ryb3lfY2FyZC5sZW5ndGg9PTApe1xyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgLy/lhYjnu5nmnKzmrKHlh7rnmoTniYzlgZrkuIDkuKrmjpLluo9cclxuICAgICAgIHRoaXMucHVzaENhcmRTb3J0KGRlc3Ryb3lfY2FyZClcclxuICAgICAgIC8vY29uc29sZS5sb2coXCJhcHBlbmRDYXJkc1RvT3V0Wm9uZVwiKVxyXG4gICAgICAgdmFyIGdhbWVTY2VuZV9zY3JpcHQgPSB0aGlzLm5vZGUucGFyZW50LmdldENvbXBvbmVudChcImdhbWVTY2VuZVwiKVxyXG4gICAgICAgLy/ojrflj5blh7rniYzljLrln5/oioLngrlcclxuICAgICAgIHZhciBvdXRDYXJkX25vZGUgPSBnYW1lU2NlbmVfc2NyaXB0LmdldFVzZXJPdXRDYXJkUG9zQnlBY2NvdW50KGFjY291bnRpZClcclxuICAgICAgIHRoaXMuYXBwZW5kT3RoZXJDYXJkc1RvT3V0Wm9uZShvdXRDYXJkX25vZGUsZGVzdHJveV9jYXJkLDM2MClcclxuICAgICAgIC8vc2NvbnNvbGUubG9nKFwiT3V0Wm9uZTpcIitvdXRDYXJkX25vZGUubmFtZSlcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8v6YeN5paw5o6S5bqP5omL5LiK55qE54mMLOW5tuenu+WKqFxyXG4gICAgdXBkYXRlQ2FyZHMoKXtcclxuICAgIFxyXG4gICAgICAgIHZhciB6ZXJvUG9pbnQgPSB0aGlzLmNhcmRzX25vZHMubGVuZ3RoIC8gMjtcclxuICAgICAgICAvL3ZhciBsYXN0X2NhcmRfeCA9IHRoaXMuY2FyZHNfbm9kc1t0aGlzLmNhcmRzX25vZHMubGVuZ3RoLTFdLnhcclxuICAgICAgICBmb3IodmFyIGk9MDtpPHRoaXMuY2FyZHNfbm9kcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdmFyIGNhcmROb2RlID0gdGhpcy5jYXJkc19ub2RzW2ldXHJcbiAgICAgICAgICAgIHZhciB4ID0gKGkgLSB6ZXJvUG9pbnQpKih0aGlzLmNhcmRfd2lkdGggKiAwLjQpO1xyXG4gICAgICAgICAgICBjYXJkTm9kZS5zZXRQb3NpdGlvbih4LCAtMjUwKTsgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBwbGF5UHVzaENhcmRTb3VuZChjYXJkX25hbWUpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicGxheVB1c2hDYXJkU291bmQ6XCIrY2FyZF9uYW1lKVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKGNhcmRfbmFtZT09XCJcIil7XHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3dpdGNoKGNhcmRfbmFtZSl7XHJcbiAgICAgICAgICAgIGNhc2UgQ2FyZHNWYWx1ZS5vbmUubmFtZTpcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgQ2FyZHNWYWx1ZS5kb3VibGUubmFtZTpcclxuICAgICAgICAgICAgICAgICAgICBpZihpc29wZW5fc291bmQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5KGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvc291bmQvZHVpemkubXAzXCIpKSBcclxuICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWsgIFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyB1cGRhdGUgKGR0KSB7fSxcclxuICAgIG9uQnV0dG9uQ2xpY2soZXZlbnQsY3VzdG9tRGF0YSl7XHJcbiAgICAgICAgc3dpdGNoKGN1c3RvbURhdGEpe1xyXG4gICAgICAgICAgICBjYXNlIFwiYnRuX3FpYW5kelwiOlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJidG5fcWlhbmR6XCIpXHJcbiAgICAgICAgICAgICAgICBteWdsb2JhbC5zb2NrZXQucmVxdWVzdFJvYlN0YXRlKHFpYW5fc3RhdGUucWlhbilcclxuICAgICAgICAgICAgICAgIHRoaXMucm9iVUkuYWN0aXZlID0gZmFsc2VcclxuICAgICAgICAgICAgICAgIGlmKGlzb3Blbl9zb3VuZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheShjYy51cmwucmF3KFwicmVzb3VyY2VzL3NvdW5kL3dvbWFuX2ppYW9fZGlfemh1Lm9nZ1wiKSkgXHJcbiAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSBcImJ0bl9idXFpYW5kelwiOlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJidG5fYnVxaWFuZHpcIilcclxuICAgICAgICAgICAgICAgIG15Z2xvYmFsLnNvY2tldC5yZXF1ZXN0Um9iU3RhdGUocWlhbl9zdGF0ZS5idXFpYW5nKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5yb2JVSS5hY3RpdmUgPSBmYWxzZVxyXG4gICAgICAgICAgICAgICAgaWYoaXNvcGVuX3NvdW5kKXtcclxuICAgICAgICAgICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5KGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvc291bmQvd29tYW5fYnVfamlhby5vZ2dcIikpIFxyXG4gICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICBicmVhayAgICBcclxuICAgICAgICAgICAgIGNhc2UgXCJub3B1c2hjYXJkXCI6ICAvL+S4jeWHuueJjFxyXG4gICAgICAgICAgICAgICAgIG15Z2xvYmFsLnNvY2tldC5yZXF1ZXN0X2J1Y2h1X2NhcmQoW10sbnVsbClcclxuICAgICAgICAgICAgICAgICB0aGlzLnBsYXlpbmdVSV9ub2RlLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgIGNhc2UgXCJwdXNoY2FyZFwiOiAgIC8v5Ye654mMXHJcbiAgICAgICAgICAgICAgICAgLy/lhYjojrflj5bmnKzmrKHlh7rniYzmlbDmja5cclxuICAgICAgICAgICAgICAgICBpZih0aGlzLmNob29zZV9jYXJkX2RhdGEubGVuZ3RoPT0wKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpcHNMYWJlbC5zdHJpbmc9XCLor7fpgInmi6nniYwhXCJcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGlwc0xhYmVsLnN0cmluZz1cIlwiXHJcbiAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCAyMDAwKTtcclxuICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgbXlnbG9iYWwuc29ja2V0LnJlcXVlc3RfY2h1X2NhcmQodGhpcy5jaG9vc2VfY2FyZF9kYXRhLGZ1bmN0aW9uKGVycixkYXRhKXtcclxuICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGVycil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVxdWVzdF9jaHVfY2FyZDpcIitlcnIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVxdWVzdF9jaHVfY2FyZFwiK0pTT04uc3RyaW5naWZ5KGRhdGEpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnRpcHNMYWJlbC5zdHJpbmc9PVwiXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50aXBzTGFiZWwuc3RyaW5nID0gZGF0YS5tc2dcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRpcHNMYWJlbC5zdHJpbmc9XCJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCAyMDAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy/lh7rniYzlpLHotKXvvIzmiorpgInmi6nnmoTniYzlvZLkvY1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7aTx0aGlzLmNhcmRzX25vZHMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2FyZCA9IHRoaXMuY2FyZHNfbm9kc1tpXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FyZC5lbWl0KFwicmVzZXRfY2FyZF9mbGFnXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaG9vc2VfY2FyZF9kYXRhID0gW11cclxuICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAvL+WHuueJjOaIkOWKn1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZXNwX2NodV9jYXJkIGRhdGE6XCIrSlNPTi5zdHJpbmdpZnkoZGF0YSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXlpbmdVSV9ub2RlLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAvL+aSreaUvuWHuueJjOeahOWjsOmfs1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgLy9yZXNwX2NodV9jYXJkIGRhdGE6e1wiYWNjb3VudFwiOlwiMjUxOTkwMVwiLFwibXNnXCI6XCJzdWNlc3NcIixcImNhcmR2YWx1ZVwiOntcIm5hbWVcIjpcIkRvdWJsZVwiLFwidmFsdWVcIjoxfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgIC8ve1widHlwZVwiOlwib3RoZXJfY2h1Y2FyZF9ub3RpZnlcIixcInJlc3VsdFwiOjAsXCJkYXRhXCI6e1wiYWNjb3VudGlkXCI6XCIyNTE5OTAxXCIsXCJjYXJkc1wiOlt7XCJjYXJkaWRcIjoyNCxcImNhcmRfZGF0YVwiOntcImluZGV4XCI6MjQsXCJ2YWx1ZVwiOjYsXCJzaGFwZVwiOjF9fSx7XCJjYXJkaWRcIjoyNixcImNhcmRfZGF0YVwiOntcImluZGV4XCI6MjYsXCJ2YWx1ZVwiOjYsXCJzaGFwZVwiOjN9fV19LFwiY2FsbEJhY2tJbmRleFwiOjB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXlQdXNoQ2FyZFNvdW5kKGRhdGEuY2FyZHZhbHVlLm5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlc3RvcnlDYXJkKGRhdGEuYWNjb3VudCx0aGlzLmNob29zZV9jYXJkX2RhdGEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNob29zZV9jYXJkX2RhdGEgPSBbXVxyXG4gICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSlcclxuICAgICAgICAgICAgICAgICAvL3RoaXMucGxheWluZ1VJX25vZGUuYWN0aXZlID0gZmFsc2VcclxuICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgY2FzZSBcInRpcGNhcmRcIjpcclxuICAgICAgICAgICAgICAgICBicmVhayAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxufSk7XHJcbiJdfQ==