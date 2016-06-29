/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-06-28 16:02:12
*/

'use strict';

Creep.prototype.assignUpgraderTasks = function() {
  if(!this.memory.mode) {
    this.memory.mode = 'idle'
  }
  if(this.memory.mode == 'idle') {
    if(this.ticksToLive < 200) {
      this.memory.mode = 'recharge'
    } else if(this.carry.energy < this.carryCapacity) {
      this.memory.mode = 'wait-energy'
    } else if(this.carry.energy >= this.carryCapacity) {
      this.memory.mode = 'upgrade'
    }
  }
}

Creep.prototype.doUpgrade = function() {
  if(this.carry.energy >= 1) {
    if(!this.pos.inRangeTo(this.room.controller.pos.x, this.room.controller.pos.y, 1)) {
      this.goto(this.room.controller.pos.x, this.room.controller.pos.y, 1)
    } else {
      this.upgradeController(this.room.controller)
    }
  } else {
    this.memory.mode = 'idle'
  }
}


