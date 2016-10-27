/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-06-26 20:09:07
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-10-25 01:20:36
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
  if(!this.state()) this.setState('travel')
  if(this.stateIs('travel')) Actions.dispurse(this, 'travel')
}



