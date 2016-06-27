/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 17:23:24
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-06-26 18:03:01
*/

'use strict';

StructureSpawn.prototype.getHarvesterBody = function(){
  var energy = this.room.energyAvailable;
  if (energy >= 300 && energy < 550) {
    return [WORK, CARRY, CARRY, MOVE, MOVE]
  } else {
    return [WORK, CARRY, MOVE]
  }
}
StructureSpawn.prototype.harvesters = function() {
  return this.memory.current_harvesters || 0
}

StructureSpawn.prototype.maxHarvesters = function() {
  return this.memory.max_harvesters || 0
}

StructureSpawn.prototype.setMaxHarvesters = function() {
  this.memory.max_harvesters = 2
}
StructureSpawn.prototype.setHarvesters = function() {
  var count = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;
  this.memory.current_harvesters = count;
}

StructureSpawn.prototype.spawnHarvester = function() {
  this.createCreep(this.getHarvesterBody(), null, {role: 'harvester', mode: 'idle'})
}
