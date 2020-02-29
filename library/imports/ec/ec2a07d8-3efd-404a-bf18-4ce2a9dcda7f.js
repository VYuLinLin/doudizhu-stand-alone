"use strict";
cc._RF.push(module, 'ec2a0fYPv1ASr8YTOKp3Np/', 'player');
// scripts/data/player.js

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var getRandomStr = function getRandomStr(count) {
  var str = '';

  for (var i = 0; i < count; i++) {
    str += Math.floor(Math.random() * 10);
  }

  return str;
};

var playerData = function playerData() {
  var userData = JSON.parse(cc.sys.localStorage.getItem('userData'));
  var _ref = [getRandomStr(5), getRandomStr(5)],
      rootId1 = _ref[0],
      rootId2 = _ref[1];
  var that = userData || {
    userId: '',
    // 用户id
    userName: '',
    // 用户名称，guest_ 开头
    roomId: '',
    // 游戏房间id
    seatindex: 0,
    // 作为id
    avatarUrl: 'avatar_1',
    // 头像
    goldcount: 10000,
    // 金额
    rootList: [{
      seatindex: 1,
      userId: rootId1,
      userName: "guest_".concat(rootId1),
      "avatarUrl": "avatar_2",
      "goldcount": getRandomStr(4)
    }, {
      seatindex: 2,
      userId: rootId2,
      userName: "guest_".concat(rootId2),
      "avatarUrl": "avatar_3",
      "goldcount": getRandomStr(4)
    }],
    masterUserId: '' // 地主id

  }; // that.uniqueID = 1 + getRandomStr(6)

  that.gobal_count = cc.sys.localStorage.getItem('user_count'); // that.master_accountid = 0

  if (!userData) {
    console.log(userData);
    cc.sys.localStorage.setItem('userData', JSON.stringify(that));
  }

  return that;
};

var _default = playerData;
exports["default"] = _default;
module.exports = exports["default"];

cc._RF.pop();