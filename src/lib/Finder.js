/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-02 22:12:59
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-03-09 02:57:11
*/

'use strict';

class Finder {
  static findCreeps(room_name) {
    return _.filter(Game.creeps, c => {return c.my && c.room.name === room_name})
  }
  static findAttackCreeps(room_name) {
    return _.filter(Finder.findCreeps(room_name), c => { return c.memory.task === 'attack' })
  }
  static findIdleCreeps(room_name) {
    return _.filter(Game.creeps, c => {return c.my && c.room.name === room_name && c.taskIs('idle')})
  }
  static findIdleSpawn(room_name) {
    return _.find(Game.spawns, s => { return s.room.name === room_name && _.isNull(s.spawning)})
  }
  static findSources(room_name) {
    let room = Game.rooms[room_name]
    return room.find(FIND_SOURCES)
  }
  static findCreepsWithTask(room_name, task){
    return _.filter(Game.creeps, c => {return c.my && c.room.name === room_name && c.taskIs(task)})
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
  static findObjects(roomName, objectType) {
    let room = Game.rooms[roomName]
    return room.find(objectType)
  }
  static findMyStructures(roomName, structureType) {
    return _.filter(Finder.findObjects(roomName, FIND_MY_STRUCTURES), s => { return s.structureType === structureType})
  }
  static findDroppedEnergy(roomName) {
    let room = Game.rooms[roomName]
    let minEnergy = Config.minEnergy[room.controller.level]
    Log.error(['xxx', minEnergy])
    let containers = _.filter(Finder.findObjects(roomName, FIND_STRUCTURES), s => { return s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > minEnergy})
    if(containers.length > 0) return containers
    let drops =  _.filter(Finder.findObjects(roomName, FIND_DROPPED_ENERGY), r => { return r.resourceType === RESOURCE_ENERGY && r.amount >= minEnergy && r.pos.x > room.memory.left && r.pos.x < room.memory.right && r.pos.y > room.memory.top && r.pos.y < room.memory.bottom})
    if(drops.length > 0) return drops
    return room.storage
  }
  static findExtensions(roomName){
    return Finder.findMyStructures(roomName, STRUCTURE_EXTENSION)
  }
  static findConstructionSites(roomName, type = null){
    if(!_.isNull(type)) return _.filter(Finder.findObjects(roomName, FIND_CONSTRUCTION_SITES), c => { return c.my && c.structureType === type})
    return _.filter(Finder.findObjects(roomName, FIND_CONSTRUCTION_SITES), c => { return c.my })
  }
  static findSpawns(roomName) {
    return Finder.findMyStructures(roomName, STRUCTURE_SPAWN)
  }
  static findMyTowers(roomName) {
    return Finder.findMyStructures(roomName, STRUCTURE_TOWER)
  }
  static findMyRamps(roomName) {
    return Finder.findMyStructures(roomName, STRUCTURE_RAMPART)
  }
  static findWalls(roomName) {
    let walls = _.filter(Finder.findObjects(roomName, FIND_STRUCTURES), o => { return o.structureType === STRUCTURE_WALL })
    return walls
  }
  static findEnergyStoreInNeed(roomName) {
    let spawns = _.filter(Finder.findSpawns(roomName), s => { return s.hasRoom() })
    let towers = _.filter(Finder.findMyTowers(roomName), t => { return t.hasRoom() })
    let criticalTower = null
    _.each(towers, t => { if(t.critical()) criticalTower = t })
    if(criticalTower) return [criticalTower]
    if(spawns.length > 0) return spawns
    let extensions = _.filter(Finder.findExtensions(roomName), e => { return e.hasRoom() })
    if(extensions.length > 0) return extensions
    if(towers.length > 0) return towers
    return [Game.rooms[roomName].storage]
  }
  static findFlag(roomName, flagName) {
    return Game.flags[flagName]
  }
  static findSpawnConstruction(roomName){
    return _.first(Finder.findConstructionSites(roomName, STRUCTURE_SPAWN))
  }
}
