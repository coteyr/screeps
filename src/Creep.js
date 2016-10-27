/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:04:38
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-10-25 01:21:26
*/

'use strict';

Creep.prototype.tick = function(){
  try {
  if(this.memory.role == 'miner') {
    _.merge(Creep.prototype, MinerCreep.prototype)
    this.tickCreep()
  } else if(this.memory.role == 'carrier') {
    _.merge(Creep.prototype, CarrierCreep.prototype)
    this.tickCreep()
  } else if(this.memory.role == 'builder') {
    _.merge(Creep.prototype, BuilderCreep.prototype)
    this.tickCreep()
  } else if(this.memory.role == 'big-miner') {
    _.merge(Creep.prototype, BigMinerCreep.prototype)
    this.tickCreep()
  } else if(this.memory.role == 'peddler') {
    _.merge(Creep.prototype, PeddlerCreep.prototype)
    this.tickCreep()
  } else if(this.memory.role == 'harvester') {
    _.merge(Creep.prototype, HarvesterCreep.prototype)
    this.tickCreep()
  } else if(this.memory.role == 'upgrader') {
    _.merge(Creep.prototype, UpgraderCreep.prototype)
    this.tickCreep()
  } else if(this.memory.role == 'repairer') {
    _.merge(Creep.prototype, RepairerCreep.prototype)
    this.tickCreep()
  } else if(this.memory.role == 'excavator') {
    _.merge(Creep.prototype, ExcavatorCreep.prototype)
    this.tickCreep()
  } else if(this.memory.role == 'exo-attacker') {
    _.merge(Creep.prototype, ExoAttacker.prototype)
    this.tickCreep()
  } else if(this.memory.role == 'exo-builder') {
    _.merge(Creep.prototype, ExoBuilder.prototype)
    this.tickCreep()
  } else if(this.memory.role == 'exo-carrier') {
    _.merge(Creep.prototype, ExoCarrier.prototype)
    this.tickCreep()
  } else if(this.memory.role === 'wall-d') {
    _.merge(Creep.prototype, WallDCreep.prototype)
    this.tickCreep()
  } else {
    this.setHome()
    if(!this.spawning) {
      Log.debug('Ticking creep: ' + this.name + " Role: " + this.memory.role + " Mode: " + this.mode(), this.room, this);
      this.assignTasks()
      this.checkForAging()
      this.doWork();
    }
  }
  } catch(error) {
    Log.error(this.name + " HAS AN ERROR")
    Log.error(error.message)
    Log.error("Line: " + error.stack)
    Log.error("Role: " + this.memory.role + " Mode: " + this.mode())
    Log.error(JSON.stringify(this.memory))
    this.room.resetMemory();
    this.setMode(null)
    delete this.memory.state
  }
}



Creep.prototype.checkForAging = function() {
  if(this.ticksToLive < 100 && (this.room.name === this.memory.home || !this.memory.home) && Finder.findContainerCount(this.room.name)) {
    this.setMode('recycle')
  }
}

Creep.prototype.assignTasks = function() {
  if(this.isExoCreep()) {
    if(Game.cpu.bucket > 500 || Game.cpu.getUsed() <= (Game.cpu.limit * 0.95)) {
        this.assignExoTasks()
    } else {
      Log.warn("Skipping Exo-Tasks to build bucket", this.room, this)
    }

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
  if(this.mode() !== 'transition' && this.mode() !== 'leave' && this.mode() !== 'respond') {
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

Creep.prototype.moveCloseTo = function(x, y, range = 0, creep) {
  if(!creep) {
    //if(this.memory.there && this.memory.there > Game.time) return true
    var distance = this.pos.getRangeTo(x, y)
    if(distance <= range) {
      //this.memory.there = Game.time + 5
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
    // if(result === -2) this.move(Memory.dance_move) // no path
    return result
  }
}


Creep.prototype.doRecycle = function() {
  var spot = Targeting.findClosestContainer(this.pos, this.room)
  if(spot){
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

Creep.prototype.getCloseAndAction = function(target, action, range = 1) {
  if(this.moveCloseTo(target.pos.x, target.pos.y, range)) {
    action
    return true
  }
}

Creep.prototype.dumpResources = function(target) {
  var creep = this
  Object.keys(this.carry).forEach(function(key, index) {
      if(creep.carry[key] > 0) {
        if(target) {
          if(creep.transfer(target, key) !== 0) creep.drop(key)
          if(target.isFull()) creep.drop(key)
        } else {
          creep.drop(key)
        }
      }
  }, this.carry);
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

Creep.prototype.orignalMoveTo = Creep.prototype.moveTo

Creep.prototype.moveTo = function(first, second, options) {
  if(this.hasPart(WORK) && this.hasSome()) {
    var road = Targeting.findRoadUnderneath(this.pos)
    if(road && road.hits < road.hitsMax) this.repair(road)
  }
  this.orignalMoveTo(first, second, options)
}

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
