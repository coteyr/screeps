/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-12 21:02:38
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-05-21 12:44:34
*/

'use strict';

Creep.prototype.recoveryTick = function(){
  // The recovery creep is an odd ball it does everything depending on a
  // rather or not the room is running. When the room is not running it bootstraps
  // the rest of the time it runs around like an idiot, trying to help
  if(this.travel()) {
    if(Maths.count(Finder.miners(this.room)) < 1) {
      this.recoverTick()
    } else if(Maths.count(Finder.haulers(this.room)) <= 1) {
      this.clearTarget('mine')
      this.haulerTick()
    } else if(Maths.count(Finder.buildSites(this.room)) > 0) {
      this.builderTick()
    } else {
      this.upgradeTick()
    }
  }
}

Creep.prototype.recoverTick = function() {
  if(this.hasEnergy() && !this.getTarget('mine')) {
    if(Maths.count(Finder.buildSites(this.room)) > 0 && Maths.count(Finder.haulers(this.room)) > 1) {
      this.buildUp()
    } else if(Maths.count(Finder.spawns(this.room)) <= 0) {
      this.buildUp()
    } else {
      this.clearTarget('mine')
      this.haul()
    }
  } else {
    let energy = Targeting.unclaimedEnergy(this.room)
    if(energy) {
      this.haulerTick()
    } else  {
      if(this.hasTarget('mine')) {
        if(!this.isFull()) {
          this.work(this.harvest, this.getTarget('mine'), 1)
        } else {
          this.clearTarget('mine')
        }
      } else if(!this.isFull()) {
        if(!this.setTarget('mine', Targeting.openSource(this.room))){
          Visualizer.circle(this, Config.colors.red)
        }
      }
    }
  }
}



