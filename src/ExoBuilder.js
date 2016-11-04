/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-10-30 03:48:07
*/

'use strict';

let ExoBuilder = function() {}
_.merge(ExoBuilder.prototype, StateMachine.prototype, RecyclableCreep.prototype, RemoteCreep.prototype, EnergyHaulingCreep.prototype)

ExoBuilder.prototype.tickCreep = function() {
  this.energyState()
  this.remoteState()

  this.checkState()
  this.recycleState()
}

ExoBuilder.prototype.checkState = function() {
  if(!this.state()) this.setState('r-move-out')
  if(this.room.name !== this.memory.exo_target) this.setState('r-move-out')
  if(this.stateIs('mine')) Actions.mine(this, this.target(), 'choose', 'choose')
  if(this.stateIs('choose')) Actions.targetWithState(this, Targeting.findClosestConstruction(this.pos), 'travel', 'old')
  if(this.stateIs('travel')) Actions.moveToTarget(this, this.target(), 'build')
  if(this.stateIs('build')) Actions.build(this, this.target(), 'check-dropped', 'check-dropped')
}

