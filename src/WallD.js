/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-10-28 15:34:21
*/

'use strict';

// [select -> travel -> fill -> choose -> position -> build]
//                                    |-> travel -> repair ]
let WallDCreep = function() {}
_.merge(WallDCreep.prototype, StateMachine.prototype, RecyclableCreep.prototype);


WallDCreep.prototype.tickCreep = function() {
  this.localState()
  this.checkState()
  this.recycleState()
}

WallDCreep.prototype.checkState = function() {
  this.kiteAttack()
  /*if(!this.state()) this.setState('select')
  if(this.stateIs('select')) this.setState('attack')
  if(this.stateIs('attack')) MilitaryActions.attack(this)*/
}



