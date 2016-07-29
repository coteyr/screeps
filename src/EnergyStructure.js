/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-08 22:31:00
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-29 02:07:06
*/

'use strict';

let EnergyStructure = function(){};

_.merge(EnergyStructure.prototype, MemoryStructure.prototype);

EnergyStructure.prototype.energyCallModifier = 0.01 // really low by default

EnergyStructure.prototype.tick = function() {
  this.setupMemory();
  Log.debug('Ticking Energy Container: ' + this.structureType + " : " + this.id + ' Mode: ' + this.mode());
  this.assignMode();
  this.doWork();
}

EnergyStructure.prototype.storedEnergy = function() {
  if(typeof this.energy != 'undefined') {
    return this.energy; // Towers
  } else if (typeof this.store != 'undefined') {
    return this.store[RESOURCE_ENERGY]
  }
}

EnergyStructure.prototype.possibleEnergy = function() {
  if(typeof this.energyCapacity != 'undefined') {
    return this.energyCapacity;
  } else if (typeof this.storeCapacity != 'undefined') {
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
  if(this.mode() === 'wait-energy') {
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
