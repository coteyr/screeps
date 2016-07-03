/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 17:23:24
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-02 11:16:03
*/

'use strict';

StructureSpawn.prototype.getCarrierBody = function(){
  var energy = this.room.energyAvailable;
  if (energy >= 300 && energy < 550) {
    return [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
  } else if(energy >= 550 && energy < 800) {
    return [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
  } else if(energy >= 800 && energy < 1050) {
    return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
  } else {
    return [WORK, CARRY, MOVE]
  }
}
StructureSpawn.prototype.carriers = function() {
  return this.memory.current_carriers || 0
}

StructureSpawn.prototype.maxCarriers = function() {
  return this.memory.max_carriers || 0
}

StructureSpawn.prototype.setMaxCarriers = function() {
  this.memory.max_carriers = (this.memory.max_miners) * 2
}
StructureSpawn.prototype.setCarriers = function() {
  var count = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier').length;
  this.memory.current_carriers = count;
}

StructureSpawn.prototype.spawnCarrier = function() {
  Log.debug("Spawning Carrier")
  this.createCreep(this.getCarrierBody(), null, {role: 'carrier', mode: 'idle'})
}
