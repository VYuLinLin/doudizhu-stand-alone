const audioManager = require('audioManager');

const common = {
  // 声音管理
  audio: audioManager,
  // 获取指定位数的随机数
  getRandomStr(count) {
    var str = '';
    for (var i = 0; i < count; i++) {
      str += Math.floor(Math.random() * 10);
    }
    return str;
  },
  /**
    * 产生随机整数，包含上下限值
    * @param {Number} lower 下限
    * @param {Number} upper 上限
    * @return {Number} 返回在下限到上限之间的一个随机整数
    */
  random(lower, upper) {
    return Math.round(Math.random() * (upper-lower) + lower)
  }
}

module.exports = common
