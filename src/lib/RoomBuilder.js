/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-10 22:17:29
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-10 22:39:46
*/

'use strict';

class RoomBuilder {
  static buildOutExtensions(roomName) {
    let extensionSpots = []
    let room = Game.rooms[roomName]
    if(_.isNull(room)) return false
    let spawn = _.first(Finder.findSpawns(room.name))
    if(_.isNull(room)) return false
    let y = spawn.pos.y
    let x = spawn.pos.x
    let limiter = 100
    let ring = 2 // We don't want to build right next to it

    let side = 'top'

  // enter into ring
    y = y - ring
    x = x - ring
    while ( limiter > 0) {
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
      }
      if(_.filter(room.lookAtArea(x - 1, y - 1, x + 1, y + 1, true), t => { return (t.type === 'terrain' && t.terrain === 'wall')  }).length === 0) {
        extensionSpots.push({x: x, y: y})
      }
      if(side === 'top' || side === 'bottom') {
        x = x + 2
      }
      if(side === 'left' || side === 'right') {
        y = y + 2
      }

    }
    Storage.write(room.name + '-extension-spots', extensionSpots)
    return extensionSpots
  }
  static addWalls(roomName) {
    let room = Game.rooms[roomName]
    let top = 50
    let bottom = 0
    let left = 50
    let right = 0
    let sources = Finder.findSources(room.name)
    let spawns = Finder.findSpawns(room.name)
    let controller = room.controller
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
    Storage.write(room.name + '-wall-spots', spots)
    return true
  }

  static addRamps(roomName) {
    let room = Game.rooms[roomName]
    let spots = Storage.read(room.name + '-wall-spots', [])
    if(spots.length === 0) return false
    let ramps = []
    let pathLeft = room.findPath(room.controller.pos, room.controller.pos.findClosestByRange(FIND_EXIT_LEFT), {ignoreDestructibleStructures: true, ignoreCreeps: true})
    let pathRight = room.findPath(room.controller.pos, room.controller.pos.findClosestByRange(FIND_EXIT_RIGHT), {ignoreDestructibleStructures: true, ignoreCreeps: true})
    let pathTop = room.findPath(room.controller.pos, room.controller.pos.findClosestByRange(FIND_EXIT_TOP), {ignoreDestructibleStructures: true, ignoreCreeps: true})
    let pathBottom = room.findPath(room.controller.pos, room.controller.pos.findClosestByRange(FIND_EXIT_BOTTOM), {ignoreDestructibleStructures: true, ignoreCreeps: true})
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
    _.each(pathLeft, p => {
      let removed = _.remove(spots, s => { return s.x === p.x && s.y === p.y })
      if(removed.length > 0) ramps.push(removed[0])
    })
    Log.info(ramps.length)
    Storage.write(room.name + '-ramp-spots', ramps)
    Storage.write(room.name + '-wall-spots', spots)
    return true
  }
}
