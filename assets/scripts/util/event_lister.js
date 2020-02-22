const eventLister = function (obj) {
  var register = {}

  obj.on = function (type, callback, target) {
    const listener = {
      callback,
      target
    }
    if (register.hasOwnProperty(type)) {
      cc.assert(callback)
      for (const listener of register[type]) {
        if (target === listener.target) {
          return
        }
      }
      register[type].push(listener);
    } else {
      register[type] = [listener]
    }
  }
  obj.emit = function(type) {
    if (register.hasOwnProperty(type)) {
      const methodList = register[type]
      for (var i = 0; i < methodList.length; ++i) {
        const {callback, target} = methodList[i]
        const args = []
        for (let i = 1; i < arguments.length; ++i) {
          args.push(arguments[i])
        }
        callback.apply(target, args)
      }
    }
    
  }
  obj.remove = function (type, target) {
    register[type] = register[type].filter(e => e.target !== target)
  }
  obj.removeLister = function (type) {
    register[type] = []
  }

  obj.removeAllLister = function () {
    register = {}
  }

  return obj
}

export default eventLister