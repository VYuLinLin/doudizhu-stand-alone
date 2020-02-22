/**
 * Date: 2020/2/21
 * Author: 
 * Desc:斗地主 数据层
 */
const ddzConstants = require('ddzConstants')
const DataNotify = require('DataNotify')

module.exports = {
  /**
   * @description 当前游戏状态
   */
  gameState: -1,

  initData() {
    this.gameStateNotify = DataNotify.create(this, 'gameState', JSON.parse(cc.sys.localStorage.getItem('gameState')))
    this.gameStateNotify.addListener(value => {
      cc.sys.localStorage.setItem('gameState', value)
    })
  }
}