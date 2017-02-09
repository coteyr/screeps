/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-29 19:24:01
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-09 01:49:18
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
  if(this.needWalls()) this.addRamps()
  if(this.needTowers()) this.addTowers()
}
Room.prototype.assignCreeps = function() {
    if(this.needMiners()){
      let creep = _.first(Finder.findIdleCreeps(this.name))
      if(creep) creep.setTask("mine")
    }
    if(this.needHaulers()){
      Log.info("Need Haulers", this)
      let  creep = _.first(Finder.findIdleCreeps(this.name))
      if(creep) creep.setTask('haul')
    }
    if(this.needUpgraders()) {
      let creep = _.first(Finder.findIdleCreeps(this.name))
      if(creep) creep.setTask("upgrade")
    }
    if(this.needBuilders()){
      Log.info("Need Builders", this)
      let creep = _.first(Finder.findIdleCreeps(this.name))
      if(creep) creep.setTask("build")
    }
}
Room.prototype.tickChildren = function() {
  _.each(Finder.findCreeps(this.name), c => { c.tick() })
  _.each(Finder.findMyTowers(this.name), t => { t.tick() })
  if(this.controller) this.controller.tick()
}
Room.prototype.spawnCreep = function() {
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
  return (carries * 50) < (this.energyCapacityAvailable / 2)
}
Room.prototype.needBuilders = function() {
  let builderCreeps = Finder.findCreepsWithTask(this.name, 'build')
  return builderCreeps.length < Finder.findConstructionSites(this.name).length && builderCreeps.length < this.controller.level * 2
}
Room.prototype.needUpgraders = function() {
  let upgradingCreeps = Finder.findCreepsWithTask(this.name, 'upgrade')
  let works = 0
  _.each(upgradingCreeps, c => { works = works + c.partCount(WORK)})
  if(works < 10) return true
  return false
}

Room.prototype.needExtensions = function() {
  if(Finder.findConstructionSites(this.name, STRUCTURE_EXTENSION).length > 0) return false
  let extensions = Finder.findExtensions(this.name).length
  if(extensions < CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][this.controller.level]) return true
  return false
}
Room.prototype.needRoads = function() {
  if(Finder.findConstructionSites(this.name, STRUCTURE_ROAD).length > 10) return false
  // do a check for roads need to cache
  return true
}
Room.prototype.needWalls = function() {
  if(Finder.findConstructionSites(this.name, STRUCTURE_WALL).length > 10) return false
  if(this.controller && this.controller.level < 3) return false
  // check wall pattern
  return true
}
Room.prototype.needRamps = function() {
  if(Finder.findConstructionSites(this.name, STRUCTURE_RAMP).length > 1) return false
  return true
}

Room.prototype.needTowers = function() {
  if(Finder.findMyTowers(this.name).length >= 1) return false //CONTROLLER_STRUCTURES[STRUCTURE_TOWER][this.controller.level]) return false
  if(Finder.findConstructionSites(this.name, STRUCTURE_TOWER).length > 0) return false
  return true
}

