/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 17:23:24
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-09 23:38:11
*/

'use strict';

StructureSpawn.prototype.getExoAttackerBody = function(){
  var energy = this.room.energyAvailable;
  if (energy >= 1300) {
    return [ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH]
  } else {
    return []
  }
}
StructureSpawn.prototype.exoAttackers = function() {
  return Finder.findCreeps('exo-attacker', this.room.name).length;
  // return this.memory.current_harvesters || 0
}

StructureSpawn.prototype.maxExoAttackers = function() {
  return this.memory.max_exo_attackers || 0
}

StructureSpawn.prototype.setMaxExoAttackers = function() {
  if(this.room.exoOperations() && Memory.attack) {
    this.memory.max_exo_attackers = 10;
  } else {
    this.memory.max_exo_attackers = 0;
  }
}

StructureSpawn.prototype.setExoAttackers = function() {
  this.memory.current_exo_attackers = Finder.findCreeps('exo-attacker', this.room.name).length;
}

StructureSpawn.prototype.spawnExoAttacker = function() {
  this.createCreep(this.getExoAttackerBody(), null, {role: 'exo-attacker', mode: 'idle', home: this.room.roomName, attack: Memory.attack })
}
