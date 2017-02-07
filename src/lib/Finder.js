/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-02 22:12:59
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-05 10:43:20
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
    return _.filter(Game.creeps, c => {return c.my && c.room.name == room_name && c.taskIs(task)})
  }
  static findCreepsWithTarget(id) {
    return _.filter(Game.creeps, c => {return c.my && c.targetIs(id)})
  }
  static findSpotsAroundTarget(id){
    let source = Game.getObjectById(id)
    let count = 0
    let spots = []
    source.room.lookForAtArea(LOOK_TERRAIN, source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true).forEach(function(spot) {
        if (spot.terrain === 'plain' || spot.terrain === 'swamp') {
          spots.push(spot)
        }
      })
    return spots
  }
  static findDroppedEnergy(roomName) {
    let room = Game.rooms[roomName]
    return _.filter(room.find(FIND_DROPPED_ENERGY), r => { return r.resourceType === RESOURCE_ENERGY})
  }
  static findExtensions(roomName){
    let room = Game.rooms[roomName]
    return _.filter(room.find(FIND_MY_STRUCTURES), s => { return s.structureType == STRUCTURE_EXTENSION})
  }
  static findConstructionSites(roomName, type = null){
    let room = Game.rooms[roomName]
    if(!_.isNull(type)) return _.filter(room.find(FIND_CONSTRUCTION_SITES), c => { return c.my && c.structureType === type})
    return _.filter(room.find(FIND_CONSTRUCTION_SITES), c => { return c.my })
  }
  static findSpawns(roomName) {
    let room = Game.rooms[roomName]
    return _.filter(room.find(FIND_MY_STRUCTURES), s => { return s.structureType == STRUCTURE_SPAWN })
  }
  static findEnergyStoreInNeed(roomName) {
    let spawns = _.filter(Finder.findSpawns(roomName), s => { return s.hasRoom() })
    if(spawns.length > 0) return _.first(spawns)
    let extensions = _.filter(Finder.findExtensions(roomName), e => { return e.hasRoom() })
    if(extensions.length > 0) return _.first(extensions)

  }
}
