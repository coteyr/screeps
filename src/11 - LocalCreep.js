/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2016-08-30 17:05:51
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2016-11-07 15:36:14
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
  if(this.pos.x === 49 || this.pos.y === 49 || this.pos.x === 0 || this.pos.y === 0) this.moveTo(25, 25)
}


RecyclableCreep.prototype.isTooOld = function() {
  return this.ticksToLive < LOCAL_RECYCLE_AGE
}
