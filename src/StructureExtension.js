/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-30 06:23:32
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-06-30 12:14:34
*/

'use strict';

StructureExtension.prototype.tick = function() {
  this.setupMemory();
  Log.debug('Ticking Extension: ' + this.id + ' Mode: ' + this.memory.mode);
  this.assignMode();
  this.doWork();
}

StructureExtension.prototype.assignMode = function() {
  if(this.energy < this.energyCapacity) {
    this.memory.mode = 'wait-energy'
  } else {
    this.memory.mode = 'idle'
  }
}

StructureExtension.prototype.doWork = function() {
  if(this.memory.mode == 'wait-energy') {
    this.doWaitEnergy()
  }
}

StructureExtension.prototype.doWaitEnergy = function() {
  if(this.energy < this.energyCapacity) {
    if (this.memory.call_for_energy) {
      this.memory.call_for_energy = this.memory.call_for_energy + 2
    } else {
      this.memory.call_for_energy = 1
    }
  } else {
    delete this.memory.call_for_energy
    this.memory.mode = 'idle'
  }
}

StructureExtension.prototype.setupMemory = function() {
  if(!this.room.memory.extensions) {
    this.room.memory.extensions = {};
  }
  if (!this.room.memory.extensions[this.id]) {
    this.room.memory.extensions[this.id] = {}
    this.memory = this.room.memory.extensions[this.id]
  } else {
    this.memory = this.room.memory.extensions[this.id];
  }
}

StructureExtension.prototype.memory = undefined;

/*StructureExtension.prototype.memory = function() {
  if(!this.room.memory.extensions) {
    this.room.memory.extensions = {};
  }
  if (!this.room.memory.extensions[this.id]) {
    this.room.memory.extensions[this.id] = {};
  }
  return this.room.memory.extensions[this.id]
}*/
