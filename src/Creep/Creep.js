/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-12 03:32:39
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-07-03 01:29:11
*/

'use strict';
Creep.prototype.task = function() {
  return this.memory.task
}
Creep.prototype.tick = function() {
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
  }else if(this.task() === 'linker') {
    this.linkerTick()
  } else if(this.task() === 'extractor') {
    this.extractorTick()
  } else if(this.task() == 'defender') {
    this.defenderTick()
  } else if(this.task() == 'attacker') {
    this.attackerTick()
  } else {
    Log.error("I have no code to run", this)
    Visualizer.circle(this, Config.colors.red)
  }
}
Creep.prototype.work = function(method, target, range, options = []) {
  if(!target) return false
  if(!this.pos.inRangeTo(target, range)){
    this.travelTo(target, {maxRooms: 1})
    Visualizer.circle(this, Config.colors.gray)
    return ERR_NOT_IN_RANGE

  }
  let value = method.apply(this, _.flatten([target, options]))
  if(value === ERR_NOT_IN_RANGE) {
    this.travelTo(target, {maxRooms: 1})
    Visualizer.circle(this, Config.colors.gray)
  }
  if(value === OK) Visualizer.circle(this, Config.colors.green)
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
  if(!target) return false
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
  return _.sum(this.carry) >= this.carryCapacity
}
Creep.prototype.grab = function(target) {
  if(!target) return false
  if(target.structureType) {
    this.work(this.withdraw, target, 1, [RESOURCE_ENERGY])
  } else {
    this.work(this.pickup, target, 1)
  }
}
Creep.prototype.originalMove = Creep.prototype.move
Creep.prototype.move = function(direction) {
  let things = this.pos.look()
  _.each(things, t => {
    if(t.type === 'structure' && t.structure.structureType === STRUCTURE_ROAD) this.repair(t.structure)
    // if(this.pos.x > this.room.memory.right || this.pos.x < this.room.memory.left || this.pos.y > this.room.memory.bottom || this.pos.y < this.room.memory.top) return false
    // if(Finder.findConstructionSites(this.room.name).length < Config.maxConstructionSites && (t.type === 'terrain' && t.terrain === 'plain' || t.type === 'terrain' && t.terrain === 'swamp')) this.room.createConstructionSite(this.pos, STRUCTURE_ROAD)
  })
  return this.originalMove(direction)
}
