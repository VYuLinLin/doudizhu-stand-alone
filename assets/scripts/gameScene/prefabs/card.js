import myglobal from "../../mygolbal.js"
const ddzData = require('ddzData')
const ddzConstants = require('ddzConstants')

cc.Class({
  extends: cc.Component,

  properties: {
    cards_sprite_atlas: cc.SpriteAtlas,

  },

  onLoad() {
    this.flag = false
    this.offset_y = 20

    this.node.on("reset_card_flag", function (event) {
      if (this.flag) {
        this.flag = false
        this.node.y -= this.offset_y
      }
    }.bind(this))

    // this.node.on("chu_card_succ",function(event){
    //    var chu_card_list = event
    //    for(var i=0;i<chu_card_list.length;i++){
    //     if(chu_card_list[i].caardIndex==this.caardIndex){
    //         //this.runToCenter(chu_card_list[i])
    //         //this.node.destory()
    //     }
    //    }
    // }.bind(this))
  },

  runToCenter() {
    //移动到屏幕中间，并带一个牌缩小的效果
  },
  start() {

  },

  init_data(data) {

  },
  setTouchEvent() {
    if (this.userId == myglobal.playerData.userId) {
      this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
        // var gameScene_node = this.node.parent
        // var room_state = gameScene_node.getComponent("gameScene").roomstate
        if (ddzData.gameState === ddzConstants.gameState.PLAYING) {
          console.log("TOUCH_START id:" + this.caardIndex)
          if (!this.flag) {
            this.flag = true
            this.node.y += this.offset_y
            //通知gameui层选定的牌
            // var carddata = {
            //   "index": this.caardIndex,
            //   "card_data": this.card_data,
            // }
            // gameScene_node.emit("choose_card_event", this.card_data)
            $socket.emit('_chooseCard', this.card_data)
          } else {
            this.flag = false
            this.node.y -= this.offset_y
            //通知gameUI取消了那张牌
            $socket.emit('_unchooseCard', this.caardIndex)
            // gameScene_node.emit("unchoose_card_event", this.caardIndex)
          }
        }
      }.bind(this))
    }
  },
  showCards(card, userId) {
    //card.index是服务器生成card给对象设置的一副牌里唯一id
    this.caardIndex = card.index
    //传入参数 card={"value":5,"shape":1,"index":20}
    this.card_data = card
    if (userId) {
      this.userId = userId //标识card属于的玩家
    }
    //服务器返回的是key(A-K),value对应的是资源的编号
    const cardValue = {
      "12": 1,
      "13": 2,
      "1": 3,
      "2": 4,
      "3": 5,
      "4": 6,
      "5": 7,
      "6": 8,
      "7": 9,
      "8": 10,
      "9": 11,
      "10": 12,
      "11": 13
    };

    // 黑桃： spade
    // 红桃： heart
    // 梅花： club
    // 方片： diamond
    // const CardShape = {
    //     "S": 1,
    //     "H": 2,
    //     "C": 3,
    //     "D": 4,
    // };
    const cardShape = {
      "1": 3,
      "2": 2,
      "3": 1,
      "4": 0
    };
    const kings = {
      "14": 54,
      "15": 53
    };

    var spriteKey = '';
    if (card.shape) {
      spriteKey = 'card_' + (cardShape[card.shape] * 13 + cardValue[card.value]);
    } else {
      spriteKey = 'card_' + kings[card.king];
    }

    this.node.getComponent(cc.Sprite).spriteFrame = this.cards_sprite_atlas.getSpriteFrame(spriteKey)
    this.setTouchEvent()
  }
});
