/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-12 04:09:34
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-04-12 04:27:50
*/

'use strict';
Creep.prototype.upgradeTick = function() {
  if(this.hasEnergy()) {
    this.upgrade()
  } else {
    if(this.hasTarget('energy')) {
      this.grab(this.getTarget('energy'))
    } else {
      if(!this.setTarget('energy', Targeting.unclaimedEnergy(this.room))) {
        Log.error("Failed to set energy Target!", this)
      }
    }
  }
}

Creep.prototype.upgrade = function(){
  this.work(this.upgradeController, this.room.controller, 3)
}
