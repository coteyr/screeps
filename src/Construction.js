/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-10-25 18:44:51
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-10-26 16:59:27
*/

'use strict';

let Construction = {
  findSpawnPoint: function(roomName) {
    let room = Game.rooms[roomName]
    if(!room) return [0,0]
    let x = 0
    let y = 0
    let sources = room.find(FIND_SOURCES)
    if (_.size(sources) === 1) {
      x = sources[0].pos.x - 3
      y = sources[0].pos.y + 3
    } else if(_.size(sources) === 2) {
      let distance_x = Math.floor(Math.abs((sources[0].pos.x - sources[1].pos.x) / 2))
      let distance_y = Math.floor(Math.abs((sources[0].pos.y - sources[1].pos.y) / 2))
      x = sources[0].pos.x + distance_x
      y = sources[0].pos.y + distance_y
    }
    let iter = 0
    while(true) {
      Log.info("Checking: " + x + ", " + y)
      Log.info(JSON.stringify(_.filter(room.lookForAtArea(LOOK_TERRAIN, y - 1, x - 1, y + 1, x + 1, true), t=> t.terrain == 'wall')))
      if(_.size(_.filter(room.lookForAtArea(LOOK_TERRAIN, y - 1, x - 1, y + 1, x + 1, true), t=> t.terrain == 'wall')) === 0) return [x, y]
      if(iter % 2 === 0) x = x - 1
      if(iter % 2 !== 0) y = y - 1
      iter += 1
      // y = y - 1
    }
    return [x, y]
  },
  findExtensionSites: function(roomName) {
    let room = Game.rooms[roomName]
    if(!room) return false
    let count = ((room.controller.level - 1) * 10) - 5
    let spawn = Finder.findSpawn(roomName)
    let sources = room.find(FIND_SOURCES)
    if (_.size(sources) === 1) {

    } else if(_.size(sources) === 2) {
      let path1 = room.findPath(spawn.pos, sources[0].pos)
      let path2 = room.findPath(spawn.pos, sources[1].pos)
      let iter = 0
      /*while (count > 0){
        let x = 0
        let y = 0
        let spot = Math.floor(iter/2)
        if(iter % 2 === 0) {
          x = path1[spot].x
          y = path1[spot].y
        } else {
          x = path2[spot].x
          y = path2[spot].y
        }
        Log.info("Place at; " + x + ", " + y)

        count = count - 1
        iter += 1
      }*/
    }

    /*let x = spawn.pos.x - 1
    let y = spawn.pos.y - 1
    let distance = -1
    while(count > 0) {
      x = x + distance
      y = y + distance
      if(x >= spawn.pos.x - 1 && x <= spawn.pos.x  + 1 && y >= spawn.pos.y - 1 && y <= spawn.pos.y )
      if(_.size(_.filter(room.lookForAtArea(LOOK_TERRAIN, y - 1, x - 1, y + 1, x + 1, true), t=> t.terrain == 'wall')) === 0) {
        // place a extension
        Log.info("Place at; " + x + ", " + y)
        distance = (distance * - 1)
        count = count - 1
      }
    }*/
  }
}

