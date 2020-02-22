const getRandomStr = function (count) {
  var str = '';
  for (var i = 0; i < count; i++) {
    str += Math.floor(Math.random() * 10);
  }
  return str;
};

const playerData = function () {
  const userData = JSON.parse(cc.sys.localStorage.getItem('userData'))

  var that = userData || {
    userId: '', // 用户id
    userName: '', // 用户名称，guest_ 开头
    roomId: '',// 游戏房间id
    rootList: [
      { seatindex: 1, "accountid": "2117836", userName: `guest_${getRandomStr(5)}`, "avatarUrl": "avatar_2", "goldcount": getRandomStr(4) },
      { seatindex: 2, "accountid": "2117837", userName: `guest_${getRandomStr(5)}`, "avatarUrl": "avatar_3", "goldcount": getRandomStr(4) }
    ]
  }
  // that.uniqueID = 1 + getRandomStr(6)
  that.gobal_count = cc.sys.localStorage.getItem('user_count')
  that.master_accountid = 0
  if (!userData) {
    console.log(userData)
    cc.sys.localStorage.setItem('userData', JSON.stringify(that))
  }
  return that;
}
export default playerData
