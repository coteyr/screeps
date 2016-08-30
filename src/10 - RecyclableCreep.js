/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-08-30 17:05:51
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-30 18:32:41
*/

'use strict';

let RecyclableCreep = function(){}


// Old -> Retire -> Suicide
RecyclableCreep.prototype.recycleState = function() {
  if(this.isTooOld()) this.setState('old')
  if(this.stateIs('old')) {
    this.clearTarget()
    this.setTarget(Targeting.findClosestContainer(this.pos, this.room))
    if(this.hasTarget()) this.setState('retire')
  }
  if(this.stateIs('retire')) {
    var target = this.target()
    if(this.moveCloseTo(target.x, target.y, 0)) this.setState('suicide')
  }
  if(this.stateIs('suicide')) this.suicide()
}


RecyclableCreep.prototype.isTooOld = function() {
  return this.ticksToLive < LOCAL_RECYCLE_AGE
}
