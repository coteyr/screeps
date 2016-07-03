/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 17:23:24
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-02 10:23:49
*/

'use strict';

StructureSpawn.prototype.getUpgraderBody = function(){
  var energy = this.room.energyAvailable;
  if (energy >= 300 && energy < 550) {
    return [WORK, WORK, CARRY, MOVE]
  } else if(energy >= 550 && energy < 800) {
    return [WORK, WORK, WORK, MOVE, CARRY, CARRY, CARRY, CARRY]
  } else if(energy >= 800 && energy < 1050) {
    [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE]
  } else {
    return [WORK, CARRY, MOVE]
  }
}
StructureSpawn.prototype.upgraders = function() {
  return this.memory.current_upgraders || 0
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
  this.createCreep(this.getHarvesterBody(), null, {role: 'upgrader', mode: 'idle'})
}
