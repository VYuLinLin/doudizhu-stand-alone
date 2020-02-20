"use strict";
cc._RF.push(module, '34b69bK3SJBFbE0zzOU1X9M', 'gamebeforeUI');
// scripts/gameScene/gamebeforeUI.js

"use strict";

var _mygolbal = _interopRequireDefault(require("../mygolbal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_ready: cc.Node,
    btn_gamestart: cc.Node
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    this.btn_gamestart.active = false;
    this.btn_ready.active = false; //监听本地的发送的消息

    this.node.on("init", function () {
      console.log("game beforeui init");
      console.log("myglobal.playerData.housemanageid" + _mygolbal["default"].playerData.housemanageid);
      console.log("myglobal.playerData.accountID" + _mygolbal["default"].playerData.accountID);

      if (_mygolbal["default"].playerData.housemanageid == _mygolbal["default"].playerData.accountID) {
        //自己就是房主
        this.btn_gamestart.active = true;
        this.btn_ready.active = false;
      } else {
        this.btn_gamestart.active = false;
        this.btn_ready.active = true;
      }
    }.bind(this)); //监听服务器发送来的消息
    // myglobal.socket.onGameStart(function(){
    //     console.log("gamebrforeUI onGameStart revice")
    //     this.node.active = false
    // }.bind(this))

    _mygolbal["default"].socket.onChangeHouseManage(function (data) {
      console.log("gamebrforeUI onChangeHouseManage revice" + JSON.stringify(data));
      _mygolbal["default"].playerData.housemanageid = data;

      if (_mygolbal["default"].playerData.housemanageid == _mygolbal["default"].playerData.accountID) {
        //自己就是房主
        this.btn_gamestart.active = true;
        this.btn_ready.active = false;
      } else {
        this.btn_gamestart.active = false;
        this.btn_ready.active = true;
      }
    }.bind(this));
  },
  start: function start() {},
  // update (dt) {},
  onButtonClick: function onButtonClick(event, customData) {
    switch (customData) {
      case "btn_ready":
        console.log("btn_ready");

        _mygolbal["default"].socket.requestReady();

        break;

      case "btn_start":
        // if(isopen_sound){
        //    cc.audioEngine.play(cc.url.raw("resources/sound/start_a.ogg")) 
        //  }
        console.log("btn_start");

        _mygolbal["default"].socket.requestStart(function (err, data) {
          if (err != 0) {
            console.log("requestStart err" + err);
          } else {
            console.log("requestStart data" + JSON.stringify(data));
          }
        });

        break;

      default:
        break;
    }
  }
});

cc._RF.pop();