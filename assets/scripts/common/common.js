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
  }

}

module.exports = common
