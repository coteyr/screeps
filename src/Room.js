/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-29 19:24:01
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-24 17:35:06
*/

'use strict';

Room.prototype.tick = function() {
  Log.debug(['Ticking Room:', this.name])
  if(!this.controller) return false
  if(this.controller.my) {
    if(!_.isUndefined(this.memory.attack) && Finder.findAttackCreeps(this.name).length < 5) {
      this.spawnAttackCreep()
    } else if(Finder.findIdleCreeps(this.name).length === 0) {
      this.spawnCreep()
    }
    this.assignCreeps()
    this.buildOut()
    this.tickChildren()
  }
  this.attackMoves()
}
Room.prototype.buildOut = function() {
  if(this.needExtensions()) this.addExtension()
  if(this.needRoads()) this.addRoads()
  if(this.needWalls()) this.addWalls()
  if(this.needRamps()) this.addRamps()
  if(this.needTowers()) this.addTowers()
  if(this.needStorage()) this.addStorage()
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
  return this.needCreep('upgrade', WORK, 10)
}
Room.prototype.needRepairers = function() {
  return this.needCreep('repair', WORK, 10)
}

Room.prototype.needExtensions = function() {
  if(Finder.findConstructionSites(this.name, STRUCTURE_EXTENSION).length >= Config.maxConstructionSites) return false
  let extensions = Finder.findExtensions(this.name).length
  if(extensions < CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][this.controller.level]) return true
  return Storage.read(this.name + '-extension-spots', []).length === 0 || extensions < Storage.read(this.name + '-extension-spots', []).length
}
Room.prototype.needRoads = function() {
  return false
  if(Finder.findConstructionSites(this.name, STRUCTURE_ROAD).length >= 1) return false
  // do a check for roads need to cache
  return true
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

Room.prototype.needStorage = function() {
  if(Finder.findConstructionSites(this.name, STRUCTURE_STORAGE).length >= 1) return false
  return this.controller.level >= 4 && _.isUndefined(this.storage)
}
Room.prototype.addExtension = function() {
  let extensionSpots = Storage.read(this.name + '-extension-spots', [])
  if(extensionSpots.length === 0) {
    RoomBuilder.buildOutExtensions(this.name)
  } else {
    let spot = 0
    let worked = false
    while (spot < extensionSpots.length && worked == false) {
      worked = (this.createConstructionSite(extensionSpots[spot].x, extensionSpots[spot].y, STRUCTURE_EXTENSION) === OK)
      spot = spot + 1
    }
  }
}

Room.prototype.addRoads = function() {
  let worked = false
  let spawns = Finder.findSpawns(this.name)
  _.each(spawns, spawn => {
    let sources = Finder.findSources(this.name)
    _.each(sources, source => {
      let path = this.findPath(spawn.pos, source.pos, {ignoreCreeps: true})
      let spot = 0
      while(spot < path.length && !worked) {
        worked = this.createConstructionSite(path[spot].x, path[spot].y, STRUCTURE_ROAD) === OK
        spot = spot + 1
      }
    })
  })
  if(!worked){
    let sources = Finder.findSources(this.name)
    _.each(sources, source => {
      let path = this.findPath(this.controller.pos, source.pos, {ignoreCreeps: true})
      let spot = 0
      while(spot < path.length && !worked) {
        worked = this.createConstructionSite(path[spot].x, path[spot].y, STRUCTURE_ROAD) === OK
        spot = spot + 1
      }
    })
  }
}

Room.prototype.addTowers = function() {
  let spawns = Finder.findSpawns(this.name)
  let result = false
  _.each(spawns, s => {
    let x = s.pos.x
    let y = s.pos.y
    while(result === false) {
      x = x + 1
      y = y + 1
      result = (this.createConstructionSite(x, y, STRUCTURE_TOWER) === OK)
    }
  })
  return result
}
Room.prototype.addStorage = function() {
  let x = this.controller.pos.x
  let y = this.controller.pos.y
  let result = false
  while (result === false) {
    x++
    y++
    result = (this.createConstructionSite(x, y, STRUCTURE_STORAGE) === OK)
  }
  return result
}

Room.prototype.addWalls = function() {
  Log.info("Should add walls")
  let spots = Storage.read(this.name + '-wall-spots', [])
  Log.warn(spots.length)
  if(spots.length === 0) {
    RoomBuilder.addWalls(this.name)
    RoomBuilder.addRamps(this.name)
    return true
  } else {
    let pos = 0
    let worked = false

    while(pos < spots.length && worked === false) {
      worked = (this.createConstructionSite(spots[pos].x, spots[pos].y, STRUCTURE_WALL) === OK)
      pos = pos + 1
    }
    return worked
  }
}
Room.prototype.addRamps = function() {
  let ramps = Storage.read(this.name + '-ramp-spots', [])
  _.each(ramps, r => { this.createConstructionSite(r.x, r.y, STRUCTURE_RAMPART) })
}
Room.prototype.isFull = function() {
  return this.energyAvailable >= this.energyCapacityAvailable
}
Room.prototype.attack = function(roomName) {
  this.memory.attack = roomName
}
Room.prototype.tactic = function(tactic) {
  this.memory.tactic = tactic
}
Room.prototype.spawnAttackCreep = function() {
  let tactic = this.memory.tactic
  if(tactic && tactic === 'small') {
    let spawn = Finder.findIdleSpawn(this.name)
    if(spawn) {
      spawn.spawnAttack(tactic, this.memory.attack)
    }
  }
}
Room.prototype.attackMoves = function() {
  let flag = Finder.findFlag(this.name, 'Rally')
  let creeps = Finder.findAttackCreeps(this.name)
  let homeCreeps = _.filter(creeps, c => { return c.memory.home === this.name && c.room.name === this.name})
  let attackingCreeps = _.filter(creeps, c => { return this.name === c.room.name && this.name === c.memory.targetRoom})

  _.each(homeCreeps, c => {
    if(homeCreeps.length < 5 && this.memory.attack) {
      c.moveTo(flag.pos)
    } else {
      delete this.memory.attack
      let pos = new RoomPosition(25, 25, c.memory.targetRoom)
      c.moveTo(pos)
    }
  })

  _.each(attackingCreeps, c => {
    if(c.needsTarget()) c.setTarget(Targeting.findAttackTarget(c.pos))
    if(c.hasTarget()) {
      if(c.attack(c.target()) === ERR_NOT_IN_RANGE) {
        c.moveTo(c.target(), {ignoreDestructibleStructures: true})
      }
    }
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
  })




}
