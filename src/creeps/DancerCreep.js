/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:37:33
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-15 03:58:06
*/

'use strict';

let DancerCreep = function() {}
AttackCreep.prototype.dancer = function() {
  if(this.room.name === this.memory.targetRoom) {
    this.rangedMassAttack()
  } else {
    let pos = new RoomPosition(25, 25, this.memory.targetRoom)
    this.moveTo(pos)
  }
}




