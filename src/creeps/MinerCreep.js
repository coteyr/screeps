/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:37:15
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-03 19:07:18
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
  if(this.harvest(this.target()) == ERR_NOT_IN_RANGE) {
    this.moveTo(this.target());
  }
}

