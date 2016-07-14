/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-29 16:16:15
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-14 01:33:03
*/

'use strict';

StructureSpawn.prototype.getBuilderBody = function(){
  var energy = this.room.energyCapacity();
  if (energy >= 300 && energy < 550) {
    return [WORK, CARRY, MOVE]
  } else if(energy >= 550 && energy < 800) {
    return [WORK, WORK, MOVE, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
  } else if(energy >= 800 && energy < 1300) {
    return [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
  } else if(energy >= 1300 && energy < 1800) {
    return [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE] //10 Energy Tick
  } else if(energy >= 1800) {
    return [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE] // 10 Energy Tick
  } else {
    return [WORK, CARRY, MOVE]
  }
}
StructureSpawn.prototype.builders = function() {
  return Finder.findCreepCount('builder', this)
  // return this.memory.current_builders || 0
}

StructureSpawn.prototype.maxBuilders = function() {
  return this.memory.max_builders || 0
}


StructureSpawn.prototype.setBuilders = function() {
  var count = Finder.findCreeps('builder', this.room.name).length;
  this.memory.current_builders = count;
}

StructureSpawn.prototype.spawnBuilder = function() {
  //this.spawnACreep('builder', this.getBuilderBody());
  this.addToSpawnQueue('builder', this.getBuilderBody(), 50)
}
