/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-09 01:58:09
*/

'use strict';

Creep.prototype.setupExoHarvesterMemory = function() {
  this.chooseExoTarget('harvest')
}

Creep.prototype.assignTravelExoHarvesterTasks = function() {
  if(this.carry.energy >= this.carryCapacity && this.mode() !== 'transition') {
    this.setMode('go-home')
    this.clearTarget();
  } else if (this.mode() !== 'transition') {
    this.setMode('leave')
  }
}

Creep.prototype.assignHomeExoHarvesterTasks = function() {
  if(this.mode() !== 'transition') {
    if(this.isEmpty()) {
      this.setMode('leave');
      this.clearTarget();
    } else {
      this.setMode('transfer');
    }
  }
}

Creep.prototype.assignRemoteExoHarvesterTasks = function() {
  if(this.mode() === 'transition') {
    // this.setMode('mine')
  } else {
    if (this.carry.energy < this.carryCapacity && this.carryCapacity > 0) {
      this.setMode('mine')
    } else if (this.carry.energy >= this.carryCapacity && this.carryCapacity > 0) {
      this.setMode('go-home')
      this.clearTarget();
    } else {
      this.setMode('idle')
    }
  }
}


Creep.prototype.doLeave = function() {
  this.gotoRoom(this.memory.exo_target)
}

