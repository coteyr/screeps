/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 05:53:53
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-28 01:53:50
*/

'use strict';
_.merge(StructureSpawn.prototype, EnergyStructure.prototype);

StructureSpawn.prototype.tick = function() {
  Log.debug('Ticking Spawn: ' + this.name + ' Mode: ' + this.mode() + " - " + this.memory.refresh_count);
  this.promoteCreeps();
  this.assignMode();
  if(!this.spawning) {
    this.spawnCreeps();
  }
  this.doWork();

  // this.refreshData();
  Memory.stats["room." + this.room.name + ".spawnQueue"] = _.size(this.memory.spawn_queue)
  if(Game.time % 10 == 0) this.isStarving()


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
  //return this.memory['max_' + role]
  var functionName = ("get_" + role + '_multi').toCamel()
  var max = eval('ROLES.' + functionName + '(this.room)')
  return max
}

/*StructureSpawn.prototype.setCount = function(role) {
  var count = Finder.findCreeps(role, this.room.name).length;
  this.memory['current_' + role] = count;
  return count;
}

StructureSpawn.prototype.setMaxCount = function(role) {
  if (!role) {
    Log.error('Can not find role: ' + role)
    return 0;
  }
  var functionName = ("get_" + role + '_multi').toCamel()
  var max = eval('ROLES.' + functionName + '(this.room)')
  this.memory['max_' + role] = max
  return max
}*/

StructureSpawn.prototype.promoteCreeps = function() {
  if(Finder.findRealCreepCount('harvester', this) >  this.getMaxCount('harvester')) {
    this.promote('harvester', 'carrier')
  }
}
StructureSpawn.prototype.spawnACreep = function(role, body, home, er=false)  {
  this.room.cleanCreeps()
  Log.info("Spawning A " + role + " in " + this.room.name)
  if(Memory.creeper) {
    Memory.creeper += 1
  } else {
    Memory.creeper = 1
  }
  var result = this.createCreep(body, role + "_" + Memory.creeper, {role: role, mode: 'idle', home: home, er: er})
  if(result !== role + "_" + Memory.creeper) {
    Log.error('Problem Spawning Creep: ' + result)
    Log.error(role + ": " + JSON.stringify(body))
  }
}
/*StructureSpawn.prototype.refreshData = function() {
  if(!this.memory.refresh_count || this.memory.refresh_count <= 0) {

    var spawn = this
    EXOROLES.getRoles(this.room.energyCapacityAvailable).forEach(function(role) {
      spawn.setExoCount(role.role)
      spawn.setMaxExoCount(role.role, role.arrayName, 'EXOROLES')
    })
    if(this.room.hasTactic()) {
      ARMY[this.room.tactic()].roles.forEach(function(role) {
        spawn.setExoCount(role.role)
        spawn.setMaxExoArmyCount(role.role, role.arrayName, role.multiplyer)
      })
    }
    ROLES.getRoles(this.room.energyCapacityAvailable).forEach(function(role) {
      spawn.setCount(role.role)
      spawn.setMaxCount(role.role)
    })

    this.memory.refresh_count = 10;
  }
  this.memory.refresh_count -= 1;
}*/

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
  if (this.room.energyCapacityAvailable > 300 && Finder.findRealCreepCount('harvester', this) === 0 && Finder.findRealCreepCount('miner', this) === 0 && Finder.findRealCreepCount('big-miner', this) === 0) {
    this.setMode('er-spawn')
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
    if(!this.spawning) {
      if(Finder.findRealCreepCount('harvester', this) + Finder.findRealCreepCount('carrier', this) < 2){
        this.spawnACreep('harvester', [MOVE, MOVE, CARRY, CARRY, WORK], this.room.name, true)
      } else if(Finder.findRealCreepCount('miner', this) < 2) {
        this.spawnACreep('miner', [MOVE, CARRY, WORK, WORK], this.room.name, true)
      } else if(Finder.findRealCreepCount('carrier', this) < 2){
        this.spawnACreep('carrier', [MOVE, MOVE, CARRY, CARRY], this.room.name, true)
      } else {
        this.setMode('idle')
      }
    }
  }

}

