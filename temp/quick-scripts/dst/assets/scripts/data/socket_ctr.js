
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

var socketCtr = function socketCtr() {
  var that = {};
  var respone_map = {};
  var call_index = 0;
  var _socket = null;
  var event = (0, _event_lister["default"])({});

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
        //  {"accountid":"2586422","nick_name":"tiny110","avatarUrl":
        //  "avatar_3","goldcount":1000,"seatindex":2},"callBackIndex":null}
        //没有找到回到函数，就给事件监听器提交一个事件
        var type = res.type;
        event.fire(type, res.data); // }
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
    event.on("player_joinroom_notify", callback);
  };

  that.onPlayerReady = function (callback) {
    event.on("player_ready_notify", callback);
  };

  that.onGameStart = function (callback) {
    if (callback) {
      event.on("gameStart_notify", callback);
    }
  };

  that.onChangeHouseManage = function (callback) {
    if (callback) {
      event.on("changehousemanage_notify", callback);
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
      event.on("pushcard_notify", callback);
    }
  }; //监听服务器通知开始抢地主消息


  that.onCanRobState = function (callback) {
    if (callback) {
      event.on("canrob_notify", callback);
    }
  }; //监听服务器:通知谁抢地主操作消息


  that.onRobState = function (callback) {
    if (callback) {
      event.on("canrob_state_notify", callback);
    }
  }; //监听服务器:确定地主消息


  that.onChangeMaster = function (callback) {
    if (callback) {
      event.on("change_master_notify", callback);
    }
  }; //监听服务器:显示底牌消息


  that.onShowBottomCard = function (callback) {
    if (callback) {
      event.on("change_showcard_notify", callback);
    }
  }; //监听服务器:可以出牌消息


  that.onCanChuCard = function (callback) {
    if (callback) {
      event.on("can_chu_card_notify", callback);
    }
  };

  that.onRoomChangeState = function (callback) {
    if (callback) {
      event.on("room_state_notify", callback);
    }
  };

  that.onOtherPlayerChuCard = function (callback) {
    if (callback) {
      event.on("other_chucard_notify", callback);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxkYXRhLy4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxkYXRhL2Fzc2V0c1xcc2NyaXB0c1xcZGF0YVxcc29ja2V0X2N0ci5qcyJdLCJuYW1lcyI6WyJzb2NrZXRDdHIiLCJ0aGF0IiwicmVzcG9uZV9tYXAiLCJjYWxsX2luZGV4IiwiX3NvY2tldCIsImV2ZW50IiwiX3NlbmRtc2ciLCJjbWR0eXBlIiwicmVxIiwiY2FsbGluZGV4IiwiZW1pdCIsImNtZCIsImRhdGEiLCJfcmVxdWVzdCIsImNhbGxiYWNrIiwiY29uc29sZSIsImxvZyIsIkpTT04iLCJzdHJpbmdpZnkiLCJpbml0U29ja2V0Iiwib3B0cyIsIndpbmRvdyIsImlvIiwiY29ubmVjdCIsImRlZmluZXMiLCJzZXJ2ZXJVcmwiLCJvbiIsInJlcyIsImhhc093blByb3BlcnR5IiwiY2FsbEJhY2tJbmRleCIsInJlc3VsdCIsInR5cGUiLCJmaXJlIiwicmVxdWVzdF93eExvZ2luIiwicmVxdWVzdF9jcmVhdHJvb20iLCJyZXF1ZXN0X2ppb24iLCJyZXF1ZXN0X2VudGVyX3Jvb20iLCJyZXF1ZXN0X2J1Y2h1X2NhcmQiLCJyZXF1ZXN0X2NodV9jYXJkIiwib25QbGF5ZXJKb2luUm9vbSIsIm9uUGxheWVyUmVhZHkiLCJvbkdhbWVTdGFydCIsIm9uQ2hhbmdlSG91c2VNYW5hZ2UiLCJyZXF1ZXN0UmVhZHkiLCJyZXF1ZXN0U3RhcnQiLCJyZXF1ZXN0Um9iU3RhdGUiLCJzdGF0ZSIsIm9uUHVzaENhcmRzIiwib25DYW5Sb2JTdGF0ZSIsIm9uUm9iU3RhdGUiLCJvbkNoYW5nZU1hc3RlciIsIm9uU2hvd0JvdHRvbUNhcmQiLCJvbkNhbkNodUNhcmQiLCJvblJvb21DaGFuZ2VTdGF0ZSIsIm9uT3RoZXJQbGF5ZXJDaHVDYXJkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFFQSxJQUFN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R0EsUUFBSCxFQUFZO0FBQ1JULE1BQUFBLEtBQUssQ0FBQ3FCLEVBQU4sQ0FBUyxzQkFBVCxFQUFnQ1osUUFBaEM7QUFDSDtBQUNKLEdBSkQ7O0FBS0EsU0FBT2IsSUFBUDtBQUNILENBN0tEOztlQStLZUQiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHNjcmlwdHNcXGRhdGEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXZlbnRsaXN0ZXIgZnJvbSBcIi4uL3V0aWwvZXZlbnRfbGlzdGVyLmpzXCJcclxuXHJcbmNvbnN0IHNvY2tldEN0ciA9IGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgdGhhdCA9IHt9XHJcbiAgICB2YXIgcmVzcG9uZV9tYXAgPSB7fSBcclxuICAgIHZhciBjYWxsX2luZGV4ID0gMFxyXG5cclxuICAgIHZhciBfc29ja2V0ID0gbnVsbFxyXG4gICAgdmFyIGV2ZW50ID0gZXZlbnRsaXN0ZXIoe30pXHJcbiAgICBjb25zdCBfc2VuZG1zZyA9IGZ1bmN0aW9uKGNtZHR5cGUscmVxLGNhbGxpbmRleCl7XHJcbiAgICAgICAgX3NvY2tldC5lbWl0KFwibm90aWZ5XCIse2NtZDpjbWR0eXBlLGRhdGE6cmVxLGNhbGxpbmRleDpjYWxsaW5kZXh9KVxyXG4gICAgfSBcclxuIFxyXG4gICAgY29uc3QgX3JlcXVlc3QgPSBmdW5jdGlvbihjbWR0eXBlLHJlcSxjYWxsYmFjayl7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJzZW5kIGNtZDpcIitjbWR0eXBlK1wiICBcIisgSlNPTi5zdHJpbmdpZnkocmVxKSlcclxuICAgICAgICBjYWxsX2luZGV4KysgXHJcbiAgICAgICAgcmVzcG9uZV9tYXBbY2FsbF9pbmRleF0gPSBjYWxsYmFja1xyXG4gICAgICAgIF9zZW5kbXNnKGNtZHR5cGUscmVxLGNhbGxfaW5kZXgpXHJcbiAgICB9IFxyXG4gIFxyXG4gICAgICAgIFxyXG4gICAgdGhhdC5pbml0U29ja2V0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgb3B0cyA9IHtcclxuICAgICAgICAgICAgJ3JlY29ubmVjdGlvbic6ZmFsc2UsXHJcbiAgICAgICAgICAgICdmb3JjZSBuZXcgY29ubmVjdGlvbic6IHRydWUsXHJcbiAgICAgICAgICAgICd0cmFuc3BvcnRzJzpbJ3dlYnNvY2tldCcsICdwb2xsaW5nJ11cclxuICAgICAgICB9XHJcbiAgICAgICAgX3NvY2tldCA9IHdpbmRvdy5pby5jb25uZWN0KGRlZmluZXMuc2VydmVyVXJsLG9wdHMpO1xyXG5cclxuICAgICAgICBfc29ja2V0Lm9uKFwiY29ubmVjdGlvblwiLGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY29ubmVjdCBzZXJ2ZXIgc3VjY2VzcyEhXCIpXHJcbiAgICAgICAgICB9KVxyXG5cclxuICAgICAgIF9zb2NrZXQub24oXCJub3RpZnlcIixmdW5jdGlvbihyZXMpe1xyXG4gICAgICAgICBjb25zb2xlLmxvZyhcIm9uIG5vdGlmeSBjbWQ6XCIgKyBKU09OLnN0cmluZ2lmeShyZXMpKVxyXG4gICAgICAgICBpZihyZXNwb25lX21hcC5oYXNPd25Qcm9wZXJ0eShyZXMuY2FsbEJhY2tJbmRleCkpe1xyXG4gICAgICAgICAgIHZhciBjYWxsYmFjayA9IHJlc3BvbmVfbWFwW3Jlcy5jYWxsQmFja0luZGV4XVxyXG4gICAgICAgICAgIGlmKGNhbGxiYWNrKXtcclxuICAgICAgICAgICAgICAgY2FsbGJhY2socmVzLnJlc3VsdCxyZXMuZGF0YSlcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAvL2lmKHJlcy5jYWxsQmFja0luZGV4IT0wKXtcclxuICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwibm90IGZvdW5kIGNhbGwgaW5kZXhcIixyZXMuY2FsbEJhY2tJbmRleClcclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgLy/mj5DkuqTkuIDkuKrnm5HlkKznmoTkuovku7bnu5nnm5HlkKzlmahcclxuICAgICAgICAvLyAgb24gbm90aWZ5IGNtZDp7XCJ0eXBlXCI6XCJwbGF5ZXJfam9pbnJvb21fbm90aWZ5XCIsXCJyZXN1bHRcIjowLFwiZGF0YVwiOlxyXG4gICAgICAgIC8vICB7XCJhY2NvdW50aWRcIjpcIjI1ODY0MjJcIixcIm5pY2tfbmFtZVwiOlwidGlueTExMFwiLFwiYXZhdGFyVXJsXCI6XHJcbiAgICAgICAgLy8gIFwiYXZhdGFyXzNcIixcImdvbGRjb3VudFwiOjEwMDAsXCJzZWF0aW5kZXhcIjoyfSxcImNhbGxCYWNrSW5kZXhcIjpudWxsfVxyXG4gICAgICAgICAgICAgIC8v5rKh5pyJ5om+5Yiw5Zue5Yiw5Ye95pWw77yM5bCx57uZ5LqL5Lu255uR5ZCs5Zmo5o+Q5Lqk5LiA5Liq5LqL5Lu2XHJcbiAgICAgICAgICAgICAgdmFyIHR5cGUgPSByZXMudHlwZVxyXG4gICAgICAgICAgICAgIGV2ZW50LmZpcmUodHlwZSxyZXMuZGF0YSlcclxuICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICBcclxuICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KVxyXG5cclxuICAgIH1cclxuXHJcbiAgICB0aGF0LnJlcXVlc3Rfd3hMb2dpbiA9IGZ1bmN0aW9uKHJlcSxjYWxsYmFjayl7XHJcbiAgICAgICAgX3JlcXVlc3QoXCJ3eGxvZ2luXCIscmVxLGNhbGxiYWNrKVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICB0aGF0LnJlcXVlc3RfY3JlYXRyb29tID0gZnVuY3Rpb24ocmVxLGNhbGxiYWNrKXtcclxuICAgICAgICBfcmVxdWVzdChcImNyZWF0ZXJvb21fcmVxXCIscmVxLGNhbGxiYWNrKVxyXG4gICAgfVxyXG5cclxuICAgIHRoYXQucmVxdWVzdF9qaW9uID0gZnVuY3Rpb24ocmVxLGNhbGxiYWNrKXtcclxuICAgICAgICBfcmVxdWVzdChcImpvaW5yb29tX3JlcVwiLHJlcSxjYWxsYmFjaylcclxuICAgIH1cclxuXHJcbiAgICB0aGF0LnJlcXVlc3RfZW50ZXJfcm9vbSA9IGZ1bmN0aW9uKHJlcSxjYWxsYmFjayl7XHJcbiAgICAgICAgX3JlcXVlc3QoXCJlbnRlcnJvb21fcmVxXCIscmVxLGNhbGxiYWNrKVxyXG4gICAgfVxyXG5cclxuICAgIC8v5Y+R6YCB5LiN5Ye654mM5L+h5oGvXHJcbiAgICB0aGF0LnJlcXVlc3RfYnVjaHVfY2FyZCA9ICBmdW5jdGlvbihyZXEsY2FsbGJhY2spe1xyXG4gICAgICAgIF9yZXF1ZXN0KFwiY2h1X2J1X2NhcmRfcmVxXCIscmVxLGNhbGxiYWNrKVxyXG4gICAgfVxyXG4gICAgLyrnjqnlrrblh7rniYxcclxuICAgICAg6ZyA6KaB5Yik5patOiBcclxuICAgICAgICAg5Ye655qE54mM5piv5ZCm56ym5ZCI6KeE5YiZXHJcbiAgICAgICAgIOWSjOS4iuS4quWHuueJjOeOqeWutuavlOi+g++8jOaYr+WQpua7oei2s+adoeS7tlxyXG5cclxuICAgICovXHJcbiAgICB0aGF0LnJlcXVlc3RfY2h1X2NhcmQgPSBmdW5jdGlvbihyZXEsY2FsbGJhY2spe1xyXG4gICAgICAgIF9yZXF1ZXN0KFwiY2h1X2NhcmRfcmVxXCIscmVxLGNhbGxiYWNrKVxyXG4gICAgfVxyXG4gICAgLy/nm5HlkKzlhbbku5bnjqnlrrbov5vlhaXmiL/pl7Tmtojmga9cclxuICAgIHRoYXQub25QbGF5ZXJKb2luUm9vbSA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcclxuICAgICAgICAgZXZlbnQub24oXCJwbGF5ZXJfam9pbnJvb21fbm90aWZ5XCIsY2FsbGJhY2spXHJcbiAgICB9XHJcblxyXG4gICAgdGhhdC5vblBsYXllclJlYWR5ID0gZnVuY3Rpb24oY2FsbGJhY2spe1xyXG4gICAgICAgIGV2ZW50Lm9uKFwicGxheWVyX3JlYWR5X25vdGlmeVwiLGNhbGxiYWNrKVxyXG4gICAgfVxyXG5cclxuICAgIHRoYXQub25HYW1lU3RhcnQgPSBmdW5jdGlvbihjYWxsYmFjayl7XHJcbiAgICAgICAgaWYoY2FsbGJhY2spe1xyXG4gICAgICAgICAgIGV2ZW50Lm9uKFwiZ2FtZVN0YXJ0X25vdGlmeVwiLGNhbGxiYWNrKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGF0Lm9uQ2hhbmdlSG91c2VNYW5hZ2UgPSBmdW5jdGlvbihjYWxsYmFjayl7XHJcbiAgICAgICAgaWYoY2FsbGJhY2spe1xyXG4gICAgICAgICAgICBldmVudC5vbihcImNoYW5nZWhvdXNlbWFuYWdlX25vdGlmeVwiLGNhbGxiYWNrKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8v5Y+R6YCBcmVhZHnmtojmga9cclxuICAgIHRoYXQucmVxdWVzdFJlYWR5ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBfc2VuZG1zZyhcInBsYXllcl9yZWFkeV9ub3RpZnlcIix7fSxudWxsKVxyXG4gICAgfVxyXG5cclxuICAgIHRoYXQucmVxdWVzdFN0YXJ0ID0gZnVuY3Rpb24oY2FsbGJhY2spe1xyXG4gICAgICAgIF9yZXF1ZXN0KFwicGxheWVyX3N0YXJ0X25vdGlmeVwiLHt9LGNhbGxiYWNrKVxyXG4gICAgfVxyXG5cclxuICAgIC8v546p5a626YCa55+l5pyN5Yqh5Zmo5oqi5Zyw5Li75raI5oGvXHJcbiAgICB0aGF0LnJlcXVlc3RSb2JTdGF0ZSA9IGZ1bmN0aW9uKHN0YXRlKXtcclxuICAgICAgICBfc2VuZG1zZyhcInBsYXllcl9yb2Jfbm90aWZ5XCIsc3RhdGUsbnVsbClcclxuICAgIH1cclxuICAgIC8v5pyN5Yqh5Zmo5LiL5Y+R54mM6YCa55+lXHJcbiAgICB0aGF0Lm9uUHVzaENhcmRzID0gZnVuY3Rpb24oY2FsbGJhY2spe1xyXG4gICAgICAgIGlmKGNhbGxiYWNrKXtcclxuICAgICAgICAgICAgZXZlbnQub24oXCJwdXNoY2FyZF9ub3RpZnlcIixjYWxsYmFjaylcclxuICAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8v55uR5ZCs5pyN5Yqh5Zmo6YCa55+l5byA5aeL5oqi5Zyw5Li75raI5oGvXHJcbiAgICB0aGF0Lm9uQ2FuUm9iU3RhdGUgPSBmdW5jdGlvbihjYWxsYmFjayl7XHJcbiAgICAgICAgaWYoY2FsbGJhY2spe1xyXG4gICAgICAgICAgICBldmVudC5vbihcImNhbnJvYl9ub3RpZnlcIixjYWxsYmFjaylcclxuICAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8v55uR5ZCs5pyN5Yqh5ZmoOumAmuefpeiwgeaKouWcsOS4u+aTjeS9nOa2iOaBr1xyXG4gICAgdGhhdC5vblJvYlN0YXRlID0gZnVuY3Rpb24oY2FsbGJhY2spe1xyXG4gICAgICAgIGlmKGNhbGxiYWNrKXtcclxuICAgICAgICAgICAgZXZlbnQub24oXCJjYW5yb2Jfc3RhdGVfbm90aWZ5XCIsY2FsbGJhY2spXHJcbiAgICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL+ebkeWQrOacjeWKoeWZqDrnoa7lrprlnLDkuLvmtojmga9cclxuICAgIHRoYXQub25DaGFuZ2VNYXN0ZXIgPSBmdW5jdGlvbihjYWxsYmFjayl7XHJcbiAgICAgICAgaWYoY2FsbGJhY2spe1xyXG4gICAgICAgICAgICBldmVudC5vbihcImNoYW5nZV9tYXN0ZXJfbm90aWZ5XCIsY2FsbGJhY2spXHJcbiAgICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL+ebkeWQrOacjeWKoeWZqDrmmL7npLrlupXniYzmtojmga9cclxuICAgIHRoYXQub25TaG93Qm90dG9tQ2FyZCA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcclxuICAgICAgICBpZihjYWxsYmFjayl7XHJcbiAgICAgICAgICAgIGV2ZW50Lm9uKFwiY2hhbmdlX3Nob3djYXJkX25vdGlmeVwiLGNhbGxiYWNrKVxyXG4gICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy/nm5HlkKzmnI3liqHlmag65Y+v5Lul5Ye654mM5raI5oGvXHJcbiAgICB0aGF0Lm9uQ2FuQ2h1Q2FyZCA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcclxuICAgICAgICBpZihjYWxsYmFjayl7XHJcbiAgICAgICAgICAgIGV2ZW50Lm9uKFwiY2FuX2NodV9jYXJkX25vdGlmeVwiLGNhbGxiYWNrKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGF0Lm9uUm9vbUNoYW5nZVN0YXRlID0gZnVuY3Rpb24oY2FsbGJhY2spe1xyXG4gICAgICAgIGlmKGNhbGxiYWNrKXtcclxuICAgICAgICAgICAgZXZlbnQub24oXCJyb29tX3N0YXRlX25vdGlmeVwiLGNhbGxiYWNrKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGF0Lm9uT3RoZXJQbGF5ZXJDaHVDYXJkID0gZnVuY3Rpb24oY2FsbGJhY2spe1xyXG4gICAgICAgIGlmKGNhbGxiYWNrKXtcclxuICAgICAgICAgICAgZXZlbnQub24oXCJvdGhlcl9jaHVjYXJkX25vdGlmeVwiLGNhbGxiYWNrKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0aGF0XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHNvY2tldEN0ciAiXX0=