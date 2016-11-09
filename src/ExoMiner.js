/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-11-08 14:24:02
*/

'use strict';

let ExoMiner = function() {}
_.merge(ExoMiner.prototype, StateMachine.prototype, RecyclableCreep.prototype, RemoteCreep.prototype)

ExoMiner.prototype.tickCreep = function() {
  this.remoteState()
  this.checkState()
  this.recycleState()
}

ExoMiner.prototype.checkState = function() {
  if(!this.state()) this.setState('r-move-out')
  if(this.room.name !== this.memory.exo_target) this.setState('r-move-out')
  if(this.stateIs('location')) Actions.targetWithState(this, Targeting.findEnergySource(this.pos, this.room, this.memory.role), 'e-position', 'location')
  if(this.stateIs('e-position')) Actions.moveToTarget(this, this.target(), 'mine')
  if(this.stateIs('mine')) Actions.mine(this, this.target(), 'drop', 'drop')
  if(this.stateIs('drop')) Actions.dump(this, this.target(), 'mine', 'mine')
}



