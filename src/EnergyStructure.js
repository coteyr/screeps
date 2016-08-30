/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-08 22:31:00
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-28 10:26:28
*/

'use strict';

let EnergyStructure = function(){};

_.merge(EnergyStructure.prototype, MemoryStructure.prototype);

EnergyStructure.prototype.tick = function() {
  this.setupMemory();
  Log.debug('Ticking Energy Container: ' + this.structureType + " : " + this.id + ' Mode: ' + this.mode());
  this.assignMode();
  this.doWork();
}

EnergyStructure.prototype.storedEnergy = function() {
  if(typeof this.energy != 'undefined') return this.energy; // Towers
  if (typeof this.store != 'undefined') return this.store[RESOURCE_ENERGY]
}

EnergyStructure.prototype.possibleEnergy = function() {
  if(typeof this.energyCapacity != 'undefined') return this.energyCapacity;
  if (typeof this.storeCapacity != 'undefined') return this.storeCapacity
}

EnergyStructure.prototype.assignMode = function() {
  if(this.hasRoom()) this.setMode('wait-energy')
  if(this.isFull()) this.setMode('idle')
}

EnergyStructure.prototype.doWork = function() {
  if(this.modeIs('wait-energy')) this.doWaitEnergy()
}

EnergyStructure.prototype.doWaitEnergy = function() {
  if(this.isFull()) {
    this.setMode('idle')
  }
}

EnergyStructure.prototype.isEmpty = function() {
  return this.storedEnergy() === 0
}

EnergyStructure.prototype.isFull = function() {
  return this.storedEnergy() >= this.possibleEnergy()
}

EnergyStructure.prototype.hasRoom = function() {
  return !this.isFull()
}
