/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 17:23:24
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-12 18:25:43
*/

'use strict';

StructureSpawn.prototype.getExoAttackerBody = function(){
  var energy = this.room.energyCapacity();
  if (energy >= 1300) {
    //return [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE]
    return [ATTACK, RANGED_ATTACK, MOVE, MOVE]
  } else {
    return []
  }
}
StructureSpawn.prototype.exoAttackers = function() {
  return Finder.findAllCreeps('exo-attacker').length + _.filter(this.memory.spawn_queue, {'role': 'exo-attacker'}).length;
  // return this.memory.current_harvesters || 0
}

StructureSpawn.prototype.maxExoAttackers = function() {
  return this.memory.max_exo_attackers || 0
}

StructureSpawn.prototype.setMaxExoAttackers = function() {
  if(this.room.exoOperations() && this.room.memory.attack) {
    this.memory.max_exo_attackers = 10;
  } else {
    this.memory.max_exo_attackers = 0;
  }
}

StructureSpawn.prototype.setExoAttackers = function() {
  this.memory.current_exo_attackers = Finder.findCreeps('exo-attacker', this.room.name).length;
}

StructureSpawn.prototype.spawnExoAttacker = function() {
  this.addToSpawnQueue('exo-attacker', this.getExoAttackerBody(), 10)
  //this.createCreep(this.getExoAttackerBody(), null, {role: 'exo-attacker', mode: 'idle', home: this.room.roomName, attack: Memory.attack })
}
