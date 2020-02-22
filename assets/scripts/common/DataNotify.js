/**
 * Date: 2018/8/15
 * Author: 
 * Desc: 数据监听器
 * 
 * module use example:
 *      创建数据监听:
 *          this.testNotify = DataNotify.create(this, 'test' , 1) 
 *      添加监听:
 *          this.testNotify.addListener(this.callback, this)
 *      移除监听:
 *          this.testNotify.removeListener(this.callback , this)
 *      修改监听数据:
 *          this.test= this.test+1 (数据修改会立即通知所有的监听者)
 */

var DataNotify = cc.Class({

  ctor() {
    var data = arguments[0];
    this._listeners = [];
    this.setData(data);
  },

  /**
   * 添加数据监听者
   *
   * @method addListener
   * @param {Function} callback
   * @param {Object} target
   */
  addListener(callback, target) {
    cc.assert(callback)
    var listener = {
      callback: callback,
      target: target,
    }
    for (const listener of this._listeners) {
      if (target === listener.target) {
        return
      }
    }
    this._listeners.push(listener);
  },

  /**
  * 移除数据监听者
  *
  * @method addListener
  * @param {Function} callback
  * @param {Object} target
  */
  removeListener(callback, target) {
    for (const listener of this._listeners) {
      if (target === listener.target) {
        cc.js.array.remove(this._listeners, listener);
        break
      }
    }
  },

  getData() {
    return this._data;
  },

  setData(data) {
    this._oldData = this._data;
    this._data = data;
    this._tryBindArrayFunction()
    this.update();
  },

  _tryBindArrayFunction() {
    if (this._data instanceof Array) {
      let self = this
      var arrProto = Object.create(Array.prototype);
      ['shift', 'unshift', 'push', 'pop', 'splice'].forEach(function (method) {
        Object.defineProperty(arrProto, method, {
          value: function () {
            var result = Array.prototype[method].apply(this, arguments);
            self.update()
            return result;
          }
        })
      })
      this._data.__proto__ = arrProto
    }
  },

  update() {
    this._listeners.forEach(element => {
      element.callback.call(element.target, this._data, this._oldData);
    });
  },

  statics: {
    /**
     * 创建数据监听器(静态方法)
     *
     * @method create
     * @param {Object} module
     * @param {String} dataName
     * @param {any} defaultData
     */
    create(module, dataName, defaultData) {
      let dataNotify = new DataNotify(defaultData);
      Object.defineProperty(module, dataName, {
        get: function () { return dataNotify.getData() },
        set: function (data) { return dataNotify.setData(data) }
      })
      return dataNotify;
    },

    factory: function (host, name, def) {
      host[name] = undefined;
      host[name + 'Notify'] = this.create(host, name, def);
    },
  },
});

module.exports = DataNotify;