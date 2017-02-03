/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:14:00
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-03 18:41:00
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
    _.merge(this.prototype, MinerCreep.prototype)
  } else {
    _.merge(this.prototype, NullCreep.prototype)
  }
  this.superTick()
}
