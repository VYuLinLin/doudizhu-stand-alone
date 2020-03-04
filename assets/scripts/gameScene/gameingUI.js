import myglobal from "../mygolbal.js"
const ddzConstants = require('ddzConstants')
const ddzData = require('ddzData')

cc.Class({
  extends: cc.Component,

  properties: {
    gameingUI: cc.Node,
    card_prefab: cc.Prefab,
    robUI: cc.Node, // 抢地主按钮节点
    timeLabel: cc.Label, // 计时器节点
    cardsNode: cc.Node, // 扑克节点
    bottom_card_pos_node: cc.Node, // 底牌节点
    playingUI_node: cc.Node, // 出牌提示节点
    tipsLabel: cc.Label, //玩家出牌不合法的tips
    loseNode: cc.Node, // 失败特效节点
    winNode: cc.Node, // 胜利特效节点
    fapaiAudio: {
      type: cc.AudioClip,
      default: null
    },
    jiaodizhuAudio: {
      type: cc.AudioClip,
      default: null
    },
    buqiangAudio: {
      type: cc.AudioClip,
      default: null
    },
    cardsAudio: {
      type: cc.AudioClip,
      default: null
    },
    buyaoAudio: {
      type: cc.AudioClip,
      default: []
    },
    chupaiAudio: {
      type: cc.AudioClip,
      default: null
    }
  },

  onLoad() {
    //自己牌列表 
    this.cards_node = []
    this.card_width = 0
    //当前可以抢地主的accountid
    // this.rob_player_accountid = 0
    //发牌动画是否结束
    // this.fapai_end = false
    //底牌数组
    this.bottom_card = []
    //底牌的json对象数据
    this.bottom_card_data = []
    this.choose_card_data = []
    this.outcar_zone = []

    this.push_card_tmp = []
    // 提示牌型
    this.promptCount = 0
    this.promptList = []
    //监听服务器可以出牌消息
    // myglobal.socket.onCanChuCard(function (data) {
    //   console.log("onCanChuCard" + JSON.stringify(data))
    //   //判断是不是自己能出牌
    //   if (data == myglobal.playerData.userId) {
    //     //先清理出牌区域
    //     this.clearOutZone(myglobal.playerData.userId)
    //     //先把自己出牌列表置空
    //     //this.choose_card_data=[]
    //     //显示可以出牌的UI
    //     this.playingUI_node.active = true

    //   }
    // }.bind(this))

    //监听服务器：其他玩家出牌消息
    // myglobal.socket.onOtherPlayerChuCard(function (data) {
    //   //{"userId":"2357540","cards":[{"index":4,"card_data":{"index":4,"value":1,"shape":1}}]}
    //   console.log("onOtherPlayerChuCard" + JSON.stringify(data))

    //   var userId = data.userId
    //   var gameScene_script = this.node.parent.getComponent("gameScene")
    //   //获取出牌区域节点
    //   var outCard_node = gameScene_script.getUserOutCardPosByAccount(userId)
    //   if (outCard_node == null) {
    //     return
    //   }

    //   var node_cards = []
    //   for (var i = 0; i < data.cards.length; i++) {
    //     var card = cc.instantiate(this.card_prefab)
    //     card.getComponent("card").showCards(data.cards[i].card_data, myglobal.playerData.userId)
    //     node_cards.push(card)
    //   }
    //   this.appendOtherCardsToOutZone(outCard_node, node_cards, 0)
    // }.bind(this))

    //内部事件:显示底牌事件,data是三张底牌数据
    this.node.on("show_bottom_card_event", function (data) {
      console.log("----show_bottom_card_event", data)
      this.bottom_card_data = data
      for (var i = 0; i < data.length; i++) {
        var card = this.bottom_card[i]
        var show_data = data[i]
        var call_data = {
          "obj": card,
          "data": show_data,
        }
        var run = cc.callFunc(function (target, activedata) {
          var show_card = activedata.obj
          var show_data = activedata.data
          show_card.getComponent("card").showCards(show_data)
        }, this, call_data)

        card.runAction(
          cc.sequence(cc.rotateBy(0, 0, 180),
            cc.rotateBy(0.2, 0, -90),
            run,
            cc.rotateBy(0.2, 0, -90),
            cc.scaleBy(1, 1.2))
        )
      }
      common.audio.PlayEffect(this.cardsAudio)
      //this.node.parent.emit("change_room_state_event",defines.gameState.ROOM_PLAYING)
      //如果自己地主，给加上三张底牌
      if (myglobal.playerData.userId === myglobal.playerData.masterUserId) {
        this.scheduleOnce(this.pushThreeCard.bind(this), 0.2)
      }


    }.bind(this))

    //注册监听一个选择牌消息 
    // this.node.on("choose_card_event", function (cardData) {
    //   this.choose_card_data.push(cardData)
    // }.bind(this))

    // this.node.on("unchoose_card_event", function (cardId) {
    //   for (let i = 0; i < this.choose_card_data.length; i++) {
    //     if (this.choose_card_data[i].index === cardId) {
    //       this.choose_card_data.splice(i, 1)
    //     }
    //   }
    // }.bind(this))
  },
  start() {
    // 监听游戏状态
    if (!CC_EDITOR) {
      ddzData.gameStateNotify.addListener(this.gameStateHandler, this)
    }
    window.$socket.on('_chooseCard', this._chooseCardNotify, this) // 选牌
    window.$socket.on('_unchooseCard', this._unchooseCardNotify, this) // 取消选牌
    window.$socket.on('pushcard_notify', this.pushCardNotify, this) // 发牌
    window.$socket.on('canrob_notify', this.canrobNotify, this) // 抢地主
    window.$socket.on('selfPlayAHandNotify', this.selfPlayAHandNotify, this) // 出牌
    window.$socket.on('rootPlayAHandNotify', this.rootPlayAHandNotify, this) // 机器出牌
    window.$socket.on('gameEndNotify', this.gameEndNotify, this) // 游戏结束
  },
  onDestroy() {
    if (!CC_EDITOR) {
      ddzData.gameStateNotify.removeListener(this.gameStateHandler, this)
    }
    window.$socket.remove('_chooseCard', this)
    window.$socket.remove('_unchooseCard', this)
    window.$socket.remove('pushcard_notify', this)
    window.$socket.remove('canrob_notify', this)
    window.$socket.remove('selfPlayAHandNotify', this)
    window.$socket.remove('rootPlayAHandNotify', this)
    window.$socket.remove('gameEndNotify', this)
  },
  _chooseCardNotify(cardData) {
    this.choose_card_data.push(cardData)
  },
  _unchooseCardNotify(cardId) {
    for (let i = 0; i < this.choose_card_data.length; i++) {
      if (this.choose_card_data[i].index === cardId) {
        this.choose_card_data.splice(i, 1)
      }
    }
  },
  gameStateHandler(state) {
    // 开始游戏 - 已准备
    if (state === ddzConstants.gameState.GAMESTART) {
      // 关闭胜利或失败效果
      this.winNode.active = false
      this.loseNode.active = false
      // 清楚桌面上所有的牌
      this.cards_node = []
      this.bottom_card = []
      this.push_card_tmp = []
      this.cardsNode.removeAllChildren()
      this.bottom_card_pos_node.removeAllChildren()
    }
  },
  pushCardNotify(data) {
    this.card_data = data
    this.cur_index_card = data.length - 1
    this.pushCard(data)
    //左边移动定时器
    this.scheduleOnce(this._runactive_pushcard.bind(this), 0.3)
    this.node.parent.emit("pushcard_other_event")
  },
  //处理发牌的效果
  _runactive_pushcard() {
    if (this.cur_index_card < 0) {
      console.log("pushcard end")
      //发牌动画完成，显示抢地主按钮
      // this.fapai_end = true
      // if (this.rob_player_accountid === myglobal.playerData.userId) {
      //   this.robUI.active = true
      //   this.customSchedulerOnce()
      // }
      if (isopen_sound) {
        cc.audioEngine.stop(this.fapai_audioID)
      }
      //通知gamescene节点，倒计时
      // var sendevent = this.rob_player_accountid
      // this.node.parent.emit("canrob_event", sendevent)
      return
    }
    //原有逻辑  
    // var move_node = this.cards_node[this.cur_index_card]
    // move_node.active = true
    // var newx = move_node.x + (this.card_width * 0.4*this.cur_index_card) - (this.card_width * 0.4)
    // var action = cc.moveTo(0.1, cc.v2(newx, -250));
    // move_node.runAction(action)
    // this.cur_index_card--
    // this.scheduleOnce(this._runactive_pushcard.bind(this),0.3)

    var move_node = this.cards_node[this.cards_node.length - this.cur_index_card - 1]
    move_node.active = true
    this.push_card_tmp.push(move_node)
    this.fapai_audioID = common.audio.PlayEffect(this.fapaiAudio)
    for (var i = 0; i < this.push_card_tmp.length - 1; i++) {
      var move_node = this.push_card_tmp[i]
      var newx = move_node.x - (this.card_width * 0.4)
      var action = cc.moveTo(0.1, cc.v2(newx, -250));
      move_node.runAction(action)
    }

    this.cur_index_card--
    this.scheduleOnce(this._runactive_pushcard.bind(this), 0.3)
  },
  // 通知抢地主消息,显示相应的UI
  canrobNotify(data) {
    console.log("onCanRobState", data)
    //这里需要2个变量条件：自己是下一个抢地主，2发牌动画结束
    // this.rob_player_accountid = data
    if (data === myglobal.playerData.userId) {
      this.robUI.active = true
      this.customSchedulerOnce()
    }
  },
  //开启一个定时器
  customSchedulerOnce() {
    this.count = 10;
    const callback = function () {
      if (!this.robUI.active) return
      if (!this.count) {
        // 在第六次执行回调时取消这个计时器
        this.robUI.active = false
        this.unschedule(callback)
        window.$socket.emit('canrob_state_notify', {
          userId: myglobal.playerData.userId,
          state: qian_state.buqiang,
        })
        common.audio.PlayEffect(this.buqiangAudio)
      }
      this.timeLabel.string = --this.count
    }
    this.schedule(callback, 1, 10)
  },
  /**
   * @description 出牌
   */
  selfPlayAHandNotify(promptList) {
    console.log('玩家出牌提示', promptList)
    this.promptCount = 0
    this.promptList = promptList
    // 先清理出牌区域
    this.clearOutZone(myglobal.playerData.userId)
    // 显示可以出牌的UI
    this.playingUI_node.active = true
  },
  // 机器出牌
  rootPlayAHandNotify({ userId, cards }) {
    var gameScene_script = this.node.parent.getComponent("gameScene")
    //获取出牌区域节点
    var outCard_node = gameScene_script.getUserOutCardPosByAccount(userId)
    if (!outCard_node) return
    outCard_node.removeAllChildren(true);

    var node_cards = []
    for (var i = 0; i < cards.length; i++) {
      var card = cc.instantiate(this.card_prefab)
      card.getComponent("card").showCards(cards[i], userId)
      node_cards.push(card)
    }
    const delay = common.random(0, 10)
    const playerNode = gameScene_script.getUserNodeByAccount(userId)
    if (!playerNode) return
    playerNode.schedulerOnce(() => {
      this.appendOtherCardsToOutZone(outCard_node, node_cards, 0)
      playerNode.subtractCards(cards.length)
      // 通知服务，下一家出牌
      window.$socket.emit('nextPlayerNotify', userId)
    }, delay)
  },
  // 游戏结束
  gameEndNotify({ isWin, otherPlayerCards }) {
    console.log('游戏结束', { isWin, otherPlayerCards })
    if (isWin) {
      this.winNode.active = true
    } else {
      this.loseNode.active = true
    }
    ddzData.gameState = ddzConstants.gameState.WAITREADY
  },
  //对牌排序
  sortCard() {
    this.cards_node.sort(function (x, y) {
      var a = x.getComponent("card").card_data;
      var b = y.getComponent("card").card_data;

      if (a.hasOwnProperty('value') && b.hasOwnProperty('value')) {
        return b.value - a.value;
      }
      if (a.hasOwnProperty('king') && !b.hasOwnProperty('king')) {
        return -1;
      }
      if (!a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
        return 1;
      }
      if (a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
        return b.king - a.king;
      }
    })
    //这里使用固定坐标，因为取this.cards_node[0].xk可能排序为完成，导致x错误
    //所以做1000毫秒的延时
    var x = this.cards_node[0].x;
    var timeout = 1000
    setTimeout(function () {
      //var x = -417.6 
      console.log("sort x:" + x)
      for (let i = 0; i < this.cards_node.length; i++) {
        var card = this.cards_node[i];
        card.zIndex = i; //设置牌的叠加次序,zindex越大显示在上面
        card.x = x + card.width * 0.4 * i;
      }
    }.bind(this), timeout);
  },
  pushCard(data) {
    if (data) {
      data.sort(function (a, b) {
        if (a.hasOwnProperty('value') && b.hasOwnProperty('value')) {
          return b.value - a.value;
        }
        if (a.hasOwnProperty('king') && !b.hasOwnProperty('king')) {
          return -1;
        }
        if (!a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
          return 1;
        }
        if (a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
          return b.king - a.king;
        }
      });
    }
    //创建card预制体
    this.cards_node = []
    for (var i = 0; i < 17; i++) {

      var card = cc.instantiate(this.card_prefab)
      card.scale = 0.8
      // card.parent = this.node.parent
      card.parent = this.cardsNode
      card.x = card.width * 0.4 * (-0.5) * (-16) + card.width * 0.4 * 0;
      //这里实现为，每发一张牌，放在已经发的牌最后，然后整体移动
      card.y = -250
      card.active = false

      card.getComponent("card").showCards(data[i], myglobal.playerData.userId)
      //存储牌的信息,用于后面发牌效果
      this.cards_node.push(card)
      this.card_width = card.width
    }
    //创建3张底牌
    this.bottom_card = []
    for (var i = 0; i < 3; i++) {
      var di_card = cc.instantiate(this.card_prefab)
      di_card.scale = 0.4
      // di_card.position = this.bottom_card_pos_node.position
      //三张牌，中间坐标就是bottom_card_pos_node节点坐标，
      //0,和2两张牌左右移动windth*0.4
      if (i == 0) {
        di_card.x = di_card.x - di_card.width * 0.5
      } else if (i == 2) {
        di_card.x = di_card.x + di_card.width * 0.5
      }
      //di_card.x = di_card.width-i*di_card.width-20
      //di_card.y=60
      // di_card.parent = this.node.parent
      di_card.parent = this.bottom_card_pos_node
      //存储在容器里
      this.bottom_card.push(di_card)
    }
  },
  //给玩家发送三张底牌后，过1s,把牌设置到y=-250位置效果
  schedulePushThreeCard() {
    for (var i = 0; i < this.cards_node.length; i++) {
      var card = this.cards_node[i]
      if (card.y == -230) {
        card.y = -250
      }
    }
    this.updateCards()
  },
  //给地主发三张排，并显示在原有牌的后面
  pushThreeCard() {
    //每张牌的其实位置 
    var last_card_x = this.cards_node[this.cards_node.length - 1].x
    for (var i = 0; i < this.bottom_card_data.length; i++) {
      var card = cc.instantiate(this.card_prefab)
      card.scale = 0.8
      // card.parent = this.node.parent
      card.parent = this.cardsNode

      card.x = last_card_x + ((i + 1) * this.card_width * 0.4)
      card.y = -230  //先把底盘放在-230，在设置个定时器下移到-250的位置

      //console.log("pushThreeCard x:"+card.x)
      card.getComponent("card").showCards(this.bottom_card_data[i], myglobal.playerData.userId)
      card.active = true
      this.cards_node.push(card)
    }
    this.sortCard()
    //设置一个定时器，在2s后，修改y坐标为-250
    this.scheduleOnce(this.schedulePushThreeCard.bind(this), 2)
  },

  destoryCard(userId, choose_card) {
    if (!choose_card.length) return
    /*出牌逻辑
      1. 将选中的牌 从父节点中移除
      2. 从this.cards_node 数组中，删除 选中的牌 
      3. 将 “选中的牌” 添加到出牌区域
          3.1 清空出牌区域
          3.2 添加子节点
          3.3 设置scale
          3.4 设置position
      4.  重新设置手中的牌的位置  this.updateCards();
    */
    //1/2步骤删除自己手上的card节点 
    var destroy_card = []
    for (var i = 0; i < choose_card.length; i++) {
      for (var j = 0; j < this.cards_node.length; j++) {
        var caardIndex = this.cards_node[j].getComponent("card").caardIndex
        if (caardIndex == choose_card[i].index) {
          //this.cards_node[j].destroy()
          this.cards_node[j].removeFromParent(true);
          destroy_card.push(this.cards_node[j])
          this.cards_node.splice(j, 1)
        }
      }
    }
    this.appendCardsToOutZone(userId, destroy_card)
    this.updateCards()
  },

  //清除显示出牌节点全部子节点(就是把出牌的清空)
  clearOutZone(userId) {
    var gameScene_script = this.node.parent.getComponent("gameScene")
    var outCard_node = gameScene_script.getUserOutCardPosByAccount(userId)
    var children = outCard_node.children;
    for (var i = 0; i < children.length; i++) {
      var card = children[i];
      card.destroy()
    }
    outCard_node.removeAllChildren(true);
  },
  //对出的牌做排序
  pushCardSort(cards) {
    if (cards.length == 1) {
      return
    }
    cards.sort(function (x, y) {
      var a = x.getComponent("card").card_data;
      var b = y.getComponent("card").card_data;

      if (a.hasOwnProperty('value') && b.hasOwnProperty('value')) {
        return b.value - a.value;
      }
      if (a.hasOwnProperty('king') && !b.hasOwnProperty('king')) {
        return -1;
      }
      if (!a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
        return 1;
      }
      if (a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
        return b.king - a.king;
      }
    })
  },
  /**
   * @description 桌面添加新牌
   * @param {cc.Node} outCard_node 玩家出牌区域节点
   * @param {List} cards 牌型节点集合
   * @param {Number} yoffset 移动距离
   */
  appendOtherCardsToOutZone(outCard_node, cards, yoffset) {
    if (!cards.length) {
      const index = common.random(0, 3)
      common.audio.PlayEffect(this.buyaoAudio[index])
      return
    }
    common.audio.PlayEffect(this.chupaiAudio)
    //添加新的子节点
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      outCard_node.addChild(card, 100 + i) //第二个参数是 zorder,保证牌不能被遮住
    }
    //对出牌进行排序
    //设置出牌节点的坐标
    var zPoint = cards.length / 2;
    for (var i = 0; i < cards.length; i++) {
      var cardNode = outCard_node.getChildren()[i]
      var x = (i - zPoint) * 30;
      var y = cardNode.y + yoffset; //因为每个节点需要的Y不一样，做参数传入
      cardNode.setScale(0.5, 0.5);
      cardNode.setPosition(x, y);
    }
  },
  //将 “选中的牌” 添加到出牌区域
  //destroy_card是玩家本次出的牌
  appendCardsToOutZone(userId, destroy_card) {
    if (!destroy_card.length) return
    //先给本次出的牌做一个排序
    this.pushCardSort(destroy_card)
    var gameScene_script = this.node.parent.getComponent("gameScene")
    //获取出牌区域节点
    var outCard_node = gameScene_script.getUserOutCardPosByAccount(userId)
    this.appendOtherCardsToOutZone(outCard_node, destroy_card, 360)
    //sconsole.log("OutZone:"+outCard_node.name)
  },

  //重新排序手上的牌,并移动
  updateCards() {
    var zeroPoint = this.cards_node.length / 2;
    //var last_card_x = this.cards_node[this.cards_node.length-1].x
    for (var i = 0; i < this.cards_node.length; i++) {
      var cardNode = this.cards_node[i]
      var x = (i - zeroPoint) * (this.card_width * 0.4) + 50;
      cardNode.setPosition(x, -250);
    }
  },

  playPushCardSound(card_name) {
    console.log("playPushCardSound:" + card_name)
    if (card_name == "") return
    switch (card_name) {
      case CardsValue.one.name:
        break
      case CardsValue.double.name:
        if (isopen_sound) {
          cc.audioEngine.play(cc.url.raw("resources/sound/duizi.mp3"))
        }
        break
    }
  },
  // update (dt) {},
  onButtonClick(event, customData) {
    switch (customData) {
      case "btn_qiandz": // 不抢
        // myglobal.socket.requestRobState(qian_state.qiang)
        window.$socket.emit('canrob_state_notify', {
          userId: myglobal.playerData.userId,
          state: qian_state.qiang,
        })
        this.robUI.active = false
        common.audio.PlayEffect(this.jiaodizhuAudio)
        break
      case "btn_buqiandz": // 抢地主
        // myglobal.socket.requestRobState(qian_state.buqiang)
        window.$socket.emit('canrob_state_notify', {
          userId: myglobal.playerData.userId,
          state: qian_state.buqiang,
        })
        this.robUI.active = false
        common.audio.PlayEffect(this.buqiangAudio)
        break
      case "nopushcard":  // 不出牌
        // myglobal.socket.request_buchu_card([], null)
        window.$socket.emit('nextPlayerNotify', myglobal.playerData.userId)
        const index = common.random(0, 3)
        common.audio.PlayEffect(this.buyaoAudio[index])
        this.choose_card_data = []
        this.cards_node.map(node => node.emit("reset_card_flag"))
        this.playingUI_node.active = false
        break
      case "pushcard":   // 出牌
        //先获取本次出牌数据
        if (this.choose_card_data.length == 0) {
          this.tipsLabel.string = "请选择牌!"
          setTimeout(function () {
            this.tipsLabel.string = ""
          }.bind(this), 2000);
        }
        window.$socket.emit('playAHandNotify', {
          userId: myglobal.playerData.userId,
          cards: this.choose_card_data,
        }, ({state}) => {
          if (state === 1) {
            this.destoryCard(myglobal.playerData.userId, this.choose_card_data)
            this.playingUI_node.active = false
          } else {
            //出牌失败，把选择的牌归位
            this.cards_node.map(node => node.emit("reset_card_flag"))
            // for (let i = 0; i < this.cards_node.length; i++) {
            //   this.cards_node[i].emit("reset_card_flag")
            // }
          }
          this.choose_card_data = []
        })
        // myglobal.socket.request_chu_card(this.choose_card_data, function (err, data) {
        //   if (err) {
        //     console.log("request_chu_card:" + err)
        //     console.log("request_chu_card" + JSON.stringify(data))
        //     if (this.tipsLabel.string == "") {
        //       this.tipsLabel.string = data.msg
        //       setTimeout(function () {
        //         this.tipsLabel.string = ""
        //       }.bind(this), 2000);
        //     }
        //     //出牌失败，把选择的牌归位
        //     for (var i = 0; i < this.cards_node.length; i++) {
        //       var card = this.cards_node[i]
        //       card.emit("reset_card_flag")
        //     }
        //     this.choose_card_data = []
        //   } else {
        //     //出牌成功
        //     console.log("resp_chu_card data:" + JSON.stringify(data))
        //     this.playingUI_node.active = false
        //     //播放出牌的声音
        //     //resp_chu_card data:{"account":"2519901","msg":"sucess","cardvalue":{"name":"Double","value":1}}
        //     //{"type":"other_chucard_notify","result":0,"data":{"userId":"2519901","cards":[{"index":24,"card_data":{"index":24,"value":6,"shape":1}},{"index":26,"card_data":{"index":26,"value":6,"shape":3}}]},"callBackIndex":0}
        //     this.playPushCardSound(data.cardvalue.name)
        //     this.destoryCard(data.account, this.choose_card_data)
        //     this.choose_card_data = []
        //   }
        // }.bind(this))
        break
      case "tipcard": // 提示
        // 已选牌归位
        this.choose_card_data = []
        this.cards_node.map(node => node.emit("reset_card_flag"))
        // 根据提示牌型显示
        if (this.promptList.length) {
          const index = this.promptCount % this.promptList.length
          const promptCards = this.promptList[index]
          const cardsNode = this.cards_node
          for (let i = 0; i < promptCards.length; i++) {
            const card = promptCards[i];
            for (let j = 0; j < cardsNode.length; j++) {
              const cardJs = cardsNode[j].getComponent("card");
              const cardData = cardJs.card_data
              if (cardData.val === card.val && cardData.shape === card.shape) {
                cardJs.node.emit(cc.Node.EventType.TOUCH_START)
              }
            }
          }
        }
        this.promptCount++
        break
      default:
        break
    }
  }
});
