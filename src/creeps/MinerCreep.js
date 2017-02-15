/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:37:15
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-13 11:44:47
*/

'use strict';
let MinerCreep = function() {}
MinerCreep.prototype.superTick = function() {
    if(this.hasTarget()) {
      this.harvestTarget();
    } else {
      this.setTarget(Targeting.findOpenSourceSpot(this.room.name))
    }
}
MinerCreep.prototype.harvestTarget = function() {
  let result = this.harvest(this.target())
  if(result === ERR_NOT_IN_RANGE) {
    this.goTo(this.target());
  } else if (result === ERR_NOT_ENOUGH_RESOURCES) {
    this.clearTarget()
  }
  this.drop(RESOURCE_ENERGY)
}

