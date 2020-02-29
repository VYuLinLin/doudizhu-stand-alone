window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  AILogic: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6b09dnMfKxGlZe6hVd/T7bf", "AILogic");
    "use strict";
    var AILogic = function AILogic(p) {
      this.player = p;
      this.cards = p.cardList.slice(0);
      this.analyse();
    };
    var AICardType = function AICardType(val, cardList) {
      return {
        val: val,
        cardList: cardList
      };
    };
    AILogic.prototype.follow = function(winc, isWinnerIsLandlord, winnerCardCount) {
      var self = this;
      self.log();
      var result = function() {
        switch (winc.cardKind) {
         case G.gameRule.ONE:
          var one = self.matchCards(self._one, G.gameRule.ONE, winc, isWinnerIsLandlord, winnerCardCount);
          if (!one) {
            if (isWinnerIsLandlord || self.player.isLandlord) for (var i = 0; i < self.cards.length; i++) if (self.cards[i].val <= 15 && self.cards[i].val > winc.val) return {
              cardList: self.cards.slice(i, i + 1),
              cardKind: G.gameRule.ONE,
              size: 1,
              val: self.cards[i].val
            };
            if (self.times <= 1 && self._pairs.length > 0 && self._pairs[0].val > 10) {
              var c = self.cards.slice(0, 1);
              return c[0].val > winc.val ? {
                cardList: c,
                cardKind: G.gameRule.ONE,
                size: 1,
                val: c[0].val
              } : null;
            }
          }
          return one;

         case G.gameRule.PAIRS:
          var pairs = self._pairs.length > 0 ? self.matchCards(self._pairs, G.gameRule.PAIRS, winc, isWinnerIsLandlord, winnerCardCount) : null;
          if (null == pairs && (isWinnerIsLandlord || self.player.isLandlord)) if (self._progressionPairs.length > 0) for (var i = self._progressionPairs.length - 1; i >= 0; i--) {
            if (winc.val >= self._progressionPairs[i].val) continue;
            for (var j = self._progressionPairs[i].cardList.length - 1; j >= 0; j -= 2) if (self._progressionPairs[i].cardList[j].val > winc.val) {
              var pairsFromPP = self._progressionPairs[i].cardList.splice(j - 1, 2);
              return {
                cardList: pairsFromPP,
                cardKind: G.gameRule.PAIRS,
                size: 2,
                val: pairsFromPP[0].val
              };
            }
          } else if (self._three.length > 0) for (var i = self._three.length - 1; i >= 0; i--) if (self._three[i].val > winc.val) return {
            cardList: self._three[i].cardList.slice(0, 2),
            cardKind: G.gameRule.PAIRS,
            size: 2,
            val: self._three[i].val
          };
          return pairs;

         case G.gameRule.THREE:
          if (!isWinnerIsLandlord && !self.player.isLandlord) return null;
          return self.matchCards(self._three, G.gameRule.THREE, winc, isWinnerIsLandlord, winnerCardCount);

         case G.gameRule.THREE_WITH_ONE:
          if (!isWinnerIsLandlord && !self.player.isLandlord) return null;
          var three = self.minCards(self._three, G.gameRule.THREE, winc.val);
          if (three) {
            var one = self.minOne(2, three.val);
            if (!one) return null;
            three.cardList.push(one);
            three.cardKind = G.gameRule.THREE_WITH_ONE;
            three.size = 4;
          }
          return three;

         case G.gameRule.THREE_WITH_PAIRS:
          if (!isWinnerIsLandlord && !self.player.isLandlord) return null;
          var three = self.minCards(self._three, G.gameRule.THREE, winc.val);
          if (three) {
            var pairs = self.minCards(self._pairs, G.gameRule.PAIRS);
            while (true) {
              if (pairs.cardList[0].val !== three.val) break;
              pairs = self.minCards(self._pairs, G.gameRule.PAIRS, pairs.cardList[0].val);
            }
            if (!pairs) return null;
            three.cardList = three.cardList.concat(pairs.cardList);
            three.cardKind = G.gameRule.THREE_WITH_PAIRS;
            three.size = 5;
          }
          return three;

         case G.gameRule.PROGRESSION:
          if (!isWinnerIsLandlord && !self.player.isLandlord) return null;
          if (self._progression.length > 0) for (var i = self._progression.length - 1; i >= 0; i--) if (winc.val < self._progression[i].val && winc.size <= self._progression[i].cardList.length) {
            if (winc.size === self._progression[i].cardList.length) return self.setCardKind(self._progression[i], G.gameRule.PROGRESSION);
            if (self.player.isLandlord || isWinnerIsLandlord) {
              var valDiff = self._progression[i].val - winc.val, sizeDiff = self._progression[i].cardList.length - winc.size;
              for (var j = 0; j < sizeDiff; j++) {
                if (valDiff > 1) {
                  self._progression[i].cardList.shift();
                  self._progression[i].val--;
                  valDiff--;
                  continue;
                }
                self._progression[i].cardList.pop();
              }
              return self.setCardKind(self._progression[i], G.gameRule.PROGRESSION);
            }
            return null;
          }
          return null;

         case G.gameRule.PROGRESSION_PAIRS:
          if (!isWinnerIsLandlord && !self.player.isLandlord) return null;
          if (self._progressionPairs.length > 0) for (var i = self._progressionPairs.length - 1; i >= 0; i--) if (winc.val < self._progressionPairs[i].val && winc.size <= self._progressionPairs[i].cardList.length) {
            if (winc.size === self._progressionPairs[i].cardList.length) return self.setCardKind(self._progressionPairs[i], G.gameRule.PROGRESSION_PAIRS);
            if (self.player.isLandlord || isWinnerIsLandlord) {
              var valDiff = self._progressionPairs[i].val - winc.val, sizeDiff = (self._progressionPairs[i].cardList.length - winc.size) / 2;
              for (var j = 0; j < sizeDiff; j++) {
                if (valDiff > 1) {
                  self._progressionPairs[i].cardList.shift();
                  self._progressionPairs[i].cardList.shift();
                  valDiff--;
                  continue;
                }
                self._progressionPairs[i].cardList.pop();
                self._progressionPairs[i].cardList.pop();
              }
              return self.setCardKind(self._progressionPairs[i], G.gameRule.PROGRESSION_PAIRS);
            }
            return null;
          }
          return null;

         case G.gameRule.PLANE:
          if (!isWinnerIsLandlord && !self.player.isLandlord) return null;
          return self.minPlane(winc.size, winc);

         case G.gameRule.PLANE_WITH_ONE:
          if (!isWinnerIsLandlord && !self.player.isLandlord) return null;
          var cnt = winc.size / 4, plane = self.minPlane(3 * cnt, winc);
          if (plane) {
            var currOneVal = 2;
            for (var i = 0; i < cnt; i++) {
              var one = self.minOne(currOneVal, plane.val);
              if (!one) return null;
              plane.cardList.push(one);
              currOneVal = one.val;
            }
            plane.cardKind = G.gameRule.PLANE_WITH_ONE;
            plane.size = plane.cardList.length;
          }
          return plane;

         case G.gameRule.PLANE_WITH_PAIRS:
          if (!isWinnerIsLandlord && !self.player.isLandlord) return null;
          var cnt = winc.size / 5, plane = self.minPlane(3 * cnt, winc);
          if (plane) {
            var currPairsVal = 2;
            for (var i = 0; i < cnt; i++) {
              var pairs = self.minCards(self._pairs, G.gameRule.PAIRS, currPairsVal);
              if (!pairs) return null;
              plane.cardList = plane.cardList.concat(pairs.cardList);
              currPairsVal = pairs.val;
            }
            plane.cardKind = G.gameRule.PLANE_WITH_PAIRS;
            plane.size = plane.cardList.length;
          }
          return plane;

         case G.gameRule.BOMB:
          if (!isWinnerIsLandlord && !self.player.isLandlord) return null;
          var bomb = self.minCards(self._bomb, G.gameRule.BOMB, winc.val);
          if (bomb) return bomb;
          if (self._kingBomb.length > 0 && (isWinnerIsLandlord && winnerCardCount < 6 || self.player.isLandlord && self.player.cardList.length < 6)) return self.setCardKind(self._kingBomb[0], G.gameRule.KING_BOMB);
          return null;

         case G.gameRule.FOUR_WITH_TWO:
         case G.gameRule.FOUR_WITH_TWO_PAIRS:
          return self.minCards(self._bomb, G.gameRule.BOMB, winc.val);

         case G.gameRule.KING_BOMB:
         default:
          return null;
        }
      }();
      if (result) return result;
      if (winc.cardKind == G.gameRule.BOMB || winc.cardKind == G.gameRule.KING_BOMB || !(self._bomb.length > 0 || self._kingBomb.length > 0)) return null;
      if (isWinnerIsLandlord && winnerCardCount < 5 || self.player.isLandlord && (self.player.cardList.length < 5 || self.player.nextPlayer.cardList.length < 5 || self.player.nextPlayer.nextPlayer.cardList.length < 6) || self.times() <= 2) return self._bomb.length > 0 ? self.minCards(self._bomb, G.gameRule.BOMB) : self.setCardKind(self._kingBomb[0], G.gameRule.KING_BOMB);
    };
    AILogic.prototype.play = function(landlordCardsCnt) {
      var self = this;
      self.log();
      var cardsWithMin = function cardsWithMin(idx) {
        var minCard = self.cards[idx];
        for (var i = 0; i < self._one.length; i++) if (self._one[i].val === minCard.val) return self.minCards(self._one, G.gameRule.ONE);
        for (var _i = 0; _i < self._pairs.length; _i++) if (self._pairs[_i].val === minCard.val) return self.minCards(self._pairs, G.gameRule.PAIRS);
        for (var _i2 = 0; _i2 < self._three.length; _i2++) if (self._three[_i2].val === minCard.val) return self.minCards(self._three, G.gameRule.THREE);
        for (var _i3 = 0; _i3 < self._bomb.length; _i3++) if (self._bomb[_i3].val === minCard.val) return self.minCards(self._bomb, G.gameRule.BOMB);
        for (var _i4 = 0; _i4 < self._plane.length; _i4++) for (var j = 0; j < self._plane[_i4].cardList.length; j++) if (self._plane[_i4].cardList[j].val === minCard.val && self._plane[_i4].cardList[j].shape === minCard.shape) return self.minCards(self._plane, G.gameRule.PLANE);
        for (var _i5 = 0; _i5 < self._progression.length; _i5++) for (var j = 0; j < self._progression[_i5].cardList.length; j++) if (self._progression[_i5].cardList[j].val === minCard.val && self._progression[_i5].cardList[j].shape === minCard.shape) return self.minCards(self._progression, G.gameRule.PROGRESSION);
        for (var _i6 = 0; _i6 < self._progressionPairs.length; _i6++) for (var j = 0; j < self._progressionPairs[_i6].cardList.length; j++) if (self._progressionPairs[_i6].cardList[j].val === minCard.val && self._progressionPairs[_i6].cardList[j].shape === minCard.shape) return self.minCards(self._progressionPairs, G.gameRule.PROGRESSION_PAIRS);
        if (self._kingBomb.length > 0) return self.minCards(self._kingBomb, G.gameRule.KING_BOMB);
      };
      for (var i = self.cards.length - 1; i >= 0; i--) {
        var r = cardsWithMin(i);
        if (r.cardKind !== G.gameRule.ONE) {
          if (r.cardKind === G.gameRule.THREE) {
            var three = self.minCards(self._three, G.gameRule.THREE);
            var len = three.cardList.length / 3;
            if (self._one.length > 0) {
              var one = self.minOne(currOneVal, three.val);
              three.cardList.push(one);
              return self.setCardKind(three, G.gameRule.THREE_WITH_ONE);
            }
            if (self._pairs.length > 0) {
              var pairs = self.minCards(self._pairs, G.gameRule.PAIRS, currPairsVal);
              three.cardList = three.cardList.concat(pairs.cardList);
              return self.setCardKind(three, G.gameRule.THREE_WITH_PAIRS);
            }
            return self.setCardKind(three, G.gameRule.THREE);
          }
          if (r.cardKind === G.gameRule.PLANE) {
            var plane = self.minCards(self._plane, G.gameRule.PLANE);
            var len = plane.cardList.length / 3;
            if (self._one.length > len && self._pairs.length > len) {
              if (self._one.length >= self._pairs.length) {
                var currOneVal = 2;
                for (var i = 0; i < len; i++) {
                  var one = self.minOne(currOneVal, plane.val);
                  plane.cardList.push(one);
                  currOneVal = one.val;
                }
                return self.setCardKind(plane, G.gameRule.PLANE_WITH_ONE);
              }
              var currPairsVal = 2;
              for (var i = 0; i < len; i++) {
                var pairs = self.minCards(self._pairs, G.gameRule.PAIRS, currPairsVal);
                plane.cardList = plane.cardList.concat(pairs.cardList);
                currPairsVal = pairs.val;
              }
              return self.setCardKind(plane, G.gameRule.PLANE_WITH_PAIRS);
            }
            if (self._pairs.length > len) {
              var currPairsVal = 2;
              for (var i = 0; i < len; i++) {
                var pairs = self.minCards(self._pairs, G.gameRule.PAIRS, currPairsVal);
                plane.cardList = plane.cardList.concat(pairs.cardList);
                currPairsVal = pairs.val;
              }
              return self.setCardKind(plane, G.gameRule.PLANE_WITH_PAIRS);
            }
            if (self._one.length > len) {
              var currOneVal = 2;
              for (var i = 0; i < len; i++) {
                var one = self.minOne(currOneVal, plane.val);
                plane.cardList.push(one);
                currOneVal = one.val;
              }
              return self.setCardKind(plane, G.gameRule.PLANE_WITH_ONE);
            }
            return self.setCardKind(plane, G.gameRule.PLANE);
          }
          if (r.cardKind === G.gameRule.BOMB && 1 === self.times()) return r;
          if (r.cardKind === G.gameRule.BOMB && 1 != self.times()) continue;
          return r;
        }
        if (self._plane.length > 0) {
          var plane = self.minCards(self._plane, G.gameRule.PLANE);
          var len = plane.cardList.length / 3;
          var currOneVal = 2;
          for (var i = 0; i < len; i++) {
            var one = self.minOne(currOneVal, plane.val);
            plane.cardList.push(one);
            currOneVal = one.val;
          }
          return self.setCardKind(plane, G.gameRule.PLANE_WITH_ONE);
        }
        if (self._three.length > 0) {
          var three = self.minCards(self._three, G.gameRule.THREE);
          var len = three.cardList.length / 3;
          var one = self.minOne(currOneVal, three.val);
          three.cardList.push(one);
          if (three.val < 14) return self.setCardKind(three, G.gameRule.THREE_WITH_ONE);
        }
        if (!self.player.isLandlord) return landlordCardsCnt <= 2 ? self.playOneAtTheEnd(landlordCardsCnt) : self.minCards(self._one, G.gameRule.ONE);
        if (self.player.isLandlord) return self.player.nextPlayer.cardList.length <= 2 || self.player.nextPlayer.nextPlayer.cardList.length <= 2 ? self.playOneAtTheEnd(landlordCardsCnt) : self.minCards(self._one, G.gameRule.ONE);
      }
    };
    AILogic.prototype.playOneAtTheEnd = function(landlordCardsCnt) {
      var self = this;
      if (self._progression.length > 0) return self.minCards(self._progression, G.gameRule.PROGRESSION);
      if (self._plane.length > 0) {
        var plane = self.minCards(self._plane, G.gameRule.PLANE);
        var len = plane.cardList.length / 3;
        if (self._one.length > len && self._pairs.length > len) {
          if (self._one.length >= self._pairs.length) {
            var currOneVal = 2;
            for (var i = 0; i < len; i++) {
              var one = self.minOne(currOneVal, plane.val);
              plane.cardList.push(one);
              currOneVal = one.val;
            }
            return self.setCardKind(plane, G.gameRule.PLANE_WITH_ONE);
          }
          var currPairsVal = 2;
          for (var i = 0; i < len; i++) {
            var pairs = self.minCards(self._pairs, G.gameRule.PAIRS, currPairsVal);
            plane.cardList = plane.cardList.concat(pairs.cardList);
            currPairsVal = pairs.val;
          }
          return self.setCardKind(plane, G.gameRule.PLANE_WITH_PAIRS);
        }
        if (self._pairs.length > len) {
          var currPairsVal = 2;
          for (var i = 0; i < len; i++) {
            var pairs = self.minCards(self._pairs, G.gameRule.PAIRS, currPairsVal);
            plane.cardList = plane.cardList.concat(pairs.cardList);
            currPairsVal = pairs.val;
          }
          return self.setCardKind(plane, G.gameRule.PLANE_WITH_PAIRS);
        }
        if (self._one.length > len) {
          var currOneVal = 2;
          for (var i = 0; i < len; i++) {
            var one = self.minOne(currOneVal, plane.val);
            plane.cardList.push(one);
            currOneVal = one.val;
          }
          return self.setCardKind(plane, G.gameRule.PLANE_WITH_ONE);
        }
        return self.setCardKind(plane, G.gameRule.PLANE);
      }
      if (self._progressionPairs.length > 0) return self.minCards(self._progressionPairs, G.gameRule.PROGRESSION_PAIRS);
      if (self._three.length > 0) {
        var three = self.minCards(self._three, G.gameRule.THREE);
        var len = three.cardList.length / 3;
        if (self._one.length >= 0) {
          var one = self.minOne(currOneVal, three.val);
          three.cardList.push(one);
          return self.setCardKind(three, G.gameRule.THREE_WITH_ONE);
        }
        if (self._pairs.length > 0) {
          var pairs = self.minCards(self._pairs, G.gameRule.PAIRS, currPairsVal);
          three.cardList = three.cardList.concat(pairs.cardList);
          return self.setCardKind(three, G.gameRule.THREE_WITH_PAIRS);
        }
        return self.setCardKind(three, G.gameRule.THREE);
      }
      if (self._pairs.length > 0) return self.player.isLandlord && (2 === self.player.nextPlayer.cardList.length || 2 === self.player.nextPlayer.nextPlayer.cardList.length) || !self.player.isLandlord && 2 === landlordCardsCnt ? self.maxCards(self._pairs, G.gameRule.PAIRS) : self.minCards(self._pairs, G.gameRule.PAIRS);
      if (self._one.length > 0) return self.player.isLandlord && (self.player.nextPlayer.cardList.length <= 2 || self.player.nextPlayer.nextPlayer.cardList.length <= 2) || !self.player.isLandlord && landlordCardsCnt <= 2 ? self.maxCards(self._one, G.gameRule.ONE) : self.minCards(self._one, G.gameRule.ONE);
      var one = null;
      one = self.player.isLandlord && (self.player.nextPlayer.cardList.length <= 2 || self.player.nextPlayer.nextPlayer.cardList.length <= 2) || !self.player.isLandlord && landlordCardsCnt <= 2 ? self.cards.slice(self.cards.length - 1, self.cards.length) : self.cards.slice(0, 1);
      return {
        size: 1,
        cardKind: G.gameRule.ONE,
        cardList: one,
        val: one[0].val
      };
    };
    AILogic.prototype.prompt = function(winc) {
      var self = this, stat = G.gameRule.valCount(self.cards);
      if (winc) {
        var promptList = [];
        var setPrompt = function setPrompt(c, winVal, st) {
          var result = [];
          for (var i = st.length - 1; i >= 0; i--) (st[i].count < c || st[i].val <= winVal) && st.splice(i, 1);
          st.sort(self.promptSort);
          for (var _i7 = 0; _i7 < st.length; _i7++) for (var _j = 0; _j < self.cards.length; _j++) if (self.cards[_j].val === st[_i7].val) {
            result.push(self.cards.slice(_j, _j + c));
            break;
          }
          return result;
        };
        var getPlanePrompt = function getPlanePrompt(n) {
          var result = [];
          if (winc.val < 14 && self.cards.length >= winc.size) for (var i = winc.val + 1; i < 15; i++) {
            var proList = [];
            for (var j = 0; j < self.cards.length; j++) {
              if (self.cards[j].val < i && 0 === proList.length) break;
              if (self.cards[j].val > i || proList.length > 0 && self.cards[j].val === proList[proList.length - 1].val) continue;
              if (self.cards[j].val === i && self.cards[j + 1] && self.cards[j + 1].val === i && self.cards[j + 2] && self.cards[j + 2].val === i && 0 === proList.length) {
                proList = proList.concat(self.cards.slice(j, j + 3));
                j += 2;
                continue;
              }
              if (!(proList.length > 0 && proList[proList.length - 1].val - 1 === self.cards[j].val && self.cards[j + 1] && proList[proList.length - 1].val - 1 === self.cards[j + 1].val && self.cards[j + 2] && proList[proList.length - 1].val - 1 === self.cards[j + 2].val)) break;
              proList = proList.concat(self.cards.slice(j, j + 3));
              j += 2;
              if (proList.length === 3 * n) {
                result.push(proList);
                break;
              }
            }
          }
          return result;
        };
        switch (winc.cardKind) {
         case G.gameRule.ONE:
          promptList = setPrompt(1, winc.val, stat);
          break;

         case G.gameRule.PAIRS:
          promptList = setPrompt(2, winc.val, stat);
          break;

         case G.gameRule.THREE:
          promptList = setPrompt(3, winc.val, stat);
          break;

         case G.gameRule.THREE_WITH_ONE:
          var threePrompt = setPrompt(3, winc.val, stat.slice(0)), onePrompt = setPrompt(1, 2, stat.slice(0));
          for (var i = 0; i < threePrompt.length; i++) for (var j = 0; j < onePrompt.length; j++) onePrompt[j][0].val != threePrompt[i][0].val && promptList.push(threePrompt[i].concat(onePrompt[j]));
          break;

         case G.gameRule.THREE_WITH_PAIRS:
          var threePrompt = setPrompt(3, winc.val, stat.slice(0)), pairsPrompt = setPrompt(2, 2, stat.slice(0));
          for (var i = 0; i < threePrompt.length; i++) for (var j = 0; j < pairsPrompt.length; j++) pairsPrompt[j][0].val != threePrompt[i][0].val && promptList.push(threePrompt[i].concat(pairsPrompt[j]));
          break;

         case G.gameRule.PROGRESSION:
          if (winc.val < 14 && self.cards.length >= winc.size) for (var i = winc.val + 1; i < 15; i++) {
            var proList = [];
            for (var j = 0; j < self.cards.length; j++) {
              if (self.cards[j].val < i && 0 === proList.length) break;
              if (self.cards[j].val > i || proList.length > 0 && self.cards[j].val === proList[proList.length - 1].val) continue;
              if (self.cards[j].val === i && 0 === proList.length) {
                proList.push(self.cards.slice(j, j + 1)[0]);
                continue;
              }
              if (proList[proList.length - 1].val - 1 !== self.cards[j].val) break;
              proList.push(self.cards.slice(j, j + 1)[0]);
              if (proList.length === winc.size) {
                promptList.push(proList);
                break;
              }
            }
          }
          break;

         case G.gameRule.PROGRESSION_PAIRS:
          if (winc.val < 14 && self.cards.length >= winc.size) for (var i = winc.val + 1; i < 15; i++) {
            var proList = [];
            for (var j = 0; j < self.cards.length; j++) {
              if (self.cards[j].val < i && 0 === proList.length) break;
              if (self.cards[j].val > i || proList.length > 0 && self.cards[j].val === proList[proList.length - 1].val) continue;
              if (self.cards[j].val === i && self.cards[j + 1] && self.cards[j + 1].val === i && 0 === proList.length) {
                proList = proList.concat(self.cards.slice(j, j + 2));
                j++;
                continue;
              }
              if (!(proList.length > 0 && proList[proList.length - 1].val - 1 === self.cards[j].val && self.cards[j + 1] && proList[proList.length - 1].val - 1 === self.cards[j + 1].val)) break;
              proList = proList.concat(self.cards.slice(j, j + 2));
              j++;
              if (proList.length === winc.size) {
                promptList.push(proList);
                break;
              }
            }
          }
          break;

         case G.gameRule.PLANE:
          promptList = getPlanePrompt(winc.size / 3);
          break;

         case G.gameRule.PLANE_WITH_ONE:
          promptList = getPlanePrompt(winc.size / 4);
          break;

         case G.gameRule.PLANE_WITH_PAIRS:
          promptList = getPlanePrompt(winc.size / 5);
          break;

         case G.gameRule.FOUR_WITH_TWO:
         case G.gameRule.FOUR_WITH_TWO_PAIRS:
         case G.gameRule.BOMB:
          promptList = setPrompt(4, winc.val, stat);
        }
        if (winc.cardKind != G.gameRule.KING_BOMB && winc.cardKind != G.gameRule.BOMB && self._bomb.length > 0) for (var i = self._bomb.length - 1; i >= 0; i--) promptList.push(self._bomb[i].cardList);
        winc.cardKind != G.gameRule.KING_BOMB && self._kingBomb.length > 0 && promptList.push(self._kingBomb[0].cardList);
        return promptList;
      }
      var promptList = [];
      for (var i = stat.length - 1; i >= 0; i--) 0 != i ? promptList.push(self.cards.splice(self.cards.length - stat[i].count, self.cards.length - 1)) : promptList.push(self.cards);
      return promptList;
    };
    AILogic.prototype.getMinVal = function(n, v) {
      var self = this, c = G.gameRule.valCount(self.cards);
      for (var i = c.length - 1; i >= 0; i--) if (c[i].count === n && c[i].val > v) return self.cards.splice(i, 1);
    };
    AILogic.prototype.analyse = function() {
      var self = this, target = self.cards.slice(0), stat = null, targetWob = null, targetWobt = null, targetWobp = null, targetWobpp = null;
      self._one = [];
      self._pairs = [];
      self._kingBomb = [];
      self._bomb = [];
      self._three = [];
      self._plane = [];
      self._progression = [];
      self._progressionPairs = [];
      target.sort(G.gameRule.cardSort);
      G.gameRule.isKingBomb(target.slice(0, 2)) && self._kingBomb.push(AICardType(17, target.splice(0, 2)));
      stat = G.gameRule.valCount(target);
      for (var i = 0; i < stat.length; i++) if (4 === stat[i].count) {
        var list = [];
        self.moveItem(target, list, stat[i].val);
        self._bomb.push(AICardType(list[0].val, list));
      }
      targetWob = target.slice(0);
      targetWobt = targetWob.slice(0);
      self.judgeThree(targetWobt);
      self.judgePlane();
      for (var _i8 = 0; _i8 < self._three.length; _i8++) targetWobt = targetWobt.concat(self._three[_i8].cardList);
      self._three = [];
      targetWobt.sort(G.gameRule.cardSort);
      targetWobp = targetWobt.slice(0);
      self.judgeProgression(targetWobp);
      self.judgeProgressionPairs(targetWobp);
      self.judgeThree(targetWobp);
      stat = G.gameRule.valCount(targetWobp);
      for (var _i9 = 0; _i9 < stat.length; _i9++) if (1 === stat[_i9].count) for (var j = 0; j < targetWobp.length; j++) targetWobp[j].val === stat[_i9].val && self._one.push(AICardType(stat[_i9].val, targetWobp.splice(j, 1))); else if (2 === stat[_i9].count) for (var j = 0; j < targetWobp.length; j++) targetWobp[j].val === stat[_i9].val && self._pairs.push(AICardType(stat[_i9].val, targetWobp.splice(j, 2)));
    };
    AILogic.prototype.judgeThree = function(cards) {
      var self = this, stat = G.gameRule.valCount(cards);
      for (var i = 0; i < stat.length; i++) if (3 === stat[i].count) {
        var list = [];
        self.moveItem(cards, list, stat[i].val);
        self._three.push(AICardType(list[0].val, list));
      }
    };
    AILogic.prototype.judgePlane = function() {
      var self = this;
      if (self._three.length > 1) {
        var proList = [];
        for (var i = 0; i < self._three.length; i++) {
          if (self._three[i].val >= 15) continue;
          if (0 == proList.length) {
            proList.push({
              obj: self._three[i],
              fromIndex: i
            });
            continue;
          }
          if (proList[proList.length - 1].val - 1 == self._three[i].val) proList.push({
            obj: self._three[i],
            fromIndex: i
          }); else {
            if (proList.length > 1) {
              var planeCards = [];
              for (var j = 0; j < proList.length; j++) planeCards = planeCards.concat(proList[j].obj.cardList);
              self._plane.push(AICardType(proList[0].obj.val, planeCards));
              for (var k = proList.length - 1; k >= 0; k--) self._three.splice(proList[k].fromIndex, 1);
            }
            proList = [];
            proList.push({
              obj: self._three[i],
              fromIndex: i
            });
          }
        }
        if (proList.length > 1) {
          var planeCards = [];
          for (var j = 0; j < proList.length; j++) planeCards = planeCards.concat(proList[j].obj.cardList);
          self._plane.push(AICardType(proList[0].obj.val, planeCards));
          for (var k = proList.length - 1; k >= 0; k--) self._three.splice(proList[k].fromIndex, 1);
        }
      }
    };
    AILogic.prototype.judgeProgression = function(cards) {
      var self = this;
      var saveProgression = function saveProgression(proList) {
        var progression = [];
        for (var j = 0; j < proList.length; j++) progression.push(proList[j].obj);
        self._progression.push(AICardType(proList[0].obj.val, progression));
        for (var k = proList.length - 1; k >= 0; k--) cards.splice(proList[k].fromIndex, 1);
      };
      if (cards.length >= 5) {
        var proList = [];
        for (var i = 0; i < cards.length; i++) {
          if (cards[i].val >= 15) continue;
          if (0 == proList.length) {
            proList.push({
              obj: cards[i],
              fromIndex: i
            });
            continue;
          }
          if (proList[proList.length - 1].obj.val - 1 === cards[i].val) {
            proList.push({
              obj: cards[i],
              fromIndex: i
            });
            if (5 === proList.length) break;
          } else {
            if (proList[proList.length - 1].obj.val === cards[i].val) continue;
            if (proList.length >= 5) break;
            proList = [];
            proList.push({
              obj: cards[i],
              fromIndex: i
            });
          }
        }
        if (5 === proList.length) {
          saveProgression(proList);
          self.judgeProgression(cards);
        } else self.joinProgression(cards);
      }
    };
    AILogic.prototype.joinProgression = function(cards) {
      var self = this;
      for (var i = 0; i < self._progression.length; i++) for (var j = 0; j < cards.length; j++) 14 != self._progression[i].val && self._progression[i].val === cards[j].val - 1 ? self._progression[i].cardList.unshift(cards.splice(j, 1)[0]) : cards[j].val === self._progression[i].val - self._progression[i].cardList.length && self._progression[i].cardList.push(cards.splice(j, 1)[0]);
      var temp = self._progression.slice(0);
      for (var _i10 = 0; _i10 < temp.length; _i10++) if (_i10 < temp.length - 1 && temp[_i10].val - temp[_i10].cardList.length === temp[_i10 + 1].val) {
        self._progression[_i10].cardList = self._progression[_i10].cardList.concat(self._progression[_i10 + 1].cardList);
        self._progression.splice(++_i10, 1);
      }
    };
    AILogic.prototype.judgeProgressionPairs = function(cards) {
      var self = this;
      var saveProgressionPairs = function saveProgressionPairs(proList) {
        var progressionPairs = [];
        for (var i = proList.length - 1; i >= 0; i--) for (var j = 0; j < cards.length; j++) if (cards[j].val === proList[i]) {
          progressionPairs = progressionPairs.concat(cards.splice(j, 2));
          break;
        }
        progressionPairs.sort(G.gameRule.cardSort);
        self._progressionPairs.push(AICardType(proList[0], progressionPairs));
      };
      if (cards.length >= 6) {
        var proList = [];
        var stat = G.gameRule.valCount(cards);
        for (var i = 0; i < stat.length; i++) {
          if (stat[i].val >= 15) continue;
          if (0 == proList.length && stat[i].count >= 2) {
            proList.push(stat[i].val);
            continue;
          }
          if (proList[proList.length - 1] - 1 === stat[i].val && stat[i].count >= 2) proList.push(stat[i].val); else {
            if (proList.length >= 3) break;
            proList = [];
            stat[i].count >= 2 && proList.push(stat[i].val);
          }
        }
        if (proList.length >= 3) {
          saveProgressionPairs(proList);
          self.judgeProgressionPairs(cards);
        }
      }
    };
    AILogic.prototype.moveItem = function(src, dest, v) {
      for (var i = src.length - 1; i >= 0; i--) src[i].val === v && dest.push(src.splice(i, 1)[0]);
    };
    AILogic.prototype.setCardKind = function(obj, kind) {
      obj.cardKind = kind;
      obj.size = obj.cardList.length;
      return obj;
    };
    AILogic.prototype.minPlane = function(len, winc) {
      var self = this;
      if (self._plane.length > 0) for (var i = self._plane.length - 1; i >= 0; i--) if (winc.val < self._plane[i].val && len <= self._plane[i].cardList.length) {
        if (len === self._plane[i].cardList.length) return self.setCardKind(self._plane[i], G.gameRule.PLANE);
        var valDiff = self._plane[i].val - winc.val, sizeDiff = (self._plane[i].cardList.length - len) / 3;
        for (var j = 0; j < sizeDiff; j++) {
          if (valDiff > 1) {
            for (var k = 0; k < 3; k++) self._plane[i].cardList.shift();
            valDiff--;
            continue;
          }
          for (var k = 0; k < 3; k++) self._plane[i].cardList.pop();
        }
        return self.setCardKind(self._plane[i], G.gameRule.PLANE);
      }
      return null;
    };
    AILogic.prototype.minCards = function(list, kind, v) {
      var self = this;
      v = v || 2;
      if (list.length > 0) for (var i = list.length - 1; i >= 0; i--) if (v < list[i].val) return self.setCardKind(list[i], kind);
      return null;
    };
    AILogic.prototype.maxCards = function(list, kind, v) {
      var self = this, max = null;
      if (list.length > 0) {
        for (var i = 0; i < list.length; i++) (max && list[i].val > max.val || !max) && (max = list[i]);
        return v ? max.val > v ? self.setCardKind(max, kind) : null : self.setCardKind(max, kind);
      }
      return null;
    };
    AILogic.prototype.matchCards = function(list, kind, winc, isWinnerIsLandlord, winnerCardCount) {
      var self = this;
      if (self.player.isLandlord) return self.player.nextPlayer.cardList.length < 3 || self.player.nextPlayer.nextPlayer.cardList.length < 3 ? self.maxCards(list, kind, winc.val) : self.minCards(list, kind, winc.val);
      if (isWinnerIsLandlord) return winnerCardCount < 3 ? self.maxCards(list, kind, winc.val) : self.minCards(list, kind, winc.val);
      var c = null;
      if (self.player.nextPlayer.isLandlord && self.player.nextPlayer.cardList.length < 3) return self.maxCards(list, kind, winc.val);
      c = self.minCards(list, kind, winc.val);
      return c && (c.val < 14 || self.times() <= 2) ? c : null;
    };
    AILogic.prototype.minOne = function(v, notEq) {
      var self = this, one = self.minCards(self._one, G.gameRule.ONE, v), oneFromPairs = self.offPairs(notEq);
      if (one) {
        if (one.val > 14) {
          if (oneFromPairs) {
            self.deleteOne(oneFromPairs);
            return oneFromPairs;
          }
          return null;
        }
        return one.cardList[0];
      }
      if (oneFromPairs) {
        self.deleteOne(oneFromPairs);
        return oneFromPairs;
      }
      return null;
    };
    AILogic.prototype.offPairs = function(v, notEq) {
      var self = this, pairs = self.minCards(self._pairs, G.gameRule.PAIRS, v);
      if (pairs) while (true) {
        if (pairs.cardList[0].val !== notEq) break;
        pairs = self.minCards(self._pairs, G.gameRule.PAIRS, pairs.cardList[0].val);
      }
      return pairs ? pairs.cardList[0] : null;
    };
    AILogic.prototype.deleteOne = function(card) {
      for (var i = 0; i < this.cards.length; i++) this.cards[i].val === card.val && this.cards[i].shape === card.shape && this.cards.splice(i, 1);
      this.analyse();
    };
    AILogic.prototype.judgeScore = function() {
      var self = this, score = 0;
      score += 6 * self._bomb.length;
      self._kingBomb.length > 0 ? score += 8 : 17 === self.cards[0].val ? score += 4 : 16 === self.cards[0].val && (score += 3);
      for (var i = 0; i < self.cards.length; i++) 15 === self.cards[i].val && (score += 2);
      console.info(self.player.userId + "\u624b\u724c\u8bc4\u5206\uff1a" + score);
      return score >= 7 ? 3 : score >= 5 ? 2 : score >= 3 ? 1 : 4;
    };
    AILogic.prototype.promptSort = function(a, b) {
      if (a.count === b.count) return a.val > b.val ? 1 : -1;
      return a.count < b.count ? -1 : 1;
    };
    AILogic.prototype.times = function() {
      var t = this._kingBomb.length + this._bomb.length + this._progression.length + this._progressionPairs.length + this._one.length + this._pairs.length;
      var threeCount = this._three.length;
      if (this._plane.length > 0) for (var i = 0; i < this._plane.length; i++) threeCount += this._plane[i].cardList.length / 3;
      threeCount - (this._one.length + this._pairs.length) > 0 && (t += threeCount - (this._one.length + this._pairs.length));
      return t;
    };
    AILogic.prototype.log = function() {
      var self = this;
      console.info("\u4ee5\u4e0b\u663e\u793a\u3010" + self.player.userId + "\u3011\u624b\u724c\u6982\u51b5\uff0c\u624b\u6570\uff1a" + self.times());
      console.info("\u738b\u70b8");
      console.info(self._kingBomb);
      console.info("\u70b8\u5f39");
      console.info(self._bomb);
      console.info("\u4e09\u6839");
      console.info(self._three);
      console.info("\u98de\u673a");
      console.info(self._plane);
      console.info("\u987a\u5b50");
      console.info(self._progression);
      console.info("\u8fde\u5bf9");
      console.info(self._progressionPairs);
      console.info("\u5355\u724c");
      console.info(self._one);
      console.info("\u5bf9\u5b50");
      console.info(self._pairs);
    };
    module.exports = AILogic;
    cc._RF.pop();
  }, {} ],
  DataNotify: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "584b49biaxFy6ixx1Xpv6D5", "DataNotify");
    "use strict";
    var DataNotify = cc.Class({
      ctor: function ctor() {
        var data = arguments[0];
        this._listeners = [];
        this.setData(data);
      },
      addListener: function addListener(callback, target) {
        cc.assert(callback);
        var listener = {
          callback: callback,
          target: target
        };
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = void 0;
        try {
          for (var _iterator = this._listeners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _listener = _step.value;
            if (target === _listener.target) return;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            _iteratorNormalCompletion || null == _iterator["return"] || _iterator["return"]();
          } finally {
            if (_didIteratorError) throw _iteratorError;
          }
        }
        this._listeners.push(listener);
      },
      removeListener: function removeListener(callback, target) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = void 0;
        try {
          for (var _iterator2 = this._listeners[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var listener = _step2.value;
            if (target === listener.target) {
              cc.js.array.remove(this._listeners, listener);
              break;
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            _iteratorNormalCompletion2 || null == _iterator2["return"] || _iterator2["return"]();
          } finally {
            if (_didIteratorError2) throw _iteratorError2;
          }
        }
      },
      getData: function getData() {
        return this._data;
      },
      setData: function setData(data) {
        this._oldData = this._data;
        this._data = data;
        this._tryBindArrayFunction();
        this.update();
      },
      _tryBindArrayFunction: function _tryBindArrayFunction() {
        if (this._data instanceof Array) {
          var self = this;
          var arrProto = Object.create(Array.prototype);
          [ "shift", "unshift", "push", "pop", "splice" ].forEach(function(method) {
            Object.defineProperty(arrProto, method, {
              value: function value() {
                var result = Array.prototype[method].apply(this, arguments);
                self.update();
                return result;
              }
            });
          });
          this._data.__proto__ = arrProto;
        }
      },
      update: function update() {
        var _this = this;
        this._listeners.forEach(function(element) {
          element.callback.call(element.target, _this._data, _this._oldData);
        });
      },
      statics: {
        create: function create(module, dataName, defaultData) {
          var dataNotify = new DataNotify(defaultData);
          Object.defineProperty(module, dataName, {
            get: function get() {
              return dataNotify.getData();
            },
            set: function set(data) {
              return dataNotify.setData(data);
            }
          });
          return dataNotify;
        },
        factory: function factory(host, name, def) {
          host[name] = void 0;
          host[name + "Notify"] = this.create(host, name, def);
        }
      }
    });
    module.exports = DataNotify;
    cc._RF.pop();
  }, {} ],
  api: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e3631oHIwhIHZfqLjTEZMZ/", "api");
    "use strict";
    var api = {};
    module.exports = api;
    cc._RF.pop();
  }, {} ],
  audioManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2fa90yaj29Er5pE1YHOJS9f", "audioManager");
    "use strict";
    module.exports = {
      _MusicId: null,
      _LastMusicClip: null,
      _PauseMusic: false,
      isPlayedAudio: false,
      _effectVolume: 1,
      PlayMusic: function PlayMusic(clip, finished) {
        this.MusicClip = clip || this.MusicClip;
        cc.log("=========this.MusicClip=========" + this.MusicClip);
        this._LastMusicClip = clip;
        cc.audioEngine.stopAll();
        var musicId = cc.audioEngine.playMusic(this.MusicClip, true);
        this._MusicId = musicId;
        finished && cc.audioEngine.setFinishCallback(musicId, finished);
      },
      StopMusic: function StopMusic() {
        cc.audioEngine.stopMusic();
        this._LastMusicClip = null;
      },
      HidePagePause: function HidePagePause() {
        console.log("HidePagePause", this._MusicId);
        try {
          if (this._MusicId) {
            this._PauseMusic = true;
            cc.audioEngine.setVolume(this._MusicId, 0);
            cc.audioEngine.pause(this._MusicId);
          }
        } catch (error) {
          console.log("HidePagePause---error==", error);
        }
      },
      ShowPageResume: function ShowPageResume() {
        console.log("ShowPageResume", this._MusicId);
        try {
          if (this._MusicId) {
            this._PauseMusic = false;
            cc.audioEngine.setVolume(this._MusicId, 1);
            cc.audioEngine.resume(this._MusicId);
          }
        } catch (error) {
          console.log("ShowPageResume---error==", error);
        }
      },
      PauseMusic: function PauseMusic() {
        console.log("\u6682\u505c\u64ad\u653e\u97f3\u4e50");
        cc.audioEngine.setVolume(this._MusicId, 0);
        cc.audioEngine.pause(this._MusicId);
      },
      stopAll: function stopAll() {
        cc.audioEngine.stopAll();
      },
      ResumeMusic: function ResumeMusic() {
        console.log("\u6062\u590d\u64ad\u653e\u97f3\u4e50");
        cc.audioEngine.setVolume(this._MusicId, 1);
        cc.audioEngine.resume(this._MusicId);
      },
      setMusicVolume: function setMusicVolume(value) {
        cc.audioEngine.setVolume(this._MusicId, value);
      },
      setEffectVolume: function setEffectVolume(value) {
        this._effectVolume = value;
      },
      PlayEffect: function PlayEffect(clip, finished) {
        if (this._PauseMusic) return;
        if (clip) {
          var audioId = cc.audioEngine.playEffect(clip, false);
          cc.audioEngine.setVolume(audioId, this._effectVolume);
          this.isPlayedAudio = true;
          finished && cc.audioEngine.setFinishCallback(audioId, finished);
          return audioId;
        }
        return null;
      },
      PlayEffectGirlSound: function PlayEffectGirlSound(clip, finished) {
        if (this._PauseMusic) return;
        if (clip) {
          var audioId = cc.audioEngine.playEffect(clip, false);
          this.isPlayedAudio = true;
          finished && cc.audioEngine.setFinishCallback(audioId, finished);
          return audioId;
        }
        return null;
      },
      StopEffect: function StopEffect(id) {
        cc.audioEngine.stop(id);
      },
      ToggleMusic: function ToggleMusic(toggle) {
        toggle.isChecked ? cc.audioEngine.isMusicPlaying() || this.PlayMusic() : this.StopMusic();
      },
      ToggleEffects: function ToggleEffects(toggle) {}
    };
    cc._RF.pop();
  }, {} ],
  carder: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "24351ymQ91J27jpDGxDlazN", "carder");
    "use strict";
    var cardobj = function cardobj(value, shape, king) {
      var that = {};
      that.index = -1;
      if (value) {
        that.value = value;
        that.val = value + 2;
      }
      shape && (that.shape = shape);
      if (void 0 != king) {
        that.king = king;
        that.val = king + 2;
        that.shape = 0;
      }
      return that;
    };
    var cardvalue = {
      A: 12,
      2: 13,
      3: 1,
      4: 2,
      5: 3,
      6: 4,
      7: 5,
      8: 6,
      9: 7,
      10: 8,
      J: 9,
      Q: 10,
      K: 11
    };
    var CardShape = {
      S: 1,
      H: 2,
      C: 3,
      D: 4
    };
    var Kings = {
      kx: 14,
      Kd: 15
    };
    function carder() {
      var that = {
        card_list: []
      };
      var shuffleCard = function shuffleCard() {
        for (var i = that.card_list.length - 1; i >= 0; i--) {
          var randomIndex = Math.floor(Math.random() * (i + 1));
          var tmpCard = that.card_list[randomIndex];
          that.card_list[randomIndex] = that.card_list[i];
          that.card_list[i] = tmpCard;
        }
        return that.card_list;
      };
      var creatleCard = function creatleCard() {
        that.card_list = [];
        for (var iv in cardvalue) for (var js in CardShape) {
          var _card = cardobj(cardvalue[iv], CardShape[js], void 0);
          _card.index = that.card_list.length;
          that.card_list.push(_card);
        }
        for (var i in Kings) {
          var card = cardobj(void 0, void 0, Kings[i]);
          card.index = that.card_list.length;
          that.card_list.push(card);
        }
        shuffleCard();
      };
      that.splitThreeCards = function() {
        creatleCard();
        var threeCards = {};
        for (var i = 0; i < 17; i++) for (var j = 0; j < 3; j++) threeCards.hasOwnProperty(j) ? threeCards[j].push(that.card_list.pop()) : threeCards[j] = [ that.card_list.pop() ];
        return [ threeCards[0], threeCards[1], threeCards[2], that.card_list ];
      };
      var isOneCard = function isOneCard(cardList) {
        if (1 === cardList.length) return true;
        return false;
      };
      var IsDoubleCard = function IsDoubleCard(cardList) {
        if (2 != cardList.length) return false;
        if (void 0 == cardList[0].card_data.value || cardList[0].card_data.value != cardList[1].card_data.value) return false;
        return true;
      };
      var Isthree = function Isthree(cardList) {
        if (3 != cardList.length) return false;
        if (void 0 == cardList[0].card_data.value || void 0 == cardList[1].card_data.value) return false;
        if (cardList[0].card_data.value != cardList[1].card_data.value) return false;
        if (cardList[0].card_data.value != cardList[2].card_data.value) return false;
        if (cardList[1].card_data.value != cardList[2].card_data.value) return false;
        return true;
      };
      var IsThreeAndOne = function IsThreeAndOne(cardList) {
        if (4 != cardList.length) return false;
        if (void 0 == cardList[1].card_data.value || void 0 == cardList[2].card_data.value) return false;
        if (cardList[0].card_data.value == cardList[1].card_data.value && cardList[1].card_data.value == cardList[2].card_data.value) return true;
        if (cardList[1].card_data.value == cardList[2].card_data.value && cardList[2].card_data.value == cardList[3].card_data.value) return true;
        return false;
      };
      var IsThreeAndTwo = function IsThreeAndTwo(cardList) {
        if (5 != cardList.length) return false;
        if (cardList[0].card_data.value == cardList[1].card_data.value && cardList[1].card_data.value == cardList[2].card_data.value) {
          if (cardList[3].card_data.value == cardList[4].card_data.value) return true;
        } else if (cardList[2].card_data.value == cardList[3].card_data.value && cardList[3].card_data.value == cardList[4].card_data.value && cardList[0].card_data.value == cardList[1].card_data.value) return true;
        return false;
      };
      var IsBoom = function IsBoom(cardList) {
        if (4 != cardList.length) return false;
        var map = {};
        for (var i = 0; i < cardList.length; i++) map.hasOwnProperty(cardList[i].card_data.value) ? map[cardList[i].card_data.value]++ : map[cardList[i].card_data.value] = 1;
        var keys = Object.keys(map);
        if (1 == keys.length) return true;
        return false;
      };
      var IsKingBoom = function IsKingBoom(cardList) {
        if (2 != cardList.length) return false;
        if (void 0 != cardList[0].card_data.king && void 0 != cardList[1].card_data.king) return true;
        return false;
      };
      var IsPlan = function IsPlan(cardList) {
        if (6 != cardList.length) return false;
        var map = {};
        for (var i = 0; i < cardList.length; i++) map.hasOwnProperty(cardList[i].card_data.value) ? map[cardList[i].card_data.value]++ : map[cardList[i].card_data.value] = 1;
        var keys = Object.keys(map);
        console.log("IsPlan keys" + keys);
        if (2 == keys.length) {
          for (var key in map) if (3 != map[key]) return false;
          var p1 = Number(keys[0]);
          var p2 = Number(keys[1]);
          if (1 != Math.abs(p1 - p2)) return false;
          return true;
        }
        return false;
      };
      var IsPlanWithSing = function IsPlanWithSing(cardList) {
        if (8 != cardList.length) return false;
        var map = {};
        for (var i = 0; i < cardList.length; i++) map.hasOwnProperty(cardList[i].card_data.value) ? map[cardList[i].card_data.value]++ : map[cardList[i].card_data.value] = 1;
        var keys = Object.keys(map);
        console.log("IsPlan keys" + keys);
        if (4 != keys.length) return false;
        var three_list = [];
        var sing_count = 0;
        for (var i in map) 3 == map[i] ? three_list.push(i) : 1 == map[i] && sing_count++;
        if (2 != three_list.length || 2 != sing_count) return false;
        var p1 = Number(three_list[0]);
        var p2 = Number(three_list[1]);
        if (1 != Math.abs(p1 - p2)) return false;
        return true;
      };
      var IsPlanWithDouble = function IsPlanWithDouble(cardList) {
        if (10 != cardList.length) return false;
        var map = {};
        for (var i = 0; i < cardList.length; i++) map.hasOwnProperty(cardList[i].card_data.value) ? map[cardList[i].card_data.value]++ : map[cardList[i].card_data.value] = 1;
        var keys = Object.keys(map);
        if (4 != keys.length) return false;
        var three_list = [];
        var double_count = 0;
        for (var i in map) 3 == map[i] ? three_list.push(i) : 2 == map[i] && double_count++;
        if (2 != three_list.length || 2 != double_count) return false;
        var p1 = Number(three_list[0]);
        var p2 = Number(three_list[1]);
        if (1 != Math.abs(p1 - p2)) return false;
        return true;
      };
      var IsShunzi = function IsShunzi(cardList) {
        if (cardList.length < 5 || cardList.length > 12) return false;
        var tmp_cards = cardList;
        for (var i = 0; i < tmp_cards.length; i++) if (13 == tmp_cards[i].card_data.value || 14 == tmp_cards[i].card_data.value || 15 == tmp_cards[i].card_data.value) return false;
        tmp_cards.sort(function(x, y) {
          return Number(x.card_data.value) - Number(y.card_data.value);
        });
        for (var i = 0; i < tmp_cards.length; i++) {
          if (i + 1 == tmp_cards.length) break;
          var p1 = Number(tmp_cards[i].card_data.value);
          var p2 = Number(tmp_cards[i + 1].card_data.value);
          if (1 != Math.abs(p1 - p2)) return false;
        }
        return true;
      };
      var IsLianDui = function IsLianDui(cardList) {
        if (cardList.length < 6 || cardList.length > 24) return false;
        for (var i = 0; i < cardList.length; i++) if (14 == cardList[i].card_data.value || 15 == cardList[i].card_data.value || 13 == cardList[i].card_data.value) return false;
        var map = {};
        for (var i = 0; i < cardList.length; i++) map.hasOwnProperty(cardList[i].card_data.value) ? map[cardList[i].card_data.value]++ : map[cardList[i].card_data.value] = 1;
        for (var key in map) if (2 != map[key]) return false;
        var keys = Object.keys(map);
        if (keys.length < 3) return false;
        keys.sort(function(x, y) {
          return Number(x) - Number(y);
        });
        for (var i = 0; i < keys.length; i++) {
          if (i + 1 == keys.length) break;
          var p1 = Number(keys[i]);
          var p2 = Number(keys[i + 1]);
          if (1 != Math.abs(p1 - p2)) return false;
        }
        return true;
      };
      var CardsValue = {
        one: {
          name: "One",
          value: 1
        },
        double: {
          name: "Double",
          value: 1
        },
        three: {
          name: "Three",
          value: 1
        },
        boom: {
          name: "Boom",
          value: 2
        },
        threeWithOne: {
          name: "ThreeWithOne",
          value: 1
        },
        threeWithTwo: {
          name: "ThreeWithTwo",
          value: 1
        },
        plane: {
          name: "Plane",
          value: 1
        },
        planeWithOne: {
          name: "PlaneWithOne",
          value: 1
        },
        planeWithTwo: {
          name: "PlaneWithTwo",
          value: 1
        },
        scroll: {
          name: "Scroll",
          value: 1
        },
        doubleScroll: {
          name: "DoubleScroll",
          value: 1
        },
        kingboom: {
          name: "kingboom",
          value: 3
        }
      };
      var compareOne = function compareOne(cardA, cardB) {
        console.log("compareOne");
        var valueA = 0;
        valueA = void 0 == cardA[0].card_data.value ? cardA[0].card_data.king : cardA[0].card_data.value;
        var valueB = 0;
        valueB = void 0 == cardB[0].card_data.value ? cardB[0].card_data.king : cardB[0].card_data.value;
        if (valueA >= valueB) return false;
        return true;
      };
      var compareDouble = function compareDouble(cardA, cardB) {
        console.log("compareDouble");
        var result = compareOne(cardA, cardB);
        return result;
      };
      var compareThree = function compareThree(cardA, cardB) {
        console.log("compareThree");
        var result = compareOne(cardA, cardB);
        return result;
      };
      var compareBoom = function compareBoom(cardA, cardB) {
        console.log("compareBoom");
        var result = false;
        4 == cardA.length && 4 == cardB.length && (result = compareOne(cardA, cardB));
        return result;
      };
      var compareBoomKing = function compareBoomKing(cardA, cardB) {
        if (2 != cardB.length) return false;
        return true;
      };
      var comparePlanWithSing = function comparePlanWithSing(cardA, cardB) {
        var lista = [];
        var listb = [];
        var map = {};
        for (var i = 0; i < cardA.length; i++) map.hasOwnProperty(cardA.card_data.value) ? lista.push(cardA) : map[cardA.card_data.value] = 1;
        for (var i = 0; i < cardB.length; i++) map.hasOwnProperty(cardB.card_data.value) ? listb.push(cardB) : map[cardB.card_data.value] = 1;
        var result = compareOne(cardA, cardB);
        return result;
      };
      var comparePlanWithTow = function comparePlanWithTow(cardA, cardB) {
        var mapA = {};
        var mapB = {};
        for (var i = 0; i < cardA.length; i++) mapA.hasOwnProperty(cardA[i].card_data.value) ? mapA[cardA[i].card_data.value].push(cardA[i]) : mapA[cardA[i].card_data.value] = [ cardA[i] ];
        for (var i = 0; i < cardB.length; i++) mapB.hasOwnProperty(cardB[i].card_data.value) ? mapB[cardB[i].card_data.value].push(cardB[i]) : mapB[cardB[i].card_data.value] = [ cardB[i] ];
        var listA = [];
        for (var i in mapA) 3 === mapA[i].length && (listA = mapA[i]);
        var listB = [];
        for (var i in mapB) 3 === mapB[i].length && (listB = mapB[i]);
        var result = compareOne(listA, listB);
        return result;
      };
      var comparePlan = function comparePlan(cardA, cardB) {
        var mapA = {};
        for (var i = 0; i < cardA.length; i++) mapA.hasOwnProperty(cardA[i].card_data.value) ? mapA[cardA[i].card_data.value].push(cardA[i]) : mapA[cardA[i].card_data.value] = [ cardA[i] ];
        var listA = [];
        var maxNum = 16;
        for (var i in mapA) if (Number(i) < maxNum) {
          maxNum = Number(i);
          listA = mapA[i];
        }
        var mapB = {};
        for (var i = 0; i < cardB.length; i++) mapB.hasOwnProperty(cardB[i].card_data.value) ? mapB[cardB[i].card_data.value].push(cardB[i]) : mapB[cardB[i].card_data.value] = [ cardB[i] ];
        maxNum = 16;
        var listB = [];
        for (var i in mapB) if (Number(i) < maxNum) {
          maxNum = Number(i);
          listB = mapB[i];
        }
        var result = compareThree(listA, listB);
        return result;
      };
      var comparePlaneWithOne = function comparePlaneWithOne(cardA, cardB) {
        var result = false;
        var mapA = {};
        var listA = [];
        for (var i = 0; i < cardA.length; i++) mapA.hasOwnProperty(cardA[i].card_data.value) ? listA.push(cardA[i]) : mapA[cardA[i].card_data.value] = [ cardA[i] ];
        var mapB = {};
        var listB = [];
        for (var i = 0; i < cardB.length; i++) mapB.hasOwnProperty(cardB[i].card_data.value) ? listB.push(cardB[i]) : mapB[cardB[i].card_data.value] = [ cardB[i] ];
        result = comparePlan(listA, listB);
        return result;
      };
      var comparePlaneWithDouble = function comparePlaneWithDouble(cardA, cardB) {
        var mapA = {};
        for (var i = 0; i < cardA.length; i++) mapA.hasOwnProperty(cardA[i].card_data.value) ? mapA[cardA[i].card_data.value].push(cardA[i]) : mapA[cardA[i].card_data.value] = [ cardA[i] ];
        var mapB = {};
        for (var i = 0; i < cardB.length; i++) mapB.hasOwnProperty(cardB[i].card_data.value) ? mapB[cardB[i].card_data.value].push(cardB[i]) : mapB[cardB[i].card_data.value] = [ cardB[i] ];
        var listA = [];
        for (var i in mapA) if (3 === mapA[i].length) for (var j = 0; j < mapA[i].length; j++) listA.push(mapA[i][j]);
        console.log("list a = " + JSON.stringify(listA));
        var listB = [];
        for (var i in mapB) if (3 === mapB[i].length) for (var j = 0; j < mapB[i].length; j++) listB.push(mapB[i][j]);
        var result = comparePlan(listA, listB);
        return result;
      };
      var compareScroll = function compareScroll(cardA, cardB) {
        console.log("compareScroll");
        if (cardA.length != cardB.length) return false;
        var minNumA = 100;
        for (var i = 0; i < cardA.length; i++) cardA[i].card_data.value < minNumA && (minNumA = cardA[i].card_data.value);
        var minNumB = 100;
        for (var _i = 0; _i < cardB.length; _i++) cardB[_i].card_data.value < minNumB && (minNumB = cardB[_i].card_data.value);
        console.log("min a = " + minNumA);
        console.log("min b = " + minNumB);
        if (minNumA <= minNumB) return true;
        return false;
      };
      var compareDoubleScroll = function compareDoubleScroll(cardA, cardB) {
        var mapA = {};
        var listA = [];
        for (var i = 0; i < cardA.length; i++) if (mapA.hasOwnProperty(cardA[i].card_data.value)) ; else {
          mapA[cardA[i].card_data.value] = true;
          listA.push(a[i]);
        }
        var mapB = {};
        var listB = [];
        for (var i = 0; i < cardB.length; i++) if (mapB.hasOwnProperty(cardB[i].card_data.value)) ; else {
          mapB[cardB[i].card_data.value] = true;
          listB.push(cardB[i]);
        }
        console.log("list a = " + JSON.stringify(listA));
        console.log("list b = " + JSON.stringify(listB));
        return compareScroll(listA, listB);
      };
      var compare = function compare(cardA, cardB, current_card_value) {
        var result = false;
        switch (current_card_value.name) {
         case CardsValue.one.name:
          result = compareOne(cardA, cardB);
          break;

         case CardsValue["double"].name:
          result = compareDouble(cardA, cardB);
          break;

         case CardsValue.three.name:
          result = compareThree(cardA, cardB);
          break;

         case CardsValue.boom.name:
          result = compareBoom(cardA, cardB);
          break;

         case CardsValue.kingboom.name:
          result = compareBoomKing(cardA, cardB);
          break;

         case CardsValue.planeWithOne.name:
          result = comparePlanWithSing(cardA, cardB);
          break;

         case CardsValue.planeWithTwo.name:
          result = comparePlanWithTow(cardA, cardB);
          break;

         case CardsValue.plane.name:
          result = comparePlan(cardA, cardB);
          break;

         case CardsValue.planeWithOne.name:
          result = comparePlaneWithOne(cardA, cardB);
          break;

         case CardsValue.planeWithTwo.name:
          result = comparePlaneWithDouble(cardA, cardB);
          break;

         case CardsValue.scroll.name:
          result = compareScroll(cardA, cardB);
          break;

         case CardsValue.doubleScroll.name:
          result = compareDoubleScroll(cardA, cardB);
          break;

         default:
          console.log("no found card value!");
          result = false;
        }
        return result;
      };
      that.compareWithCard = function(last_cards, current_cards) {
        console.log("last_cards" + JSON.stringify(last_cards));
        console.log("current_cards" + JSON.stringify(current_cards));
        card_last_value = getCardValue(last_cards);
        card_current_value = getCardValue(current_cards);
        if (last_cards.value < current_cards.value) {
          console.log("compareWithCard less");
          return true;
        }
        if (last_cards.value == current_cards.value) {
          if (card_last_value.name != card_current_value.name) return false;
          var result = compare(last_cards, current_cards, card_last_value);
          return result;
        }
        return false;
      };
      that.IsCanPushs = function(cardList) {
        if (isOneCard(cardList)) {
          console.log("isOneCard sucess");
          return CardsValue.one;
        }
        if (IsDoubleCard(cardList)) {
          console.log("IsDoubleCard sucess");
          return CardsValue["double"];
        }
        if (Isthree(cardList)) {
          console.log("Isthree sucess");
          return CardsValue.three;
        }
        if (IsThreeAndOne(cardList)) {
          console.log("IsThreeAndOne sucess");
          return CardsValue.threeWithOne;
        }
        if (IsThreeAndTwo(cardList)) {
          console.log("IsThreeAndTwo sucess");
          return CardsValue.threeWithTwo;
        }
        if (IsBoom(cardList)) {
          console.log("IsBoom sucess");
          return CardsValue.boom;
        }
        if (IsKingBoom(cardList)) {
          console.log("IsKingBoom sucess");
          return CardsValue.kingboom;
        }
        if (IsPlan(cardList)) {
          console.log("IsPlan sucess");
          return CardsValue.plane;
        }
        if (IsPlanWithSing(cardList)) {
          console.log("IsPlanWithSing sucess");
          return CardsValue.planeWithOne;
        }
        if (IsPlanWithDouble(cardList)) {
          console.log("IsPlanWithDouble sucess");
          return CardsValue.planeWithTwo;
        }
        if (IsShunzi(cardList)) {
          console.log("IsShunzi sucess");
          return CardsValue.scroll;
        }
        if (IsLianDui(cardList)) {
          console.log("IsLianDui sucess");
          return CardsValue.DoubleScroll;
        }
        return;
      };
      var getCardValue = that.IsCanPushs;
      return that;
    }
    module.exports = carder();
    cc._RF.pop();
  }, {} ],
  card: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2afe8rz92BOl7CbQfKSCoLh", "card");
    "use strict";
    var _mygolbal = _interopRequireDefault(require("../../mygolbal.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var ddzData = require("ddzData");
    var ddzConstants = require("ddzConstants");
    cc.Class({
      extends: cc.Component,
      properties: {
        cards_sprite_atlas: cc.SpriteAtlas
      },
      onLoad: function onLoad() {
        this.flag = false;
        this.offset_y = 20;
        this.node.on("reset_card_flag", function(event) {
          if (this.flag) {
            this.flag = false;
            this.node.y -= this.offset_y;
          }
        }.bind(this));
      },
      runToCenter: function runToCenter() {},
      start: function start() {},
      init_data: function init_data(data) {},
      setTouchEvent: function setTouchEvent() {
        this.userId == _mygolbal["default"].playerData.userId && this.node.on(cc.Node.EventType.TOUCH_START, function(event) {
          if (ddzData.gameState === ddzConstants.gameState.PLAYING) {
            console.log("TOUCH_START id:" + this.caardIndex);
            if (this.flag) {
              this.flag = false;
              this.node.y -= this.offset_y;
              $socket.emit("_unchooseCard", this.caardIndex);
            } else {
              this.flag = true;
              this.node.y += this.offset_y;
              $socket.emit("_chooseCard", this.card_data);
            }
          }
        }.bind(this));
      },
      showCards: function showCards(card, userId) {
        this.caardIndex = card.index;
        this.card_data = card;
        userId && (this.userId = userId);
        var cardValue = {
          12: 1,
          13: 2,
          1: 3,
          2: 4,
          3: 5,
          4: 6,
          5: 7,
          6: 8,
          7: 9,
          8: 10,
          9: 11,
          10: 12,
          11: 13
        };
        var cardShape = {
          1: 3,
          2: 2,
          3: 1,
          4: 0
        };
        var kings = {
          14: 54,
          15: 53
        };
        var spriteKey = "";
        spriteKey = card.shape ? "card_" + (13 * cardShape[card.shape] + cardValue[card.value]) : "card_" + kings[card.king];
        this.node.getComponent(cc.Sprite).spriteFrame = this.cards_sprite_atlas.getSpriteFrame(spriteKey);
        this.setTouchEvent();
      }
    });
    cc._RF.pop();
  }, {
    "../../mygolbal.js": "mygolbal",
    ddzConstants: "ddzConstants",
    ddzData: "ddzData"
  } ],
  common: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "57aa9YWfKhKU5mVkposV4md", "common");
    "use strict";
    var audioManager = require("audioManager");
    var common = {
      audio: audioManager,
      getRandomStr: function getRandomStr(count) {
        var str = "";
        for (var i = 0; i < count; i++) str += Math.floor(10 * Math.random());
        return str;
      },
      random: function random(lower, upper) {
        return Math.round(Math.random() * (upper - lower) + lower);
      }
    };
    module.exports = common;
    cc._RF.pop();
  }, {
    audioManager: "audioManager"
  } ],
  creatRoom: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e85c8xPVuxKX5zdxLJ1e12h", "creatRoom");
    "use strict";
    var _mygolbal = _interopRequireDefault(require("../../mygolbal.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {},
      start: function start() {},
      onBtnClose: function onBtnClose() {
        this.node.destroy();
      },
      onButtonClick: function onButtonClick(event, value) {
        var _defines$jdRoomConfig = defines.jdRoomConfig["rate_" + value], bottom = _defines$jdRoomConfig.bottom, rate = _defines$jdRoomConfig.rate;
        var roomId = "".concat(rate, "_").concat(bottom, "_").concat(Math.floor(1e3 * Math.random()));
        _mygolbal["default"].playerData.bottom = bottom;
        _mygolbal["default"].playerData.rate = rate;
        _mygolbal["default"].playerData.roomId = roomId;
        cc.sys.localStorage.setItem("userData", JSON.stringify(_mygolbal["default"].playerData));
        cc.director.loadScene("gameScene");
        this.node.destroy();
      }
    });
    cc._RF.pop();
  }, {
    "../../mygolbal.js": "mygolbal"
  } ],
  ddzConstants: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "492f7UclO1Ima0pSFxOewO/", "ddzConstants");
    "use strict";
    module.exports = {
      gameState: {
        INVALID: -1,
        WAITREADY: 1,
        GAMESTART: 2,
        PUSHCARD: 3,
        ROBSTATE: 4,
        SHOWBOTTOMCARD: 5,
        PLAYING: 6,
        GAMEEND: 7
      },
      _pokersFrame: null,
      _chipsFrame: null
    };
    cc._RF.pop();
  }, {} ],
  ddzData: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "75b6fuQrzRI4YWCp6tpiV9Y", "ddzData");
    "use strict";
    var ddzConstants = require("ddzConstants");
    var DataNotify = require("DataNotify");
    module.exports = {
      gameState: -1,
      initData: function initData() {
        this.gameStateNotify = DataNotify.create(this, "gameState", JSON.parse(cc.sys.localStorage.getItem("gameState")));
        this.gameStateNotify.addListener(function(value) {
          cc.sys.localStorage.setItem("gameState", value);
        });
      }
    };
    cc._RF.pop();
  }, {
    DataNotify: "DataNotify",
    ddzConstants: "ddzConstants"
  } ],
  ddzServers: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a87d0G76kRFHq6wLdF0ibk9", "ddzServers");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = void 0;
    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
    }
    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
    function _iterableToArrayLimit(arr, i) {
      if (!(Symbol.iterator in Object(arr) || "[object Arguments]" === Object.prototype.toString.call(arr))) return;
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = void 0;
      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);
          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          _n || null == _i["return"] || _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }
    function _defineProperty(obj, key, value) {
      key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      }) : obj[key] = value;
      return obj;
    }
    var mygolbal = require("mygolbal");
    var ddzConstants = require("ddzConstants");
    var ddzData = require("ddzData");
    var carder = require("carder");
    var AILogic = require("AILogic");
    var ddzServers = {
      playersData: {},
      landlordIndex: 0,
      landlordNum: 0,
      robplayer: [],
      landlordId: "",
      roundWinId: "",
      winCards: null,
      initServer: function initServer() {
        true;
        ddzData.gameStateNotify.addListener(this.gameStateHandler, this);
        $socket.on("canrob_state_notify", this.canrobStateNotify, this);
        $socket.on("playAHandNotify", this.playAHandNotify, this);
        $socket.on("nextPlayerNotify", this.nextPlayerNotify, this);
      },
      gameStateHandler: function gameStateHandler(value) {
        var _this = this, _otherPlayerCards;
        var states = ddzConstants.gameState;
        switch (value) {
         case states.INVALID:
          break;

         case states.WAITREADY:
          this.roundWinId = "";
          this.winCards = null;
          break;

         case states.GAMESTART:
          this.playersData = this.initPlayerList();
          setTimeout(function() {
            _this.setGameState(states.PUSHCARD);
          }, 0);
          break;

         case states.PUSHCARD:
          window.$socket.emit("pushcard_notify", this.playersData[mygolbal.playerData.userId].cardList);
          setTimeout(function() {
            _this.setGameState(states.ROBSTATE);
          }, 0);
          break;

         case states.ROBSTATE:
          this.landlordIndex = common.random(0, 2);
          var id = this.playersData.players[this.landlordIndex];
          this.landlordId = "";
          this.robplayer = [];
          this.landlordNum = 0;
          window.$socket.emit("canrob_notify", id);
          break;

         case states.SHOWBOTTOMCARD:
          var landlordData = this.playersData[this.landlordId];
          var cards = this.playersData.cards;
          landlordData.isLandlord = true;
          landlordData.cardList = landlordData.cardList.concat(cards);
          window.$socket.emit("change_master_notify", {
            masterId: this.landlordId,
            cards: cards
          });
          setTimeout(function() {
            _this.setGameState(states.PLAYING);
          }, 0);
          break;

         case states.PLAYING:
          this.playCard(this.playersData[this.landlordId]);
          break;

         case states.GAMEEND:
          var userId = mygolbal.playerData.userId;
          var winPlayer = this.playersData[this.roundWinId];
          var nextPlayer1 = winPlayer.nextPlayer;
          var nextPlayer2 = nextPlayer1.nextPlayer;
          var isWin = this.roundWinId === userId || winPlayer.isLandlord === this.playersData[userId].isLandlord;
          window.$socket.emit("gameEndNotify", {
            isWin: isWin,
            otherPlayerCards: (_otherPlayerCards = {}, _defineProperty(_otherPlayerCards, nextPlayer1.userId, nextPlayer1.cardList), 
            _defineProperty(_otherPlayerCards, nextPlayer2.userId, nextPlayer2.cardList), _otherPlayerCards)
          });
        }
      },
      setGameState: function setGameState(state) {
        ddzData.gameState = state;
      },
      initPlayerList: function initPlayerList() {
        var _playersData;
        var _mygolbal$playerData = mygolbal.playerData, userId = _mygolbal$playerData.userId, rootList = _mygolbal$playerData.rootList;
        var rightPlayerId = rootList[0].userId;
        var leftPlayerId = rootList[1].userId;
        var cardList = carder.splitThreeCards();
        console.log("\u65b0\u724c", cardList);
        var playersData = (_playersData = {
          players: [ userId, rightPlayerId, leftPlayerId ],
          cards: cardList[3]
        }, _defineProperty(_playersData, userId, {
          isLandlord: false,
          userId: userId,
          cardList: cardList[0]
        }), _defineProperty(_playersData, rightPlayerId, {
          isLandlord: false,
          userId: rightPlayerId,
          cardList: cardList[1]
        }), _defineProperty(_playersData, leftPlayerId, {
          isLandlord: false,
          userId: leftPlayerId,
          cardList: cardList[2]
        }), _playersData);
        playersData[userId].nextPlayer = playersData[rightPlayerId];
        playersData[rightPlayerId].nextPlayer = playersData[leftPlayerId];
        playersData[leftPlayerId].nextPlayer = playersData[userId];
        return playersData;
      },
      canrobStateNotify: function canrobStateNotify(_ref) {
        var _this2 = this;
        var userId = _ref.userId, state = _ref.state;
        this.landlordNum++;
        var robList = this.robplayer;
        state === qian_state.qiang && this.landlordNum <= 3 && robList.push(userId);
        if (this.landlordNum < 3) {
          var nextId = this.playersData.players[++this.landlordIndex % 3];
          window.$socket.emit("canrob_notify", nextId);
        } else if (robList.length) {
          var _robList = _slicedToArray(robList, 3), player1 = _robList[0], player2 = _robList[1], player3 = _robList[2];
          var robNum = robList.length;
          1 === robNum && (this.landlordId = player1);
          2 === robNum && (player1 === userId ? this.landlordId = state === qian_state.qiang ? player1 : player2 : window.$socket.emit("canrob_notify", player1));
          3 === robNum && (player1 === userId ? state === qian_state.qiang ? this.landlordId = player1 : window.$socket.emit("canrob_notify", player2) : player2 === userId ? this.landlordId = state === qian_state.qiang ? player2 : player3 : window.$socket.emit("canrob_notify", player1));
        } else cc.director.loadScene("gameScene", function() {
          setTimeout(function() {
            console.log("\u91cd\u65b0\u5f00\u59cb");
            _this2.setGameState(ddzConstants.gameState.PUSHCARD);
          }, 0);
        });
        this.landlordId && this.setGameState(ddzConstants.gameState.SHOWBOTTOMCARD);
      },
      nextPlayerNotify: function nextPlayerNotify(userId) {
        this.playCard(this.playersData[userId].nextPlayer);
      },
      playCard: function playCard(player) {
        console.log("\u51fa\u724c", player);
        var isOver = this.roundWinId && !this.playersData[this.roundWinId].cardList.length;
        if (isOver) {
          this.setGameState(ddzConstants.gameState.GAMEEND);
          return;
        }
        if (player.userId === mygolbal.playerData.userId) window.$socket.emit("selfPlayAHandNotify"); else {
          var ai = new AILogic(player);
          var result = null;
          if (this.roundWinId && this.roundWinId !== player.userId) {
            var playerData = this.playersData[this.roundWinId];
            var isLandlord = playerData.userId === this.landlordId;
            result = ai.follow(this.winCards, isLandlord, playerData.cardList.length);
            console.log(player.userId, "AI\u8ddf\u724c", result);
          } else {
            result = ai.play(this.playersData[this.landlordId].cardList.length);
            console.log(player.userId, "AI\u51fa\u724c", result);
          }
          window.$socket.emit("rootPlayAHandNotify", {
            userId: player.userId,
            cards: result ? result.cardList : []
          });
          if (result) {
            for (var i = 0; i < result.cardList.length; i++) for (var j = 0; j < player.cardList.length; j++) if (player.cardList[j].val === result.cardList[i].val && player.cardList[j].shape === result.cardList[i].shape) {
              player.cardList.splice(j, 1);
              break;
            }
            result.cardKind === G.gameRule.BOMB || result.cardKind === G.gameRule.KING_BOMB;
            this.roundWinId = player.userId;
            delete result.cardList;
            this.winCards = result;
          }
        }
      },
      playAHandNotify: function playAHandNotify(_ref2, callback) {
        var userId = _ref2.userId, cards = _ref2.cards;
        console.log(cards);
        var type = this.getReadyCardsKind(cards);
        console.log(type);
        if (!type) {
          callback && callback({
            state: 0
          });
          return;
        }
        type.cardKind === G.gameRule.BOMB || type.cardKind === G.gameRule.KING_BOMB;
        this.winCards = type;
        this.roundWinId = userId;
        callback && callback({
          state: 1
        });
        var selfCards = this.playersData[userId].cardList;
        for (var i = 0; i < cards.length; i++) for (var j = 0; j < selfCards.length; j++) cards[i].val === selfCards[j].val && cards[i].shape === selfCards[j].shape && selfCards.splice(j, 1);
        this.nextPlayerNotify(userId);
      },
      getReadyCardsKind: function getReadyCardsKind() {
        var cardList = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
        if (!cardList.length) return null;
        var type = G.gameRule.typeJudge(cardList);
        if (type) return this.roundWinId && this.roundWinId !== myglobal.playerData.userId ? function(winc, ownc) {
          if (ownc.cardKind === G.gameRule.KING_BOMB || ownc.cardKind === G.gameRule.BOMB && winc.cardKind != G.gameRule.BOMB || ownc.cardKind === winc.cardKind && ownc.size === winc.size && ownc.val > winc.val) return type;
          return null;
        }(this.winCards, type) : type;
        return null;
      }
    };
    var _default = ddzServers;
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    AILogic: "AILogic",
    carder: "carder",
    ddzConstants: "ddzConstants",
    ddzData: "ddzData",
    mygolbal: "mygolbal"
  } ],
  event_lister: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d485eyCsiBLBqweDM7SjVQh", "event_lister");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = void 0;
    var eventLister = function eventLister(obj) {
      var register = {};
      obj.on = function(type, callback, target) {
        var listener = {
          callback: callback,
          target: target
        };
        if (register.hasOwnProperty(type)) {
          cc.assert(callback);
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = void 0;
          try {
            for (var _iterator = register[type][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var _listener = _step.value;
              if (target === _listener.target) return;
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              _iteratorNormalCompletion || null == _iterator["return"] || _iterator["return"]();
            } finally {
              if (_didIteratorError) throw _iteratorError;
            }
          }
          register[type].push(listener);
        } else register[type] = [ listener ];
      };
      obj.emit = function(type) {
        if (register.hasOwnProperty(type)) {
          var methodList = register[type];
          for (var i = 0; i < methodList.length; ++i) {
            var _methodList$i = methodList[i], callback = _methodList$i.callback, target = _methodList$i.target;
            var args = [];
            for (var _i = 1; _i < arguments.length; ++_i) args.push(arguments[_i]);
            callback.apply(target, args);
          }
        }
      };
      obj.remove = function(type, target) {
        register[type] = register[type].filter(function(e) {
          return e.target !== target;
        });
      };
      obj.removeLister = function(type) {
        register[type] = [];
      };
      obj.removeAllLister = function() {
        register = {};
      };
      return obj;
    };
    var _default = eventLister;
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {} ],
  gameRule: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6c7e6tN4rNCP7gHVED4eYzS", "gameRule");
    "use strict";
    var GameRule = function GameRule() {};
    GameRule.prototype.typeJudge = function(cards) {
      var self = this, len = cards.length;
      cards.sort(function(a, b) {
        return b.val - a.val;
      });
      switch (len) {
       case 1:
        return {
          cardKind: self.ONE,
          val: cards[0].val,
          size: len
        };

       case 2:
        return self.isPairs(cards) ? {
          cardKind: self.PAIRS,
          val: cards[0].val,
          size: len
        } : self.isKingBomb(cards) ? {
          cardKind: self.KING_BOMB,
          val: cards[0].val,
          size: len
        } : null;

       case 3:
        return self.isThree(cards) ? {
          cardKind: self.THREE,
          val: cards[0].val,
          size: len
        } : null;

       case 4:
        if (self.isThreeWithOne(cards)) return {
          cardKind: self.THREE_WITH_ONE,
          val: self.getMaxVal(cards, 3),
          size: len
        };
        if (self.isBomb(cards)) return {
          cardKind: self.BOMB,
          val: cards[0].val,
          size: len
        };
        return null;

       default:
        return self.isProgression(cards) ? {
          cardKind: self.PROGRESSION,
          val: cards[0].val,
          size: len
        } : self.isProgressionPairs(cards) ? {
          cardKind: self.PROGRESSION_PAIRS,
          val: cards[0].val,
          size: len
        } : self.isThreeWithPairs(cards) ? {
          cardKind: self.THREE_WITH_PAIRS,
          val: self.getMaxVal(cards, 3),
          size: len
        } : self.isPlane(cards) ? {
          cardKind: self.PLANE,
          val: self.getMaxVal(cards, 3),
          size: len
        } : self.isPlaneWithOne(cards) ? {
          cardKind: self.PLANE_WITH_ONE,
          val: self.getMaxVal(cards, 3),
          size: len
        } : self.isPlaneWithPairs(cards) ? {
          cardKind: self.PLANE_WITH_PAIRS,
          val: self.getMaxVal(cards, 3),
          size: len
        } : self.isFourWithTwo(cards) ? {
          cardKind: self.FOUR_WITH_TWO,
          val: self.getMaxVal(cards, 4),
          size: len
        } : self.isFourWithPairs(cards) ? {
          cardKind: self.FOUR_WITH_TWO_PAIRS,
          val: self.getMaxVal(cards, 4),
          size: len
        } : null;
      }
    };
    GameRule.prototype.isPairs = function(cards) {
      return 2 == cards.length && cards[0].val === cards[1].val;
    };
    GameRule.prototype.isThree = function(cards) {
      return 3 == cards.length && cards[0].val === cards[1].val && cards[1].val === cards[2].val;
    };
    GameRule.prototype.isThreeWithOne = function(cards) {
      if (4 != cards.length) return false;
      var c = this.valCount(cards);
      return 2 === c.length && (3 === c[0].count || 3 === c[1].count);
    };
    GameRule.prototype.isThreeWithPairs = function(cards) {
      if (5 != cards.length) return false;
      var c = this.valCount(cards);
      return 2 === c.length && (3 === c[0].count || 3 === c[1].count);
    };
    GameRule.prototype.isProgression = function(cards) {
      if (cards.length < 5 || cards.length > 12) return false;
      var tmp_cards = cards;
      for (var i = 0; i < tmp_cards.length; i++) if (13 == tmp_cards[i].value || 14 == tmp_cards[i].value || 15 == tmp_cards[i].value) return false;
      for (var i = 0; i < tmp_cards.length; i++) {
        if (i === tmp_cards.length - 1) break;
        var p1 = Number(tmp_cards[i].value);
        var p2 = Number(tmp_cards[i + 1].value);
        if (1 != Math.abs(p1 - p2)) return false;
      }
      return true;
    };
    GameRule.prototype.isProgressionPairs = function(cards) {
      if (cards.length < 6 || cards.length > 20 || cards.length % 2) return false;
      for (var i = 0; i < cards.length; i++) if (14 == cards[i].value || 15 == cards[i].value || 13 == cards[i].value) return false;
      var map = {};
      for (var i = 0; i < cards.length; i++) map.hasOwnProperty(cards[i].value) ? map[cards[i].value]++ : map[cards[i].value] = 1;
      for (var key in map) if (2 != map[key]) return false;
      var keys = Object.keys(map);
      if (keys.length < 3) return false;
      for (var i = 0; i < keys.length; i++) {
        if (i === keys.length - 1) break;
        var p1 = Number(keys[i]);
        var p2 = Number(keys[i + 1]);
        if (1 != Math.abs(p1 - p2)) return false;
      }
      return true;
    };
    GameRule.prototype.isPlane = function(cards) {
      if (cards.length < 6 || cards.length % 3 != 0 || 15 === cards[0].val) return false;
      for (var i = 0; i < cards.length; i += 3) if (i != cards.length - 3 && (cards[i].val != cards[i + 1].val || cards[i].val != cards[i + 2].val || cards[i].val - 1 != cards[i + 3].val)) return false;
      return true;
    };
    GameRule.prototype.isPlaneWithOne = function(cards) {
      if (cards.length < 8 || cards.length % 4 != 0) return false;
      var c = this.valCount(cards), threeList = [], threeCount = cards.length / 4;
      for (var i = 0; i < c.length; i++) 3 == c[i].count && threeList.push(c[i]);
      if (threeList.length != threeCount || 15 === threeList[0].val) return false;
      for (var _i = 0; _i < threeList.length; _i++) if (_i != threeList.length - 1 && threeList[_i].val - 1 != threeList[_i + 1].val) return false;
      return true;
    };
    GameRule.prototype.isPlaneWithPairs = function(cards) {
      if (cards.length < 10 || cards.length % 5 != 0) return false;
      var c = this.valCount(cards), threeList = [], pairsList = [], groupCount = cards.length / 5;
      for (var i = 0; i < c.length; i++) if (3 == c[i].count) threeList.push(c[i]); else {
        if (2 != c[i].count) return false;
        pairsList.push(c[i]);
      }
      if (threeList.length != groupCount || pairsList.length != groupCount || 15 === threeList[0].val) return false;
      for (var _i2 = 0; _i2 < threeList.length; _i2++) if (_i2 != threeList.length - 1 && threeList[_i2].val - 1 != threeList[_i2 + 1].val) return false;
      return true;
    };
    GameRule.prototype.isFourWithTwo = function(cards) {
      var c = this.valCount(cards);
      if (6 != cards.length || c.length > 3) return false;
      for (var i = 0; i < c.length; i++) if (4 === c[i].count) return true;
      return false;
    };
    GameRule.prototype.isFourWithPairs = function(cards) {
      if (8 != cards.length) return false;
      var c = this.valCount(cards);
      if (3 != c.length) return false;
      for (var i = 0; i < c.length; i++) if (4 != c[i].count && 2 != c[i].count) return false;
      return true;
    };
    GameRule.prototype.isBomb = function(cards) {
      return 4 === cards.length && cards[0].val === cards[1].val && cards[0].val === cards[2].val && cards[0].val === cards[3].val;
    };
    GameRule.prototype.isKingBomb = function(cards) {
      return 2 === cards.length && "0" == cards[0].shape && "0" == cards[1].shape;
    };
    GameRule.prototype.random = function(min, max) {
      min = null == min ? 0 : min;
      max = null == max ? 1 : max;
      var delta = max - min + 1;
      return Math.floor(Math.random() * delta + min);
    };
    GameRule.prototype.valCount = function(cards) {
      var result = [];
      var addCount = function addCount(result, v) {
        for (var i = 0; i < result.length; i++) if (result[i].val == v) {
          result[i].count++;
          return;
        }
        result.push({
          val: v,
          count: 1
        });
      };
      for (var i = 0; i < cards.length; i++) addCount(result, cards[i].val);
      return result;
    };
    GameRule.prototype.getMaxVal = function(cards, n) {
      var c = this.valCount(cards);
      var max = 0;
      for (var i = 0; i < c.length; i++) c[i].count === n && c[i].val > max && (max = c[i].val);
      return max;
    };
    GameRule.prototype.cardSort = function(a, b) {
      var va = parseInt(a.val);
      var vb = parseInt(b.val);
      return va === vb ? a.shape > b.shape ? 1 : -1 : va > vb ? -1 : 1;
    };
    GameRule.prototype.ONE = 1;
    GameRule.prototype.PAIRS = 2;
    GameRule.prototype.THREE = 3;
    GameRule.prototype.THREE_WITH_ONE = 4;
    GameRule.prototype.THREE_WITH_PAIRS = 5;
    GameRule.prototype.PROGRESSION = 6;
    GameRule.prototype.PROGRESSION_PAIRS = 7;
    GameRule.prototype.PLANE = 8;
    GameRule.prototype.PLANE_WITH_ONE = 9;
    GameRule.prototype.PLANE_WITH_PAIRS = 10;
    GameRule.prototype.FOUR_WITH_TWO = 11;
    GameRule.prototype.FOUR_WITH_TWO_PAIRS = 12;
    GameRule.prototype.BOMB = 13;
    GameRule.prototype.KING_BOMB = 14;
    GameRule.prototype.MSG_NO_SELECT = "\u8bf7\u9009\u62e9\u8981\u51fa\u7684\u724c";
    GameRule.prototype.MSG_ERROR_TYPE = "\u60a8\u9009\u62e9\u7684\u724c\u4e0d\u7b26\u5408\u6e38\u620f\u89c4\u5219";
    GameRule.prototype.MSG_NO_ROROB_RESTART = "\u6240\u6709\u73a9\u5bb6\u5747\u672a\u53eb\u5206\uff0c\u91cd\u65b0\u53d1\u724c";
    GameRule.prototype.DESK_STATUS_READY = 1;
    GameRule.prototype.DESK_STATUS_ROB = 2;
    GameRule.prototype.DESK_STATUS_PLAY = 3;
    module.exports = GameRule;
    cc._RF.pop();
  }, {} ],
  gameScene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cf22aez0/xDaaC1kRqxn/pw", "gameScene");
    "use strict";
    var _mygolbal = _interopRequireDefault(require("../mygolbal.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
    }
    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
    function _iterableToArrayLimit(arr, i) {
      if (!(Symbol.iterator in Object(arr) || "[object Arguments]" === Object.prototype.toString.call(arr))) return;
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = void 0;
      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);
          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          _n || null == _i["return"] || _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }
    var ddzConstants = require("ddzConstants");
    var ddzData = require("ddzData");
    cc.Class({
      extends: cc.Component,
      properties: {
        bjMusic: {
          type: cc.AudioClip,
          default: null
        },
        di_label: cc.Label,
        beishu_label: cc.Label,
        roomid_label: cc.Label,
        player_node_prefabs: cc.Prefab,
        btn_ready: cc.Node,
        players_seat_pos: cc.Node,
        gameUiNode: cc.Node
      },
      onLoad: function onLoad() {
        ddzData.gameState = ddzConstants.gameState.WAITREADY;
        true;
        ddzData.gameStateNotify.addListener(this.gameStateHandler, this);
        this.playerNodeList = [];
        var roomId = _mygolbal["default"].playerData.roomId;
        var _roomId$split = roomId.split("_"), _roomId$split2 = _slicedToArray(_roomId$split, 2), rate = _roomId$split2[0], bottom = _roomId$split2[1];
        _mygolbal["default"].playerData.rate = rate;
        _mygolbal["default"].playerData.bottom = bottom;
        this.roomid_label.string = defines.roomNames[rate - 1];
        this.beishu_label.string = "\u500d\u6570\uff1a" + rate;
        this.di_label.string = "\u5e95\uff1a" + bottom;
        console.log("\u91cd\u65b0\u5f00\u59cb", ddzData.gameState);
        this.btn_ready.active = ddzData.gameState < ddzConstants.gameState.GAMESTART;
        if (isopen_sound) {
          cc.audioEngine.stopAll();
          cc.audioEngine.play(this.bjMusic, true);
        }
        this.addPlayerNode(_mygolbal["default"].playerData);
        this.addPlayerNode(_mygolbal["default"].playerData.rootList[0]);
        this.addPlayerNode(_mygolbal["default"].playerData.rootList[1]);
        this.node.on("pushcard_other_event", function() {
          console.log("\u5176\u4ed6\u73a9\u5bb6\u53d1\u724c");
          for (var i = 0; i < this.playerNodeList.length; i++) {
            var node = this.playerNodeList[i];
            node && node.emit("push_card_event");
          }
        }.bind(this));
        return;
      },
      start: function start() {
        $socket.on("change_master_notify", this.masterNotify, this);
      },
      onDestroy: function onDestroy() {
        true;
        ddzData.gameStateNotify.removeListener(this.gameStateHandler, this);
        cc.audioEngine.stopAll();
        $socket.remove("change_master_notify", this);
      },
      masterNotify: function masterNotify(_ref) {
        var masterId = _ref.masterId, cards = _ref.cards;
        _mygolbal["default"].playerData.masterUserId = masterId;
        this.gameUiNode.emit("show_bottom_card_event", cards);
        for (var i = 0; i < this.playerNodeList.length; i++) {
          var node = this.playerNodeList[i];
          node && node.emit("playernode_changemaster_event", masterId);
        }
      },
      gameStateHandler: function gameStateHandler(state) {
        this.btn_ready.active = ddzData.gameState < ddzConstants.gameState.GAMESTART;
        state === ddzConstants.gameState.WAITREADY && (this.btn_ready.active = true);
      },
      onGoback: function onGoback() {
        ddzData.gameState = ddzConstants.gameState.INVALID;
        _mygolbal["default"].playerData.roomId = "";
        cc.sys.localStorage.setItem("userData", JSON.stringify(_mygolbal["default"].playerData));
        cc.director.loadScene("hallScene");
      },
      onBtnReadey: function onBtnReadey(event) {
        this.btn_ready.active = false;
        this.playerNodeList.forEach(function(node) {
          node.emit("gamestart_event");
        });
        ddzData.gameState = ddzConstants.gameState.GAMESTART;
      },
      addPlayerNode: function addPlayerNode(player_data) {
        var index = player_data.seatindex;
        var playernode_inst = cc.instantiate(this.player_node_prefabs);
        playernode_inst.parent = this.players_seat_pos.children[index];
        this.playerNodeList.push(playernode_inst);
        playernode_inst.getComponent("player_node").init_data(player_data, index);
      },
      getUserOutCardPosByAccount: function getUserOutCardPosByAccount(userId) {
        for (var i = 0; i < this.playerNodeList.length; i++) {
          var node = this.playerNodeList[i];
          if (node) {
            var node_script = node.getComponent("player_node");
            if (node_script.userId === userId) {
              var seat_node = this.players_seat_pos.children[node_script.seat_index].getChildByName("cardsoutzone");
              return seat_node;
            }
          }
        }
        return null;
      },
      getUserNodeByAccount: function getUserNodeByAccount(userId) {
        for (var i = 0; i < this.playerNodeList.length; i++) {
          var node = this.playerNodeList[i];
          if (node) {
            var playerNode = node.getComponent("player_node");
            if (playerNode.userId === userId) return playerNode;
          }
        }
        return null;
      }
    });
    cc._RF.pop();
  }, {
    "../mygolbal.js": "mygolbal",
    ddzConstants: "ddzConstants",
    ddzData: "ddzData"
  } ],
  gamebeforeUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "34b69bK3SJBFbE0zzOU1X9M", "gamebeforeUI");
    "use strict";
    var _mygolbal = _interopRequireDefault(require("../mygolbal.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        btn_ready: cc.Node
      },
      onLoad: function onLoad() {},
      start: function start() {},
      onButtonClick: function onButtonClick(event, customData) {
        switch (customData) {
         case "btn_ready":
          console.log("btn_ready");
          this.btn_ready.active = false;
          break;

         case "btn_start":
          console.log("btn_start");
          _mygolbal["default"].socket.requestStart(function(err, data) {
            0 != err ? console.log("requestStart err" + err) : console.log("requestStart data" + JSON.stringify(data));
          });
        }
      }
    });
    cc._RF.pop();
  }, {
    "../mygolbal.js": "mygolbal"
  } ],
  gameingUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fc5fbLb+LFG+rCIt1gYkSVX", "gameingUI");
    "use strict";
    var _mygolbal = _interopRequireDefault(require("../mygolbal.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var ddzConstants = require("ddzConstants");
    var ddzData = require("ddzData");
    cc.Class({
      extends: cc.Component,
      properties: {
        gameingUI: cc.Node,
        card_prefab: cc.Prefab,
        robUI: cc.Node,
        timeLabel: cc.Label,
        cardsNode: cc.Node,
        bottom_card_pos_node: cc.Node,
        playingUI_node: cc.Node,
        tipsLabel: cc.Label,
        loseNode: cc.Node,
        winNode: cc.Node,
        fapaiAudio: {
          type: cc.AudioClip,
          default: null
        },
        jiaodizhuAudio: {
          type: cc.AudioClip,
          default: null
        },
        buqiangAudio: {
          type: cc.AudioClip,
          default: null
        },
        cardsAudio: {
          type: cc.AudioClip,
          default: null
        },
        buyaoAudio: {
          type: cc.AudioClip,
          default: null
        },
        chupaiAudio: {
          type: cc.AudioClip,
          default: null
        }
      },
      onLoad: function onLoad() {
        this.cards_nods = [];
        this.card_width = 0;
        this.bottom_card = [];
        this.bottom_card_data = [];
        this.choose_card_data = [];
        this.outcar_zone = [];
        this.push_card_tmp = [];
        this.node.on("show_bottom_card_event", function(data) {
          console.log("----show_bottom_card_event", data);
          this.bottom_card_data = data;
          for (var i = 0; i < data.length; i++) {
            var card = this.bottom_card[i];
            var show_data = data[i];
            var call_data = {
              obj: card,
              data: show_data
            };
            var run = cc.callFunc(function(target, activedata) {
              var show_card = activedata.obj;
              var show_data = activedata.data;
              show_card.getComponent("card").showCards(show_data);
            }, this, call_data);
            card.runAction(cc.sequence(cc.rotateBy(0, 0, 180), cc.rotateBy(.2, 0, -90), run, cc.rotateBy(.2, 0, -90), cc.scaleBy(1, 1.2)));
          }
          common.audio.PlayEffect(this.cardsAudio);
          console.log(_mygolbal["default"].playerData.userId, _mygolbal["default"].playerData.masterUserId);
          _mygolbal["default"].playerData.userId === _mygolbal["default"].playerData.masterUserId && this.scheduleOnce(this.pushThreeCard.bind(this), .2);
        }.bind(this));
      },
      start: function start() {
        true;
        ddzData.gameStateNotify.addListener(this.gameStateHandler, this);
        window.$socket.on("_chooseCard", this._chooseCardNotify, this);
        window.$socket.on("_unchooseCard", this._unchooseCardNotify, this);
        window.$socket.on("pushcard_notify", this.pushCardNotify, this);
        window.$socket.on("canrob_notify", this.canrobNotify, this);
        window.$socket.on("selfPlayAHandNotify", this.selfPlayAHandNotify, this);
        window.$socket.on("rootPlayAHandNotify", this.rootPlayAHandNotify, this);
        window.$socket.on("gameEndNotify", this.gameEndNotify, this);
      },
      onDestroy: function onDestroy() {
        true;
        ddzData.gameStateNotify.removeListener(this.gameStateHandler, this);
        window.$socket.remove("_chooseCard", this);
        window.$socket.remove("_unchooseCard", this);
        window.$socket.remove("pushcard_notify", this);
        window.$socket.remove("canrob_notify", this);
        window.$socket.remove("selfPlayAHandNotify", this);
        window.$socket.remove("rootPlayAHandNotify", this);
        window.$socket.remove("gameEndNotify", this);
      },
      _chooseCardNotify: function _chooseCardNotify(cardData) {
        this.choose_card_data.push(cardData);
      },
      _unchooseCardNotify: function _unchooseCardNotify(cardId) {
        for (var i = 0; i < this.choose_card_data.length; i++) this.choose_card_data[i].index === cardId && this.choose_card_data.splice(i, 1);
      },
      gameStateHandler: function gameStateHandler(state) {
        if (state === ddzConstants.gameState.GAMESTART) {
          this.winNode.active = false;
          this.loseNode.active = false;
          this.cards_nods = [];
          this.bottom_card = [];
          this.push_card_tmp = [];
          this.cardsNode.removeAllChildren();
          this.bottom_card_pos_node.removeAllChildren();
        }
      },
      pushCardNotify: function pushCardNotify(data) {
        this.card_data = data;
        this.cur_index_card = data.length - 1;
        this.pushCard(data);
        this.scheduleOnce(this._runactive_pushcard.bind(this), .3);
        this.node.parent.emit("pushcard_other_event");
      },
      _runactive_pushcard: function _runactive_pushcard() {
        if (this.cur_index_card < 0) {
          console.log("pushcard end");
          isopen_sound && cc.audioEngine.stop(this.fapai_audioID);
          return;
        }
        var move_node = this.cards_nods[this.cards_nods.length - this.cur_index_card - 1];
        move_node.active = true;
        this.push_card_tmp.push(move_node);
        this.fapai_audioID = common.audio.PlayEffect(this.fapaiAudio);
        for (var i = 0; i < this.push_card_tmp.length - 1; i++) {
          var move_node = this.push_card_tmp[i];
          var newx = move_node.x - .4 * this.card_width;
          var action = cc.moveTo(.1, cc.v2(newx, -250));
          move_node.runAction(action);
        }
        this.cur_index_card--;
        this.scheduleOnce(this._runactive_pushcard.bind(this), .3);
      },
      canrobNotify: function canrobNotify(data) {
        console.log("onCanRobState", data);
        if (data === _mygolbal["default"].playerData.userId) {
          this.robUI.active = true;
          this.customSchedulerOnce();
        }
      },
      customSchedulerOnce: function customSchedulerOnce() {
        this.count = 10;
        var callback = function callback() {
          if (!this.robUI.active) return;
          if (!this.count) {
            this.robUI.active = false;
            this.unschedule(callback);
            window.$socket.emit("canrob_state_notify", {
              userId: _mygolbal["default"].playerData.userId,
              state: qian_state.buqiang
            });
            common.audio.PlayEffect(this.buqiangAudio);
          }
          this.timeLabel.string = --this.count;
        };
        this.schedule(callback, 1, 10);
      },
      selfPlayAHandNotify: function selfPlayAHandNotify() {
        this.clearOutZone(_mygolbal["default"].playerData.userId);
        this.playingUI_node.active = true;
      },
      rootPlayAHandNotify: function rootPlayAHandNotify(_ref) {
        var _this = this;
        var userId = _ref.userId, cards = _ref.cards;
        var gameScene_script = this.node.parent.getComponent("gameScene");
        var outCard_node = gameScene_script.getUserOutCardPosByAccount(userId);
        if (!outCard_node) return;
        outCard_node.removeAllChildren(true);
        var node_cards = [];
        for (var i = 0; i < cards.length; i++) {
          var card = cc.instantiate(this.card_prefab);
          card.getComponent("card").showCards(cards[i], userId);
          node_cards.push(card);
        }
        var delay = common.random(0, 10);
        var playerNode = gameScene_script.getUserNodeByAccount(userId);
        if (!playerNode) return;
        playerNode.schedulerOnce(function() {
          _this.appendOtherCardsToOutZone(outCard_node, node_cards, 0);
          playerNode.subtractCards(cards.length);
          window.$socket.emit("nextPlayerNotify", userId);
        }, delay);
      },
      gameEndNotify: function gameEndNotify(_ref2) {
        var isWin = _ref2.isWin, otherPlayerCards = _ref2.otherPlayerCards;
        console.log("\u6e38\u620f\u7ed3\u675f", {
          isWin: isWin,
          otherPlayerCards: otherPlayerCards
        });
        isWin ? this.winNode.active = true : this.loseNode.active = true;
        ddzData.gameState = ddzConstants.gameState.WAITREADY;
      },
      sortCard: function sortCard() {
        this.cards_nods.sort(function(x, y) {
          var a = x.getComponent("card").card_data;
          var b = y.getComponent("card").card_data;
          if (a.hasOwnProperty("value") && b.hasOwnProperty("value")) return b.value - a.value;
          if (a.hasOwnProperty("king") && !b.hasOwnProperty("king")) return -1;
          if (!a.hasOwnProperty("king") && b.hasOwnProperty("king")) return 1;
          if (a.hasOwnProperty("king") && b.hasOwnProperty("king")) return b.king - a.king;
        });
        var x = this.cards_nods[0].x;
        var timeout = 1e3;
        setTimeout(function() {
          console.log("sort x:" + x);
          for (var i = 0; i < this.cards_nods.length; i++) {
            var card = this.cards_nods[i];
            card.zIndex = i;
            card.x = x + .4 * card.width * i;
          }
        }.bind(this), timeout);
      },
      pushCard: function pushCard(data) {
        data && data.sort(function(a, b) {
          if (a.hasOwnProperty("value") && b.hasOwnProperty("value")) return b.value - a.value;
          if (a.hasOwnProperty("king") && !b.hasOwnProperty("king")) return -1;
          if (!a.hasOwnProperty("king") && b.hasOwnProperty("king")) return 1;
          if (a.hasOwnProperty("king") && b.hasOwnProperty("king")) return b.king - a.king;
        });
        this.cards_nods = [];
        for (var i = 0; i < 17; i++) {
          var card = cc.instantiate(this.card_prefab);
          card.scale = .8;
          card.parent = this.cardsNode;
          card.x = .4 * card.width * -.5 * -16 + .4 * card.width * 0;
          card.y = -250;
          card.active = false;
          card.getComponent("card").showCards(data[i], _mygolbal["default"].playerData.userId);
          this.cards_nods.push(card);
          this.card_width = card.width;
        }
        this.bottom_card = [];
        for (var i = 0; i < 3; i++) {
          var di_card = cc.instantiate(this.card_prefab);
          di_card.scale = .4;
          0 == i ? di_card.x = di_card.x - .5 * di_card.width : 2 == i && (di_card.x = di_card.x + .5 * di_card.width);
          di_card.parent = this.bottom_card_pos_node;
          this.bottom_card.push(di_card);
        }
      },
      schedulePushThreeCard: function schedulePushThreeCard() {
        for (var i = 0; i < this.cards_nods.length; i++) {
          var card = this.cards_nods[i];
          -230 == card.y && (card.y = -250);
        }
        this.updateCards();
      },
      pushThreeCard: function pushThreeCard() {
        var last_card_x = this.cards_nods[this.cards_nods.length - 1].x;
        for (var i = 0; i < this.bottom_card_data.length; i++) {
          var card = cc.instantiate(this.card_prefab);
          card.scale = .8;
          card.parent = this.cardsNode;
          card.x = last_card_x + (i + 1) * this.card_width * .4;
          card.y = -230;
          card.getComponent("card").showCards(this.bottom_card_data[i], _mygolbal["default"].playerData.userId);
          card.active = true;
          this.cards_nods.push(card);
        }
        this.sortCard();
        this.scheduleOnce(this.schedulePushThreeCard.bind(this), 2);
      },
      destoryCard: function destoryCard(userId, choose_card) {
        if (!choose_card.length) return;
        var destroy_card = [];
        for (var i = 0; i < choose_card.length; i++) for (var j = 0; j < this.cards_nods.length; j++) {
          var caardIndex = this.cards_nods[j].getComponent("card").caardIndex;
          if (caardIndex == choose_card[i].index) {
            this.cards_nods[j].removeFromParent(true);
            destroy_card.push(this.cards_nods[j]);
            this.cards_nods.splice(j, 1);
          }
        }
        this.appendCardsToOutZone(userId, destroy_card);
        this.updateCards();
      },
      clearOutZone: function clearOutZone(userId) {
        var gameScene_script = this.node.parent.getComponent("gameScene");
        var outCard_node = gameScene_script.getUserOutCardPosByAccount(userId);
        var children = outCard_node.children;
        for (var i = 0; i < children.length; i++) {
          var card = children[i];
          card.destroy();
        }
        outCard_node.removeAllChildren(true);
      },
      pushCardSort: function pushCardSort(cards) {
        if (1 == cards.length) return;
        cards.sort(function(x, y) {
          var a = x.getComponent("card").card_data;
          var b = y.getComponent("card").card_data;
          if (a.hasOwnProperty("value") && b.hasOwnProperty("value")) return b.value - a.value;
          if (a.hasOwnProperty("king") && !b.hasOwnProperty("king")) return -1;
          if (!a.hasOwnProperty("king") && b.hasOwnProperty("king")) return 1;
          if (a.hasOwnProperty("king") && b.hasOwnProperty("king")) return b.king - a.king;
        });
      },
      appendOtherCardsToOutZone: function appendOtherCardsToOutZone(outCard_node, cards, yoffset) {
        if (!cards.length) {
          common.audio.PlayEffect(this.buyaoAudio);
          return;
        }
        common.audio.PlayEffect(this.chupaiAudio);
        for (var i = 0; i < cards.length; i++) {
          var card = cards[i];
          outCard_node.addChild(card, 100 + i);
        }
        var zPoint = cards.length / 2;
        for (var i = 0; i < cards.length; i++) {
          var cardNode = outCard_node.getChildren()[i];
          var x = 30 * (i - zPoint);
          var y = cardNode.y + yoffset;
          cardNode.setScale(.5, .5);
          cardNode.setPosition(x, y);
        }
      },
      appendCardsToOutZone: function appendCardsToOutZone(userId, destroy_card) {
        if (!destroy_card.length) return;
        this.pushCardSort(destroy_card);
        var gameScene_script = this.node.parent.getComponent("gameScene");
        var outCard_node = gameScene_script.getUserOutCardPosByAccount(userId);
        this.appendOtherCardsToOutZone(outCard_node, destroy_card, 360);
      },
      updateCards: function updateCards() {
        var zeroPoint = this.cards_nods.length / 2;
        for (var i = 0; i < this.cards_nods.length; i++) {
          var cardNode = this.cards_nods[i];
          var x = (i - zeroPoint) * (.4 * this.card_width) + 50;
          cardNode.setPosition(x, -250);
        }
      },
      playPushCardSound: function playPushCardSound(card_name) {
        console.log("playPushCardSound:" + card_name);
        if ("" == card_name) return;
        switch (card_name) {
         case CardsValue.one.name:
          break;

         case CardsValue["double"].name:
          isopen_sound && cc.audioEngine.play(cc.url.raw("resources/sound/duizi.mp3"));
        }
      },
      onButtonClick: function onButtonClick(event, customData) {
        var _this2 = this;
        switch (customData) {
         case "btn_qiandz":
          console.log("btn_qiandz");
          window.$socket.emit("canrob_state_notify", {
            userId: _mygolbal["default"].playerData.userId,
            state: qian_state.qiang
          });
          this.robUI.active = false;
          common.audio.PlayEffect(this.jiaodizhuAudio);
          break;

         case "btn_buqiandz":
          console.log("btn_buqiandz");
          window.$socket.emit("canrob_state_notify", {
            userId: _mygolbal["default"].playerData.userId,
            state: qian_state.buqiang
          });
          this.robUI.active = false;
          common.audio.PlayEffect(this.buqiangAudio);
          break;

         case "nopushcard":
          window.$socket.emit("nextPlayerNotify", _mygolbal["default"].playerData.userId);
          common.audio.PlayEffect(this.buyaoAudio);
          this.choose_card_data = [];
          this.cards_nods.map(function(node) {
            return node.emit("reset_card_flag");
          });
          this.playingUI_node.active = false;
          break;

         case "pushcard":
          if (0 == this.choose_card_data.length) {
            this.tipsLabel.string = "\u8bf7\u9009\u62e9\u724c!";
            setTimeout(function() {
              this.tipsLabel.string = "";
            }.bind(this), 2e3);
          }
          window.$socket.emit("playAHandNotify", {
            userId: _mygolbal["default"].playerData.userId,
            cards: this.choose_card_data
          }, function(_ref3) {
            var state = _ref3.state;
            if (1 === state) {
              _this2.destoryCard(_mygolbal["default"].playerData.userId, _this2.choose_card_data);
              _this2.playingUI_node.active = false;
            } else _this2.cards_nods.map(function(node) {
              return node.emit("reset_card_flag");
            });
            _this2.choose_card_data = [];
          });
        }
      }
    });
    cc._RF.pop();
  }, {
    "../mygolbal.js": "mygolbal",
    ddzConstants: "ddzConstants",
    ddzData: "ddzData"
  } ],
  hallScene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9eee7bdCqVB/LXv3XqKAza9", "hallScene");
    "use strict";
    var _mygolbal = _interopRequireDefault(require("../mygolbal.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        nickname_label: cc.Label,
        headimage: cc.Sprite,
        gobal_count: cc.Label,
        creatroom_prefabs: cc.Prefab,
        joinroom_prefabs: cc.Prefab
      },
      onLoad: function onLoad() {
        this.nickname_label.string = _mygolbal["default"].playerData.userName;
        cc.director.preloadScene("gameScene");
      },
      start: function start() {},
      onButtonClick: function onButtonClick(event, customData) {
        switch (customData) {
         case "create_room":
          var creator_Room = cc.instantiate(this.creatroom_prefabs);
          creator_Room.parent = this.node;
          creator_Room.zIndex = 100;
          break;

         case "join_room":
          var join_Room = cc.instantiate(this.joinroom_prefabs);
          join_Room.parent = this.node;
          join_Room.zIndex = 100;
        }
      },
      onBtnJingdian: function onBtnJingdian() {
        var creator_Room = cc.instantiate(this.creatroom_prefabs);
        creator_Room.parent = this.node;
        creator_Room.zIndex = 100;
      },
      onBtnLaizi: function onBtnLaizi() {
        alert("\u6682\u672a\u5f00\u653e");
      }
    });
    cc._RF.pop();
  }, {
    "../mygolbal.js": "mygolbal"
  } ],
  joinRoom: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9b543i+qr1Px4nfSdBwSJcb", "joinRoom");
    "use strict";
    var _mygolbal = _interopRequireDefault(require("../../mygolbal.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        joinids: {
          type: cc.Label,
          default: []
        }
      },
      onLoad: function onLoad() {
        this.joinid = "";
        this.cur_input_count = -1;
      },
      start: function start() {},
      onButtonClick: function onButtonClick(event, customData) {
        if (1 === customData.length) {
          this.joinid += customData;
          this.cur_input_count += 1;
          this.joinids[this.cur_input_count].string = customData;
          if (this.joinid.length >= 6) {
            var room_para = {
              roomId: this.joinid
            };
            _mygolbal["default"].socket.request_jion(room_para, function(err, result) {
              if (err) console.log("err" + err); else {
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
          if (this.cur_input_count < 0) return;
          this.joinids[this.cur_input_count].string = "";
          this.cur_input_count -= 1;
          this.joinid = this.joinid.substring(0, this.joinid.length - 1);
          break;

         case "clear":
          for (var i = 0; i < 6; ++i) this.joinids[i].string = "";
          this.joinid = "";
          this.cur_input_count = -1;
          break;

         case "close":
          this.node.destroy();
        }
      }
    });
    cc._RF.pop();
  }, {
    "../../mygolbal.js": "mygolbal"
  } ],
  loadingLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b9626abTnFA4qlDHKSyHt+1", "loadingLayer");
    "use strict";
    var _mygolbal = _interopRequireDefault(require("../mygolbal.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var LoadingLayer = cc.Class({
      extends: cc.Component,
      properties: {},
      __preload: function __preload() {
        this.init();
      },
      start: function start() {},
      init: function init() {
        cc.view.resizeWithBrowserSize(true);
        cc.view.setResizeCallback(this.resizeCallback);
        cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this.resizeCallback);
        cc.game.addPersistRootNode(this.node);
        var _myglobal$playerData = _mygolbal["default"].playerData, userId = _myglobal$playerData.userId, roomId = _myglobal$playerData.roomId;
        console.log("userId = ", userId);
        console.log("roomId = ", roomId);
        userId ? roomId ? cc.director.loadScene("gameScene") : cc.director.loadScene("hallScene") : cc.director.loadScene("loginScene");
      },
      resizeCallback: function resizeCallback() {
        var canvas = cc.find("Canvas").getComponent(cc.Canvas);
        var t = cc.winSize.width / canvas.designResolution.width;
        var n = cc.winSize.height / canvas.designResolution.height;
        t < n ? (canvas.fitWidth = !0, canvas.fitHeight = !1) : n < t ? (canvas.fitWidth = !1, 
        canvas.fitHeight = !0) : (canvas.fitWidth = !1, canvas.fitHeight = !1);
      }
    });
    cc._RF.pop();
  }, {
    "../mygolbal.js": "mygolbal"
  } ],
  loginScene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b05a68gSOpBWr8ddvT03Jpj", "loginScene");
    "use strict";
    var _mygolbal = _interopRequireDefault(require("../mygolbal.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        wait_node: cc.Node
      },
      onLoad: function onLoad() {
        cc.director.preloadScene("hallScene");
      },
      start: function start() {},
      onButtonCilck: function onButtonCilck(event, customData) {
        switch (customData) {
         case "wx_login":
          console.log("wx_login request");
          _mygolbal["default"].socket.request_wxLogin({
            uniqueID: _mygolbal["default"].playerData.uniqueID,
            userName: _mygolbal["default"].playerData.userName,
            avatarUrl: _mygolbal["default"].playerData.avatarUrl
          }, function(err, result) {
            if (0 != err) {
              console.log("err:" + err);
              return;
            }
            console.log("login sucess" + JSON.stringify(result));
            _mygolbal["default"].playerData.gobal_count = result.goldcount;
            cc.director.loadScene("hallScene");
          }.bind(this));
          break;

         case "guest_login":
          this.wait_node.active = true;
          var count = Math.floor(1e5 * Math.random());
          var userName = "guest_".concat(count);
          _mygolbal["default"].playerData.userId = "".concat(count);
          _mygolbal["default"].playerData.userName = userName;
          cc.sys.localStorage.setItem("userData", JSON.stringify(_mygolbal["default"].playerData));
          cc.director.loadScene("hallScene");
        }
      }
    });
    cc._RF.pop();
  }, {
    "../mygolbal.js": "mygolbal"
  } ],
  mygolbal: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d9667atqdBHIb60A67blB9L", "mygolbal");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = void 0;
    var _socket_ctr = _interopRequireDefault(require("./data/socket_ctr.js"));
    var _player = _interopRequireDefault(require("./data/player.js"));
    var _event_lister = _interopRequireDefault(require("./util/event_lister.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var myglobal = {} || myglobal;
    myglobal.socket = (0, _socket_ctr["default"])();
    myglobal.playerData = (0, _player["default"])();
    myglobal.eventlister = (0, _event_lister["default"])({});
    var _default = myglobal;
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    "./data/player.js": "player",
    "./data/socket_ctr.js": "socket_ctr",
    "./util/event_lister.js": "event_lister"
  } ],
  player_node: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "aa64aMZgnFIfLx2Lmi+lbwV", "player_node");
    "use strict";
    var _mygolbal = _interopRequireDefault(require("../../mygolbal.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var ddzConstants = require("ddzConstants");
    var ddzData = require("ddzData");
    cc.Class({
      extends: cc.Component,
      properties: {
        headImage: cc.Sprite,
        nickname_label: cc.Label,
        globalcount_label: cc.Label,
        readyimage: cc.Node,
        card_node: cc.Node,
        card_prefab: cc.Prefab,
        clockimage: cc.Node,
        qiangdidzhu_node: cc.Node,
        time_label: cc.Label,
        robimage_sp: cc.SpriteFrame,
        robnoimage_sp: cc.SpriteFrame,
        robIconSp: cc.Sprite,
        robIcon_Sp: cc.Node,
        robnoIcon_Sp: cc.Node,
        masterIcon: cc.Node,
        jiaodizhu: {
          type: cc.AudioClip,
          default: null
        },
        buqiang: {
          type: cc.AudioClip,
          default: null
        }
      },
      getGameScene: function getGameScene() {
        return cc.find("Canvas").getComponent("gameScene");
      },
      onLoad: function onLoad() {
        var _this = this;
        this.readyimage.active = ddzData.gameState < ddzConstants.gameState.GAMESTART;
        this.masterIcon.active = false;
        this.node.on("player_ready_notify", function() {
          _this.readyimage.active = true;
        });
        this.node.on("gamestart_event", function() {
          _this.readyimage.active = false;
        });
        this.node.on("push_card_event", function(event) {
          if (0 === this.seat_index) return;
          this.pushCard();
        }.bind(this));
        this.node.on("playernode_changemaster_event", function(userId) {
          this.robIcon_Sp.active = false;
          this.robnoIcon_Sp.active = false;
          if (userId !== this.userId) return;
          this.masterIcon.active = true;
          if (userId === _mygolbal["default"].playerData.userId) return;
          var card = this.cardlist_node[0];
          card && (card.getChildByName("count").getComponent(cc.Label).string = 20);
        }.bind(this));
      },
      start: function start() {
        true;
        ddzData.gameStateNotify.addListener(this.gameStateHandler, this);
        window.$socket.on("canrob_notify", this.canrobNotify, this);
        window.$socket.on("gameEndNotify", this.gameEndNotify, this);
      },
      onDestroy: function onDestroy() {
        true;
        ddzData.gameStateNotify.removeListener(this.gameStateHandler, this);
        window.$socket.remove("canrob_notify", this);
        window.$socket.remove("gameEndNotify", this);
      },
      init_data: function init_data(data, index) {
        this.userId = data.userId;
        this.nickname_label.string = data.userName;
        this.globalcount_label.string = data.goldcount;
        this.cardlist_node = [];
        this.seat_index = index;
        var head_image_path = "UI/headimage/" + data.avatarUrl;
        cc.loader.loadRes(head_image_path, cc.SpriteFrame, function(err, spriteFrame) {
          if (err) {
            console.log(err.message || err);
            return;
          }
          this.headImage.spriteFrame = spriteFrame;
        }.bind(this));
        if (!index) {
          this.readyimage.active = false;
          return;
        }
        1 === index && (this.card_node.x = -this.card_node.x);
      },
      gameStateHandler: function gameStateHandler(state) {
        if (state === ddzConstants.gameState.GAMESTART) {
          this.cardlist_node = [];
          this.card_node.removeAllChildren();
          this.clearOutZone();
          this.masterIcon.active = false;
        }
      },
      canrobNotify: function canrobNotify(landlordId) {
        var _this2 = this;
        if (landlordId === this.userId && landlordId !== _mygolbal["default"].playerData.userId) {
          this.robIcon_Sp.active = false;
          this.robnoIcon_Sp.active = false;
          var isQdz = common.random(0, 10) > 5;
          this.schedulerOnce(function() {
            isQdz && (_this2.robIcon_Sp.active = true);
            !isQdz && (_this2.robnoIcon_Sp.active = true);
            window.$socket.emit("canrob_state_notify", {
              userId: _this2.userId,
              state: isQdz ? qian_state.qiang : qian_state.buqiang
            });
            common.audio.PlayEffect(isQdz ? _this2.jiaodizhu : _this2.buqiang);
          });
        }
      },
      schedulerOnce: function schedulerOnce(fn) {
        var seconds = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : common.random(0, 10);
        this.count = 10;
        this.time_label.string = this.count;
        this.qiangdidzhu_node.active = true;
        var callback = function callback() {
          if (!this.count || 10 - seconds === this.count) {
            this.qiangdidzhu_node.active = false;
            this.unschedule(callback);
            fn && fn();
          }
          this.time_label.string = --this.count;
        };
        this.schedule(callback, 1, seconds);
      },
      pushCard: function pushCard() {
        this.card_node.active = true;
        var card = cc.instantiate(this.card_prefab);
        card.scale = .6;
        card.parent = this.card_node;
        this.cardlist_node.push(card);
        var count = 0;
        card.getChildByName("count").active = true;
        var callback = function callback() {
          17 === count && this.unschedule(callback);
          card.getChildByName("count").getComponent(cc.Label).string = count;
          count++;
        };
        this.schedule(callback, .1, 17);
      },
      subtractCards: function subtractCards() {
        var len = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
        if (!this.cardlist_node.length) return;
        var countLabel = this.cardlist_node[0].getChildByName("count").getComponent(cc.Label);
        countLabel.string -= len;
        !Number(countLabel.string) && this.card_node.removeAllChildren();
      },
      gameEndNotify: function gameEndNotify(_ref) {
        var otherPlayerCards = _ref.otherPlayerCards;
        var cardList = otherPlayerCards[this.userId];
        var cards = this.cardlist_node;
        if (!cardList || this.userId === _mygolbal["default"].playerData.userId) return;
        cardList.sort(function(a, b) {
          return b.val - a.val;
        });
        for (var i = 0; i < cardList.length; i++) {
          var card = cards[i];
          if (card) card.getChildByName("count").getComponent(cc.Label).string = ""; else {
            card = cc.instantiate(this.card_prefab);
            card.scale = .6;
            card.parent = this.card_node;
            cards.push(card);
          }
          card.getComponent("card").showCards(cardList[i], this.userId);
        }
      },
      clearOutZone: function clearOutZone() {
        var gameScene_script = this.getGameScene();
        var outCard_node = gameScene_script.getUserOutCardPosByAccount(this.userId);
        var children = outCard_node.children;
        for (var i = 0; i < children.length; i++) {
          var card = children[i];
          card.destroy();
        }
        outCard_node.removeAllChildren(true);
      }
    });
    cc._RF.pop();
  }, {
    "../../mygolbal.js": "mygolbal",
    ddzConstants: "ddzConstants",
    ddzData: "ddzData"
  } ],
  player: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ec2a0fYPv1ASr8YTOKp3Np/", "player");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = void 0;
    var getRandomStr = function getRandomStr(count) {
      var str = "";
      for (var i = 0; i < count; i++) str += Math.floor(10 * Math.random());
      return str;
    };
    var playerData = function playerData() {
      var userData = JSON.parse(cc.sys.localStorage.getItem("userData"));
      var _ref = [ getRandomStr(5), getRandomStr(5) ], rootId1 = _ref[0], rootId2 = _ref[1];
      var that = userData || {
        userId: "",
        userName: "",
        roomId: "",
        seatindex: 0,
        avatarUrl: "avatar_1",
        goldcount: 1e4,
        rootList: [ {
          seatindex: 1,
          userId: rootId1,
          userName: "guest_".concat(rootId1),
          avatarUrl: "avatar_2",
          goldcount: getRandomStr(4)
        }, {
          seatindex: 2,
          userId: rootId2,
          userName: "guest_".concat(rootId2),
          avatarUrl: "avatar_3",
          goldcount: getRandomStr(4)
        } ],
        masterUserId: ""
      };
      that.gobal_count = cc.sys.localStorage.getItem("user_count");
      if (!userData) {
        console.log(userData);
        cc.sys.localStorage.setItem("userData", JSON.stringify(that));
      }
      return that;
    };
    var _default = playerData;
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {} ],
  socket_ctr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9ce03TvsElJsaLzLDlseCff", "socket_ctr");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = void 0;
    var _event_lister = _interopRequireDefault(require("../util/event_lister.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    window.$socket = (0, _event_lister["default"])({});
    var socketCtr = function socketCtr() {
      var that = {};
      var respone_map = {};
      var call_index = 0;
      var _socket = null;
      var _sendmsg = function _sendmsg(cmdtype, req, callindex) {
        _socket.emit("notify", {
          cmd: cmdtype,
          data: req,
          callindex: callindex
        });
      };
      var _request = function _request(cmdtype, req, callback) {
        console.log("send cmd:" + cmdtype + "  " + JSON.stringify(req));
        call_index++;
        respone_map[call_index] = callback;
        _sendmsg(cmdtype, req, call_index);
      };
      that.initSocket = function() {
        var opts = {
          reconnection: false,
          "force new connection": true,
          transports: [ "websocket", "polling" ]
        };
        _socket = window.io.connect(defines.serverUrl, opts);
        _socket.on("connection", function() {
          console.log("connect server success!!");
        });
        _socket.on("notify", function(res) {
          console.log("on notify cmd:" + JSON.stringify(res));
          if (respone_map.hasOwnProperty(res.callBackIndex)) {
            var callback = respone_map[res.callBackIndex];
            callback && callback(res.result, res.data);
          } else {
            var type = res.type;
            $socket.emit(type, res.data);
          }
        });
      };
      that.request_wxLogin = function(req, callback) {
        _request("wxlogin", req, callback);
      };
      that.request_creatroom = function(req, callback) {
        _request("createroom_req", req, callback);
      };
      that.request_jion = function(req, callback) {
        _request("joinroom_req", req, callback);
      };
      that.request_enter_room = function(req, callback) {
        _request("enterroom_req", req, callback);
      };
      that.request_buchu_card = function(req, callback) {
        _request("chu_bu_card_req", req, callback);
      };
      that.request_chu_card = function(req, callback) {
        _request("chu_card_req", req, callback);
      };
      that.onPlayerJoinRoom = function(callback) {
        $socket.on("player_joinroom_notify", callback);
      };
      that.onPlayerReady = function(callback) {
        $socket.on("player_ready_notify", callback);
      };
      that.onGameStart = function(callback) {
        callback && $socket.on("gameStart_notify", callback);
      };
      that.onChangeHouseManage = function(callback) {
        callback && $socket.on("changehousemanage_notify", callback);
      };
      that.requestReady = function() {
        _sendmsg("player_ready_notify", {}, null);
      };
      that.requestStart = function(callback) {
        _request("player_start_notify", {}, callback);
      };
      that.requestRobState = function(state) {
        _sendmsg("player_rob_notify", state, null);
      };
      that.onPushCards = function(callback) {
        callback && $socket.on("pushcard_notify", callback);
      };
      that.onCanRobState = function(callback) {
        callback && $socket.on("canrob_notify", callback);
      };
      that.onRobState = function(callback) {
        callback && $socket.on("canrob_state_notify", callback);
      };
      that.onChangeMaster = function(callback) {
        callback && $socket.on("change_master_notify", callback);
      };
      that.onShowBottomCard = function(callback) {
        callback && $socket.on("change_showcard_notify", callback);
      };
      that.onCanChuCard = function(callback) {
        callback && $socket.on("can_chu_card_notify", callback);
      };
      that.onRoomChangeState = function(callback) {
        callback && $socket.on("room_state_notify", callback);
      };
      that.onOtherPlayerChuCard = function(callback) {
        callback && $socket.on("other_chucard_notify", callback);
      };
      return that;
    };
    var _default = socketCtr;
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    "../util/event_lister.js": "event_lister"
  } ],
  start: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "839bdzLUEZCRZq4d0xtB8h0", "start");
    "use strict";
    var _mygolbal = _interopRequireDefault(require("./mygolbal.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var common = require("common");
    var ddzData = require("ddzData");
    var ddzServers = require("ddzServers");
    var gameRule = require("gameRule");
    var start = cc.Class({
      extends: cc.Component,
      __preload: function __preload() {
        window.myglobal = window.myglobal || _mygolbal["default"];
        window.common = window.common || common;
        window.G = window.G || {
          gameRule: new gameRule()
        };
        true, ddzData.initData();
        true, ddzServers.initServer();
      }
    });
    module["extends"] = start;
    cc._RF.pop();
  }, {
    "./mygolbal.js": "mygolbal",
    common: "common",
    ddzData: "ddzData",
    ddzServers: "ddzServers",
    gameRule: "gameRule"
  } ],
  "use_v2.0.x_cc.Toggle_event": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "79bf6BUP3xAD4JfzPWxDtAX", "use_v2.0.x_cc.Toggle_event");
    "use strict";
    cc.Toggle && (cc.Toggle._triggerEventInScript_check = true);
    cc._RF.pop();
  }, {} ],
  waitnode: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "17318Pv1MxELb6d+o/SHo0s", "waitnode");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        loadimage_target: cc.Node,
        _isShow: false,
        lblContent: cc.Label
      },
      start: function start() {
        this.node.active = this._isShow;
      },
      update: function update(dt) {
        this.loadimage_target.rotation = this.loadimage_target.rotation - 45 * dt;
      },
      show: function show(content) {
        this._isShow = true;
        this.node && (this.node.active = this._isShow);
        if (this.lblContent) {
          null == content && (content = "");
          this.lblContent.string = content;
        }
      },
      hide: function hide() {
        this._isShow = false;
        this.node && (this.node.active = this._isShow);
      }
    });
    cc._RF.pop();
  }, {} ]
}, {}, [ "use_v2.0.x_cc.Toggle_event", "DataNotify", "api", "audioManager", "common", "loadingLayer", "ddzConstants", "ddzData", "player", "socket_ctr", "gameScene", "gamebeforeUI", "gameingUI", "card", "player_node", "hallScene", "creatRoom", "joinRoom", "loginScene", "mygolbal", "start", "event_lister", "waitnode", "AILogic", "carder", "ddzServers", "gameRule" ]);
//# sourceMappingURL=project.dev.js.map
