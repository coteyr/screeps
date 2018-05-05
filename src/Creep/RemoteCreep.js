/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2018-04-15 19:25:33
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2018-04-15 19:31:00
*/

'use strict';

Creep.prototype.travel = function() {
  if(this.room.name === this.memory.dest) {
    return true
  } else {
    let dest = new RoomPosition(25, 25, this.memory.dest)
    this.moveTo(dest)
    return false
  }
}
