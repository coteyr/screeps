/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-22 21:51:51
*/

'use strict';


Creep.prototype.setupExoSapperMemory = function() {
  this.chooseExoTarget('sapper')
}
Creep.prototype.assignTravelExoSapperTasks = Creep.prototype.assignTravelExoHarvesterTasks
Creep.prototype.assignHomeExoSapperTasks = Creep.prototype.assignHomeExoHarvesterTasks
Creep.prototype.assignRemoteExoSapperTasks = function () {
  this.figureDamage()
  if(!this.isFull() && (Finder.hasHostals(this.room.name) || this.hits < this.hitsMax)) {
    this.setMode('sap')
  } else {
    this.assignRemoteExoHarvesterTasks()
  }
}

Creep.prototype.doSap = function() {
  var target = Targeting.nearestHostalCreep(this.pos)
  var tank = Targeting.nearestTankCreep(target.pos) || this

  var range = this.pos.getRangeTo(target)
  var rangeToTank = this.pos.getRangeTo(tank)

  if(range <= 1) {
      this.say('Flee', true)
      this.flee()
  } else{
    if(this.id == tank.id) { // I am the tank
      if(range > 2 && !this.needsHealing()) {
        this.say("Hold Still", true)
        console.log(target.id)
        this.moveTo(target)
      }
      if(this.needsHealing() && range <= 5) this.flee(target)
    } else { // I am not the tank
      console.log('not the tank')
      this.moveTo(tank)
    }
  }

  this.rangedAttack(target)
  this.heal(this)
}

Creep.prototype.flee = function(target) {
  if (this.pos.x > 10 && this.pos.y > 10 && this.pos.x < 40 && this.pos.y < 40) {
    var dir = this.pos.getDirectionTo(target)
    var go = dir + 4
    if (go > 8) go = go - 8
    this.move(go)
  } else {
    this.moveCloseTo(25, 25, 5)
  }
  this.say("Yarrp", true)
}

Creep.prototype.needsHealing = function() {
  if(this.hasPart('tough')) {

  } else {
    if(this.hits < (this.hitsMax * 0.75) || this.memory.heal) {
      this.memory.heal = true
      if(this.hits >= this.hitsMax) delete this.memory.heal
      return(true)
    }
  }
  return false

}
Creep.prototype.figureDamage = function() {
  if(!this.memory.old_hits) this.memory.old_hits = this.hits
  if(this.hits < this.memory.old_hits) {
    this.memory.took_damage = true
  } else {
    this.memory.took_damage = false
  }
  this.memory.old_hits = this.hits
}

Creep.prototype.tookDamage = function() {
  return this.memory.took_damage
}
