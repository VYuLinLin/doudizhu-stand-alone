"use strict";
cc._RF.push(module, 'd9667atqdBHIb60A67blB9L', 'mygolbal');
// scripts/mygolbal.js

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _socket_ctr = _interopRequireDefault(require("./data/socket_ctr.js"));

var _player = _interopRequireDefault(require("./data/player.js"));

var _event_lister = _interopRequireDefault(require("./util/event_lister.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var myglobal = {} || myglobal;
myglobal.socket = (0, _socket_ctr["default"])();
myglobal.playerData = (0, _player["default"])();
myglobal.eventlister = (0, _event_lister["default"])({});
var _default = myglobal;
exports["default"] = _default;
module.exports = exports["default"];

cc._RF.pop();