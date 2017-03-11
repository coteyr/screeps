/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-29 19:24:01
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-03-11 05:08:30
*/

'use strict';

Room.prototype.tick = function() {
  Log.debug(['Ticking Room:', this.name])
  if(!this.controller) return false
  if(this.controller.my) {
    if(!_.isUndefined(this.memory.attack)){ //} && Finder.findAttackCreeps(this.name).length < Config.bodies[this.memory.tactic]['size']) {
      this.spawnAttackCreep()
    } else if(!_.isUndefined(this.memory.claim)) {
      this.spawnClaimCreep()
    } else if(!_.isUndefined(this.memory.build)) {
      this.spawnRemoteBuildCreep()
    } else if(Finder.findIdleCreeps(this.name).length === 0) {
      this.spawnCreep()
    }
    this.assignCreeps()
    if (Game.time % 2 === 0) this.buildOut()

  }
  this.tickChildren()
  this.attackMoves()
}
Room.prototype.buildOut = function() {
  RoomBuilder.buildPlan(this.name)
  if(this.needExtensions()) this.addExtension()
  if(this.needWalls()) this.addWalls()
  if(this.needRamps()) this.addRamps()
  if(this.needTowers()) this.addTowers()
  if(this.needStorage()) this.addStorage()
  if(this.needExtractor()) this.addExtractor()
  if(this.needTerminal()) this.addTerminal()
  if(this.needLab()) this.addLab()
}
Room.prototype.assignTask = function(task) {
  let creep = _.first(Finder.findIdleCreeps(this.name))
  if(creep) creep.setTask(task)
}
Room.prototype.assignCreeps = function() {
    if(this.needMiners()) this.assignTask('mine')
    if(this.needHaulers()) this.assignTask('haul')
    if(_.isUndefined(this.memory.attack)) {
      if(this.needUpgraders()) this.assignTask("upgrade")
      if(this.needBuilders()) this.assignTask("build")
      if(this.needRepairers()) this.assignTask("repair")
    }
}
Room.prototype.tickChildren = function() {
  _.each(Finder.findCreeps(this.name), c => { c.tick() })
  _.each(Finder.findMyTowers(this.name), t => { t.tick() })
  if(this.controller) this.controller.tick()
}
Room.prototype.spawnCreep = function() {
  Log.info('Spawing a Creep')
  let spawn = Finder.findIdleSpawn(this.name)
  if(spawn) {
    spawn.spawn()
  }
}



Room.prototype.needCreep = function(task, part, partCount, max = 2) {
  let creeps = Finder.findCreepsWithTask(this.name, task)
  if(creeps.length >= max) return false
  let works = 0
  _.each(creeps, c => { works += c.partCount(WORK) })
  return works < partCount
}
Room.prototype.needMiners = function() {
  let sources = Finder.findSources(this.name).length
  return this.needCreep('mine', WORK, sources * 5, 4)
}
Room.prototype.needHaulers = function() {
  let needCarries = (this.energyCapacityAvailable / 2) / 50
  return this.needCreep('haul', CARRY, needCarries, 3)
}
Room.prototype.needBuilders = function() {
  return this.needCreep('build', WORK, Finder.findConstructionSites(this.name).length, 3)
}
Room.prototype.needUpgraders = function() {
  return this.needCreep('upgrade', WORK, 20, 4)
}
Room.prototype.needRepairers = function() {
  return this.needCreep('repair', WORK, 10)
}

Room.prototype.needExtensions = function() {
  if(Finder.findConstructionSites(this.name, STRUCTURE_EXTENSION).length >= Config.maxConstructionSites) return false
  let extensions = Finder.findExtensions(this.name).length
  if(extensions < CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][this.controller.level]) {
    Log.info('I need Extensions')
    return true
  }
}
Room.prototype.needWalls = function() {
  if(Finder.findConstructionSites(this.name, STRUCTURE_WALL).length >= 1) return false
  if(this.controller && this.controller.level < 3) return false
  let walls = Finder.findWalls(this.name)
  let spots = []
  _.each(Storage.read(this.name + '-wall-spots', []), s => {
    if(this.lookForAt(LOOK_STRUCTURES, s.x, s.y).length == 0) {
      if(_.filter(this.lookForAt(LOOK_TERRAIN, s.x, s.y), t => { return t === 'wall' }).length === 0) {
        spots.push({x: s.x, y: s.y})
      }
    }
  })
  return Storage.read(this.name + '-wall-spots', []).length === 0 || spots.length > 0
}
Room.prototype.needRamps = function() {

  if(Finder.findConstructionSites(this.name, STRUCTURE_RAMPART).length >= 1 ) return false
  let ramps = Finder.findMyRamps(this.name).length
  return Storage.read(this.name + '-ramp-spots', []).length === 0 || ramps < Storage.read(this.name + '-ramp-spots', []).length
}

