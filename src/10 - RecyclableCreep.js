/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-08-30 17:05:51
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-10-30 03:38:06
*/

'use strict';

let RecyclableCreep = function(){}


// Old -> Retire -> Suicide
RecyclableCreep.prototype.recycleState = function() {
  if(this.isTooOld()) this.setState('old')
  if(this.stateIs('old')) {
    this.spout('\u267B')
    this.clearTarget()
    if(this.room.name === this.memory.home) {
      this.setTarget(Finder.findSpawn(this.room.name))
      if(this.hasTarget()) this.setState('retire')
    } else {
      MilitaryActions.moveOut(this, this.memory.home, 'old', 'old')
    }
  }
  if(this.stateIs('retire')) {
    var target = this.target()
    if(this.moveCloseTo(target.pos.x, target.pos.y, 1)) this.setState('suicide')
  }
  if(this.stateIs('suicide')) this.suicide()
}


RecyclableCreep.prototype.isTooOld = function() {
  return this.memory.exo_target === this.memory.home && this.ticksToLive < (LOCAL_RECYCLE_AGE / 2)
  return this.memory.exo_target !== this.memory.home && this.room.name === this.memory.home && this.ticksToLive < (REMOTE_RECYCLE_AGE)
}
