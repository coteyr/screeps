/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:37:33
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-14 21:46:43
*/

'use strict';

let MedicCreep = function() {}
MedicCreep.prototype.medic = function() {
  if(this.room.name === this.memory.targetRoom && this.pos.x > 1 && this.pos.y > 1) {
    let mostNeed = Scalar.smallest(_.filter(Game.creeps, c => c.room.name === this.room.name && c.hits < c.hitsMax), 'hits')
    if(mostNeed) {
      this.moveTo(mostNeed)
      this.heal(mostNeed)
    }
  } else {
    let pos = new RoomPosition(25, 25, this.memory.targetRoom)
    this.moveTo(pos)
  }
}




