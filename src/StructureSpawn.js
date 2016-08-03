/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 05:53:53
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-02 20:27:50
*/

'use strict';

StructureSpawn.prototype.tick = function() {
  Log.debug('Ticking Spawn: ' + this.name + ' Mode: ' + this.mode() + " - " + this.memory.refresh_count);
  this.promoteCreeps();
  this.assignMode();
  if(!this.spawning) {
    this.spawnCreeps();
  }
  this.doWork();

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

StructureSpawn.prototype.getCount = function(role) {
  return Finder.findCreepCount(role, this)
}

StructureSpawn.prototype.getMaxCount = function(role) {
  return this.memory['max_' + role]
}

StructureSpawn.prototype.setCount = function(role) {
  var count = Finder.findCreeps(role, this.room.name).length;
  this.memory['current_' + role] = count;
  return count;
}

StructureSpawn.prototype.setMaxCount = function(role) {
  role = ROLES[_.findIndex(ROLES, {role: role})]
  if (!role) {
    Log.error('Can not find role: ' + role)
    return 0;
  }
  var max = role.multiplyer;
  if(typeof role.multiplyer === 'function') {
    max = eval('role.multiplyer(this)');
  }
  this.memory['max_' + role.role] = max
  return max
}

StructureSpawn.prototype.promoteCreeps = function() {
  if(Finder.findRealCreepCount('harvester', this) >  this.getMaxCount('harvesters')) {
    this.promote('harvester', 'carrier')
  }

  /*if(this.builders() > this.maxBuilders()) {
    this.promote('builder', 'harvester')
  }*/
}
StructureSpawn.prototype.spawnACreep = function(role, body)  {
  this.room.cleanCreeps()
  Log.info("Spawning A " + role + " in " + this.room.name)
  if(Memory.creeper) {
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

    var spawn = this
    EXOROLES.forEach(function(role) {
      spawn.setExoCount(role.role)
      spawn.setMaxExoCount(role.role, role.arrayName, role.multiplyer)
    })
    ROLES.forEach(function(role) {
      spawn.setCount(role.role)
      spawn.setMaxCount(role.role)
    })

    this.memory.refresh_count = 10;
  }
  this.memory.refresh_count -= 1;
}

StructureSpawn.prototype.assignMode = function() {
  if(this.modeIs('idle')) {
    if (this.energy < this.energyCapacity) {
      this.setMode('wait-energy')
    } else {
      this.setMode('idle')
    }
  } else if (this.modeIs('spawning') && !this.spawning) {
      this.setMode('idle')
  }
  if (Finder.findRealCreepCount('harvester', this) === 0 && Finder.findRealCreepCount('miner', this) === 0 && Finder.findRealCreepCount('big-miner', this) === 0) {
    this.setMode('er-spawn')
    console.log('1')
  }
}

StructureSpawn.prototype.doWork = function() {
  if((this.mode() === 'idle' || this.mode() === 'wait-energy') && !this.spawning) {
    this.spawnFromQueue()
  }
  if (this.mode() === 'wait-energy') {
    this.doWaitEnergy();
  }
  if(this.modeIs('er-spawn')) {
    this.doErSpawn()
  }
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
  if(this.room.energyCapacity() > 300) {
    /*if (Finder.findRealCreepCount('harvester', this) === 0 && Finder.findRealCreepCount('miner', this) === 0 && Finder.findRealCreepCount('big-miner', this)) {
      // no energy producers
      Log.info("ER Spawn Harvester")
      this.spawnACreep('harvester', [MOVE, MOVE, CARRY, CARRY, WORK])
    } else if (Finder.findRealCreepCount('carrier', this) === 0) {
      Log.info("ER Spawn Carrier")
      this.spawnACreep('carrier', [MOVE, MOVE, CARRY, CARRY])
    } else {
      this.setMode('idle')
    }
  }*/
    console.log('2')
    if(!this.spawning) {
      if(Finder.findRealCreepCount('harvester', this) + Finder.findRealCreepCount('carrier', this) < 4){
        this.spawnACreep('harvester', [MOVE, MOVE, CARRY, CARRY, WORK])
      } else if(Finder.findRealCreepCount('miner', this) < 2) {
        this.spawnACreep('miner', [MOVE, CARRY, WORK, WORK])
      } else if(Finder.findRealCreepCount('carrier', this) < 2){
        this.spawnACreep('carrier', [MOVE, MOVE, CARRY, CARRY])
      } else {
        this.setMode('idle')
      }
    }
  }

}

StructureSpawn.prototype.spawnCreeps = function() {
  // What kind of creep
  var spawner = this
  ROLES.forEach(function(role){
    if(spawner.getCount(role.role) < spawner.getMaxCount(role.role)) {
      spawner.addToSpawnQueue(role.role, role.body, role.priority)
    }
  })
  EXOROLES.forEach(function(role) {
    if (spawner.getExoCount(role.role) < spawner.getMaxExoCount(role.role)) {
      spawner.addToSpawnQueue(role.role, role.body, role.priority)
    }
  })
}

StructureSpawn.prototype.addToSpawnQueue = function(role, body,  priority) {
  if(!this.memory.spawn_queue) {
    this.memory.spawn_queue = []
  }
  if(!this.spawning) {
    if(typeof body === 'function') {
      body = eval('body(this)');
    }

    var p = priority

    var total = Finder.findCreepCount(role, this)
    p = p + total

    var array = this.memory.spawn_queue
    array.push({role: role, body: body, priority: p})
    array = _.sortBy(array, function(a) {
      return a.priority;
    })
    this.memory.spawn_queue = array
    Log.warn("Spawn Queue is now " + _.size(array) + " long")
    Log.warn("Added a " + role)
  }
}

StructureSpawn.prototype.spawnFromQueue = function() {
  var array = this.memory.spawn_queue
  if (array) {
    array = _.sortBy(array, function(a) {
      return a.priority;
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

StructureSpawn.prototype.clearSpawn = function() {
  delete this.memory.spawn_queue
  this.memory.spawn_queue = []
}
