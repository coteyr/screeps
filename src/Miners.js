/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-28 02:52:49
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-09 05:48:33
*/

'use strict';

StructureSpawn.prototype.getMinerBody = function(){
  var energy = this.room.energyAvailable;
  if (energy >= 300 && energy < 550) {
    return [WORK, WORK, CARRY, MOVE]
  } else if(energy >= 550 && energy < 800) {
    return [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE]
  } else if(energy >= 800 && energy < 1300) {
    return [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE]
  } else if(energy >= 1300) {
    return [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE]
  } else {
    return [WORK, CARRY, MOVE]
  }
}
StructureSpawn.prototype.miners = function() {
  return _.filter(Game.creeps, (creep) => creep.memory.role == 'miner').length;
  //return this.memory.current_miners || 0
}

StructureSpawn.prototype.maxMiners = function() {
  return this.memory.max_miners || 0
}

StructureSpawn.prototype.setMaxMiners = function() {
  this.memory.max_miners = _.size(this.room.find(FIND_SOURCES))
}
StructureSpawn.prototype.setMiners = function() {
  var count = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner').length;
  this.memory.current_miners = count;
}

StructureSpawn.prototype.spawnMiner = function() {
  this.spawnACreep('miner', this.getMinerBody())
}
