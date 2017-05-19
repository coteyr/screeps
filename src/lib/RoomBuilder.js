/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-10 22:17:29
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-04-01 23:41:07
*/

'use strict';

class RoomBuilder {
  static buildPlan(roomName) {
    let room = Game.rooms[roomName]
    if(Finder.findSpawns(room.name).length === 0) return false
    if(RoomBuilder.needMainArea(roomName)) RoomBuilder.findMainArea(roomName)
    if(_.isUndefined(room.memory.planed)) {
      RoomBuilder.addWalls(roomName)
      RoomBuilder.addRamps(roomName)
      //RoomBuilder.pruneWalls(roomName)
      RoomBuilder.buildOutExtensions(roomName)
      room.memory.planed = true
    }
  }
  static buildOutExtensions(roomName) {
    let extensionSpots = []
    let room = Game.rooms[roomName]
    if(_.isNull(room)) return false
    let spawn = _.first(Finder.findSpawns(room.name))
    if(_.isUndefined(spawn)) return false
    if(RoomBuilder.needMainArea(roomName))  return false
    let y = spawn.pos.y
    let x = spawn.pos.x

    x = room.memory.left + 2
    y = room.memory.top + 1

    while (y < room.memory.bottom) {
      while (x < room.memory.right) {
        extensionSpots.push({x: x, y: y})
        x = x + 2
      }
      if(y % 2 === 0) {
        x = room.memory.left + 1
      } else {
        x = room.memory.left + 2
      }
      y = y + 1
    }
    let spots = []
    _.each(extensionSpots, e => {
      if((e.x < spawn.pos.x - 1 || e.x > spawn.pos.x + 1 || e.y > spawn.pos.y + 1 || e.y < spawn.pos.y - 1)) {
        spots.push({x: e.x, y: e.y})
      }
    })
    spots = Scalar.orderByPos(spawn.pos, spots)
    Storage.write(room.name + '-extension-spots', spots)
    return spots
  }
  static findBoundries(structures, spawns, roomName) {
    let top = 50
    let bottom = 0
    let left = 50
    let right = 0
    let room = Game.rooms[roomName]
    _.each(structures, s => {
      if(s.pos.y - Config.wallSpacing < top) top = s.pos.y - Config.wallSpacing
      if(s.pos.y + Config.wallSpacing > bottom) bottom = s.pos.y + Config.wallSpacing
      if(s.pos.x - Config.wallSpacing < left) left = s.pos.x - Config.wallSpacing
      if(s.pos.x + Config.wallSpacing > right) right = s.pos.y + Config.wallSpacing
        _.each(spawns, p => {
          let path = room.findPath(p.pos, s.pos, {ignoreCreeps: true, ignoreDestructibleStructures: true})
          Log.error(path.length)
          _.each(path, a => {
            if(a.y - Config.wallSpacing < top) top = a.y - Config.wallSpacing
            if(a.y + Config.wallSpacing > bottom) bottom = a.y + Config.wallSpacing
            if(a.x - Config.wallSpacing < left) left = a.x - Config.wallSpacing
            if(a.x + Config.wallSpacing > right) right = a.x + Config.wallSpacing
          })
        })
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
    let boundries = RoomBuilder.findBoundries(sources.concat(spawns, [controller]), spawns, roomName)
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
    let finalSpots = []
    _.each(spots, s => {
      if(s.x < 2) s.x = 2
      if(s.x > 47) s.x = 47
      if(s.y < 2) s.y = 2
      if(s.y > 47) s.y = 47
      finalSpots.push(s)
    })
    Storage.write(room.name + '-wall-spots', finalSpots)
    //RoomBuilder.addRamps(room.name)
    //RoomBuilder.pruneWalls(room.name)
    return true
  }

  static pruneWalls(roomName) {
    let room = Game.rooms[roomName]
    let spots = Storage.read(room.name + '-wall-spots', [])
    let prune = []
    //Log.error(exitTop)
    spots = _.uniq(spots, s => {
      return "x" + s.x + "y" + s.y
    })

    _.each(spots, s => {
         // is there a natural wall here
        if(_.filter(room.lookForAt(LOOK_TERRAIN, s.x, s.y), t => { return t === 'wall' }).length > 0) {
          Log.error(['Natural Wall at', s.x, s.y])
          prune.push({ 'x': s.x, 'y': s.y})
        }
    })

    _.each(prune, p => {
      _.remove(spots, s=> { return s.x === p.x && s.y === p.y })
    })

    Storage.write(room.name + '-wall-spots', spots)
    return true
  }
  static removeWallSpot(roomName, x, y) {
    let room = Game.rooms[roomName]
    let spots = Storage.read(room.name + '-wall-spots', [])
    _.remove(spots, s=> { return s.x === x && s.y === y })
    Storage.write(room.name + '-wall-spots', spots)


  }


  static addRamps(roomName) {
    let room = Game.rooms[roomName]
    let spots = Storage.read(room.name + '-wall-spots', [])
    if(spots.length === 0) return false
    let ramps = []
    let exitTop = room.controller.pos.findClosestByPath(FIND_EXIT_TOP)
    let exitBottom = room.controller.pos.findClosestByPath(FIND_EXIT_BOTTOM)
    let exitRight = room.controller.pos.findClosestByPath(FIND_EXIT_RIGHT)
    let exitLeft = room.controller.pos.findClosestByPath(FIND_EXIT_LEFT)
    let pathLeft = []
    let pathRight = []
    let pathTop = []
    let pathBottom = []
    if(exitLeft)   pathLeft = room.findPath(room.controller.pos, exitLeft, {ignoreDestructibleStructures: true, ignoreCreeps: true})
    if(exitRight)  pathRight = room.findPath(room.controller.pos, exitRight, {ignoreDestructibleStructures: true, ignoreCreeps: true})
    if(exitTop)    pathTop = room.findPath(room.controller.pos, exitTop, {ignoreDestructibleStructures: true, ignoreCreeps: true})
    if(exitBottom) pathBottom = room.findPath(room.controller.pos, exitBottom, {ignoreDestructibleStructures: true, ignoreCreeps: true})
    let paths = pathLeft.concat(pathRight, pathTop, pathBottom)
    _.each(paths, p => {
      room.visual.rect(p.x - 0.5, p.y - 0.5, 1, 1, { fill: Config.colors.red })
      let removed = _.remove(spots, s => { return s.x === p.x && s.y === p.y })
      if(removed.length > 0) ramps.push(removed[0])
    })
    Storage.write(room.name + '-ramp-spots', ramps)
    Storage.write(room.name + '-wall-spots', spots)
    return true
  }

  static clearBuiltWalls(roomName) {
    let room = Game.rooms[roomName]
    _.each(Finder.findWalls(roomName), w => {
      w.destroy()
    })
  }
  static clearBuiltRamps(roomName) {
    let room = Game.rooms[roomName]
    _.each(Finder.findMyRamps(roomName), r => {
      w.destroy()
    })
  }
  static addConstructionSite(roomName, mem, structure) {
    Log.error(['Adding Construction to', roomName])
    let spots = Storage.read(roomName + '-' + mem, [])
    if(spots.length === 0) {
      return true
    }
    let room = Game.rooms[roomName]
    _.some(spots, s => {
      if(room.lookForAt(LOOK_STRUCTURES, s.x, s.y).length == 0) {
        Log.error(['Trying at', s.x, s.y], roomName)
        return room.createConstructionSite(s.x, s.y, structure) ===  OK

      } else {
        return false
      }
    })
    return true
  }
}

