/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-12 03:41:10
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-04-15 15:48:08
*/

'use strict';

class Targeting {
  static openSource(room) {
    let sources = Finder.sources(room)
    let result = null
    let least = 9000
    _.each(sources, s => { if(s.creepCount() <= least){
      let spots = Finder.spotsAroundTarget(s.id).length
      if(s.creepCount() < spots){
        least = s.creepCount();
        result = s
      }
    }})
    return result
  }
  static unclaimedEnergy(room) {
    let energies = Finder.energies(room)
    let result = null
    let most = 0
    _.each(energies, e => {
      if(e.amount && e.amount >= most && Finder.creepsWithTarget('source', e).length <= 0) {
        result = e
        most = e.amount
      } else if(e.store && e.store[RESOURCE_ENERGY] >= most){ //  && Finder.creepsWithTarget('source', e).length <= 0) {
        result = e
        most = e.store[RESOURCE_ENERGY]
      }
    })
    return result
  }
  static energyDump(room, pos) {
    let dumps = Finder.dumps(room)
    let result = pos.findClosestByRange(dumps)
    return result
  }
  static buildSite(room, pos) {
    let sites = Finder.buildSites(room)
    let result = pos.findClosestByRange(sites)
    return result
  }
  static findRepairTarget(room, pos) {
    let things = Finder.findInNeedOfRepair(room)
    return  pos.findClosestByRange(things)
  }
  static findNearestHostal(room, pos) {
    let hostals = Finder.hostals(room)
    return pos.findClosestByRange(hostals)
  }
  static wallNeedingBoost(room, pos) {
    let walls = Finder.wallsNeedingBuildUp(room)
    return pos.findClosestByRange(walls)
  }
}
