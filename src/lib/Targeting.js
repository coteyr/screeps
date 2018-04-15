/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-12 03:41:10
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-04-15 04:56:56
*/

'use strict';

class Targeting {
  static openSource(room) {
    let sources = Finder.sources(room)
    let result = null
    let least = 9000
    _.each(sources, s => { if(s.creepCount() <= least){
      let spots = Finder.spotsAroundTarget(s.id).length
      Log.debug(s.creepCount())
      if(s.creepCount() < spots){
        Log.debug(5)
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
    _.each(energies, e => { if(e.amount >= most && Finder.creepsWithTarget('source', e).length <= 0){
      result = e
      most = e.amount
    }})
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
    let result = pos.findClosestByRange(things)
    return result
  }
}
