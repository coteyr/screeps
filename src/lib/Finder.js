/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-12 02:20:06
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-04-15 04:58:59
*/

'use strict';
class Finder {
  static builders(room) {
    return _.filter(Game.creeps, function(creep) {
      return creep.room.name === room.name && creep.memory.task === 'builder'
    })
  }
  static recovery(room) {
    return _.filter(Game.creeps, function(creep) {
      return creep.room.name === room.name && creep.memory.task === 'recovery'
    })
  }
  static miners(room) {
    return _.filter(Game.creeps, function(creep) {
      return creep.room.name === room.name && creep.memory.task === 'miner'
    })
  }
  static haulers(room) {
    return _.filter(Game.creeps, function(creep) {
      return creep.room.name === room.name && creep.memory.task === 'hauler'
    })
  }
  static upgraders(room) {
    return _.filter(Game.creeps, function(creep) {
      return creep.room.name === room.name && creep.memory.task === 'upgrader'
    })
  }
  static buildSites(room) {
    return room.find(FIND_CONSTRUCTION_SITES)
  }
  static sources(room) {
    return room.find(FIND_SOURCES)
  }
  static energies(room) {
    let result = _.filter(room.find(FIND_DROPPED_RESOURCES), function(r) {
      return r.amount >= Config.minEnergy[room.level()] && r.resourceType === RESOURCE_ENERGY
    })
    if (result.length > 0) return result
    Log.info('abc')
    result = _.filter(room.find(FIND_STRUCTURES), e => {return e.structureType == STRUCTURE_CONTAINER && e.store[RESOURCE_ENERGY] > 0})
    if (result.length > 0) return result
    return null
  }
  static dumps(room) {
    let result = null
    result = _.filter(Game.spawns, function(spawn) {
      return spawn.room.name === room.name && !spawn.isFull()
    })
    if(result.length > 0) return result
    result = _.filter(room.find(FIND_STRUCTURES), e => {return e.structureType == STRUCTURE_EXTENSION && e.energy < e.energyCapacity})
    if(result.length > 0) return result
    result = _.filter(room.find(FIND_STRUCTURES), e => {return e.structureType == STRUCTURE_TOWER && e.energy < e.energyCapacity})
    if(result.length > 0) return result
    result = result = _.filter(room.find(FIND_STRUCTURES), e => {return e.structureType == STRUCTURE_STORAGE && _.sum(e.store) < e.storeCapacity})
    if(result.length > 0) return result
    return null
  }
  static findInNeedOfRepair(room) {
    let result = null
    result = _.filter(Game.creeps, function(creep){
      return creep.room.name === room.name && creep.hits < creep.hitsMax
    })
    if(result.length > 0) return result
    return null
  }
  static creepsWithTarget(key, target) {
    return _.filter(Game.creeps, c => {return c.my && c.targetIs(key, target)})
  }

  static findIdleSpawner(room) {
    return _.first(_.filter(Game.spawns, function(spawn) {
      return spawn.room.name === room.name && !spawn.spawning && spawn.isActive()
    }));
  }

  static spotsAroundTarget(id) {
    let source = Game.getObjectById(id)
    let count = 0
    let spots = []
    Log.debug(4)
    source.room.lookForAtArea(LOOK_TERRAIN, source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true).forEach(function(spot) {
        if (spot.terrain === 'plain' || spot.terrain === 'swamp') {
          spots.push(spot)
        }
      })
    return spots
  }
}
