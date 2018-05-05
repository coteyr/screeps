/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-12 21:02:38
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-04-17 04:03:52
*/

'use strict';

Creep.prototype.recoveryTick = function(){
  // The recovery creep is an odd ball it does everything depending on a
  // rather or not the room is running. When the room is not running it bootstraps
  // the rest of the time it runs around like an idiot, trying to help
  if(this.travel()) {
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
}

Creep.prototype.recoverTick = function() {
  if(this.hasEnergy() && !this.getTarget('mine')) {
    if(Math.count(Finder.buildSites(this.room)) > 0 && Math.count(Finder.haulers(this.room)) > 0) {
      this.buildUp()
    } else if(Math.count(Finder.spawns(this.room)) <= 0) {
      this.buildUp()
    }else {
      this.haul()
    }
  } else {
    let energy = Targeting.unclaimedEnergy(this.room)
    if(energy) {
      this.haulerTick()
    } else  {
      if(this.hasTarget('mine')) {
        if(!this.isFull()) {
          this.mine(this.getTarget('mine'))
        } else {
          this.clearTarget('mine')
        }
      } else if(!this.isFull()) {
        if(!this.setTarget('mine', Targeting.openSource(this.room))){
          Log.error("Failed to set mining Target!", this)
        }
      }
    }
  }
}



