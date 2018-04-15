/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-15 04:44:24
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-04-15 04:59:56
*/

'use strict';

StructureTower.prototype.tick = function() {
  Log.info("Ticking Tower", this)
  if(this.hasNearbyHostle()) {
    this.defend()
  } else {
    this.repair()
  }
}

StructureTower.prototype.defend = function() {
  Log.error("Need to implement", this)
}

StructureTower.prototype.repair = function() {
  if(this.hasTarget('repair')) {
    let target = this.getTarget('repair')
    this.repair(target)
    if(target.hits >= target.hitsMax) this.clearTarget('repair')
  } else if (this.hasTarget('heal')) {
    let target = this.getTarget('heal')
    this.heal(target)
    if(target.hits >= targets.hitsMax) this.clearTarget('heal')
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
StructureTower.prototype.hasNearbyHostle = function() {
  return false
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
