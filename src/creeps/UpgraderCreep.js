/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 19:38:18
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-05-23 14:59:36
*/

'use strict';
let UpgraderCreep = function() {}
UpgraderCreep.prototype.superTick = function() {
  if(this.isEmpty()) {
    if(this.needsTarget()) {
      this.setTarget(Targeting.findExclusiveEnergy(this.room.name))
      if(this.needsTarget()) this.setTask("idle")
    } else {
      this.work(this.pickup, this.target(), Config.upgradeRange)
    }
  } else {
    this.work(this.upgradeController, this.room.controller, Config.upgradeRange)
    /*if(this.upgradeController(this.room.controller) == ERR_NOT_IN_RANGE) {
        this.goTo(this.room.controller);
    }*/
  }

}
