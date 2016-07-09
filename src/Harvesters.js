/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 17:23:24
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-09 05:48:05
*/

'use strict';

StructureSpawn.prototype.getHarvesterBody = function(){
  var energy = this.room.energyAvailable;
  if (energy >= 300 && energy < 550) {
    return [WORK, CARRY, CARRY, MOVE, MOVE]
  } else if(energy >= 550 && energy < 800) {
    return [WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY]
  } else if(energy >= 800 && energy < 1300) {
    return [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
  } else if(energy >= 1300) {
    return [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
  } else {
    return [WORK, CARRY, MOVE]
  }
}
StructureSpawn.prototype.harvesters = function() {
  return _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;
  // return this.memory.current_harvesters || 0
}

StructureSpawn.prototype.maxHarvesters = function() {
  return this.memory.max_harvesters || 0
}

StructureSpawn.prototype.setMaxHarvesters = function() {
  if (this.memory.current_miners >= 2) {
    this.memory.max_harvesters = 0
  } else {
    this.memory.max_harvesters = 2
  }
}
StructureSpawn.prototype.setHarvesters = function() {
  var count = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;
  this.memory.current_harvesters = count;
}

StructureSpawn.prototype.spawnHarvester = function() {
  this.spawnACreep('harvester', this.getHarvesterBody())
}
