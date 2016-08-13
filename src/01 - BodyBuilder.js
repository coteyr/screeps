/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-08-09 16:50:51
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-10 00:40:16
*/

'use strict';

var BodyBuilder = {
  buildBody: function(parts, energy, auto_move, pad, local) {
    if(!parts.tough) parts.tough = 0
    if(!parts.move) parts.move = 0
    if(!parts.carry) parts.carry = 0
    if(!parts.claim) parts.claim = 0
    if(!parts.work) parts.work = 0
    if(!parts.ranged) parts.ranged = 0
    if(!parts.heal) parts.heal = 0
    if(!parts.attack) parts.attack = 0

    var result = []

    var weight = parts.tough + parts.carry + parts.claim + parts.work + parts.ranged + parts.heal + parts.attack
    if(auto_move) {
      if(local) {
        parts.move = Math.floor(weight / 2)
      } else {
        parts.move = weight
      }
    }

    var cost = (parts.carry * 50) + (parts.claim * 600) + (parts.work * 100) + (parts.ranged * 150) + (parts.heal * 250) + (parts.attack * 80) + (parts.move * 50)

    if(pad) {
      var space = energy - cost
      parts.tough = Math.floor(space / 10)
    }


    for (var i = 0; i < Number(parts.tough); i++) {
      if(cost < energy && _.size(result) < (50 - (parts.carry + parts.claim + parts.work + parts.ranged + parts.heal + parts.attack + parts.move))) {
        result.push(TOUGH)
        cost += 10
      }
    }

    for (var i = 0; i < Number(parts.move); i++) {
      result.push(MOVE)
    }

    for (var i = 0; i < Number(parts.carry); i++) {
      result.push(CARRY)
    }

    for (var i = 0; i < Number(parts.claim); i++) {
      result.push(CLAIM)
    }

    for (var i = 0; i < Number(parts.work); i++) {
      result.push(WORK)
    }

    for (var i = 0; i < Number(parts.ranged); i++) {
      result.push(RANGED_ATTACK)
    }

    for (var i = 0; i < Number(parts.heal); i++) {
      result.push(HEAL)
    }

    for (var i = 0; i < Number(parts.attack); i++) {
      result.push(ATTACK)
    }

    return result
  }
}

module.exports = BodyBuilder;
