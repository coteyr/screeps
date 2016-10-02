/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-28 02:56:12
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-09-28 19:50:28
*/

'use strict';

let ExcavatorCreep = function() {}
_.merge(ExcavatorCreep.prototype, StateMachine.prototype, RecyclableCreep.prototype, LocalCreep.prototype);


ExcavatorCreep.prototype.tickCreep = function() {
  this.localState()
  this.checkState()
  this.recycleState()
}

ExcavatorCreep.prototype.checkState = function() {
  if(!this.state()) this.setState('find')
  if(this.stateIs('find')) Actions.targetWithState(this, Finder.findMineral(this.room.name), 'travel')
  if(this.stateIs('travel')) Actions.moveToTarget(this, this.target(), 'excavate', 1, 'find')
  if(this.stateIs('excavate')) Actions.excavate(this, this.target(), 'dump')
  if(this.stateIs('dump')) Actions.targetWithState(this, Targeting.findClosestContainer(this.pos, this.room), 'move', 'find')
  if(this.stateIs('move')) Actions.moveToTarget(this, this.target(), 'stash', 1, 'stash')
  if(this.stateIs('stash')) Actions.dump(this, this.target(), 'find', 'find')
}
