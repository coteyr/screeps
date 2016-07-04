/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-03 16:06:00
*/

'use strict';

Creep.prototype.assignBuilderTasks = function() {
  if(!this.memory.mode) {
    this.memory.mode = 'idle'
  }
  if(this.memory.mode == 'idle') {
    if(this.room.controller.level < 2) {
       if(this.carry.energy < this.carryCapacity) {
        this.memory.mode = 'mine'
      } else if(this.carry.energy >= this.carryCapacity) {
        this.memory.mode = 'build'
      }
    } else {
      if(this.carry.energy < this.carryCapacity) {
        this.memory.mode = 'wait-energy'
      } else if(this.carry.energy >= this.carryCapacity  && this.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)) {
        this.memory.mode = 'build'
      } else if(this.carry.energy >= this.carryCapacity) {
        this.memory.mode = 'upgrade'
      }
    }
  }
}

Creep.prototype.doBuild = function() {
  if(this.carry.energy >= 1) {
    var target =  this.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    if(target) {
      if (this.moveCloseTo(target.pos.x, target.pos.y, 3)) {
        this.build(target)
      }
    } else {
      this.memory.mode = 'noop';
    }
  }
  if(this.carry.energy == 0) {
    this.memory.mode = 'idle';
  }
}


