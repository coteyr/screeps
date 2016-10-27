/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-10-25 15:58:05
*/

'use strict';

// [select -> travel -> fill -> choose -> position -> build]
//                                    |-> travel -> repair ]
let BuilderCreep = function() {}
_.merge(BuilderCreep.prototype, EnergyHaulingCreep.prototype, StateMachine.prototype, RecyclableCreep.prototype, LocalCreep.prototype);


BuilderCreep.prototype.tickCreep = function() {
  this.localState()
  this.energyState()
  this.checkState()
  this.recycleState()
}

BuilderCreep.prototype.checkState = function() {
  // if(!this.state()) this.setState('check-dropped')
  if(this.stateIs('mine')) Actions.mine(this, this.target(), 'choose', 'choose')
  if(this.stateIs('choose')) Actions.targetWithState(this, Targeting.findClosestConstruction(this.pos), 'travel', 'old')
  if(this.stateIs('travel')) Actions.moveToTarget(this, this.target(), 'build')
  if(this.stateIs('build')) Actions.build(this, this.target(), 'check-dropped', 'check-dropped')
}



