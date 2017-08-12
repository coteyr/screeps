/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:37:33
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-06 21:43:54
*/

'use strict';

let ClaimerCreep = function() {}
ClaimerCreep.prototype.superTick = function() {
  if(this.room.name !== this.memory.targetRoom) {
    let pos = new RoomPosition(25, 25, this.memory.targetRoom)
    this.moveTo(pos)
  }
  if(this.room.name === this.memory.targetRoom) {
    if(this.room.controller) {
      if(this.claimController(this.room.controller) == ERR_NOT_IN_RANGE) {
        this.moveTo(this.room.controller);
      }
    }
  }
}
ClaimerCreep.prototype.claimer = function() {
  if(this.room.name === this.memory.target) {
    this.claimController();
    // claim controller
  } else {
    let pos = new RoomPosition(25, 25, this.memory.target)
    this.moveTo(pos)
  }
}
