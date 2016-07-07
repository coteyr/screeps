/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-05 20:18:11
*/

'use strict';

Creep.prototype.assignBuilderTasks = function() {
  if(!this.memory.mode) {
    this.setMode('idle')
  }
  if(this.memory.mode == 'idle') {
    if(this.room.controller.level < 2) {
       if(this.carry.energy < this.carryCapacity) {
        this.setMode('mine')
      } else if(this.carry.energy >= this.carryCapacity) {
        this.setMode('build')
      }
    } else {
      if(this.carry.energy < this.carryCapacity) {
        this.setMode('wait-energy')
      } else if(this.carry.energy >= this.carryCapacity  && this.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)) {
        this.setMode('build')
      } else if(this.carry.energy >= this.carryCapacity) {
        this.setMode('upgrade')
      }
    }
  }
}

Creep.prototype.doBuild = function() {
  if(this.carry.energy >= 1) {
    var target =  this.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    if(target) {
      Log.info("I have target " + target.id)
      if (this.moveCloseTo(target.pos.x, target.pos.y, 3)) {
        Log.info("I am close enough")
         if (this.build(target) == ERR_INVALID_TARGET) {
          this.move(RIGHT)
         }
      }
    } else {
      this.setMode('noop');
    }
  }
  if(this.carry.energy == 0) {
    this.setMode('idle');
  }
}


