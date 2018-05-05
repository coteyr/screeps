/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-12 02:20:06
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-05-02 15:15:26
*/

'use strict';
class Finder {
  static flag(name) {
    let results = _.filter(Game.flags, function(f){
      return f.name.toLowerCase() === name.toLowerCase()
    })
    return results
  }
  static wallsNeedingBuildUp(room) {
    let result = _.filter(room.find(FIND_STRUCTURES), e => {
      return (e.structureType == STRUCTURE_WALL && e.hits < Config.walls[room.level()]) || (e.structureType === STRUCTURE_RAMPART && e.hits < Config.ramparts[room.level()])
    })
    return result
  }
  static claimers() {
   return _.filter(Game.creeps, function(creep) {
      return creep.memory.task === 'claimer'
    })
  }
  static wallers(room) {
    return _.filter(Game.creeps, function(creep) {
      return creep.room.name === room.name && creep.memory.task === 'waller'
    })
  }
  static builders(room) {
    return _.filter(Game.creeps, function(creep) {
      return creep.room.name === room.name && creep.memory.task === 'builder'
    })
  }
  static remoteRecovery(room) {
    return _.filter(Game.creeps, function(creep) {
      return creep.memory.dest === room.name && creep.memory.task === 'recovery'
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
    result = _.filter(room.find(FIND_STRUCTURES), e => {return e.structureType == STRUCTURE_CONTAINER && e.store[RESOURCE_ENERGY] > Config.minEnergy[room.level()]})
    if (result.length > 0) return result
    result = _.filter(room.find(FIND_STRUCTURES), e => {return e.structureType == STRUCTURE_STORAGE && e.store[RESOURCE_ENERGY] > 0})
    if (result.length > 0) return result
    return null
  }
  static dumps(room) {
    let result = null

    result = _.filter(room.find(FIND_STRUCTURES), e => {return e.structureType == STRUCTURE_TOWER && e.energy < e.energyCapacity && e.energy < 200})
    if(result.length > 0) return result
    result = _.filter(Game.spawns, function(spawn) {
      return spawn.room.name === room.name && !spawn.isFull()
    })
    if(result.length > 0) return result
    result = _.filter(room.find(FIND_STRUCTURES), e => {return e.structureType == STRUCTURE_EXTENSION && e.energy < e.energyCapacity})
    if(result.length > 0) return result
    result = _.filter(room.find(FIND_STRUCTURES), e => {return e.structureType == STRUCTURE_TOWER && e.energy < e.energyCapacity})
    if(result.length > 0) return result
    result = result = _.filter(room.find(FIND_STRUCTURES), e => {return e.structureType == STRUCTURE_LAB && e.energy < e.energyCapacity})
    if(result.length > 0) return result
    result = result = _.filter(room.find(FIND_STRUCTURES), e => {return e.structureType == STRUCTURE_TERMINAL && _.sum(e.store) < e.storeCapacity})
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
    result = _.filter(Game.structures, function(s){
      return s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART && s.hits < s.hitsMax * 0.5
    })
    if(result.length > 0) return result
    result = _.filter(room.find(FIND_STRUCTURES), function(s){
      return s.structureType === STRUCTURE_ROAD && s.hits < s.hitsMax * 0.5
    })
    if(result.length > 0) return result
    result = _.filter(room.find(FIND_STRUCTURES), function(s){
      return (s.structureType === STRUCTURE_RAMPART && s.hits < 1000) || (s.structureType === STRUCTURE_WALL && s.hits < 1000)
    })
    if(result.length > 0) return result
    return null
  }
  static creepsWithTarget(key, target) {
    return _.filter(Game.creeps, c => {return c.my && c.memory.task !== 'restore' && c.targetIs(key, target)})
  }
  static spawns(room) {
    return _.filter(Game.spawns, function(spawn) {
      return spawn.room.name === room.name
    })
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
    source.room.lookForAtArea(LOOK_TERRAIN, source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true).forEach(function(spot) {
        if (spot.terrain === 'plain' || spot.terrain === 'swamp') {
          spots.push(spot)
        }
      })
    return spots
  }
  static hostals(room){
    return _.filter(room.find(FIND_HOSTILE_CREEPS), function(h) {
      return Math.count(_.filter(h.body, function(b){
        b = b.type
        return b == ATTACK || b == HEAL || b == RANGED_ATTACK || b == CLAIM
      })) >= 1 || Math.count(_.filter(h.body, function(b){
        return b == WORK
      })) >= 3
    })
  }
}
