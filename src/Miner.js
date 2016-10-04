/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-28 02:56:12
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-10-03 19:03:59
*/

'use strict';

// Target -> Position -> [Mine -> Dump -> Mine] -> Recycle

let MinerCreep = function(){}
_.merge(MinerCreep.prototype, StateMachine.prototype, RecyclableCreep.prototype);

MinerCreep.prototype.tickCreep = function() {
  this.checkState()
  this.recycleState()
}

MinerCreep.prototype.checkState = function() {
  if(!this.state()) this.setState('target')
  if(this.stateIs('target')) Actions.targetWithState(this, Finder.findSourcePosition(this.room.name, this.memory.role), 'position')
  if(this.stateIs('position')) Actions.moveToTarget(this, this.target(), 'mine')
  if(this.stateIs('mine')) Actions.mine(this, this.target(), 'dump')
  if(this.stateIs('dump')) Actions.dump(this, Targeting.findCloseContainer(this.pos, 1), 'mine')
}


