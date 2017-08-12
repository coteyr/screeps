/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 19:38:18
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-07-07 04:19:16
*/

'use strict';
let HaulerCreep = function() {}
//_.merge(HaulerCreep.prototype, EnergyCollectingCreep.prototype)

HaulerCreep.prototype.haul = function() {
  if(this.needEnergy()) {
    if(this.hasTarget()) {
        this.pickup(this.target())
      } else {
        this.setTarget(Targeting.findExclusiveEnergy(this.room.name))
      }
  } else {

      if(this.needsTarget('drop')) this.setTarget(Targeting.findClosestEnergyStoreInNeed(this.pos), 'drop') // this.setTarget(Finder.findEnergyStoreInNeed(this.room.name))
      if(this.hasTarget('drop')) {
        this.transfer(this.target('drop'))
        if(this.target('drop').isFull()) this.clearTarget('drop')
      }
      if(this.isEmpty()) this.clearTarget('drop')
  }
}




