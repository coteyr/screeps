/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-28 10:23:42
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-09-28 19:48:42
*/

'use strict';

// [check-dropped -> select -> position -> fill -> choose -> travel -> dump] -> recycle
//               |->        goto -> pickup      ->|

let CarrierCreep = function() {}
_.merge(CarrierCreep.prototype, EnergyHaulingCreep.prototype, StateMachine.prototype, RecyclableCreep.prototype, LocalCreep.prototype);


CarrierCreep.prototype.tickCreep = function() {
  this.localState()
  this.energyState()
  this.checkState()
  this.recycleState()
}

CarrierCreep.prototype.checkState = function() {
  if(!this.state()) this.setState('check-dropped')
  if(this.stateIs('choose')) Actions.targetWithState(this, Targeting.getTransferTarget(this.pos, this.room), 'travel')
  if(this.stateIs('travel')) Actions.moveToTarget(this, this.target(), 'dump', 1, 'check-dropped')
  if(this.stateIs('dump')) Actions.dump(this, this.target(), 'check-dropped', 'choose')
}


