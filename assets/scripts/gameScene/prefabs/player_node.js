import myglobal from "../../mygolbal.js"
const ddzConstants = require('ddzConstants')
const ddzData = require('ddzData')
cc.Class({
  extends: cc.Component,

  properties: {
    headImage: cc.Sprite,
    // account_label: cc.Label,
    nickname_label: cc.Label,
    // room_touxiang: cc.Sprite,
    globalcount_label: cc.Label,
    // headimage: cc.Sprite,
    readyimage: cc.Node,
    card_node: cc.Node, // 扑克牌节点
    card_prefab: cc.Prefab,
    //tips_label:cc.Label,
    clockimage: cc.Node,
    qiangdidzhu_node: cc.Node, //抢地主的父节点
    time_label: cc.Label,
    robimage_sp: cc.SpriteFrame,
    robnoimage_sp: cc.SpriteFrame,
    robIcon_Sp: cc.Node, // 抢地主
    robnoIcon_Sp: cc.Node, // 不抢
    masterIcon: cc.Node, // 地主标识节点
    jiaodizhu: {
      type: cc.AudioClip,
      default: null
    },
    buqiang: {
      type: cc.AudioClip,
      default: null
    }
  },

  // LIFE-CYCLE CALLBACKS:
  getGameScene() {
    return cc.find('Canvas').getComponent('gameScene')
  },
  onLoad() {
    this.masterIcon.active = false
    //  准备开始
    // this.node.on("player_ready_notify", () => {
    //   this.readyimage.active = true
    // })
    // 开始游戏(客户端发给客户端)
    this.node.on("gamestart_event", () => {
      this.readyimage.active = false
    })

    //给其他玩家发牌事件
    this.node.on("push_card_event", function (event) {
      if (this.seat_index === 0) return // 自己不再发牌
      this.pushCard()
    }.bind(this))
    // this.node.on("playernode_rob_state_event", function (event) {
    //   // this.node.on("playernode_rob_state_event", function (event) {
    //   //{"userId":"2162866","state":1}
    //   var detail = event

    //   //如果是自己在抢，需要隐藏qiangdidzhu_node节点
    //   //this.userId表示这个节点挂接的userId
    //   if (detail.userId == this.userId) {
    //     this.qiangdidzhu_node.active = false
    //   }
    //   if (this.userId == detail.userId) {
    //     if (detail.state == qian_state.qiang) {
    //       console.log("this.robIcon_Sp.active = true")
    //       this.robIcon_Sp.active = true

    //     } else if (detail.state == qian_state.buqiang) {
    //       this.robnoIcon_Sp.active = true

    //     } else {
    //       console.log("get rob value :" + detail.state)
    //     }
    //   }

    // }.bind(this))

    this.node.on("playernode_changemaster_event", function (userId) {
      this.robIcon_Sp.active = false
      this.robnoIcon_Sp.active = false
      if (userId !== this.userId) return
      this.masterIcon.active = true
      if (userId === myglobal.playerData.userId) return
      const card = this.cardlist_node[0]
      card && (card.getChildByName('count').getComponent(cc.Label).string = 20)
    }.bind(this))

    // this.node.on("playernode_add_three_card",function(event){
    //   var detail = event //地主的accountid
    //   if(detail==this.userId){
    //     //给地主发三张排

    //   }
    // }.bind(this))
  },

  start() {
    // 监听游戏状态
    if (!CC_EDITOR) {
      ddzData.gameStateNotify.addListener(this.gameStateHandler, this)
    }
    window.$socket.on('canrob_notify', this.canrobNotify, this) // 抢地主
    window.$socket.on('gameEndNotify', this.gameEndNotify, this) // 游戏结束
  },
  onDestroy() {
    if (!CC_EDITOR) {
      ddzData.gameStateNotify.removeListener(this.gameStateHandler, this)
    }
    window.$socket.remove('canrob_notify', this)
    window.$socket.remove('gameEndNotify', this)
  },
  //这里初始化房间内位置节点信息(自己和其他玩家)
  //data玩家节点数据
  //index玩家在房间的位置索引
  init_data(data, index) {
    //data:{"userId":"2117836","userName":"tiny543","avatarUrl":"http://xxx","goldcount":1000}
    this.userId = data.userId
    // this.account_label.string = data.accountid
    this.nickname_label.string = data.userName
    this.globalcount_label.string = data.goldcount
    this.cardlist_node = []
    this.seat_index = index
    //这里根据传入的avarter来获取本地图像
    var head_image_path = "UI/headimage/" + data.avatarUrl
    cc.loader.loadRes(head_image_path, cc.SpriteFrame, function (err, spriteFrame) {
      if (err) {
        console.log(err.message || err);
        return;
      }
      this.headImage.spriteFrame = spriteFrame;
    }.bind(this));
    if (!index) {
      this.readyimage.active = false
      return
    }
    // 更改右边机器人的扑克牌位置
    if (index === 1) {
      this.card_node.x = -this.card_node.x
    }
  },
  gameStateHandler(state) {
    // 开始游戏 - 已准备
    if (state === ddzConstants.gameState.GAMESTART) {
      // const cards = this.cardlist_node
      // for (let i = 0; i < cards.length; i++) {
      //   if (!cards[i]) break
      //   cards[i].destroy()
      //   cards.splice(i, 1)
      // }
      this.cardlist_node = []
      this.card_node.removeAllChildren()
      this.clearOutZone()
      this.masterIcon.active = false // 隐藏地主标识
      this.readyimage.active = false
      this.robIcon_Sp.active = false
      this.robnoIcon_Sp.active = false
    }
  },
  // 抢地主通知
  canrobNotify(landlordId) {
    if (landlordId === this.userId && landlordId !== myglobal.playerData.userId) {
      this.robIcon_Sp.active = false
      this.robnoIcon_Sp.active = false
      const isQdz = common.random(0, 10) > 5 // 是否抢地主
      this.schedulerOnce(() => {
        isQdz && (this.robIcon_Sp.active = true) // 抢
        !isQdz && (this.robnoIcon_Sp.active = true) // 不抢
        window.$socket.emit('canrob_state_notify', {
          userId: this.userId,
          state: isQdz ? qian_state.qiang : qian_state.buqiang
        })
        common.audio.PlayEffect(isQdz ? this.jiaodizhu : this.buqiang)
      })
    }
  },
  /**
   * @description 开启一个十秒的闹钟定时器
   * @param {function} fn 关闭后的回调函数
   * @param {Number} seconds 几秒后关闭
   */
  schedulerOnce(fn, seconds = common.random(0, 10)) {
    this.count = 10;
    this.time_label.string = this.count
    this.qiangdidzhu_node.active = true
    const callback = function () {
      if (!this.count || (10 - seconds) === this.count) {
        // 在第六次执行回调时取消这个计时器
        this.qiangdidzhu_node.active = false
        this.unschedule(callback)
        fn && fn()
      }
      this.time_label.string = --this.count
    }
    this.schedule(callback, 1, seconds)
  },
  // 给机器发牌
  pushCard() {
    this.card_node.active = true
    // for (var i = 0; i < 17; i++) {
      var card = cc.instantiate(this.card_prefab)
      card.scale = 0.6
      card.parent = this.card_node
      // var height = card.height
      // card.y = (17 - 1) * 0.5 * height * 0.4 * 0.3 - height * 0.4 * 0.3 * i;
      // card.x = 0
      this.cardlist_node.push(card)
    // }
    let count = 0;
    card.getChildByName('count').active = true
    const callback = function () {
      count === 17 && this.unschedule(callback)
      card.getChildByName('count').getComponent(cc.Label).string = count
      count++;
    }
    this.schedule(callback, 0.1, 17);
  },
  /**
   * @description 出牌后减少手牌节点
   * @param {Number} len 需要减少的节点数量
   */
  subtractCards(len = 0) {
    if (!this.cardlist_node.length) return
    const countLabel = this.cardlist_node[0].getChildByName('count').getComponent(cc.Label)
    countLabel.string -= len
    !Number(countLabel.string) && this.card_node.removeAllChildren()
  },
  // 游戏结束显示剩余牌型
  gameEndNotify({otherPlayerCards}) {
    const cardList = otherPlayerCards[this.userId]
    const cards = this.cardlist_node
    if (!cardList || this.userId === myglobal.playerData.userId) return
    cardList.sort((a, b) => b.val - a.val)
    for (let i = 0; i < cardList.length; i++) {
      let card = cards[i]
      // card.y = (17 - 1) * 0.5 * card.height * 0.4 * 0.3 - card.height * 0.4 * 0.3 * i;
      if (card) {
        card.getChildByName('count').getComponent(cc.Label).string = ''
      } else {
        card = cc.instantiate(this.card_prefab)
        card.scale = 0.6
        card.parent = this.card_node
        cards.push(card)
      }
      card.getComponent("card").showCards(cardList[i], this.userId)
    }
  },
  //清除显示出牌节点全部子节点(就是把出牌的清空)
  clearOutZone() {
    var gameScene_script = this.getGameScene()
    var outCard_node = gameScene_script.getUserOutCardPosByAccount(this.userId)
    var children = outCard_node.children;
    for (var i = 0; i < children.length; i++) {
      var card = children[i];
      card.destroy()
    }
    outCard_node.removeAllChildren(true);
  },
});
