/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:48:53
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-10 23:06:50
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
    let most = 999
    _.each(energies, e =>{
      if(Finder.findCreepsWithTarget(e.id).length <= most) {
        most = Finder.findCreepsWithTarget(e.id).length
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
}
