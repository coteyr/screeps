/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 19:38:18
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-04 02:19:07
*/

'use strict';
let BuilderCreep = function() {}
BuilderCreep.prototype.superTick = function() {
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
      this.setTarget(_.first(Finder.findConstructionSites(this.room.name)))
    } else {
      if(this.build(this.target()) == ERR_NOT_IN_RANGE) {
        this.moveTo(this.target());
      }
    }
    if(this.isEmpty()) this.clearTarget()
  }
}
