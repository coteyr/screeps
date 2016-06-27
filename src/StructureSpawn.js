/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 05:53:53
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-06-26 17:59:40
*/

'use strict';

StructureSpawn.prototype.tick = function() {
  Log.info('Ticking Spawn: ' + this.name + ' Mode: ' + this.memory.mode + " - " + this.memory.refresh_count);
  this.assignMode();
  this.doWork();
  this.refreshData();
}

StructureSpawn.prototype.refreshData = function() {
  if(!this.memory.refresh_count || this.memory.refresh_count <= 0) {
    this.memory.refresh_count = 70;
    this.setMaxHarvesters()
  }
  this.memory.refresh_count -= 1;
}

StructureSpawn.prototype.assignMode = function() {
  if(!this.memory.mode) {
    Log.warn("No current mode for Spawn " + this.name)
    this.memory.mode = 'idle'
  }
  if(!this.memory.mode || this.memory.mode == 'idle') {
    if(this.room.energyAvailable >= this.room.energyCapacityAvailable) {
      this.memory.mode = 'spawn'
    } else {
      this.memory.mode = 'idle'
    }
  } else if (this.memory.mode == 'spawning' && this.spawning == null ) {
      this.memory.mode = 'idle'
  }
}

StructureSpawn.prototype.doWork = function() {
  if(this.memory.mode == 'spawn') {
    this.spawnCreep();
  }
}

StructureSpawn.prototype.spawnCreep = function() {
  // What kind of creep
  if (this.harvesters() <= this.maxHarvesters()) {
    this.spawnHarvester();
  }
  this.memory.mode = 'spawning'
}
