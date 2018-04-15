/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-29 19:24:01
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-04-13 00:34:40
*/

'use strict';

Room.prototype.tick = function() {
  if(this.isMine()) {
    this.processAsOwner();
  } else {
    this.processAsGuest();
  }
}

Room.prototype.isMine = function() {
  return this.controller && this.controller.my
}

Room.prototype.processAsGuest = function() {
  Log.error("I don't know what to do!", this)
}

Room.prototype.processAsOwner = function() {
  Log.info("Processing My Room", this)
  this.createNeeds();
}

Room.prototype.createNeeds = function() {
  if (this.needRecovery()) {
    Log.warn("I need recovery", this)
    this.spawnRecovery()
  } else if(this.needMiners()) {
    Log.warn("I need miners", this)
    this.spawnMiner()
  } else if(this.needHaulers()) {
    Log.warn("I need haulers", this)
    this.spawnHauler()
  } else if(this.needUpgraders()) {
    Log.warn("I need upgraders", this)
    this.spawnUpgrader()
  } else if(this.needBuilders()) {
    Log.warn("I need builders", this)
    this.spawnBuilder()
  } else {
    Log.info("All needs met.", this)
  }
}
Room.prototype.needBuilders = function() {
  return Math.count(Finder.builders(this)) < Config.builders[this.level()] && Math.count(Finder.buildSites(this)) > 0
}
Room.prototype.needRecovery = function() {
  return Math.count(Finder.recovery(this)) < 1
}
Room.prototype.needMiners = function() {
  return Math.count(Finder.miners(this)) < Config.miners[this.level()] * Math.count(Finder.sources(this))
}
Room.prototype.needHaulers = function() {
  return Math.count(Finder.haulers(this)) < Config.haulers[this.level()]
}
Room.prototype.needUpgraders = function() {
  return Math.count(Finder.upgraders(this)) < Config.upgraders[this.level()]
}

Room.prototype.level = function() {
  if(this.isMine()) {
    return this.controller.level
  } else {
    return 0
  }
}
Room.prototype.spawnBuilder = function() {
  let spawner = Finder.findIdleSpawner(this)
  if(spawner) {
    spawner.spawnACreep('builder', Config.bodies.builder[this.energyCapacityAvailable])
  }
}
Room.prototype.spawnRecovery = function() {
  let spawner = Finder.findIdleSpawner(this)
  if(spawner) {
    spawner.spawnACreep('recovery', Config.bodies.recovery)
  }
}
Room.prototype.spawnMiner = function() {
  let spawner = Finder.findIdleSpawner(this)
  if(spawner) {
    spawner.spawnACreep('miner', Config.bodies.miner[this.energyCapacityAvailable])
  }
}

Room.prototype.spawnUpgrader = function() {
  let spawner = Finder.findIdleSpawner(this)
  if(spawner) {
    spawner.spawnACreep('upgrader', Config.bodies.upgrader[this.energyCapacityAvailable])
  }
}

Room.prototype.spawnHauler = function() {
  let spawner = Finder.findIdleSpawner(this)
  if(spawner) {
    spawner.spawnACreep('hauler', Config.bodies.hauler[this.energyCapacityAvailable])
  }
}
