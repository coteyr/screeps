/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 17:23:24
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-14 18:57:29
*/

'use strict';

StructureSpawn.prototype.getExoReserverBody = function(){
  var energy = this.room.energyCapacity();
  if (energy >= 1300 && energy < 1800) {
    return [CLAIM, CLAIM, MOVE, MOVE]
  } else if (energy >= 1800) {
    return [CLAIM, CLAIM, MOVE, MOVE]

  } else {
    return []
  }
}
StructureSpawn.prototype.exoReservers = function() {
  return Finder.findAllCreepCount('exo-reserver', this) // needs to be in all rooms

  // return this.memory.current_Reservers || 0
}

StructureSpawn.prototype.maxExoReservers = function() {
  return this.memory.max_exo_Reservers || 0
}

StructureSpawn.prototype.setMaxExoReservers = function() {
  if(this.room.exoOperations() && this.room.memory.reserve) {
    this.memory.max_exo_Reservers = _.size(this.room.memory.reserve);
  } else {
    this.memory.max_exo_Reservers = 0;
  }
}

StructureSpawn.prototype.setExoReservers = function() {
  this.memory.current_exo_Reservers = Finder.findCreeps('exo-reserver', this.room.name).length
}

StructureSpawn.prototype.spawnExoReserver = function() {
  /*var choice = Memory.last_reserve_choice || 0;
  this.createCreep(this.getExoReserverBody(), null, {role: 'exo-reserver', mode: 'idle', home: this.room.roomName, reserve: Memory.reserve[choice] })
  choice += 1
  if (choice > _.size(Memory.reserve) - 1) {
    choice = 0
  }
  Memory.last_reserve_choice = choice*/
  this.addToSpawnQueue('exo-reserver', this.getExoReserverBody(), 10)

}
