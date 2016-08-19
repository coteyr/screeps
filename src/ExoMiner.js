/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-18 20:35:50
*/

'use strict';

Creep.prototype.setupExoMinerMemory = function() {
  this.chooseExoTarget('mine')
}

Creep.prototype.assignTravelExoMinerTasks = function() {
  if(this.carry.energy >= this.carryCapacity && this.mode() !== 'transition') {
    this.setMode('go-home')
  } else if (this.mode() !== 'transition') {
    this.setMode('leave')
  }
}

Creep.prototype.assignHomeExoMinerTasks = function() {
  if(this.mode() !== 'transition') {
    if(this.carry.energy <= 0) {
      this.setMode('leave');
    } else {
      this.setMode('transfer');
    }
  }
}

Creep.prototype.assignRemoteExoMinerTasks = function() {
  if(this.mode() === 'transition') {
    // this.setMode('mine')
  } else {
    if (this.carry.energy < this.carryCapacity) {
      this.setMode('mine')
    } else if (this.carry.energy >= this.carryCapacity) {
      this.setMode('send')
    }
  }
}


