/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-29 19:24:01
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-15 05:12:39
*/

'use strict';

Room.prototype.tick = function() {
  Log.debug(['Ticking Room:', this.name])
  if(!this.controller) return false
  if(this.controller.my) {
    if(Finder.findIdleCreeps(this.name).length === 0) this.spawnCreep()
    this.assignCreeps()
    this.buildOut()
    this.tickChildren()
  }
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
    if(this.needUpgraders()) this.assignTask("upgrade")
    if(this.needBuilders()) this.assignTask("build")
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

Room.prototype.needMiners = function() {
  let sources = Finder.findSources(this.name).length
  let miningCreeps = Finder.findCreepsWithTask(this.name, 'mine')
  let works = 0
  _.each(miningCreeps, c => { works = works + c.partCount(WORK)})
  if(works < (sources * 5) && miningCreeps.length < 4) return true
  return false
}
Room.prototype.needHaulers = function() {
  let haulingCreeps = Finder.findCreepsWithTask(this.name, 'haul')
  let carries = 0
  _.each(haulingCreeps, c => { carries = carries + c.partCount(CARRY)})
  return (carries * 50) < (this.energyCapacityAvailable / 25) && !this.isFull()
}
Room.prototype.needBuilders = function() {
  let builderCreeps = Finder.findCreepsWithTask(this.name, 'build')
  return builderCreeps.length < 3//Finder.findConstructionSites(this.name).length && builderCreeps.length < this.controller.level * 2
}
Room.prototype.needUpgraders = function() {
  let upgradingCreeps = Finder.findCreepsWithTask(this.name, 'upgrade')
  let works = 0
  _.each(upgradingCreeps, c => { works = works + c.partCount(WORK)})
  if(works < 10) return true
  return false
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
  if(Finder.findMyTowers(this.name).length >= 1) return false //CONTROLLER_STRUCTURES[STRUCTURE_TOWER][this.controller.level]) return false
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
