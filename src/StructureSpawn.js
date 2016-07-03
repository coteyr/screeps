/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 05:53:53
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-02 12:21:15
*/

'use strict';

StructureSpawn.prototype.tick = function() {
  Log.debug('Ticking Spawn: ' + this.name + ' Mode: ' + this.memory.mode + " - " + this.memory.refresh_count);
  this.promoteCreeps();
  this.assignMode();
  this.doWork();
  this.refreshData();

}

StructureSpawn.prototype.promoteCreeps = function() {
  if(this.harvesters >  this.maxHarvesters) {
    Log.warn("Promoting Harvesters to carriers")
    _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').forEach(function(harvester) {
      harvester.memory.mode = 'carrier'
    })
  }
}

StructureSpawn.prototype.refreshData = function() {
  if(!this.memory.refresh_count || this.memory.refresh_count <= 0) {
    this.memory.refresh_count = 70;
    this.setMaxHarvesters()
    this.setMaxMiners()
    this.setMaxCarriers()
    this.setMaxUpgraders()
    this.setMaxBuilders()
    this.setHarvesters()
    this.setMiners()
    this.setCarriers()
    this.setUpgraders()
    this.setBuilders()
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
    } else if (this.energy < this.energyCapacity) {
      this.memory.mode = 'wait-energy'
    } else {
      this.memory.mode = 'idle'
    }
  } else if (this.memory.mode == 'spawning' && this.spawning == null ) {
      this.memory.mode = 'idle'
  }
  if (this.room.energyAvailable >= 300 && _.size(Game.creeps) == 0) {
      this.memory.mode = 'er-spawn'
  }
}

StructureSpawn.prototype.doWork = function() {
  if(this.memory.mode == 'spawn') {
    this.spawnCreep();
  } else if (this.memory.mode == 'wait-energy') {
    this.doWaitEnergy();
  } else if (this.memory.mode == 'er-spawn') {
    this.doErSpawn();
  }
}



StructureSpawn.prototype.doWaitEnergy = function() {
  if(this.energy < this.energyCapacity) {
    if (this.memory.call_for_energy) {
      this.memory.call_for_energy = this.memory.call_for_energy + 5
    } else {
      this.memory.call_for_energy = 1
    }
  } else {
    delete this.memory.call_for_energy
    this.memory.mode = 'idle'
  }
}

StructureSpawn.prototype.doErSpawn = function() {
  if (this.harvesters()== 0) {
    this.spawnHarvester();
  } else if (this.miners() == 0) {
    this.spawnMiner();
  } else if (this.carriers() == 0) {
    this.spawnCarrier()
  } else {
    this.memory.mode = 'idle'
  }

}

StructureSpawn.prototype.spawnCreep = function() {
  Log.info('Trying to spawn a creep')
  for(var name in Memory.creeps) {
    if(!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }
  // What kind of creep
  if (this.harvesters() < this.maxHarvesters()) {
    this.spawnHarvester();
  } else if (this.builders() < this.maxBuilders()) {
    this.spawnBuilder();
  } else if (this.miners() < this.maxMiners()) {
    this.spawnMiner();
  } else if (this.carriers() < this.maxCarriers()) {
    this.spawnCarrier()
  } else if (this.upgraders() < this.maxUpgraders()) {
    this.spawnUpgrader()
  }
  this.memory.mode = 'spawning'
}
