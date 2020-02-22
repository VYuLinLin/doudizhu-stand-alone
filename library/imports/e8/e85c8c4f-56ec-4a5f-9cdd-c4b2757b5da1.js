"use strict";
cc._RF.push(module, 'e85c8xPVuxKX5zdxLJ1e12h', 'creatRoom');
// scripts/hallscene/prefabs_script/creatRoom.js

"use strict";

var _mygolbal = _interopRequireDefault(require("../../mygolbal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

cc.Class({
  "extends": cc.Component,
  properties: {},
  // LIFE-CYCLE CALLBACKS:
  // onLoad () {},
  start: function start() {},
  // update (dt) {},
  onBtnClose: function onBtnClose() {
    this.node.destroy();
  },
  // 进入游戏房间
  onButtonClick: function onButtonClick(event, value) {
    var _defines$jdRoomConfig = defines.jdRoomConfig['rate_' + value],
        bottom = _defines$jdRoomConfig.bottom,
        rate = _defines$jdRoomConfig.rate;
    var roomId = "".concat(rate, "_").concat(bottom, "_").concat(Math.floor(Math.random() * 1000));
    _mygolbal["default"].playerData.bottom = bottom;
    _mygolbal["default"].playerData.rate = rate;
    _mygolbal["default"].playerData.roomId = roomId;
    cc.sys.localStorage.setItem('userData', JSON.stringify(_mygolbal["default"].playerData));
    cc.director.loadScene("gameScene");
    this.node.destroy();
  }
});

cc._RF.pop();