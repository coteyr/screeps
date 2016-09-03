/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-08-30 17:05:51
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-08-31 07:08:32
*/

'use strict';

let LocalCreep = function(){}


// go-home -> ...
LocalCreep.prototype.localState = function() {
  if(this.room.name != this.memory.home) {
    this.setState('go-home')
  }
  if(this.stateIs('go-home')){
    this.gotoRoom(this.memory.home)
    if(this.room.name == this.memory.home) delete this.memory.state
  }
}


RecyclableCreep.prototype.isTooOld = function() {
  return this.ticksToLive < LOCAL_RECYCLE_AGE
}
