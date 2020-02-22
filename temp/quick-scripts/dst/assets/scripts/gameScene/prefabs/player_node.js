
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

var ddzConstants = require('ddzConstants');

var ddzData = require('ddzData');

cc.Class({
  "extends": cc.Component,
  properties: {
    headImage: cc.Sprite,
    account_label: cc.Label,
    nickname_label: cc.Label,
    // room_touxiang: cc.Sprite,
    globalcount_label: cc.Label,
    // headimage: cc.Sprite,
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
    var _this = this;

    this.readyimage.active = ddzData.gameState < ddzConstants.gameState.GAMESTART;
    this.offlineimage.active = false; //  准备开始

    this.node.on("player_ready_notify", function () {
      _this.readyimage.active = true;
    }); // 开始游戏(客户端发给客户端)

    this.node.on("gamestart_event", function () {
      _this.readyimage.active = false;
    }); //给其他玩家发牌事件

    this.node.on("push_card_event", function (event) {
      if (this.seat_index === 0) return; // 自己不再发牌

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
    // console.log("init_data:" + JSON.stringify(data))
    //data:{"accountid":"2117836","userName":"tiny543","avatarUrl":"http://xxx","goldcount":1000}
    this.accountid = data.accountid;
    this.account_label.string = data.accountid;
    this.nickname_label.string = data.userName;
    this.globalcount_label.string = data.goldcount;
    this.cardlist_node = [];
    this.seat_index = index;

    if (!index) {
      this.readyimage.active = false;
    } //网络图片加载
    // cc.loader.loadRes(data.avatarUrl, cc.SpriteFrame, (err, tex) => {
    //   //cc.log('Should load a texture from RESTful API by specify the type: ' + (tex instanceof cc.Texture2D));
    //   // let oldWidth = this.headImage.node.width;
    //   //console.log('old withd' + oeldWidth);
    //   if (err) return console.log(err)
    //   this.headImage.spriteFrame = tex
    //   // let newWidth = this.headImage.node.width;
    //   //console.log('old withd' + newWidth);
    //   // this.headImage.node.scale = oldWidth / newWidth;
    // });
    //这里根据传入的avarter来获取本地图像
    //console.log(str)


    var head_image_path = "UI/headimage/" + data.avatarUrl;
    cc.loader.loadRes(head_image_path, cc.SpriteFrame, function (err, spriteFrame) {
      if (err) {
        console.log(err.message || err);
        return;
      }

      this.headImage.spriteFrame = spriteFrame;
    }.bind(this)); //监听内部随可以抢地主消息,这个消息会发给每个playernode节点

    this.node.on("playernode_canrob_event", function (event) {
      var detail = event;
      console.log("------playernode_canrob_event detail:" + detail);

      if (detail == this.accountid) {
        this.qiangdidzhu_node.active = true; //this.tips_label.string ="正在抢地主" 

        this.time_label.string = "10"; //开启一个定时器
      }
    }.bind(this)); // 更改右边机器人的扑克牌位置

    if (index == 1) {
      this.card_node.x = -this.card_node.x;
    }
  },
  pushCard: function pushCard() {
    this.card_node.active = true;

    for (var i = 0; i < 17; i++) {
      var card = cc.instantiate(this.card_prefab);
      card.scale = 0.6;
      console.log(" this.card_node.parent.parent" + this.card_node.parent.parent.name);
      card.parent = this.card_node;
      var height = card.height;
      card.y = (17 - 1) * 0.5 * height * 0.4 * 0.3 - height * 0.4 * 0.3 * i;
      card.x = 0;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc2NyaXB0c1xcZ2FtZVNjZW5lXFxwcmVmYWJzLy4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc2NyaXB0c1xcZ2FtZVNjZW5lXFxwcmVmYWJzL2Fzc2V0c1xcc2NyaXB0c1xcZ2FtZVNjZW5lXFxwcmVmYWJzXFxwbGF5ZXJfbm9kZS5qcyJdLCJuYW1lcyI6WyJkZHpDb25zdGFudHMiLCJyZXF1aXJlIiwiZGR6RGF0YSIsImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiaGVhZEltYWdlIiwiU3ByaXRlIiwiYWNjb3VudF9sYWJlbCIsIkxhYmVsIiwibmlja25hbWVfbGFiZWwiLCJnbG9iYWxjb3VudF9sYWJlbCIsInJlYWR5aW1hZ2UiLCJOb2RlIiwib2ZmbGluZWltYWdlIiwiY2FyZF9ub2RlIiwiY2FyZF9wcmVmYWIiLCJQcmVmYWIiLCJjbG9ja2ltYWdlIiwicWlhbmdkaWR6aHVfbm9kZSIsInRpbWVfbGFiZWwiLCJyb2JpbWFnZV9zcCIsIlNwcml0ZUZyYW1lIiwicm9ibm9pbWFnZV9zcCIsInJvYkljb25TcCIsInJvYkljb25fU3AiLCJyb2Jub0ljb25fU3AiLCJtYXN0ZXJJY29uIiwib25Mb2FkIiwiYWN0aXZlIiwiZ2FtZVN0YXRlIiwiR0FNRVNUQVJUIiwibm9kZSIsIm9uIiwiZXZlbnQiLCJzZWF0X2luZGV4IiwicHVzaENhcmQiLCJiaW5kIiwiZGV0YWlsIiwiYWNjb3VudGlkIiwic3RhdGUiLCJxaWFuX3N0YXRlIiwicWlhbiIsImNvbnNvbGUiLCJsb2ciLCJidXFpYW5nIiwic3RhcnQiLCJpbml0X2RhdGEiLCJkYXRhIiwiaW5kZXgiLCJzdHJpbmciLCJ1c2VyTmFtZSIsImdvbGRjb3VudCIsImNhcmRsaXN0X25vZGUiLCJoZWFkX2ltYWdlX3BhdGgiLCJhdmF0YXJVcmwiLCJsb2FkZXIiLCJsb2FkUmVzIiwiZXJyIiwic3ByaXRlRnJhbWUiLCJtZXNzYWdlIiwieCIsImkiLCJjYXJkIiwiaW5zdGFudGlhdGUiLCJzY2FsZSIsInBhcmVudCIsIm5hbWUiLCJoZWlnaHQiLCJ5IiwicHVzaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBLElBQU1BLFlBQVksR0FBR0MsT0FBTyxDQUFDLGNBQUQsQ0FBNUI7O0FBQ0EsSUFBTUMsT0FBTyxHQUFHRCxPQUFPLENBQUMsU0FBRCxDQUF2Qjs7QUFDQUUsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDUCxhQUFTRCxFQUFFLENBQUNFLFNBREw7QUFHUEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLElBQUFBLFNBQVMsRUFBRUosRUFBRSxDQUFDSyxNQURKO0FBRVZDLElBQUFBLGFBQWEsRUFBRU4sRUFBRSxDQUFDTyxLQUZSO0FBR1ZDLElBQUFBLGNBQWMsRUFBRVIsRUFBRSxDQUFDTyxLQUhUO0FBSVY7QUFDQUUsSUFBQUEsaUJBQWlCLEVBQUVULEVBQUUsQ0FBQ08sS0FMWjtBQU1WO0FBQ0FHLElBQUFBLFVBQVUsRUFBRVYsRUFBRSxDQUFDVyxJQVBMO0FBUVZDLElBQUFBLFlBQVksRUFBRVosRUFBRSxDQUFDVyxJQVJQO0FBU1ZFLElBQUFBLFNBQVMsRUFBRWIsRUFBRSxDQUFDVyxJQVRKO0FBVVZHLElBQUFBLFdBQVcsRUFBRWQsRUFBRSxDQUFDZSxNQVZOO0FBV1Y7QUFDQUMsSUFBQUEsVUFBVSxFQUFFaEIsRUFBRSxDQUFDVyxJQVpMO0FBYVZNLElBQUFBLGdCQUFnQixFQUFFakIsRUFBRSxDQUFDVyxJQWJYO0FBYWlCO0FBQzNCTyxJQUFBQSxVQUFVLEVBQUVsQixFQUFFLENBQUNPLEtBZEw7QUFlVlksSUFBQUEsV0FBVyxFQUFFbkIsRUFBRSxDQUFDb0IsV0FmTjtBQWdCVkMsSUFBQUEsYUFBYSxFQUFFckIsRUFBRSxDQUFDb0IsV0FoQlI7QUFpQlZFLElBQUFBLFNBQVMsRUFBRXRCLEVBQUUsQ0FBQ0ssTUFqQko7QUFrQlZrQixJQUFBQSxVQUFVLEVBQUV2QixFQUFFLENBQUNXLElBbEJMO0FBbUJWYSxJQUFBQSxZQUFZLEVBQUV4QixFQUFFLENBQUNXLElBbkJQO0FBb0JWYyxJQUFBQSxVQUFVLEVBQUV6QixFQUFFLENBQUNXO0FBcEJMLEdBSEw7QUEwQlA7QUFFQWUsRUFBQUEsTUE1Qk8sb0JBNEJFO0FBQUE7O0FBQ1AsU0FBS2hCLFVBQUwsQ0FBZ0JpQixNQUFoQixHQUF5QjVCLE9BQU8sQ0FBQzZCLFNBQVIsR0FBb0IvQixZQUFZLENBQUMrQixTQUFiLENBQXVCQyxTQUFwRTtBQUNBLFNBQUtqQixZQUFMLENBQWtCZSxNQUFsQixHQUEyQixLQUEzQixDQUZPLENBR1A7O0FBQ0EsU0FBS0csSUFBTCxDQUFVQyxFQUFWLENBQWEscUJBQWIsRUFBb0MsWUFBTTtBQUN4QyxNQUFBLEtBQUksQ0FBQ3JCLFVBQUwsQ0FBZ0JpQixNQUFoQixHQUF5QixJQUF6QjtBQUNELEtBRkQsRUFKTyxDQU9QOztBQUNBLFNBQUtHLElBQUwsQ0FBVUMsRUFBVixDQUFhLGlCQUFiLEVBQWdDLFlBQU07QUFDcEMsTUFBQSxLQUFJLENBQUNyQixVQUFMLENBQWdCaUIsTUFBaEIsR0FBeUIsS0FBekI7QUFDRCxLQUZELEVBUk8sQ0FZUDs7QUFDQSxTQUFLRyxJQUFMLENBQVVDLEVBQVYsQ0FBYSxpQkFBYixFQUFnQyxVQUFVQyxLQUFWLEVBQWlCO0FBQy9DLFVBQUksS0FBS0MsVUFBTCxLQUFvQixDQUF4QixFQUEyQixPQURvQixDQUNiOztBQUNsQyxXQUFLQyxRQUFMO0FBQ0QsS0FIK0IsQ0FHOUJDLElBSDhCLENBR3pCLElBSHlCLENBQWhDO0FBS0EsU0FBS0wsSUFBTCxDQUFVQyxFQUFWLENBQWEsNEJBQWIsRUFBMkMsVUFBVUMsS0FBVixFQUFpQjtBQUMxRDtBQUNBLFVBQUlJLE1BQU0sR0FBR0osS0FBYixDQUYwRCxDQUkxRDtBQUNBOztBQUNBLFVBQUlJLE1BQU0sQ0FBQ0MsU0FBUCxJQUFvQixLQUFLQSxTQUE3QixFQUF3QztBQUN0QztBQUNBLGFBQUtwQixnQkFBTCxDQUFzQlUsTUFBdEIsR0FBK0IsS0FBL0I7QUFFRDs7QUFFRCxVQUFJLEtBQUtVLFNBQUwsSUFBa0JELE1BQU0sQ0FBQ0MsU0FBN0IsRUFBd0M7QUFDdEMsWUFBSUQsTUFBTSxDQUFDRSxLQUFQLElBQWdCQyxVQUFVLENBQUNDLElBQS9CLEVBQXFDO0FBRW5DQyxVQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSwrQkFBWjtBQUNBLGVBQUtuQixVQUFMLENBQWdCSSxNQUFoQixHQUF5QixJQUF6QjtBQUVELFNBTEQsTUFLTyxJQUFJUyxNQUFNLENBQUNFLEtBQVAsSUFBZ0JDLFVBQVUsQ0FBQ0ksT0FBL0IsRUFBd0M7QUFDN0MsZUFBS25CLFlBQUwsQ0FBa0JHLE1BQWxCLEdBQTJCLElBQTNCO0FBRUQsU0FITSxNQUdBO0FBQ0xjLFVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLG9CQUFvQk4sTUFBTSxDQUFDRSxLQUF2QztBQUNEO0FBQ0Y7QUFFRixLQTFCMEMsQ0EwQnpDSCxJQTFCeUMsQ0EwQnBDLElBMUJvQyxDQUEzQztBQTRCQSxTQUFLTCxJQUFMLENBQVVDLEVBQVYsQ0FBYSwrQkFBYixFQUE4QyxVQUFVQyxLQUFWLEVBQWlCO0FBQzdELFVBQUlJLE1BQU0sR0FBR0osS0FBYjtBQUNBLFdBQUtULFVBQUwsQ0FBZ0JJLE1BQWhCLEdBQXlCLEtBQXpCO0FBQ0EsV0FBS0gsWUFBTCxDQUFrQkcsTUFBbEIsR0FBMkIsS0FBM0I7O0FBQ0EsVUFBSVMsTUFBTSxJQUFJLEtBQUtDLFNBQW5CLEVBQThCO0FBQzVCLGFBQUtaLFVBQUwsQ0FBZ0JFLE1BQWhCLEdBQXlCLElBQXpCO0FBQ0Q7QUFDRixLQVA2QyxDQU81Q1EsSUFQNEMsQ0FPdkMsSUFQdUMsQ0FBOUMsRUE5Q08sQ0F1RFA7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0QsR0ExRk07QUE0RlBTLEVBQUFBLEtBNUZPLG1CQTRGQyxDQUVQLENBOUZNO0FBZ0dQO0FBQ0E7QUFDQTtBQUNBQyxFQUFBQSxTQW5HTyxxQkFtR0dDLElBbkdILEVBbUdTQyxLQW5HVCxFQW1HZ0I7QUFDckI7QUFDQTtBQUNBLFNBQUtWLFNBQUwsR0FBaUJTLElBQUksQ0FBQ1QsU0FBdEI7QUFDQSxTQUFLL0IsYUFBTCxDQUFtQjBDLE1BQW5CLEdBQTRCRixJQUFJLENBQUNULFNBQWpDO0FBQ0EsU0FBSzdCLGNBQUwsQ0FBb0J3QyxNQUFwQixHQUE2QkYsSUFBSSxDQUFDRyxRQUFsQztBQUNBLFNBQUt4QyxpQkFBTCxDQUF1QnVDLE1BQXZCLEdBQWdDRixJQUFJLENBQUNJLFNBQXJDO0FBQ0EsU0FBS0MsYUFBTCxHQUFxQixFQUFyQjtBQUNBLFNBQUtsQixVQUFMLEdBQWtCYyxLQUFsQjs7QUFDQSxRQUFJLENBQUNBLEtBQUwsRUFBWTtBQUNWLFdBQUtyQyxVQUFMLENBQWdCaUIsTUFBaEIsR0FBeUIsS0FBekI7QUFDRCxLQVhvQixDQVlyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsUUFBSXlCLGVBQWUsR0FBRyxrQkFBa0JOLElBQUksQ0FBQ08sU0FBN0M7QUFDQXJELElBQUFBLEVBQUUsQ0FBQ3NELE1BQUgsQ0FBVUMsT0FBVixDQUFrQkgsZUFBbEIsRUFBbUNwRCxFQUFFLENBQUNvQixXQUF0QyxFQUFtRCxVQUFVb0MsR0FBVixFQUFlQyxXQUFmLEVBQTRCO0FBQzdFLFVBQUlELEdBQUosRUFBUztBQUNQZixRQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWWMsR0FBRyxDQUFDRSxPQUFKLElBQWVGLEdBQTNCO0FBQ0E7QUFDRDs7QUFDRCxXQUFLcEQsU0FBTCxDQUFlcUQsV0FBZixHQUE2QkEsV0FBN0I7QUFDRCxLQU5rRCxDQU1qRHRCLElBTmlELENBTTVDLElBTjRDLENBQW5ELEVBMUJxQixDQWtDckI7O0FBQ0EsU0FBS0wsSUFBTCxDQUFVQyxFQUFWLENBQWEseUJBQWIsRUFBd0MsVUFBVUMsS0FBVixFQUFpQjtBQUN2RCxVQUFJSSxNQUFNLEdBQUdKLEtBQWI7QUFDQVMsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksMENBQTBDTixNQUF0RDs7QUFDQSxVQUFJQSxNQUFNLElBQUksS0FBS0MsU0FBbkIsRUFBOEI7QUFDNUIsYUFBS3BCLGdCQUFMLENBQXNCVSxNQUF0QixHQUErQixJQUEvQixDQUQ0QixDQUU1Qjs7QUFDQSxhQUFLVCxVQUFMLENBQWdCOEIsTUFBaEIsR0FBeUIsSUFBekIsQ0FINEIsQ0FJNUI7QUFFRDtBQUNGLEtBVnVDLENBVXRDYixJQVZzQyxDQVVqQyxJQVZpQyxDQUF4QyxFQW5DcUIsQ0E4Q3JCOztBQUNBLFFBQUlZLEtBQUssSUFBSSxDQUFiLEVBQWdCO0FBQ2QsV0FBS2xDLFNBQUwsQ0FBZThDLENBQWYsR0FBbUIsQ0FBQyxLQUFLOUMsU0FBTCxDQUFlOEMsQ0FBbkM7QUFDRDtBQUNGLEdBckpNO0FBdUpQekIsRUFBQUEsUUF2Sk8sc0JBdUpJO0FBQ1QsU0FBS3JCLFNBQUwsQ0FBZWMsTUFBZixHQUF3QixJQUF4Qjs7QUFDQSxTQUFLLElBQUlpQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHLEVBQXBCLEVBQXdCQSxDQUFDLEVBQXpCLEVBQTZCO0FBQzNCLFVBQUlDLElBQUksR0FBRzdELEVBQUUsQ0FBQzhELFdBQUgsQ0FBZSxLQUFLaEQsV0FBcEIsQ0FBWDtBQUNBK0MsTUFBQUEsSUFBSSxDQUFDRSxLQUFMLEdBQWEsR0FBYjtBQUNBdEIsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksa0NBQWtDLEtBQUs3QixTQUFMLENBQWVtRCxNQUFmLENBQXNCQSxNQUF0QixDQUE2QkMsSUFBM0U7QUFDQUosTUFBQUEsSUFBSSxDQUFDRyxNQUFMLEdBQWMsS0FBS25ELFNBQW5CO0FBQ0EsVUFBSXFELE1BQU0sR0FBR0wsSUFBSSxDQUFDSyxNQUFsQjtBQUNBTCxNQUFBQSxJQUFJLENBQUNNLENBQUwsR0FBUyxDQUFDLEtBQUssQ0FBTixJQUFXLEdBQVgsR0FBaUJELE1BQWpCLEdBQTBCLEdBQTFCLEdBQWdDLEdBQWhDLEdBQXNDQSxNQUFNLEdBQUcsR0FBVCxHQUFlLEdBQWYsR0FBcUJOLENBQXBFO0FBQ0FDLE1BQUFBLElBQUksQ0FBQ0YsQ0FBTCxHQUFTLENBQVQ7QUFDQSxXQUFLUixhQUFMLENBQW1CaUIsSUFBbkIsQ0FBd0JQLElBQXhCO0FBQ0Q7QUFDRjtBQW5LTSxDQUFUIiwic291cmNlUm9vdCI6Ii4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc2NyaXB0c1xcZ2FtZVNjZW5lXFxwcmVmYWJzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG15Z2xvYmFsIGZyb20gXCIuLi8uLi9teWdvbGJhbC5qc1wiXHJcbmNvbnN0IGRkekNvbnN0YW50cyA9IHJlcXVpcmUoJ2RkekNvbnN0YW50cycpXHJcbmNvbnN0IGRkekRhdGEgPSByZXF1aXJlKCdkZHpEYXRhJylcclxuY2MuQ2xhc3Moe1xyXG4gIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgcHJvcGVydGllczoge1xyXG4gICAgaGVhZEltYWdlOiBjYy5TcHJpdGUsXHJcbiAgICBhY2NvdW50X2xhYmVsOiBjYy5MYWJlbCxcclxuICAgIG5pY2tuYW1lX2xhYmVsOiBjYy5MYWJlbCxcclxuICAgIC8vIHJvb21fdG91eGlhbmc6IGNjLlNwcml0ZSxcclxuICAgIGdsb2JhbGNvdW50X2xhYmVsOiBjYy5MYWJlbCxcclxuICAgIC8vIGhlYWRpbWFnZTogY2MuU3ByaXRlLFxyXG4gICAgcmVhZHlpbWFnZTogY2MuTm9kZSxcclxuICAgIG9mZmxpbmVpbWFnZTogY2MuTm9kZSxcclxuICAgIGNhcmRfbm9kZTogY2MuTm9kZSxcclxuICAgIGNhcmRfcHJlZmFiOiBjYy5QcmVmYWIsXHJcbiAgICAvL3RpcHNfbGFiZWw6Y2MuTGFiZWwsXHJcbiAgICBjbG9ja2ltYWdlOiBjYy5Ob2RlLFxyXG4gICAgcWlhbmdkaWR6aHVfbm9kZTogY2MuTm9kZSwgLy/miqLlnLDkuLvnmoTniLboioLngrlcclxuICAgIHRpbWVfbGFiZWw6IGNjLkxhYmVsLFxyXG4gICAgcm9iaW1hZ2Vfc3A6IGNjLlNwcml0ZUZyYW1lLFxyXG4gICAgcm9ibm9pbWFnZV9zcDogY2MuU3ByaXRlRnJhbWUsXHJcbiAgICByb2JJY29uU3A6IGNjLlNwcml0ZSxcclxuICAgIHJvYkljb25fU3A6IGNjLk5vZGUsXHJcbiAgICByb2Jub0ljb25fU3A6IGNjLk5vZGUsXHJcbiAgICBtYXN0ZXJJY29uOiBjYy5Ob2RlLFxyXG4gIH0sXHJcblxyXG4gIC8vIExJRkUtQ1lDTEUgQ0FMTEJBQ0tTOlxyXG5cclxuICBvbkxvYWQoKSB7XHJcbiAgICB0aGlzLnJlYWR5aW1hZ2UuYWN0aXZlID0gZGR6RGF0YS5nYW1lU3RhdGUgPCBkZHpDb25zdGFudHMuZ2FtZVN0YXRlLkdBTUVTVEFSVFxyXG4gICAgdGhpcy5vZmZsaW5laW1hZ2UuYWN0aXZlID0gZmFsc2VcclxuICAgIC8vICDlh4blpIflvIDlp4tcclxuICAgIHRoaXMubm9kZS5vbihcInBsYXllcl9yZWFkeV9ub3RpZnlcIiwgKCkgPT4ge1xyXG4gICAgICB0aGlzLnJlYWR5aW1hZ2UuYWN0aXZlID0gdHJ1ZVxyXG4gICAgfSlcclxuICAgIC8vIOW8gOWni+a4uOaIjyjlrqLmiLfnq6/lj5Hnu5nlrqLmiLfnq68pXHJcbiAgICB0aGlzLm5vZGUub24oXCJnYW1lc3RhcnRfZXZlbnRcIiwgKCkgPT4ge1xyXG4gICAgICB0aGlzLnJlYWR5aW1hZ2UuYWN0aXZlID0gZmFsc2VcclxuICAgIH0pXHJcblxyXG4gICAgLy/nu5nlhbbku5bnjqnlrrblj5HniYzkuovku7ZcclxuICAgIHRoaXMubm9kZS5vbihcInB1c2hfY2FyZF9ldmVudFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgaWYgKHRoaXMuc2VhdF9pbmRleCA9PT0gMCkgcmV0dXJuIC8vIOiHquW3seS4jeWGjeWPkeeJjFxyXG4gICAgICB0aGlzLnB1c2hDYXJkKClcclxuICAgIH0uYmluZCh0aGlzKSlcclxuXHJcbiAgICB0aGlzLm5vZGUub24oXCJwbGF5ZXJub2RlX3JvYl9zdGF0ZV9ldmVudFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgLy97XCJhY2NvdW50aWRcIjpcIjIxNjI4NjZcIixcInN0YXRlXCI6MX1cclxuICAgICAgdmFyIGRldGFpbCA9IGV2ZW50XHJcblxyXG4gICAgICAvL+WmguaenOaYr+iHquW3seWcqOaKou+8jOmcgOimgemakOiXj3FpYW5nZGlkemh1X25vZGXoioLngrlcclxuICAgICAgLy90aGlzLmFjY291bnRpZOihqOekuui/meS4quiKgueCueaMguaOpeeahGFjY291bnRpZFxyXG4gICAgICBpZiAoZGV0YWlsLmFjY291bnRpZCA9PSB0aGlzLmFjY291bnRpZCkge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJkZXRhaWwuYWNjb3VudGlkXCIrZGV0YWlsLmFjY291bnRpZClcclxuICAgICAgICB0aGlzLnFpYW5nZGlkemh1X25vZGUuYWN0aXZlID0gZmFsc2VcclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLmFjY291bnRpZCA9PSBkZXRhaWwuYWNjb3VudGlkKSB7XHJcbiAgICAgICAgaWYgKGRldGFpbC5zdGF0ZSA9PSBxaWFuX3N0YXRlLnFpYW4pIHtcclxuXHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcInRoaXMucm9iSWNvbl9TcC5hY3RpdmUgPSB0cnVlXCIpXHJcbiAgICAgICAgICB0aGlzLnJvYkljb25fU3AuYWN0aXZlID0gdHJ1ZVxyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKGRldGFpbC5zdGF0ZSA9PSBxaWFuX3N0YXRlLmJ1cWlhbmcpIHtcclxuICAgICAgICAgIHRoaXMucm9ibm9JY29uX1NwLmFjdGl2ZSA9IHRydWVcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ2V0IHJvYiB2YWx1ZSA6XCIgKyBkZXRhaWwuc3RhdGUpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgfS5iaW5kKHRoaXMpKVxyXG5cclxuICAgIHRoaXMubm9kZS5vbihcInBsYXllcm5vZGVfY2hhbmdlbWFzdGVyX2V2ZW50XCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICB2YXIgZGV0YWlsID0gZXZlbnRcclxuICAgICAgdGhpcy5yb2JJY29uX1NwLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgIHRoaXMucm9ibm9JY29uX1NwLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgIGlmIChkZXRhaWwgPT0gdGhpcy5hY2NvdW50aWQpIHtcclxuICAgICAgICB0aGlzLm1hc3Rlckljb24uYWN0aXZlID0gdHJ1ZVxyXG4gICAgICB9XHJcbiAgICB9LmJpbmQodGhpcykpXHJcblxyXG4gICAgLy8gdGhpcy5ub2RlLm9uKFwicGxheWVybm9kZV9hZGRfdGhyZWVfY2FyZFwiLGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgIC8vICAgdmFyIGRldGFpbCA9IGV2ZW50IC8v5Zyw5Li755qEYWNjb3VudGlkXHJcbiAgICAvLyAgIGlmKGRldGFpbD09dGhpcy5hY2NvdW50aWQpe1xyXG4gICAgLy8gICAgIC8v57uZ5Zyw5Li75Y+R5LiJ5byg5o6SXHJcblxyXG4gICAgLy8gICB9XHJcbiAgICAvLyB9LmJpbmQodGhpcykpXHJcbiAgfSxcclxuXHJcbiAgc3RhcnQoKSB7XHJcblxyXG4gIH0sXHJcblxyXG4gIC8v6L+Z6YeM5Yid5aeL5YyW5oi/6Ze05YaF5L2N572u6IqC54K55L+h5oGvKOiHquW3seWSjOWFtuS7lueOqeWutilcclxuICAvL2RhdGHnjqnlrrboioLngrnmlbDmja5cclxuICAvL2luZGV4546p5a625Zyo5oi/6Ze055qE5L2N572u57Si5byVXHJcbiAgaW5pdF9kYXRhKGRhdGEsIGluZGV4KSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhcImluaXRfZGF0YTpcIiArIEpTT04uc3RyaW5naWZ5KGRhdGEpKVxyXG4gICAgLy9kYXRhOntcImFjY291bnRpZFwiOlwiMjExNzgzNlwiLFwidXNlck5hbWVcIjpcInRpbnk1NDNcIixcImF2YXRhclVybFwiOlwiaHR0cDovL3h4eFwiLFwiZ29sZGNvdW50XCI6MTAwMH1cclxuICAgIHRoaXMuYWNjb3VudGlkID0gZGF0YS5hY2NvdW50aWRcclxuICAgIHRoaXMuYWNjb3VudF9sYWJlbC5zdHJpbmcgPSBkYXRhLmFjY291bnRpZFxyXG4gICAgdGhpcy5uaWNrbmFtZV9sYWJlbC5zdHJpbmcgPSBkYXRhLnVzZXJOYW1lXHJcbiAgICB0aGlzLmdsb2JhbGNvdW50X2xhYmVsLnN0cmluZyA9IGRhdGEuZ29sZGNvdW50XHJcbiAgICB0aGlzLmNhcmRsaXN0X25vZGUgPSBbXVxyXG4gICAgdGhpcy5zZWF0X2luZGV4ID0gaW5kZXhcclxuICAgIGlmICghaW5kZXgpIHtcclxuICAgICAgdGhpcy5yZWFkeWltYWdlLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICB9XHJcbiAgICAvL+e9kee7nOWbvueJh+WKoOi9vVxyXG4gICAgLy8gY2MubG9hZGVyLmxvYWRSZXMoZGF0YS5hdmF0YXJVcmwsIGNjLlNwcml0ZUZyYW1lLCAoZXJyLCB0ZXgpID0+IHtcclxuICAgIC8vICAgLy9jYy5sb2coJ1Nob3VsZCBsb2FkIGEgdGV4dHVyZSBmcm9tIFJFU1RmdWwgQVBJIGJ5IHNwZWNpZnkgdGhlIHR5cGU6ICcgKyAodGV4IGluc3RhbmNlb2YgY2MuVGV4dHVyZTJEKSk7XHJcbiAgICAvLyAgIC8vIGxldCBvbGRXaWR0aCA9IHRoaXMuaGVhZEltYWdlLm5vZGUud2lkdGg7XHJcbiAgICAvLyAgIC8vY29uc29sZS5sb2coJ29sZCB3aXRoZCcgKyBvZWxkV2lkdGgpO1xyXG4gICAgLy8gICBpZiAoZXJyKSByZXR1cm4gY29uc29sZS5sb2coZXJyKVxyXG4gICAgLy8gICB0aGlzLmhlYWRJbWFnZS5zcHJpdGVGcmFtZSA9IHRleFxyXG4gICAgLy8gICAvLyBsZXQgbmV3V2lkdGggPSB0aGlzLmhlYWRJbWFnZS5ub2RlLndpZHRoO1xyXG4gICAgLy8gICAvL2NvbnNvbGUubG9nKCdvbGQgd2l0aGQnICsgbmV3V2lkdGgpO1xyXG4gICAgLy8gICAvLyB0aGlzLmhlYWRJbWFnZS5ub2RlLnNjYWxlID0gb2xkV2lkdGggLyBuZXdXaWR0aDtcclxuICAgIC8vIH0pO1xyXG4gICAgLy/ov5nph4zmoLnmja7kvKDlhaXnmoRhdmFydGVy5p2l6I635Y+W5pys5Zyw5Zu+5YOPXHJcbiAgICAvL2NvbnNvbGUubG9nKHN0cilcclxuICAgIHZhciBoZWFkX2ltYWdlX3BhdGggPSBcIlVJL2hlYWRpbWFnZS9cIiArIGRhdGEuYXZhdGFyVXJsXHJcbiAgICBjYy5sb2FkZXIubG9hZFJlcyhoZWFkX2ltYWdlX3BhdGgsIGNjLlNwcml0ZUZyYW1lLCBmdW5jdGlvbiAoZXJyLCBzcHJpdGVGcmFtZSkge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UgfHwgZXJyKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5oZWFkSW1hZ2Uuc3ByaXRlRnJhbWUgPSBzcHJpdGVGcmFtZTtcclxuICAgIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgLy/nm5HlkKzlhoXpg6jpmo/lj6/ku6XmiqLlnLDkuLvmtojmga8s6L+Z5Liq5raI5oGv5Lya5Y+R57uZ5q+P5LiqcGxheWVybm9kZeiKgueCuVxyXG4gICAgdGhpcy5ub2RlLm9uKFwicGxheWVybm9kZV9jYW5yb2JfZXZlbnRcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgIHZhciBkZXRhaWwgPSBldmVudFxyXG4gICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLXBsYXllcm5vZGVfY2Fucm9iX2V2ZW50IGRldGFpbDpcIiArIGRldGFpbClcclxuICAgICAgaWYgKGRldGFpbCA9PSB0aGlzLmFjY291bnRpZCkge1xyXG4gICAgICAgIHRoaXMucWlhbmdkaWR6aHVfbm9kZS5hY3RpdmUgPSB0cnVlXHJcbiAgICAgICAgLy90aGlzLnRpcHNfbGFiZWwuc3RyaW5nID1cIuato+WcqOaKouWcsOS4u1wiIFxyXG4gICAgICAgIHRoaXMudGltZV9sYWJlbC5zdHJpbmcgPSBcIjEwXCJcclxuICAgICAgICAvL+W8gOWQr+S4gOS4quWumuaXtuWZqFxyXG5cclxuICAgICAgfVxyXG4gICAgfS5iaW5kKHRoaXMpKVxyXG4gICAgLy8g5pu05pS55Y+z6L655py65Zmo5Lq655qE5omR5YWL54mM5L2N572uXHJcbiAgICBpZiAoaW5kZXggPT0gMSkge1xyXG4gICAgICB0aGlzLmNhcmRfbm9kZS54ID0gLXRoaXMuY2FyZF9ub2RlLnhcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBwdXNoQ2FyZCgpIHtcclxuICAgIHRoaXMuY2FyZF9ub2RlLmFjdGl2ZSA9IHRydWVcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTc7IGkrKykge1xyXG4gICAgICB2YXIgY2FyZCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuY2FyZF9wcmVmYWIpXHJcbiAgICAgIGNhcmQuc2NhbGUgPSAwLjZcclxuICAgICAgY29uc29sZS5sb2coXCIgdGhpcy5jYXJkX25vZGUucGFyZW50LnBhcmVudFwiICsgdGhpcy5jYXJkX25vZGUucGFyZW50LnBhcmVudC5uYW1lKVxyXG4gICAgICBjYXJkLnBhcmVudCA9IHRoaXMuY2FyZF9ub2RlXHJcbiAgICAgIHZhciBoZWlnaHQgPSBjYXJkLmhlaWdodFxyXG4gICAgICBjYXJkLnkgPSAoMTcgLSAxKSAqIDAuNSAqIGhlaWdodCAqIDAuNCAqIDAuMyAtIGhlaWdodCAqIDAuNCAqIDAuMyAqIGk7XHJcbiAgICAgIGNhcmQueCA9IDBcclxuICAgICAgdGhpcy5jYXJkbGlzdF9ub2RlLnB1c2goY2FyZClcclxuICAgIH1cclxuICB9LFxyXG59KTtcclxuIl19