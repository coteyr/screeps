/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:48:53
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-08 10:39:56
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
    let energies = Finder.findEnergy(roomName)
    // Log.warn(energies.length)
    let result = Scalar.largest(energies, 'energyAmount()')
    /*let biggest = 0
    let result = null
    let most = 99999
     (_.each(energies, e =>{
      if(e && e.id && Finder.findCreepsWithTarget(e.id).length <= 1) {
        most = Finder.findCreepsWithTarget(e.id).length
        if(e.store && e.store[RESOURCE_ENERGY] > biggest) {
          biggest = e.store[RESOURCE_ENERGY]
          result = e
        }
        if(e.amount > biggest) {
          biggest = e.amount
          result = e
        }
        if(e.isFull && e.isFull()) {
          result = e
        }
      }
    })*/
    return result
  }
  static findNearestTarget(pos) {
    return pos.findClosestByRange(FIND_HOSTILE_CREEPS)
  }
  static findClosestEnergyStoreInNeed(pos) {
    let storages = Finder.findEnergyStoreInNeed(pos.roomName)
    return pos.findClosestByRange(storages)
  }
  static findCloseEmptyExtension(pos) {
    let extensions = _.filter(pos.findInRange(FIND_STRUCTURES, 1), s => {return s.structureType == STRUCTURE_EXTENSION})
    if(extensions.length > 0) return extensions[0]
  }
  static findAttackTarget(pos) {
    let room = Game.rooms[pos.roomName]
    let creep = Targeting.findNearestTarget(pos)
    if(!_.isNull(creep)) return creep
    let towers = _.filter(Finder.findObjects(pos.roomName, FIND_STRUCTURES), s => { return s.structureType === STRUCTURE_TOWER && s.my === false })
    if(towers.length > 0) return pos.findClosestByRange(towers)
    let spawns = _.filter(Finder.findObjects(pos.roomName, FIND_STRUCTURES), s => { return s.structureType === STRUCTURE_SPAWN && s.my === false })
    if(spawns.length > 0) return pos.findClosestByRange(spawns)
    return pos.findClosestByRange(_.filter(Finder.findObjects(pos.roomName, FIND_HOSTILE_STRUCTURES), s => { return s.structureType != STRUCTURE_CONTROLLER }))

  }
  static findRepairTarget(pos) {
    Log.info(JSON.stringify(pos))
    let room = Game.rooms[pos.roomName]
    let targets = _.filter(Finder.findObjects(pos.roomName, FIND_STRUCTURES), s => { return s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART})
    Log.error(targets.length)
    return pos.findClosestByRange(targets)
  }
}