Room.prototype.needTowers = function() {
  if(Finder.findMyTowers(this.name).length >= CONTROLLER_STRUCTURES[STRUCTURE_TOWER][this.controller.level]) return false
  if(Finder.findConstructionSites(this.name, STRUCTURE_TOWER).length >= 1) return false
  return true
}
Room.prototype.needExtractor = function() {
  if(this.controller.level < 6) return false
  if(Finder.findConstructionSites(this.name, STRUCTURE_EXTRACTOR).length >= 1) return false
  return this.controller.level >= 6 && Finder.findExtractor(this.name).length <= 0
}
Room.prototype.needTerminal = function() {
  if(this.controller.level < 6) return false
  if(Finder.findConstructionSites(this.name, STRUCTURE_TERMINAL).length >= 1) return false
  return this.controller.level >= 6 && !this.terminal
}
Room.prototype.needLab = function() {
  if(this.controller.level < 6) return false
  if(Finder.findConstructionSites(this.name, STRUCTURE_LAB).length >= 3) return false
  return this.controller.level >= 6 && Finder.findLabs(this.name).length < 3
}
Room.prototype.needStorage = function() {
  if(Finder.findConstructionSites(this.name, STRUCTURE_STORAGE).length >= 1) return false
  return this.controller.level >= 4 && _.isUndefined(this.storage)
}
Room.prototype.addStructure = function(memoryLocation, structure) {
  let spots = Storage.read (this.name + '-' + memoryLocation, [])
  return RoomBuilder.addConstructionSite(this.name, this.name, spots, structure)
}
Room.prototype.addExtension = function() {
  Log.info('Add Extension')
  return RoomBuilder.addConstructionSite(this.name, 'extension-spots', STRUCTURE_EXTENSION)
}

