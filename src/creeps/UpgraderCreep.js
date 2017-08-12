/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 19:38:18
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-07-03 15:52:19
*/

'use strict';
let UpgraderCreep = function() {}
UpgraderCreep.prototype.upgrade = function() {
  if(this.isEmpty()) {
    if(this.needsTarget()) {
      this.setTarget(Targeting.findExclusiveEnergy(this.room.name))
    } else {
      this.work(this.pickup, this.target(), Config.defaultRange)
    }
  } else {
    this.upgradeController()
  }
}


