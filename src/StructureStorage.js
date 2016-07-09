/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-07 09:31:18
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-08 10:56:00
*/

'use strict';

StructureStorage.prototype.tick = function() {
  this.setupMemory();
  Log.debug('Ticking Storage: ' + this.id + ' Mode: ' + this.memory.mode);
  this.assignMode();
  this.doWork();
}

StructureStorage.prototype.assignMode = function() {
  if(this.store[RESOURCE_ENERGY] < this.storeCapacity) {
    this.setMode('wait-energy')
  } else {
    this.setMode('idle')
  }
}

StructureStorage.prototype.doWork = function() {
  if(this.memory.mode === 'wait-energy') {
    this.doWaitEnergy()
  }
}

StructureStorage.prototype.doWaitEnergy = function() {
  if(this.store[RESOURCE_ENERGY] < this.storeCapacity) {
    if (this.memory.call_for_energy) {
      this.memory.call_for_energy += 0.1
    } else {
      this.memory.call_for_energy = 1
    }
  } else {
    delete this.memory.call_for_energy
    this.setMode('idle')
  }
}

StructureStorage.prototype.setupMemory = function() {
  if(!this.room.memory.storages) {
    this.room.memory.storages = {};
  }
  if (!this.room.memory.storages[this.id]) {
    this.room.memory.storages[this.id] = {}
    this.memory = this.room.memory.storages[this.id]
  } else {
    this.memory = this.room.memory.storages[this.id];
  }
}

StructureStorage.prototype.memory = undefined;

