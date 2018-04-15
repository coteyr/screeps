/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-13 00:21:44
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-04-13 00:29:37
*/

'use strict';

Creep.prototype.builderTick = function() {
  if(this.hasEnergy()) {
    this.clearTarget('source')
    this.buildUp()
  } else {
    if(this.hasTarget('source')) {
      this.grab(this.getTarget('source'))
    } else {
      if(!this.setTarget('source', Targeting.unclaimedEnergy(this.room))) {
        Log.error("Failed to set source energy Target!", this)
      }
    }
  }
}

Creep.prototype.buildUp = function() {
  if(this.hasTarget('build')) {
    this.work(this.build, this.getTarget('build'), 2)
  } else {
    if(!this.setTarget('build', Targeting.buildSite(this.room, this.pos))) {
      Log.error('Could not set build location', this)
    }
  }
}
