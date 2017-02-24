/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:48:53
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-21 16:32:45
*/

'use strict';

class Targeting {
  static findOpenSourceSpot(roomName) {
    let sources = Finder.findSources(roomName)
    let result = null
    let least = 9000
    _.each(sources, s => { if(s.creepCount() <= least){
      let spots = Finder.findSpotsAroundTarget(s.id).length
      if(s.creepCount() < spots){
        least = s.creepCount();
        result = s
      }
    }})
    return result
  }
  static findExclusiveEnergy(roomName) {
    let energies = Finder.findDroppedEnergy(roomName)
    let biggest = 0
    let result = null
    let most = 99999
     _.each(energies, e =>{
      if(Finder.findCreepsWithTarget(e.id).length <= most) {
        most = Finder.findCreepsWithTarget(e.id).length
        if(e.store && e.store[RESOURCE_ENERGY] > biggest) {
          biggest = e.store[RESOURCE_ENERGY]
          result = e
        }
        if(e.amount > biggest) {
          biggest = e.amount
          result = e
        }
      }
    })
    return result
  }
  static findNearestTarget(pos) {
    return pos.findClosestByRange(FIND_HOSTILE_CREEPS)
  }
  static findClosestEnergyStoreInNeed(pos) {
    let storages = Finder.findEnergyStoreInNeed(pos.roomName)
    return pos.findClosestByRange(storages)
  }
  static findAttackTarget(pos) {
    let room = Game.rooms[pos.roomName]
    let creep = Targeting.findNearestTarget(pos)
    if(!_.isNull(creep)) return creep
    let towers = _.filter(Finder.findObjects(pos.roomName, FIND_STRUCTURES), s => { return s.structureType === STRUCTURE_TOWER && s.my === false })
    if(towers.length > 0) return pos.findClosestByRange(towers)
  }
  static findRepairTarget(pos) {
    Log.info(JSON.stringify(pos))
    let room = Game.rooms[pos.roomName]
    let targets = _.filter(Finder.findObjects(pos.roomName, FIND_STRUCTURES), s => { return s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART})
    Log.error(targets.length)
    return pos.findClosestByRange(targets)
  }
}
