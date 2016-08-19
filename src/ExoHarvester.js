/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-13 18:31:17
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
      if(!this.isEmpty() && this.room.hasRoom()) this.setMode('transfer');
      if(_.size(this.room.find(FIND_CONSTRUCTION_SITES)) >= 5 && !this.isEmpty() && this.room.isFull()) this.setMode('build')
      if(_.size(this.room.find(FIND_CONSTRUCTION_SITES)) < 5 && !this.isEmpty() && this.room.isFull()) this.setMode('upgrade');
      if(this.isEmpty()) this.setMode('leave')
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
