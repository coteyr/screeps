/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-12 03:32:39
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-05-02 10:38:49
*/

'use strict';
Creep.prototype.task = function() {
  return this.memory.task
}
Creep.prototype.tick = function() {
  // Log.info("Ticking Creep", this)
  if(this.task() === 'miner') {
    this.minerTick();
  } else if(this.task() === 'upgrader') {
    this.upgradeTick();
  } else if(this.task() === 'hauler') {
    this.haulerTick();
  } else if(this.task() === 'recovery') {
    this.recoveryTick();
  } else if(this.task() === 'builder') {
    this.builderTick();
  } else if(this.task() === 'waller') {
    this.wallerTick();
  }else if(this.task() === 'claimer') {
    this.claimerTick()
  } else {
    Log.error("I have no code to run", this)
  }
}
Creep.prototype.work = function(method, target, range, options = []) {
  if(!target) return false
  let value = method.apply(this, _.flatten([target, options]))
  if(value === ERR_NOT_IN_RANGE) {
    this.moveTo(target, {maxRooms: 1})
  }
  return value
}
Creep.prototype.clearTarget = function(key = 'target') {
  delete this.memory["target-" + key]
  return true
}
Creep.prototype.hasTarget = function(key) {
  return !_.isUndefined(this.memory["target-" + key]) && !_.isNull(this.memory["target-" + key]) && !_.isNull(Game.getObjectById(this.memory["target-" + key])) && Game.getObjectById(this.memory["target-" + key]).room.name === this.room.name
}
Creep.prototype.getTarget = function(key) {
  return Game.getObjectById(this.memory["target-" + key])
}
Creep.prototype.targetIs = function(key, target) {
  return this.memory["target-" + key] === target.id
}
Creep.prototype.setTarget = function(key, target) {
  if(_.isNull(target) || _.isUndefined(target)) return false
  if(_.isUndefined(target.id)) return false
  this.memory["target-" + key] = target.id
  return true
}
Creep.prototype.hasEnergy = function() {
  return this.carry[RESOURCE_ENERGY] > 0
}
Creep.prototype.isFull = function() {
  return this.carry[RESOURCE_ENERGY] >= this.carryCapacity
}
Creep.prototype.grab = function(target) {
  if(target.structureType) {
    this.work(this.withdraw, target, 1, [RESOURCE_ENERGY])
  } else {
    Log.info(this.work(this.pickup, target, 1))
  }
}
