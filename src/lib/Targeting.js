/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-12 03:41:10
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-07-03 02:11:18
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
  static aLink(room, pos) {
    if(!room.storage) return null
    let links = Finder.links(room)
    let result = null
    _.each(links, l => {
      if(l.pos.inRangeTo(room.storage, 4)) {
        result = l
      }
    })
    return result
  }
  static closeLink(room, pos) {
    let links = Finder.links(room)
    let result = null
    _.each(links, l => {
      if(pos.isNearTo(l)) {
        result = l
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
    let result = null
    let most = 0.0
    _.each(sites, site => {
      if (site.compleation() >= most) {
        most = site.compleation()
        result = site
      }
    })
    if(result) return result
    Log.debug('no current sites, using pos')
    result = pos.findClosestByRange(sites)
    return result
  }
  static findRepairTarget(room, pos) {
    let things = Finder.findInNeedOfRepair(room)
    return  pos.findClosestByRange(things)
  }
  static findHealTarget(room, pos) {
    let defenders = _.filter(Finder.defender(room), function(d){
      return d.hits < d.hitsMax
    })
    if(Maths.count(defenders) > 0) return pos.findClosestByRange(defenders)
    let creeps = _.filter(Finder.creep(room), function(c){
      return c.hits < c.hitsMax
    })
    if(Maths.count(creeps) > 0) return pos.findClosestByRange(creeps)
    return null
  }
  static findNearestHostal(room, pos, all = false) {
    let hostals = Finder.hostals(room, all)
    return pos.findClosestByRange(hostals)
  }
  static wallNeedingBoost(room, pos) {
    let walls = Finder.wallsNeedingBuildUp(room)
    return pos.findClosestByRange(walls)
  }
}
