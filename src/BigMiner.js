/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-28 02:56:12
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-09-23 13:04:56
*/

'use strict';
// select -> position -> [ mine -> dump ]


let BigMinerCreep = function() {}
_.merge(BigMinerCreep.prototype, StateMachine.prototype, RecyclableCreep.prototype, LocalCreep.prototype);

BigMinerCreep.prototype.tickCreep = function() {
  this.localState()
  this.checkState()
  this.recycleState()
}

BigMinerCreep.prototype.checkState = function() {
  if(!this.state()) this.setState('select')
  if(this.stateIs('select')) Actions.targetWithState(this, Finder.findLargestSource(this.room.name), 'position')
  if(this.stateIs('position')) Actions.moveToTarget(this, this.target(), 'mine')
  if(this.stateIs('mine')) Actions.mine(this, this.target())
  if(this.stateIs('dump')) Actions.dump(this, Targeting.findCloseContainer(this.pos, 1), Actions.chooseState(this, this.target().energy > 20 || this.target().ticksToRegeneration < 20, 'mine', 'select'))
}
