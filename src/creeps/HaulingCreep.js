/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 19:38:18
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-05 14:14:37
*/

'use strict';
let HaulingCreep = function() {}
HaulingCreep.prototype.superTick = function() {
  if(this.isEmpty()) {
    if(this.needsTarget()) {
      this.setTarget(Targeting.findExclusiveEnergy(this.room.name))
    } else {
      if(this.pickup(this.target()) == ERR_NOT_IN_RANGE) {
        this.moveTo(this.target())
      } else {
        this.clearTarget()
      }
    }
  } else {
    if(this.needsTarget()) {
      this.setTarget(Finder.findEnergyStoreInNeed(this.room.name))
      if(this.needsTarget()) this.setTask('idle')
    } else {
      if(this.transfer(this.target(), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(this.target());
      }
    }
    if(this.isEmpty()) this.clearTarget()
    if(this.target() && this.target().isFull()) this.clearTarget()
  }
}
