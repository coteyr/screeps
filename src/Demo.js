/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-30 07:16:45
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
}


Creep.prototype.doDemo = function() {
  if(!this.memory.target) {
    this.memory.target = this.room.memory.demos[0]
  }
  var target = Game.getObjectById(this.memory.target)
  if(this.moveCloseTo(target.pos.x, target.pos.y, 1)) {
    this.dismantle(target)
  }
  if(this.carry.energy >= this.carryCapacity) {
    this.setMode('upgrade')
  }
}


