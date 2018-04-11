/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:14:00
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-26 14:41:13
*/

'use strict';
Creep.prototype.type = 'creep'
Creep.prototype.chooseFillStatus = function() {
  if(this.isEmpty()) {
    this.memory.status = 'fill'
    this.clearTarget('drop')
  }
  if(this.isFull()) {
    this.memory.status = 'empty'
    this.clearTarget()
  }

}
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
Creep.prototype.tick = function(kernel) {
  kernel.register(this, 'unknown')
}
Creep.prototype.targetIs = function(id, key = 'target') {
  return this.memory["target-" + key] === id
}
Creep.prototype.setTarget = function(target, key = 'target') {
  if(_.isNull(target) || _.isUndefined(target)) return false
  if(_.isUndefined(target.id)) return false
  this.memory["target-" + key] = target.id
  return true
}
Creep.prototype.hasTarget = function(key = 'target') {
  return !_.isUndefined(this.memory["target-" + key]) && !_.isNull(this.memory["target-" + key]) && !_.isNull(Game.getObjectById(this.memory["target-" + key])) && Game.getObjectById(this.memory["target-" + key]).room.name === this.room.name
}
Creep.prototype.needsTarget = function( key = 'target') {
  return !this.hasTarget(key)
}
Creep.prototype.target = function(key = 'target') {
  return Game.getObjectById(this.memory["target-" + key])
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
Creep.prototype.clearTarget = function(key = 'target') {
  delete this.memory["target-" + key]
  return true
}
Creep.prototype.validateTarget = function(validTargets, key = 'target') {
  let valid = false
  _.each(validTargets, t => {
    if(t.structureType && t.structureType === t) valid = true
    if(t.resourceType && t.resourceType === t) valid = true
  })
  if(!valid) this.clearTarget(key)
  return valid
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
  ignoreCreeps: Game.time % 5 !== 0,  //false,
  visualizePathStyle: {opacity: 0.75, stroke: Config.colors.blue},
  maxRooms: 1
  }
  // Log.info(JSON.stringify(arguments))
  this.room.visual.circle(pos, { fill: Config.colors.blue,  opacity: 1.0, radius: 0.25} )
  return this.moveTo(pos, opts)
}


Creep.prototype.orignalRepair = Creep.prototype.repair
Creep.prototype.repair = function(target) {
  this.work(this.orignalRepair, target, Config.defaultRange)
}

Creep.prototype.orignalAttack = Creep.prototype.attack
Creep.prototype.attack = function(target) {
  let start = Game.cpu.getUsed();
  this.orignalAttack(target)
  Storage.addStat('account-cpu-attack', Game.cpu.getUsed() - start)
}
Creep.prototype.needEnergy = function() {
  if(this.isEmpty()) {
    this.memory.status = 'fill'
  }
  if(this.isFull()) {
    this.memory.status = 'empty'
    this.clearTarget()
  }
  return this.memory.status === 'fill'
}
