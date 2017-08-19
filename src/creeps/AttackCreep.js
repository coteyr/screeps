/*
* @Author: Robert D. Cotey II <coteyr@coteyr.net>
* @Date:   2017-02-03 18:37:33
* @Last Modified by:   Robert D. Cotey II <coteyr@coteyr.net>
* @Last Modified time: 2017-08-19 07:36:43
*/

'use strict';

let AttackCreep = function() {}
AttackCreep.prototype.attacker = function() {
  if(this.gotoTargetRoom()) {
    NormalTactic.doAttack(this,this.room)
  }
}




