
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/data/socket_ctr.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '9ce03TvsElJsaLzLDlseCff', 'socket_ctr');
// scripts/data/socket_ctr.js

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _event_lister = _interopRequireDefault(require("../util/event_lister.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

window.$socket = (0, _event_lister["default"])({});

var socketCtr = function socketCtr() {
  var that = {};
  var respone_map = {};
  var call_index = 0;
  var _socket = null; // var $socket = eventlister({})

  var _sendmsg = function _sendmsg(cmdtype, req, callindex) {
    _socket.emit("notify", {
      cmd: cmdtype,
      data: req,
      callindex: callindex
    });
  };

  var _request = function _request(cmdtype, req, callback) {
    console.log("send cmd:" + cmdtype + "  " + JSON.stringify(req));
    call_index++;
    respone_map[call_index] = callback;

    _sendmsg(cmdtype, req, call_index);
  };

  that.initSocket = function () {
    var opts = {
      'reconnection': false,
      'force new connection': true,
      'transports': ['websocket', 'polling']
    };
    _socket = window.io.connect(defines.serverUrl, opts);

    _socket.on("connection", function () {
      console.log("connect server success!!");
    });

    _socket.on("notify", function (res) {
      console.log("on notify cmd:" + JSON.stringify(res));

      if (respone_map.hasOwnProperty(res.callBackIndex)) {
        var callback = respone_map[res.callBackIndex];

        if (callback) {
          callback(res.result, res.data);
        }
      } else {
        //if(res.callBackIndex!=0){
        //console.log("not found call index",res.callBackIndex)
        //提交一个监听的事件给监听器
        //  on notify cmd:{"type":"player_joinroom_notify","result":0,"data":
        //  {"accountid":"2586422","userName":"tiny110","avatarUrl":
        //  "avatar_3","goldcount":1000,"seatindex":2},"callBackIndex":null}
        //没有找到回到函数，就给事件监听器提交一个事件
        var type = res.type;
        $socket.emit(type, res.data); // }
      }
    });
  };

  that.request_wxLogin = function (req, callback) {
    _request("wxlogin", req, callback);
  };

  that.request_creatroom = function (req, callback) {
    _request("createroom_req", req, callback);
  };

  that.request_jion = function (req, callback) {
    _request("joinroom_req", req, callback);
  };

  that.request_enter_room = function (req, callback) {
    _request("enterroom_req", req, callback);
  }; //发送不出牌信息


  that.request_buchu_card = function (req, callback) {
    _request("chu_bu_card_req", req, callback);
  };
  /*玩家出牌
    需要判断: 
       出的牌是否符合规则
       和上个出牌玩家比较，是否满足条件
    */


  that.request_chu_card = function (req, callback) {
    _request("chu_card_req", req, callback);
  }; //监听其他玩家进入房间消息


  that.onPlayerJoinRoom = function (callback) {
    $socket.on("player_joinroom_notify", callback);
  };

  that.onPlayerReady = function (callback) {
    $socket.on("player_ready_notify", callback);
  };

  that.onGameStart = function (callback) {
    if (callback) {
      $socket.on("gameStart_notify", callback);
    }
  };

  that.onChangeHouseManage = function (callback) {
    if (callback) {
      $socket.on("changehousemanage_notify", callback);
    }
  }; //发送ready消息


  that.requestReady = function () {
    _sendmsg("player_ready_notify", {}, null);
  };

  that.requestStart = function (callback) {
    _request("player_start_notify", {}, callback);
  }; //玩家通知服务器抢地主消息


  that.requestRobState = function (state) {
    _sendmsg("player_rob_notify", state, null);
  }; //服务器下发牌通知


  that.onPushCards = function (callback) {
    if (callback) {
      $socket.on("pushcard_notify", callback);
    }
  }; //监听服务器通知开始抢地主消息


  that.onCanRobState = function (callback) {
    if (callback) {
      $socket.on("canrob_notify", callback);
    }
  }; //监听服务器:通知谁抢地主操作消息


  that.onRobState = function (callback) {
    if (callback) {
      $socket.on("canrob_state_notify", callback);
    }
  }; //监听服务器:确定地主消息


  that.onChangeMaster = function (callback) {
    if (callback) {
      $socket.on("change_master_notify", callback);
    }
  }; //监听服务器:显示底牌消息


  that.onShowBottomCard = function (callback) {
    if (callback) {
      $socket.on("change_showcard_notify", callback);
    }
  }; //监听服务器:可以出牌消息


  that.onCanChuCard = function (callback) {
    if (callback) {
      $socket.on("can_chu_card_notify", callback);
    }
  };

  that.onRoomChangeState = function (callback) {
    if (callback) {
      $socket.on("room_state_notify", callback);
    }
  };

  that.onOtherPlayerChuCard = function (callback) {
    if (callback) {
      $socket.on("other_chucard_notify", callback);
    }
  };

  return that;
};

var _default = socketCtr;
exports["default"] = _default;
module.exports = exports["default"];

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxkYXRhLy4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxkYXRhL2Fzc2V0c1xcc2NyaXB0c1xcZGF0YVxcc29ja2V0X2N0ci5qcyJdLCJuYW1lcyI6WyJ3aW5kb3ciLCIkc29ja2V0Iiwic29ja2V0Q3RyIiwidGhhdCIsInJlc3BvbmVfbWFwIiwiY2FsbF9pbmRleCIsIl9zb2NrZXQiLCJfc2VuZG1zZyIsImNtZHR5cGUiLCJyZXEiLCJjYWxsaW5kZXgiLCJlbWl0IiwiY21kIiwiZGF0YSIsIl9yZXF1ZXN0IiwiY2FsbGJhY2siLCJjb25zb2xlIiwibG9nIiwiSlNPTiIsInN0cmluZ2lmeSIsImluaXRTb2NrZXQiLCJvcHRzIiwiaW8iLCJjb25uZWN0IiwiZGVmaW5lcyIsInNlcnZlclVybCIsIm9uIiwicmVzIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsQmFja0luZGV4IiwicmVzdWx0IiwidHlwZSIsInJlcXVlc3Rfd3hMb2dpbiIsInJlcXVlc3RfY3JlYXRyb29tIiwicmVxdWVzdF9qaW9uIiwicmVxdWVzdF9lbnRlcl9yb29tIiwicmVxdWVzdF9idWNodV9jYXJkIiwicmVxdWVzdF9jaHVfY2FyZCIsIm9uUGxheWVySm9pblJvb20iLCJvblBsYXllclJlYWR5Iiwib25HYW1lU3RhcnQiLCJvbkNoYW5nZUhvdXNlTWFuYWdlIiwicmVxdWVzdFJlYWR5IiwicmVxdWVzdFN0YXJ0IiwicmVxdWVzdFJvYlN0YXRlIiwic3RhdGUiLCJvblB1c2hDYXJkcyIsIm9uQ2FuUm9iU3RhdGUiLCJvblJvYlN0YXRlIiwib25DaGFuZ2VNYXN0ZXIiLCJvblNob3dCb3R0b21DYXJkIiwib25DYW5DaHVDYXJkIiwib25Sb29tQ2hhbmdlU3RhdGUiLCJvbk90aGVyUGxheWVyQ2h1Q2FyZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0FBLE1BQU0sQ0FB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QUFrQjtBQUMxQyxRQUFHQSxRQUFILEVBQVk7QUFDUmQsTUFBQUEsT0FBTyxDQUFDeUIsRUFBUixDQUFXLHNCQUFYLEVBQWtDWCxRQUFsQztBQUNIO0FBQ0osR0FKRDs7QUFLQSxTQUFPWixJQUFQO0FBQ0gsQ0E3S0Q7O2VBK0tlRCIsInNvdXJjZVJvb3QiOiIuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc2NyaXB0c1xcZGF0YSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBldmVudGxpc3RlciBmcm9tIFwiLi4vdXRpbC9ldmVudF9saXN0ZXIuanNcIlxyXG53aW5kb3cuJHNvY2tldCA9IGV2ZW50bGlzdGVyKHt9KVxyXG5jb25zdCBzb2NrZXRDdHIgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIHRoYXQgPSB7fVxyXG4gICAgdmFyIHJlc3BvbmVfbWFwID0ge30gXHJcbiAgICB2YXIgY2FsbF9pbmRleCA9IDBcclxuXHJcbiAgICB2YXIgX3NvY2tldCA9IG51bGxcclxuICAgIC8vIHZhciAkc29ja2V0ID0gZXZlbnRsaXN0ZXIoe30pXHJcbiAgICBjb25zdCBfc2VuZG1zZyA9IGZ1bmN0aW9uKGNtZHR5cGUscmVxLGNhbGxpbmRleCl7XHJcbiAgICAgICAgX3NvY2tldC5lbWl0KFwibm90aWZ5XCIse2NtZDpjbWR0eXBlLGRhdGE6cmVxLGNhbGxpbmRleDpjYWxsaW5kZXh9KVxyXG4gICAgfSBcclxuIFxyXG4gICAgY29uc3QgX3JlcXVlc3QgPSBmdW5jdGlvbihjbWR0eXBlLHJlcSxjYWxsYmFjayl7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJzZW5kIGNtZDpcIitjbWR0eXBlK1wiICBcIisgSlNPTi5zdHJpbmdpZnkocmVxKSlcclxuICAgICAgICBjYWxsX2luZGV4KysgXHJcbiAgICAgICAgcmVzcG9uZV9tYXBbY2FsbF9pbmRleF0gPSBjYWxsYmFja1xyXG4gICAgICAgIF9zZW5kbXNnKGNtZHR5cGUscmVxLGNhbGxfaW5kZXgpXHJcbiAgICB9IFxyXG4gIFxyXG4gICAgICAgIFxyXG4gICAgdGhhdC5pbml0U29ja2V0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgb3B0cyA9IHtcclxuICAgICAgICAgICAgJ3JlY29ubmVjdGlvbic6ZmFsc2UsXHJcbiAgICAgICAgICAgICdmb3JjZSBuZXcgY29ubmVjdGlvbic6IHRydWUsXHJcbiAgICAgICAgICAgICd0cmFuc3BvcnRzJzpbJ3dlYnNvY2tldCcsICdwb2xsaW5nJ11cclxuICAgICAgICB9XHJcbiAgICAgICAgX3NvY2tldCA9IHdpbmRvdy5pby5jb25uZWN0KGRlZmluZXMuc2VydmVyVXJsLG9wdHMpO1xyXG5cclxuICAgICAgICBfc29ja2V0Lm9uKFwiY29ubmVjdGlvblwiLGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY29ubmVjdCBzZXJ2ZXIgc3VjY2VzcyEhXCIpXHJcbiAgICAgICAgICB9KVxyXG5cclxuICAgICAgIF9zb2NrZXQub24oXCJub3RpZnlcIixmdW5jdGlvbihyZXMpe1xyXG4gICAgICAgICBjb25zb2xlLmxvZyhcIm9uIG5vdGlmeSBjbWQ6XCIgKyBKU09OLnN0cmluZ2lmeShyZXMpKVxyXG4gICAgICAgICBpZihyZXNwb25lX21hcC5oYXNPd25Qcm9wZXJ0eShyZXMuY2FsbEJhY2tJbmRleCkpe1xyXG4gICAgICAgICAgIHZhciBjYWxsYmFjayA9IHJlc3BvbmVfbWFwW3Jlcy5jYWxsQmFja0luZGV4XVxyXG4gICAgICAgICAgIGlmKGNhbGxiYWNrKXtcclxuICAgICAgICAgICAgICAgY2FsbGJhY2socmVzLnJlc3VsdCxyZXMuZGF0YSlcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAvL2lmKHJlcy5jYWxsQmFja0luZGV4IT0wKXtcclxuICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwibm90IGZvdW5kIGNhbGwgaW5kZXhcIixyZXMuY2FsbEJhY2tJbmRleClcclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgLy/mj5DkuqTkuIDkuKrnm5HlkKznmoTkuovku7bnu5nnm5HlkKzlmahcclxuICAgICAgICAvLyAgb24gbm90aWZ5IGNtZDp7XCJ0eXBlXCI6XCJwbGF5ZXJfam9pbnJvb21fbm90aWZ5XCIsXCJyZXN1bHRcIjowLFwiZGF0YVwiOlxyXG4gICAgICAgIC8vICB7XCJhY2NvdW50aWRcIjpcIjI1ODY0MjJcIixcInVzZXJOYW1lXCI6XCJ0aW55MTEwXCIsXCJhdmF0YXJVcmxcIjpcclxuICAgICAgICAvLyAgXCJhdmF0YXJfM1wiLFwiZ29sZGNvdW50XCI6MTAwMCxcInNlYXRpbmRleFwiOjJ9LFwiY2FsbEJhY2tJbmRleFwiOm51bGx9XHJcbiAgICAgICAgICAgICAgLy/msqHmnInmib7liLDlm57liLDlh73mlbDvvIzlsLHnu5nkuovku7bnm5HlkKzlmajmj5DkuqTkuIDkuKrkuovku7ZcclxuICAgICAgICAgICAgICB2YXIgdHlwZSA9IHJlcy50eXBlXHJcbiAgICAgICAgICAgICAgJHNvY2tldC5lbWl0KHR5cGUsIHJlcy5kYXRhKVxyXG4gICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgIFxyXG4gICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgfVxyXG5cclxuICAgIHRoYXQucmVxdWVzdF93eExvZ2luID0gZnVuY3Rpb24ocmVxLGNhbGxiYWNrKXtcclxuICAgICAgICBfcmVxdWVzdChcInd4bG9naW5cIixyZXEsY2FsbGJhY2spXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHRoYXQucmVxdWVzdF9jcmVhdHJvb20gPSBmdW5jdGlvbihyZXEsY2FsbGJhY2spe1xyXG4gICAgICAgIF9yZXF1ZXN0KFwiY3JlYXRlcm9vbV9yZXFcIixyZXEsY2FsbGJhY2spXHJcbiAgICB9XHJcblxyXG4gICAgdGhhdC5yZXF1ZXN0X2ppb24gPSBmdW5jdGlvbihyZXEsY2FsbGJhY2spe1xyXG4gICAgICAgIF9yZXF1ZXN0KFwiam9pbnJvb21fcmVxXCIscmVxLGNhbGxiYWNrKVxyXG4gICAgfVxyXG5cclxuICAgIHRoYXQucmVxdWVzdF9lbnRlcl9yb29tID0gZnVuY3Rpb24ocmVxLGNhbGxiYWNrKXtcclxuICAgICAgICBfcmVxdWVzdChcImVudGVycm9vbV9yZXFcIixyZXEsY2FsbGJhY2spXHJcbiAgICB9XHJcblxyXG4gICAgLy/lj5HpgIHkuI3lh7rniYzkv6Hmga9cclxuICAgIHRoYXQucmVxdWVzdF9idWNodV9jYXJkID0gIGZ1bmN0aW9uKHJlcSxjYWxsYmFjayl7XHJcbiAgICAgICAgX3JlcXVlc3QoXCJjaHVfYnVfY2FyZF9yZXFcIixyZXEsY2FsbGJhY2spXHJcbiAgICB9XHJcbiAgICAvKueOqeWutuWHuueJjFxyXG4gICAgICDpnIDopoHliKTmlq06IFxyXG4gICAgICAgICDlh7rnmoTniYzmmK/lkKbnrKblkIjop4TliJlcclxuICAgICAgICAg5ZKM5LiK5Liq5Ye654mM546p5a625q+U6L6D77yM5piv5ZCm5ruh6Laz5p2h5Lu2XHJcblxyXG4gICAgKi9cclxuICAgIHRoYXQucmVxdWVzdF9jaHVfY2FyZCA9IGZ1bmN0aW9uKHJlcSxjYWxsYmFjayl7XHJcbiAgICAgICAgX3JlcXVlc3QoXCJjaHVfY2FyZF9yZXFcIixyZXEsY2FsbGJhY2spXHJcbiAgICB9XHJcbiAgICAvL+ebkeWQrOWFtuS7lueOqeWutui/m+WFpeaIv+mXtOa2iOaBr1xyXG4gICAgdGhhdC5vblBsYXllckpvaW5Sb29tID0gZnVuY3Rpb24oY2FsbGJhY2spe1xyXG4gICAgICAgICAkc29ja2V0Lm9uKFwicGxheWVyX2pvaW5yb29tX25vdGlmeVwiLGNhbGxiYWNrKVxyXG4gICAgfVxyXG5cclxuICAgIHRoYXQub25QbGF5ZXJSZWFkeSA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcclxuICAgICAgICAkc29ja2V0Lm9uKFwicGxheWVyX3JlYWR5X25vdGlmeVwiLGNhbGxiYWNrKVxyXG4gICAgfVxyXG5cclxuICAgIHRoYXQub25HYW1lU3RhcnQgPSBmdW5jdGlvbihjYWxsYmFjayl7XHJcbiAgICAgICAgaWYoY2FsbGJhY2spe1xyXG4gICAgICAgICAgICRzb2NrZXQub24oXCJnYW1lU3RhcnRfbm90aWZ5XCIsY2FsbGJhY2spXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoYXQub25DaGFuZ2VIb3VzZU1hbmFnZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcclxuICAgICAgICBpZihjYWxsYmFjayl7XHJcbiAgICAgICAgICAgICRzb2NrZXQub24oXCJjaGFuZ2Vob3VzZW1hbmFnZV9ub3RpZnlcIixjYWxsYmFjaylcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvL+WPkemAgXJlYWR55raI5oGvXHJcbiAgICB0aGF0LnJlcXVlc3RSZWFkeSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgX3NlbmRtc2coXCJwbGF5ZXJfcmVhZHlfbm90aWZ5XCIse30sbnVsbClcclxuICAgIH1cclxuXHJcbiAgICB0aGF0LnJlcXVlc3RTdGFydCA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcclxuICAgICAgICBfcmVxdWVzdChcInBsYXllcl9zdGFydF9ub3RpZnlcIix7fSxjYWxsYmFjaylcclxuICAgIH1cclxuXHJcbiAgICAvL+eOqeWutumAmuefpeacjeWKoeWZqOaKouWcsOS4u+a2iOaBr1xyXG4gICAgdGhhdC5yZXF1ZXN0Um9iU3RhdGUgPSBmdW5jdGlvbihzdGF0ZSl7XHJcbiAgICAgICAgX3NlbmRtc2coXCJwbGF5ZXJfcm9iX25vdGlmeVwiLHN0YXRlLG51bGwpXHJcbiAgICB9XHJcbiAgICAvL+acjeWKoeWZqOS4i+WPkeeJjOmAmuefpVxyXG4gICAgdGhhdC5vblB1c2hDYXJkcyA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcclxuICAgICAgICBpZihjYWxsYmFjayl7XHJcbiAgICAgICAgICAgICRzb2NrZXQub24oXCJwdXNoY2FyZF9ub3RpZnlcIixjYWxsYmFjaylcclxuICAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8v55uR5ZCs5pyN5Yqh5Zmo6YCa55+l5byA5aeL5oqi5Zyw5Li75raI5oGvXHJcbiAgICB0aGF0Lm9uQ2FuUm9iU3RhdGUgPSBmdW5jdGlvbihjYWxsYmFjayl7XHJcbiAgICAgICAgaWYoY2FsbGJhY2spe1xyXG4gICAgICAgICAgICAkc29ja2V0Lm9uKFwiY2Fucm9iX25vdGlmeVwiLGNhbGxiYWNrKVxyXG4gICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy/nm5HlkKzmnI3liqHlmag66YCa55+l6LCB5oqi5Zyw5Li75pON5L2c5raI5oGvXHJcbiAgICB0aGF0Lm9uUm9iU3RhdGUgPSBmdW5jdGlvbihjYWxsYmFjayl7XHJcbiAgICAgICAgaWYoY2FsbGJhY2spe1xyXG4gICAgICAgICAgICAkc29ja2V0Lm9uKFwiY2Fucm9iX3N0YXRlX25vdGlmeVwiLGNhbGxiYWNrKVxyXG4gICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy/nm5HlkKzmnI3liqHlmag656Gu5a6a5Zyw5Li75raI5oGvXHJcbiAgICB0aGF0Lm9uQ2hhbmdlTWFzdGVyID0gZnVuY3Rpb24oY2FsbGJhY2spe1xyXG4gICAgICAgIGlmKGNhbGxiYWNrKXtcclxuICAgICAgICAgICAgJHNvY2tldC5vbihcImNoYW5nZV9tYXN0ZXJfbm90aWZ5XCIsY2FsbGJhY2spXHJcbiAgICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL+ebkeWQrOacjeWKoeWZqDrmmL7npLrlupXniYzmtojmga9cclxuICAgIHRoYXQub25TaG93Qm90dG9tQ2FyZCA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcclxuICAgICAgICBpZihjYWxsYmFjayl7XHJcbiAgICAgICAgICAgICRzb2NrZXQub24oXCJjaGFuZ2Vfc2hvd2NhcmRfbm90aWZ5XCIsY2FsbGJhY2spXHJcbiAgICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL+ebkeWQrOacjeWKoeWZqDrlj6/ku6Xlh7rniYzmtojmga9cclxuICAgIHRoYXQub25DYW5DaHVDYXJkID0gZnVuY3Rpb24oY2FsbGJhY2spe1xyXG4gICAgICAgIGlmKGNhbGxiYWNrKXtcclxuICAgICAgICAgICAgJHNvY2tldC5vbihcImNhbl9jaHVfY2FyZF9ub3RpZnlcIixjYWxsYmFjaylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhhdC5vblJvb21DaGFuZ2VTdGF0ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcclxuICAgICAgICBpZihjYWxsYmFjayl7XHJcbiAgICAgICAgICAgICRzb2NrZXQub24oXCJyb29tX3N0YXRlX25vdGlmeVwiLGNhbGxiYWNrKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGF0Lm9uT3RoZXJQbGF5ZXJDaHVDYXJkID0gZnVuY3Rpb24oY2FsbGJhY2spe1xyXG4gICAgICAgIGlmKGNhbGxiYWNrKXtcclxuICAgICAgICAgICAgJHNvY2tldC5vbihcIm90aGVyX2NodWNhcmRfbm90aWZ5XCIsY2FsbGJhY2spXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoYXRcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgc29ja2V0Q3RyICJdfQ==