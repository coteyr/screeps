/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:04:38
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-26 13:31:58
*/

'use strict';

Creep.prototype.tick = function(){
  this.setHome()
  if(!this.spawning) {
    Log.debug('Ticking creep: ' + this.name + " Role: " + this.memory.role + " Mode: " + this.mode(), this.room, this);
    this.assignTasks()
    this.checkForAging()
    this.doWork();
  }
}



Creep.prototype.checkForAging = function() {
  if(this.ticksToLive < 100 && (this.room.name === this.memory.home || !this.memory.home) && _.size(this.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}})) > 0) {
    this.setMode('recycle')
  }
}

Creep.prototype.assignTasks = function() {
  if(this.isExoCreep()) {
    this.assignExoTasks()
  } else {
    this.assignLocalTasks()
  }
}

Creep.prototype.assignLocalTasks = function() {
  if(this.room.name !== this.memory.home) {
    this.setMode('go-home')
  }
  if(this.mode() != 'transition') {
    delete this.memory.exit_dir
    delete this.memory.exit
  }
  if(this.mode() != 'transition' && this.mode() != 'leave' && this.mode() !== 'respond') {
    this.getOffExits()
    this.getOffRamparts()
  }
  if(this.modeIs('idle')) {
    if(this.memory.role !== 'miner' && this.memory.role !== 'big-miner') this.clearTarget()
    var functionName = ('assign_' + this.memory.role + '_tasks').toCamel()
    Caller(this, functionName)
  }
}

Creep.prototype.isExoCreep = function() {
  return this.memory.role && this.memory.role.startsWith('exo-')
}

Creep.prototype.setHome = function(){
  if(!this.memory.home) this.memory.home = this.room.name
}

Creep.prototype.doWork = function() {
  try { // isolate the issue from other creeps
    var functionName = ("do_" + this.mode()).toCamel()
    Caller(this, functionName)
  } catch(error) {
    Log.error(this.name + " HAS AN ERROR")
    Log.error(error.message)
    Log.error("Line: " + error.stack)
    Log.error("Role: " + this.memory.role + " Mode: " + this.mode())
    Log.error(JSON.stringify(this.memory))
    this.room.resetMemory();
  }
}

Creep.prototype.doNoop = function() {
  this.move(Memory.dance_move);
  Log.warn(this.name + " has nothing to do. Wiggle!", this.room, this)
  this.setMode('idle')
}

Creep.prototype.moveCloseTo = function(x, y, range, creep) {
  if(!range) {
    range = 0
  }
  if(!creep) {
    if(this.memory.there && this.memory.there > Game.time) return true
    var distance = this.pos.getRangeTo(x, y)
    if(distance <= range) {
      this.memory.there = Game.time + 5
      return true
    }
  } else {
    var distance = this.pos.getRangeTo(x, y)
    if(distance <= range) return true
  }
  if(this.fatigue) { // Don't do pathing if I can't even move
    Log.debug('Creep is too tired to move ', this.room, this)
    return false
  } else {
    var result = this.moveTo(x, y, {reusePath: distance})
    if(result) Log.warn("Could not move: " + result, this.room, this)
    if(result === -2) this.move(Memory.dance_move) // no path
    return false
  }
}


Creep.prototype.doRecycle = function() {
  var me = this;
  var locations = _.filter(this.room.memory.my_containers, function(object) {
      var structure = Game.getObjectById(object.id)
       return structure.storedEnergy() < structure.possibleEnergy() - me.carry.energy;
  })
  var spots = []
  locations.forEach(function(a){
    spots.push(Game.getObjectById(a.id))
  })
  if (_.size(spots) >= 1) {
    var spot = me.pos.findClosestByRange(spots)
    console.log(JSON.stringify(spot))
    this.getCloseAndAction(spot, 0, this.suicide())
  } else {
    Log.warn(this.name + " has no where to die. Idling")
    this.setMode('idle')
  }
}

Creep.prototype.recycle = function() {
  this.setMode('recycle')
}

Creep.prototype.doIdle = function() {
  Log.warn("doing nothing", this.room, this)
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
      if(creep.carry[key] > 0) {
        creep.transfer(target, key)
        // creep.drop(key)
      }
  }, this.carry);
}

Creep.prototype.callForEnergy = function() {
  if(!this.memory.call_for_energy) this.memory.call_for_energy = 0
  this.memory.call_for_energy += 5
}

Creep.prototype.resetCallForEnergy = function() {
  delete this.memory.call_for_energy
}

Creep.prototype.hasPart = function(part) {
  var doI = false
  this.body.forEach(function(b) {
    if (b.type === part) doI = true
  })
  return doI
}

Creep.prototype.countPart = function(part) {
  var count = 0
  this.body.forEach(function(b) {
    if (b.type === part) count += 1
  })
  return count
}
Creep.prototype.orignalHarvest = Creep.prototype.harvest

Creep.prototype.harvest = function(target) {
  var did = this.orignalHarvest(target)
  if(did === 0) {
    var count = this.countPart('work')
    Memory.harvest_this_tick += count * 2
  }

  return did
}

/*Creep.prototype.orignalTransfer = Creep.prototype.transfer

Creep.prototype.transfer = function(target, resourceType, amount) {
 if(resourceType === RESOURCE_ENERGY && target.structureType === 'extension' || target.structureType === 'spawner') {
    if(!amount) {
      amount = Math.min(this.carry.energy, target.energyCapacity - target.energy);
    }
    this.room.addEnergy(amount)
  }
  return this.orignalTransfer(target, resourceType, amount)
}*/
Creep.prototype.getOffRamparts = function() {
  if(Targeting.findRampartUnderneath(this.pos)) {
    this.moveCloseTo(25, 25, 5)
  }
}

Creep.prototype.sayStuff = function(sayings) {
  if(!this.memory.say_spot) this.memory.say_spot = 0
  this.say(sayings[this.memory.say_spot], true)
  this.memory.say_spot += 1
  if(this.memory.say_spot > (_.size(sayings) - 1)) this.memory.say_spot = 0
}
