import myglobal from "../mygolbal.js"

var LoadingLayer = cc.Class({
  extends: cc.Component,
  properties: {},
  __preload() {
    this.init()
  },
  start() {
  },
  init() {
    // 调整画布前的回调
    cc.view.resizeWithBrowserSize(true);
    cc.view.setResizeCallback(this.resizeCallback)
    cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this.resizeCallback);
    cc.game.addPersistRootNode(this.node);
    // 场景跳转
    const { userId, roomId } = myglobal.playerData
    console.log('userId = ', userId)
    console.log('roomId = ', roomId)
    if (!userId) {
      cc.director.loadScene('loginScene')
    } else if (!roomId) {
      cc.director.loadScene('hallScene')
    } else {
      cc.director.loadScene('gameScene')
    }
  },
  resizeCallback() {
    var canvas = cc.find("Canvas").getComponent(cc.Canvas)
    var t = cc.winSize.width / canvas.designResolution.width
    var n = cc.winSize.height / canvas.designResolution.height;
    t < n
      ? (canvas.fitWidth = !0, canvas.fitHeight = !1) : n < t
        ? (canvas.fitWidth = !1, canvas.fitHeight = !0) : (canvas.fitWidth = !1, canvas.fitHeight = !1)
  }
});