/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-15 15:31:24
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-05-06 16:51:45
*/

'use strict';

Creep.prototype.wallerTick = function() {
  if(this.hasEnergy()) {
    this.clearTarget('source')
    this.wallUp()
  } else {
    this.clearTarget('wall')
    if(this.hasTarget('source')) {
      this.grab(this.getTarget('source'))
    } else {
      if(!this.setTarget('source', Targeting.unclaimedEnergy(this.room))) {
        Visualizer.circle(this, Config.colors.yellow)
        this.move(Maths.randomDirection())
      }
    }
  }
}

Creep.prototype.wallUp = function() {
  if(this.hasTarget('wall')) {
    this.work(this.repair, this.getTarget('wall'), 3)
  } else {
    this.setTarget('wall', Targeting.wallNeedingBoost(this.room, this.pos))
  }
}
