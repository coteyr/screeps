/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-08 22:31:00
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-08 23:43:26
*/

'use strict';

let EnergyStructure = function(){};

EnergyStructure.prototype.energyCallModifier = 0.01 // really low by default

EnergyStructure.prototype.tick = function() {
  this.setupMemory();
  Log.info('Ticking Energy Container: ' + this.id + ' Mode: ' + this.memory.mode);
  this.assignMode();
  this.doWork();
}

EnergyStructure.prototype.storedEnergy = function() {
  if(this.energy) {
    return this.energy; // Towers
  } else if (this.store) {
    return this.store[RESOURCE_ENERGY]
  }
}

EnergyStructure.prototype.possibleEnergy = function() {
  if(this.energyCapacity) {
    return this.energyCapacity;
  } else if (this.storeCapacity) {
    return this.storeCapacity
  }
}

EnergyStructure.prototype.assignMode = function() {
  if(this.storedEnergy() < this.possibleEnergy()) {
    this.setMode('wait-energy')
  } else {
    this.setMode('idle')
  }
}

EnergyStructure.prototype.doWork = function() {
  if(this.memory.mode === 'wait-energy') {
    this.doWaitEnergy()
  }
}

EnergyStructure.prototype.doWaitEnergy = function() {
  if(this.storedEnergy() < this.possibleEnergy()) {
    if (this.memory.call_for_energy) {
      this.memory.call_for_energy += this.energyCallModifier
    } else {
      this.memory.call_for_energy = 1
    }
  } else {
    delete this.memory.call_for_energy
    this.setMode('idle')
  }
}

EnergyStructure.prototype.setupMemory = function() {
  if(!this.room.memory.energy_structures) {
    this.room.memory.energy_structures = {};
  }
  if (!this.room.memory.energy_structures[this.id]) {
    this.room.memory.energy_structures[this.id] = {}
    this.memory = this.room.memory.energy_structures[this.id]
  } else {
    this.memory = this.room.memory.energy_structures[this.id];
  }
}


EnergyStructure.prototype.memory = undefined;
