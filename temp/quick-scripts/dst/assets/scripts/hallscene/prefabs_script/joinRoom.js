
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/hallscene/prefabs_script/joinRoom.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '9b543i+qr1Px4nfSdBwSJcb', 'joinRoom');
// scripts/hallscene/prefabs_script/joinRoom.js

"use strict";

var _mygolbal = _interopRequireDefault(require("../../mygolbal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

cc.Class({
  "extends": cc.Component,
  properties: {
    joinids: {
      type: cc.Label,
      "default": []
    }
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    this.joinid = "";
    this.cur_input_count = -1;
  },
  start: function start() {},
  //  update (dt) {
  //  },
  onButtonClick: function onButtonClick(event, customData) {
    if (customData.length === 1) {
      this.joinid += customData;
      this.cur_input_count += 1;
      this.joinids[this.cur_input_count].string = customData; //console.log("joinid.length:"+this.joinid.length)

      if (this.joinid.length >= 6) {
        //判断加入房间逻辑
        var room_para = {
          roomId: this.joinid
        };

        _mygolbal["default"].socket.request_jion(room_para, function (err, result) {
          if (err) {
            console.log("err" + err);
          } else {
            console.log("join room sucess" + JSON.stringify(result));
            _mygolbal["default"].playerData.bottom = result.bottom;
            _mygolbal["default"].playerData.rate = result.rate;
            cc.director.loadScene("gameScene");
          }
        });

        return;
      }

      console.log("customData:" + customData);
    }

    switch (customData) {
      case "back":
        if (this.cur_input_count < 0) {
          return;
        }

        this.joinids[this.cur_input_count].string = "";
        this.cur_input_count -= 1;
        this.joinid = this.joinid.substring(0, this.joinid.length - 1);
        break;

      case "clear":
        for (var i = 0; i < 6; ++i) {
          this.joinids[i].string = "";
        }

        this.joinid = "";
        this.cur_input_count = -1;
        break;

      case "close":
        this.node.destroy();
        break;

      default:
        break;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXGFzc2V0c1xcc2NyaXB0c1xcaGFsbHNjZW5lXFxwcmVmYWJzX3NjcmlwdC8uLlxcLi5cXC4uXFwuLlxcLi5cXC4uXFxhc3NldHNcXHNjcmlwdHNcXGhhbGxzY2VuZVxccHJlZmFic19zY3JpcHQvYXNzZXRzXFxzY3JpcHRzXFxoYWxsc2NlbmVcXHByZWZhYnNfc2NyaXB0XFxqb2luUm9vbS5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsImpvaW5pZHMiLCJ0eXBlIiwiTGFiZWwiLCJvbkxvYWQiLCJqb2luaWQiLCJjdXJfaW5wdXRfY291bnQiLCJzdGFydCIsIm9uQnV0dG9uQ2xpY2siLCJldmVudCIsImN1c3RvbURhdGEiLCJsZW5ndGgiLCJzdHJpbmciLCJyb29tX3BhcmEiLCJyb29tSWQiLCJteWdsb2JhbCIsInNvY2tldCIsInJlcXVlc3RfamlvbiIsImVyciIsInJlc3VsdCIsImNvbnNvbGUiLCJsb2ciLCJKU09OIiwic3RyaW5naWZ5IiwicGxheWVyRGF0YSIsImJvdHRvbSIsInJhdGUiLCJkaXJlY3RvciIsImxvYWRTY2VuZSIsInN1YnN0cmluZyIsImkiLCJub2RlIiwiZGVzdHJveSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUVBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFDVkMsSUFBQUEsT0FBTyxFQUFDO0FBQ0pDLE1BQUFBLElBQUksRUFBRUwsRUFBRSxDQUFDTSxLQURMO0FBRUosaUJBQVE7QUFGSjtBQURFLEdBSFA7QUFXTDtBQUVBQyxFQUFBQSxNQWJLLG9CQWFLO0FBQ04sU0FBS0MsTUFBTCxHQUFjLEVBQWQ7QUFDQSxTQUFLQyxlQUFMLEdBQXVCLENBQUMsQ0FBeEI7QUFDSCxHQWhCSTtBQWtCTEMsRUFBQUEsS0FsQkssbUJBa0JJLENBRVIsQ0FwQkk7QUFzQkw7QUFFQTtBQUVBQyxFQUFBQSxhQTFCSyx5QkEwQlNDLEtBMUJULEVBMEJlQyxVQTFCZixFQTBCMEI7QUFDM0IsUUFBR0EsVUFBVSxDQUFDQyxNQUFYLEtBQW9CLENBQXZCLEVBQXlCO0FBQ3JCLFdBQUtOLE1BQUwsSUFBZUssVUFBZjtBQUNBLFdBQUtKLGVBQUwsSUFBd0IsQ0FBeEI7QUFDQSxXQUFLTCxPQUFMLENBQWEsS0FBS0ssZUFBbEIsRUFBbUNNLE1BQW5DLEdBQTRDRixVQUE1QyxDQUhxQixDQUlyQjs7QUFDQSxVQUFHLEtBQUtMLE1BQUwsQ0FBWU0sTUFBWixJQUFvQixDQUF2QixFQUF5QjtBQUNyQjtBQUNBLFlBQUlFLFNBQVMsR0FBRztBQUNaQyxVQUFBQSxNQUFNLEVBQUMsS0FBS1Q7QUFEQSxTQUFoQjs7QUFHQVUsNkJBQVNDLE1BQVQsQ0FBZ0JDLFlBQWhCLENBQTZCSixTQUE3QixFQUF1QyxVQUFTSyxHQUFULEVBQWFDLE1BQWIsRUFBb0I7QUFDdkQsY0FBSUQsR0FBSixFQUFRO0FBQ0pFLFlBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLFFBQU9ILEdBQW5CO0FBQ0gsV0FGRCxNQUVLO0FBQ0RFLFlBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLHFCQUFtQkMsSUFBSSxDQUFDQyxTQUFMLENBQWVKLE1BQWYsQ0FBL0I7QUFDQUosaUNBQVNTLFVBQVQsQ0FBb0JDLE1BQXBCLEdBQTZCTixNQUFNLENBQUNNLE1BQXBDO0FBQ0FWLGlDQUFTUyxVQUFULENBQW9CRSxJQUFwQixHQUEyQlAsTUFBTSxDQUFDTyxJQUFsQztBQUNBN0IsWUFBQUEsRUFBRSxDQUFDOEIsUUFBSCxDQUFZQyxTQUFaLENBQXNCLFdBQXRCO0FBQ0g7QUFDSixTQVREOztBQVVBO0FBQ0g7O0FBRURSLE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGdCQUFlWCxVQUEzQjtBQUVIOztBQUNELFlBQU9BLFVBQVA7QUFDSSxXQUFLLE1BQUw7QUFDSSxZQUFHLEtBQUtKLGVBQUwsR0FBcUIsQ0FBeEIsRUFBMEI7QUFDdEI7QUFDSDs7QUFDRCxhQUFLTCxPQUFMLENBQWEsS0FBS0ssZUFBbEIsRUFBbUNNLE1BQW5DLEdBQTRDLEVBQTVDO0FBQ0EsYUFBS04sZUFBTCxJQUF1QixDQUF2QjtBQUNBLGFBQUtELE1BQUwsR0FBYyxLQUFLQSxNQUFMLENBQVl3QixTQUFaLENBQXNCLENBQXRCLEVBQXdCLEtBQUt4QixNQUFMLENBQVlNLE1BQVosR0FBbUIsQ0FBM0MsQ0FBZDtBQUNBOztBQUNKLFdBQUssT0FBTDtBQUNJLGFBQUksSUFBSW1CLENBQUMsR0FBQyxDQUFWLEVBQVlBLENBQUMsR0FBQyxDQUFkLEVBQWdCLEVBQUVBLENBQWxCLEVBQW9CO0FBQ2hCLGVBQUs3QixPQUFMLENBQWE2QixDQUFiLEVBQWdCbEIsTUFBaEIsR0FBeUIsRUFBekI7QUFFSDs7QUFDRCxhQUFLUCxNQUFMLEdBQWMsRUFBZDtBQUNBLGFBQUtDLGVBQUwsR0FBdUIsQ0FBQyxDQUF4QjtBQUNBOztBQUNKLFdBQUssT0FBTDtBQUNHLGFBQUt5QixJQUFMLENBQVVDLE9BQVY7QUFDQTs7QUFDSDtBQUNJO0FBckJSO0FBdUJIO0FBNUVJLENBQVQiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLlxcLi5cXC4uXFwuLlxcYXNzZXRzXFxzY3JpcHRzXFxoYWxsc2NlbmVcXHByZWZhYnNfc2NyaXB0Iiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG15Z2xvYmFsIGZyb20gXCIuLi8uLi9teWdvbGJhbC5qc1wiXHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcbiAgICBcclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgam9pbmlkczp7XHJcbiAgICAgICAgICB0eXBlOiBjYy5MYWJlbCxcclxuICAgICAgICAgIGRlZmF1bHQ6W10sXHJcbiAgICAgIH1cclxuICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBMSUZFLUNZQ0xFIENBTExCQUNLUzpcclxuXHJcbiAgICBvbkxvYWQgKCkge1xyXG4gICAgICAgIHRoaXMuam9pbmlkID0gXCJcIjtcclxuICAgICAgICB0aGlzLmN1cl9pbnB1dF9jb3VudCA9IC0xXHJcbiAgICB9LFxyXG5cclxuICAgIHN0YXJ0ICgpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8vICB1cGRhdGUgKGR0KSB7XHJcbiAgICAgICAgXHJcbiAgICAvLyAgfSxcclxuXHJcbiAgICBvbkJ1dHRvbkNsaWNrKGV2ZW50LGN1c3RvbURhdGEpe1xyXG4gICAgICAgIGlmKGN1c3RvbURhdGEubGVuZ3RoPT09MSl7XHJcbiAgICAgICAgICAgIHRoaXMuam9pbmlkICs9IGN1c3RvbURhdGFcclxuICAgICAgICAgICAgdGhpcy5jdXJfaW5wdXRfY291bnQgKz0gMVxyXG4gICAgICAgICAgICB0aGlzLmpvaW5pZHNbdGhpcy5jdXJfaW5wdXRfY291bnRdLnN0cmluZyA9IGN1c3RvbURhdGFcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImpvaW5pZC5sZW5ndGg6XCIrdGhpcy5qb2luaWQubGVuZ3RoKVxyXG4gICAgICAgICAgICBpZih0aGlzLmpvaW5pZC5sZW5ndGg+PTYpe1xyXG4gICAgICAgICAgICAgICAgLy/liKTmlq3liqDlhaXmiL/pl7TpgLvovpFcclxuICAgICAgICAgICAgICAgIHZhciByb29tX3BhcmEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcm9vbUlkOnRoaXMuam9pbmlkLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbXlnbG9iYWwuc29ja2V0LnJlcXVlc3Rfamlvbihyb29tX3BhcmEsZnVuY3Rpb24oZXJyLHJlc3VsdCl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyXCIrIGVycilcclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJqb2luIHJvb20gc3VjZXNzXCIrSlNPTi5zdHJpbmdpZnkocmVzdWx0KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgbXlnbG9iYWwucGxheWVyRGF0YS5ib3R0b20gPSByZXN1bHQuYm90dG9tXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG15Z2xvYmFsLnBsYXllckRhdGEucmF0ZSA9IHJlc3VsdC5yYXRlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcImdhbWVTY2VuZVwiKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjdXN0b21EYXRhOlwiKyBjdXN0b21EYXRhKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgc3dpdGNoKGN1c3RvbURhdGEpe1xyXG4gICAgICAgICAgICBjYXNlIFwiYmFja1wiOlxyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5jdXJfaW5wdXRfY291bnQ8MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmpvaW5pZHNbdGhpcy5jdXJfaW5wdXRfY291bnRdLnN0cmluZyA9IFwiXCJcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VyX2lucHV0X2NvdW50IC09MVxyXG4gICAgICAgICAgICAgICAgdGhpcy5qb2luaWQgPSB0aGlzLmpvaW5pZC5zdWJzdHJpbmcoMCx0aGlzLmpvaW5pZC5sZW5ndGgtMSlcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgXCJjbGVhclwiOlxyXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7aTw2OysraSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5qb2luaWRzW2ldLnN0cmluZyA9IFwiXCJcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuam9pbmlkID0gXCJcIlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJfaW5wdXRfY291bnQgPSAtMVxyXG4gICAgICAgICAgICAgICAgYnJlYWsgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNhc2UgXCJjbG9zZVwiOlxyXG4gICAgICAgICAgICAgICB0aGlzLm5vZGUuZGVzdHJveSgpXHJcbiAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcbiJdfQ==