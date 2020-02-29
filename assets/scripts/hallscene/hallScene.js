import myglobal from "../mygolbal.js"

cc.Class({
  extends: cc.Component,

  properties: {
    nickname_label: cc.Label,
    headimage: cc.Sprite,
    gobal_count: cc.Label,
    creatroom_prefabs: cc.Prefab,
    joinroom_prefabs: cc.Prefab,
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.nickname_label.string = myglobal.playerData.userName
    cc.director.preloadScene("gameScene")
  },

  start() {

  },

  // update (dt) {},

  onButtonClick(event, customData) {
    switch (customData) {
      case "create_room":
        var creator_Room = cc.instantiate(this.creatroom_prefabs)
        creator_Room.parent = this.node
        creator_Room.zIndex = 100
        break
      case "join_room":
        var join_Room = cc.instantiate(this.joinroom_prefabs)
        join_Room.parent = this.node
        join_Room.zIndex = 100
        break
      default:
        break
    }
  },
  onBtnJingdian() {
    const creator_Room = cc.instantiate(this.creatroom_prefabs)
    creator_Room.parent = this.node
    creator_Room.zIndex = 100
  },
  onBtnLaizi() {
    alert('暂未开放')
  }
});
