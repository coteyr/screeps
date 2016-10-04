/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-10-03 22:55:25
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
  if(!this.state()) this.setState('rally')
  if(this.stateIs('select')) this.setState('attack')
  if(this.stateIs('attack')) MilitaryActions.attack(this)
}
