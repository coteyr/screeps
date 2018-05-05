/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-29 19:24:01
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-05-02 01:51:26
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
  } else if(this.needClaimers()) {
    Log.warn("Need Claimers")
    this.spawnClaimer()
  } else if (this.needRemoteRecovery()) {
    Log.warn("Need Remote Recovery")
    this.spawnRemoteRecovery()
  } else if(this.needWallers()) {
    Log.warn("I need Wallers")
    this.spawnWaller()
  } else {
    Log.info("All needs met.", this)
  }
}
Room.prototype.needWallers = function() {
  return Math.count(Finder.wallers(this)) < Config.wallers[this.level()]
}
Room.prototype.needBuilders = function() {
  return Math.count(Finder.builders(this)) < Config.builders[this.level()] && Math.count(Finder.buildSites(this)) > 0
}
Room.prototype.needRecovery = function() {
  return Math.count(Finder.recovery(this)) < this.level()
}
Room.prototype.needMiners = function() {
  return Math.count(Finder.miners(this)) < Config.miners[this.level()] * Math.count(Finder.sources(this))
}
Room.prototype.needHaulers = function() {
  return Math.count(Finder.haulers(this)) < Config.haulers[this.level()]
}
Room.prototype.needUpgraders = function() {
  if(this.storage && this.storage.hasBuffer()) {
    return Math.count(Finder.upgraders(this)) < Config.upgraders[this.level()] * 3
  } else {
    return Math.count(Finder.upgraders(this)) < Config.upgraders[this.level()]
  }
}
Room.prototype.needClaimers = function() {
  return Math.count(Finder.flag('Claim')) >= 1 && Math.count(Finder.claimers()) === 0
}
Room.prototype.needRemoteRecovery = function() {
  let flag = _.first(Finder.flag('Claim'))
  if(!flag) return false
  let room = Game.rooms[flag.pos.roomName]
  return room && Math.count(Finder.recovery(room)) < 2 && Math.count(Finder.remoteRecovery(room)) < 10
}
Room.prototype.level = function() {
  if(this.isMine()) {
    return this.controller.level
  } else {
    return 0
  }
}
Room.prototype.spawnWaller = function() {
  let spawner = Finder.findIdleSpawner(this)
  if(spawner) {
    spawner.spawnACreep('waller', Math.getBody(Config.bodies.waller, this.energyCapacityAvailable))
  }
}
Room.prototype.spawnBuilder = function() {
  let spawner = Finder.findIdleSpawner(this)
  if(spawner) {
    spawner.spawnACreep('builder', Math.getBody(Config.bodies.builder, this.energyCapacityAvailable))
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
    spawner.spawnACreep('miner', Math.getBody(Config.bodies.miner, this.energyCapacityAvailable))
  }
}

Room.prototype.spawnUpgrader = function() {
  let spawner = Finder.findIdleSpawner(this)
  if(spawner) {
    spawner.spawnACreep('upgrader', Math.getBody(Config.bodies.upgrader, this.energyCapacityAvailable))
  }
}

Room.prototype.spawnHauler = function() {
  let spawner = Finder.findIdleSpawner(this)
  if(spawner) {
    spawner.spawnACreep('hauler', Math.getBody(Config.bodies.hauler, this.energyCapacityAvailable))
  }
}
Room.prototype.spawnClaimer = function() {
  let spawner = Finder.findIdleSpawner(this)
  let flag = _.first(Finder.flag('Claim'))
  if(flag && spawner) {
    spawner.spawnACreep('claimer', Config.bodies.claimer, flag.pos.roomName)
  }
}
Room.prototype.spawnRemoteRecovery = function() {
  let spawner = Finder.findIdleSpawner(this)
  let flag = _.first(Finder.flag('Claim'))
  if(flag && spawner) {
    Log.debug(flag.pos.roomName)
    spawner.spawnACreep('recovery', Config.bodies.recovery, flag.pos.roomName)
  }
}
