
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/gameScene/gameScene.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'cf22aez0/xDaaC1kRqxn/pw', 'gameScene');
// scripts/gameScene/gameScene.js

"use strict";

var _mygolbal = _interopRequireDefault(require("../mygolbal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ddzConstants = require('ddzConstants');

var ddzData = require('ddzData');

cc.Class({
  "extends": cc.Component,
  properties: {
    bjMusic: {
      type: cc.AudioClip,
      // 背景音乐
      "default": null // object's default value is null

    },
    di_label: cc.Label,
    beishu_label: cc.Label,
    roomid_label: cc.Label,
    player_node_prefabs: cc.Prefab,
    btn_ready: cc.Node,
    // 准备按钮
    //绑定玩家座位,下面有3个子节点
    players_seat_pos: cc.Node,
    gameUiNode: cc.Node
  },
  onLoad: function onLoad() {
    ddzData.gameState = ddzConstants.gameState.WAITREADY;

    if (!CC_EDITOR) {
      ddzData.gameStateNotify.addListener(this.gameStateHandler, this);
    }

    this.playerNodeList = [];
    var roomId = _mygolbal["default"].playerData.roomId;

    var _roomId$split = roomId.split('_'),
        _roomId$split2 = _slicedToArray(_roomId$split, 2),
        rate = _roomId$split2[0],
        bottom = _roomId$split2[1];

    _mygolbal["default"].playerData.rate = rate;
    _mygolbal["default"].playerData.bottom = bottom;
    this.roomid_label.string = defines.roomNames[rate - 1];
    this.beishu_label.string = "倍数：" + rate;
    this.di_label.string = "底：" + bottom;
    this.btn_ready.active = ddzData.gameState < ddzConstants.gameState.GAMESTART; // 准备按钮

    if (isopen_sound) {
      cc.audioEngine.stopAll(); // cc.audioEngine.play(this.bjMusic, true)
    }

    this.addPlayerNode(_mygolbal["default"].playerData);
    this.addPlayerNode(_mygolbal["default"].playerData.rootList[0]);
    this.addPlayerNode(_mygolbal["default"].playerData.rootList[1]); //监听，给其他玩家发牌(内部事件)

    this.node.on("pushcard_other_event", function () {
      console.log('其他玩家发牌');

      for (var i = 0; i < this.playerNodeList.length; i++) {
        var node = this.playerNodeList[i];

        if (node) {
          //给playernode节点发送事件
          node.emit("push_card_event");
        }
      }
    }.bind(this)); //监听房间状态改变事件
    // myglobal.socket.onRoomChangeState(function (data) {
    //   //回调的函数参数是进入房间用户消息
    //   console.log("onRoomChangeState:" + data)
    //   this.roomstate = data
    // }.bind(this))
    // 抢地主
    // this.node.on("canrob_event", function (event) {
    //   console.log("gamescene canrob_event:" + event)
    //   //通知给playernode子节点
    //   for (var i = 0; i < this.playerNodeList.length; i++) {
    //     var node = this.playerNodeList[i]
    //     if (node) {
    //       //给playernode节点发送事件
    //       node.emit("playernode_canrob_event", event)
    //     }
    //   }
    // }.bind(this))
    // this.node.on("choose_card_event", function (event) {
    //   this.gameUiNode.emit("choose_card_event", event)
    // }.bind(this))
    // this.node.on("unchoose_card_event", function (event) {
    //   this.gameUiNode.emit("unchoose_card_event", event)
    // }.bind(this))
    //监听给玩家添加三张底牌
    // this.node.on("add_three_card",function(event){
    //     console.log("add_three_card:"+event)
    //     for(var i=0;i<this.playerNodeList.length;i++){
    //         var node = this.playerNodeList[i]
    //         if(node){
    //             //给playernode节点发送事件
    //             node.emit("playernode_add_three_card",event)
    //         }
    //     }
    // }.bind(this))

    return;

    _mygolbal["default"].socket.request_enter_room({}, function (err, result) {
      console.log("enter_room_resp" + JSON.stringify(result));

      if (err != 0) {
        console.log("enter_room_resp err:" + err);
      } else {
        //enter_room成功
        //notify ={"seatid":1,"playerdata":[{"accountid":"2117836","userName":"tiny543","avatarUrl":"http://xxx","goldcount":1000}]}
        var seatid = result.seatindex; //自己在房间里的seatid

        this.playerdata_list_pos = []; //3个用户创建一个空用户列表

        this.setPlayerSeatPos(seatid);
        var playerdata_list = result.playerdata;
        var roomId = result.roomId;
        this.roomid_label.string = "房间号:" + roomId;
        _mygolbal["default"].playerData.housemanageid = result.housemanageid;

        for (var i = 0; i < playerdata_list.length; i++) {
          //consol.log("this----"+this)
          this.addPlayerNode(playerdata_list[i]);
        }
      }

      var gamebefore_node = this.node.getChildByName("gamebeforeUI");
      gamebefore_node.emit("init");
    }.bind(this)); //在进入房间后，注册其他玩家进入房间的事件


    _mygolbal["default"].socket.onPlayerJoinRoom(function (join_playerdata) {
      //回调的函数参数是进入房间用户消息
      console.log("onPlayerJoinRoom:" + JSON.stringify(join_playerdata));
      this.addPlayerNode(join_playerdata);
    }.bind(this)); //回调参数是发送准备消息的accountid


    _mygolbal["default"].socket.onPlayerReady(function (data) {
      console.log("-------onPlayerReady:" + data);

      for (var i = 0; i < this.playerNodeList.length; i++) {
        var node = this.playerNodeList[i];

        if (node) {
          node.emit("player_ready_notify", data);
        }
      }
    }.bind(this));

    _mygolbal["default"].socket.onGameStart(function () {
      for (var i = 0; i < this.playerNodeList.length; i++) {
        var node = this.playerNodeList[i];

        if (node) {
          node.emit("gamestart_event");
        }
      } //隐藏gamebeforeUI节点


      var gamebeforeUI = this.node.getChildByName("gamebeforeUI");

      if (gamebeforeUI) {
        gamebeforeUI.active = false;
      }
    }.bind(this)); //监听服务器玩家抢地主消息
    // myglobal.socket.onRobState(function (event) {
    //   console.log("-----onRobState" + JSON.stringify(event))
    //   //onRobState{"accountid":"2162866","state":1}
    //   for (var i = 0; i < this.playerNodeList.length; i++) {
    //     var node = this.playerNodeList[i]
    //     if (node) {
    //       //给playernode节点发送事件
    //       node.emit("playernode_rob_state_event", event)
    //     }
    //   }
    // }.bind(this))
    //注册监听服务器确定地主消息


    _mygolbal["default"].socket.onChangeMaster(function (event) {
      console.log("onChangeMaster" + event); //保存一下地主id

      _mygolbal["default"].playerData.masterUserId = event;

      for (var i = 0; i < this.playerNodeList.length; i++) {
        var node = this.playerNodeList[i];

        if (node) {
          //给playernode节点发送事件
          node.emit("playernode_changemaster_event", event);
        }
      }
    }.bind(this)); //注册监听服务器显示底牌消息
    // myglobal.socket.onShowBottomCard(function (event) {
    //   console.log("onShowBottomCard---------" + event)
    //   this.gameUiNode.emit("show_bottom_card_event", event)
    // }.bind(this))

  },
  start: function start() {
    $socket.on('change_master_notify', this.masterNotify, this);
  },
  onDestroy: function onDestroy() {
    if (!CC_EDITOR) {
      ddzData.gameStateNotify.removeListener(this.gameStateHandler, this);
    }

    $socket.remove('change_master_notify', this);
  },
  // 通知谁是地主, 并显示底牌
  masterNotify: function masterNotify(_ref) {
    var masterId = _ref.masterId,
        cards = _ref.cards;
    // 必须先设置全局地主id
    _mygolbal["default"].playerData.masterUserId = masterId; // 显示底牌

    this.gameUiNode.emit("show_bottom_card_event", cards);

    for (var i = 0; i < this.playerNodeList.length; i++) {
      var node = this.playerNodeList[i];

      if (node) {
        // 给playernode节点发送事件
        node.emit("playernode_changemaster_event", masterId);
      }
    }
  },
  gameStateHandler: function gameStateHandler(state) {
    if (state === ddzConstants.gameState.WAITREADY) {
      this.btn_ready.active = true;
    }
  },
  // 返回大厅
  onGoback: function onGoback() {
    ddzData.gameState = ddzConstants.gameState.INVALID;
    _mygolbal["default"].playerData.roomId = '';
    cc.sys.localStorage.setItem('userData', JSON.stringify(_mygolbal["default"].playerData));
    cc.director.loadScene("hallScene");
  },
  // 准备
  onBtnReadey: function onBtnReadey(event) {
    this.btn_ready.active = false;
    this.playerNodeList.forEach(function (node) {
      node.emit("gamestart_event");
    });
    ddzData.gameState = ddzConstants.gameState.GAMESTART;
  },
  //seat_index自己在房间的位置id
  // setPlayerSeatPos(seat_index) {
  //   if (seat_index < 1 || seat_index > 3) {
  //     console.log("seat_index error" + seat_index)
  //     return
  //   }
  //   console.log("setPlayerSeatPos seat_index:" + seat_index)
  //   //界面位置转化成逻辑位置
  //   switch (seat_index) {
  //     case 1:
  //       this.playerdata_list_pos[1] = 0
  //       this.playerdata_list_pos[2] = 1
  //       this.playerdata_list_pos[3] = 2
  //       break
  //     case 2:
  //       this.playerdata_list_pos[2] = 0
  //       this.playerdata_list_pos[3] = 1
  //       this.playerdata_list_pos[1] = 2
  //       break
  //     case 3:
  //       this.playerdata_list_pos[3] = 0
  //       this.playerdata_list_pos[1] = 1
  //       this.playerdata_list_pos[2] = 2
  //       break
  //     default:
  //       break
  //   }
  // },
  // 添加玩家节点
  addPlayerNode: function addPlayerNode(player_data) {
    var index = player_data.seatindex;
    var playernode_inst = cc.instantiate(this.player_node_prefabs);
    playernode_inst.parent = this.players_seat_pos.children[index]; // playernode_inst.parent = this.node
    //创建的节点存储在gamescene的列表中

    this.playerNodeList.push(playernode_inst); //玩家在room里的位置索引(逻辑位置)
    // playernode_inst.position = this.players_seat_pos.children[index].position

    playernode_inst.getComponent("player_node").init_data(player_data, index); // myglobal.playerData.playerList[index] = player_data
  },

  /*
   //通过userId获取用户出牌放在gamescend的位置 
   做法：先放3个节点在gameacene的场景中 cardsoutzone(012)
  */
  getUserOutCardPosByAccount: function getUserOutCardPosByAccount(userId) {
    for (var i = 0; i < this.playerNodeList.length; i++) {
      var node = this.playerNodeList[i];

      if (node) {
        //获取节点绑定的组件
        var node_script = node.getComponent("player_node"); //如果accountid和player_node节点绑定的accountid相同
        //接获取player_node的子节点

        if (node_script.userId === userId) {
          var seat_node = this.players_seat_pos.children[node_script.seat_index].getChildByName('cardsoutzone');
          return seat_node;
        }
      }
    }

    return null;
  },

  /**
    * @description 通过userId获取玩家头像节点 
    * @param {String} userId 
    * @returns {cc.Node} 玩家节点
    */
  getUserNodeByAccount: function getUserNodeByAccount(userId) {
    for (var i = 0; i < this.playerNodeList.length; i++) {
      var node = this.playerNodeList[i];

      if (node) {
        //获取节点绑定的组件
        var playerNode = node.getComponent("player_node");
        if (playerNode.userId === userId) return playerNode;
      }
    }

    return null;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxnYW1lU2NlbmUvLi5cXC4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHNjcmlwdHNcXGdhbWVTY2VuZS9hc3NldHNcXHNjcmlwdHNcXGdhbWVTY2VuZVxcZ2FtZVNjZW5lLmpzIl0sIm5hbWVzIjpbImRkekNvbnN0YW50cyIsInJlcXVpcmUiLCJkZHpEYXRhIiwiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJiak11c2ljIiwidHlwZSIsIkF1ZGlvQ2xpcCIsImRpX2xhYmVsIiwiTGFiZWwiLCJiZWlzaHVfbGFiZWwiLCJyb29taWRfbGFiZWwiLCJwbGF5ZXJfbm9kZV9wcmVmYWJzIiwiUHJlZmFiIiwiYnRuX3JlYWR5IiwiTm9kZSIsInBsYXllcnNfc2VhdF9wb3MiLCJnYW1lVWlOb2RlIiwib25Mb2FkIiwiZ2FtZVN0YXRlIiwiV0FJVFJFQURZIiwiQ0NfRURJVE9SIiwiZ2FtZVN0YXRlTm90aWZ5IiwiYWRkTGlzdGVuZXIiLCJnYW1lU3RhdGVIYW5kbGVyIiwicGxheWVyTm9kZUxpc3QiLCJyb29tSWQiLCJteWdsb2JhbCIsInBsYXllckRhdGEiLCJzcGxpdCIsInJhdGUiLCJib3R0b20iLCJzdHJpbmciLCJkZWZpbmVzIiwicm9vbU5hbWVzIiwiYWN0aXZlIiwiR0FNRVNUQVJUIiwiaXNvcGVuX3NvdW5kIiwiYXVkaW9FbmdpbmUiLCJzdG9wQWxsIiwiYWRkUGxheWVyTm9kZSIsInJvb3RMaXN0Iiwibm9kZSIsIm9uIiwiY29uc29sZSIsImxvZyIsImkiLCJsZW5ndGgiLCJlbWl0IiwiYmluZCIsInNvY2tldCIsInJlcXVlc3RfZW50ZXJfcm9vbSIsImVyciIsInJlc3VsdCIsIkpTT04iLCJzdHJpbmdpZnkiLCJzZWF0aWQiLCJzZWF0aW5kZXgiLCJwbGF5ZXJkYXRhX2xpc3RfcG9zIiwic2V0UGxheWVyU2VhdFBvcyIsInBsYXllcmRhdGFfbGlzdCIsInBsYXllcmRhdGEiLCJob3VzZW1hbmFnZWlkIiwiZ2FtZWJlZm9yZV9ub2RlIiwiZ2V0Q2hpbGRCeU5hbWUiLCJvblBsYXllckpvaW5Sb29tIiwiam9pbl9wbGF5ZXJkYXRhIiwib25QbGF5ZXJSZWFkeSIsImRhdGEiLCJvbkdhbWVTdGFydCIsImdhbWViZWZvcmVVSSIsIm9uQ2hhbmdlTWFzdGVyIiwiZXZlbnQiLCJtYXN0ZXJVc2VySWQiLCJzdGFydCIsIiRzb2NrZXQiLCJtYXN0ZXJOb3RpZnkiLCJvbkRlc3Ryb3kiLCJyZW1vdmVMaXN0ZW5lciIsInJlbW92ZSIsIm1hc3RlcklkIiwiY2FyZHMiLCJzdGF0ZSIsIm9uR29iYWNrIiwiSU5WQUxJRCIsInN5cyIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJkaXJlY3RvciIsImxvYWRTY2VuZSIsIm9uQnRuUmVhZGV5IiwiZm9yRWFjaCIsInBsYXllcl9kYXRhIiwiaW5kZXgiLCJwbGF5ZXJub2RlX2luc3QiLCJpbnN0YW50aWF0ZSIsInBhcmVudCIsImNoaWxkcmVuIiwicHVzaCIsImdldENvbXBvbmVudCIsImluaXRfZGF0YSIsImdldFVzZXJPdXRDYXJkUG9zQnlBY2NvdW50IiwidXNlcklkIiwibm9kZV9zY3JpcHQiLCJzZWF0X25vZGUiLCJzZWF0X2luZGV4IiwiZ2V0VXNlck5vZGVCeUFjY291bnQiLCJwbGF5ZXJOb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7QUFDQSxJQUFNQSxZQUFZLEdBQUdDLE9BQU8sQ0FBQyxjQUFELENBQTVCOztBQUNBLElBQU1DLE9BQU8sR0FBR0QsT0FBTyxDQUFDLFNBQUQsQ0FBdkI7O0FBRUFFLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ1AsYUFBU0QsRUFBRSxDQUFDRSxTQURMO0FBRVBDLEVBQUFBLFVBQVUsRUFBRTtBQUNWQyxJQUFBQSxPQUFPLEVBQUU7QUFDUEMsTUFBQUEsSUFBSSxFQUFFTCxFQUFFLENBQUNNLFNBREY7QUFDYTtBQUNwQixpQkFBUyxJQUZGLENBRVk7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SUosSUFBSixFQUFVO0FBQ1I7QUFDQSxZQUFNaUUsVUFBVSxHQUFHakUsSUFBSSxDQUFDeUQsWUFBTCxDQUFrQixhQUFsQixDQUFuQjtBQUNBLFlBQUlRLFVBQVUsQ0FBQ0wsTUFBWCxLQUFzQkEsTUFBMUIsRUFBa0MsT0FBT0ssVUFBUDtBQUNuQztBQUNGOztBQUNELFdBQU8sSUFBUDtBQUNEO0FBdFRNLENBQVQiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHNjcmlwdHNcXGdhbWVTY2VuZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBteWdsb2JhbCBmcm9tIFwiLi4vbXlnb2xiYWwuanNcIlxyXG5jb25zdCBkZHpDb25zdGFudHMgPSByZXF1aXJlKCdkZHpDb25zdGFudHMnKVxyXG5jb25zdCBkZHpEYXRhID0gcmVxdWlyZSgnZGR6RGF0YScpXHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG4gIHByb3BlcnRpZXM6IHtcclxuICAgIGJqTXVzaWM6IHtcclxuICAgICAgdHlwZTogY2MuQXVkaW9DbGlwLCAvLyDog4zmma/pn7PkuZBcclxuICAgICAgZGVmYXVsdDogbnVsbCwgICAgIC8vIG9iamVjdCdzIGRlZmF1bHQgdmFsdWUgaXMgbnVsbFxyXG4gICAgfSxcclxuICAgIGRpX2xhYmVsOiBjYy5MYWJlbCxcclxuICAgIGJlaXNodV9sYWJlbDogY2MuTGFiZWwsXHJcbiAgICByb29taWRfbGFiZWw6IGNjLkxhYmVsLFxyXG4gICAgcGxheWVyX25vZGVfcHJlZmFiczogY2MuUHJlZmFiLFxyXG4gICAgYnRuX3JlYWR5OiBjYy5Ob2RlLCAvLyDlh4blpIfmjInpkq5cclxuICAgIC8v57uR5a6a546p5a625bqn5L2NLOS4i+mdouaciTPkuKrlrZDoioLngrlcclxuICAgIHBsYXllcnNfc2VhdF9wb3M6IGNjLk5vZGUsXHJcbiAgICBnYW1lVWlOb2RlOiBjYy5Ob2RlXHJcbiAgfSxcclxuICBvbkxvYWQoKSB7XHJcbiAgICBkZHpEYXRhLmdhbWVTdGF0ZSA9IGRkekNvbnN0YW50cy5nYW1lU3RhdGUuV0FJVFJFQURZXHJcbiAgICBpZiAoIUNDX0VESVRPUikge1xyXG4gICAgICBkZHpEYXRhLmdhbWVTdGF0ZU5vdGlmeS5hZGRMaXN0ZW5lcih0aGlzLmdhbWVTdGF0ZUhhbmRsZXIsIHRoaXMpXHJcbiAgICB9XHJcbiAgICB0aGlzLnBsYXllck5vZGVMaXN0ID0gW11cclxuICAgIGNvbnN0IHsgcm9vbUlkIH0gPSBteWdsb2JhbC5wbGF5ZXJEYXRhXHJcbiAgICBjb25zdCBbcmF0ZSwgYm90dG9tXSA9IHJvb21JZC5zcGxpdCgnXycpXHJcbiAgICBteWdsb2JhbC5wbGF5ZXJEYXRhLnJhdGUgPSByYXRlXHJcbiAgICBteWdsb2JhbC5wbGF5ZXJEYXRhLmJvdHRvbSA9IGJvdHRvbVxyXG5cclxuICAgIHRoaXMucm9vbWlkX2xhYmVsLnN0cmluZyA9IGRlZmluZXMucm9vbU5hbWVzW3JhdGUgLSAxXVxyXG4gICAgdGhpcy5iZWlzaHVfbGFiZWwuc3RyaW5nID0gXCLlgI3mlbDvvJpcIiArIHJhdGVcclxuICAgIHRoaXMuZGlfbGFiZWwuc3RyaW5nID0gXCLlupXvvJpcIiArIGJvdHRvbVxyXG5cclxuICAgIHRoaXMuYnRuX3JlYWR5LmFjdGl2ZSA9IGRkekRhdGEuZ2FtZVN0YXRlIDwgZGR6Q29uc3RhbnRzLmdhbWVTdGF0ZS5HQU1FU1RBUlQgLy8g5YeG5aSH5oyJ6ZKuXHJcbiAgICBpZiAoaXNvcGVuX3NvdW5kKSB7XHJcbiAgICAgIGNjLmF1ZGlvRW5naW5lLnN0b3BBbGwoKVxyXG4gICAgICAvLyBjYy5hdWRpb0VuZ2luZS5wbGF5KHRoaXMuYmpNdXNpYywgdHJ1ZSlcclxuICAgIH1cclxuICAgIHRoaXMuYWRkUGxheWVyTm9kZShteWdsb2JhbC5wbGF5ZXJEYXRhKVxyXG4gICAgdGhpcy5hZGRQbGF5ZXJOb2RlKG15Z2xvYmFsLnBsYXllckRhdGEucm9vdExpc3RbMF0pXHJcbiAgICB0aGlzLmFkZFBsYXllck5vZGUobXlnbG9iYWwucGxheWVyRGF0YS5yb290TGlzdFsxXSlcclxuICAgIC8v55uR5ZCs77yM57uZ5YW25LuW546p5a625Y+R54mMKOWGhemDqOS6i+S7tilcclxuICAgIHRoaXMubm9kZS5vbihcInB1c2hjYXJkX290aGVyX2V2ZW50XCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgY29uc29sZS5sb2coJ+WFtuS7lueOqeWutuWPkeeJjCcpXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJOb2RlTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnBsYXllck5vZGVMaXN0W2ldXHJcbiAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgIC8v57uZcGxheWVybm9kZeiKgueCueWPkemAgeS6i+S7tlxyXG4gICAgICAgICAgbm9kZS5lbWl0KFwicHVzaF9jYXJkX2V2ZW50XCIpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LmJpbmQodGhpcykpXHJcblxyXG4gICAgLy/nm5HlkKzmiL/pl7TnirbmgIHmlLnlj5jkuovku7ZcclxuICAgIC8vIG15Z2xvYmFsLnNvY2tldC5vblJvb21DaGFuZ2VTdGF0ZShmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgLy8gICAvL+Wbnuiwg+eahOWHveaVsOWPguaVsOaYr+i/m+WFpeaIv+mXtOeUqOaIt+a2iOaBr1xyXG4gICAgLy8gICBjb25zb2xlLmxvZyhcIm9uUm9vbUNoYW5nZVN0YXRlOlwiICsgZGF0YSlcclxuICAgIC8vICAgdGhpcy5yb29tc3RhdGUgPSBkYXRhXHJcbiAgICAvLyB9LmJpbmQodGhpcykpXHJcbiAgICAvLyDmiqLlnLDkuLtcclxuICAgIC8vIHRoaXMubm9kZS5vbihcImNhbnJvYl9ldmVudFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIC8vICAgY29uc29sZS5sb2coXCJnYW1lc2NlbmUgY2Fucm9iX2V2ZW50OlwiICsgZXZlbnQpXHJcbiAgICAvLyAgIC8v6YCa55+l57uZcGxheWVybm9kZeWtkOiKgueCuVxyXG4gICAgLy8gICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGxheWVyTm9kZUxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgIC8vICAgICB2YXIgbm9kZSA9IHRoaXMucGxheWVyTm9kZUxpc3RbaV1cclxuICAgIC8vICAgICBpZiAobm9kZSkge1xyXG4gICAgLy8gICAgICAgLy/nu5lwbGF5ZXJub2Rl6IqC54K55Y+R6YCB5LqL5Lu2XHJcbiAgICAvLyAgICAgICBub2RlLmVtaXQoXCJwbGF5ZXJub2RlX2NhbnJvYl9ldmVudFwiLCBldmVudClcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyAgIH1cclxuICAgIC8vIH0uYmluZCh0aGlzKSlcclxuXHJcbiAgICAvLyB0aGlzLm5vZGUub24oXCJjaG9vc2VfY2FyZF9ldmVudFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIC8vICAgdGhpcy5nYW1lVWlOb2RlLmVtaXQoXCJjaG9vc2VfY2FyZF9ldmVudFwiLCBldmVudClcclxuICAgIC8vIH0uYmluZCh0aGlzKSlcclxuXHJcbiAgICAvLyB0aGlzLm5vZGUub24oXCJ1bmNob29zZV9jYXJkX2V2ZW50XCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgLy8gICB0aGlzLmdhbWVVaU5vZGUuZW1pdChcInVuY2hvb3NlX2NhcmRfZXZlbnRcIiwgZXZlbnQpXHJcbiAgICAvLyB9LmJpbmQodGhpcykpXHJcbiAgICAvL+ebkeWQrOe7meeOqeWutua3u+WKoOS4ieW8oOW6leeJjFxyXG4gICAgLy8gdGhpcy5ub2RlLm9uKFwiYWRkX3RocmVlX2NhcmRcIixmdW5jdGlvbihldmVudCl7XHJcbiAgICAvLyAgICAgY29uc29sZS5sb2coXCJhZGRfdGhyZWVfY2FyZDpcIitldmVudClcclxuICAgIC8vICAgICBmb3IodmFyIGk9MDtpPHRoaXMucGxheWVyTm9kZUxpc3QubGVuZ3RoO2krKyl7XHJcbiAgICAvLyAgICAgICAgIHZhciBub2RlID0gdGhpcy5wbGF5ZXJOb2RlTGlzdFtpXVxyXG4gICAgLy8gICAgICAgICBpZihub2RlKXtcclxuICAgIC8vICAgICAgICAgICAgIC8v57uZcGxheWVybm9kZeiKgueCueWPkemAgeS6i+S7tlxyXG4gICAgLy8gICAgICAgICAgICAgbm9kZS5lbWl0KFwicGxheWVybm9kZV9hZGRfdGhyZWVfY2FyZFwiLGV2ZW50KVxyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfS5iaW5kKHRoaXMpKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gICAgbXlnbG9iYWwuc29ja2V0LnJlcXVlc3RfZW50ZXJfcm9vbSh7fSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiZW50ZXJfcm9vbV9yZXNwXCIgKyBKU09OLnN0cmluZ2lmeShyZXN1bHQpKVxyXG4gICAgICBpZiAoZXJyICE9IDApIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImVudGVyX3Jvb21fcmVzcCBlcnI6XCIgKyBlcnIpXHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIC8vZW50ZXJfcm9vbeaIkOWKn1xyXG4gICAgICAgIC8vbm90aWZ5ID17XCJzZWF0aWRcIjoxLFwicGxheWVyZGF0YVwiOlt7XCJhY2NvdW50aWRcIjpcIjIxMTc4MzZcIixcInVzZXJOYW1lXCI6XCJ0aW55NTQzXCIsXCJhdmF0YXJVcmxcIjpcImh0dHA6Ly94eHhcIixcImdvbGRjb3VudFwiOjEwMDB9XX1cclxuICAgICAgICB2YXIgc2VhdGlkID0gcmVzdWx0LnNlYXRpbmRleCAvL+iHquW3seWcqOaIv+mXtOmHjOeahHNlYXRpZFxyXG4gICAgICAgIHRoaXMucGxheWVyZGF0YV9saXN0X3BvcyA9IFtdICAvLzPkuKrnlKjmiLfliJvlu7rkuIDkuKrnqbrnlKjmiLfliJfooahcclxuICAgICAgICB0aGlzLnNldFBsYXllclNlYXRQb3Moc2VhdGlkKVxyXG5cclxuICAgICAgICB2YXIgcGxheWVyZGF0YV9saXN0ID0gcmVzdWx0LnBsYXllcmRhdGFcclxuICAgICAgICB2YXIgcm9vbUlkID0gcmVzdWx0LnJvb21JZFxyXG4gICAgICAgIHRoaXMucm9vbWlkX2xhYmVsLnN0cmluZyA9IFwi5oi/6Ze05Y+3OlwiICsgcm9vbUlkXHJcbiAgICAgICAgbXlnbG9iYWwucGxheWVyRGF0YS5ob3VzZW1hbmFnZWlkID0gcmVzdWx0LmhvdXNlbWFuYWdlaWRcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwbGF5ZXJkYXRhX2xpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIC8vY29uc29sLmxvZyhcInRoaXMtLS0tXCIrdGhpcylcclxuICAgICAgICAgIHRoaXMuYWRkUGxheWVyTm9kZShwbGF5ZXJkYXRhX2xpc3RbaV0pXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgIH1cclxuICAgICAgdmFyIGdhbWViZWZvcmVfbm9kZSA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcImdhbWViZWZvcmVVSVwiKVxyXG4gICAgICBnYW1lYmVmb3JlX25vZGUuZW1pdChcImluaXRcIilcclxuICAgIH0uYmluZCh0aGlzKSlcclxuXHJcbiAgICAvL+WcqOi/m+WFpeaIv+mXtOWQju+8jOazqOWGjOWFtuS7lueOqeWutui/m+WFpeaIv+mXtOeahOS6i+S7tlxyXG4gICAgbXlnbG9iYWwuc29ja2V0Lm9uUGxheWVySm9pblJvb20oZnVuY3Rpb24gKGpvaW5fcGxheWVyZGF0YSkge1xyXG4gICAgICAvL+Wbnuiwg+eahOWHveaVsOWPguaVsOaYr+i/m+WFpeaIv+mXtOeUqOaIt+a2iOaBr1xyXG4gICAgICBjb25zb2xlLmxvZyhcIm9uUGxheWVySm9pblJvb206XCIgKyBKU09OLnN0cmluZ2lmeShqb2luX3BsYXllcmRhdGEpKVxyXG4gICAgICB0aGlzLmFkZFBsYXllck5vZGUoam9pbl9wbGF5ZXJkYXRhKVxyXG4gICAgfS5iaW5kKHRoaXMpKVxyXG5cclxuICAgIC8v5Zue6LCD5Y+C5pWw5piv5Y+R6YCB5YeG5aSH5raI5oGv55qEYWNjb3VudGlkXHJcbiAgICBteWdsb2JhbC5zb2NrZXQub25QbGF5ZXJSZWFkeShmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLS1vblBsYXllclJlYWR5OlwiICsgZGF0YSlcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBsYXllck5vZGVMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLnBsYXllck5vZGVMaXN0W2ldXHJcbiAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgIG5vZGUuZW1pdChcInBsYXllcl9yZWFkeV9ub3RpZnlcIiwgZGF0YSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0uYmluZCh0aGlzKSlcclxuXHJcbiAgICBteWdsb2JhbC5zb2NrZXQub25HYW1lU3RhcnQoZnVuY3Rpb24gKCkge1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGxheWVyTm9kZUxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgbm9kZSA9IHRoaXMucGxheWVyTm9kZUxpc3RbaV1cclxuICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgbm9kZS5lbWl0KFwiZ2FtZXN0YXJ0X2V2ZW50XCIpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvL+makOiXj2dhbWViZWZvcmVVSeiKgueCuVxyXG4gICAgICB2YXIgZ2FtZWJlZm9yZVVJID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKFwiZ2FtZWJlZm9yZVVJXCIpXHJcbiAgICAgIGlmIChnYW1lYmVmb3JlVUkpIHtcclxuICAgICAgICBnYW1lYmVmb3JlVUkuYWN0aXZlID0gZmFsc2VcclxuICAgICAgfVxyXG4gICAgfS5iaW5kKHRoaXMpKVxyXG5cclxuICAgIC8v55uR5ZCs5pyN5Yqh5Zmo546p5a625oqi5Zyw5Li75raI5oGvXHJcbiAgICAvLyBteWdsb2JhbC5zb2NrZXQub25Sb2JTdGF0ZShmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIC8vICAgY29uc29sZS5sb2coXCItLS0tLW9uUm9iU3RhdGVcIiArIEpTT04uc3RyaW5naWZ5KGV2ZW50KSlcclxuICAgIC8vICAgLy9vblJvYlN0YXRle1wiYWNjb3VudGlkXCI6XCIyMTYyODY2XCIsXCJzdGF0ZVwiOjF9XHJcbiAgICAvLyAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJOb2RlTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgLy8gICAgIHZhciBub2RlID0gdGhpcy5wbGF5ZXJOb2RlTGlzdFtpXVxyXG4gICAgLy8gICAgIGlmIChub2RlKSB7XHJcbiAgICAvLyAgICAgICAvL+e7mXBsYXllcm5vZGXoioLngrnlj5HpgIHkuovku7ZcclxuICAgIC8vICAgICAgIG5vZGUuZW1pdChcInBsYXllcm5vZGVfcm9iX3N0YXRlX2V2ZW50XCIsIGV2ZW50KVxyXG4gICAgLy8gICAgIH1cclxuICAgIC8vICAgfVxyXG4gICAgLy8gfS5iaW5kKHRoaXMpKVxyXG5cclxuICAgIC8v5rOo5YaM55uR5ZCs5pyN5Yqh5Zmo56Gu5a6a5Zyw5Li75raI5oGvXHJcbiAgICBteWdsb2JhbC5zb2NrZXQub25DaGFuZ2VNYXN0ZXIoZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwib25DaGFuZ2VNYXN0ZXJcIiArIGV2ZW50KVxyXG4gICAgICAvL+S/neWtmOS4gOS4i+WcsOS4u2lkXHJcbiAgICAgIG15Z2xvYmFsLnBsYXllckRhdGEubWFzdGVyVXNlcklkID0gZXZlbnRcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBsYXllck5vZGVMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLnBsYXllck5vZGVMaXN0W2ldXHJcbiAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgIC8v57uZcGxheWVybm9kZeiKgueCueWPkemAgeS6i+S7tlxyXG4gICAgICAgICAgbm9kZS5lbWl0KFwicGxheWVybm9kZV9jaGFuZ2VtYXN0ZXJfZXZlbnRcIiwgZXZlbnQpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LmJpbmQodGhpcykpXHJcblxyXG4gICAgLy/ms6jlhoznm5HlkKzmnI3liqHlmajmmL7npLrlupXniYzmtojmga9cclxuICAgIC8vIG15Z2xvYmFsLnNvY2tldC5vblNob3dCb3R0b21DYXJkKGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgLy8gICBjb25zb2xlLmxvZyhcIm9uU2hvd0JvdHRvbUNhcmQtLS0tLS0tLS1cIiArIGV2ZW50KVxyXG4gICAgLy8gICB0aGlzLmdhbWVVaU5vZGUuZW1pdChcInNob3dfYm90dG9tX2NhcmRfZXZlbnRcIiwgZXZlbnQpXHJcbiAgICAvLyB9LmJpbmQodGhpcykpXHJcbiAgfSxcclxuICBzdGFydCgpIHtcclxuICAgICRzb2NrZXQub24oJ2NoYW5nZV9tYXN0ZXJfbm90aWZ5JywgdGhpcy5tYXN0ZXJOb3RpZnksIHRoaXMpXHJcbiAgfSxcclxuICBvbkRlc3Ryb3koKSB7XHJcbiAgICBpZiAoIUNDX0VESVRPUikge1xyXG4gICAgICBkZHpEYXRhLmdhbWVTdGF0ZU5vdGlmeS5yZW1vdmVMaXN0ZW5lcih0aGlzLmdhbWVTdGF0ZUhhbmRsZXIsIHRoaXMpXHJcbiAgICB9XHJcbiAgICAkc29ja2V0LnJlbW92ZSgnY2hhbmdlX21hc3Rlcl9ub3RpZnknLCB0aGlzKVxyXG4gIH0sXHJcbiAgLy8g6YCa55+l6LCB5piv5Zyw5Li7LCDlubbmmL7npLrlupXniYxcclxuICBtYXN0ZXJOb3RpZnkoeyBtYXN0ZXJJZCwgY2FyZHMgfSkge1xyXG4gICAgLy8g5b+F6aG75YWI6K6+572u5YWo5bGA5Zyw5Li7aWRcclxuICAgIG15Z2xvYmFsLnBsYXllckRhdGEubWFzdGVyVXNlcklkID0gbWFzdGVySWRcclxuICAgIC8vIOaYvuekuuW6leeJjFxyXG4gICAgdGhpcy5nYW1lVWlOb2RlLmVtaXQoXCJzaG93X2JvdHRvbV9jYXJkX2V2ZW50XCIsIGNhcmRzKVxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBsYXllck5vZGVMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBub2RlID0gdGhpcy5wbGF5ZXJOb2RlTGlzdFtpXVxyXG4gICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgIC8vIOe7mXBsYXllcm5vZGXoioLngrnlj5HpgIHkuovku7ZcclxuICAgICAgICBub2RlLmVtaXQoXCJwbGF5ZXJub2RlX2NoYW5nZW1hc3Rlcl9ldmVudFwiLCBtYXN0ZXJJZClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgZ2FtZVN0YXRlSGFuZGxlcihzdGF0ZSkge1xyXG4gICAgaWYgKHN0YXRlID09PSBkZHpDb25zdGFudHMuZ2FtZVN0YXRlLldBSVRSRUFEWSkge1xyXG4gICAgICB0aGlzLmJ0bl9yZWFkeS5hY3RpdmUgPSB0cnVlXHJcbiAgICB9XHJcbiAgfSxcclxuICAvLyDov5Tlm57lpKfljoVcclxuICBvbkdvYmFjaygpIHtcclxuICAgIGRkekRhdGEuZ2FtZVN0YXRlID0gZGR6Q29uc3RhbnRzLmdhbWVTdGF0ZS5JTlZBTElEXHJcbiAgICBteWdsb2JhbC5wbGF5ZXJEYXRhLnJvb21JZCA9ICcnXHJcbiAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXJEYXRhJywgSlNPTi5zdHJpbmdpZnkobXlnbG9iYWwucGxheWVyRGF0YSkpXHJcbiAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJoYWxsU2NlbmVcIilcclxuICB9LFxyXG4gIC8vIOWHhuWkh1xyXG4gIG9uQnRuUmVhZGV5KGV2ZW50KSB7XHJcbiAgICB0aGlzLmJ0bl9yZWFkeS5hY3RpdmUgPSBmYWxzZVxyXG4gICAgdGhpcy5wbGF5ZXJOb2RlTGlzdC5mb3JFYWNoKG5vZGUgPT4ge1xyXG4gICAgICBub2RlLmVtaXQoXCJnYW1lc3RhcnRfZXZlbnRcIilcclxuICAgIH0pO1xyXG4gICAgZGR6RGF0YS5nYW1lU3RhdGUgPSBkZHpDb25zdGFudHMuZ2FtZVN0YXRlLkdBTUVTVEFSVFxyXG4gIH0sXHJcbiAgLy9zZWF0X2luZGV46Ieq5bex5Zyo5oi/6Ze055qE5L2N572uaWRcclxuICAvLyBzZXRQbGF5ZXJTZWF0UG9zKHNlYXRfaW5kZXgpIHtcclxuICAvLyAgIGlmIChzZWF0X2luZGV4IDwgMSB8fCBzZWF0X2luZGV4ID4gMykge1xyXG4gIC8vICAgICBjb25zb2xlLmxvZyhcInNlYXRfaW5kZXggZXJyb3JcIiArIHNlYXRfaW5kZXgpXHJcbiAgLy8gICAgIHJldHVyblxyXG4gIC8vICAgfVxyXG5cclxuICAvLyAgIGNvbnNvbGUubG9nKFwic2V0UGxheWVyU2VhdFBvcyBzZWF0X2luZGV4OlwiICsgc2VhdF9pbmRleClcclxuXHJcbiAgLy8gICAvL+eVjOmdouS9jee9rui9rOWMluaIkOmAu+i+keS9jee9rlxyXG4gIC8vICAgc3dpdGNoIChzZWF0X2luZGV4KSB7XHJcbiAgLy8gICAgIGNhc2UgMTpcclxuICAvLyAgICAgICB0aGlzLnBsYXllcmRhdGFfbGlzdF9wb3NbMV0gPSAwXHJcbiAgLy8gICAgICAgdGhpcy5wbGF5ZXJkYXRhX2xpc3RfcG9zWzJdID0gMVxyXG4gIC8vICAgICAgIHRoaXMucGxheWVyZGF0YV9saXN0X3Bvc1szXSA9IDJcclxuICAvLyAgICAgICBicmVha1xyXG4gIC8vICAgICBjYXNlIDI6XHJcblxyXG5cclxuICAvLyAgICAgICB0aGlzLnBsYXllcmRhdGFfbGlzdF9wb3NbMl0gPSAwXHJcbiAgLy8gICAgICAgdGhpcy5wbGF5ZXJkYXRhX2xpc3RfcG9zWzNdID0gMVxyXG4gIC8vICAgICAgIHRoaXMucGxheWVyZGF0YV9saXN0X3Bvc1sxXSA9IDJcclxuICAvLyAgICAgICBicmVha1xyXG4gIC8vICAgICBjYXNlIDM6XHJcbiAgLy8gICAgICAgdGhpcy5wbGF5ZXJkYXRhX2xpc3RfcG9zWzNdID0gMFxyXG4gIC8vICAgICAgIHRoaXMucGxheWVyZGF0YV9saXN0X3Bvc1sxXSA9IDFcclxuICAvLyAgICAgICB0aGlzLnBsYXllcmRhdGFfbGlzdF9wb3NbMl0gPSAyXHJcbiAgLy8gICAgICAgYnJlYWtcclxuICAvLyAgICAgZGVmYXVsdDpcclxuICAvLyAgICAgICBicmVha1xyXG4gIC8vICAgfVxyXG4gIC8vIH0sXHJcbiAgLy8g5re75Yqg546p5a626IqC54K5XHJcbiAgYWRkUGxheWVyTm9kZShwbGF5ZXJfZGF0YSkge1xyXG4gICAgdmFyIGluZGV4ID0gcGxheWVyX2RhdGEuc2VhdGluZGV4XHJcbiAgICB2YXIgcGxheWVybm9kZV9pbnN0ID0gY2MuaW5zdGFudGlhdGUodGhpcy5wbGF5ZXJfbm9kZV9wcmVmYWJzKVxyXG4gICAgcGxheWVybm9kZV9pbnN0LnBhcmVudCA9IHRoaXMucGxheWVyc19zZWF0X3Bvcy5jaGlsZHJlbltpbmRleF1cclxuICAgIC8vIHBsYXllcm5vZGVfaW5zdC5wYXJlbnQgPSB0aGlzLm5vZGVcclxuICAgIC8v5Yib5bu655qE6IqC54K55a2Y5YKo5ZyoZ2FtZXNjZW5l55qE5YiX6KGo5LitXHJcbiAgICB0aGlzLnBsYXllck5vZGVMaXN0LnB1c2gocGxheWVybm9kZV9pbnN0KVxyXG5cclxuICAgIC8v546p5a625Zyocm9vbemHjOeahOS9jee9rue0ouW8lSjpgLvovpHkvY3nva4pXHJcbiAgICAvLyBwbGF5ZXJub2RlX2luc3QucG9zaXRpb24gPSB0aGlzLnBsYXllcnNfc2VhdF9wb3MuY2hpbGRyZW5baW5kZXhdLnBvc2l0aW9uXHJcbiAgICBwbGF5ZXJub2RlX2luc3QuZ2V0Q29tcG9uZW50KFwicGxheWVyX25vZGVcIikuaW5pdF9kYXRhKHBsYXllcl9kYXRhLCBpbmRleClcclxuXHJcbiAgICAvLyBteWdsb2JhbC5wbGF5ZXJEYXRhLnBsYXllckxpc3RbaW5kZXhdID0gcGxheWVyX2RhdGFcclxuICB9LFxyXG5cclxuICAvKlxyXG4gICAvL+mAmui/h3VzZXJJZOiOt+WPlueUqOaIt+WHuueJjOaUvuWcqGdhbWVzY2VuZOeahOS9jee9riBcclxuICAg5YGa5rOV77ya5YWI5pS+M+S4quiKgueCueWcqGdhbWVhY2VuZeeahOWcuuaZr+S4rSBjYXJkc291dHpvbmUoMDEyKVxyXG4gICovXHJcbiAgZ2V0VXNlck91dENhcmRQb3NCeUFjY291bnQodXNlcklkKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGxheWVyTm9kZUxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIG5vZGUgPSB0aGlzLnBsYXllck5vZGVMaXN0W2ldXHJcbiAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgLy/ojrflj5boioLngrnnu5HlrprnmoTnu4Tku7ZcclxuICAgICAgICB2YXIgbm9kZV9zY3JpcHQgPSBub2RlLmdldENvbXBvbmVudChcInBsYXllcl9ub2RlXCIpXHJcbiAgICAgICAgLy/lpoLmnpxhY2NvdW50aWTlkoxwbGF5ZXJfbm9kZeiKgueCuee7keWumueahGFjY291bnRpZOebuOWQjFxyXG4gICAgICAgIC8v5o6l6I635Y+WcGxheWVyX25vZGXnmoTlrZDoioLngrlcclxuICAgICAgICBpZiAobm9kZV9zY3JpcHQudXNlcklkID09PSB1c2VySWQpIHtcclxuICAgICAgICAgIHZhciBzZWF0X25vZGUgPSB0aGlzLnBsYXllcnNfc2VhdF9wb3MuY2hpbGRyZW5bbm9kZV9zY3JpcHQuc2VhdF9pbmRleF0uZ2V0Q2hpbGRCeU5hbWUoJ2NhcmRzb3V0em9uZScpXHJcbiAgICAgICAgICByZXR1cm4gc2VhdF9ub2RlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbFxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICAqIEBkZXNjcmlwdGlvbiDpgJrov4d1c2VySWTojrflj5bnjqnlrrblpLTlg4/oioLngrkgXHJcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSB1c2VySWQgXHJcbiAgICAqIEByZXR1cm5zIHtjYy5Ob2RlfSDnjqnlrrboioLngrlcclxuICAgICovXHJcbiAgZ2V0VXNlck5vZGVCeUFjY291bnQodXNlcklkKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVyTm9kZUxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3Qgbm9kZSA9IHRoaXMucGxheWVyTm9kZUxpc3RbaV1cclxuICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAvL+iOt+WPluiKgueCuee7keWumueahOe7hOS7tlxyXG4gICAgICAgIGNvbnN0IHBsYXllck5vZGUgPSBub2RlLmdldENvbXBvbmVudChcInBsYXllcl9ub2RlXCIpXHJcbiAgICAgICAgaWYgKHBsYXllck5vZGUudXNlcklkID09PSB1c2VySWQpIHJldHVybiBwbGF5ZXJOb2RlXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsXHJcbiAgfVxyXG59KTtcclxuIl19