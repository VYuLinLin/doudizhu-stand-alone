
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/util/waitnode.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '17318Pv1MxELb6d+o/SHo0s', 'waitnode');
// scripts/util/waitnode.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    loadimage_target: cc.Node,
    _isShow: false,
    lblContent: cc.Label
  },
  // LIFE-CYCLE CALLBACKS:
  // onLoad () {},
  start: function start() {
    this.node.active = this._isShow;
  },
  update: function update(dt) {
    this.loadimage_target.rotation = this.loadimage_target.rotation - dt * 45;
  },
  //content为label显示的内容
  show: function show(content) {
    this._isShow = true;

    if (this.node) {
      this.node.active = this._isShow;
    }

    if (this.lblContent) {
      if (content == null) {
        content = "";
      }

      this.lblContent.string = content;
    }
  },
  hide: function hide() {
    this._isShow = false;

    if (this.node) {
      this.node.active = this._isShow;
    }
  }
});

cc._RF.pop();
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFx1dGlsLy4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFx1dGlsL2Fzc2V0c1xcc2NyaXB0c1xcdXRpbFxcd2FpdG5vZGUuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJsb2FkaW1hZ2VfdGFyZ2V0IiwiTm9kZSIsIl9pc1Nob3ciLCJsYmxDb250ZW50IiwiTGFiZWwiLCJzdGFydCIsIm5vZGUiLCJhY3RpdmUiLCJ1cGRhdGUiLCJkdCIsInJvdGF0aW9uIiwic2hvdyIsImNvbnRlbnQiLCJzdHJpbmciLCJoaWRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUNBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFDUkMsSUFBQUEsZ0JBQWdCLEVBQUNKLEVBQUUsQ0FBQ0ssSUFEWjtBQUVSQyxJQUFBQSxPQUFPLEVBQUMsS0FGQTtBQUdSQyxJQUFBQSxVQUFVLEVBQUNQLEVBQUUsQ0FBQ1E7QUFITixHQUhQO0FBU0w7QUFFQTtBQUVBQyxFQUFBQSxLQWJLLG1CQWFJO0FBQ0wsU0FBS0MsSUFBTCxDQUFVQyxNQUFWLEdBQW1CLEtBQUtMLE9BQXhCO0FBQ0gsR0FmSTtBQWlCTE0sRUFBQUEsTUFqQkssa0JBaUJHQyxFQWpCSCxFQWlCTztBQUNSLFNBQUtULGdCQUFMLENBQXNCVSxRQUF0QixHQUFpQyxLQUFLVixnQkFBTCxDQUFzQlUsUUFBdEIsR0FBaUNELEVBQUUsR0FBQyxFQUFyRTtBQUNILEdBbkJJO0FBcUJMO0FBQ0FFLEVBQUFBLElBdEJLLGdCQXNCQUMsT0F0QkEsRUFzQlE7QUFDVCxTQUFLVixPQUFMLEdBQWUsSUFBZjs7QUFDQSxRQUFHLEtBQUtJLElBQVIsRUFBYTtBQUNULFdBQUtBLElBQUwsQ0FBVUMsTUFBVixHQUFtQixLQUFLTCxPQUF4QjtBQUNIOztBQUNELFFBQUcsS0FBS0MsVUFBUixFQUFtQjtBQUNmLFVBQUdTLE9BQU8sSUFBSSxJQUFkLEVBQW1CO0FBQ2ZBLFFBQUFBLE9BQU8sR0FBRyxFQUFWO0FBQ0g7O0FBQ0QsV0FBS1QsVUFBTCxDQUFnQlUsTUFBaEIsR0FBeUJELE9BQXpCO0FBQ0g7QUFDSixHQWpDSTtBQW1DTEUsRUFBQUEsSUFuQ0ssa0JBbUNDO0FBQ0YsU0FBS1osT0FBTCxHQUFlLEtBQWY7O0FBQ0EsUUFBRyxLQUFLSSxJQUFSLEVBQWE7QUFDVCxXQUFLQSxJQUFMLENBQVVDLE1BQVYsR0FBbUIsS0FBS0wsT0FBeEI7QUFDSDtBQUNKO0FBeENJLENBQVQiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHNjcmlwdHNcXHV0aWwiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBsb2FkaW1hZ2VfdGFyZ2V0OmNjLk5vZGUsXHJcbiAgICAgICAgX2lzU2hvdzpmYWxzZSxcclxuICAgICAgICBsYmxDb250ZW50OmNjLkxhYmVsLFxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBMSUZFLUNZQ0xFIENBTExCQUNLUzpcclxuXHJcbiAgICAvLyBvbkxvYWQgKCkge30sXHJcblxyXG4gICAgc3RhcnQgKCkge1xyXG4gICAgICAgIHRoaXMubm9kZS5hY3RpdmUgPSB0aGlzLl9pc1Nob3c7XHJcbiAgICB9LFxyXG5cclxuICAgIHVwZGF0ZSAoZHQpIHtcclxuICAgICAgICB0aGlzLmxvYWRpbWFnZV90YXJnZXQucm90YXRpb24gPSB0aGlzLmxvYWRpbWFnZV90YXJnZXQucm90YXRpb24gLSBkdCo0NTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9jb250ZW505Li6bGFiZWzmmL7npLrnmoTlhoXlrrlcclxuICAgIHNob3coY29udGVudCl7XHJcbiAgICAgICAgdGhpcy5faXNTaG93ID0gdHJ1ZTtcclxuICAgICAgICBpZih0aGlzLm5vZGUpe1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUuYWN0aXZlID0gdGhpcy5faXNTaG93OyAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmxibENvbnRlbnQpe1xyXG4gICAgICAgICAgICBpZihjb250ZW50ID09IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgY29udGVudCA9IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5sYmxDb250ZW50LnN0cmluZyA9IGNvbnRlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBoaWRlKCl7XHJcbiAgICAgICAgdGhpcy5faXNTaG93ID0gZmFsc2U7XHJcbiAgICAgICAgaWYodGhpcy5ub2RlKXtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLmFjdGl2ZSA9IHRoaXMuX2lzU2hvdzsgICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KTtcclxuIl19