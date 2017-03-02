/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:14:00
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-27 19:01:44
*/

'use strict';

Creep.prototype.partCount = function(part) {
  return _.filter(this.body, {type: part}).length
}
Creep.prototype.taskIs = function(task) {
  return (this.memory.task === task)
}
Creep.prototype.setTask = function(task) {
  this.memory.task = task
  Log.debug(task)
  return true
}
Creep.prototype.tick = function() {
  if(this.spawning) return false
  if(this.taskIs('mine')) {
    _.merge(Creep.prototype, MinerCreep.prototype)
  } else if(this.taskIs('upgrade')) {
    _.merge(Creep.prototype, UpgraderCreep.prototype)
  } else if(this.taskIs('build')) {
    _.merge(Creep.prototype, BuilderCreep.prototype)
  } else if(this.taskIs('haul')) {
    _.merge(Creep.prototype, HaulingCreep.prototype)
  } else if(this.taskIs('repair')) {
    _.merge(Creep.prototype, RepairCreep.prototype)
  } else if(this.taskIs('claim')) {
    _.merge(Creep.prototype, ClaimCreep.prototype)
  } else if(this.taskIs('remote_build')) {
    _.merge(Creep.prototype, RemoteBuildCreep.prototype)
  } else {
    _.merge(Creep.prototype, NullCreep.prototype)
  }
  this.superTick()
}
Creep.prototype.targetIs = function(id) {
  return this.memory.target === id
}
Creep.prototype.setTarget = function(target) {
  if(_.isNull(target) || _.isUndefined(target)) return false
  if(_.isUndefined(target.id)) return false
  this.memory.target = target.id
  return true
}
Creep.prototype.hasTarget = function() {
  return !_.isUndefined(this.memory.target) && !_.isNull(this.memory.target) && !_.isNull(Game.getObjectById(this.memory.target))
}
Creep.prototype.needsTarget = function() {
  return !this.hasTarget()
}
Creep.prototype.target = function() {
  return Game.getObjectById(this.memory.target)
}
Creep.prototype.isEmpty = function() {
  return _.sum(this.carry) === 0
}
Creep.prototype.isFull = function() {
  return _.sum(this.carry) >= this.carryCapacity
}
Creep.prototype.hasSome = function() {
  return !this.isEmpty()
}
Creep.prototype.clearTarget = function() {
  delete this.memory.target
  return true
}
Creep.prototype.validateTarget = function(validTargets) {
  let valid = false
  _.each(validTargets, t => {
    if(t.structureType && t.structureType === t) valid = true
    if(t.resourceType && t.resourceType === t) valid = true
  })
  if(!valid) this.clearTarget()
  return valid
}

Creep.prototype.originalMove = Creep.prototype.move
Creep.prototype.move = function(direction) {
  let things = this.pos.look()
  _.each(things, t => {
    if(t.type === 'structure' && t.structure.structureType === STRUCTURE_ROAD) this.repair(t.structure)
    if(this.pos.x > this.room.memory.right || this.pos.x < this.room.memory.left || this.pos.y > this.room.memory.bottom || this.pos.y < this.room.memory.top) return false
    if(Finder.findConstructionSites(this.room.name).length < Config.maxConstructionSites && (t.type === 'terrain' && t.terrain === 'plain' || t.type === 'terrain' && t.terrain === 'swamp')) this.room.createConstructionSite(this.pos, STRUCTURE_ROAD)
  })
  this.originalMove(direction)
}

Creep.prototype.goTo = function(pos) {
  let opts = {costCallback: function(roomName, costMatrix) {
    for(let x = 0; x++; x < 50) {
      costMatrix.set(x, 0, 256)
      costMatrix.set(x, 49, 256)
      costMatrix.set(0, x, 256)
      costMatrix.set(49, x, 256)
    }
    /*costMatrix.set(21, 18, 256)
    costMatrix.set(21, 20, 256)*/
    //_.each(Finder.findCreepsWithTask(pos.room.name, 'mine'), c => {
    //  costMatrix.set(c.pos, 255)
    //})
    },
  reusePath: 5,
  ignoreCreeps: (Game.time % 5 === 0),
  visualizePathStyle: {opacity: 0.75, stroke: Config.colors.blue}
  }
  // Log.info(JSON.stringify(arguments))
  this.room.visual.circle(pos, { fill: Config.colors.blue,  opacity: 1.0, radius: 0.25} )
  this.moveTo(pos, opts)
}
