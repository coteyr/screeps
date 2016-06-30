/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 17:23:24
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-06-29 16:08:59
*/

'use strict';

StructureSpawn.prototype.getCarrierBody = function(){
  var energy = this.room.energyAvailable;
  if (energy >= 300 && energy < 550) {
    return [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
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
  this.memory.max_carriers = this.memory.max_miners * 1.25
}
StructureSpawn.prototype.setCarriers = function() {
  var count = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier').length;
  this.memory.current_carriers = count;
}

StructureSpawn.prototype.spawnCarrier = function() {
  Log.debug("Spawning Carrier")
  this.createCreep(this.getCarrierBody(), null, {role: 'carrier', mode: 'idle'})
}