Room.prototype.addTowers = function() {
  return RoomBuilder.addConstructionSite(this.name, 'extension-spots', STRUCTURE_TOWER)
}
Room.prototype.addStorage = function() {
  return RoomBuilder.addConstructionSite(this.name, 'extension-spots', STRUCTURE_STORAGE)
}
Room.prototype.addExtractor = function() {
  _.each(Finder.findMinirals(this.name), m => {
    this.createConstructionSite(m.pos.x, m.pos.y, STRUCTURE_EXTRACTOR)
  })
}
Room.prototype.addTerminal = function() {
  let spot = this.storage.pos
  this.createConstructionSite(spot.x + 1, spot.y + 1, STRUCTURE_TERMINAL)
  this.createConstructionSite(spot.x - 1, spot.y + 1, STRUCTURE_TERMINAL)
  this.createConstructionSite(spot.x + 1, spot.y - 1, STRUCTURE_TERMINAL)
  this.createConstructionSite(spot.x - 1, spot.y - 1, STRUCTURE_TERMINAL)
  this.createConstructionSite(spot.x + 2, spot.y + 2, STRUCTURE_TERMINAL)
  this.createConstructionSite(spot.x - 2, spot.y + 2, STRUCTURE_TERMINAL)
  this.createConstructionSite(spot.x + 2, spot.y - 2, STRUCTURE_TERMINAL)
  this.createConstructionSite(spot.x - 2, spot.y - 2, STRUCTURE_TERMINAL)
}
Room.prototype.addLab = function() {
  Log.error(Finder.findConstructionSites(this.name, STRUCTURE_LAB).length)
  if(Finder.findLabs(this.name).length === 0 && Finder.findConstructionSites(this.name, STRUCTURE_LAB).length === 0) {
    return RoomBuilder.addConstructionSite(this.name, 'extension-spots', STRUCTURE_LAB)
  } else {
    // labs need to be next to each other
    let spot = null
    if(Finder.findLabs(this.name).length > 0) spot = Finder.findLabs(this.name)[0].pos
    if(Finder.findConstructionSites(this.name, STRUCTURE_LAB).length > 0) spot = Finder.findConstructionSites(this.name, STRUCTURE_LAB)[0].pos
    this.createConstructionSite(spot.x + 1, spot.y + 1, STRUCTURE_LAB)
    this.createConstructionSite(spot.x - 1, spot.y + 1, STRUCTURE_LAB)
    this.createConstructionSite(spot.x + 1, spot.y - 1, STRUCTURE_LAB)
    this.createConstructionSite(spot.x - 1, spot.y - 1, STRUCTURE_LAB)
    this.createConstructionSite(spot.x + 2, spot.y + 2, STRUCTURE_LAB)
    this.createConstructionSite(spot.x - 2, spot.y + 2, STRUCTURE_LAB)
    this.createConstructionSite(spot.x + 2, spot.y - 2, STRUCTURE_LAB)
    this.createConstructionSite(spot.x - 2, spot.y - 2, STRUCTURE_LAB)
  }
}
Room.prototype.addWalls = function() {
  return RoomBuilder.addConstructionSite(this.name, 'wall-spots', STRUCTURE_WALL)
}
Room.prototype.addRamps = function() {
  return RoomBuilder.addConstructionSite(this.name, 'ramp-spots', STRUCTURE_RAMPART)
}
Room.prototype.isFull = function() {
  return this.energyAvailable >= this.energyCapacityAvailable
}
Room.prototype.build = function(roomName) {
  this.memory.build = roomName
}
Room.prototype.claim = function(roomName) {
  this.memory.claim = roomName
}
Room.prototype.attack = function(roomName) {
  this.memory.attack = roomName
}
Room.prototype.tactic = function(tactic) {
  this.memory.tactic = tactic
}
Room.prototype.spawnAttackCreep = function() {
  Log.warn('Spawning attack Creep')
  let tactic = this.memory.tactic
  if(tactic) {
    let spawn = Finder.findIdleSpawn(this.name)
    if(spawn) {
      spawn.spawnAttack(tactic, this.memory.attack)
    }
  }
}
Room.prototype.spawnClaimCreep = function() {
  let spawn = Finder.findIdleSpawn(this.name)
  if(spawn) {
    if(spawn.spawnClaim(this.memory.claim)) {
      delete this.memory.claim
    }
  }
}
Room.prototype.spawnRemoteBuildCreep = function() {
  let spawn = Finder.findIdleSpawn(this.name)
  if(spawn) {
    spawn.spawnRemoteBuild(this.memory.build)
  }
}
Room.prototype.attackMoves = function() {

  let flag = Finder.findFlag(this.name, 'Rally')
  let creeps = Finder.findAttackCreeps(this.name)
  let homeCreeps = _.filter(creeps, c => { return c.memory.home === this.name && c.room.name === this.name})
  let travelCreeps = _.filter(creeps, c => { return c.memory.home !== this.name && this.name !== c.memory.targetRoom && c.room.name === this.name})
  let attackingCreeps = _.filter(creeps, c => { return this.name === c.room.name && this.name === c.memory.targetRoom})

  _.each(homeCreeps, c => {
    if(homeCreeps.length < Config.bodies[this.memory.tactic]['size'] && this.memory.attack) {
      c.moveTo(flag.pos)
    } else {
      if(Config.bodies[this.memory.tactic]['size'] > 0) delete this.memory.attack
      let pos = new RoomPosition(25, 25, c.memory.targetRoom)
      c.moveTo(pos)
    }
  })
  _.each(travelCreeps, c => {
      let pos = new RoomPosition(25, 25, c.memory.targetRoom)
      c.moveTo(pos)
  })


  _.each(attackingCreeps, c => {
    if(c.needsTarget()) c.setTarget(Targeting.findAttackTarget(c.pos))
    if(c.hasTarget()) {
      if(c.attack(c.target()) === ERR_NOT_IN_RANGE) {
        Visualizer.target(c.target())
        c.moveTo(c.target(), {ignoreDestructibleStructures: true})
      }
    }
    try {
    let walls = _.filter(this.lookAtArea(c.pos.y - 1, c.pos.x - 1, c.pos.y + 1, c.pos.x + 1, true), s =>  { return s.type === "structure" && s.structure.structureType === "constructedWall" })//{ Log.info(JSON.stringify(s)) }) //return s.structureType == "constructedWall" }) // s.structureType === STRUCTURE_WALL })
    let smallest = 999999999
    let wall = null
    _.each(walls, w => {
      if(w.structure.hits < smallest) {
        smallest = w.structure.hits
        wall = w.structure
      }
    })
    if(!_.isNull(wall)) c.attack(wall)
  } catch(error) {

  }
  })




}
