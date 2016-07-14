/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 17:23:24
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-14 18:56:48
*/

'use strict';

StructureSpawn.prototype.getExoHarvesterBody = function(){
  var energy = this.room.energyCapacity();
  if (energy >= 1300 && energy < 1800) {
    return [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
  } else if (energy >= 1800) {
    return [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]

  } else {
    return []
  }
}
StructureSpawn.prototype.exoHarvesters = function() {
  return Finder.findAllCreepCount('exo-harvester', this)
  // return this.memory.current_harvesters || 0
}

StructureSpawn.prototype.maxExoHarvesters = function() {
  return this.memory.max_exo_harvesters || 0
}

StructureSpawn.prototype.setMaxExoHarvesters = function() {
  if(this.room.exoOperations() && this.room.memory.harvest) {
    this.memory.max_exo_harvesters = _.size(this.room.memory.harvest) * 4;
  } else {
    this.memory.max_exo_harvesters = 0;
  }
}

StructureSpawn.prototype.setExoHarvesters = function() {
  this.memory.current_exo_harvesters = Finder.findCreeps('exo-harvester', this.room.name).length
}

StructureSpawn.prototype.spawnExoHarvester = function() {
  /*var choice = Memory.last_harvest_choice || 0;
  this.createCreep(this.getExoHarvesterBody(), null, {role: 'exo-harvester', mode: 'idle', home: this.room.roomName, harvest: Memory.harvest[choice] })
  choice += 1
  if (choice > _.size(Memory.harvest) - 1) {
    choice = 0
  }
  Memory.last_harvest_choice = choice*/
  this.addToSpawnQueue('exo-harvester', this.getExoHarvesterBody(), 10)
}
