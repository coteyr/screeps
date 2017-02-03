/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-02 22:12:59
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-03 18:34:37
*/

'use strict';

class Finder {
  static findCreeps(room_name) {
    return _.filter(Game.creeps, c => {return c.my && c.room.name == room_name})
  }
  static findIdleCreeps(room_name) {
    return _.filter(Game.creeps, c => {return c.my && c.room.name == room_name && c.taskIs('idle')})
  }
  static findIdleSpawn(room_name) {
    return _.find(Game.spawns, s => { return s.room.name === room_name && _.isNull(s.spawning)})
  }
  static findSources(room_name) {
    let room = Game.rooms[room_name]
    return room.find(FIND_SOURCES)
  }
  static findCreepsWithTask(room_name, task){
    return _.filter(Game.creeps, c => {return c.my && c.room.name == room_name && c.taskIs('mine')})
  }
}