StructureSpawn.prototype.spawnCreeps = function() {
  // What kind of creep
  var spawner = this
  ROLES.getRoles(this.room.energyCapacityAvailable).forEach(function(role){
    if(spawner.getCount(role.role) < spawner.getMaxCount(role.role)) {
      spawner.addToSpawnQueue(role.role, BodyBuilder.buildBody(role.body, spawner.room.energyCapacityAvailable, true, false, true), role.priority)
    }
  })
  EXOROLES.getRoles(this.room.energyCapacityAvailable).forEach(function(role) {
    if (spawner.getExoCount(role.role) < spawner.getMaxExoCount(role, 'EXOROLES')) {
      spawner.addToSpawnQueue(role.role, BodyBuilder.buildBody(role.body, spawner.room.energyCapacityAvailable, true, false, false), role.priority)
    }
  })
  if(this.room.hasTactic()) {
    ARMY[this.room.tactic()].roles.forEach(function(role) {
      if (spawner.getExoCount(role.role) < spawner.getMaxExoArmyCount(role, 'ARMY')) {
        spawner.addToSpawnQueue(role.role, role.body, role.priority)
      }
    })
  }
}

StructureSpawn.prototype.addToSpawnQueue = function(role, body,  priority) {
  if(!this.spawning) {
    if(typeof body === 'function') {
      body = eval('body(this)');
    }
    if(!Memory.spawn_queue) global.clearSpawnQueue()
    var array = Memory.spawn_queue
    array.push({role: role, body: body, priority: priority, room: this.room.name, id: Game.time + '-' + this.id + '-' + Math.random()})
    array = _.sortBy(array, function(a) {
      return a.priority;
    })
    Memory.spawn_queue = array
    Log.warn("Spawn Queue is now " + _.size(array) + " long")
    Log.warn("Added a " + role)
  }
}

StructureSpawn.prototype.spawnFromQueue = function() {
  var array = Memory.spawn_queue
  var spawner = this;
  if (array) {
    array = _.sortBy(array, function(a) {
      return a.priority;
    })

    if(array.length > 0) {
      var creep = array[0]
      if(!global.globalSpawn()) {
        var newArray = _.filter(array, function(c) { return c.room === spawner.room.name })
        creep = newArray[0]
      } else {
        array - _.sortBy(array, function(a){
          var o = a.priority;
          if(a.room !== spawner.room.name) o+= 500
          return o
        })
        var newArray = _.filter(array, function(c) { return BodyBuilder.getCost(c.body) <= spawner.room.energyCapacityAvailable })
        creep = newArray[0]
      }
      if(!creep) return false
      Log.info("Trying to Spawn a " + creep.role + " in " + this.room.name)
      if (this.canCreateCreep(creep.body) === 0 && !this.spawning){ // && this.canCreateCreep(creep.body)){
        _.remove(array, function(c) {
          return c.id === creep.id
        })
        this.spawnACreep(creep.role, creep.body, creep.room)

      } else if(this.canCreateCreep(creep.body) == ERR_INVALID_ARGS) {
        _.remove(array, function(c) {
          return c.id === creep.id
        })
        Log.error("Invalid Creep Body Detected")
      }
    }
  }
  Memory.spawn_queue = array
}

StructureSpawn.prototype.clearSpawn = function() {
  delete Memory.spawn_queue
  Memory.spawn_queue = []
}

StructureSpawn.prototype.isStarving = function() {
  var spawner = this
  var roomQueue
  if(!global.globalSpawn()) {
    roomQueue = _.filter(Memory.spawn_queue, function(c) { return c.room === spawner.room.name })
  } else {
    roomQueue =  _.filter(Memory.spawn_queue, function(c) { return BodyBuilder.getCost(c.body) <= spawner.room.energyCapacityAvailable })
  }
  var totalCostOfQueue = 0
  var totalPartsInQueue = 0
  roomQueue.forEach(function(q){
    totalCostOfQueue += BodyBuilder.getCost(q.body)
    totalPartsInQueue += _.size(q.body)
  })
  // Log.warn("Spawner " + this.name + " is going to starve the room! ", this, this.room)
  if(totalCostOfQueue > (this.room.maxEnergy() * 5 * 0.85)) {
    Log.warn("Energy consumption is greater then 85% of room: " + totalCostOfQueue + " of " +  (this.room.maxEnergy() * 5), this, this.room)
  }
  if(totalPartsInQueue > 500) {
    Log.warn("It will take longer to spawn all creeps then the first spawned creep would live! " + totalPartsInQueue)
  }
}
