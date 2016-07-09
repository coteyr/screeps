/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 17:23:24
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-09 11:46:05
*/

'use strict';

StructureSpawn.prototype.getUpgraderBody = function(){
  var energy = this.room.energyAvailable;
  if (energy >= 300 && energy < 550) {
    return [WORK, WORK, CARRY, MOVE]
  } else if(energy >= 550 && energy < 800) {
    return [WORK, WORK, WORK, MOVE, CARRY, CARRY, CARRY, CARRY]
  } else if(energy >= 800 && energy < 1300) {
    return [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE]
  } else if(energy >= 1300) {
    return [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE]
  } else {
    return [WORK, CARRY, MOVE]
  }
}
StructureSpawn.prototype.upgraders = function() {
  return _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length;
 // return this.memory.current_upgraders || 0
}

StructureSpawn.prototype.maxUpgraders = function() {
  return this.memory.max_upgraders || 0
}

StructureSpawn.prototype.setMaxUpgraders = function() {
  this.memory.max_upgraders = 2
}
StructureSpawn.prototype.setUpgraders = function() {
  var count = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length;
  this.memory.current_upgraders = count;
}

StructureSpawn.prototype.spawnUpgrader = function() {
  this.spawnACreep('upgrader', this.getUpgraderBody())
}
