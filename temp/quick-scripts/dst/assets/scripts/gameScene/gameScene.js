
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
    _selfData: null,
    _root1: null,
    _root2: null
  },
  onLoad: function onLoad() {
    console.log(ddzData.gameState);

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
    this.di_label.string = "底：" + bottom; // this.roomstate = ddzConstants.gameState.ROOM_INVALID

    this.btn_ready.active = ddzData.gameState < ddzConstants.gameState.GAMESTART; // 准备按钮

    if (isopen_sound) {
      cc.audioEngine.stopAll(); // cc.audioEngine.play(this.bjMusic, true)
    }

    this._selfData = {
      seatindex: 0,
      "accountid": "2117835",
      userName: _mygolbal["default"].playerData.userName,
      "avatarUrl": "avatar_1",
      "goldcount": 1000
    };
    this._root1 = {
      seatindex: 1,
      "accountid": "2117836",
      userName: "tiny1",
      "avatarUrl": "avatar_2",
      "goldcount": 1000
    };
    this._root2 = {
      seatindex: 2,
      "accountid": "2117837",
      userName: "tiny2",
      "avatarUrl": "avatar_3",
      "goldcount": 1000
    };
    this.addPlayerNode(this._selfData);
    this.addPlayerNode(this._root1);
    this.addPlayerNode(this._root2); //监听，给其他玩家发牌(内部事件)

    this.node.on("pushcard_other_event", function () {
      console.log('其他玩家发牌');

      for (var i = 0; i < this.playerNodeList.length; i++) {
        var node = this.playerNodeList[i];

        if (node) {
          //给playernode节点发送事件
          node.emit("push_card_event");
        }
      }
    }.bind(this));
    return; //监听房间状态改变事件

    _mygolbal["default"].socket.onRoomChangeState(function (data) {
      //回调的函数参数是进入房间用户消息
      console.log("onRoomChangeState:" + data);
      this.roomstate = data;
    }.bind(this)); //


    this.node.on("canrob_event", function (event) {
      console.log("gamescene canrob_event:" + event); //通知给playernode子节点

      for (var i = 0; i < this.playerNodeList.length; i++) {
        var node = this.playerNodeList[i];

        if (node) {
          //给playernode节点发送事件
          node.emit("playernode_canrob_event", event);
        }
      }
    }.bind(this));
    this.node.on("choose_card_event", function (event) {
      console.log("--------choose_card_event-----------");
      var gameui_node = this.node.getChildByName("gameingUI");

      if (gameui_node == null) {
        console.log("get childer name gameingUI");
        return;
      }

      gameui_node.emit("choose_card_event", event);
    }.bind(this));
    this.node.on("unchoose_card_event", function (event) {
      console.log("--------unchoose_card_event-----------");
      var gameui_node = this.node.getChildByName("gameingUI");

      if (gameui_node == null) {
        console.log("get childer name gameingUI");
        return;
      }

      gameui_node.emit("unchoose_card_event", event);
    }.bind(this)); //监听给玩家添加三张底牌
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


    _mygolbal["default"].socket.onRobState(function (event) {
      console.log("-----onRobState" + JSON.stringify(event)); //onRobState{"accountid":"2162866","state":1}

      for (var i = 0; i < this.playerNodeList.length; i++) {
        var node = this.playerNodeList[i];

        if (node) {
          //给playernode节点发送事件
          node.emit("playernode_rob_state_event", event);
        }
      }
    }.bind(this)); //注册监听服务器确定地主消息


    _mygolbal["default"].socket.onChangeMaster(function (event) {
      console.log("onChangeMaster" + event); //保存一下地主id

      _mygolbal["default"].playerData.master_accountid = event;

      for (var i = 0; i < this.playerNodeList.length; i++) {
        var node = this.playerNodeList[i];

        if (node) {
          //给playernode节点发送事件
          node.emit("playernode_changemaster_event", event);
        }
      }
    }.bind(this)); //注册监听服务器显示底牌消息


    _mygolbal["default"].socket.onShowBottomCard(function (event) {
      console.log("onShowBottomCard---------" + event);
      var gameui_node = this.node.getChildByName("gameingUI");

      if (gameui_node == null) {
        console.log("get childer name gameingUI");
        return;
      }

      gameui_node.emit("show_bottom_card_event", event);
    }.bind(this));
  },
  start: function start() {},
  onDestroy: function onDestroy() {
    if (!CC_EDITOR) {
      ddzData.gameStateNotify.removeListener(this.gameStateHandler, this);
    }
  },
  gameStateHandler: function gameStateHandler(value) {
    console.log(value);
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
    this.btn_ready.active = false; // this.playerNodeList[0].emit("player_ready_notify")

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
    var playernode_inst = cc.instantiate(this.player_node_prefabs);
    playernode_inst.parent = this.node; //创建的节点存储在gamescene的列表中

    this.playerNodeList.push(playernode_inst); //玩家在room里的位置索引(逻辑位置)

    var index = player_data.seatindex;
    playernode_inst.position = this.players_seat_pos.children[index].position;
    playernode_inst.getComponent("player_node").init_data(player_data, index); // myglobal.playerData.playerList[index] = player_data
  },

  /*
   //通过accountid获取用户出牌放在gamescend的位置 
   做法：先放3个节点在gameacene的场景中cardsoutzone(012)
         
  */
  getUserOutCardPosByAccount: function getUserOutCardPosByAccount(accountid) {
    console.log("getUserOutCardPosByAccount accountid:" + accountid);

    for (var i = 0; i < this.playerNodeList.length; i++) {
      var node = this.playerNodeList[i];

      if (node) {
        //获取节点绑定的组件
        var node_script = node.getComponent("player_node"); //如果accountid和player_node节点绑定的accountid相同
        //接获取player_node的子节点

        if (node_script.accountid === accountid) {
          var seat_node = this.players_seat_pos.children[node_script.seat_index];
          var index_name = "cardsoutzone" + node_script.seat_index; //console.log("getUserOutCardPosByAccount index_name:"+index_name)

          var out_card_node = seat_node.getChildByName(index_name); //console.log("OutZone:"+ out_card_node.name)

          return out_card_node;
        }
      }
    }

    return null;
  } // update (dt) {},

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxnYW1lU2NlbmUvLi5cXC4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHNjcmlwdHNcXGdhbWVTY2VuZS9hc3NldHNcXHNjcmlwdHNcXGdhbWVTY2VuZVxcZ2FtZVNjZW5lLmpzIl0sIm5hbWVzIjpbImRkekNvbnN0YW50cyIsInJlcXVpcmUiLCJkZHpEYXRhIiwiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJiak11c2ljIiwidHlwZSIsIkF1ZGlvQ2xpcCIsImRpX2xhYmVsIiwiTGFiZWwiLCJiZWlzaHVfbGFiZWwiLCJyb29taWRfbGFiZWwiLCJwbGF5ZXJfbm9kZV9wcmVmYWJzIiwiUHJlZmFiIiwiYnRuX3JlYWR5IiwiTm9kZSIsInBsYXllcnNfc2VhdF9wb3MiLCJfc2VsZkRhdGEiLCJfcm9vdDEiLCJfcm9vdDIiLCJvbkxvYWQiLCJjb25zb2xlIiwibG9nIiwiZ2FtZVN0YXRlIiwiQ0NfRURJVE9SIiwiZ2FtZVN0YXRlTm90aWZ5IiwiYWRkTGlzdGVuZXIiLCJnYW1lU3RhdGVIYW5kbGVyIiwicGxheWVyTm9kZUxpc3QiLCJyb29tSWQiLCJteWdsb2JhbCIsInBsYXllckRhdGEiLCJzcGxpdCIsInJhdGUiLCJib3R0b20iLCJzdHJpbmciLCJkZWZpbmVzIiwicm9vbU5hbWVzIiwiYWN0aXZlIiwiR0FNRVNUQVJUIiwiaXNvcGVuX3NvdW5kIiwiYXVkaW9FbmdpbmUiLCJzdG9wQWxsIiwic2VhdGluZGV4IiwidXNlck5hbWUiLCJhZGRQbGF5ZXJOb2RlIiwibm9kZSIsIm9uIiwiaSIsImxlbmd0aCIsImVtaXQiLCJiaW5kIiwic29ja2V0Iiwib25Sb29tQ2hhbmdlU3RhdGUiLCJkYXRhIiwicm9vbXN0YXRlIiwiZXZlbnQiLCJnYW1ldWlfbm9kZSIsImdldENoaWxkQnlOYW1lIiwicmVxdWVzdF9lbnRlcl9yb29tIiwiZXJyIiwicmVzdWx0IiwiSlNPTiIsInN0cmluZ2lmeSIsInNlYXRpZCIsInBsYXllcmRhdGFfbGlzdF9wb3MiLCJzZXRQbGF5ZXJTZWF0UG9zIiwicGxheWVyZGF0YV9saXN0IiwicGxheWVyZGF0YSIsImhvdXNlbWFuYWdlaWQiLCJnYW1lYmVmb3JlX25vZGUiLCJvblBsYXllckpvaW5Sb29tIiwiam9pbl9wbGF5ZXJkYXRhIiwib25QbGF5ZXJSZWFkeSIsIm9uR2FtZVN0YXJ0IiwiZ2FtZWJlZm9yZVVJIiwib25Sb2JTdGF0ZSIsIm9uQ2hhbmdlTWFzdGVyIiwibWFzdGVyX2FjY291bnRpZCIsIm9uU2hvd0JvdHRvbUNhcmQiLCJzdGFydCIsIm9uRGVzdHJveSIsInJlbW92ZUxpc3RlbmVyIiwidmFsdWUiLCJvbkdvYmFjayIsIklOVkFMSUQiLCJzeXMiLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiZGlyZWN0b3IiLCJsb2FkU2NlbmUiLCJvbkJ0blJlYWRleSIsImZvckVhY2giLCJwbGF5ZXJfZGF0YSIsInBsYXllcm5vZGVfaW5zdCIsImluc3RhbnRpYXRlIiwicGFyZW50IiwicHVzaCIsImluZGV4IiwicG9zaXRpb24iLCJjaGlsZHJlbiIsImdldENvbXBvbmVudCIsImluaXRfZGF0YSIsImdldFVzZXJPdXRDYXJkUG9zQnlBY2NvdW50IiwiYWNjb3VudGlkIiwibm9kZV9zY3JpcHQiLCJzZWF0X25vZGUiLCJzZWF0X2luZGV4IiwiaW5kZXhfbmFtZSIsIm91dF9jYXJkX25vZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztBQUNBLElBQU1BLFlBQVksR0FBR0MsT0FBTyxDQUFDLGNBQUQsQ0FBNUI7O0FBQ0EsSUFBTUMsT0FBTyxHQUFHRCxPQUFPLENBQUMsU0FBRCxDQUF2Qjs7QUFFQUUsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDUCxhQUFTRCxFQUFFLENBQUNFLFNBREw7QUFFUEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLElBQUFBLE9BQU8sRUFBRTtBQUNQQyxNQUFBQSxJQUFJLEVBQUVMLEVB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c0JvRixRQUF0QixDQUErQkYsS0FBL0IsRUFBc0NDLFFBQWpFO0FBQ0FMLElBQUFBLGVBQWUsQ0FBQ08sWUFBaEIsQ0FBNkIsYUFBN0IsRUFBNENDLFNBQTVDLENBQXNEVCxXQUF0RCxFQUFtRUssS0FBbkUsRUFUeUIsQ0FXekI7QUFDRCxHQXhSTTs7QUEwUlA7Ozs7O0FBS0FLLEVBQUFBLDBCQS9STyxzQ0ErUm9CQyxTQS9ScEIsRUErUitCO0FBQ3BDbkYsSUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksMENBQTBDa0YsU0FBdEQ7O0FBQ0EsU0FBSyxJQUFJeEQsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxLQUFLcEIsY0FBTCxDQUFvQnFCLE1BQXhDLEVBQWdERCxDQUFDLEVBQWpELEVBQXFEO0FBQ25ELFVBQUlGLElBQUksR0FBRyxLQUFLbEIsY0FBTCxDQUFvQm9CLENBQXBCLENBQVg7O0FBQ0EsVUFBSUYsSUFBSixFQUFVO0FBQ1I7QUFDQSxZQUFJMkQsV0FBVyxHQUFHM0QsSUFBSSxDQUFDdUQsWUFBTCxDQUFrQixhQUFsQixDQUFsQixDQUZRLENBR1I7QUFDQTs7QUFDQSxZQUFJSSxXQUFXLENBQUNELFNBQVosS0FBMEJBLFNBQTlCLEVBQXlDO0FBQ3ZDLGNBQUlFLFNBQVMsR0FBRyxLQUFLMUYsZ0JBQUwsQ0FBc0JvRixRQUF0QixDQUErQkssV0FBVyxDQUFDRSxVQUEzQyxDQUFoQjtBQUNBLGNBQUlDLFVBQVUsR0FBRyxpQkFBaUJILFdBQVcsQ0FBQ0UsVUFBOUMsQ0FGdUMsQ0FHdkM7O0FBQ0EsY0FBSUUsYUFBYSxHQUFHSCxTQUFTLENBQUNoRCxjQUFWLENBQXlCa0QsVUFBekIsQ0FBcEIsQ0FKdUMsQ0FLdkM7O0FBQ0EsaUJBQU9DLGFBQVA7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQsV0FBTyxJQUFQO0FBQ0QsR0FwVE0sQ0FxVFA7O0FBclRPLENBQVQiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHNjcmlwdHNcXGdhbWVTY2VuZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBteWdsb2JhbCBmcm9tIFwiLi4vbXlnb2xiYWwuanNcIlxyXG5jb25zdCBkZHpDb25zdGFudHMgPSByZXF1aXJlKCdkZHpDb25zdGFudHMnKVxyXG5jb25zdCBkZHpEYXRhID0gcmVxdWlyZSgnZGR6RGF0YScpXHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG4gIHByb3BlcnRpZXM6IHtcclxuICAgIGJqTXVzaWM6IHtcclxuICAgICAgdHlwZTogY2MuQXVkaW9DbGlwLCAvLyDog4zmma/pn7PkuZBcclxuICAgICAgZGVmYXVsdDogbnVsbCwgICAgIC8vIG9iamVjdCdzIGRlZmF1bHQgdmFsdWUgaXMgbnVsbFxyXG4gICAgfSwgXHJcbiAgICBkaV9sYWJlbDogY2MuTGFiZWwsXHJcbiAgICBiZWlzaHVfbGFiZWw6IGNjLkxhYmVsLFxyXG4gICAgcm9vbWlkX2xhYmVsOiBjYy5MYWJlbCxcclxuICAgIHBsYXllcl9ub2RlX3ByZWZhYnM6IGNjLlByZWZhYixcclxuICAgIGJ0bl9yZWFkeTogY2MuTm9kZSwgLy8g5YeG5aSH5oyJ6ZKuXHJcbiAgICAvL+e7keWumueOqeWutuW6p+S9jSzkuIvpnaLmnIkz5Liq5a2Q6IqC54K5XHJcbiAgICBwbGF5ZXJzX3NlYXRfcG9zOiBjYy5Ob2RlLFxyXG4gICAgX3NlbGZEYXRhOiBudWxsLFxyXG4gICAgX3Jvb3QxOiBudWxsLFxyXG4gICAgX3Jvb3QyOiBudWxsLFxyXG4gIH0sXHJcbiAgb25Mb2FkKCkge1xyXG4gICAgY29uc29sZS5sb2coZGR6RGF0YS5nYW1lU3RhdGUpXHJcbiAgICBpZighQ0NfRURJVE9SKSB7XHJcbiAgICAgIGRkekRhdGEuZ2FtZVN0YXRlTm90aWZ5LmFkZExpc3RlbmVyKHRoaXMuZ2FtZVN0YXRlSGFuZGxlciwgdGhpcylcclxuICAgIH1cclxuICAgIHRoaXMucGxheWVyTm9kZUxpc3QgPSBbXVxyXG4gICAgY29uc3QgeyByb29tSWQgfT0gbXlnbG9iYWwucGxheWVyRGF0YVxyXG4gICAgY29uc3QgW3JhdGUsIGJvdHRvbV0gPSByb29tSWQuc3BsaXQoJ18nKVxyXG4gICAgbXlnbG9iYWwucGxheWVyRGF0YS5yYXRlID0gcmF0ZVxyXG4gICAgbXlnbG9iYWwucGxheWVyRGF0YS5ib3R0b20gPSBib3R0b21cclxuICAgIFxyXG4gICAgdGhpcy5yb29taWRfbGFiZWwuc3RyaW5nID0gZGVmaW5lcy5yb29tTmFtZXNbcmF0ZSAtIDFdXHJcbiAgICB0aGlzLmJlaXNodV9sYWJlbC5zdHJpbmcgPSBcIuWAjeaVsO+8mlwiICsgcmF0ZVxyXG4gICAgdGhpcy5kaV9sYWJlbC5zdHJpbmcgPSBcIuW6le+8mlwiICsgYm90dG9tXHJcbiAgICBcclxuICAgIC8vIHRoaXMucm9vbXN0YXRlID0gZGR6Q29uc3RhbnRzLmdhbWVTdGF0ZS5ST09NX0lOVkFMSURcclxuICAgIHRoaXMuYnRuX3JlYWR5LmFjdGl2ZSA9IGRkekRhdGEuZ2FtZVN0YXRlIDwgZGR6Q29uc3RhbnRzLmdhbWVTdGF0ZS5HQU1FU1RBUlQgLy8g5YeG5aSH5oyJ6ZKuXHJcbiAgICBpZiAoaXNvcGVuX3NvdW5kKSB7XHJcbiAgICAgIGNjLmF1ZGlvRW5naW5lLnN0b3BBbGwoKVxyXG4gICAgICAvLyBjYy5hdWRpb0VuZ2luZS5wbGF5KHRoaXMuYmpNdXNpYywgdHJ1ZSlcclxuICAgIH1cclxuICAgIHRoaXMuX3NlbGZEYXRhID0ge3NlYXRpbmRleDogMCwgXCJhY2NvdW50aWRcIjpcIjIxMTc4MzVcIiwgdXNlck5hbWU6IG15Z2xvYmFsLnBsYXllckRhdGEudXNlck5hbWUsXCJhdmF0YXJVcmxcIjpcImF2YXRhcl8xXCIsXCJnb2xkY291bnRcIjoxMDAwfVxyXG4gICAgdGhpcy5fcm9vdDEgPSB7c2VhdGluZGV4OiAxLCBcImFjY291bnRpZFwiOlwiMjExNzgzNlwiLCB1c2VyTmFtZTogXCJ0aW55MVwiLFwiYXZhdGFyVXJsXCI6XCJhdmF0YXJfMlwiLFwiZ29sZGNvdW50XCI6MTAwMH1cclxuICAgIHRoaXMuX3Jvb3QyID0ge3NlYXRpbmRleDogMiwgXCJhY2NvdW50aWRcIjpcIjIxMTc4MzdcIiwgdXNlck5hbWU6IFwidGlueTJcIixcImF2YXRhclVybFwiOlwiYXZhdGFyXzNcIixcImdvbGRjb3VudFwiOjEwMDB9XHJcbiAgICB0aGlzLmFkZFBsYXllck5vZGUodGhpcy5fc2VsZkRhdGEpXHJcbiAgICB0aGlzLmFkZFBsYXllck5vZGUodGhpcy5fcm9vdDEpXHJcbiAgICB0aGlzLmFkZFBsYXllck5vZGUodGhpcy5fcm9vdDIpXHJcbiAgICAvL+ebkeWQrO+8jOe7meWFtuS7lueOqeWutuWPkeeJjCjlhoXpg6jkuovku7YpXHJcbiAgICB0aGlzLm5vZGUub24oXCJwdXNoY2FyZF9vdGhlcl9ldmVudFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCflhbbku5bnjqnlrrblj5HniYwnKVxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVyTm9kZUxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5wbGF5ZXJOb2RlTGlzdFtpXVxyXG4gICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAvL+e7mXBsYXllcm5vZGXoioLngrnlj5HpgIHkuovku7ZcclxuICAgICAgICAgIG5vZGUuZW1pdChcInB1c2hfY2FyZF9ldmVudFwiKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfS5iaW5kKHRoaXMpKVxyXG4gICAgXHJcbiAgICByZXR1cm5cclxuICAgIC8v55uR5ZCs5oi/6Ze054q25oCB5pS55Y+Y5LqL5Lu2XHJcbiAgICBteWdsb2JhbC5zb2NrZXQub25Sb29tQ2hhbmdlU3RhdGUoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgLy/lm57osIPnmoTlh73mlbDlj4LmlbDmmK/ov5vlhaXmiL/pl7TnlKjmiLfmtojmga9cclxuICAgICAgY29uc29sZS5sb2coXCJvblJvb21DaGFuZ2VTdGF0ZTpcIiArIGRhdGEpXHJcbiAgICAgIHRoaXMucm9vbXN0YXRlID0gZGF0YVxyXG4gICAgfS5iaW5kKHRoaXMpKVxyXG4gICAgLy9cclxuICAgIHRoaXMubm9kZS5vbihcImNhbnJvYl9ldmVudFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJnYW1lc2NlbmUgY2Fucm9iX2V2ZW50OlwiICsgZXZlbnQpXHJcbiAgICAgIC8v6YCa55+l57uZcGxheWVybm9kZeWtkOiKgueCuVxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGxheWVyTm9kZUxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgbm9kZSA9IHRoaXMucGxheWVyTm9kZUxpc3RbaV1cclxuICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgLy/nu5lwbGF5ZXJub2Rl6IqC54K55Y+R6YCB5LqL5Lu2XHJcbiAgICAgICAgICBub2RlLmVtaXQoXCJwbGF5ZXJub2RlX2NhbnJvYl9ldmVudFwiLCBldmVudClcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0uYmluZCh0aGlzKSlcclxuXHJcbiAgICB0aGlzLm5vZGUub24oXCJjaG9vc2VfY2FyZF9ldmVudFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgY29uc29sZS5sb2coXCItLS0tLS0tLWNob29zZV9jYXJkX2V2ZW50LS0tLS0tLS0tLS1cIilcclxuICAgICAgdmFyIGdhbWV1aV9ub2RlID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKFwiZ2FtZWluZ1VJXCIpXHJcbiAgICAgIGlmIChnYW1ldWlfbm9kZSA9PSBudWxsKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJnZXQgY2hpbGRlciBuYW1lIGdhbWVpbmdVSVwiKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcbiAgICAgIGdhbWV1aV9ub2RlLmVtaXQoXCJjaG9vc2VfY2FyZF9ldmVudFwiLCBldmVudClcclxuXHJcbiAgICB9LmJpbmQodGhpcykpXHJcblxyXG4gICAgdGhpcy5ub2RlLm9uKFwidW5jaG9vc2VfY2FyZF9ldmVudFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgY29uc29sZS5sb2coXCItLS0tLS0tLXVuY2hvb3NlX2NhcmRfZXZlbnQtLS0tLS0tLS0tLVwiKVxyXG4gICAgICB2YXIgZ2FtZXVpX25vZGUgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJnYW1laW5nVUlcIilcclxuICAgICAgaWYgKGdhbWV1aV9ub2RlID09IG51bGwpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImdldCBjaGlsZGVyIG5hbWUgZ2FtZWluZ1VJXCIpXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuICAgICAgZ2FtZXVpX25vZGUuZW1pdChcInVuY2hvb3NlX2NhcmRfZXZlbnRcIiwgZXZlbnQpXHJcbiAgICB9LmJpbmQodGhpcykpXHJcbiAgICAvL+ebkeWQrOe7meeOqeWutua3u+WKoOS4ieW8oOW6leeJjFxyXG4gICAgLy8gdGhpcy5ub2RlLm9uKFwiYWRkX3RocmVlX2NhcmRcIixmdW5jdGlvbihldmVudCl7XHJcbiAgICAvLyAgICAgY29uc29sZS5sb2coXCJhZGRfdGhyZWVfY2FyZDpcIitldmVudClcclxuICAgIC8vICAgICBmb3IodmFyIGk9MDtpPHRoaXMucGxheWVyTm9kZUxpc3QubGVuZ3RoO2krKyl7XHJcbiAgICAvLyAgICAgICAgIHZhciBub2RlID0gdGhpcy5wbGF5ZXJOb2RlTGlzdFtpXVxyXG4gICAgLy8gICAgICAgICBpZihub2RlKXtcclxuICAgIC8vICAgICAgICAgICAgIC8v57uZcGxheWVybm9kZeiKgueCueWPkemAgeS6i+S7tlxyXG4gICAgLy8gICAgICAgICAgICAgbm9kZS5lbWl0KFwicGxheWVybm9kZV9hZGRfdGhyZWVfY2FyZFwiLGV2ZW50KVxyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfS5iaW5kKHRoaXMpKVxyXG5cclxuICAgIG15Z2xvYmFsLnNvY2tldC5yZXF1ZXN0X2VudGVyX3Jvb20oe30sIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcImVudGVyX3Jvb21fcmVzcFwiICsgSlNPTi5zdHJpbmdpZnkocmVzdWx0KSlcclxuICAgICAgaWYgKGVyciAhPSAwKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJlbnRlcl9yb29tX3Jlc3AgZXJyOlwiICsgZXJyKVxyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAvL2VudGVyX3Jvb23miJDlip9cclxuICAgICAgICAvL25vdGlmeSA9e1wic2VhdGlkXCI6MSxcInBsYXllcmRhdGFcIjpbe1wiYWNjb3VudGlkXCI6XCIyMTE3ODM2XCIsXCJ1c2VyTmFtZVwiOlwidGlueTU0M1wiLFwiYXZhdGFyVXJsXCI6XCJodHRwOi8veHh4XCIsXCJnb2xkY291bnRcIjoxMDAwfV19XHJcbiAgICAgICAgdmFyIHNlYXRpZCA9IHJlc3VsdC5zZWF0aW5kZXggLy/oh6rlt7HlnKjmiL/pl7Tph4znmoRzZWF0aWRcclxuICAgICAgICB0aGlzLnBsYXllcmRhdGFfbGlzdF9wb3MgPSBbXSAgLy8z5Liq55So5oi35Yib5bu65LiA5Liq56m655So5oi35YiX6KGoXHJcbiAgICAgICAgdGhpcy5zZXRQbGF5ZXJTZWF0UG9zKHNlYXRpZClcclxuXHJcbiAgICAgICAgdmFyIHBsYXllcmRhdGFfbGlzdCA9IHJlc3VsdC5wbGF5ZXJkYXRhXHJcbiAgICAgICAgdmFyIHJvb21JZCA9IHJlc3VsdC5yb29tSWRcclxuICAgICAgICB0aGlzLnJvb21pZF9sYWJlbC5zdHJpbmcgPSBcIuaIv+mXtOWPtzpcIiArIHJvb21JZFxyXG4gICAgICAgIG15Z2xvYmFsLnBsYXllckRhdGEuaG91c2VtYW5hZ2VpZCA9IHJlc3VsdC5ob3VzZW1hbmFnZWlkXHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGxheWVyZGF0YV9saXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAvL2NvbnNvbC5sb2coXCJ0aGlzLS0tLVwiK3RoaXMpXHJcbiAgICAgICAgICB0aGlzLmFkZFBsYXllck5vZGUocGxheWVyZGF0YV9saXN0W2ldKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcbiAgICAgIH1cclxuICAgICAgdmFyIGdhbWViZWZvcmVfbm9kZSA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcImdhbWViZWZvcmVVSVwiKVxyXG4gICAgICBnYW1lYmVmb3JlX25vZGUuZW1pdChcImluaXRcIilcclxuICAgIH0uYmluZCh0aGlzKSlcclxuXHJcbiAgICAvL+WcqOi/m+WFpeaIv+mXtOWQju+8jOazqOWGjOWFtuS7lueOqeWutui/m+WFpeaIv+mXtOeahOS6i+S7tlxyXG4gICAgbXlnbG9iYWwuc29ja2V0Lm9uUGxheWVySm9pblJvb20oZnVuY3Rpb24gKGpvaW5fcGxheWVyZGF0YSkge1xyXG4gICAgICAvL+Wbnuiwg+eahOWHveaVsOWPguaVsOaYr+i/m+WFpeaIv+mXtOeUqOaIt+a2iOaBr1xyXG4gICAgICBjb25zb2xlLmxvZyhcIm9uUGxheWVySm9pblJvb206XCIgKyBKU09OLnN0cmluZ2lmeShqb2luX3BsYXllcmRhdGEpKVxyXG4gICAgICB0aGlzLmFkZFBsYXllck5vZGUoam9pbl9wbGF5ZXJkYXRhKVxyXG4gICAgfS5iaW5kKHRoaXMpKVxyXG5cclxuICAgIC8v5Zue6LCD5Y+C5pWw5piv5Y+R6YCB5YeG5aSH5raI5oGv55qEYWNjb3VudGlkXHJcbiAgICBteWdsb2JhbC5zb2NrZXQub25QbGF5ZXJSZWFkeShmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLS1vblBsYXllclJlYWR5OlwiICsgZGF0YSlcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBsYXllck5vZGVMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLnBsYXllck5vZGVMaXN0W2ldXHJcbiAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgIG5vZGUuZW1pdChcInBsYXllcl9yZWFkeV9ub3RpZnlcIiwgZGF0YSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0uYmluZCh0aGlzKSlcclxuXHJcbiAgICBteWdsb2JhbC5zb2NrZXQub25HYW1lU3RhcnQoZnVuY3Rpb24gKCkge1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGxheWVyTm9kZUxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgbm9kZSA9IHRoaXMucGxheWVyTm9kZUxpc3RbaV1cclxuICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgbm9kZS5lbWl0KFwiZ2FtZXN0YXJ0X2V2ZW50XCIpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvL+makOiXj2dhbWViZWZvcmVVSeiKgueCuVxyXG4gICAgICB2YXIgZ2FtZWJlZm9yZVVJID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKFwiZ2FtZWJlZm9yZVVJXCIpXHJcbiAgICAgIGlmIChnYW1lYmVmb3JlVUkpIHtcclxuICAgICAgICBnYW1lYmVmb3JlVUkuYWN0aXZlID0gZmFsc2VcclxuICAgICAgfVxyXG4gICAgfS5iaW5kKHRoaXMpKVxyXG5cclxuICAgIC8v55uR5ZCs5pyN5Yqh5Zmo546p5a625oqi5Zyw5Li75raI5oGvXHJcbiAgICBteWdsb2JhbC5zb2NrZXQub25Sb2JTdGF0ZShmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgY29uc29sZS5sb2coXCItLS0tLW9uUm9iU3RhdGVcIiArIEpTT04uc3RyaW5naWZ5KGV2ZW50KSlcclxuICAgICAgLy9vblJvYlN0YXRle1wiYWNjb3VudGlkXCI6XCIyMTYyODY2XCIsXCJzdGF0ZVwiOjF9XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJOb2RlTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBub2RlID0gdGhpcy5wbGF5ZXJOb2RlTGlzdFtpXVxyXG4gICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAvL+e7mXBsYXllcm5vZGXoioLngrnlj5HpgIHkuovku7ZcclxuICAgICAgICAgIG5vZGUuZW1pdChcInBsYXllcm5vZGVfcm9iX3N0YXRlX2V2ZW50XCIsIGV2ZW50KVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfS5iaW5kKHRoaXMpKVxyXG5cclxuICAgIC8v5rOo5YaM55uR5ZCs5pyN5Yqh5Zmo56Gu5a6a5Zyw5Li75raI5oGvXHJcbiAgICBteWdsb2JhbC5zb2NrZXQub25DaGFuZ2VNYXN0ZXIoZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwib25DaGFuZ2VNYXN0ZXJcIiArIGV2ZW50KVxyXG4gICAgICAvL+S/neWtmOS4gOS4i+WcsOS4u2lkXHJcbiAgICAgIG15Z2xvYmFsLnBsYXllckRhdGEubWFzdGVyX2FjY291bnRpZCA9IGV2ZW50XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJOb2RlTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBub2RlID0gdGhpcy5wbGF5ZXJOb2RlTGlzdFtpXVxyXG4gICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAvL+e7mXBsYXllcm5vZGXoioLngrnlj5HpgIHkuovku7ZcclxuICAgICAgICAgIG5vZGUuZW1pdChcInBsYXllcm5vZGVfY2hhbmdlbWFzdGVyX2V2ZW50XCIsIGV2ZW50KVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfS5iaW5kKHRoaXMpKVxyXG5cclxuICAgIC8v5rOo5YaM55uR5ZCs5pyN5Yqh5Zmo5pi+56S65bqV54mM5raI5oGvXHJcbiAgICBteWdsb2JhbC5zb2NrZXQub25TaG93Qm90dG9tQ2FyZChmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJvblNob3dCb3R0b21DYXJkLS0tLS0tLS0tXCIgKyBldmVudClcclxuICAgICAgdmFyIGdhbWV1aV9ub2RlID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKFwiZ2FtZWluZ1VJXCIpXHJcbiAgICAgIGlmIChnYW1ldWlfbm9kZSA9PSBudWxsKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJnZXQgY2hpbGRlciBuYW1lIGdhbWVpbmdVSVwiKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcbiAgICAgIGdhbWV1aV9ub2RlLmVtaXQoXCJzaG93X2JvdHRvbV9jYXJkX2V2ZW50XCIsIGV2ZW50KVxyXG4gICAgfS5iaW5kKHRoaXMpKVxyXG4gIH0sXHJcbiAgc3RhcnQoKSB7XHJcbiAgICBcclxuICB9LFxyXG4gIG9uRGVzdHJveSgpIHtcclxuICAgIGlmICghQ0NfRURJVE9SKSB7XHJcbiAgICAgIGRkekRhdGEuZ2FtZVN0YXRlTm90aWZ5LnJlbW92ZUxpc3RlbmVyKHRoaXMuZ2FtZVN0YXRlSGFuZGxlciwgdGhpcylcclxuICAgIH1cclxuICB9LFxyXG4gIGdhbWVTdGF0ZUhhbmRsZXIodmFsdWUpIHtcclxuICAgIGNvbnNvbGUubG9nKHZhbHVlKVxyXG4gIH0sXHJcbiAgLy8g6L+U5Zue5aSn5Y6FXHJcbiAgb25Hb2JhY2soKSB7XHJcbiAgICBkZHpEYXRhLmdhbWVTdGF0ZSA9IGRkekNvbnN0YW50cy5nYW1lU3RhdGUuSU5WQUxJRFxyXG4gICAgbXlnbG9iYWwucGxheWVyRGF0YS5yb29tSWQgPSAnJ1xyXG4gICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VyRGF0YScsIEpTT04uc3RyaW5naWZ5KG15Z2xvYmFsLnBsYXllckRhdGEpKVxyXG4gICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwiaGFsbFNjZW5lXCIpXHJcbiAgfSxcclxuICAvLyDlh4blpIdcclxuICBvbkJ0blJlYWRleShldmVudCkge1xyXG4gICAgdGhpcy5idG5fcmVhZHkuYWN0aXZlID0gZmFsc2VcclxuICAgIC8vIHRoaXMucGxheWVyTm9kZUxpc3RbMF0uZW1pdChcInBsYXllcl9yZWFkeV9ub3RpZnlcIilcclxuICAgIHRoaXMucGxheWVyTm9kZUxpc3QuZm9yRWFjaChub2RlID0+IHtcclxuICAgICAgbm9kZS5lbWl0KFwiZ2FtZXN0YXJ0X2V2ZW50XCIpXHJcbiAgICB9KTtcclxuICAgIGRkekRhdGEuZ2FtZVN0YXRlID0gZGR6Q29uc3RhbnRzLmdhbWVTdGF0ZS5HQU1FU1RBUlRcclxuICB9LFxyXG4gIC8vc2VhdF9pbmRleOiHquW3seWcqOaIv+mXtOeahOS9jee9rmlkXHJcbiAgLy8gc2V0UGxheWVyU2VhdFBvcyhzZWF0X2luZGV4KSB7XHJcbiAgLy8gICBpZiAoc2VhdF9pbmRleCA8IDEgfHwgc2VhdF9pbmRleCA+IDMpIHtcclxuICAvLyAgICAgY29uc29sZS5sb2coXCJzZWF0X2luZGV4IGVycm9yXCIgKyBzZWF0X2luZGV4KVxyXG4gIC8vICAgICByZXR1cm5cclxuICAvLyAgIH1cclxuXHJcbiAgLy8gICBjb25zb2xlLmxvZyhcInNldFBsYXllclNlYXRQb3Mgc2VhdF9pbmRleDpcIiArIHNlYXRfaW5kZXgpXHJcblxyXG4gIC8vICAgLy/nlYzpnaLkvY3nva7ovazljJbmiJDpgLvovpHkvY3nva5cclxuICAvLyAgIHN3aXRjaCAoc2VhdF9pbmRleCkge1xyXG4gIC8vICAgICBjYXNlIDE6XHJcbiAgLy8gICAgICAgdGhpcy5wbGF5ZXJkYXRhX2xpc3RfcG9zWzFdID0gMFxyXG4gIC8vICAgICAgIHRoaXMucGxheWVyZGF0YV9saXN0X3Bvc1syXSA9IDFcclxuICAvLyAgICAgICB0aGlzLnBsYXllcmRhdGFfbGlzdF9wb3NbM10gPSAyXHJcbiAgLy8gICAgICAgYnJlYWtcclxuICAvLyAgICAgY2FzZSAyOlxyXG5cclxuXHJcbiAgLy8gICAgICAgdGhpcy5wbGF5ZXJkYXRhX2xpc3RfcG9zWzJdID0gMFxyXG4gIC8vICAgICAgIHRoaXMucGxheWVyZGF0YV9saXN0X3Bvc1szXSA9IDFcclxuICAvLyAgICAgICB0aGlzLnBsYXllcmRhdGFfbGlzdF9wb3NbMV0gPSAyXHJcbiAgLy8gICAgICAgYnJlYWtcclxuICAvLyAgICAgY2FzZSAzOlxyXG4gIC8vICAgICAgIHRoaXMucGxheWVyZGF0YV9saXN0X3Bvc1szXSA9IDBcclxuICAvLyAgICAgICB0aGlzLnBsYXllcmRhdGFfbGlzdF9wb3NbMV0gPSAxXHJcbiAgLy8gICAgICAgdGhpcy5wbGF5ZXJkYXRhX2xpc3RfcG9zWzJdID0gMlxyXG4gIC8vICAgICAgIGJyZWFrXHJcbiAgLy8gICAgIGRlZmF1bHQ6XHJcbiAgLy8gICAgICAgYnJlYWtcclxuICAvLyAgIH1cclxuICAvLyB9LFxyXG4gIC8vIOa3u+WKoOeOqeWutuiKgueCuVxyXG4gIGFkZFBsYXllck5vZGUocGxheWVyX2RhdGEpIHtcclxuICAgIHZhciBwbGF5ZXJub2RlX2luc3QgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnBsYXllcl9ub2RlX3ByZWZhYnMpXHJcbiAgICBwbGF5ZXJub2RlX2luc3QucGFyZW50ID0gdGhpcy5ub2RlXHJcbiAgICAvL+WIm+W7uueahOiKgueCueWtmOWCqOWcqGdhbWVzY2VuZeeahOWIl+ihqOS4rVxyXG4gICAgdGhpcy5wbGF5ZXJOb2RlTGlzdC5wdXNoKHBsYXllcm5vZGVfaW5zdClcclxuICAgIFxyXG4gICAgLy/njqnlrrblnKhyb29t6YeM55qE5L2N572u57Si5byVKOmAu+i+keS9jee9rilcclxuICAgIHZhciBpbmRleCA9IHBsYXllcl9kYXRhLnNlYXRpbmRleFxyXG4gICAgcGxheWVybm9kZV9pbnN0LnBvc2l0aW9uID0gdGhpcy5wbGF5ZXJzX3NlYXRfcG9zLmNoaWxkcmVuW2luZGV4XS5wb3NpdGlvblxyXG4gICAgcGxheWVybm9kZV9pbnN0LmdldENvbXBvbmVudChcInBsYXllcl9ub2RlXCIpLmluaXRfZGF0YShwbGF5ZXJfZGF0YSwgaW5kZXgpXHJcblxyXG4gICAgLy8gbXlnbG9iYWwucGxheWVyRGF0YS5wbGF5ZXJMaXN0W2luZGV4XSA9IHBsYXllcl9kYXRhXHJcbiAgfSxcclxuXHJcbiAgLypcclxuICAgLy/pgJrov4dhY2NvdW50aWTojrflj5bnlKjmiLflh7rniYzmlL7lnKhnYW1lc2NlbmTnmoTkvY3nva4gXHJcbiAgIOWBmuazle+8muWFiOaUvjPkuKroioLngrnlnKhnYW1lYWNlbmXnmoTlnLrmma/kuK1jYXJkc291dHpvbmUoMDEyKVxyXG4gICAgICAgICBcclxuICAqL1xyXG4gIGdldFVzZXJPdXRDYXJkUG9zQnlBY2NvdW50KGFjY291bnRpZCkge1xyXG4gICAgY29uc29sZS5sb2coXCJnZXRVc2VyT3V0Q2FyZFBvc0J5QWNjb3VudCBhY2NvdW50aWQ6XCIgKyBhY2NvdW50aWQpXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGxheWVyTm9kZUxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIG5vZGUgPSB0aGlzLnBsYXllck5vZGVMaXN0W2ldXHJcbiAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgLy/ojrflj5boioLngrnnu5HlrprnmoTnu4Tku7ZcclxuICAgICAgICB2YXIgbm9kZV9zY3JpcHQgPSBub2RlLmdldENvbXBvbmVudChcInBsYXllcl9ub2RlXCIpXHJcbiAgICAgICAgLy/lpoLmnpxhY2NvdW50aWTlkoxwbGF5ZXJfbm9kZeiKgueCuee7keWumueahGFjY291bnRpZOebuOWQjFxyXG4gICAgICAgIC8v5o6l6I635Y+WcGxheWVyX25vZGXnmoTlrZDoioLngrlcclxuICAgICAgICBpZiAobm9kZV9zY3JpcHQuYWNjb3VudGlkID09PSBhY2NvdW50aWQpIHtcclxuICAgICAgICAgIHZhciBzZWF0X25vZGUgPSB0aGlzLnBsYXllcnNfc2VhdF9wb3MuY2hpbGRyZW5bbm9kZV9zY3JpcHQuc2VhdF9pbmRleF1cclxuICAgICAgICAgIHZhciBpbmRleF9uYW1lID0gXCJjYXJkc291dHpvbmVcIiArIG5vZGVfc2NyaXB0LnNlYXRfaW5kZXhcclxuICAgICAgICAgIC8vY29uc29sZS5sb2coXCJnZXRVc2VyT3V0Q2FyZFBvc0J5QWNjb3VudCBpbmRleF9uYW1lOlwiK2luZGV4X25hbWUpXHJcbiAgICAgICAgICB2YXIgb3V0X2NhcmRfbm9kZSA9IHNlYXRfbm9kZS5nZXRDaGlsZEJ5TmFtZShpbmRleF9uYW1lKVxyXG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhcIk91dFpvbmU6XCIrIG91dF9jYXJkX25vZGUubmFtZSlcclxuICAgICAgICAgIHJldHVybiBvdXRfY2FyZF9ub2RlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG51bGxcclxuICB9LFxyXG4gIC8vIHVwZGF0ZSAoZHQpIHt9LFxyXG59KTtcclxuIl19