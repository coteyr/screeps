/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-29 19:24:01
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-07-03 01:39:22
*/

'use strict';

Room.prototype.tick = function() {
  if(this.isMine()) {
    this.processAsOwner();
  } else {
    this.processAsGuest();
  }
  this.processThreat()
}
Room.prototype.processThreat = function() {
  let threat = Detector.threat(this)
  if(threat > 0) {
    this.visual.rect(0,0,49, 49, {stroke: Config.colors.red, strokeWidth: 1, fill: null, })
    this.visual.text("Threat: " + threat, 2, 0.25)
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
  if(Game.time % 10 == 0 ) {
    Detector.minersSharing(this)
  }
}

Room.prototype.createNeeds = function() {
  if(this.needDefenders()) {
    Log.warn("I need defenders", this)
    this.spawnDefender()
  } else if (this.needRecovery()) {
    Log.warn("I need recovery", this)
    this.spawnRecovery()
  } else if(this.needMiners()) {
    Log.warn("I need miners", this)
    this.spawnMiner()
  } else if(this.needLinkers()) {
    Log.warn("I need linkers", this)
    this.spawnLinker()
  } else if(this.needHaulers()) {
    Log.warn("I need haulers", this)
    this.spawnHauler()
  } else if(this.needUpgraders()) {
    Log.warn("I need upgraders", this)
    this.spawnUpgrader()
  } else if(this.needBuilders()) {
    Log.warn("I need builders", this)
    this.spawnBuilder()
  } else if(this.needExtractors()) {
    Log.warn("I need extractors", this)
    this.spawnExtractor()
  } else if(this.needClaimers()) {
    Log.warn("Need Claimers")
    this.spawnClaimer()
  } else if (this.needRemoteRecovery()) {
    Log.warn("Need Remote Recovery")
    this.spawnRemoteRecovery()
  } else if(this.needAttackers()) {
    Log.warn("I Need Attacker")
    this.spawnAttacker()
  } else if(this.needWallers()) {
    Log.warn("I need Wallers")
    this.spawnWaller()
  } else {
    Log.info("All needs met.", this)
  }
}
Room.prototype.needDefenders = function() {
  if(this.memory.threat < 10000) return false
  if(this.memory.threat < 20000 && Maths.count(Finder.defender(this)) < 1) return true
  return false
}
Room.prototype.needExtractors = function() {
  return this.level() >= 6 && Finder.minerals(this).mineralAmount > 0 && Maths.count(Finder.extractors(this)) < 1
}
Room.prototype.needWallers = function() {
  return Maths.count(Finder.wallers(this)) < Config.wallers[this.level()]
}
Room.prototype.needBuilders = function() {
  return Maths.count(Finder.builders(this)) < Config.builders[this.level()] && Maths.count(Finder.buildSites(this)) > 0
}
Room.prototype.needRecovery = function() {
  if (this.level() <= 2) {
    return Maths.count(Finder.recovery(this)) < 4
  } else {
    return Maths.count(Finder.recovery(this)) < 4 && (Maths.count(Finder.miners(this)) < 1 || Maths.count(Finder.haulers(this)) < 1)
  }
}
Room.prototype.needMiners = function() {
  return Maths.count(Finder.miners(this)) < Config.miners[this.level()] * Maths.count(Finder.sources(this))
}
Room.prototype.needHaulers = function() {
  if(Maths.count(Finder.links(this)) >= 2) {
    return Maths.count(Finder.haulers(this)) < 1
  } else {
    return Maths.count(Finder.haulers(this)) < Config.haulers[this.level()]
  }
}
Room.prototype.needLinkers = function() {
  if(Maths.count(Finder.links(this)) >= 2) {
    return Maths.count(Finder.linkers(this)) < 1
  } else {
    return false
  }
}
Room.prototype.needUpgraders = function() {
  if(this.storage && this.storage.hasBuffer()) {
    return Maths.count(Finder.upgraders(this)) < Config.upgraders[this.level()] * 3
  } else {
    return Maths.count(Finder.upgraders(this)) < Config.upgraders[this.level()]
  }
}
Room.prototype.needAttackers = function() {
  return Maths.count(Finder.flag("Attack")) >=1 //The count check depends on the stratagem
}
Room.prototype.needClaimers = function() {
  return Maths.count(Finder.flag('Claim')) >= 1 && Maths.count(Finder.claimers()) === 0
}
Room.prototype.needRemoteRecovery = function() {
  let flag = _.first(Finder.flag('Claim'))
  if(!flag) return false
  let room = Game.rooms[flag.pos.roomName]
  return room && Maths.count(Finder.recovery(room)) < 2 && Maths.count(Finder.remoteRecovery(room)) < 20
}
Room.prototype.level = function() {
  if(this.isMine()) {
    return this.controller.level
  } else {
    return 0
  }
}
Room.prototype.spawnExtractor = function() {
  let spawner = Finder.findIdleSpawner(this)
  if(spawner) {
    spawner.spawnACreep('extractor', Config.bodies.extractor)
  }
}
Room.prototype.spawnWaller = function() {
  let spawner = Finder.findIdleSpawner(this)
  if(spawner) {
    spawner.spawnACreep('waller', Maths.getBody(Config.bodies.waller, this.energyCapacityAvailable))
  }
}
Room.prototype.spawnBuilder = function() {
  let spawner = Finder.findIdleSpawner(this)
  if(spawner) {
    spawner.spawnACreep('builder', Maths.getBody(Config.bodies.builder, this.energyCapacityAvailable))
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
    spawner.spawnACreep('miner', Maths.getBody(Config.bodies.miner, this.energyCapacityAvailable))
  }
}

Room.prototype.spawnUpgrader = function() {
  let spawner = Finder.findIdleSpawner(this)
  if(spawner) {
    spawner.spawnACreep('upgrader', Maths.getBody(Config.bodies.upgrader, this.energyCapacityAvailable))
  }
}

Room.prototype.spawnHauler = function() {
  let spawner = Finder.findIdleSpawner(this)
  if(spawner) {
    spawner.spawnACreep('hauler', Maths.getBody(Config.bodies.hauler, this.energyCapacityAvailable))
  }
}
Room.prototype.spawnLinker = function() {
  let spawner = Finder.findIdleSpawner(this)
  if(spawner) {
    spawner.spawnACreep('linker', Config.bodies.linker)
  }
}
Room.prototype.spawnClaimer = function() {
  let spawner = Finder.findIdleSpawner(this)
  let flag = _.first(Finder.flag('Claim'))
  if(flag && spawner) {
    spawner.spawnACreep('claimer', Config.bodies.claimer, flag.pos.roomName)
  }
}
Room.prototype.spawnAttacker = function() {
  let spawner = Finder.findIdleSpawner(this)
  let flag = _.first(Finder.flag('Attack'))
  if(flag && spawner) {
    if(flag.color === COLOR_RED && flag.secondaryColor === COLOR_RED) {
      spawner.spawnACreep('attacker', Config.bodies.swarmer, flag.pos.roomName, 'swarm')
    }
  }
}
Room.prototype.spawnRemoteRecovery = function() {
  let spawner = Finder.findIdleSpawner(this)
  let flag = _.first(Finder.flag('Claim'))
  if(flag && spawner) {
    spawner.spawnACreep('recovery', Config.bodies.recovery, flag.pos.roomName)
  }
}
Room.prototype.spawnDefender = function() {
  let spawner = Finder.findIdleSpawner(this)
  if(this.memory.threat > 5000 && this.memory.threat < 10000) {
    spawner.spawnACreep('defender', Config.bodies.defender)
  }
}
