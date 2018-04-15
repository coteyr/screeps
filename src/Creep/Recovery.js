/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-12 21:02:38
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-04-14 22:23:22
*/

'use strict';

Creep.prototype.recoveryTick = function(){
  // The recovery creep is an odd ball it does everything depending on a
  // rather or not the room is running. When the room is not running it bootstraps
  // the rest of the time it runs around like an idiot, trying to help
  if(Math.count(Finder.miners(this.room)) < 1) {
    this.recoverTick()
  } else if(Math.count(Finder.haulers(this.room)) <= 1) {
    this.haulerTick()
  } else if(Math.count(Finder.buildSites(this.room)) > 0) {
    this.builderTick()
  } else {
    this.upgradeTick()
  }
}

Creep.prototype.recoverTick = function() {
  let energy = Targeting.unclaimedEnergy(this.room)
  if(energy) {
    this.haulerTick()
  } else  {
    if(this.hasTarget('mine')) {
      if(!this.isFull()) {
        this.mine(this.getTarget('mine'))
      } else {
        this.clearTarget('mine')
        this.haul()
      }
    } else {
      if(!this.setTarget('mine', Targeting.openSource(this.room))){
        Log.error("Failed to set mining Target!", this)
      }
    }
  }
}


