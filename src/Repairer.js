/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-10-27 19:02:31
*/

'use strict';

// [select -> travel -> fill -> choose -> position -> build]
//                                    |-> travel -> repair ]
let RepairerCreep = function() {}
_.merge(RepairerCreep.prototype, EnergyHaulingCreep.prototype, StateMachine.prototype, RecyclableCreep.prototype, LocalCreep.prototype);


RepairerCreep.prototype.tickCreep = function() {
  this.localState()
  this.energyState()
  this.checkState()
  this.recycleState()
}

RepairerCreep.prototype.checkState = function() {
  if(!this.state()) this.setState('check-dropped')
  if(this.stateIs('mine'))   Actions.mine(this, this.target(), 'choose', 'choose')
  if(this.stateIs('choose')) Actions.targetWithState(this, Targeting.findClosestRepairTarget(this.pos, this.room), 'travel', 'check-dropped')
  if(this.stateIs('travel')) Actions.moveToTarget(this, this.target(), 'repair', 3)
  if(this.stateIs('repair')) Actions.repair(this, this.target(), 'check-dropped', 'check-dropped')
}

