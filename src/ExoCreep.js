/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-07-14 19:31:34
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-14 20:32:36
*/

'use strict';

let ExoCreep = function(){};

StructureSpawn.prototype.setExoCount = function(role){
   this.memory['current-' + role] = Finder.findExoCreepCount(role, this, this.room.name)
}

StructureSpawn.prototype.setMaxExoCount = function(role, arrayName, multiplyer) {
  if(this.room.exoOperations() && this.room.memory[arrayName]) {
    this.memory["max-" + role] = _.size(this.room.memory[arrayName]) * multiplyer
  } else {
    this.memory["max-" + role] = 0
  }
}

StructureSpawn.prototype.getExoCount = function(role) {
  // return this.memory['current-' + role] || Finder.findExoCreepCount(role, this, this.room.name)
  return Finder.findExoCreepCount(role, this, this.room.name)
}

StructureSpawn.prototype.getMaxExoCount = function(role) {
  return this.memory["max-" + role] || 0
}

StructureSpawn.prototype.spawnExoCreep = function(role, body, priority) {
  this.addToSpawnQueue(role, body, priority)
}
