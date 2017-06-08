/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-29 19:24:01
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-05-24 01:03:52
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
    this.buildOut()

  }
  this.tickChildren()
  this.attackMoves()
  Storage.addStat('room-proc')
}
Room.prototype.buildOut = function() {
  RoomBuilder.buildPlan(this.name)
  //if(this.needWalls()) Log.error('I need Walls')
  switch(Game.time % 10) {
    case 1:
      if(this.needExtensions()) this.addExtension()
      break
    case 2:
      if(this.needWalls()) this.addWalls()
      break
    case 3:
      if(this.needRamps()) this.addRamps()
      break
    case 4:
      if(this.needTowers()) this.addTowers()
      break
    case 5:
      if(this.needStorage()) this.addStorage()
      break
    case 6:
      if(this.needExtractor()) this.addExtractor()
      break
    case 7:
      if(this.needTerminal()) this.addTerminal()
      break
    case 8:
      if(this.needLab()) this.addLab()
      break
  }
}
Room.prototype.assignTask = function(task) {
  let creep = _.first(Finder.findIdleCreeps(this.name))
  if(creep) creep.setTask(task)
}
Room.prototype.assignCreeps = function() {
    if(this.needMiners()) this.assignTask('mine')
    if(this.needHaulers()) this.assignTask('haul')
    //if(_.isUndefined(this.memory.attack)) {
    if(this.needBuilders()) this.assignTask("build")
    if(this.needUpgraders()) this.assignTask("upgrade")

    if(this.needRepairers()) this.assignTask("repair")
    //}
}
Room.prototype.tickChildren = function() {
  _.each(Finder.findCreeps(this.name), c => { c.tick() })
  _.each(Finder.findMyTowers(this.name), t => { t.tick() })
  _.each(Finder.findSpawns(this.name), s => { s.tick() })
  if(this.controller) this.controller.tick()
}
Room.prototype.spawnCreep = function() {
  Log.info('Spawning a Creep')
  let spawn = Finder.findIdleSpawn(this.name)
  if(spawn) {
    spawn.spawn()
  }
}



Room.prototype.needCreep = function(task, part, partCount, max = 2) {
  let creeps = Finder.findCreepsWithTask(this.name, task)
  if(creeps.length >= max) return false
  let works = 0
  _.each(creeps, c => { works += c.partCount(part) })
  Log.info(["Need", task, "is", works < partCount])
  return works < partCount
}
Room.prototype.needMiners = function() {
  let sources = Finder.findSources(this.name).length
  return this.needCreep('mine', WORK, sources * 5, 4)
}
Room.prototype.needHaulers = function() {
  let needCarries = (this.energyCapacityAvailable / 2) / 50
  return this.needCreep('haul', CARRY, needCarries, 4)
}
Room.prototype.needBuilders = function() {
  return this.needCreep('build', WORK, Finder.findConstructionSites(this.name).length, 3)
}
Room.prototype.needUpgraders = function() {
  return this.needCreep('upgrade', WORK, 20, 2)
}
Room.prototype.needRepairers = function() {
  return this.needCreep('repair', WORK, 10)
}

Room.prototype.needExtensions = function() {
  let sites = Finder.findConstructionSites(this.name, STRUCTURE_EXTENSION).length
  if( sites >= Config.maxConstructionSites) return false
  let extensions = Finder.findExtensions(this.name).length
  if(extensions + sites < CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][this.controller.level]) {
    Log.info('I need Extensions')
    return true
  }
}
Room.prototype.needWalls = function() {
  // Should _.chunk the spot check
  if(this.controller && this.controller.level < 3) return false
  if(Finder.findConstructionSites(this.name, STRUCTURE_WALL).length >= 1) return false
  let spots = Storage.read(this.name + '-wall-spots', []);
  if (spots.length === 0) return true;
  let walls = Finder.findWalls(this.name)
  if(Game.time % 12 !== 0 && spots.length === walls.length) return false
  let needed = []
  _.each(spots, s => {
    //if(this.lookForAt(LOOK_STRUCTURES, s.x, s.y).length == 0) needed.push({x: s.x, y: s.y})
    if(_.filter(walls, w => { return w.pos.x === s.x && w.pos.y == s.y }).length === 0) needed.push({x: s.x, y: s.y})
  })
  return needed.length > 0
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
  Log.warn('Trying to build a wall', this.name)
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
Room.prototype.attackingCreepMoves = function(attackingCreeps) {
  if(!CpuConservation.haveCpu()) return false
  _.each(attackingCreeps, c => {
    if(Game.rooms[c.memory.home].memory.tactic === 'deny') {
      DenyTactic.doAttack(c, this)
    } else {
      NormalTactic.doAttack(c, this)
    }
  })
}
Room.prototype.homeCreepMoves = function(homeCreeps) {
  if(!CpuConservation.haveCpu()) return false
  let flag = Finder.findFlagByColor(this.name, COLOR_RED, COLOR_RED)
  let opts = {
    reusePath: 5,
    visualizePathStyle: {opacity: 0.75, stroke: Config.colors.red},
    ignoreCreeps: true,
    reusePath: 20
  }
  _.each(homeCreeps, c => {
    if(homeCreeps.length < Config.bodies[this.memory.tactic]['size'] && this.memory.attack) {
      c.moveTo(flag.pos)
    } else {

      if(Config.bodies[this.memory.tactic]['size'] > 0) delete this.memory.attack
      let route = Game.map.findRoute(c.room, c.memory.targetRoom, {routeCallback(roomName, fromRoomName) {
          /*if(roomName == 'W7S87') {  // avoid this room
            return Infinity;
          }*/
          return 1;
      }})
      let exit = c.pos.findClosestByRange(route[0].exit);
      c.moveTo(exit, opts);
    }
  })
}
Room.prototype.travelCreepMoves = function(travelCreeps) {
  if(!CpuConservation.haveCpu()) return false
  let says = ['Lead', 'us', 'for', 'the', 'swarm']
  let opts = {reusePath: 5,
    visualizePathStyle: {opacity: 0.75, stroke: Config.colors.red},
    ignoreCreeps: true,
    reusePath: 20
  }
  _.each(travelCreeps, c => {

    c.say(says[Game.time % 5], true)
      let route = Game.map.findRoute(c.room, c.memory.targetRoom, {routeCallback(roomName, fromRoomName) {
          /*if(roomName == 'W7S87') {  // avoid this room
            return Infinity;
          }*/
          return 1;
      }})
      let exit = c.pos.findClosestByRange(route[0].exit);
      c.moveTo(exit, opts);
  })
}
Room.prototype.attackMoves = function() {
  if(!CpuConservation.haveCpu()) return false
  let creeps = Finder.findAttackCreeps(this.name)
  let homeCreeps = _.filter(creeps, c => { return c.memory.home === this.name && c.room.name === this.name})
  let travelCreeps = _.filter(creeps, c => { return this.name == c.room.name && c.memory.home !== this.name && c.memory.targetRoom !== this.name})
  let attackingCreeps = _.filter(creeps, c => { return this.name === c.room.name && this.name === c.memory.targetRoom})
  this.attackingCreepMoves(attackingCreeps)
  this.travelCreepMoves(travelCreeps)
  this.homeCreepMoves(homeCreeps)

}
