/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:04:38
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-03 21:15:33
*/

'use strict';

Creep.prototype.tick = function(){
  this.setHome()
  if(!this.spawning) {
    Log.debug('Ticking creep: ' + this.name + " Role: " + this.memory.role + " Mode: " + this.mode());
    if(this.memory.role && this.memory.role.startsWith('exo-')) {
      this.assignExoTasks()
    } else {
      if(this.modeIs('idle')) {
        this.clearTarget()
        var functionName = ('assign_' + this.memory.role + '_tasks').toCamel()
        Caller(this, functionName)
      }
    }
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
    Log.error(JSON.stringify(this.memory))
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
  Log.warn(this.name + " is doing nothing in " + this.room.name + "!")
}

Creep.prototype.freshCreep = function() {
  return this.ticksToLive >= 1499
}

Creep.prototype.hasRoom = function() {
  return _.sum(this.carry) < this.carryCapacity
}

Creep.prototype.isFull = function() {
  return !this.hasRoom()
}

Creep.prototype.isEmpty = function() {
  return _.sum(this.carry) <= 0
}

Creep.prototype.hasSome = function() {
  return !this.isEmpty()
}

Creep.prototype.getCloseAndAction = function(target, action, range) {
  if(!range) range = 1
  if(this.moveCloseTo(target.pos.x, target.pos.y, range)) {
    action
    return true
  }
}

Creep.prototype.dumpResources = function(target) {
  var creep = this
  Object.keys(this.carry).forEach(function(key, index) {
      creep.transfer(target, key)
  }, this.carry);
}

Creep.prototype.callForEnergy = function() {
  if(!this.memory.call_for_energy) this.memory.call_for_energy = 0
  this.memory.call_for_energy += 5
}

Creep.prototype.resetCallForEnergy = function() {
  delete this.memory.call_for_energy
}
