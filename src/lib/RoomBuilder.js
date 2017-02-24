/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-10 22:17:29
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-19 14:16:32
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

    while (limiter > 0) {
      limiter = limiter - 1
      while (x < spawn.pos.x + ring) {
        extensionSpots.push({x: x, y: spawn.pos.y - ring})
        extensionSpots.push({x: x, y: spawn.pos.y + ring})
        x = x + 2
      }
      while (y < spawn.pos.y + ring) {
        extensionSpots.push({x: spawn.pos.x - ring, y: y})
        extensionSpots.push({x: spawn.pos.x + ring, y: y})
        y = y + 2
      }
      ring = ring + 1
      x = spawn.pos.x - ring
      y = spawn.pos.y - ring
    }
    let spots = []
    _.each(extensionSpots, e => {
      if(x > room.memory.right || e.y > room.memory.bottom || e.x < room.memory.left || e.y < room.memory.top) return false
      if(_.filter(room.lookAtArea(e.x - 1, e.y - 1, e.x + 1, e.y + 1, true), t => { return (t.type === 'terrain' && t.terrain === 'wall')  }).length === 0) {

          spots.push({x: e.x, y: e.y})
          room.visual.circle(e.x, e.y)

      }
    })
    Storage.write(room.name + '-extension-spots', spots)
    return spots
  }
  static findTop(structures) {
    let top = 50
    let bottom = 0
    let left = 50
    let right = 0
    _.each(structures, s => {
      if(s.pos.y - Config.wallSpacing < top) top = s.pos.y - Config.wallSpacing
      if(s.pos.y + Config.wallSpacing > bottom) bottom = s.pos.y + Config.wallSpacing
      if(s.pos.x - Config.wallSpacing < left) left = s.pos.x - Config.wallSpacing
      if(s.pos.x + Config.wallSpacing > right) right = s.pos.x + Config.wallSpacing
    })
    if(top < 2) top = 2
    if(bottom > 47) bottom = 47
    if(left < 2) left = 2
    if(right > 47) right = 47
    return {'top': top, 'left': left, 'bottom': bottom, 'right': right}
  }
  static findMainArea(roomName) {
    let room = Game.rooms[roomName]
    let sources = Finder.findSources(room.name)
    let spawns = Finder.findSpawns(room.name)
    let controller = room.controller
    let boundries = RoomBuilder.findBoundries(sources.concat(spawns, [controller]))
    room.memory.top = boundries.top
    room.memory.bottom = boundries.bottom
    room.memory.left = boundries.left
    room.memory.right = boundries.right
    return true
  }
  static needMainArea(roomName) {
    let room = Game.rooms[roomName]
    return _.isUndefined(room.memory.top) || _.isUndefined(room.memory.bottom) || _.isUndefined(room.memory.left) || _.isUndefined(room.memory.right)
  }
  static addWalls(roomName) {
    if(RoomBuilder.needMainArea(roomName)) RoomBuilder.findMainArea(roomName)
    let room = Game.rooms[roomName]
    let spots = []
    let ramps = []
    let x = 0
    let y = 0
    for(x = room.memory.left - 4; x <= room.memory.right + 4; x++) {
      if(x <= room.memory.right && x >= room.memory.left) {
        spots.push({x: x, y: room.memory.top})
        spots.push({x: x, y: room.memory.bottom})
      }
      if (x <= room.memory.right + 2 && x >= room.memory.left - 2) {
        spots.push({x: x, y: room.memory.top - 2})
        spots.push({x: x, y: room.memory.bottom + 2})
      }
      spots.push({x: x, y: room.memory.top - 4})
      spots.push({x: x, y: room.memory.bottom + 4})
    }
    for(y = room.memory.top - 4; y <= room.memory.bottom + 4; y++) {
      if(y <= room.memory.bottom && y >= room.memory.top) {
        spots.push({x: room.memory.left, y: y})
        spots.push({x: room.memory.right, y: y})
      }
      if(y <= room.memory.bottom + 2 && y >= room.memory.top - 2) {
        spots.push({x: room.memory.left - 2, y: y})
        spots.push({x: room.memory.right + 2, y: y})
      }
      spots.push({x: room.memory.left - 4, y: y})
      spots.push({x: room.memory.right + 4, y: y})
    }
    _.each(spots, s => {
      room.visual.rect(s.x - 0.5, s.y - 0.5, 1, 1, { fill: Config.colors.purple })
    })
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
    _.merge(pathLeft, pathRight, pathTop, pathBottom)
    _.each(pathLeft, p => {
      let removed = _.remove(spots, s => { return s.x === p.x && s.y === p.y })
      if(removed.length > 0) ramps.push(removed[0])
    })
    Storage.write(room.name + '-ramp-spots', ramps)
    Storage.write(room.name + '-wall-spots', spots)
    return true
  }
}

