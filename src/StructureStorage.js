/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-07 09:31:18
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-08 22:40:44
*/

'use strict';

_.merge(StructureStorage.prototype, EnergyStructure.prototype);


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
