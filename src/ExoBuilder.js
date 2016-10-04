/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-10-03 23:19:53
*/

'use strict';

let ExoBuilder = function() {}
_.merge(ExoBuilder.prototype, StateMachine.prototype, RecyclableCreep.prototype, RemoteCreep.prototype)

ExoBuilder.prototype.tickCreep = function() {
  this.remoteState()
  this.checkState()
  this.recycleState()
}

ExoBuilder.prototype.checkState = function() {
  if(!this.state()) this.setState('r-move-out')
  if(this.stateIs('select')) Actions.targetWithState(this, Finder.findSourcePosition(this.room.name, this.memory.role), 'position')
  if(this.stateIs('position')) Actions.moveToTarget(this, this.target(), 'mine')
  if(this.stateIs('mine')) Actions.mine(this, this.target(), 'choose', 'choose')
  if(this.stateIs('choose')) Actions.targetWithState(this, Targeting.findClosestConstruction(this.pos), 'travel', 'old')
  if(this.stateIs('travel')) Actions.moveToTarget(this, this.target(), 'build')
  if(this.stateIs('build')) Actions.build(this, this.target(), 'select', 'select')
}

