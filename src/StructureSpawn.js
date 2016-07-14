/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 05:53:53
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-07-13 20:04:22
*/

'use strict';

StructureSpawn.prototype.tick = function() {
  Log.debug('Ticking Spawn: ' + this.name + ' Mode: ' + this.memory.mode + " - " + this.memory.refresh_count);
  this.promoteCreeps();
  this.assignMode();
  this.spawnCreeps();
  this.doWork();
  this.doErSpawn();
  this.refreshData();
  Memory.stats["room." + this.room.name + ".spawnQueue"] = _.size(this.memory.spawn_queue)


}
StructureSpawn.prototype.promote = function(from, to) {
  Log.warn("Promoting " +  from + " to " + to)
    Finder.findCreeps(from, this.room.name).forEach(function(creep) {
      creep.memory.role = to
      creep.setMode('idle')
    })
}


StructureSpawn.prototype.promoteCreeps = function() {
  if(this.harvesters() >  this.maxHarvesters()) {
    this.promote('harvester', 'carrier')
  }

  if(this.builders() > this.maxBuilders()) {
    this.promote('builder', 'harvester')
  }
}
StructureSpawn.prototype.spawnACreep = function(role, body)  {
  this.room.cleanCreeps()
  Log.info("Spawning A " + role + " in " + this.room.name)
  if(this.memory.creeper) {
    Memory.creeper += 1
  } else {
    Memory.creeper = 1
  }
  var result = this.createCreep(body, role + "_" + Memory.creeper, {role: role, mode: 'idle', home: this.room.name})
  if(result !== role + "_" + Memory.creeper) {
    Log.error('Problem Spawning Creep: ' + result)
    Log.error(role + ": " + JSON.stringify(body))
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
    this.setMaxExoReservers()
    this.setMiners()
    this.setCarriers()
    this.setUpgraders()
    this.setBuilders()
    this.setExoHarvesters()
    this.setExoAttackers()
    this.setExoReservers()
  }
  this.memory.refresh_count -= 1;
}

StructureSpawn.prototype.assignMode = function() {
  if(!this.memory.mode) {
    Log.warn("No current mode for Spawn " + this.name)
    this.setMode('idle')
  }
  if(!this.memory.mode || this.memory.mode === 'idle') {
    if (this.energy < this.energyCapacity) {
      this.setMode('wait-energy')
    } else {
      this.setMode('idle')
    }
  } else if (this.memory.mode === 'spawning' && this.spawning === null ) {
      this.setMode('idle')
  }
  /*if (this.room.energyAvailable >= 300 && (this.miners() <= 0 || this.carriers() <= 0)) {
    this.setMode('er-spawn')
  }*/
}

StructureSpawn.prototype.doWork = function() {
  if(this.memory.mode === 'idle' || this.memory.mode === 'wait-energy') {
    this.spawnFromQueue()
  }
  if (this.memory.mode === 'wait-energy') {
    this.doWaitEnergy();
  }
  /*if (this.memory.mode === 'er-spawn') {
    this.doErSpawn();
  }*/
}



StructureSpawn.prototype.doWaitEnergy = function() {
  if(this.energy < this.energyCapacity) {
    if (this.memory.call_for_energy) {
      this.memory.call_for_energy = this.memory.call_for_energy + 25
    } else {
      this.memory.call_for_energy = 1
    }
  }
}

StructureSpawn.prototype.doErSpawn = function() {
  if (Finder.findRealCreepCount('harvester', this) === 0 && this.maxHarvesters > 0) {
    Log.info("ER Spawn Harvester")
    this.spawnACreep('harvester', [MOVE, MOVE, CARRY, CARRY, WORK])
  } else if (Finder.findRealCreepCount('miner', this) === 0) {
    Log.info("ER Spawn Miner")
    this.spawnACreep('miner', [MOVE, MOVE, CARRY, CARRY, WORK])
  } else if (Finder.findRealCreepCount('carrier', this) === 0) {
    Log.info("ER Spawn Carrier")
    this.spawnACreep('carrier', [MOVE, MOVE, CARRY, CARRY])
  } else {
    this.setMode('idle')
  }

}

StructureSpawn.prototype.spawnCreeps = function() {

    // What kind of creep
    if (this.harvesters() < this.maxHarvesters()) {
      this.spawnHarvester();
    }
    if (this.builders() < this.maxBuilders()) {
      this.spawnBuilder();
    }
    if (this.miners() < this.maxMiners()) {
      this.spawnMiner();
    }
    if (this.carriers() < this.maxCarriers()) {
      this.spawnCarrier()
    }
    if (this.exoBuilders() < this.maxExoBuilders()) {
      this.spawnExoBuilder()
    }
    if (this.upgraders() < this.maxUpgraders()) {
      this.spawnUpgrader()
    }
    if (this.exoClaimers() < this.maxExoClaimers()) {
      this.spawnExoClaimer()
    }
    if (this.exoReservers() < this.maxExoReservers()) {
      this.spawnExoReserver()
    }
    if (this.exoHarvesters() < this.maxExoHarvesters()) {
      this.spawnExoHarvester()
    }
    if (this.exoAttackers() < this.maxExoAttackers()) {
      this.spawnExoAttacker()
    }
}

StructureSpawn.prototype.addToSpawnQueue = function(role, body,  priority) {
  if(!this.memory.spawn_queue) {
    this.memory.spawn_queue = []
  }
  if(!this.spawning) {
    var array = this.memory.spawn_queue
    array.push({role: role, body: body, priority: priority})
    this.memory.spawn_queue = array
    Log.warn("Spawn Queue is now " + _.size(array) + " long")
    Log.warn("Added a " + role)
  }
}

StructureSpawn.prototype.spawnFromQueue = function() {
  var array = this.memory.spawn_queue
  if (array) {
    array = _.sortBy(array, function(a) {
      a.priority;
    })
    if(array.length > 0) {

      var creep = array[0] //shift()
      Log.info("Trying to Spawn a " + creep.role + " in " + this.room.name)
      if (this.canCreateCreep(creep.body) === 0 && !this.spawning){ // && this.canCreateCreep(creep.body)){
        array.shift()
        this.spawnACreep(creep.role, creep.body)

      } else if(this.canCreateCreep(creep.body) == ERR_INVALID_ARGS) {
        array.shift()
        Log.error("Invalid Creep Body Detected")
      }
    }
    this.memory.spawn_queue = array
  }
}
