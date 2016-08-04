/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-03 21:22:21
*/

'use strict';

Creep.prototype.assignBuilderTasks = function() {
  if(this.modeIs('idle')) {
    this.clearTarget()
    if(this.room.controller.level < 2 && this.hasRoom()) this.setMode('mine')
    if(this.room.controller.level >= 2 && this.hasRoom()) this.setMode('pickup')
    if(this.hasSome()) this.setMode('build')
  }
}

Creep.prototype.doBuild = function() {
  if(this.needsTarget()) Targeting.findClosestConstruction(this.pos)
  if(this.hasTarget()) {
    var target =  this.target()
    this.getCloseAndAction(target, this.build(target), 3)
  } else {
    this.setMode('repair');
  }
  if(this.isEmpty()) this.setMode('idle');
}

Creep.prototype.doRepair = function() {
  var creep = this
  if (this.needsTarget()) Targeting.findClosestRepairTarget(this.pos, this.room)
  if(this.hasTarget()) {
    var target = this.target()
    this.getCloseAndAction(target, this.repair(target))
    if(target.hits >= target.hitsMax) this.clearTarget()
  } else {
    this.setMode('upgrade')
  }
  if(this.isEmpty()) this.setMode('idle');
}