Room.prototype.addExtension = function() {
  let spawn = _.first(Finder.findSpawns(this.name))
  let y = spawn.pos.y
  let x = spawn.pos.x
  let limiter = 100
  let ring = 2 // We don't want to build right next to it
  let worked = false
  let side = 'top'

  // enter into ring
    y = y - ring
    x = x - ring
  while (!worked && limiter > 0) {
    limiter = limiter - 1
    if(x >= spawn.pos.x + ring && side === 'top') {
      x = spawn.pos.x - ring
      side = 'bottom'
    }
    if(x >= spawn.pos.x + ring && side === 'bottom') {
      x = spawn.pos.x - ring
      side = 'left'
    }
    if(y >= spawn.pos.y + ring && side === 'left') {
      y = spawn.pos.y - ring
      side = 'right'
    }
    if(y >= spawn.pos.y + ring && side === 'right') {
      ring = ring + 1
      y = spawn.pos.y - ring
      x = spawn.pos.x - ring
      side = 'bottom'

      Log.info(["New Ring", ring])
    }


    Log.info(["Trying", x, ",", y])
    Log.info(this.lookAtArea(x - 1, y - 1, x + 1, y + 1, true))
    if(_.filter(this.lookAtArea(x - 1, y - 1, x + 1, y + 1, true), t => { return (t.type === 'terrain' && t.terrain === 'wall')  }).length === 0) {
      worked = (this.createConstructionSite(x, y, STRUCTURE_EXTENSION) == OK)
    }


    if(side === 'top' || side === 'bottom') {
      x = x + 2
    }
    if(side === 'left' || side === 'right') {
      y = y + 2
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

Room.prototype.addWalls = function() {
  let spots = Storage.read(this.name + '-wall-spots', [])
  if(spots.length === 0) {
    let top = 50
    let bottom = 0
    let left = 50
    let right = 0
    let sources = Finder.findSources(this.name)
    let spawns = Finder.findSpawns(this.name)
    let controller = this.controller
    _.each(sources, s => {
      if(s.pos.y - Config.wallSpacing < top) top = s.pos.y - Config.wallSpacing
      if(s.pos.y + Config.wallSpacing > bottom) bottom = s.pos.y + Config.wallSpacing
      if(s.pos.x - Config.wallSpacing < left) left = s.pos.x - Config.wallSpacing
      if(s.pos.x + Config.wallSpacing > right) right = s.pos.x + Config.wallSpacing
    })
    _.each(spawns, s => {
      if(s.pos.y - Config.wallSpacing < top) top = s.pos.y - Config.wallSpacing
      if(s.pos.y + Config.wallSpacing > bottom) bottom = s.pos.y + Config.wallSpacing
      if(s.pos.x - Config.wallSpacing < left) left = s.pos.x - Config.wallSpacing
      if(s.pos.x + Config.wallSpacing > right) right = s.pos.x + Config.wallSpacing
    })
    if(controller.pos.y - Config.wallSpacing < top) top = controller.pos.y - Config.wallSpacing
    if(controller.pos.y + Config.wallSpacing > bottom) bottom = controller.pos.y + Config.wallSpacing
    if(controller.pos.x - Config.wallSpacing < left) left = controller.pos.x - Config.wallSpacing
    if(controller.pos.x + Config.wallSpacing > right) right = controller.pos.x + Config.wallSpacing

    if(top < 2) top = 2
    if(bottom > 47) bottom = 47
    if(left < 2) left = 2
    if(right > 47) right = 47

    let middle = [left + ((right - left) / 2), top + ((bottom - top) / 2)]
    let radius = (right - left) + 1
    let spots = []
    let ramps = []
    let x = 0
    let y = 0
    Log.info(['Wall from', left, top, right, bottom])

    for(x = left; x < right; x++) {
      spots.push({x: x, y: top})
      spots.push({x: x, y: bottom})
    }
    for(y = top; y < bottom; y++) {
      spots.push({x: left, y: y})
      spots.push({x: right, y: y})
    }
    for(x = left - 2; x < right + 2; x++) {
      spots.push({x: x, y: top - 2})
      spots.push({x: x, y: bottom + 2})
    }
    for(y = top - 2; y < bottom + 2; y++) {
      spots.push({x: left - 2, y: y})
      spots.push({x: right + 2, y: y})
    }
    for(x = left - 4; x < right + 4; x++) {
      spots.push({x: x, y: top - 4})
      spots.push({x: x, y: bottom + 4})
    }
    for(y = top - 4; y < bottom + 4; y++) {
      spots.push({x: left - 4, y: y})
      spots.push({x: right + 4, y: y})
    }
    Storage.write(this.name + '-wall-spots', spots)
    return true
  }
  let ramps = Storage.read(this.name + '-ramp-spots', [])

  if(ramps.length === 0) {
    Log.warn('Calculation of Ramp Locations')

    let pathLeft = this.findPath(this.controller.pos, this.controller.pos.findClosestByRange(FIND_EXIT_LEFT), {ignoreDestructibleStructures: true, ignoreCreeps: true})
    let pathRight = this.findPath(this.controller.pos, this.controller.pos.findClosestByRange(FIND_EXIT_RIGHT), {ignoreDestructibleStructures: true, ignoreCreeps: true})
    let pathTop = this.findPath(this.controller.pos, this.controller.pos.findClosestByRange(FIND_EXIT_TOP), {ignoreDestructibleStructures: true, ignoreCreeps: true})
    let pathBottom = this.findPath(this.controller.pos, this.controller.pos.findClosestByRange(FIND_EXIT_BOTTOM), {ignoreDestructibleStructures: true, ignoreCreeps: true})
    /*_.each(spots, s => {
      if(_.filter(pathLeft, p => { return p.x === s.x && p.y === s.y}).length > 0) {
        Log.info(['Removing Spot Left', s.x, s.y])
        _.remove(spots, r => {return r.x === s.x && r.y === s.y})
        ramps.push({'x': s.x, 'y': s.y})
      }
      if(_.filter(pathRight, p => { return p.x === s.x && p.y === s.y}).length > 0) {
        Log.info(['Removing Spot Right', s.x, s.y])
        _.remove(spots, r => {return r.x === s.x && r.y === s.y})
        ramps.push({'x': s.x, 'y': s.y})
      }
      if(_.filter(pathTop, p => { return p.x === s.x && p.y === s.y}).length > 0) {
        Log.info(['Removing Spot Top', s.x, s.y])
        _.remove(spots, r => {return r.x === s.x && r.y === s.y})
        ramps.push({'x': s.x, 'y': s.y})
      }
      if(_.filter(pathBottom, p => { return p.x === s.x && p.y === s.y}).length > 0)  {
        Log.info(['Removing Spot Bottom', s.x, s.y])
        _.remove(spots, r => {return r.x === s.x && r.y === s.y})
        ramps.push({'x': s.x, 'y': s.y})
      }
    })*/
    _.merge(pathLeft, pathRight, pathTop, pathBottom)
    Log.warn(pathLeft.length)
    _.each(pathLeft, p => {
      let removed = _.remove(spots, s => { return s.x === p.x && s.y === p.y })
      if(removed.length > 0) ramps.push(removed[0])
    })
    Log.info(ramps.length)
    Storage.write(this.name + '-ramp-spots', ramps)
    Storage.write(this.name + '-wall-spots', spots)
    return true
  }
  let pos = 0
  let worked = false
  while(pos < spots.length && worked === false) {
    worked = (this.createConstructionSite(spots[pos].x, spots[pos].y, STRUCTURE_WALL) === OK)
    pos = pos + 1
  }
  return worked
}
Room.prototype.addRamps = function() {
  let ramps = Storage.read(this.name + '-ramp-spots', [])
  _.each(ramps, r => { this.createConstructionSite(r.x, r.y, STRUCTURE_RAMPART) })
}
