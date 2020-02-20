
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/gameScene/prefabs/player_node.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'aa64aMZgnFIfLx2Lmi+lbwV', 'player_node');
// scripts/gameScene/prefabs/player_node.js

"use strict";

var _mygolbal = _interopRequireDefault(require("../../mygolbal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

cc.Class({
  "extends": cc.Component,
  properties: {
    account_label: cc.Label,
    nickname_label: cc.Label,
    room_touxiang: cc.Sprite,
    globalcount_label: cc.Label,
    headimage: cc.Sprite,
    readyimage: cc.Node,
    offlineimage: cc.Node,
    card_node: cc.Node,
    card_prefab: cc.Prefab,
    //tips_label:cc.Label,
    clockimage: cc.Node,
    qiangdidzhu_node: cc.Node,
    //抢地主的父节点
    time_label: cc.Label,
    robimage_sp: cc.SpriteFrame,
    robnoimage_sp: cc.SpriteFrame,
    robIconSp: cc.Sprite,
    robIcon_Sp: cc.Node,
    robnoIcon_Sp: cc.Node,
    masterIcon: cc.Node
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    this.readyimage.active = false;
    this.offlineimage.active = false; //监听开始游戏事件(客户端发给客户端)

    this.node.on("gamestart_event", function (event) {
      this.readyimage.active = false;
    }.bind(this)); //给其他玩家发牌事件

    this.node.on("push_card_event", function (event) {
      console.log("on push_card_event"); //自己不再发牌

      if (this.accountid == _mygolbal["default"].playerData.accountID) {
        return;
      }

      this.pushCard();
    }.bind(this));
    this.node.on("playernode_rob_state_event", function (event) {
      //{"accountid":"2162866","state":1}
      var detail = event; //如果是自己在抢，需要隐藏qiangdidzhu_node节点
      //this.accountid表示这个节点挂接的accountid

      if (detail.accountid == this.accountid) {
        //console.log("detail.accountid"+detail.accountid)
        this.qiangdidzhu_node.active = false;
      }

      if (this.accountid == detail.accountid) {
        if (detail.state == qian_state.qian) {
          console.log("this.robIcon_Sp.active = true");
          this.robIcon_Sp.active = true;
        } else if (detail.state == qian_state.buqiang) {
          this.robnoIcon_Sp.active = true;
        } else {
          console.log("get rob value :" + detail.state);
        }
      }
    }.bind(this));
    this.node.on("playernode_changemaster_event", function (event) {
      var detail = event;
      this.robIcon_Sp.active = false;
      this.robnoIcon_Sp.active = false;

      if (detail == this.accountid) {
        this.masterIcon.active = true;
      }
    }.bind(this)); // this.node.on("playernode_add_three_card",function(event){
    //   var detail = event //地主的accountid
    //   if(detail==this.accountid){
    //     //给地主发三张排
    //   }
    // }.bind(this))
  },
  start: function start() {},
  //这里初始化房间内位置节点信息(自己和其他玩家)
  //data玩家节点数据
  //index玩家在房间的位置索引
  init_data: function init_data(data, index) {
    console.log("init_data:" + JSON.stringify(data)); //data:{"accountid":"2117836","nick_name":"tiny543","avatarUrl":"http://xxx","goldcount":1000}

    this.accountid = data.accountid;
    this.account_label.string = data.accountid;
    this.nickname_label.string = data.nick_name;
    this.globalcount_label.string = data.goldcount;
    this.cardlist_node = [];
    this.seat_index = index;

    if (data.isready == true) {
      this.readyimage.active = true;
    } //网络图片加载
    //     cc.loader.load({url: data.avatarUrl, type: 'jpg'},  (err, tex)=> {
    //     //cc.log('Should load a texture from RESTful API by specify the type: ' + (tex instanceof cc.Texture2D));
    //     let oldWidth = this.headImage.node.width;
    //     //console.log('old withd' + oldWidth);
    //     this.room_touxiang.spriteFrame = new cc.SpriteFrame(tex);
    //     let newWidth = this.headImage.node.width;
    //     //console.log('old withd' + newWidth);
    //     this.headImage.node.scale = oldWidth / newWidth;
    // });
    //这里根据传入的avarter来获取本地图像


    var str = data.avatarUrl; //console.log(str)

    var head_image_path = "UI/headimage/" + str;
    cc.loader.loadRes(head_image_path, cc.SpriteFrame, function (err, spriteFrame) {
      if (err) {
        console.log(err.message || err);
        return;
      }

      this.headimage.spriteFrame = spriteFrame;
    }.bind(this)); //注册一个player_ready消息

    this.node.on("player_ready_notify", function (event) {
      console.log("player_ready_notify event", event);
      var detail = event;
      console.log("------player_ready_notify detail:" + detail);

      if (detail == this.accountid) {
        this.readyimage.active = true;
      }
    }.bind(this)); //监听内部随可以抢地主消息,这个消息会发给每个playernode节点

    this.node.on("playernode_canrob_event", function (event) {
      var detail = event;
      console.log("------playernode_canrob_event detail:" + detail);

      if (detail == this.accountid) {
        this.qiangdidzhu_node.active = true; //this.tips_label.string ="正在抢地主" 

        this.time_label.string = "10"; //开启一个定时器
      }
    }.bind(this)); //?

    if (index == 1) {
      this.card_node.x = -this.card_node.x - 30;
    }
  },
  // update (dt) {},
  pushCard: function pushCard() {
    this.card_node.active = true;

    for (var i = 0; i < 17; i++) {
      var card = cc.instantiate(this.card_prefab);
      card.scale = 0.6;
      console.log(" this.card_node.parent.parent" + this.card_node.parent.parent.name);
      card.parent = this.card_node; //card.parent = this.node

      var height = card.height;
      card.y = (17 - 1) * 0.5 * height * 0.4 * 0.3 - height * 0.4 * 0.3 * i;
      card.x = 0; //console.log("call pushCard x:"+card.x+" y:"+card.y)

      this.cardlist_node.push(card);
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc2NyaXB0c1xcZ2FtZVNjZW5lXFxwcmVmYWJzLy4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc2NyaXB0c1xcZ2FtZVNjZW5lXFxwcmVmYWJzL2Fzc2V0c1xcc2NyaXB0c1xcZ2FtZVNjZW5lXFxwcmVmYWJzXFxwbGF5ZXJfbm9kZS5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsImFjY291bnRfbGFiZWwiLCJMYWJlbCIsIm5pY2tuYW1lX2xhYmVsIiwicm9vbV90b3V4aWFuZyIsIlNwcml0ZSIsImdsb2JhbGNvdW50X2xhYmVsIiwiaGVhZGltYWdlIiwicmVhZHlpbWFnZSIsIk5vZGUiLCJvZmZsaW5laW1hZ2UiLCJjYXJkX25vZGUiLCJjYXJkX3ByZWZhYiIsIlByZWZhYiIsImNsb2NraW1hZ2UiLCJxaWFuZ2RpZHpodV9ub2RlIiwidGltZV9sYWJlbCIsInJvYmltYWdlX3NwIiwiU3ByaXRlRnJhbWUiLCJyb2Jub2ltYWdlX3NwIiwicm9iSWNvblNwIiwicm9iSWNvbl9TcCIsInJvYm5vSWNvbl9TcCIsIm1hc3Rlckljb24iLCJvbkxvYWQiLCJhY3RpdmUiLCJub2RlIiwib24iLCJldmVudCIsImJpbmQiLCJjb25zb2xlIiwibG9nIiwiYWNjb3VudGlkIiwibXlnbG9iYWwiLCJwbGF5ZXJEYXRhIiwiYWNjb3VudElEIiwicHVzaENhcmQiLCJkZXRhaWwiLCJzdGF0ZSIsInFpYW5fc3RhdGUiLCJxaWFuIiwiYnVxaWFuZyIsInN0YXJ0IiwiaW5pdF9kYXRhIiwiZGF0YSIsImluZGV4IiwiSlNPTiIsInN0cmluZ2lmeSIsInN0cmluZyIsIm5pY2tfbmFtZSIsImdvbGRjb3VudCIsImNhcmRsaXN0X25vZGUiLCJzZWF0X2luZGV4IiwiaXNyZWFkeSIsInN0ciIsImF2YXRhclVybCIsImhlYWRfaW1hZ2VfcGF0aCIsImxvYWRlciIsImxvYWRSZXMiLCJlcnIiLCJzcHJpdGVGcmFtZSIsIm1lc3NhZ2UiLCJ4IiwiaSIsImNhcmQiLCJpbnN0YW50aWF0ZSIsInNjYWxlIiwicGFyZW50IiwibmFtZSIsImhlaWdodCIsInkiLCJwdXNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBRUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0xDLEVBQUFBLFVBQVUsRUFBRTtBQUNSQyxJQUFBQSxhQUFhLEVBQUNKLEVBQUUsQ0FBQ0ssS0FEVDtBQUVSQyxJQUFBQSxjQUFjLEVBQUNOLEVBQUUsQ0FBQ0ssS0FGVjtBQUdSRSxJQUFBQSxhQUFhLEVBQUNQLEVBQUUsQ0FBQ1EsTUFIVDtBQUlSQyxJQUFBQSxpQkFBaUIsRUFBQ1QsRUFBRSxDQUFDSyxLQUpiO0FBS1JLLElBQUFBLFNBQVMsRUFBQ1YsRUFBRSxDQUFDUSxNQUxMO0FBTVJHLElBQUFBLFVBQVUsRUFBQ1gsRUFBRSxDQUFDWSxJQU5OO0FBT1JDLElBQUFBLFlBQVksRUFBQ2IsRUFBRSxDQUFDWSxJQVBSO0FBUVJFLElBQUFBLFNBQVMsRUFBQ2QsRUFBRSxDQUFDWSxJQVJMO0FBU1JHLElBQUFBLFdBQVcsRUFBQ2YsRUFBRSxDQUFDZ0IsTUFUUDtBQVVSO0FBQ0FDLElBQUFBLFVBQVUsRUFBQ2pCLEVBQUUsQ0FBQ1ksSUFYTjtBQVlSTSxJQUFBQSxnQkFBZ0IsRUFBQ2xCLEVBQUUsQ0FBQ1ksSUFaWjtBQVlrQjtBQUMxQk8sSUFBQUEsVUFBVSxFQUFDbkIsRUFBRSxDQUFDSyxLQWJOO0FBY1JlLElBQUFBLFdBQVcsRUFBQ3BCLEVBQUUsQ0FBQ3FCLFdBZFA7QUFlUkMsSUFBQUEsYUFBYSxFQUFDdEIsRUFBRSxDQUFDcUIsV0FmVDtBQWdCUkUsSUFBQUEsU0FBUyxFQUFFdkIsRUFBRSxDQUFDUSxNQWhCTjtBQWlCUmdCLElBQUFBLFVBQVUsRUFBQ3hCLEVBQUUsQ0FBQ1ksSUFqQk47QUFrQlJhLElBQUFBLFlBQVksRUFBQ3pC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QUFLckQsV0FBcEIsQ0FBWDtBQUNBb0QsTUFBQUEsSUFBSSxDQUFDRSxLQUFMLEdBQVcsR0FBWDtBQUNBcEMsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksa0NBQWlDLEtBQUtwQixTQUFMLENBQWV3RCxNQUFmLENBQXNCQSxNQUF0QixDQUE2QkMsSUFBMUU7QUFDQUosTUFBQUEsSUFBSSxDQUFDRyxNQUFMLEdBQWMsS0FBS3hELFNBQW5CLENBSmlCLENBS2pCOztBQUNBLFVBQUkwRCxNQUFNLEdBQUdMLElBQUksQ0FBQ0ssTUFBbEI7QUFDQUwsTUFBQUEsSUFBSSxDQUFDTSxDQUFMLEdBQVMsQ0FBQyxLQUFLLENBQU4sSUFBVyxHQUFYLEdBQWlCRCxNQUFqQixHQUEwQixHQUExQixHQUFnQyxHQUFoQyxHQUFzQ0EsTUFBTSxHQUFHLEdBQVQsR0FBZSxHQUFmLEdBQXFCTixDQUFwRTtBQUNBQyxNQUFBQSxJQUFJLENBQUNGLENBQUwsR0FBUyxDQUFULENBUmlCLENBVWpCOztBQUNBLFdBQUtYLGFBQUwsQ0FBbUJvQixJQUFuQixDQUF3QlAsSUFBeEI7QUFDSDtBQUNKO0FBbkxJLENBQVQiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxnYW1lU2NlbmVcXHByZWZhYnMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbXlnbG9iYWwgZnJvbSBcIi4uLy4uL215Z29sYmFsLmpzXCJcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgYWNjb3VudF9sYWJlbDpjYy5MYWJlbCxcclxuICAgICAgICBuaWNrbmFtZV9sYWJlbDpjYy5MYWJlbCxcclxuICAgICAgICByb29tX3RvdXhpYW5nOmNjLlNwcml0ZSxcclxuICAgICAgICBnbG9iYWxjb3VudF9sYWJlbDpjYy5MYWJlbCxcclxuICAgICAgICBoZWFkaW1hZ2U6Y2MuU3ByaXRlLFxyXG4gICAgICAgIHJlYWR5aW1hZ2U6Y2MuTm9kZSxcclxuICAgICAgICBvZmZsaW5laW1hZ2U6Y2MuTm9kZSxcclxuICAgICAgICBjYXJkX25vZGU6Y2MuTm9kZSxcclxuICAgICAgICBjYXJkX3ByZWZhYjpjYy5QcmVmYWIsXHJcbiAgICAgICAgLy90aXBzX2xhYmVsOmNjLkxhYmVsLFxyXG4gICAgICAgIGNsb2NraW1hZ2U6Y2MuTm9kZSxcclxuICAgICAgICBxaWFuZ2RpZHpodV9ub2RlOmNjLk5vZGUsIC8v5oqi5Zyw5Li755qE54i26IqC54K5XHJcbiAgICAgICAgdGltZV9sYWJlbDpjYy5MYWJlbCxcclxuICAgICAgICByb2JpbWFnZV9zcDpjYy5TcHJpdGVGcmFtZSxcclxuICAgICAgICByb2Jub2ltYWdlX3NwOmNjLlNwcml0ZUZyYW1lLFxyXG4gICAgICAgIHJvYkljb25TcDogY2MuU3ByaXRlLFxyXG4gICAgICAgIHJvYkljb25fU3A6Y2MuTm9kZSxcclxuICAgICAgICByb2Jub0ljb25fU3A6Y2MuTm9kZSxcclxuICAgICAgICBtYXN0ZXJJY29uOmNjLk5vZGUsXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIExJRkUtQ1lDTEUgQ0FMTEJBQ0tTOlxyXG5cclxuICAgIG9uTG9hZCAoKSB7XHJcbiAgICAgIHRoaXMucmVhZHlpbWFnZS5hY3RpdmUgPSBmYWxzZVxyXG4gICAgICB0aGlzLm9mZmxpbmVpbWFnZS5hY3RpdmUgPSBmYWxzZVxyXG4gICAgICBcclxuICAgICAgLy/nm5HlkKzlvIDlp4vmuLjmiI/kuovku7Yo5a6i5oi356uv5Y+R57uZ5a6i5oi356uvKVxyXG4gICAgICB0aGlzLm5vZGUub24oXCJnYW1lc3RhcnRfZXZlbnRcIixmdW5jdGlvbihldmVudCl7XHJcbiAgICAgICAgdGhpcy5yZWFkeWltYWdlLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgIH0uYmluZCh0aGlzKSlcclxuXHJcbiAgICAgIC8v57uZ5YW25LuW546p5a625Y+R54mM5LqL5Lu2XHJcbiAgICAgIHRoaXMubm9kZS5vbihcInB1c2hfY2FyZF9ldmVudFwiLGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIm9uIHB1c2hfY2FyZF9ldmVudFwiKVxyXG4gICAgICAgIC8v6Ieq5bex5LiN5YaN5Y+R54mMXHJcbiAgICAgICAgaWYodGhpcy5hY2NvdW50aWQ9PW15Z2xvYmFsLnBsYXllckRhdGEuYWNjb3VudElEKXtcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucHVzaENhcmQoKVxyXG4gICAgICB9LmJpbmQodGhpcykpXHJcblxyXG4gICAgICB0aGlzLm5vZGUub24oXCJwbGF5ZXJub2RlX3JvYl9zdGF0ZV9ldmVudFwiLGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgICAgICAgIC8ve1wiYWNjb3VudGlkXCI6XCIyMTYyODY2XCIsXCJzdGF0ZVwiOjF9XHJcbiAgICAgICAgICB2YXIgZGV0YWlsID0gZXZlbnRcclxuICAgICAgXHJcbiAgICAgICAgICAvL+WmguaenOaYr+iHquW3seWcqOaKou+8jOmcgOimgemakOiXj3FpYW5nZGlkemh1X25vZGXoioLngrlcclxuICAgICAgICAgIC8vdGhpcy5hY2NvdW50aWTooajnpLrov5nkuKroioLngrnmjILmjqXnmoRhY2NvdW50aWRcclxuICAgICAgICAgIGlmKGRldGFpbC5hY2NvdW50aWQ9PXRoaXMuYWNjb3VudGlkKXtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImRldGFpbC5hY2NvdW50aWRcIitkZXRhaWwuYWNjb3VudGlkKVxyXG4gICAgICAgICAgICB0aGlzLnFpYW5nZGlkemh1X25vZGUuYWN0aXZlID0gZmFsc2VcclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZih0aGlzLmFjY291bnRpZCA9PSBkZXRhaWwuYWNjb3VudGlkKXtcclxuICAgICAgICAgICAgaWYoZGV0YWlsLnN0YXRlPT1xaWFuX3N0YXRlLnFpYW4pe1xyXG4gICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ0aGlzLnJvYkljb25fU3AuYWN0aXZlID0gdHJ1ZVwiKVxyXG4gICAgICAgICAgICAgIHRoaXMucm9iSWNvbl9TcC5hY3RpdmUgPSB0cnVlXHJcblxyXG4gICAgICAgICAgICB9ZWxzZSBpZihkZXRhaWwuc3RhdGU9PXFpYW5fc3RhdGUuYnVxaWFuZyl7XHJcbiAgICAgICAgICAgICAgdGhpcy5yb2Jub0ljb25fU3AuYWN0aXZlID0gdHJ1ZVxyXG4gICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ2V0IHJvYiB2YWx1ZSA6XCIrZGV0YWlsLnN0YXRlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgIFxyXG4gICAgICB9LmJpbmQodGhpcykpXHJcblxyXG4gICAgICB0aGlzLm5vZGUub24oXCJwbGF5ZXJub2RlX2NoYW5nZW1hc3Rlcl9ldmVudFwiLGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgICAgICAgdmFyIGRldGFpbCA9IGV2ZW50IFxyXG4gICAgICAgICB0aGlzLnJvYkljb25fU3AuYWN0aXZlID0gZmFsc2VcclxuICAgICAgICAgdGhpcy5yb2Jub0ljb25fU3AuYWN0aXZlID0gZmFsc2VcclxuICAgICAgICAgaWYoZGV0YWlsPT10aGlzLmFjY291bnRpZCl7XHJcbiAgICAgICAgICAgIHRoaXMubWFzdGVySWNvbi5hY3RpdmUgPSB0cnVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgIH0uYmluZCh0aGlzKSlcclxuXHJcbiAgICAgIC8vIHRoaXMubm9kZS5vbihcInBsYXllcm5vZGVfYWRkX3RocmVlX2NhcmRcIixmdW5jdGlvbihldmVudCl7XHJcbiAgICAgIC8vICAgdmFyIGRldGFpbCA9IGV2ZW50IC8v5Zyw5Li755qEYWNjb3VudGlkXHJcbiAgICAgIC8vICAgaWYoZGV0YWlsPT10aGlzLmFjY291bnRpZCl7XHJcbiAgICAgIC8vICAgICAvL+e7meWcsOS4u+WPkeS4ieW8oOaOklxyXG5cclxuICAgICAgLy8gICB9XHJcbiAgICAgIC8vIH0uYmluZCh0aGlzKSlcclxuICAgIH0sXHJcblxyXG4gICAgc3RhcnQgKCkge1xyXG4gICAgICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICAvL+i/memHjOWIneWni+WMluaIv+mXtOWGheS9jee9ruiKgueCueS/oeaBryjoh6rlt7Hlkozlhbbku5bnjqnlrrYpXHJcbiAgICAvL2RhdGHnjqnlrrboioLngrnmlbDmja5cclxuICAgIC8vaW5kZXjnjqnlrrblnKjmiL/pl7TnmoTkvY3nva7ntKLlvJVcclxuICAgIGluaXRfZGF0YShkYXRhLGluZGV4KXtcclxuICAgICAgY29uc29sZS5sb2coXCJpbml0X2RhdGE6XCIrSlNPTi5zdHJpbmdpZnkoZGF0YSkpICBcclxuICAgICAgLy9kYXRhOntcImFjY291bnRpZFwiOlwiMjExNzgzNlwiLFwibmlja19uYW1lXCI6XCJ0aW55NTQzXCIsXCJhdmF0YXJVcmxcIjpcImh0dHA6Ly94eHhcIixcImdvbGRjb3VudFwiOjEwMDB9XHJcbiAgICAgIHRoaXMuYWNjb3VudGlkID0gZGF0YS5hY2NvdW50aWRcclxuICAgICAgdGhpcy5hY2NvdW50X2xhYmVsLnN0cmluZyA9IGRhdGEuYWNjb3VudGlkXHJcbiAgICAgIHRoaXMubmlja25hbWVfbGFiZWwuc3RyaW5nID0gZGF0YS5uaWNrX25hbWVcclxuICAgICAgdGhpcy5nbG9iYWxjb3VudF9sYWJlbC5zdHJpbmcgPSBkYXRhLmdvbGRjb3VudFxyXG4gICAgICB0aGlzLmNhcmRsaXN0X25vZGUgPSBbXVxyXG4gICAgICB0aGlzLnNlYXRfaW5kZXggPSBpbmRleFxyXG4gICAgICBpZihkYXRhLmlzcmVhZHk9PXRydWUpe1xyXG4gICAgICAgIHRoaXMucmVhZHlpbWFnZS5hY3RpdmUgPSB0cnVlXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8v572R57uc5Zu+54mH5Yqg6L29XHJcbiAgICAvLyAgICAgY2MubG9hZGVyLmxvYWQoe3VybDogZGF0YS5hdmF0YXJVcmwsIHR5cGU6ICdqcGcnfSwgIChlcnIsIHRleCk9PiB7XHJcbiAgICAvLyAgICAgLy9jYy5sb2coJ1Nob3VsZCBsb2FkIGEgdGV4dHVyZSBmcm9tIFJFU1RmdWwgQVBJIGJ5IHNwZWNpZnkgdGhlIHR5cGU6ICcgKyAodGV4IGluc3RhbmNlb2YgY2MuVGV4dHVyZTJEKSk7XHJcbiAgICAvLyAgICAgbGV0IG9sZFdpZHRoID0gdGhpcy5oZWFkSW1hZ2Uubm9kZS53aWR0aDtcclxuICAgIC8vICAgICAvL2NvbnNvbGUubG9nKCdvbGQgd2l0aGQnICsgb2xkV2lkdGgpO1xyXG4gICAgLy8gICAgIHRoaXMucm9vbV90b3V4aWFuZy5zcHJpdGVGcmFtZSA9IG5ldyBjYy5TcHJpdGVGcmFtZSh0ZXgpO1xyXG4gICAgLy8gICAgIGxldCBuZXdXaWR0aCA9IHRoaXMuaGVhZEltYWdlLm5vZGUud2lkdGg7XHJcbiAgICAvLyAgICAgLy9jb25zb2xlLmxvZygnb2xkIHdpdGhkJyArIG5ld1dpZHRoKTtcclxuICAgIC8vICAgICB0aGlzLmhlYWRJbWFnZS5ub2RlLnNjYWxlID0gb2xkV2lkdGggLyBuZXdXaWR0aDtcclxuICAgIC8vIH0pO1xyXG4gICAgLy/ov5nph4zmoLnmja7kvKDlhaXnmoRhdmFydGVy5p2l6I635Y+W5pys5Zyw5Zu+5YOPXHJcbiAgICB2YXIgc3RyID0gZGF0YS5hdmF0YXJVcmxcclxuICAgIC8vY29uc29sZS5sb2coc3RyKVxyXG4gICAgdmFyIGhlYWRfaW1hZ2VfcGF0aCA9IFwiVUkvaGVhZGltYWdlL1wiICsgc3RyXHJcbiAgICBjYy5sb2FkZXIubG9hZFJlcyhoZWFkX2ltYWdlX3BhdGgsY2MuU3ByaXRlRnJhbWUsZnVuY3Rpb24oZXJyLHNwcml0ZUZyYW1lKcKge1xyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UgfHwgZXJyKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH3CoCDCoCDCoCDCoCDCoCBcclxuICAgICAgICAgdGhpcy5oZWFkaW1hZ2Uuc3ByaXRlRnJhbWUgPSBzcHJpdGVGcmFtZTvCoCDCoCDCoCDCoCBcclxuICAgICAgICB9LmJpbmQodGhpcykpO1xyXG5cclxuICAgIC8v5rOo5YaM5LiA5LiqcGxheWVyX3JlYWR55raI5oGvXHJcbiAgICB0aGlzLm5vZGUub24oXCJwbGF5ZXJfcmVhZHlfbm90aWZ5XCIsZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicGxheWVyX3JlYWR5X25vdGlmeSBldmVudFwiLGV2ZW50KVxyXG4gICAgICAgICAgICB2YXIgZGV0YWlsID0gZXZlbnRcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCItLS0tLS1wbGF5ZXJfcmVhZHlfbm90aWZ5IGRldGFpbDpcIitkZXRhaWwpXHJcbiAgICAgICAgICAgIGlmKGRldGFpbD09dGhpcy5hY2NvdW50aWQpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWFkeWltYWdlLmFjdGl2ZSA9IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0uYmluZCh0aGlzKSlcclxuXHJcbiAgICAgICAgLy/nm5HlkKzlhoXpg6jpmo/lj6/ku6XmiqLlnLDkuLvmtojmga8s6L+Z5Liq5raI5oGv5Lya5Y+R57uZ5q+P5LiqcGxheWVybm9kZeiKgueCuVxyXG4gICAgICAgIHRoaXMubm9kZS5vbihcInBsYXllcm5vZGVfY2Fucm9iX2V2ZW50XCIsZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICAgICAgICB2YXIgZGV0YWlsID0gZXZlbnRcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCItLS0tLS1wbGF5ZXJub2RlX2NhbnJvYl9ldmVudCBkZXRhaWw6XCIrZGV0YWlsKVxyXG4gICAgICAgICAgICBpZihkZXRhaWw9PXRoaXMuYWNjb3VudGlkKXtcclxuICAgICAgICAgICAgICB0aGlzLnFpYW5nZGlkemh1X25vZGUuYWN0aXZlPXRydWVcclxuICAgICAgICAgICAgICAvL3RoaXMudGlwc19sYWJlbC5zdHJpbmcgPVwi5q2j5Zyo5oqi5Zyw5Li7XCIgXHJcbiAgICAgICAgICAgICAgdGhpcy50aW1lX2xhYmVsLnN0cmluZz1cIjEwXCJcclxuICAgICAgICAgICAgICAvL+W8gOWQr+S4gOS4quWumuaXtuWZqFxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0uYmluZCh0aGlzKSlcclxuICAgICAgICAvLz9cclxuICAgICAgICBpZihpbmRleD09MSl7XHJcbiAgICAgICAgICB0aGlzLmNhcmRfbm9kZS54ID0gLXRoaXMuY2FyZF9ub2RlLnggLSAzMFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gdXBkYXRlIChkdCkge30sXHJcbiAgICBwdXNoQ2FyZCgpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuY2FyZF9ub2RlLmFjdGl2ZSA9IHRydWUgXHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTwxNztpKyspe1xyXG4gICAgICAgICAgICB2YXIgY2FyZCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuY2FyZF9wcmVmYWIpXHJcbiAgICAgICAgICAgIGNhcmQuc2NhbGU9MC42XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiIHRoaXMuY2FyZF9ub2RlLnBhcmVudC5wYXJlbnRcIisgdGhpcy5jYXJkX25vZGUucGFyZW50LnBhcmVudC5uYW1lKVxyXG4gICAgICAgICAgICBjYXJkLnBhcmVudCA9IHRoaXMuY2FyZF9ub2RlXHJcbiAgICAgICAgICAgIC8vY2FyZC5wYXJlbnQgPSB0aGlzLm5vZGVcclxuICAgICAgICAgICAgdmFyIGhlaWdodCA9IGNhcmQuaGVpZ2h0XHJcbiAgICAgICAgICAgIGNhcmQueSA9ICgxNyAtIDEpICogMC41ICogaGVpZ2h0ICogMC40ICogMC4zIC0gaGVpZ2h0ICogMC40ICogMC4zICogaTtcclxuICAgICAgICAgICAgY2FyZC54ID0gMFxyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiY2FsbCBwdXNoQ2FyZCB4OlwiK2NhcmQueCtcIiB5OlwiK2NhcmQueSlcclxuICAgICAgICAgICAgdGhpcy5jYXJkbGlzdF9ub2RlLnB1c2goY2FyZClcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG59KTtcclxuIl19