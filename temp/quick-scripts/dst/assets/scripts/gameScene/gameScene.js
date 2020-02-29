
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
    console.log('重新开始', ddzData.gameState);
    this.btn_ready.active = ddzData.gameState < ddzConstants.gameState.GAMESTART; // 准备按钮

    if (isopen_sound) {
      cc.audioEngine.stopAll();
      cc.audioEngine.play(this.bjMusic, true);
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
      cc.audioEngine.stopAll();
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
    this.btn_ready.active = ddzData.gameState < ddzConstants.gameState.GAMESTART;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxnYW1lU2NlbmUvLi5cXC4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHNjcmlwdHNcXGdhbWVTY2VuZS9hc3NldHNcXHNjcmlwdHNcXGdhbWVTY2VuZVxcZ2FtZVNjZW5lLmpzIl0sIm5hbWVzIjpbImRkekNvbnN0YW50cyIsInJlcXVpcmUiLCJkZHpEYXRhIiwiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJiak11c2ljIiwidHlwZSIsIkF1ZGlvQ2xpcCIsImRpX2xhYmVsIiwiTGFiZWwiLCJiZWlzaHVfbGFiZWwiLCJyb29taWRfbGFiZWwiLCJwbGF5ZXJfbm9kZV9wcmVmYWJzIiwiUHJlZmFiIiwiYnRuX3JlYWR5IiwiTm9kZSIsInBsYXllcnNfc2VhdF9wb3MiLCJnYW1lVWlOb2RlIiwib25Mb2FkIiwiZ2FtZVN0YXRlIiwiV0FJVFJFQURZIiwiQ0NfRURJVE9SIiwiZ2FtZVN0YXRlTm90aWZ5IiwiYWRkTGlzdGVuZXIiLCJnYW1lU3RhdGVIYW5kbGVyIiwicGxheWVyTm9kZUxpc3QiLCJyb29tSWQiLCJteWdsb2JhbCIsInBsYXllckRhdGEiLCJzcGxpdCIsInJhdGUiLCJib3R0b20iLCJzdHJpbmciLCJkZWZpbmVzIiwicm9vbU5hbWVzIiwiY29uc29sZSIsImxvZyIsImFjdGl2ZSIsIkdBTUVTVEFSVCIsImlzb3Blbl9zb3VuZCIsImF1ZGlvRW5naW5lIiwic3RvcEFsbCIsInBsYXkiLCJhZGRQbGF5ZXJOb2RlIiwicm9vdExpc3QiLCJub2RlIiwib24iLCJpIiwibGVuZ3RoIiwiZW1pdCIsImJpbmQiLCJzb2NrZXQiLCJyZXF1ZXN0X2VudGVyX3Jvb20iLCJlcnIiLCJyZXN1bHQiLCJKU09OIiwic3RyaW5naWZ5Iiwic2VhdGlkIiwic2VhdGluZGV4IiwicGxheWVyZGF0YV9saXN0X3BvcyIsInNldFBsYXllclNlYXRQb3MiLCJwbGF5ZXJkYXRhX2xpc3QiLCJwbGF5ZXJkYXRhIiwiaG91c2VtYW5hZ2VpZCIsImdhbWViZWZvcmVfbm9kZSIsImdldENoaWxkQnlOYW1lIiwib25QbGF5ZXJKb2luUm9vbSIsImpvaW5fcGxheWVyZGF0YSIsIm9uUGxheWVyUmVhZHkiLCJkYXRhIiwib25HYW1lU3RhcnQiLCJnYW1lYmVmb3JlVUkiLCJvbkNoYW5nZU1hc3RlciIsImV2ZW50IiwibWFzdGVyVXNlcklkIiwic3RhcnQiLCIkc29ja2V0IiwibWFzdGVyTm90aWZ5Iiwib25EZXN0cm95IiwicmVtb3ZlTGlzdGVuZXIiLCJyZW1vdmUiLCJtYXN0ZXJJZCIsImNhcmRzIiwic3RhdGUiLCJvbkdvYmFjayIsIklOVkFMSUQiLCJzeXMiLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiZGlyZWN0b3IiLCJsb2FkU2NlbmUiLCJvbkJ0blJlYWRleSIsImZvckVhY2giLCJwbGF5ZXJfZGF0YSIsImluZGV4IiwicGxheWVybm9kZV9pbnN0IiwiaW5zdGFudGlhdGUiLCJwYXJlbnQiLCJjaGlsZHJlbiIsInB1c2giLCJnZXRDb21wb25lbnQiLCJpbml0X2RhdGEiLCJnZXRVc2VyT3V0Q2FyZFBvc0J5QWNjb3VudCIsInVzZXJJZCIsIm5vZGVfc2NyaXB0Iiwic2VhdF9ub2RlIiwic2VhdF9pbmRleCIsImdldFVzZXJOb2RlQnlBY2NvdW50IiwicGxheWVyTm9kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0FBQ0EsSUFBTUEsWUFBWSxHQUFHQyxPQUFPLENBQUMsY0FBRCxDQUE1Qjs7QUFDQSxJQUFNQyxPQUFPLEdBQUdELE9BQU8sQ0FBQyxTQUFELENBQXZCOztBQUVBRSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNQLGFBQVNELEVBQUUsQ0FBQ0UsU0FETDtBQUVQQyxFQUFBQSxVQUFVLEVBQUU7QUFDVkMsSUFBQUEsT0FBTyxFQUFFO0FBQ1BDLE1BQUFBLElBQUksRUFBRUwsRUFBRSxDQUFDTSxTQURGO0FBQ2E7QUFDcEIsaUJBQVMsSUFG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QWhCO0FBQ0EsaUJBQU93QyxTQUFQO0FBQ0Q7QUFDRjtBQUNGOztBQUNELFdBQU8sSUFBUDtBQUNELEdBeFNNOztBQXlTUDs7Ozs7QUFLQUUsRUFBQUEsb0JBOVNPLGdDQThTY0osTUE5U2QsRUE4U3NCO0FBQzNCLFNBQUssSUFBSXhELENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsS0FBS3RCLGNBQUwsQ0FBb0J1QixNQUF4QyxFQUFnREQsQ0FBQyxFQUFqRCxFQUFxRDtBQUNuRCxVQUFNRixJQUFJLEdBQUcsS0FBS3BCLGNBQUwsQ0FBb0JzQixDQUFwQixDQUFiOztBQUNBLFVBQUlGLElBQUosRUFBVTtBQUNSO0FBQ0EsWUFBTStELFVBQVUsR0FBRy9ELElBQUksQ0FBQ3VELFlBQUwsQ0FBa0IsYUFBbEIsQ0FBbkI7QUFDQSxZQUFJUSxVQUFVLENBQUNMLE1BQVgsS0FBc0JBLE1BQTFCLEVBQWtDLE9BQU9LLFVBQVA7QUFDbkM7QUFDRjs7QUFDRCxXQUFPLElBQVA7QUFDRDtBQXhUTSxDQUFUIiwic291cmNlUm9vdCI6Ii4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxnYW1lU2NlbmUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbXlnbG9iYWwgZnJvbSBcIi4uL215Z29sYmFsLmpzXCJcclxuY29uc3QgZGR6Q29uc3RhbnRzID0gcmVxdWlyZSgnZGR6Q29uc3RhbnRzJylcclxuY29uc3QgZGR6RGF0YSA9IHJlcXVpcmUoJ2RkekRhdGEnKVxyXG5cclxuY2MuQ2xhc3Moe1xyXG4gIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuICBwcm9wZXJ0aWVzOiB7XHJcbiAgICBiak11c2ljOiB7XHJcbiAgICAgIHR5cGU6IGNjLkF1ZGlvQ2xpcCwgLy8g6IOM5pmv6Z+z5LmQXHJcbiAgICAgIGRlZmF1bHQ6IG51bGwsICAgICAvLyBvYmplY3QncyBkZWZhdWx0IHZhbHVlIGlzIG51bGxcclxuICAgIH0sXHJcbiAgICBkaV9sYWJlbDogY2MuTGFiZWwsXHJcbiAgICBiZWlzaHVfbGFiZWw6IGNjLkxhYmVsLFxyXG4gICAgcm9vbWlkX2xhYmVsOiBjYy5MYWJlbCxcclxuICAgIHBsYXllcl9ub2RlX3ByZWZhYnM6IGNjLlByZWZhYixcclxuICAgIGJ0bl9yZWFkeTogY2MuTm9kZSwgLy8g5YeG5aSH5oyJ6ZKuXHJcbiAgICAvL+e7keWumueOqeWutuW6p+S9jSzkuIvpnaLmnIkz5Liq5a2Q6IqC54K5XHJcbiAgICBwbGF5ZXJzX3NlYXRfcG9zOiBjYy5Ob2RlLFxyXG4gICAgZ2FtZVVpTm9kZTogY2MuTm9kZVxyXG4gIH0sXHJcbiAgb25Mb2FkKCkge1xyXG4gICAgZGR6RGF0YS5nYW1lU3RhdGUgPSBkZHpDb25zdGFudHMuZ2FtZVN0YXRlLldBSVRSRUFEWVxyXG4gICAgaWYgKCFDQ19FRElUT1IpIHtcclxuICAgICAgZGR6RGF0YS5nYW1lU3RhdGVOb3RpZnkuYWRkTGlzdGVuZXIodGhpcy5nYW1lU3RhdGVIYW5kbGVyLCB0aGlzKVxyXG4gICAgfVxyXG4gICAgdGhpcy5wbGF5ZXJOb2RlTGlzdCA9IFtdXHJcbiAgICBjb25zdCB7IHJvb21JZCB9ID0gbXlnbG9iYWwucGxheWVyRGF0YVxyXG4gICAgY29uc3QgW3JhdGUsIGJvdHRvbV0gPSByb29tSWQuc3BsaXQoJ18nKVxyXG4gICAgbXlnbG9iYWwucGxheWVyRGF0YS5yYXRlID0gcmF0ZVxyXG4gICAgbXlnbG9iYWwucGxheWVyRGF0YS5ib3R0b20gPSBib3R0b21cclxuXHJcbiAgICB0aGlzLnJvb21pZF9sYWJlbC5zdHJpbmcgPSBkZWZpbmVzLnJvb21OYW1lc1tyYXRlIC0gMV1cclxuICAgIHRoaXMuYmVpc2h1X2xhYmVsLnN0cmluZyA9IFwi5YCN5pWw77yaXCIgKyByYXRlXHJcbiAgICB0aGlzLmRpX2xhYmVsLnN0cmluZyA9IFwi5bqV77yaXCIgKyBib3R0b21cclxuICAgIGNvbnNvbGUubG9nKCfph43mlrDlvIDlp4snLCBkZHpEYXRhLmdhbWVTdGF0ZSlcclxuICAgIHRoaXMuYnRuX3JlYWR5LmFjdGl2ZSA9IGRkekRhdGEuZ2FtZVN0YXRlIDwgZGR6Q29uc3RhbnRzLmdhbWVTdGF0ZS5HQU1FU1RBUlQgLy8g5YeG5aSH5oyJ6ZKuXHJcbiAgICBpZiAoaXNvcGVuX3NvdW5kKSB7XHJcbiAgICAgIGNjLmF1ZGlvRW5naW5lLnN0b3BBbGwoKVxyXG4gICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5KHRoaXMuYmpNdXNpYywgdHJ1ZSlcclxuICAgIH1cclxuICAgIHRoaXMuYWRkUGxheWVyTm9kZShteWdsb2JhbC5wbGF5ZXJEYXRhKVxyXG4gICAgdGhpcy5hZGRQbGF5ZXJOb2RlKG15Z2xvYmFsLnBsYXllckRhdGEucm9vdExpc3RbMF0pXHJcbiAgICB0aGlzLmFkZFBsYXllck5vZGUobXlnbG9iYWwucGxheWVyRGF0YS5yb290TGlzdFsxXSlcclxuICAgIC8v55uR5ZCs77yM57uZ5YW25LuW546p5a625Y+R54mMKOWGhemDqOS6i+S7tilcclxuICAgIHRoaXMubm9kZS5vbihcInB1c2hjYXJkX290aGVyX2V2ZW50XCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgY29uc29sZS5sb2coJ+WFtuS7lueOqeWutuWPkeeJjCcpXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJOb2RlTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnBsYXllck5vZGVMaXN0W2ldXHJcbiAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgIC8v57uZcGxheWVybm9kZeiKgueCueWPkemAgeS6i+S7tlxyXG4gICAgICAgICAgbm9kZS5lbWl0KFwicHVzaF9jYXJkX2V2ZW50XCIpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LmJpbmQodGhpcykpXHJcblxyXG4gICAgLy/nm5HlkKzmiL/pl7TnirbmgIHmlLnlj5jkuovku7ZcclxuICAgIC8vIG15Z2xvYmFsLnNvY2tldC5vblJvb21DaGFuZ2VTdGF0ZShmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgLy8gICAvL+Wbnuiwg+eahOWHveaVsOWPguaVsOaYr+i/m+WFpeaIv+mXtOeUqOaIt+a2iOaBr1xyXG4gICAgLy8gICBjb25zb2xlLmxvZyhcIm9uUm9vbUNoYW5nZVN0YXRlOlwiICsgZGF0YSlcclxuICAgIC8vICAgdGhpcy5yb29tc3RhdGUgPSBkYXRhXHJcbiAgICAvLyB9LmJpbmQodGhpcykpXHJcbiAgICAvLyDmiqLlnLDkuLtcclxuICAgIC8vIHRoaXMubm9kZS5vbihcImNhbnJvYl9ldmVudFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIC8vICAgY29uc29sZS5sb2coXCJnYW1lc2NlbmUgY2Fucm9iX2V2ZW50OlwiICsgZXZlbnQpXHJcbiAgICAvLyAgIC8v6YCa55+l57uZcGxheWVybm9kZeWtkOiKgueCuVxyXG4gICAgLy8gICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGxheWVyTm9kZUxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgIC8vICAgICB2YXIgbm9kZSA9IHRoaXMucGxheWVyTm9kZUxpc3RbaV1cclxuICAgIC8vICAgICBpZiAobm9kZSkge1xyXG4gICAgLy8gICAgICAgLy/nu5lwbGF5ZXJub2Rl6IqC54K55Y+R6YCB5LqL5Lu2XHJcbiAgICAvLyAgICAgICBub2RlLmVtaXQoXCJwbGF5ZXJub2RlX2NhbnJvYl9ldmVudFwiLCBldmVudClcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyAgIH1cclxuICAgIC8vIH0uYmluZCh0aGlzKSlcclxuXHJcbiAgICAvLyB0aGlzLm5vZGUub24oXCJjaG9vc2VfY2FyZF9ldmVudFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIC8vICAgdGhpcy5nYW1lVWlOb2RlLmVtaXQoXCJjaG9vc2VfY2FyZF9ldmVudFwiLCBldmVudClcclxuICAgIC8vIH0uYmluZCh0aGlzKSlcclxuXHJcbiAgICAvLyB0aGlzLm5vZGUub24oXCJ1bmNob29zZV9jYXJkX2V2ZW50XCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgLy8gICB0aGlzLmdhbWVVaU5vZGUuZW1pdChcInVuY2hvb3NlX2NhcmRfZXZlbnRcIiwgZXZlbnQpXHJcbiAgICAvLyB9LmJpbmQodGhpcykpXHJcbiAgICAvL+ebkeWQrOe7meeOqeWutua3u+WKoOS4ieW8oOW6leeJjFxyXG4gICAgLy8gdGhpcy5ub2RlLm9uKFwiYWRkX3RocmVlX2NhcmRcIixmdW5jdGlvbihldmVudCl7XHJcbiAgICAvLyAgICAgY29uc29sZS5sb2coXCJhZGRfdGhyZWVfY2FyZDpcIitldmVudClcclxuICAgIC8vICAgICBmb3IodmFyIGk9MDtpPHRoaXMucGxheWVyTm9kZUxpc3QubGVuZ3RoO2krKyl7XHJcbiAgICAvLyAgICAgICAgIHZhciBub2RlID0gdGhpcy5wbGF5ZXJOb2RlTGlzdFtpXVxyXG4gICAgLy8gICAgICAgICBpZihub2RlKXtcclxuICAgIC8vICAgICAgICAgICAgIC8v57uZcGxheWVybm9kZeiKgueCueWPkemAgeS6i+S7tlxyXG4gICAgLy8gICAgICAgICAgICAgbm9kZS5lbWl0KFwicGxheWVybm9kZV9hZGRfdGhyZWVfY2FyZFwiLGV2ZW50KVxyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfS5iaW5kKHRoaXMpKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gICAgbXlnbG9iYWwuc29ja2V0LnJlcXVlc3RfZW50ZXJfcm9vbSh7fSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiZW50ZXJfcm9vbV9yZXNwXCIgKyBKU09OLnN0cmluZ2lmeShyZXN1bHQpKVxyXG4gICAgICBpZiAoZXJyICE9IDApIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImVudGVyX3Jvb21fcmVzcCBlcnI6XCIgKyBlcnIpXHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIC8vZW50ZXJfcm9vbeaIkOWKn1xyXG4gICAgICAgIC8vbm90aWZ5ID17XCJzZWF0aWRcIjoxLFwicGxheWVyZGF0YVwiOlt7XCJhY2NvdW50aWRcIjpcIjIxMTc4MzZcIixcInVzZXJOYW1lXCI6XCJ0aW55NTQzXCIsXCJhdmF0YXJVcmxcIjpcImh0dHA6Ly94eHhcIixcImdvbGRjb3VudFwiOjEwMDB9XX1cclxuICAgICAgICB2YXIgc2VhdGlkID0gcmVzdWx0LnNlYXRpbmRleCAvL+iHquW3seWcqOaIv+mXtOmHjOeahHNlYXRpZFxyXG4gICAgICAgIHRoaXMucGxheWVyZGF0YV9saXN0X3BvcyA9IFtdICAvLzPkuKrnlKjmiLfliJvlu7rkuIDkuKrnqbrnlKjmiLfliJfooahcclxuICAgICAgICB0aGlzLnNldFBsYXllclNlYXRQb3Moc2VhdGlkKVxyXG5cclxuICAgICAgICB2YXIgcGxheWVyZGF0YV9saXN0ID0gcmVzdWx0LnBsYXllcmRhdGFcclxuICAgICAgICB2YXIgcm9vbUlkID0gcmVzdWx0LnJvb21JZFxyXG4gICAgICAgIHRoaXMucm9vbWlkX2xhYmVsLnN0cmluZyA9IFwi5oi/6Ze05Y+3OlwiICsgcm9vbUlkXHJcbiAgICAgICAgbXlnbG9iYWwucGxheWVyRGF0YS5ob3VzZW1hbmFnZWlkID0gcmVzdWx0LmhvdXNlbWFuYWdlaWRcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwbGF5ZXJkYXRhX2xpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIC8vY29uc29sLmxvZyhcInRoaXMtLS0tXCIrdGhpcylcclxuICAgICAgICAgIHRoaXMuYWRkUGxheWVyTm9kZShwbGF5ZXJkYXRhX2xpc3RbaV0pXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgIH1cclxuICAgICAgdmFyIGdhbWViZWZvcmVfbm9kZSA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcImdhbWViZWZvcmVVSVwiKVxyXG4gICAgICBnYW1lYmVmb3JlX25vZGUuZW1pdChcImluaXRcIilcclxuICAgIH0uYmluZCh0aGlzKSlcclxuXHJcbiAgICAvL+WcqOi/m+WFpeaIv+mXtOWQju+8jOazqOWGjOWFtuS7lueOqeWutui/m+WFpeaIv+mXtOeahOS6i+S7tlxyXG4gICAgbXlnbG9iYWwuc29ja2V0Lm9uUGxheWVySm9pblJvb20oZnVuY3Rpb24gKGpvaW5fcGxheWVyZGF0YSkge1xyXG4gICAgICAvL+Wbnuiwg+eahOWHveaVsOWPguaVsOaYr+i/m+WFpeaIv+mXtOeUqOaIt+a2iOaBr1xyXG4gICAgICBjb25zb2xlLmxvZyhcIm9uUGxheWVySm9pblJvb206XCIgKyBKU09OLnN0cmluZ2lmeShqb2luX3BsYXllcmRhdGEpKVxyXG4gICAgICB0aGlzLmFkZFBsYXllck5vZGUoam9pbl9wbGF5ZXJkYXRhKVxyXG4gICAgfS5iaW5kKHRoaXMpKVxyXG5cclxuICAgIC8v5Zue6LCD5Y+C5pWw5piv5Y+R6YCB5YeG5aSH5raI5oGv55qEYWNjb3VudGlkXHJcbiAgICBteWdsb2JhbC5zb2NrZXQub25QbGF5ZXJSZWFkeShmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLS1vblBsYXllclJlYWR5OlwiICsgZGF0YSlcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBsYXllck5vZGVMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLnBsYXllck5vZGVMaXN0W2ldXHJcbiAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgIG5vZGUuZW1pdChcInBsYXllcl9yZWFkeV9ub3RpZnlcIiwgZGF0YSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0uYmluZCh0aGlzKSlcclxuXHJcbiAgICBteWdsb2JhbC5zb2NrZXQub25HYW1lU3RhcnQoZnVuY3Rpb24gKCkge1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGxheWVyTm9kZUxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgbm9kZSA9IHRoaXMucGxheWVyTm9kZUxpc3RbaV1cclxuICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgbm9kZS5lbWl0KFwiZ2FtZXN0YXJ0X2V2ZW50XCIpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvL+makOiXj2dhbWViZWZvcmVVSeiKgueCuVxyXG4gICAgICB2YXIgZ2FtZWJlZm9yZVVJID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKFwiZ2FtZWJlZm9yZVVJXCIpXHJcbiAgICAgIGlmIChnYW1lYmVmb3JlVUkpIHtcclxuICAgICAgICBnYW1lYmVmb3JlVUkuYWN0aXZlID0gZmFsc2VcclxuICAgICAgfVxyXG4gICAgfS5iaW5kKHRoaXMpKVxyXG5cclxuICAgIC8v55uR5ZCs5pyN5Yqh5Zmo546p5a625oqi5Zyw5Li75raI5oGvXHJcbiAgICAvLyBteWdsb2JhbC5zb2NrZXQub25Sb2JTdGF0ZShmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIC8vICAgY29uc29sZS5sb2coXCItLS0tLW9uUm9iU3RhdGVcIiArIEpTT04uc3RyaW5naWZ5KGV2ZW50KSlcclxuICAgIC8vICAgLy9vblJvYlN0YXRle1wiYWNjb3VudGlkXCI6XCIyMTYyODY2XCIsXCJzdGF0ZVwiOjF9XHJcbiAgICAvLyAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJOb2RlTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgLy8gICAgIHZhciBub2RlID0gdGhpcy5wbGF5ZXJOb2RlTGlzdFtpXVxyXG4gICAgLy8gICAgIGlmIChub2RlKSB7XHJcbiAgICAvLyAgICAgICAvL+e7mXBsYXllcm5vZGXoioLngrnlj5HpgIHkuovku7ZcclxuICAgIC8vICAgICAgIG5vZGUuZW1pdChcInBsYXllcm5vZGVfcm9iX3N0YXRlX2V2ZW50XCIsIGV2ZW50KVxyXG4gICAgLy8gICAgIH1cclxuICAgIC8vICAgfVxyXG4gICAgLy8gfS5iaW5kKHRoaXMpKVxyXG5cclxuICAgIC8v5rOo5YaM55uR5ZCs5pyN5Yqh5Zmo56Gu5a6a5Zyw5Li75raI5oGvXHJcbiAgICBteWdsb2JhbC5zb2NrZXQub25DaGFuZ2VNYXN0ZXIoZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwib25DaGFuZ2VNYXN0ZXJcIiArIGV2ZW50KVxyXG4gICAgICAvL+S/neWtmOS4gOS4i+WcsOS4u2lkXHJcbiAgICAgIG15Z2xvYmFsLnBsYXllckRhdGEubWFzdGVyVXNlcklkID0gZXZlbnRcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBsYXllck5vZGVMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLnBsYXllck5vZGVMaXN0W2ldXHJcbiAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgIC8v57uZcGxheWVybm9kZeiKgueCueWPkemAgeS6i+S7tlxyXG4gICAgICAgICAgbm9kZS5lbWl0KFwicGxheWVybm9kZV9jaGFuZ2VtYXN0ZXJfZXZlbnRcIiwgZXZlbnQpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LmJpbmQodGhpcykpXHJcblxyXG4gICAgLy/ms6jlhoznm5HlkKzmnI3liqHlmajmmL7npLrlupXniYzmtojmga9cclxuICAgIC8vIG15Z2xvYmFsLnNvY2tldC5vblNob3dCb3R0b21DYXJkKGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgLy8gICBjb25zb2xlLmxvZyhcIm9uU2hvd0JvdHRvbUNhcmQtLS0tLS0tLS1cIiArIGV2ZW50KVxyXG4gICAgLy8gICB0aGlzLmdhbWVVaU5vZGUuZW1pdChcInNob3dfYm90dG9tX2NhcmRfZXZlbnRcIiwgZXZlbnQpXHJcbiAgICAvLyB9LmJpbmQodGhpcykpXHJcbiAgfSxcclxuICBzdGFydCgpIHtcclxuICAgICRzb2NrZXQub24oJ2NoYW5nZV9tYXN0ZXJfbm90aWZ5JywgdGhpcy5tYXN0ZXJOb3RpZnksIHRoaXMpXHJcbiAgfSxcclxuICBvbkRlc3Ryb3koKSB7XHJcbiAgICBpZiAoIUNDX0VESVRPUikge1xyXG4gICAgICBkZHpEYXRhLmdhbWVTdGF0ZU5vdGlmeS5yZW1vdmVMaXN0ZW5lcih0aGlzLmdhbWVTdGF0ZUhhbmRsZXIsIHRoaXMpXHJcbiAgICAgIGNjLmF1ZGlvRW5naW5lLnN0b3BBbGwoKVxyXG4gICAgfVxyXG4gICAgJHNvY2tldC5yZW1vdmUoJ2NoYW5nZV9tYXN0ZXJfbm90aWZ5JywgdGhpcylcclxuICB9LFxyXG4gIC8vIOmAmuefpeiwgeaYr+WcsOS4uywg5bm25pi+56S65bqV54mMXHJcbiAgbWFzdGVyTm90aWZ5KHsgbWFzdGVySWQsIGNhcmRzIH0pIHtcclxuICAgIC8vIOW/hemhu+WFiOiuvue9ruWFqOWxgOWcsOS4u2lkXHJcbiAgICBteWdsb2JhbC5wbGF5ZXJEYXRhLm1hc3RlclVzZXJJZCA9IG1hc3RlcklkXHJcbiAgICAvLyDmmL7npLrlupXniYxcclxuICAgIHRoaXMuZ2FtZVVpTm9kZS5lbWl0KFwic2hvd19ib3R0b21fY2FyZF9ldmVudFwiLCBjYXJkcylcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJOb2RlTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgbm9kZSA9IHRoaXMucGxheWVyTm9kZUxpc3RbaV1cclxuICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAvLyDnu5lwbGF5ZXJub2Rl6IqC54K55Y+R6YCB5LqL5Lu2XHJcbiAgICAgICAgbm9kZS5lbWl0KFwicGxheWVybm9kZV9jaGFuZ2VtYXN0ZXJfZXZlbnRcIiwgbWFzdGVySWQpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIGdhbWVTdGF0ZUhhbmRsZXIoc3RhdGUpIHtcclxuICAgIHRoaXMuYnRuX3JlYWR5LmFjdGl2ZSA9IGRkekRhdGEuZ2FtZVN0YXRlIDwgZGR6Q29uc3RhbnRzLmdhbWVTdGF0ZS5HQU1FU1RBUlRcclxuICAgIGlmIChzdGF0ZSA9PT0gZGR6Q29uc3RhbnRzLmdhbWVTdGF0ZS5XQUlUUkVBRFkpIHtcclxuICAgICAgdGhpcy5idG5fcmVhZHkuYWN0aXZlID0gdHJ1ZVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgLy8g6L+U5Zue5aSn5Y6FXHJcbiAgb25Hb2JhY2soKSB7XHJcbiAgICBkZHpEYXRhLmdhbWVTdGF0ZSA9IGRkekNvbnN0YW50cy5nYW1lU3RhdGUuSU5WQUxJRFxyXG4gICAgbXlnbG9iYWwucGxheWVyRGF0YS5yb29tSWQgPSAnJ1xyXG4gICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VyRGF0YScsIEpTT04uc3RyaW5naWZ5KG15Z2xvYmFsLnBsYXllckRhdGEpKVxyXG4gICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwiaGFsbFNjZW5lXCIpXHJcbiAgfSxcclxuICAvLyDlh4blpIdcclxuICBvbkJ0blJlYWRleShldmVudCkge1xyXG4gICAgdGhpcy5idG5fcmVhZHkuYWN0aXZlID0gZmFsc2VcclxuICAgIHRoaXMucGxheWVyTm9kZUxpc3QuZm9yRWFjaChub2RlID0+IHtcclxuICAgICAgbm9kZS5lbWl0KFwiZ2FtZXN0YXJ0X2V2ZW50XCIpXHJcbiAgICB9KTtcclxuICAgIGRkekRhdGEuZ2FtZVN0YXRlID0gZGR6Q29uc3RhbnRzLmdhbWVTdGF0ZS5HQU1FU1RBUlRcclxuICB9LFxyXG4gIC8vc2VhdF9pbmRleOiHquW3seWcqOaIv+mXtOeahOS9jee9rmlkXHJcbiAgLy8gc2V0UGxheWVyU2VhdFBvcyhzZWF0X2luZGV4KSB7XHJcbiAgLy8gICBpZiAoc2VhdF9pbmRleCA8IDEgfHwgc2VhdF9pbmRleCA+IDMpIHtcclxuICAvLyAgICAgY29uc29sZS5sb2coXCJzZWF0X2luZGV4IGVycm9yXCIgKyBzZWF0X2luZGV4KVxyXG4gIC8vICAgICByZXR1cm5cclxuICAvLyAgIH1cclxuXHJcbiAgLy8gICBjb25zb2xlLmxvZyhcInNldFBsYXllclNlYXRQb3Mgc2VhdF9pbmRleDpcIiArIHNlYXRfaW5kZXgpXHJcblxyXG4gIC8vICAgLy/nlYzpnaLkvY3nva7ovazljJbmiJDpgLvovpHkvY3nva5cclxuICAvLyAgIHN3aXRjaCAoc2VhdF9pbmRleCkge1xyXG4gIC8vICAgICBjYXNlIDE6XHJcbiAgLy8gICAgICAgdGhpcy5wbGF5ZXJkYXRhX2xpc3RfcG9zWzFdID0gMFxyXG4gIC8vICAgICAgIHRoaXMucGxheWVyZGF0YV9saXN0X3Bvc1syXSA9IDFcclxuICAvLyAgICAgICB0aGlzLnBsYXllcmRhdGFfbGlzdF9wb3NbM10gPSAyXHJcbiAgLy8gICAgICAgYnJlYWtcclxuICAvLyAgICAgY2FzZSAyOlxyXG5cclxuXHJcbiAgLy8gICAgICAgdGhpcy5wbGF5ZXJkYXRhX2xpc3RfcG9zWzJdID0gMFxyXG4gIC8vICAgICAgIHRoaXMucGxheWVyZGF0YV9saXN0X3Bvc1szXSA9IDFcclxuICAvLyAgICAgICB0aGlzLnBsYXllcmRhdGFfbGlzdF9wb3NbMV0gPSAyXHJcbiAgLy8gICAgICAgYnJlYWtcclxuICAvLyAgICAgY2FzZSAzOlxyXG4gIC8vICAgICAgIHRoaXMucGxheWVyZGF0YV9saXN0X3Bvc1szXSA9IDBcclxuICAvLyAgICAgICB0aGlzLnBsYXllcmRhdGFfbGlzdF9wb3NbMV0gPSAxXHJcbiAgLy8gICAgICAgdGhpcy5wbGF5ZXJkYXRhX2xpc3RfcG9zWzJdID0gMlxyXG4gIC8vICAgICAgIGJyZWFrXHJcbiAgLy8gICAgIGRlZmF1bHQ6XHJcbiAgLy8gICAgICAgYnJlYWtcclxuICAvLyAgIH1cclxuICAvLyB9LFxyXG4gIC8vIOa3u+WKoOeOqeWutuiKgueCuVxyXG4gIGFkZFBsYXllck5vZGUocGxheWVyX2RhdGEpIHtcclxuICAgIHZhciBpbmRleCA9IHBsYXllcl9kYXRhLnNlYXRpbmRleFxyXG4gICAgdmFyIHBsYXllcm5vZGVfaW5zdCA9IGNjLmluc3RhbnRpYXRlKHRoaXMucGxheWVyX25vZGVfcHJlZmFicylcclxuICAgIHBsYXllcm5vZGVfaW5zdC5wYXJlbnQgPSB0aGlzLnBsYXllcnNfc2VhdF9wb3MuY2hpbGRyZW5baW5kZXhdXHJcbiAgICAvLyBwbGF5ZXJub2RlX2luc3QucGFyZW50ID0gdGhpcy5ub2RlXHJcbiAgICAvL+WIm+W7uueahOiKgueCueWtmOWCqOWcqGdhbWVzY2VuZeeahOWIl+ihqOS4rVxyXG4gICAgdGhpcy5wbGF5ZXJOb2RlTGlzdC5wdXNoKHBsYXllcm5vZGVfaW5zdClcclxuXHJcbiAgICAvL+eOqeWutuWcqHJvb23ph4znmoTkvY3nva7ntKLlvJUo6YC76L6R5L2N572uKVxyXG4gICAgLy8gcGxheWVybm9kZV9pbnN0LnBvc2l0aW9uID0gdGhpcy5wbGF5ZXJzX3NlYXRfcG9zLmNoaWxkcmVuW2luZGV4XS5wb3NpdGlvblxyXG4gICAgcGxheWVybm9kZV9pbnN0LmdldENvbXBvbmVudChcInBsYXllcl9ub2RlXCIpLmluaXRfZGF0YShwbGF5ZXJfZGF0YSwgaW5kZXgpXHJcblxyXG4gICAgLy8gbXlnbG9iYWwucGxheWVyRGF0YS5wbGF5ZXJMaXN0W2luZGV4XSA9IHBsYXllcl9kYXRhXHJcbiAgfSxcclxuXHJcbiAgLypcclxuICAgLy/pgJrov4d1c2VySWTojrflj5bnlKjmiLflh7rniYzmlL7lnKhnYW1lc2NlbmTnmoTkvY3nva4gXHJcbiAgIOWBmuazle+8muWFiOaUvjPkuKroioLngrnlnKhnYW1lYWNlbmXnmoTlnLrmma/kuK0gY2FyZHNvdXR6b25lKDAxMilcclxuICAqL1xyXG4gIGdldFVzZXJPdXRDYXJkUG9zQnlBY2NvdW50KHVzZXJJZCkge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBsYXllck5vZGVMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBub2RlID0gdGhpcy5wbGF5ZXJOb2RlTGlzdFtpXVxyXG4gICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgIC8v6I635Y+W6IqC54K557uR5a6a55qE57uE5Lu2XHJcbiAgICAgICAgdmFyIG5vZGVfc2NyaXB0ID0gbm9kZS5nZXRDb21wb25lbnQoXCJwbGF5ZXJfbm9kZVwiKVxyXG4gICAgICAgIC8v5aaC5p6cYWNjb3VudGlk5ZKMcGxheWVyX25vZGXoioLngrnnu5HlrprnmoRhY2NvdW50aWTnm7jlkIxcclxuICAgICAgICAvL+aOpeiOt+WPlnBsYXllcl9ub2Rl55qE5a2Q6IqC54K5XHJcbiAgICAgICAgaWYgKG5vZGVfc2NyaXB0LnVzZXJJZCA9PT0gdXNlcklkKSB7XHJcbiAgICAgICAgICB2YXIgc2VhdF9ub2RlID0gdGhpcy5wbGF5ZXJzX3NlYXRfcG9zLmNoaWxkcmVuW25vZGVfc2NyaXB0LnNlYXRfaW5kZXhdLmdldENoaWxkQnlOYW1lKCdjYXJkc291dHpvbmUnKVxyXG4gICAgICAgICAgcmV0dXJuIHNlYXRfbm9kZVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGxcclxuICB9LFxyXG4gIC8qKlxyXG4gICAgKiBAZGVzY3JpcHRpb24g6YCa6L+HdXNlcklk6I635Y+W546p5a625aS05YOP6IqC54K5IFxyXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gdXNlcklkIFxyXG4gICAgKiBAcmV0dXJucyB7Y2MuTm9kZX0g546p5a626IqC54K5XHJcbiAgICAqL1xyXG4gIGdldFVzZXJOb2RlQnlBY2NvdW50KHVzZXJJZCkge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsYXllck5vZGVMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnBsYXllck5vZGVMaXN0W2ldXHJcbiAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgLy/ojrflj5boioLngrnnu5HlrprnmoTnu4Tku7ZcclxuICAgICAgICBjb25zdCBwbGF5ZXJOb2RlID0gbm9kZS5nZXRDb21wb25lbnQoXCJwbGF5ZXJfbm9kZVwiKVxyXG4gICAgICAgIGlmIChwbGF5ZXJOb2RlLnVzZXJJZCA9PT0gdXNlcklkKSByZXR1cm4gcGxheWVyTm9kZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbFxyXG4gIH1cclxufSk7XHJcbiJdfQ==