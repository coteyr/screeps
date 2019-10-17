/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-15 04:44:24
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-05-19 23:13:10
*/

'use strict';

StructureTower.prototype.tick = function() {
  if(this.hasDefenders()) {
    this.doHeal()
  } else if(this.hasNearbyHostle()) {
    this.defend()
  } else {
    this.doRepair()
  }
}

StructureTower.prototype.defend = function() {
  let target = Targeting.findNearestHostal(this.room, this.pos)
  if(target) {
    this.attack(target)
  }
}
StructureTower.prototype.doHeal = function() {
  if (this.hasTarget('heal')) {
    let target = this.getTarget('heal')
    this.heal(target)
    if(target.hits >= target.hitsMax) this.clearTarget('heal')
  } else {
    this.setTarget('heal', Targeting.findHealTarget(this.room, this.pos))
    if(this.hasTarget('heal')) this.heal(this.getTarget('heal'))
  }
}
StructureTower.prototype.doRepair = function() {
  if(this.hasTarget('repair')) {
    let target = this.getTarget('repair')
    this.repair(target)
    if(target.hits >= target.hitsMax) this.clearTarget('repair')
    if((target.structureType === STRUCTURE_RAMPART && target.hits > 1000) || (target.structureType === STRUCTURE_WALL && target.hits > 1000)) this.clearTarget('repair')
  } else if (this.hasTarget('heal')) {
    let target = this.getTarget('heal')
    this.heal(target)
    if(target.hits >= target.hitsMax) this.clearTarget('heal')
  } else {
    this.findRepairTarget()
  }
}
StructureTower.prototype.findRepairTarget = function() {
  let target = Targeting.findRepairTarget(this.room, this.pos)
  if(target && target.structureType) {
    this.setTarget('repair', target)
  } else if (target) {
    this.setTarget('heal', target)
  }
}
StructureTower.prototype.hasDefenders = function() {
  return Finder.defender(this.room).length > 0
}
StructureTower.prototype.hasNearbyHostle = function() {
  return Finder.hostals(this.room).length > 0 && Finder.defender(this.room).length < 1
}
StructureTower.prototype.clearTarget = function(key = 'target') {
  delete this.memory["target-" + key]
  return true
}
StructureTower.prototype.hasTarget = function(key) {
  return !_.isUndefined(this.memory["target-" + key]) && !_.isNull(this.memory["target-" + key]) && !_.isNull(Game.getObjectById(this.memory["target-" + key])) && Game.getObjectById(this.memory["target-" + key]).room.name === this.room.name
}
StructureTower.prototype.getTarget = function(key) {
  return Game.getObjectById(this.memory["target-" + key])
}
StructureTower.prototype.targetIs = function(key, target) {
  return this.memory["target-" + key] === target.id
}
StructureTower.prototype.setTarget = function(key, target) {
  if(_.isNull(target) || _.isUndefined(target)) return false
  if(_.isUndefined(target.id)) return false
  this.memory["target-" + key] = target.id
  return true
}


StructureTower.prototype.setupMemory = function() {
  if(!Memory.memory_structures) Memory.memory_structures = {}
  if(!Memory.memory_structures[this.id]) {
    Memory.memory_structures[this.id] = {}
    this.memory = Memory.memory_structures[this.id]
  } else {
    this.memory = Memory.memory_structures[this.id]
  }
}


//StructureTower.prototype.memory = undefined;
