/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:14:00
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-03 19:07:05
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
  return true
}
Creep.prototype.tick = function() {
  Log.info(["Ticking Creep", this.name])
  if(this.taskIs('mine')) {
    _.merge(Creep.prototype, MinerCreep.prototype)
  } else {
    _.merge(Creep.prototype, NullCreep.prototype)
  }
  this.superTick()
}
Creep.prototype.targetIs = function(id) {
  return this.memory.target === id
}
Creep.prototype.setTarget = function(target) {
  this.memory.target = target.id
  return true
}
Creep.prototype.hasTarget = function() {
  return !_.isUndefined(this.memory.target) && !_.isNull(this.memory.target)
}
Creep.prototype.target = function() {
  return Game.getObjectById(this.memory.target)
}
