/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-03 09:39:23
*/

'use strict';

Creep.prototype.assignDemoTasks = function() {
  if(this.modeIs('idle')) {
    if(this.carry.energy <= 0) {
      this.setMode('demo')
    } else {
      this.setMode('upgrade')
    }
  }
  if(_.size(this.room.memory.demos) <= 0) {
    this.setMode('recycle')
  }
}


Creep.prototype.doDemo = function() {
  if(this.needsTarget()) {
    this.setTarget(this.room.memory.demos[0])
  }
  if(this.hasTarget()) {
    var target = this.target()
    if(this.moveCloseTo(target.pos.x, target.pos.y, 1)) {
      this.dismantle(target)
    }
  } else {
    this.room.removeDemo(this.memory.target)
    this.clearTarget()
    this.setMode('idle')
  }
  if(this.carry.energy >= this.carryCapacity) {
    this.setMode('upgrade')
  }
}


