/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 17:23:24
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-13 05:10:33
*/

'use strict';

StructureSpawn.prototype.getUpgraderBody = function(){
  var energy = this.room.energyCapacity();
  if (energy >= 300 && energy < 550) {
    return [WORK, CARRY, MOVE]
  } else if(energy >= 550 && energy < 800) {
    return [WORK, WORK, WORK, MOVE, CARRY, CARRY, CARRY, CARRY]
  } else if(energy >= 800 && energy < 1300) {
    return [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE]
  } else if(energy >= 1300 && energy < 1800) {
    return [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE]
  } else if(energy >= 1800) {
    return [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE] // 10 Energy Tick
  } else {
    return [WORK, CARRY, MOVE]
  }
}
StructureSpawn.prototype.upgraders = function() {
  return Finder.findCreepCount('upgrader', this)
 // return this.memory.current_upgraders || 0
}

StructureSpawn.prototype.maxUpgraders = function() {
  return this.memory.max_upgraders || 0
}

StructureSpawn.prototype.setMaxUpgraders = function() {
  this.memory.max_upgraders = 2
}
StructureSpawn.prototype.setUpgraders = function() {
  var count = Finder.findCreeps('upgrader', this.room.name).length;
  this.memory.current_upgraders = count;
}

StructureSpawn.prototype.spawnUpgrader = function() {
  this.addToSpawnQueue('upgrader', this.getUpgraderBody(), 60)
}
