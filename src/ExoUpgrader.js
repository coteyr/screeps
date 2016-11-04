/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-10-29 22:11:51
*/

'use strict';

let ExoUpgrader = function() {}
_.merge(ExoUpgrader.prototype, StateMachine.prototype, RecyclableCreep.prototype, RemoteCreep.prototype, EnergyHaulingCreep.prototype)

ExoUpgrader.prototype.tickCreep = function() {
  this.remoteState()
  this.energyState()
  this.checkState()
  this.recycleState()
}

ExoUpgrader.prototype.checkState = function() {
  if(!this.state()) this.setState('r-move-out')
  if(this.room.name !== this.memory.exo_target) this.setState('r-move-out')
  if(this.stateIs('mine'))    Actions.mine(this, this.target(), 'choose', 'choose')
  if(this.stateIs('choose'))  Actions.targetWithState(this, this.room.controller, 'a-travel', 'old')
  if(this.stateIs('a-travel'))  Actions.moveToTarget(this, this.target(), 'upgrade', 3)
  if(this.stateIs('upgrade')) Actions.upgrade(this, 'check-dropped')
}

