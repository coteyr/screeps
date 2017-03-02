/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:37:33
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-02-27 18:33:21
*/

'use strict';

let ClaimCreep = function() {}
ClaimCreep.prototype.superTick = function() {
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
