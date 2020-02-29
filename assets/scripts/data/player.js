const getRandomStr = function (count) {
  var str = '';
  for (var i = 0; i < count; i++) {
    str += Math.floor(Math.random() * 10);
  }
  return str;
};

const playerData = function () {
  const userData = JSON.parse(cc.sys.localStorage.getItem('userData'))
  const [rootId1, rootId2] = [getRandomStr(5), getRandomStr(5)]
  var that = userData || {
    userId: '', // 用户id
    userName: '', // 用户名称，guest_ 开头
    roomId: '',// 游戏房间id
    seatindex: 0, // 作为id
    avatarUrl: 'avatar_1', // 头像
    goldcount: 10000, // 金额
    rootList: [
      { seatindex: 1, userId: rootId1, userName: `guest_${rootId1}`, "avatarUrl": "avatar_2", "goldcount": getRandomStr(4) },
      { seatindex: 2, userId: rootId2, userName: `guest_${rootId2}`, "avatarUrl": "avatar_3", "goldcount": getRandomStr(4) }
    ],
    masterUserId: '', // 地主id
  }
  // that.uniqueID = 1 + getRandomStr(6)
  that.gobal_count = cc.sys.localStorage.getItem('user_count')
  // that.master_accountid = 0
  if (!userData) {
    console.log(userData)
    cc.sys.localStorage.setItem('userData', JSON.stringify(that))
  }
  return that;
}
export default playerData
