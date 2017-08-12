/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:37:33
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-08 10:52:35
*/

'use strict';

let AttackCreep = function() {}
AttackCreep.prototype.attacker = function() {
  if(this.room.name === this.memory.targetRoom && this.pos.x > 1 && this.pos.y > 1) {
    NormalTactic.doAttack(this,this.room)
  } else {
    let pos = new RoomPosition(25, 25, this.memory.targetRoom)
    this.moveTo(pos)
  }
}




