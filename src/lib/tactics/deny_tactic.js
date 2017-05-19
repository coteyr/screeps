/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-03-17 17:21:41
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-03-17 18:21:26
*/

'use strict';

class DenyTactic {
  static doAttack(creep, room) {
    if(!creep.pos.inRangeTo(room.controller.pos, 1)) creep.moveTo(room.controller.pos)
    creep.rangedMassAttack()
    creep.heal()
  }
}
