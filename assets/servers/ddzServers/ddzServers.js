const mygolbal = require('mygolbal')
const ddzConstants = require('ddzConstants')
const ddzData = require('ddzData')
const Carder = require("carder")

const ddzServers = {
  carder: Carder(), // 发牌对象
  _player_list: [], // 用户列表
  three_cards: [], // 扑克牌列表 [玩家, 机器1, 机器2, 底牌]
  robplayer: [], // 复制一份房间内player,做抢地主操作
  initServer() {
    if (!CC_EDITOR) {
      ddzData.gameStateNotify.addListener(this.gameStateHandler, this)
    }
  },
  gameStateHandler(value) {
    const states = ddzConstants.gameState
    switch (value) {
      case states.INVALID: // 无效
        break
      case states.WAITREADY: // 等待游戏
        break
      case states.GAMESTART: // 开始游戏
        setTimeout(() => {
          ddzData.gameState = states.PUSHCARD
        }, 0)
        break
      case states.PUSHCARD: // 发牌
        this.three_cards = this.carder.splitThreeCards()
        console.log(this.three_cards)
        window.$socket.emit('pushcard_notify', this.three_cards[0])
        setTimeout(() => {
          ddzData.gameState = states.ROBSTATE
        }, 0)
        break
      case states.ROBSTATE: // 抢地主
        break
      case states.SHOWBOTTOMCARD: // 显示底牌
        break
      case states.PLAYING: // 出牌阶段  
        break
    }
  }
}
export default ddzServers
