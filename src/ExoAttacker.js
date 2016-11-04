/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-11-03 06:59:45
*/

'use strict';

let ExoAttacker = function() {}
_.merge(ExoAttacker.prototype, StateMachine.prototype, RecyclableCreep.prototype, RemoteCreep.prototype)

ExoAttacker.prototype.tickCreep = function() {
  this.remoteState(true)
  this.checkState()
  this.recycleState()
}

ExoAttacker.prototype.checkState = function() {
  if(this.room.name !== this.memory.exo_target) this.setState('rally')
  if(!this.state()) this.setState('rally')
  if(this.stateIs('choose')) this.setState('attack')
  if(this.stateIs('attack')) MilitaryActions.attack(this)
}
