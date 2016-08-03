/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:04:38
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-02 16:25:30
*/

'use strict';

Creep.prototype.tick = function(){
  this.setHome()
  if(!this.spawning) {
    Log.debug('Ticking creep: ' + this.name + " Role: " + this.memory.role + " Mode: " + this.mode());
    if(this.memory.role && this.memory.role.startsWith('exo-')) {
      this.assignExoTasks()
    } else {
      var functionName = ('assign_' + this.memory.role + '_tasks').toCamel()
      Caller(this, functionName)
    }
    /*if (this.memory.role === 'harvester') {
      this.assignHarvesterTasks()
    } else if (this.memory.role === 'miner') {
      this.assignMinerTasks()
    } else if (this.memory.role === 'carrier') {
      this.assignCarrierTasks()
    } else if (this.memory.role === 'upgrader') {
      this.assignUpgraderTasks()
    } else if (this.memory.role === 'builder') {
      this.assignBuilderTasks()
    } else if (this.memory.role === 'demo') {
      this.assignDemoTasks()
    } else if (this.memory.role === 'big-miner') {
      this.assignBigMinerTasks()
    }*/

    /*if(this.ticksToLive < 200 && this.room.energyAvailable >= (this.room.energyCapacity() * 0.25)) {
      this.setMode('recharge')
    }*/
    if(this.ticksToLive < 100 && (this.room.name === this.memory.home || !this.memory.home)) { // && _.size(this.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}})) > 0) {
      this.setMode('recycle')
    }
    this.doWork();
    if (this.modeIs('idle')) {
      Memory.stats["room." + this.room.name + ".idlers"] += 1
    }
  }
}

Creep.prototype.setHome = function(){
  if(!this.memory.home) {
    this.memory.home = this.room.name
  }
}

Creep.prototype.doWork = function() {


  try { // isolate the issue from other creeps
    var functionName = ("do_" + this.mode()).toCamel()
    Caller(this, functionName)
  } catch(error) {
    Log.error(this.name + " HAS AN ERROR")
    Log.error(error.message)
    Log.error("Role: " + this.memory.role + " Mode: " + this.mode())
    this.room.resetMemory();
  }
}

Creep.prototype.doNoop = function() {
  this.move(Memory.dance_move);
  Log.warn(this.name + " has nothing to do. Wiggle!")
  if(this.memory.role === 'harvester') {
    this.setMode('send')
  } else {
    this.setMode('idle')
  }
}

Creep.prototype.doRecharge = function() {
  var creep = this;
  Object.keys(this.room.memory.my_spawns).forEach(function(key, index) {
      var spawn = Game.getObjectById(creep.room.memory.my_spawns[key].id);
      if(spawn.energy > 0) {
        spawn.memory.mode === 'recharge'
        if(creep.moveCloseTo(spawn.pos.x, spawn.pos.y, 1)) {
          creep.transfer(spawn, RESOURCE_ENERGY)
          spawn.renewCreep(creep)
          if(creep.ticksToLive >= 1400) {
            creep.memory.mode = 'idle'
            spawn.memory.mode = 'idle'
          }
        }
      }
    }, this.memory.my_spawns);
  if (this.room.energyAvailable <= 100) {
    this.setMode('idle')
  }
}

Creep.prototype.moveCloseTo = function(x, y, range, ignoreStuff) {
  if(this.fatigue) { // Don't do pathing if I can't even move
    Log.debug('Creep is too tired to move ' + " Creep: " + this.name + " Room: " + this.room.name)
    Memory.stats["room." + this.room.name + ".bad_moves"] += 1
    return false
  }
  if(!range) {
    range = 0
  }
  if(this.pos.inRangeTo(x, y, range)) {
    return true
  } else {
    var distance = this.pos.getRangeTo(x, y)
    var result = this.moveTo(x, y, {reusePath: distance})
    if(result) {
      Log.warn("Could not move: " + result  + " Creep: " + this.name + " Room: " + this.room.name)
    }
    return false
  }
}


Creep.prototype.doRecycle = function() {
  var me = this;
  var spots = _.filter(this.room.memory.my_containers, function(object) {
      var structure = Game.getObjectById(object.id)
      // Log.info(JSON.stringify(structure))
      return structure.storedEnergy() < structure.possibleEnergy() - me.carry.energy;
  })
  if (_.size(spots) >= 1) {
    if (this.moveCloseTo(spots[0].pos.x, spots[0].pos.y , 0)) {
       this.suicide()
    }
  } else {
    Log.warn(this.name + " has no where to die. Idling")
    this.setMode('idle')
  }
}

Creep.prototype.recycle = function() {
  this.setMode('recycle')
}

Creep.prototype.doIdle = function() {
  Log.warn(this.name + " is doing nothing!")
}

