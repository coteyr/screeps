/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-07 09:31:18
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-07 09:35:07
*/

'use strict';

StructureContainer.prototype.tick = function() {
  this.setupMemory();
  Log.info('Ticking Container: ' + this.id + ' Mode: ' + this.memory.mode);
  this.assignMode();
  this.doWork();
}

StructureContainer.prototype.assignMode = function() {
  if(this.store[RESOURCE_ENERGY] < this.storeCapacity) {
    this.setMode('wait-energy')
  } else {
    this.setMode('idle')
  }
}

StructureContainer.prototype.doWork = function() {
  if(this.memory.mode === 'wait-energy') {
    this.doWaitEnergy()
  }
}

StructureContainer.prototype.doWaitEnergy = function() {
  if(this.store[RESOURCE_ENERGY] < this.storeCapacity) {
    if (this.memory.call_for_energy) {
      this.memory.call_for_energy = 1
    } else {
      this.memory.call_for_energy = 1
    }
  } else {
    delete this.memory.call_for_energy
    this.setMode('idle')
  }
}

StructureContainer.prototype.setupMemory = function() {
  if(!this.room.memory.containers) {
    this.room.memory.containers = {};
  }
  if (!this.room.memory.containers[this.id]) {
    this.room.memory.containers[this.id] = {}
    this.memory = this.room.memory.containers[this.id]
  } else {
    this.memory = this.room.memory.containers[this.id];
  }
}

StructureContainer.prototype.memory = undefined;

