/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-08-09 16:50:51
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-26 16:48:06
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
    if(parts.move) auto_move = false // can't auto move and specify moves
    var weight = this.getWeight(parts)
    var result = []
    if(auto_move) parts.move = this.getBaseMoves(weight, local)

    if(auto_move && pad) {
      var current_cost = (parts.carry * 50) + (parts.claim * 600) + (parts.work * 100) + (parts.ranged * 150) + (parts.heal * 250) + (parts.attack * 80) + (parts.move * 50)
      var leftOver = energy - current_cost
      if(local) {
        var spots = Math.floor(leftOver / 70)
        parts.move += spots
        parts.tough += spots * 2
      } else {
        var spots = Math.floor(leftOver / 60)
        parts.move += spots
        parts.tough += spots
      }
    } else if(pad) {
      var spots = Math.floor(leftOver / 10)
      parts.tough = spots
    }
    result = this.buildPartsArray(parts)
    return result
  },
  buildPartsArray: function(parts) {
    var result = []
    result = result.concat(this.addParts(TOUGH, parts.tough))
    result = result.concat(this.addParts(MOVE, parts.move))
    result = result.concat(this.addParts(CARRY, parts.carry))
    result = result.concat(this.addParts(CLAIM, parts.claim))
    result = result.concat(this.addParts(WORK, parts.work))
    result = result.concat(this.addParts(RANGED_ATTACK, parts.ranged))
    result = result.concat(this.addParts(HEAL, parts.heal))
    result = result.concat(this.addParts(ATTACK, parts.attack))
    result = result.slice(-50) // last 50
    return result
  },
  getBaseMoves: function(weight, local) {
    var moves = weight
    if(local) moves = Math.ceil(weight / 2)
    return moves
  },
  getWeight: function(parts) {
    return parts.tough + parts.carry + parts.claim + parts.work + parts.ranged + parts.heal + parts.attack
  },
  addParts: function(part, count) {
    var array = []
    for (var i = 0; i < Number(count); i++) {
      array.push(part)
    }
    return array
  },
  getCost: function(body) {
    var cost = 0
    body.forEach(function(part){
      if(part === MOVE) cost += 50
      if(part === WORK) cost += 100
      if(part === CARRY) cost += 50
      if(part === ATTACK) cost += 80
      if(part === RANGED_ATTACK) cost += 150
      if(part === HEAL) cost += 250
      if(part === CLAIM) cost += 600
      if(part === TOUGH) cost += 10
    })
    return cost
  },
  getCount: function(body, part) {
    var count = 0
    body.forEach(function(b){
      if(b === part) count += 1
    })
    return count
  }
}

module.exports = BodyBuilder
