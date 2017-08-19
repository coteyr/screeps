/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:37:33
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-15 10:24:18
*/

'use strict';

let GaurdCreep = function() {}
GaurdCreep.prototype.gaurd = function() {
  if(this.room.name === this.memory.targetRoom) {
    // attack
    GuardTactic.doAttack(this,this.room)

  } else {
    let pos = new RoomPosition(25, 25, this.memory.targetRoom)
    this.moveTo(pos)
  }
}




