/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 19:38:18
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-13 11:45:16
*/

'use strict';
let UpgraderCreep = function() {}
UpgraderCreep.prototype.superTick = function() {
  if(this.isEmpty()) {
    if(this.needsTarget()) {
      this.setTarget(Targeting.findExclusiveEnergy(this.room.name))
    } else {
      if(this.pickup(this.target()) == ERR_NOT_IN_RANGE) {
        this.goTo(this.target())
      } else {
        this.clearTarget()
      }
    }
  } else {
    if(this.upgradeController(this.room.controller) == ERR_NOT_IN_RANGE) {
        this.goTo(this.room.controller);
    }
  }

}
