
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

cc.Class({
  "extends": cc.Component,
  properties: {
    di_label: cc.Label,
    beishu_label: cc.Label,
    roomid_label: cc.Label,
    player_node_prefabs: cc.Prefab,
    //绑定玩家座位,下面有3个子节点
    players_seat_pos: cc.Node
  },
  //本局结束，做状态清除
  gameEnd: function gameEnd() {},
  onLoad: function onLoad() {
    this.playerNodeList = [];
    this.di_label.string = "底:" + _mygolbal["default"].playerData.bottom;
    this.beishu_label.string = "倍数:" + _mygolbal["default"].playerData.rate;
    this.roomstate = RoomState.ROOM_INVALID; //监听，给其他玩家发牌(内部事件)

    this.node.on("pushcard_other_event", function () {
      console.log("gamescene pushcard_other_event");

      for (var i = 0; i < this.playerNodeList.length; i++) {
        var node = this.playerNodeList[i];

        if (node) {
          //给playernode节点发送事件
          node.emit("push_card_event");
        }
      }
    }.bind(this)); //监听房间状态改变事件

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
        //notify ={"seatid":1,"playerdata":[{"accountid":"2117836","nick_name":"tiny543","avatarUrl":"http://xxx","goldcount":1000}]}
        var seatid = result.seatindex; //自己在房间里的seatid

        this.playerdata_list_pos = []; //3个用户创建一个空用户列表

        this.setPlayerSeatPos(seatid);
        var playerdata_list = result.playerdata;
        var roomid = result.roomid;
        this.roomid_label.string = "房间号:" + roomid;
        _mygolbal["default"].playerData.housemanageid = result.housemanageid;

        for (var i = 0; i < playerdata_list.length; i++) {
          //consol.log("this----"+this)
          this.addPlayerNode(playerdata_list[i]);
        }

        if (isopen_sound) {
          cc.audioEngine.stopAll();
          cc.audioEngine.play(cc.url.raw("resources/sound/bg.mp3"), true);
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
  //seat_index自己在房间的位置id
  setPlayerSeatPos: function setPlayerSeatPos(seat_index) {
    if (seat_index < 1 || seat_index > 3) {
      console.log("seat_index error" + seat_index);
      return;
    }

    console.log("setPlayerSeatPos seat_index:" + seat_index); //界面位置转化成逻辑位置

    switch (seat_index) {
      case 1:
        this.playerdata_list_pos[1] = 0;
        this.playerdata_list_pos[2] = 1;
        this.playerdata_list_pos[3] = 2;
        break;

      case 2:
        this.playerdata_list_pos[2] = 0;
        this.playerdata_list_pos[3] = 1;
        this.playerdata_list_pos[1] = 2;
        break;

      case 3:
        this.playerdata_list_pos[3] = 0;
        this.playerdata_list_pos[1] = 1;
        this.playerdata_list_pos[2] = 2;
        break;

      default:
        break;
    }
  },
  addPlayerNode: function addPlayerNode(player_data) {
    var playernode_inst = cc.instantiate(this.player_node_prefabs);
    playernode_inst.parent = this.node; //创建的节点存储在gamescene的列表中

    this.playerNodeList.push(playernode_inst); //玩家在room里的位置索引(逻辑位置)

    var index = this.playerdata_list_pos[player_data.seatindex];
    console.log("index " + player_data.seatindex + " " + index);
    playernode_inst.position = this.players_seat_pos.children[index].position;
    playernode_inst.getComponent("player_node").init_data(player_data, index);
  },
  start: function start() {},

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxnYW1lU2NlbmUvLi5cXC4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHNjcmlwdHNcXGdhbWVTY2VuZS9hc3NldHNcXHNjcmlwdHNcXGdhbWVTY2VuZVxcZ2FtZVNjZW5lLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiZGlfbGFiZWwiLCJMYWJlbCIsImJlaXNodV9sYWJlbCIsInJvb21pZF9sYWJlbCIsInBsYXllcl9ub2RlX3ByZWZhYnMiLCJQcmVmYWIiLCJwbGF5ZXJzX3NlYXRfcG9zIiwiTm9kZSIsImdhbWVFbmQiLCJvbkxvYWQiLCJwbGF5ZXJOb2RlTGlzdCIsInN0cmluZyIsIm15Z2xvYmFsIiwicGxheWVyRGF0YSIsImJvdHRvbSIsInJhdGUiLCJyb29tc3RhdGUiLCJSb29tU3RhdGUiLCJST09NX0lOVkFMSUQiLCJub2RlIiwib24iLCJjb25zb2xlIiwibG9nIiwiaSIsImxlbmd0aCIsImVtaXQiLCJiaW5kIiwic29ja2V0Iiwib25Sb29tQ2hhbmdlU3RhdGUiLCJkYXRhIiwiZXZlbnQiLCJnYW1ldWlfbm9kZSIsImdldENoaWxkQnlOYW1lIiwicmVxdWVzdF9lbnRlcl9yb29tIiwiZXJyIiwicmVzdWx0IiwiSlNPTiIsInN0cmluZ2lmeSIsInNlYXRpZCIsInNlYXRpbmRleCIsInBsYXllcmRhdGFfbGlzdF9wb3MiLCJzZXRQbGF5ZXJTZWF0UG9zIiwicGxheWVyZGF0YV9saXN0IiwicGxheWVyZGF0YSIsInJvb21pZCIsImhvdXNlbWFuYWdlaWQiLCJhZGRQbGF5ZXJOb2RlIiwiaXNvcGVuX3NvdW5kIiwiYXVkaW9FbmdpbmUiLCJzdG9wQWxsIiwicGxheSIsInVybCIsInJhdyIsImdhbWViZWZvcmVfbm9kZSIsIm9uUGxheWVySm9pblJvb20iLCJqb2luX3BsYXllcmRhdGEiLCJvblBsYXllclJlYWR5Iiwib25HYW1lU3RhcnQiLCJnYW1lYmVmb3JlVUkiLCJhY3RpdmUiLCJvblJvYlN0YXRlIiwib25DaGFuZ2VNYXN0ZXIiLCJtYXN0ZXJfYWNjb3VudGlkIiwib25TaG93Qm90dG9tQ2FyZCIsInNlYXRfaW5kZXgiLCJwbGF5ZXJfZGF0YSIsInBsYXllcm5vZGVfaW5zdCIsImluc3RhbnRpYXRlIiwicGFyZW50IiwicHVzaCIsImluZGV4IiwicG9zaXRpb24iLCJjaGlsZHJlbiIsImdldENvbXBvbmVudCIsImluaXRfZGF0YSIsInN0YXJ0IiwiZ2V0VXNlck91dENhcmRQb3NCeUFjY291bnQiLCJhY2NvdW50aWQiLCJub2RlX3NjcmlwdCIsInNlYXRfbm9kZSIsImluZGV4X25hbWUiLCJvdXRfY2FyZF9ub2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBRUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0xDLEVBQUFBLFVBQVUsRUFBRTtBQUNSQyxJQUFBQSxRQUFRLEVBQUNKLEVBQUUsQ0FBQ0ssS0FESjtBQUVSQyxJQUFBQSxZQUFZLEVBQUNOLEVBQUUsQ0FBQ0ssS0FGUjtBQUdSRSxJQUFBQSxZQUFZLEVBQUNQLEVBQUUsQ0FBQ0ssS0FIUjtBQUlSRyxJQUFBQSxtQkFBbUIsRUFBQ1IsRUFBRSxDQUFDUyxNQUpmO0FBS1I7QUFDQUMsSUFBQUEsZ0JBQWdCLEVBQUNWLEVBQUUsQ0FBQ1c7QUFOWixHQUhQO0FBWUw7QUFDQUMsRUFBQUEsT0FiSyxxQkFhSSxDQUVSLENBZkk7QUFnQkxDLEVBQUFBLE1BaEJLLG9CQWdCSztBQUNOLFNBQUtDLGNBQUwsR0FBc0IsRUFBdEI7QUFDQSxTQUFLVixRQUFMLENBQWNXLE1BQWQsR0FBdUIsT0FBUUMscUJBQVNDLFVBQVQsQ0FBb0JDLE1BQW5EO0FBQ0EsU0FBS1osWUFBTCxDQUFrQlMsTUFBbEIsR0FBMkIsUUFBUUMscUJBQVNDLFVBQVQsQ0FBb0JFLElBQXZEO0FBQ0EsU0FBS0MsU0FBTCxHQUFpQkMsU0FBUyxDQUFDQyxZQUEzQixDQUpNLENBS047O0FBQ0EsU0FBS0MsSUFBTCxDQUFVQyxFQUFWLENBQWEsc0JBQWIsRUFBb0MsWUFBVTtBQUMxQ0MsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksZ0NBQVo7O0FBQ0EsV0FBSSxJQUFJQyxDQUFDLEdBQUMsQ0FBVixFQUFZQSxDQUFDLEdBQUMsS0FBS2IsY0FBTCxDQUFvQmMsTUFBbEMsRUFBeUNELENBQUMsRUFBMUMsRUFBNkM7QUFDckMsWUFBSUosSUFBSSxHQUFHLEtBQUtULGNBQUwsQ0FBb0JhLENBQXBCLENBQVg7O0FBQ0EsWUFBR0osSUFBSCxFQUFRO0FBQ1I7QUFDSUEsVUFBQUEsSUFBSSxDQUFDTSxJQUFMLENBQVUsaUJBQVY7QUFDSDtBQUNSO0FBQ0osS0FUbUMsQ0FTbENDLElBVGtDLENBUzdCLElBVDZCLENBQXBDLEVBTk0sQ0FpQk47O0FBQ0FkLHlCQUFTZSxNQUFULENBQWdCQyxpQkFBaEIsQ0FBa0MsVUFBU0MsSUFBVCxFQUFjO0FBQzVDO0FBQ0FSLE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLHVCQUFxQk8sSUFBakM7QUFDQSxXQUFLYixTQUFMLEdBQWlCYSxJQUFqQjtBQUNILEtBSmlDLENBSWhDSCxJQUpnQyxDQUkzQixJQUoyQixDQUFsQyxFQWxCTSxDQXVCTjs7O0FBQ0EsU0FBS1AsSUFBTCxDQUFVQyxFQUFWLENBQWEsY0FBYixFQUE0QixVQUFTVSxLQUFULEVBQWU7QUFDdkNULE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLDRCQUEwQlEsS0FBdEMsRUFEdUMsQ0FFdkM7O0FBQ0EsV0FBSSxJQUFJUCxDQUFDLEdBQUMsQ0FBVixFQUFZQSxDQUFDLEdBQUMsS0FBS2IsY0FBTCxDQUFvQmMsTUFBbEMsRUFBeUNELENBQUMsRUFBMUMsRUFBNkM7QUFDekMsWUFBSUosSUFBSSxHQUFHLEtBQUtULGNBQUwsQ0FBb0JhLENBQXBCLENBQVg7O0FBQ0EsWUFBR0osSUFBSCxFQUFRO0FBQ0o7QUFDQUEsVUFBQUEsSUFBSSxDQUFDTSxJQUFMLENBQVUseUJBQVYsRUFBb0NLLEtBQXBDO0FBQ0g7QUFDSjtBQUNKLEtBVjJCLENBVTFCSixJQVYwQixDQVVyQixJQVZxQixDQUE1QjtBQVlBLFNBQUtQLElBQUwsQ0FBVUMsRUFBVixDQUFhLG1CQUFiLEVBQWlDLFVBQVNVLEtBQVQsRUFBZTtBQUM1Q1QsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksc0NBQVo7QUFDQSxVQUFJUyxXQUFXLEdBQUksS0FBS1osSUFBTCxDQUFVYSxjQUFWLENBQXlCLFdBQXpCLENBQW5COztBQUNBLFVBQUdELFdBQVcsSUFBRSxJQUFoQixFQUFxQjtBQUNsQlYsUUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksNEJBQVo7QUFDQTtBQUNGOztBQUNEUyxNQUFBQSxXQUFXLENBQUNOLElBQVosQ0FBaUIsbUJBQWpCLEVBQXFDSyxLQUFyQztBQUVILEtBVGdDLENBUy9CSixJQVQrQixDQVMxQixJQVQwQixDQUFqQztBQVdBLFNBQUtQLElBQUwsQ0FBVUMsRUFBVixDQUFhLHFCQUFiLEVBQW1DLFVBQVNVLEtBQVQsRUFBZTtBQUM5Q1QsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksd0NBQVo7QUFDQSxVQUFJUyxXQUFXLEdBQUksS0FBS1osSUFBTCxDQUFVYSxjQUFWLENBQXlCLFdBQXpCLENBQW5COztBQUNBLFVBQUdELFdBQVcsSUFBRSxJQUFoQixFQUFxQjtBQUNsQlYsUUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksNEJBQVo7QUFDQTtBQUNGOztBQUNEUyxNQUFBQSxXQUFXLENBQUNOLElBQVosQ0FBaUIscUJBQWpCLEVBQXVDSyxLQUF2QztBQUNILEtBUmtDLENBUWpDSixJQVJpQyxDQVE1QixJQVI0QixDQUFuQyxFQS9DTSxDQXdETjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBZCx5QkFBU2UsTUFBVCxDQUFnQk0sa0JBQWhCLENBQW1DLEVBQW5DLEVBQXNDLFVBQVNDLEdBQVQsRUFBYUMsTUFBYixFQUFvQjtBQUN0RGQsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksb0JBQW1CYyxJQUFJLENBQUNDLFNBQUwsQ0FBZUYsTUFBZixDQUEvQjs7QUFDQSxVQUFHRCxHQUFHLElBQUUsQ0FBUixFQUFVO0FBQ1BiLFFBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLHlCQUF1QlksR0FBbkM7QUFDRixPQUZELE1BRUs7QUFFSDtBQUNBO0FBQ0UsWUFBSUksTUFBTSxHQUFHSCxNQUFNLENBQUNJLFNBQXBCLENBSkMsQ0FJNkI7O0FBQzlCLGFBQUtDLG1CQUFMLEdBQTJCLEVBQTNCLENBTEMsQ0FLOEI7O0FBQy9CLGFBQUtDLGdCQUFMLENBQXNCSCxNQUF0QjtBQUVBLFlBQUlJLGVBQWUsR0FBR1AsTUFBTSxDQUFDUSxVQUE3QjtBQUNBLFlBQUlDLE1BQU0sR0FBR1QsTUFBTSxDQUFDUyxNQUFwQjtBQUNBLGFBQUt6QyxZQUFMLENBQWtCUSxNQUFsQixHQUEyQixTQUFTaUMsTUFBcEM7QUFDQWhDLDZCQUFTQyxVQUFULENBQW9CZ0MsYUFBcEIsR0FBb0NWLE1BQU0sQ0FBQ1UsYUFBM0M7O0FBRUEsYUFBSSxJQUFJdEIsQ0FBQyxHQUFDLENBQVYsRUFBWUEsQ0FBQyxHQUFDbUIsZUFBZSxDQUFDbEIsTUFBOUIsRUFBcUNELENBQUMsRUFBdEMsRUFBeUM7QUFDckM7QUFDQSxlQUFLdUIsYUFBTCxDQUFtQkosZUFBZSxDQUFDbkIsQ0FBRCxDQUFsQztBQUNIOztBQUVELFlBQUd3QixZQUFILEVBQWdCO0FBQ1puRCxVQUFBQSxFQUFFLENBQUNvRCxXQUFILENBQWVDLE9BQWY7QUFDQXJELFVBQUFBLEVBQUUsQ0FBQ29ELFdBQUgsQ0FBZUUsSUFBZixDQUFvQnRELEVBQUUsQ0FBQ3VELEdBQUgsQ0FBT0MsR0FBUCxDQUFXLHdCQUFYLENBQXBCLEVBQXlELElBQXpEO0FBQ0Y7QUFDTDs7QUFDRCxVQUFJQyxlQUFlLEdBQUcsS0FBS2xDLElBQUwsQ0FBVWEsY0FBVixDQUF5QixjQUF6QixDQUF0QjtBQUNBcUIsTUFBQUEsZUFBZSxDQUFDNUIsSUFBaEIsQ0FBcUIsTUFBckI7QUFDSCxLQTdCcUMsQ0E2QnBDQyxJQTdCb0MsQ0E2Qi9CLElBN0IrQixDQUF0QyxFQXBFTSxDQW1HTjs7O0FBQ0FkLHlCQUFTZSxNQUFULENBQWdCMkIsZ0JBQWhCLENBQWlDLFVBQVNDLGVBQVQsRUFBeUI7QUFDdEQ7QUFDQWxDLE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLHNCQUFvQmMsSUFBSSxDQUFDQyxTQUFMLENBQWVrQixlQUFmLENBQWhDO0FBQ0EsV0FBS1QsYUFBTCxDQUFtQlMsZUFBbkI7QUFDSCxLQUpnQyxDQUkvQjdCLElBSitCLENBSTFCLElBSjBCLENBQWpDLEVBcEdNLENBMEdOOzs7QUFDQWQseUJBQVNlLE1BQVQsQ0FBZ0I2QixhQUFoQixDQUE4QixVQUFTM0IsSUFBVCxFQUFjO0FBQ3hDUixNQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSwwQkFBd0JPLElBQXBDOztBQUNBLFdBQUksSUFBSU4sQ0FBQyxHQUFDLENBQVYsRUFBWUEsQ0FBQyxHQUFDLEtBQUtiLGNBQUwsQ0FBb0JjLE1BQWxDLEVBQXlDRCxDQUFDLEVBQTFDLEVBQTZDO0FBQ3pDLFlBQUlKLElBQUksR0FBRyxLQUFLVCxjQUFMLENBQW9CYSxDQUFwQixDQUFYOztBQUNBLFlBQUdKLElBQUgsRUFBUTtBQUNKQSxVQUFBQSxJQUFJLENBQUNNLElBQUwsQ0FBVSxxQkFBVixFQUFnQ0ksSUFBaEM7QUFDSDtBQUNKO0FBQ0osS0FSNkIsQ0FRNUJILElBUjRCLENBUXZCLElBUnVCLENBQTlCOztBQVVBZCx5QkFBU2UsTUFBVCxDQUFnQjhCLFdBQWhCLENBQTRCLFlBQVU7QUFDbEMsV0FBSSxJQUFJbEMsQ0FBQyxHQUFDLENBQVYsRUFBWUEsQ0FBQyxHQUFDLEtBQUtiLGNBQUwsQ0FBb0JjLE1BQWxDLEVBQXlDRCxDQUFDLEVBQTFDLEVBQTZDO0FBQ3pDLFlBQUlKLElBQUksR0FBRyxLQUFLVCxjQUFMLENBQW9CYSxDQUFwQixDQUFYOztBQUNBLFlBQUdKLElBQUgsRUFBUTtBQUNKQSxVQUFBQSxJQUFJLENBQUNNLElBQUwsQ0FBVSxpQkFBVjtBQUNIO0FBQ0osT0FOaUMsQ0FRdEM7OztBQUNBLFVBQUlpQyxZQUFZLEdBQUcsS0FBS3ZDLElBQUwsQ0FBVWEsY0FBVixDQUF5QixjQUF6QixDQUFuQjs7QUFDSSxVQUFHMEIsWUFBSCxFQUFnQjtBQUNaQSxRQUFBQSxZQUFZLENBQUNDLE1BQWIsR0FBc0IsS0FBdEI7QUFDSDtBQUNKLEtBYjJCLENBYTFCakMsSUFiMEIsQ0FhckIsSUFicUIsQ0FBNUIsRUFySE0sQ0FvSUE7OztBQUNOZCx5QkFBU2UsTUFBVCxDQUFnQmlDLFVBQWhCLENBQTJCLFVBQVM5QixLQUFULEVBQWU7QUFDbENULE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLG9CQUFrQmMsSUFBSSxDQUFDQyxTQUFMLENBQWVQLEtBQWYsQ0FBOUIsRUFEa0MsQ0FFbEM7O0FBQ0EsV0FBSSxJQUFJUCxDQUFDLEdBQUMsQ0FBVixFQUFZQSxDQUFDLEdBQUMsS0FBS2IsY0FBTCxDQUFvQmMsTUFBbEMsRUFBeUNELENBQUMsRUFBMUMsRUFBNkM7QUFDekMsWUFBSUosSUFBSSxHQUFHLEtBQUtULGNBQUwsQ0FBb0JhLENBQXBCLENBQVg7O0FBQ0EsWUFBR0osSUFBSCxFQUFRO0FBQ0o7QUFDQUEsVUFBQUEsSUFBSSxDQUFDTSxJQUFMLENBQVUsNEJBQVYsRUFBdUNLLEtBQXZDO0FBQ0g7QUFDSjtBQUNSLEtBVjBCLENBVXpCSixJQVZ5QixDQVVwQixJQVZvQixDQUEzQixFQXJJTSxDQWlKTjs7O0FBQ0FkLHlCQUFTZSxNQUFULENBQWdCa0MsY0FBaEIsQ0FBK0IsVUFBUy9CLEtBQVQsRUFBZTtBQUMxQ1QsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksbUJBQWlCUSxLQUE3QixFQUQwQyxDQUUxQzs7QUFDQWxCLDJCQUFTQyxVQUFULENBQW9CaUQsZ0JBQXBCLEdBQXVDaEMsS0FBdkM7O0FBQ0EsV0FBSSxJQUFJUCxDQUFDLEdBQUMsQ0FBVixFQUFZQSxDQUFDLEdBQUMsS0FBS2IsY0FBTCxDQUFvQmMsTUFBbEMsRUFBeUNELENBQUMsRUFBMUMsRUFBNkM7QUFDekMsWUFBSUosSUFBSSxHQUFHLEtBQUtULGNBQUwsQ0FBb0JhLENBQXBCLENBQVg7O0FBQ0EsWUFBR0osSUFBSCxFQUFRO0FBQ0o7QUFDQUEsVUFBQUEsSUFBSSxDQUFDTSxJQUFMLENBQVUsK0JBQVYsRUFBMENLLEtBQTFDO0FBQ0g7QUFDSjtBQUNKLEtBWDhCLENBVzdCSixJQVg2QixDQVd4QixJQVh3QixDQUEvQixFQWxKTSxDQStKTjs7O0FBQ0FkLHlCQUFTZSxNQUFULENBQWdCb0MsZ0JBQWhCLENBQWlDLFVBQVNqQyxLQUFULEVBQWU7QUFDN0NULE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLDhCQUE0QlEsS0FBeEM7QUFDQSxVQUFJQyxXQUFXLEdBQUksS0FBS1osSUFBTCxDQUFVYSxjQUFWLENBQXlCLFdBQXpCLENBQW5COztBQUNBLFVBQUdELFdBQVcsSUFBRSxJQUFoQixFQUFxQjtBQUNsQlYsUUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksNEJBQVo7QUFDQTtBQUNGOztBQUNEUyxNQUFBQSxXQUFXLENBQUNOLElBQVosQ0FBaUIsd0JBQWpCLEVBQTBDSyxLQUExQztBQUNGLEtBUmdDLENBUS9CSixJQVIrQixDQVExQixJQVIwQixDQUFqQztBQVNILEdBekxJO0FBMkxMO0FBQ0FlLEVBQUFBLGdCQTVMSyw0QkE0TFl1QixVQTVMWixFQTRMdUI7QUFDeEIsUUFBR0EsVUFBVSxHQUFHLENBQWIsSUFBa0JBLFVBQVUsR0FBRyxDQUFsQyxFQUFvQztBQUNoQzNDLE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLHFCQUFtQjBDLFVBQS9CO0FBQ0E7QUFDSDs7QUFFRDNDLElBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGlDQUFpQzBDLFVBQTdDLEVBTndCLENBUXhCOztBQUNBLFlBQU9BLFVBQVA7QUFDSSxXQUFLLENBQUw7QUFDTyxhQUFLeEIsbUJBQUwsQ0FBeUIsQ0FBekIsSUFBOEIsQ0FBOUI7QUFDQSxhQUFLQSxtQkFBTCxDQUF5QixDQUF6QixJQUE4QixDQUE5QjtBQUNBLGFBQUtBLG1CQUFMLENBQXlCLENBQXpCLElBQThCLENBQTlCO0FBQ0w7O0FBQ0QsV0FBSyxDQUFMO0FBR08sYUFBS0EsbUJBQUwsQ0FBeUIsQ0FBekIsSUFBOEIsQ0FBOUI7QUFDQSxhQUFLQSxtQkFBTCxDQUF5QixDQUF6QixJQUE4QixDQUE5QjtBQUNBLGFBQUtBLG1CQUFMLENBQXlCLENBQXpCLElBQThCLENBQTlCO0FBQ0E7O0FBQ1AsV0FBSyxDQUFMO0FBQ08sYUFBS0EsbUJBQUwsQ0FBeUIsQ0FBekIsSUFBOEIsQ0FBOUI7QUFDQSxhQUFLQSxtQkFBTCxDQUF5QixDQUF6QixJQUE4QixDQUE5QjtBQUNBLGFBQUtBLG1CQUFMLENBQXlCLENBQXpCLElBQThCLENBQTlCO0FBQ0E7O0FBQ1I7QUFDRTtBQW5CTjtBQXNCSCxHQTNOSTtBQTZOTE0sRUFBQUEsYUE3TksseUJBNk5TbUIsV0E3TlQsRUE2TnFCO0FBQ3RCLFFBQUlDLGVBQWUsR0FBR3RFLEVBQUUsQ0FBQ3VFLFdBQUgsQ0FBZSxLQUFLL0QsbUJBQXBCLENBQXRCO0FBQ0E4RCxJQUFBQSxlQUFlLENBQUNFLE1BQWhCLEdBQXlCLEtBQUtqRCxJQUE5QixDQUZzQixDQUd0Qjs7QUFDQSxTQUFLVCxjQUFMLENBQW9CMkQsSUFBcEIsQ0FBeUJILGVBQXpCLEVBSnNCLENBTXRCOztBQUNBLFFBQUlJLEtBQUssR0FBRyxLQUFLOUIsbUJBQUwsQ0FBeUJ5QixXQUFXLENBQUMxQixTQUFyQyxDQUFaO0FBQ0FsQixJQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxXQUFTMkMsV0FBVyxDQUFDMUIsU0FBckIsR0FBZ0MsR0FBaEMsR0FBb0MrQixLQUFoRDtBQUNBSixJQUFBQSxlQUFlLENBQUNLLFFBQWhCLEdBQTJCLEtBQUtqRSxnQkFBTCxDQUFzQmtFLFFBQXRCLENBQStCRixLQUEvQixFQUFzQ0MsUUFBakU7QUFDQUwsSUFBQUEsZUFBZSxDQUFDTyxZQUFoQixDQUE2QixhQUE3QixFQUE0Q0MsU0FBNUMsQ0FBc0RULFdBQXRELEVBQWtFSyxLQUFsRTtBQUNILEdBeE9JO0FBME9MSyxFQUFBQSxLQTFPSyxtQkEwT0ksQ0FDUixDQTNPSTs7QUE2T0w7Ozs7O0FBS0FDLEVBQUFBLDBCQWxQSyxzQ0FrUHNCQyxTQWxQdEIsRUFrUGdDO0FBQ2pDeEQsSUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksMENBQXdDdUQsU0FBcEQ7O0FBQ0EsU0FBSSxJQUFJdEQsQ0FBQyxHQUFDLENBQVYsRUFBWUEsQ0FBQyxHQUFDLEtBQUtiLGNBQUwsQ0FBb0JjLE1BQWxDLEVBQXlDRCxDQUFDLEVBQTFDLEVBQTZDO0FBQ3pDLFVBQUlKLElBQUksR0FBRyxLQUFLVCxjQUFMLENBQW9CYSxDQUFwQixDQUFYOztBQUNBLFVBQUdKLElBQUgsRUFBUTtBQUNKO0FBQ0EsWUFBSTJELFdBQVcsR0FBRzNELElBQUksQ0FBQ3NELFlBQUwsQ0FBa0IsYUFBbEIsQ0FBbEIsQ0FGSSxDQUdKO0FBQ0E7O0FBQ0EsWUFBR0ssV0FBVyxDQUFDRCxTQUFaLEtBQXdCQSxTQUEzQixFQUFxQztBQUNuQyxjQUFJRSxTQUFTLEdBQUcsS0FBS3pFLGdCQUFMLENBQXNCa0UsUUFBdEIsQ0FBK0JNLFdBQVcsQ0FBQ2QsVUFBM0MsQ0FBaEI7QUFDQSxjQUFJZ0IsVUFBVSxHQUFHLGlCQUFlRixXQUFXLENBQUNkLFVBQTVDLENBRm1DLENBR25DOztBQUNBLGNBQUlpQixhQUFhLEdBQUdGLFNBQVMsQ0FBQy9DLGNBQVYsQ0FBeUJnRCxVQUF6QixDQUFwQixDQUptQyxDQUtuQzs7QUFDQSxpQkFBT0MsYUFBUDtBQUNEO0FBQ0o7QUFDSjs7QUFFRCxXQUFPLElBQVA7QUFDSCxHQXZRSSxDQXdRTDs7QUF4UUssQ0FBVCIsInNvdXJjZVJvb3QiOiIuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc2NyaXB0c1xcZ2FtZVNjZW5lIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG15Z2xvYmFsIGZyb20gXCIuLi9teWdvbGJhbC5qc1wiXHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIGRpX2xhYmVsOmNjLkxhYmVsLFxyXG4gICAgICAgIGJlaXNodV9sYWJlbDpjYy5MYWJlbCxcclxuICAgICAgICByb29taWRfbGFiZWw6Y2MuTGFiZWwsXHJcbiAgICAgICAgcGxheWVyX25vZGVfcHJlZmFiczpjYy5QcmVmYWIsXHJcbiAgICAgICAgLy/nu5HlrprnjqnlrrbluqfkvY0s5LiL6Z2i5pyJM+S4quWtkOiKgueCuVxyXG4gICAgICAgIHBsYXllcnNfc2VhdF9wb3M6Y2MuTm9kZSxcclxuXHJcbiAgICB9LFxyXG4gICAgLy/mnKzlsYDnu5PmnZ/vvIzlgZrnirbmgIHmuIXpmaRcclxuICAgIGdhbWVFbmQoKXtcclxuXHJcbiAgICB9LFxyXG4gICAgb25Mb2FkICgpIHtcclxuICAgICAgICB0aGlzLnBsYXllck5vZGVMaXN0ID0gW11cclxuICAgICAgICB0aGlzLmRpX2xhYmVsLnN0cmluZyA9IFwi5bqVOlwiICsgIG15Z2xvYmFsLnBsYXllckRhdGEuYm90dG9tXHJcbiAgICAgICAgdGhpcy5iZWlzaHVfbGFiZWwuc3RyaW5nID0gXCLlgI3mlbA6XCIgKyBteWdsb2JhbC5wbGF5ZXJEYXRhLnJhdGVcclxuICAgICAgICB0aGlzLnJvb21zdGF0ZSA9IFJvb21TdGF0ZS5ST09NX0lOVkFMSURcclxuICAgICAgICAvL+ebkeWQrO+8jOe7meWFtuS7lueOqeWutuWPkeeJjCjlhoXpg6jkuovku7YpXHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKFwicHVzaGNhcmRfb3RoZXJfZXZlbnRcIixmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImdhbWVzY2VuZSBwdXNoY2FyZF9vdGhlcl9ldmVudFwiKVxyXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPHRoaXMucGxheWVyTm9kZUxpc3QubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5vZGUgPSB0aGlzLnBsYXllck5vZGVMaXN0W2ldXHJcbiAgICAgICAgICAgICAgICAgICAgaWYobm9kZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgLy/nu5lwbGF5ZXJub2Rl6IqC54K55Y+R6YCB5LqL5Lu2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZW1pdChcInB1c2hfY2FyZF9ldmVudFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0uYmluZCh0aGlzKSlcclxuXHJcbiAgICAgICAgLy/nm5HlkKzmiL/pl7TnirbmgIHmlLnlj5jkuovku7ZcclxuICAgICAgICBteWdsb2JhbC5zb2NrZXQub25Sb29tQ2hhbmdlU3RhdGUoZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgIC8v5Zue6LCD55qE5Ye95pWw5Y+C5pWw5piv6L+b5YWl5oi/6Ze055So5oi35raI5oGvXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib25Sb29tQ2hhbmdlU3RhdGU6XCIrZGF0YSlcclxuICAgICAgICAgICAgdGhpcy5yb29tc3RhdGUgPSBkYXRhXHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKVxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKFwiY2Fucm9iX2V2ZW50XCIsZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImdhbWVzY2VuZSBjYW5yb2JfZXZlbnQ6XCIrZXZlbnQpXHJcbiAgICAgICAgICAgIC8v6YCa55+l57uZcGxheWVybm9kZeWtkOiKgueCuVxyXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPHRoaXMucGxheWVyTm9kZUxpc3QubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IHRoaXMucGxheWVyTm9kZUxpc3RbaV1cclxuICAgICAgICAgICAgICAgIGlmKG5vZGUpe1xyXG4gICAgICAgICAgICAgICAgICAgIC8v57uZcGxheWVybm9kZeiKgueCueWPkemAgeS6i+S7tlxyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUuZW1pdChcInBsYXllcm5vZGVfY2Fucm9iX2V2ZW50XCIsZXZlbnQpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LmJpbmQodGhpcykpXHJcblxyXG4gICAgICAgIHRoaXMubm9kZS5vbihcImNob29zZV9jYXJkX2V2ZW50XCIsZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLS0tY2hvb3NlX2NhcmRfZXZlbnQtLS0tLS0tLS0tLVwiKVxyXG4gICAgICAgICAgICB2YXIgZ2FtZXVpX25vZGUgPSAgdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKFwiZ2FtZWluZ1VJXCIpXHJcbiAgICAgICAgICAgIGlmKGdhbWV1aV9ub2RlPT1udWxsKXtcclxuICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJnZXQgY2hpbGRlciBuYW1lIGdhbWVpbmdVSVwiKVxyXG4gICAgICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnYW1ldWlfbm9kZS5lbWl0KFwiY2hvb3NlX2NhcmRfZXZlbnRcIixldmVudClcclxuICAgICAgICAgICBcclxuICAgICAgICB9LmJpbmQodGhpcykpXHJcblxyXG4gICAgICAgIHRoaXMubm9kZS5vbihcInVuY2hvb3NlX2NhcmRfZXZlbnRcIixmdW5jdGlvbihldmVudCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tLS11bmNob29zZV9jYXJkX2V2ZW50LS0tLS0tLS0tLS1cIilcclxuICAgICAgICAgICAgdmFyIGdhbWV1aV9ub2RlID0gIHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcImdhbWVpbmdVSVwiKVxyXG4gICAgICAgICAgICBpZihnYW1ldWlfbm9kZT09bnVsbCl7XHJcbiAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ2V0IGNoaWxkZXIgbmFtZSBnYW1laW5nVUlcIilcclxuICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ2FtZXVpX25vZGUuZW1pdChcInVuY2hvb3NlX2NhcmRfZXZlbnRcIixldmVudClcclxuICAgICAgICB9LmJpbmQodGhpcykpXHJcbiAgICAgICAgLy/nm5HlkKznu5nnjqnlrrbmt7vliqDkuInlvKDlupXniYxcclxuICAgICAgICAvLyB0aGlzLm5vZGUub24oXCJhZGRfdGhyZWVfY2FyZFwiLGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCJhZGRfdGhyZWVfY2FyZDpcIitldmVudClcclxuICAgICAgICAvLyAgICAgZm9yKHZhciBpPTA7aTx0aGlzLnBsYXllck5vZGVMaXN0Lmxlbmd0aDtpKyspe1xyXG4gICAgICAgIC8vICAgICAgICAgdmFyIG5vZGUgPSB0aGlzLnBsYXllck5vZGVMaXN0W2ldXHJcbiAgICAgICAgLy8gICAgICAgICBpZihub2RlKXtcclxuICAgICAgICAvLyAgICAgICAgICAgICAvL+e7mXBsYXllcm5vZGXoioLngrnlj5HpgIHkuovku7ZcclxuICAgICAgICAvLyAgICAgICAgICAgICBub2RlLmVtaXQoXCJwbGF5ZXJub2RlX2FkZF90aHJlZV9jYXJkXCIsZXZlbnQpXHJcbiAgICAgICAgLy8gICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyB9LmJpbmQodGhpcykpXHJcblxyXG4gICAgICAgIG15Z2xvYmFsLnNvY2tldC5yZXF1ZXN0X2VudGVyX3Jvb20oe30sZnVuY3Rpb24oZXJyLHJlc3VsdCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZW50ZXJfcm9vbV9yZXNwXCIrIEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpXHJcbiAgICAgICAgICAgIGlmKGVyciE9MCl7XHJcbiAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZW50ZXJfcm9vbV9yZXNwIGVycjpcIitlcnIpXHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgLy9lbnRlcl9yb29t5oiQ5YqfXHJcbiAgICAgICAgICAgICAgLy9ub3RpZnkgPXtcInNlYXRpZFwiOjEsXCJwbGF5ZXJkYXRhXCI6W3tcImFjY291bnRpZFwiOlwiMjExNzgzNlwiLFwibmlja19uYW1lXCI6XCJ0aW55NTQzXCIsXCJhdmF0YXJVcmxcIjpcImh0dHA6Ly94eHhcIixcImdvbGRjb3VudFwiOjEwMDB9XX1cclxuICAgICAgICAgICAgICAgIHZhciBzZWF0aWQgPSByZXN1bHQuc2VhdGluZGV4IC8v6Ieq5bex5Zyo5oi/6Ze06YeM55qEc2VhdGlkXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllcmRhdGFfbGlzdF9wb3MgPSBbXSAgLy8z5Liq55So5oi35Yib5bu65LiA5Liq56m655So5oi35YiX6KGoXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFBsYXllclNlYXRQb3Moc2VhdGlkKVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBwbGF5ZXJkYXRhX2xpc3QgPSByZXN1bHQucGxheWVyZGF0YVxyXG4gICAgICAgICAgICAgICAgdmFyIHJvb21pZCA9IHJlc3VsdC5yb29taWRcclxuICAgICAgICAgICAgICAgIHRoaXMucm9vbWlkX2xhYmVsLnN0cmluZyA9IFwi5oi/6Ze05Y+3OlwiICsgcm9vbWlkXHJcbiAgICAgICAgICAgICAgICBteWdsb2JhbC5wbGF5ZXJEYXRhLmhvdXNlbWFuYWdlaWQgPSByZXN1bHQuaG91c2VtYW5hZ2VpZFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDtpPHBsYXllcmRhdGFfbGlzdC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbC5sb2coXCJ0aGlzLS0tLVwiK3RoaXMpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRQbGF5ZXJOb2RlKHBsYXllcmRhdGFfbGlzdFtpXSlcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZihpc29wZW5fc291bmQpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnN0b3BBbGwoKVxyXG4gICAgICAgICAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXkoY2MudXJsLnJhdyhcInJlc291cmNlcy9zb3VuZC9iZy5tcDNcIiksdHJ1ZSkgXHJcbiAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBnYW1lYmVmb3JlX25vZGUgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJnYW1lYmVmb3JlVUlcIilcclxuICAgICAgICAgICAgZ2FtZWJlZm9yZV9ub2RlLmVtaXQoXCJpbml0XCIpXHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKVxyXG5cclxuICAgICAgICAvL+WcqOi/m+WFpeaIv+mXtOWQju+8jOazqOWGjOWFtuS7lueOqeWutui/m+WFpeaIv+mXtOeahOS6i+S7tlxyXG4gICAgICAgIG15Z2xvYmFsLnNvY2tldC5vblBsYXllckpvaW5Sb29tKGZ1bmN0aW9uKGpvaW5fcGxheWVyZGF0YSl7XHJcbiAgICAgICAgICAgIC8v5Zue6LCD55qE5Ye95pWw5Y+C5pWw5piv6L+b5YWl5oi/6Ze055So5oi35raI5oGvXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib25QbGF5ZXJKb2luUm9vbTpcIitKU09OLnN0cmluZ2lmeShqb2luX3BsYXllcmRhdGEpKVxyXG4gICAgICAgICAgICB0aGlzLmFkZFBsYXllck5vZGUoam9pbl9wbGF5ZXJkYXRhKVxyXG4gICAgICAgIH0uYmluZCh0aGlzKSlcclxuICAgICAgICBcclxuICAgICAgICAvL+Wbnuiwg+WPguaVsOaYr+WPkemAgeWHhuWkh+a2iOaBr+eahGFjY291bnRpZFxyXG4gICAgICAgIG15Z2xvYmFsLnNvY2tldC5vblBsYXllclJlYWR5KGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLS1vblBsYXllclJlYWR5OlwiK2RhdGEpXHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8dGhpcy5wbGF5ZXJOb2RlTGlzdC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy5wbGF5ZXJOb2RlTGlzdFtpXVxyXG4gICAgICAgICAgICAgICAgaWYobm9kZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5lbWl0KFwicGxheWVyX3JlYWR5X25vdGlmeVwiLGRhdGEpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LmJpbmQodGhpcykpXHJcblxyXG4gICAgICAgIG15Z2xvYmFsLnNvY2tldC5vbkdhbWVTdGFydChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPHRoaXMucGxheWVyTm9kZUxpc3QubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IHRoaXMucGxheWVyTm9kZUxpc3RbaV1cclxuICAgICAgICAgICAgICAgIGlmKG5vZGUpe1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUuZW1pdChcImdhbWVzdGFydF9ldmVudFwiKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIC8v6ZqQ6JePZ2FtZWJlZm9yZVVJ6IqC54K5XHJcbiAgICAgICAgdmFyIGdhbWViZWZvcmVVSSA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcImdhbWViZWZvcmVVSVwiKVxyXG4gICAgICAgICAgICBpZihnYW1lYmVmb3JlVUkpe1xyXG4gICAgICAgICAgICAgICAgZ2FtZWJlZm9yZVVJLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LmJpbmQodGhpcykpXHJcblxyXG4gICAgICAgICAgICAgIC8v55uR5ZCs5pyN5Yqh5Zmo546p5a625oqi5Zyw5Li75raI5oGvXHJcbiAgICAgICAgbXlnbG9iYWwuc29ja2V0Lm9uUm9iU3RhdGUoZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCItLS0tLW9uUm9iU3RhdGVcIitKU09OLnN0cmluZ2lmeShldmVudCkpXHJcbiAgICAgICAgICAgICAgICAvL29uUm9iU3RhdGV7XCJhY2NvdW50aWRcIjpcIjIxNjI4NjZcIixcInN0YXRlXCI6MX1cclxuICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8dGhpcy5wbGF5ZXJOb2RlTGlzdC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IHRoaXMucGxheWVyTm9kZUxpc3RbaV1cclxuICAgICAgICAgICAgICAgICAgICBpZihub2RlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy/nu5lwbGF5ZXJub2Rl6IqC54K55Y+R6YCB5LqL5Lu2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZW1pdChcInBsYXllcm5vZGVfcm9iX3N0YXRlX2V2ZW50XCIsZXZlbnQpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIH0uYmluZCh0aGlzKSlcclxuXHJcbiAgICAgICAgLy/ms6jlhoznm5HlkKzmnI3liqHlmajnoa7lrprlnLDkuLvmtojmga9cclxuICAgICAgICBteWdsb2JhbC5zb2NrZXQub25DaGFuZ2VNYXN0ZXIoZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9uQ2hhbmdlTWFzdGVyXCIrZXZlbnQpXHJcbiAgICAgICAgICAgIC8v5L+d5a2Y5LiA5LiL5Zyw5Li7aWRcclxuICAgICAgICAgICAgbXlnbG9iYWwucGxheWVyRGF0YS5tYXN0ZXJfYWNjb3VudGlkID0gZXZlbnRcclxuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTx0aGlzLnBsYXllck5vZGVMaXN0Lmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIG5vZGUgPSB0aGlzLnBsYXllck5vZGVMaXN0W2ldXHJcbiAgICAgICAgICAgICAgICBpZihub2RlKXtcclxuICAgICAgICAgICAgICAgICAgICAvL+e7mXBsYXllcm5vZGXoioLngrnlj5HpgIHkuovku7ZcclxuICAgICAgICAgICAgICAgICAgICBub2RlLmVtaXQoXCJwbGF5ZXJub2RlX2NoYW5nZW1hc3Rlcl9ldmVudFwiLGV2ZW50KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8v5rOo5YaM55uR5ZCs5pyN5Yqh5Zmo5pi+56S65bqV54mM5raI5oGvXHJcbiAgICAgICAgbXlnbG9iYWwuc29ja2V0Lm9uU2hvd0JvdHRvbUNhcmQoZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICAgICAgIGNvbnNvbGUubG9nKFwib25TaG93Qm90dG9tQ2FyZC0tLS0tLS0tLVwiK2V2ZW50KVxyXG4gICAgICAgICAgIHZhciBnYW1ldWlfbm9kZSA9ICB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJnYW1laW5nVUlcIilcclxuICAgICAgICAgICBpZihnYW1ldWlfbm9kZT09bnVsbCl7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJnZXQgY2hpbGRlciBuYW1lIGdhbWVpbmdVSVwiKVxyXG4gICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBnYW1ldWlfbm9kZS5lbWl0KFwic2hvd19ib3R0b21fY2FyZF9ldmVudFwiLGV2ZW50KVxyXG4gICAgICAgIH0uYmluZCh0aGlzKSlcclxuICAgIH0sXHJcblxyXG4gICAgLy9zZWF0X2luZGV46Ieq5bex5Zyo5oi/6Ze055qE5L2N572uaWRcclxuICAgIHNldFBsYXllclNlYXRQb3Moc2VhdF9pbmRleCl7XHJcbiAgICAgICAgaWYoc2VhdF9pbmRleCA8IDEgfHwgc2VhdF9pbmRleCA+IDMpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNlYXRfaW5kZXggZXJyb3JcIitzZWF0X2luZGV4KVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwic2V0UGxheWVyU2VhdFBvcyBzZWF0X2luZGV4OlwiICsgc2VhdF9pbmRleClcclxuICAgICAgIFxyXG4gICAgICAgIC8v55WM6Z2i5L2N572u6L2s5YyW5oiQ6YC76L6R5L2N572uXHJcbiAgICAgICAgc3dpdGNoKHNlYXRfaW5kZXgpe1xyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXllcmRhdGFfbGlzdF9wb3NbMV0gPSAwXHJcbiAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXllcmRhdGFfbGlzdF9wb3NbMl0gPSAxIFxyXG4gICAgICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJkYXRhX2xpc3RfcG9zWzNdID0gMlxyXG4gICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJkYXRhX2xpc3RfcG9zWzJdID0gMFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGxheWVyZGF0YV9saXN0X3Bvc1szXSA9IDFcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXllcmRhdGFfbGlzdF9wb3NbMV0gPSAyXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXllcmRhdGFfbGlzdF9wb3NbM10gPSAwICAgICBcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXllcmRhdGFfbGlzdF9wb3NbMV0gPSAxXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJkYXRhX2xpc3RfcG9zWzJdID0gMlxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IFxyXG4gICAgICAgICAgICAgIGJyZWFrICAgICAgXHJcbiAgICAgICAgfSBcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIGFkZFBsYXllck5vZGUocGxheWVyX2RhdGEpe1xyXG4gICAgICAgIHZhciBwbGF5ZXJub2RlX2luc3QgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnBsYXllcl9ub2RlX3ByZWZhYnMpXHJcbiAgICAgICAgcGxheWVybm9kZV9pbnN0LnBhcmVudCA9IHRoaXMubm9kZVxyXG4gICAgICAgIC8v5Yib5bu655qE6IqC54K55a2Y5YKo5ZyoZ2FtZXNjZW5l55qE5YiX6KGo5LitXHJcbiAgICAgICAgdGhpcy5wbGF5ZXJOb2RlTGlzdC5wdXNoKHBsYXllcm5vZGVfaW5zdClcclxuXHJcbiAgICAgICAgLy/njqnlrrblnKhyb29t6YeM55qE5L2N572u57Si5byVKOmAu+i+keS9jee9rilcclxuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnBsYXllcmRhdGFfbGlzdF9wb3NbcGxheWVyX2RhdGEuc2VhdGluZGV4XVxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiaW5kZXggXCIrcGxheWVyX2RhdGEuc2VhdGluZGV4KyBcIiBcIitpbmRleClcclxuICAgICAgICBwbGF5ZXJub2RlX2luc3QucG9zaXRpb24gPSB0aGlzLnBsYXllcnNfc2VhdF9wb3MuY2hpbGRyZW5baW5kZXhdLnBvc2l0aW9uXHJcbiAgICAgICAgcGxheWVybm9kZV9pbnN0LmdldENvbXBvbmVudChcInBsYXllcl9ub2RlXCIpLmluaXRfZGF0YShwbGF5ZXJfZGF0YSxpbmRleClcclxuICAgIH0sXHJcblxyXG4gICAgc3RhcnQgKCkge1xyXG4gICAgfSxcclxuXHJcbiAgICAvKlxyXG4gICAgIC8v6YCa6L+HYWNjb3VudGlk6I635Y+W55So5oi35Ye654mM5pS+5ZyoZ2FtZXNjZW5k55qE5L2N572uIFxyXG4gICAgIOWBmuazle+8muWFiOaUvjPkuKroioLngrnlnKhnYW1lYWNlbmXnmoTlnLrmma/kuK1jYXJkc291dHpvbmUoMDEyKVxyXG4gICAgICAgICAgIFxyXG4gICAgKi9cclxuICAgIGdldFVzZXJPdXRDYXJkUG9zQnlBY2NvdW50KGFjY291bnRpZCl7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJnZXRVc2VyT3V0Q2FyZFBvc0J5QWNjb3VudCBhY2NvdW50aWQ6XCIrYWNjb3VudGlkKVxyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8dGhpcy5wbGF5ZXJOb2RlTGlzdC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdmFyIG5vZGUgPSB0aGlzLnBsYXllck5vZGVMaXN0W2ldXHJcbiAgICAgICAgICAgIGlmKG5vZGUpe1xyXG4gICAgICAgICAgICAgICAgLy/ojrflj5boioLngrnnu5HlrprnmoTnu4Tku7ZcclxuICAgICAgICAgICAgICAgIHZhciBub2RlX3NjcmlwdCA9IG5vZGUuZ2V0Q29tcG9uZW50KFwicGxheWVyX25vZGVcIilcclxuICAgICAgICAgICAgICAgIC8v5aaC5p6cYWNjb3VudGlk5ZKMcGxheWVyX25vZGXoioLngrnnu5HlrprnmoRhY2NvdW50aWTnm7jlkIxcclxuICAgICAgICAgICAgICAgIC8v5o6l6I635Y+WcGxheWVyX25vZGXnmoTlrZDoioLngrlcclxuICAgICAgICAgICAgICAgIGlmKG5vZGVfc2NyaXB0LmFjY291bnRpZD09PWFjY291bnRpZCl7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBzZWF0X25vZGUgPSB0aGlzLnBsYXllcnNfc2VhdF9wb3MuY2hpbGRyZW5bbm9kZV9zY3JpcHQuc2VhdF9pbmRleF1cclxuICAgICAgICAgICAgICAgICAgdmFyIGluZGV4X25hbWUgPSBcImNhcmRzb3V0em9uZVwiK25vZGVfc2NyaXB0LnNlYXRfaW5kZXhcclxuICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImdldFVzZXJPdXRDYXJkUG9zQnlBY2NvdW50IGluZGV4X25hbWU6XCIraW5kZXhfbmFtZSlcclxuICAgICAgICAgICAgICAgICAgdmFyIG91dF9jYXJkX25vZGUgPSBzZWF0X25vZGUuZ2V0Q2hpbGRCeU5hbWUoaW5kZXhfbmFtZSlcclxuICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIk91dFpvbmU6XCIrIG91dF9jYXJkX25vZGUubmFtZSlcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIG91dF9jYXJkX25vZGVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG51bGxcclxuICAgIH0sXHJcbiAgICAvLyB1cGRhdGUgKGR0KSB7fSxcclxufSk7XHJcbiJdfQ==