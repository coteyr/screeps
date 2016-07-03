/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-29 16:16:15
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-02 09:52:21
*/

'use strict';

StructureSpawn.prototype.getBuilderBody = function(){
  var energy = this.room.energyAvailable;
  if (energy >= 300 && energy < 550) {
    return [WORK, CARRY, CARRY, MOVE, MOVE]
  } else if(energy >= 550 && energy < 800) {
    return [WORK, WORK, MOVE, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
  } else if(energy >= 800 && energy < 1050) {
    return [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
  } else {
    return [WORK, CARRY, MOVE]
  }
}
StructureSpawn.prototype.builders = function() {
  return this.memory.current_builders || 0
}

StructureSpawn.prototype.maxBuilders = function() {
  return this.memory.max_builders || 0
}

StructureSpawn.prototype.setMaxBuilders = function() {
  this.memory.max_builders = 2
}
StructureSpawn.prototype.setBuilders = function() {
  var count = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length;
  this.memory.current_builders = count;
}

StructureSpawn.prototype.spawnBuilder = function() {
  Log.debug("Spawning Builder")
  this.createCreep(this.getBuilderBody(), null, {role: 'builder', mode: 'idle'})
}
