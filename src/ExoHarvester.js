/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-25 19:33:44
*/

'use strict';

Creep.prototype.setupExoHarvesterMemory = function() {
  this.chooseExoTarget('harvest')
}

Creep.prototype.assignTravelExoHarvesterTasks = function() {
  if(this.carry.energy >= this.carryCapacity && this.memory.mode !== 'transition') {
    this.setMode('go-home')
  } else if (this.memory.mode !== 'transition') {
    this.setMode('leave')
  }
}

Creep.prototype.assignHomeExoHarvesterTasks = function() {
  if(this.memory.mode !== 'transition') {
    if(this.carry.energy <= 0) {
      this.setMode('leave');
    } else {
      this.setMode('transfer');
    }
  }
}

Creep.prototype.assignRemoteExoHarvesterTasks = function() {
  if(this.memory.mode === 'transition') {
    // this.setMode('mine')
  } else {
    if (this.carry.energy < this.carryCapacity && this.carryCapacity > 0) {
      this.setMode('mine')
    } else if (this.carry.energy >= this.carryCapacity && this.carryCapacity > 0) {
      this.setMode('go-home')
    } else {
      this.setMode('idle')
    }
  }
}


Creep.prototype.doLeave = function() {
  this.gotoRoom(this.memory.exo_target)
}

