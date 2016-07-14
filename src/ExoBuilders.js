/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 17:23:24
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-14 18:55:58
*/

'use strict';

StructureSpawn.prototype.getExoBuilderBody = function(){
  var energy = this.room.energyCapacity();
  if (energy >= 1300) {
    return [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
  } else {
    return []
  }
}
StructureSpawn.prototype.exoBuilders = function() {
  return Finder.findAllCreepCount('exo-builder', this)
  // return this.memory.current_builders || 0
}

StructureSpawn.prototype.maxExoBuilders = function() {
  return this.memory.max_exo_builders || 0
}

StructureSpawn.prototype.setMaxExoBuilders = function() {
  if(this.room.exoOperations() && this.room.memory.build) {
    this.memory.max_exo_builders = _.size(this.room.memory.build) * 4;
  } else {
    this.memory.max_exo_builders = 0;
  }
}

StructureSpawn.prototype.setExoBuilders = function() {
  this.memory.current_exo_builders = Finder.findCreeps('exo-builder', this.room.name).length
}

StructureSpawn.prototype.spawnExoBuilder = function() {
  /*var choice = Memory.last_build_choice || 0;
  this.createCreep(this.getExoBuilderBody(), null, {role: 'exo-builder', mode: 'idle', home: this.room.roomName, build: Memory.build[choice] })
  choice += 1
  if (choice > _.size(Memory.build) - 1) {
    choice = 0
  }
  Memory.last_build_choice = choice*/
  this.addToSpawnQueue('exo-builder', this.getExoBuilderBody(), 50)
}
