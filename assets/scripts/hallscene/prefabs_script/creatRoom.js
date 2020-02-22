import myglobal from "../../mygolbal.js"
cc.Class({
  extends: cc.Component,

  properties: {

  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start() {
  },

  // update (dt) {},
  onBtnClose() {
    this.node.destroy()
  },
  // 进入游戏房间
  onButtonClick(event, value) {
    const { bottom, rate } = defines.jdRoomConfig['rate_' + value]
    const roomId = `${rate}_${bottom}_${Math.floor(Math.random() * 1000)}`
    myglobal.playerData.bottom = bottom
    myglobal.playerData.rate = rate
    myglobal.playerData.roomId = roomId
    cc.sys.localStorage.setItem('userData', JSON.stringify(myglobal.playerData))
    cc.director.loadScene("gameScene")
    this.node.destroy()
  }

});
