/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 05:53:53
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-09 19:31:47
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
    Finder.findCreeps('harvester', this.room.name).forEach(function(harvester) {
      harvester.memory.mode = 'carrier'
    })
  }
}
StructureSpawn.prototype.spawnACreep = function(role, body)  {
  Log.info("Spawning A " + role)
  if(this.memory.creeper) {
    this.memory.creeper += 1
  } else {
    this.memory.creeper = 1
  }
  var result = this.createCreep(body, role + "-" + this.memory.creeper, {role: role, mode: 'idle'})
  if(result !== role + "-" + this.memory.creeper) {
    Log.error('Problem Spawning Creep: ' + result)
    Log.info(JSON.stringify(body))
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
    this.setMaxExoHarvesters()
    this.setMaxExoAttackers()
    this.setMiners()
    this.setCarriers()
    this.setUpgraders()
    this.setBuilders()
    this.setExoHarvesters()
    this.setExoAttackers()
  }
  this.memory.refresh_count -= 1;
}

StructureSpawn.prototype.assignMode = function() {
  if(!this.memory.mode) {
    Log.warn("No current mode for Spawn " + this.name)
    this.setMode('idle')
  }
  if(!this.memory.mode || this.memory.mode === 'idle') {
    if(this.room.energyAvailable >= this.room.energyCapacityAvailable) {
      this.setMode('spawn')
    } else if (this.energy < this.energyCapacity) {
      this.setMode('wait-energy')
    } else {
      this.setMode('idle')
    }
  } else if (this.memory.mode === 'spawning' && this.spawning === null ) {
      this.setMode('idle')
  }
  if (this.room.energyAvailable >= 300 && (this.miners() <= 0 || this.carriers() <= 0)) {
    this.setMode('er-spawn')
  }
}

StructureSpawn.prototype.doWork = function() {
  if(this.memory.mode === 'spawn') {
    this.spawnCreep();
  } else if (this.memory.mode === 'wait-energy') {
    this.doWaitEnergy();
  } else if (this.memory.mode === 'er-spawn') {
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
    this.setMode('idle')
  }
}

StructureSpawn.prototype.doErSpawn = function() {
  if (this.harvesters() === 0 && this.maxHarvesters > 0) {
    Log.info("ER Spawn Harvester")
    this.spawnHarvester();
  } else if (this.miners() === 0) {
    Log.info("ER Spawn Miner")
    this.spawnMiner();
  } else if (this.carriers() === 0) {
    Log.info("ER Spawn Carrier")
    this.spawnCarrier()
  } else {
    this.setMode('idle')
  }

}

StructureSpawn.prototype.spawnCreep = function() {
  Log.info('Trying to spawn a creep')
  if(this.memory.mode !== 'spawning') {
    this.room.cleanCreeps()
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
    } else if (this.exoHarvesters() < this.maxExoHarvesters()) {
      this.spawnExoHarvester()
    } else if (this.exoAttackers() < this.maxExoAttackers()) {
      this.spawnExoAttacker()
    }

    this.setMode('spawning')
  }
}
