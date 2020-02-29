import myglobal from "../mygolbal.js"
cc.Class({
  extends: cc.Component,

  properties: {
    wait_node: cc.Node
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    cc.director.preloadScene("hallScene")
  },

  start() {},
  onButtonCilck(event, customData) {
    switch (customData) {
      case "wx_login":
        console.log("wx_login request")

        //this.wait_node.active = true

        myglobal.socket.request_wxLogin({
          uniqueID: myglobal.playerData.uniqueID,
          // userId: myglobal.playerData.userId,
          userName: myglobal.playerData.userName,
          avatarUrl: myglobal.playerData.avatarUrl,
        }, function (err, result) {
          //请求返回
          //先隐藏等待UI
          //this.wait_node.active = false
          if (err != 0) {
            console.log("err:" + err)
            return
          }

          console.log("login sucess" + JSON.stringify(result))
          myglobal.playerData.gobal_count = result.goldcount
          cc.director.loadScene("hallScene")
        }.bind(this))
        break
      case 'guest_login':
        this.wait_node.active = true
        const count = Math.floor(Math.random() * 100000)
        const userName = `guest_${count}`
        myglobal.playerData.userId = `${count}`
        myglobal.playerData.userName = userName
        cc.sys.localStorage.setItem('userData', JSON.stringify(myglobal.playerData))
        cc.director.loadScene("hallScene")
      default:
        break
    }
  }
  // update (dt) {},


});
