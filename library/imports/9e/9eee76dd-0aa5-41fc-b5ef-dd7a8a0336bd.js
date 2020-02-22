"use strict";
cc._RF.push(module, '9eee7bdCqVB/LXv3XqKAza9', 'hallScene');
// scripts/hallscene/hallScene.js

"use strict";

var _mygolbal = _interopRequireDefault(require("../mygolbal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

cc.Class({
  "extends": cc.Component,
  properties: {
    nickname_label: cc.Label,
    headimage: cc.Sprite,
    gobal_count: cc.Label,
    creatroom_prefabs: cc.Prefab,
    joinroom_prefabs: cc.Prefab
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    this.nickname_label.string = _mygolbal["default"].playerData.userName;
  },
  start: function start() {},
  // update (dt) {},
  onButtonClick: function onButtonClick(event, customData) {
    switch (customData) {
      case "create_room":
        var creator_Room = cc.instantiate(this.creatroom_prefabs);
        creator_Room.parent = this.node;
        creator_Room.zIndex = 100;
        break;

      case "join_room":
        var join_Room = cc.instantiate(this.joinroom_prefabs);
        join_Room.parent = this.node;
        join_Room.zIndex = 100;
        break;

      default:
        break;
    }
  },
  onBtnJingdian: function onBtnJingdian() {
    var creator_Room = cc.instantiate(this.creatroom_prefabs);
    creator_Room.parent = this.node;
    creator_Room.zIndex = 100;
  },
  onBtnLaizi: function onBtnLaizi() {
    alert('暂未开放');
  }
});

cc._RF.pop();