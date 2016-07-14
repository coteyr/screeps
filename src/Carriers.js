/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 17:23:24
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-14 00:01:43
*/

'use strict';

StructureSpawn.prototype.getCarrierBody = function(){
  var energy = this.room.energyCapacity();
  if (energy >= 300 && energy < 550) {
    return [CARRY, CARRY, MOVE, MOVE]
  } else if(energy >= 550 && energy < 800) {
    return [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
  } else if(energy >= 800 && energy < 1300) {
    return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
  } else if(energy >= 1300 && energy < 1800) {
    return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
  } else if(energy >= 1800) {
    return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
  } else {
    return [WORK, CARRY, MOVE]
  }
}
StructureSpawn.prototype.carriers = function() {
    return Finder.findCreepCount('carrier', this)
   //return this.memory.current_carriers || 0
}

StructureSpawn.prototype.maxCarriers = function() {
  return this.memory.max_carriers || 0
}

StructureSpawn.prototype.setMaxCarriers = function() {
  this.memory.max_carriers = (this.memory.max_miners) * 1
}
StructureSpawn.prototype.setCarriers = function() {
  var count = Finder.findCreeps('carrier', this.room.name).length;
  this.memory.current_carriers = count;
}

StructureSpawn.prototype.spawnCarrier = function() {
  this.addToSpawnQueue('carrier', this.getCarrierBody(), 5)
  // this.spawnACreep('carrier', this.getCarrierBody())
}
