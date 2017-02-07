/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-01-29 19:24:01
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-06 06:07:07
*/

'use strict';

Room.prototype.tick = function() {
  Log.debug(['Ticking Room:', this.name])
  if(!this.controller) return false
  if(this.controller && this.controller.safeMode) {
    Log.print(["Safe Mode Until", this.controller.safeModeTill()], this.name)
  }
  if(this.controller) this.controller.tick()
  if(Finder.findIdleCreeps(this.name).length === 0) {
    this.spawnCreep()
  }
  if(this.needMiners()){
    let creep = _.first(Finder.findIdleCreeps(this.name))
    if(creep) creep.setTask("mine")
  } else if(this.needHaulers()){
    Log.info("Need Haulers", this)
    let  creep = _.first(Finder.findIdleCreeps(this.name))
    if(creep) creep.setTask('haul')
  } else if(this.needBuilders()){
    Log.info("Need Builders", this)
    let creep = _.first(Finder.findIdleCreeps(this.name))
    if(creep) creep.setTask("build")
  } else if(this.needUpgraders()) {
    let creep = _.first(Finder.findIdleCreeps(this.name))
    if(creep) creep.setTask("upgrade")
  }
  if(this.needExtensions()){
    Log.info('I need Extensions', this)
    this.addExtension()
  }
  if(this.needRoads()){
    Log.info('I need Roads', this)
    this.addRoads()
  }
  if(this.needWalls()) {
    Log.info('I need Walls', this)
    this.addWalls()
  }



  _.each(Finder.findCreeps(this.name), c => {c.tick()})



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

Room.prototype.addExtension = function() {
  let spawn = _.first(Finder.findSpawns(this.name))
  let y = spawn.pos.y
  let x = spawn.pos.x
  let limiter = 100
  let ring = 2 // We don't want to build right next to it
  let worked = false

  // enter into ring
    y = y - ring
    x = x - ring
  while (!worked && limiter > 0) {
    limiter = limiter - 1
    if(x >= spawn.pos.x + ring) {
      y = y + 2
      x = spawn.pos.x - ring
      if(y > spawn.pos.y + ring) {
        ring = ring + 1
        x = spawn.pos.x - ring
        y = spawn.pos.y - ring
      }
    }
    Log.info(["Trying", x, ",", y])
    worked = (this.createConstructionSite(x, y, STRUCTURE_EXTENSION) == OK)
    x = x + 2
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
      if(s.pos.y - 2 < top) top = s.pos.y - 2
      if(s.pos.y + 2 > bottom) bottom = s.pos.y + 2
      if(s.pos.x - 2 < left) left = s.pos.x - 2
      if(s.pos.x + 2 > right) right = s.pos.x + 2
    })
    _.each(spawns, s => {
      if(s.pos.y - 2 < top) top = s.pos.y - 2
      if(s.pos.y + 2 > bottom) bottom = s.pos.y + 2
      if(s.pos.x - 2 < left) left = s.pos.x - 2
      if(s.pos.x + 2 > right) right = s.pos.x + 2
    })
    if(controller.pos.y - 2 < top) top = controller.pos.y - 2
    if(controller.pos.y + 2 > bottom) bottom = controller.pos.y + 2
    if(controller.pos.x - 2 < left) left = controller.pos.x - 2
    if(controller.pos.x + 2 > right) right = controller.pos.x + 2

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
    _.each(pathLeft, p => {
      _.merge(ramps, _.remove(spots, s => { return s.x === p.x && s.y === p.y }))
    })
    _.each(pathRight, p => {
      _.merge(ramps, _.remove(spots, s => { return s.x === p.x && s.y === p.y }))
    })
    _.each(pathTop, p => {
      _.merge(ramps, _.remove(spots, s => { return s.x === p.x && s.y === p.y }))
    })
    _.each(pathBottom, p => {
      _.merge(ramps, _.remove(spots, s => { return s.x === p.x && s.y === p.y }))
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
